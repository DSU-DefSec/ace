package main

import (
	"fmt"
	"os"

	"github.com/charmbracelet/bubbles/table"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

func main() {
	columns := []table.Column{
		{Title: "", Width: 1},
		{Title: "PID", Width: 8},
		{Title: "Device", Width: 6},
		{Title: "Name", Width: 20},
	}

	t := table.New(
		table.WithColumns(columns),
		// table.WithRows(rows),
		table.WithFocused(true),
		// table.WithWidth(64),
		table.WithHeight(7),
	)

	t.KeyMap.LineUp.SetKeys("up")
	t.KeyMap.LineDown.SetKeys("down")

	s := table.DefaultStyles()
	s.Header = s.Header.
		BorderStyle(lipgloss.NormalBorder()).
		BorderForeground(lipgloss.Color("240")).
		BorderBottom(true).
		Bold(false)
	s.Selected = s.Selected.
		Foreground(lipgloss.Color("229")).
		Background(lipgloss.Color("57")).
		Bold(false)
	t.SetStyles(s)

	m := model{
		table:     t,
		proc_rows: make([]table.Row, 0, 1024),
	}

	if _, err := tea.NewProgram(m).Run(); err != nil {
		fmt.Println("Error running program:", err)
		os.Exit(1)
	}
}
