package main

import (
	"fmt"
	"os"
	"regexp"
	"strconv"
	"strings"
)

type ProcStat struct {
	Pid                   int
	Comm                  string
	State                 string
	Ppid                  int
	Pgrp                  int
	Session               int
	Tty_nr                int
	Tpgid                 int
	Flags                 uint
	Minflt                uint64
	Cminflt               uint64
	Majflt                uint64
	Cmajflt               uint64
	Utime                 uint64
	Stime                 uint64
	Cutime                int64
	Cstime                int64
	Priority              int64
	Nice                  int64
	Num_threads           int64
	Itrealvalue           int64
	Starttime             uint64
	Vsize                 uint64
	Rss                   int64
	Rsslim                uint64
	Startcode             uint64
	Endcode               uint64
	Startstack            uint64
	Kstkesp               uint64
	Kstkeip               uint64
	Signal                uint64
	Blocked               uint64
	Sigignore             uint64
	Sigcatch              uint64
	Wchan                 uint64
	Nswap                 uint64
	Cnswap                uint64
	Exit_signal           int
	Processor             int
	Rt_priority           uint
	Policy                uint
	Delayacct_blkio_ticks uint64
	Guest_time            uint64
	Cguest_time           int64
	Start_data            uint64
	End_data              uint64
	Start_brk             uint64
	Arg_start             uint64
	Arg_end               uint64
	Env_start             uint64
	Env_end               uint64
	Exit_code             int
}

func (p *ProcStat) String() string {
	return fmt.Sprintf(
		"pid  %d\ncomm  %s\nstate  %s\nppid  %d\npgrp  %d\nsession  %d\ntty_nr  %d\ntpgid  %d\nflags  %d\nminflt  %d\ncminflt  %d\nmajflt  %d\ncmajflt  %d\nutime  %d\nstime  %d\ncutime  %d\ncstime  %d\npriority  %d\nnice  %d\nnum_threads  %d\nitrealvalue  %d\nstarttime  %d\nvsize  %d\nrss  %d\nrsslim  %d\nstartcode  %d\nendcode  %d\nstartstack  %d\nkstkesp  %d\nkstkeip  %d\nsignal  %d\nblocked  %d\nsigignore  %d\nsigcatch  %d\nwchan  %d\nnswap  %d\ncnswap  %d\nexit_signal  %d\nprocessor  %d\nrt_priority  %d\npolicy  %d\ndelayacct_blkio_ticks  %d\nguest_time  %d\ncguest_time  %d\nstart_data  %d\nend_data  %d\nstart_brk  %d\narg_start  %d\narg_end  %d\nenv_start  %d\nenv_end  %d\nexit_code  %d",
		p.Pid,
		p.Comm,
		p.State,
		p.Ppid,
		p.Pgrp,
		p.Session,
		p.Tty_nr,
		p.Tpgid,
		p.Flags,
		p.Minflt,
		p.Cminflt,
		p.Majflt,
		p.Cmajflt,
		p.Utime,
		p.Stime,
		p.Cutime,
		p.Cstime,
		p.Priority,
		p.Nice,
		p.Num_threads,
		p.Itrealvalue,
		p.Starttime,
		p.Vsize,
		p.Rss,
		p.Rsslim,
		p.Startcode,
		p.Endcode,
		p.Startstack,
		p.Kstkesp,
		p.Kstkeip,
		p.Signal,
		p.Blocked,
		p.Sigignore,
		p.Sigcatch,
		p.Wchan,
		p.Nswap,
		p.Cnswap,
		p.Exit_signal,
		p.Processor,
		p.Rt_priority,
		p.Policy,
		p.Delayacct_blkio_ticks,
		p.Guest_time,
		p.Cguest_time,
		p.Start_data,
		p.End_data,
		p.Start_brk,
		p.Arg_start,
		p.Arg_end,
		p.Env_start,
		p.Env_end,
		p.Exit_code,
	)
}

func (p *ProcStat) Display(proc_map map[int]*ProcStat, parent_proc_map map[int][]int, indent int) {
	fmt.Printf("%s%d - %s\n", strings.Repeat("  ", indent), p.Pid, p.Comm)
	for _, pid := range parent_proc_map[p.Pid] {
		p2 := proc_map[pid]
		p2.Display(proc_map, parent_proc_map, indent+2)
	}
}

type DeviceNumber struct {
	Major, Minor int
}

func (p *ProcStat) GetTTYDeviceNums() DeviceNumber {
	ret := DeviceNumber{
		Minor: p.Tty_nr & 255,
		Major: (p.Tty_nr >> 8) & 255,
	}
	return ret
}

func stat_proc_pid(pid int) (*ProcStat, error) {
	return stat_proc(fmt.Sprintf("/proc/%d/stat", pid))
}

func stat_proc(path string) (*ProcStat, error) {
	ret := &ProcStat{}

	data, err := os.ReadFile(path)
	if err != nil {
		return ret, err
	}

	re := regexp.MustCompile(`(\d+)\s+\((.+?)\)\s+`)
	m := re.FindSubmatch(data)
	ret.Pid, _ = strconv.Atoi(string(m[1]))
	ret.Comm = string(m[2])

	_, err = fmt.Sscanf(
		string(data[len(m[0]):]),
		"%s %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d %d",
		&ret.State,
		&ret.Ppid,
		&ret.Pgrp,
		&ret.Session,
		&ret.Tty_nr,
		&ret.Tpgid,
		&ret.Flags,
		&ret.Minflt,
		&ret.Cminflt,
		&ret.Majflt,
		&ret.Cmajflt,
		&ret.Utime,
		&ret.Stime,
		&ret.Cutime,
		&ret.Cstime,
		&ret.Priority,
		&ret.Nice,
		&ret.Num_threads,
		&ret.Itrealvalue,
		&ret.Starttime,
		&ret.Vsize,
		&ret.Rss,
		&ret.Rsslim,
		&ret.Startcode,
		&ret.Endcode,
		&ret.Startstack,
		&ret.Kstkesp,
		&ret.Kstkeip,
		&ret.Signal,
		&ret.Blocked,
		&ret.Sigignore,
		&ret.Sigcatch,
		&ret.Wchan,
		&ret.Nswap,
		&ret.Cnswap,
		&ret.Exit_signal,
		&ret.Processor,
		&ret.Rt_priority,
		&ret.Policy,
		&ret.Delayacct_blkio_ticks,
		&ret.Guest_time,
		&ret.Cguest_time,
		&ret.Start_data,
		&ret.End_data,
		&ret.Start_brk,
		&ret.Arg_start,
		&ret.Arg_end,
		&ret.Env_start,
		&ret.Env_end,
		&ret.Exit_code,
	)
	if err != nil {
		return ret, err
	}

	return ret, nil
}
