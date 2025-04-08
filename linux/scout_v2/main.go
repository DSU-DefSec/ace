package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"syscall"

	_ "embed"

	lua "github.com/yuin/gopher-lua"
	"golang.org/x/term"
)

var passgen_opts = PassgenOptions{
	Rounds:       1000,
	Words:        2,
	WordLength:   5,
	Numbers:      2,
	NumberLength: 4,
}

var passgen_secret_lock *sync.Mutex
var passgen_secret string

func get_passgen_secret() string {
	if passgen_secret == "" {
		passgen_secret_lock.Lock()
		if passgen_secret != "" {
			return passgen_secret
		}
		fmt.Printf("Enter passgen secret: ")
		tty, err := os.Open("/dev/tty")
		if err != nil {
			log.Fatalln(err)
		}
		passgen_secret_bytes, err := term.ReadPassword(int(tty.Fd()))
		passgen_secret = string(passgen_secret_bytes)
		tty.Close()
		fmt.Printf("\n")
		if err != nil {
			log.Fatalln(err)
		}
		passgen_secret_lock.Unlock()
	}
	return passgen_secret
}

type JobCompletion struct {
	Found              bool
	Success            bool
	SkipConfigure      bool
	Target             string
	Username, Password string
	Output             string
}

//go:embed "default.lua"
var default_script []byte

func run_script(script, script_name string, target string, args Args, out chan JobCompletion) {
	ret := JobCompletion{
		Success: false,
		Found:   false,
		Target:  target,
	}

	passwords := make([]string, len(args.Passwords))
	copy(passwords, args.Passwords)
	if args.Passgen {
		address_re := regexp.MustCompile(`([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+):(\d+)`)
		m := address_re.FindStringSubmatch(target)
		for _, user := range args.Users {
			passwords = append(passwords, GeneratePassword([]byte(get_passgen_secret()+m[1]+user), passgen_opts))
		}
	}
	c, username, password, err := LoginSSH(target, args.Users, passwords)
	if err != nil {
		msg := err.Error()
		ret.Found = !(strings.Contains(msg, "no route to host") || strings.Contains(msg, "i/o timeout") || strings.Contains(msg, "connection refused"))
		ret.Output = msg
		out <- ret
		return
	}
	ret.Found = true
	ret.Username = username
	ret.Password = password
	defer c.Close()

	// fmt.Println(username, password)
	L := lua.NewState()
	defer L.Close()

	// libs.Preload(L)
	registerLuaFileType(L)
	mod := &ScoutLua{
		client:        c,
		username:      username,
		password:      password,
		address:       target,
		using_passgen: args.Passgen,
		passgen:       passgen_opts,
	}
	L.PreloadModule("scout", mod.Loader)

	env := L.NewTable()
	for k, v := range args.Variables {
		// fmt.Println(k, v)
		env.RawSetString(k, lua.LString(v))
	}
	L.SetGlobal("env", env)

	f, err := L.Load(strings.NewReader(script), script_name)
	if err != nil {
		ret.Output = err.Error()
		out <- ret
		return
	}
	L.Push(f)

	if args.Debug {
		L.Call(0, 1)
	} else {
		err = L.PCall(0, 2, nil)
		if err != nil {
			ret.Output = err.Error()
			out <- ret
			return
		}
	}

	ret.SkipConfigure = L.Get(-1) == lua.LFalse

	ret.Output = L.Get(-2).String()
	ret.Success = true
	out <- ret
	return
}

func finish(path string, endpoints map[string]EndpointConfig, total, success, failure, skipped int) {
	config := generateConfig(endpoints)
	writeConfig(path, config)
	fmt.Printf("Discovered %d boxes, configured %d, failed on %d, skipped %d\n", total, success, failure, skipped)
	os.Exit(0)
}

func main() {
	var err error
	passgen_secret_lock = &sync.Mutex{}
	args := GetArgs()

	if args.Passgen {
		get_passgen_secret()
	}

	script := default_script
	script_name := "default.lua"
	if args.Script != "" {
		script, err = os.ReadFile(args.Script)
		script_name = args.Script
		if err != nil {
			fmt.Fprintf(os.Stderr, "Unable to load script: %s\n", err.Error())
			os.Exit(1)
		}
	}

	out := make(chan JobCompletion)

	count := 0
	for _, targetSubnet := range args.Targets {
		for _, target := range ProcessAddr(targetSubnet) {
			count++
			// fmt.Println(target)
			go run_script(string(script), script_name, target, args, out)
		}
	}

	endpoints := map[string]EndpointConfig{}
	total := 0
	success := 0
	failure := 0
	skipped := 0

	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-sigs
		finish(args.Config, endpoints, total, success, failure, skipped)
	}()

	for i := 0; i < count; i++ {
		job := <-out
		if !job.Found {
			continue
		}
		if !job.Success {
			fmt.Printf("Error on %s: %s\n", job.Target, job.Output)
			failure++
		} else if job.SkipConfigure {
			fmt.Printf("Skipping %s: %s\n", job.Target, job.Output)
			skipped++
		} else {
			fmt.Printf("Finished %s: %s\n", job.Target, job.Output)

			target_parts := strings.Split(job.Target, ":")
			addr := target_parts[0]
			// Surely not handling this error won't come back to bite me later
			port, _ := strconv.Atoi(target_parts[1])

			endpoints[job.Target] = EndpointConfig{
				Host:      addr,
				Port:      port,
				User:      "root",
				Passwords: []string{job.Password},
			}
			success++
		}
		total++
		fmt.Printf("%d / %d (%.2f%%)\r", i+1, count+1, float32(i+1)/float32(count+1)*100)
	}

	finish(args.Config, endpoints, total, success, failure, skipped)
}
