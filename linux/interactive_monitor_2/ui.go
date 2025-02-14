package main

import (
	"fmt"
	"strconv"
	"syscall"
	"time"

	"github.com/charmbracelet/bubbles/table"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

var baseStyle = lipgloss.NewStyle().
	BorderStyle(lipgloss.NormalBorder()).
	BorderForeground(lipgloss.Color("240"))

type model struct {
	table     table.Model
	proc_rows []table.Row
	status    string

	proc_map      map[int]*proc_info
	parent_map    map[int][]int
	allowed_procs map[int]bool
	autostop      bool
}

type TickMsg time.Time

func proc_tick() tea.Cmd {
	return tea.Tick(time.Millisecond*1000, func(t time.Time) tea.Msg {
		return TickMsg(t)
	})
}

func (m model) Init() tea.Cmd {
	return proc_tick()
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	var cmd tea.Cmd
	switch msg := msg.(type) {
	case TickMsg:
		m.proc_map = scan_procs()
		m.parent_map = parent_pid(m.proc_map)
		procs := get_valid_procs(m.proc_map, m.parent_map)
		if m.table.Cursor() >= len(procs) {
			m.table.GotoTop()
		}
		m.proc_rows = m.proc_rows[:0]

		for _, proc := range procs {
			allowed, ok := m.allowed_procs[proc.Pid]
			if !ok {
				// TODO: don't do this is this process is a child of it
				allowed = !m.autostop
			}

			if !allowed {
				signal_all_descendants(proc.Pid, m.parent_map, syscall.SIGSTOP)
			}

			m.proc_rows = append(m.proc_rows, proc_row(proc.State, proc.Pid, proc.GetTTYDeviceNums(), proc.Comm))
		}
		m.table.SetRows(m.proc_rows)
		return m, proc_tick()
	case tea.KeyMsg:
		row := m.table.SelectedRow()
		pid, _ := strconv.Atoi(row[1])
		var err error

		switch msg.String() {
		case "esc":
			if m.table.Focused() {
				m.table.Blur()
			} else {
				m.table.Focus()
			}
		case "q", "ctrl+c":
			return m, tea.Quit
		case "k":
			err = signal_all_descendants(pid, m.parent_map, syscall.SIGKILL)
			if err != nil {
				m.status = err.Error()
			}
		case "p":
			if row[0] == "T" {
				err = signal_all_descendants(pid, m.parent_map, syscall.SIGCONT)
			} else {
				err = signal_all_descendants(pid, m.parent_map, syscall.SIGSTOP)
			}
			if err != nil {
				m.status = err.Error()
			}
		case "a":
			m.autostop = !m.autostop
		}
	}
	m.table, cmd = m.table.Update(msg)
	return m, cmd
}

func (m model) View() string {
	m.table.SetRows(m.proc_rows)
	autostop_indicator := "Not pausing automatically\n"
	if m.autostop {
		autostop_indicator = "Stopping new processes automatically\n"
	}
	return autostop_indicator + baseStyle.Render(m.table.View()) + "\n" + m.status + "\nUp/Down to select, [k] to kill selected process, [p] to stop/continue selected process, [a] to toggle autostop"
}

func proc_row(state string, pid int, dev DeviceNumber, name string) table.Row {
	pretty_dev := ""
	if dev.Major != 0 && dev.Minor != 0 {
		switch dev.Major {
		case 136:
			pretty_dev = fmt.Sprintf("pts/%d", dev.Minor)
		case 4:
			pretty_dev = fmt.Sprintf("tty%d", dev.Minor)
		default:
			pretty_dev = fmt.Sprintf("%d/%d", dev.Major, dev.Minor)
		}
	}
	return table.Row{state, strconv.Itoa(pid), pretty_dev, name}
}
