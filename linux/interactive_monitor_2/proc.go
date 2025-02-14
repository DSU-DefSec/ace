package main

import (
	"bytes"
	"fmt"
	"log"
	"os"
	"slices"
	"sort"
	"strconv"
	"syscall"
)

var proc_status_map = map[string]string{
	"R": "Running",
	"S": "Sleeping in an interruptible wait",
	"D": "Waiting in uninterruptible disk sleep",
	"Z": "Zombie",
	"T": "Stopped on a signal",
	"t": "Tracing stop",
	"X": "Dead",
	"x": "Dead",
	"K": "Wakekill",
	"W": "Waking",
	"P": "Parked",
	"I": "Idle",
}

type proc_info struct {
	*ProcStat
	fd_info map[int]FDInfo
	args    []string
}

func get_proc_info(pid int) (ret *proc_info, err error) {
	ret = &proc_info{}
	ret.ProcStat, err = stat_proc_pid(pid)
	if err != nil {
		return
	}

	args_bytes, err := os.ReadFile(fmt.Sprintf("/proc/%d/cmdline", pid))
	if err != nil {
		return
	}

	args_bytes_split := bytes.Split(args_bytes, []byte{0})
	ret.args = make([]string, len(args_bytes_split))
	for i, arg := range args_bytes_split {
		ret.args[i] = string(arg)
	}

	ret.fd_info, err = readFDInfo(pid)
	if err != nil {
		return
	}

	// fmt.Println(ret.Comm)
	return
}

func (p *proc_info) String() string {
	return fmt.Sprintf("[%d] %s", p.Pid, p.Comm)
}

func scan_procs() map[int]*proc_info {
	ret := map[int]*proc_info{}
	processes, err := os.ReadDir("/proc")
	if err != nil {
		log.Fatalf("Unable to read /proc: %s", err.Error())
	}

	for _, process := range processes {
		// procPath := "/proc" + procEntry.Name()
		proc_name := process.Name()
		pid, err := strconv.Atoi(proc_name)
		if err != nil {
			// fmt.Fprintf(os.Stderr, "Invalid /proc entry: '%s' (%s)\n", procEntry.Name(), err.Error())
			continue
		}
		proc, err := get_proc_info(pid)
		// if err != nil {
		// 	// fmt.Fprintln(os.Stderr, err)
		// 	continue
		// }

		ret[pid] = proc
		// parent_pid[pid]

		// dev := proc.GetTTYDeviceNums()

		// if proc.Tty_nr != 0 || (proc.fd_info[0].ino == proc.fd_info[1].ino && proc.fd_info[0].ino == proc.fd_info[2].ino) {
		// 	rows = append(rows, proc_row(proc.State, pid, dev, proc.Comm))
		// }
	}
	return ret
}

func parent_pid(procs map[int]*proc_info) map[int][]int {
	ret := map[int][]int{}
	for pid, proc := range procs {
		ret[proc.Ppid] = append(ret[proc.Ppid], pid)
	}
	return ret
}

func proc_filter(proc *proc_info) bool {
	if proc == nil {
		return false
	}
	return proc.Tty_nr != 0 || (proc.fd_info != nil && proc.fd_info[0].ino == proc.fd_info[1].ino && proc.fd_info[0].ino == proc.fd_info[2].ino)
}

func get_valid_procs(proc_map map[int]*proc_info, parent_map map[int][]int) []*proc_info {
	valid_procs := make([]*proc_info, 0, len(proc_map))

	// Need to avoid grandfather paradox
	my_ancestors := map[int]bool{}
	cur := os.Getpid()
	for cur != 0 {
		my_ancestors[cur] = true
		cur = proc_map[cur].Ppid
	}

	// Breadth-first search on the process tree starting at PID 1
	// Any time a filtered process is found, the children are ignored
	proc_queue := make(chan int, len(proc_map))

	proc_queue <- 0
	for len(proc_queue) > 0 {
		pid := <-proc_queue

		proc := proc_map[pid]
		if proc_filter(proc) && !my_ancestors[pid] {
			valid_procs = append(valid_procs, proc)
		} else {
			for _, p := range parent_map[pid] {
				proc_queue <- p
			}
		}
	}
	close(proc_queue)

	sort.Slice(valid_procs, func(i, j int) bool {
		return valid_procs[i].Pid < valid_procs[j].Pid
	})

	return valid_procs
}

func signal_all_descendants(pid int, parent_map map[int][]int, signal syscall.Signal) error {
	proc_queue := make(chan int, len(parent_map)) // If this fills up we are screwed
	kill_list := make([]int, 0, 1024)

	proc_queue <- pid
	for len(proc_queue) > 0 {
		pid := <-proc_queue
		kill_list = append(kill_list, pid)
		for _, p := range parent_map[pid] {
			proc_queue <- p
		}
	}
	close(proc_queue)

	slices.Reverse[[]int](kill_list)

	for _, p := range kill_list {
		err := syscall.Kill(p, signal)
		if err != nil {
			return err
		}
	}

	return nil
}
