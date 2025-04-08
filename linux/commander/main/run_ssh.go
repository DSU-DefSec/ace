package main

import (
	"crypto/md5"
	"database/sql"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path"
	"regexp"
	"strings"
	"sync"
	"syscall"
	"time"

	auth "github.com/abbot/go-http-auth"
	"github.com/alexflint/go-arg"
	"golang.org/x/crypto/ssh"
	"golang.org/x/term"
)

type SSHArgs struct {
	Targets     []string          `help:"List of targets (Specified in the config) to run scripts on"`
	Scripts     []string          `help:"List of scripts to run"`
	Env         map[string]string `help:"Environment variables to pass to scripts"`
	NoPassgen   bool              `default:"false" help:"Skip using passgen"`
	Interactive bool              `default:"true" help:"Ask for unknown parameters instead of failing"`
	Echo        bool              `default:"false" help:"Echo output from scripts to the terminal (Can get really messy really fast)"`
}

func acquireScriptParametersInteractive(script Script, provided map[string]string) map[string]string {
	ret := make(map[string]string)
	for name, validator := range script.Params {
		pat, err := regexp.Compile("^" + validator + "$")
		if err != nil {
			fmt.Fprintf(os.Stderr, "Unable to compile validator '%s' for parameter '%s' in script '%s': %s\n", validator, name, script.Name, err.Error())
		}
		val, ok := provided[name]
		if !ok {
			val = ""
		}
		for !pat.MatchString(val) {
			fmt.Fprintf(os.Stderr, "Please enter a value for parameter '%s' in script '%s' (%s): ", name, script.Name, validator)
			fmt.Scanln(&val)
		}
		ret[name] = val
	}
	return ret
}

func RunSSHCmdArgs(sshArgs SSHArgs, dbHandler http.HandlerFunc, dbPasswords map[string]string) error {
	// Load scripts
	var scripts []Script
	for _, script := range sshArgs.Scripts {
		scriptPath := path.Join(config.Scripts, script)
		raw, err := os.ReadFile(scriptPath)
		if err != nil {
			return errors.Join(fmt.Errorf("unable to load script: '%s'", script), err)
		}
		scripts = append(scripts, ParseScript(string(raw), scriptPath))
	}

	// Resolve Endpoints
	var endpoints []EndpointConfig
	for _, target := range sshArgs.Targets {
		ep, ok := config.Endpoints[target]
		if ok {
			endpoints = append(endpoints, ep)
		} else {
			return fmt.Errorf("invalid target: '%s'", target)
		}
	}

	// Get the current time and create the output directory
	now := time.Now()
	basePath := path.Join(
		config.Output,
		fmt.Sprintf("%s_%s", now.Format(time.RFC3339), strings.Join(sshArgs.Scripts, "_")),
	)
	err := os.MkdirAll(basePath, os.ModePerm)
	if err != nil {
		return fmt.Errorf("error creating script output directory: %s", err.Error())
	}
	group := sync.WaitGroup{}

	var runErrors []error
	for i := range endpoints {
		var port int
		if endpoints[i].Port == 0 {
			port = 22
		} else {
			port = endpoints[i].Port
		}

		var user string
		if endpoints[i].Port == 0 {
			user = "root"
		} else {
			user = endpoints[i].User
		}

		endpoint := fmt.Sprintf(
			"%s:%d",
			endpoints[i].Host,
			port,
		)

		env := make(map[string]string)
		for _, m := range []map[string]string{
			config.Env,
			endpoints[i].Env,
			sshArgs.Env,
		} {
			for k, v := range m {
				env[k] = v
			}
		}
		if sshArgs.Interactive {
			for _, script := range scripts {
				for k, v := range acquireScriptParametersInteractive(script, env) {
					env[k] = v
				}
			}
		}

		var auth []ssh.AuthMethod
		// Fill in passgen auth
		if !sshArgs.NoPassgen {
			s, ok := os.LookupEnv("PASSGEN_SECRET")
			if !ok && sshArgs.Interactive {
				sb, err := term.ReadPassword(int(syscall.Stdin))
				if err != nil {
					return fmt.Errorf("unable to read passgen secret: %s", err.Error())
				}
				s = string(sb)
				ok = true
			}
			if ok {
				auth = append(auth, CreatePassgenAuth(s, endpoints[i].Host, user, config.Passgen))
			}
		}
		// Fill in auth keys
		for _, k := range [][]string{
			config.Keys,
			endpoints[i].Keys,
		} {
			for j, k2 := range k {
				s, err := ssh.ParsePrivateKey([]byte(k2))
				if err != nil {
					fmt.Printf("Error parsing key %d for endpoint '%s': '%s'\n", j+1, sshArgs.Targets[i], err.Error())
				}
				auth = append(auth, ssh.PublicKeys(s))
			}
		}
		// Fill in auth passwords
		for _, p := range [][]string{
			config.Passwords,
			endpoints[i].Passwords,
		} {
			for _, p2 := range p {
				auth = append(auth, ssh.Password(p2))
			}
		}

		group.Add(1)
		go func() {
			outFile, err := os.Create(path.Join(basePath, sshArgs.Targets[i]+".cast"))
			if err != nil {
				runErrors = append(runErrors, fmt.Errorf("error opening output file for target '%s': %s", sshArgs.Targets[i], err.Error()))
				return
			}
			defer outFile.Close()
			ac, err := NewAsciiCastWriter(
				outFile,
				0, 0,
				now,
				strings.Join(sshArgs.Scripts, "; "),
				fmt.Sprintf("Running scripts '%s' on target '%s' at %s", strings.Join(sshArgs.Scripts, ", "), sshArgs.Targets[i], now.Format(time.RFC3339)),
				env,
			)
			statusWriter := io.MultiWriter(&ac, os.Stderr)
			if err != nil {
				runErrors = append(runErrors, fmt.Errorf("error writing output header: %s", err.Error()))
				return
			}
			ac.Paginate = 24
			for _, script := range scripts {
				ac.WriteMarker(script.Name)
				ac.CurrentLine = 0 // Reset pagination
				fmt.Fprintf(statusWriter, "Running script '%s' on target '%s'\n", script.Name, sshArgs.Targets[i])
				var out io.Writer
				if sshArgs.Echo {
					out = statusWriter
				} else {
					out = &ac
				}
				err := RunScriptOnHost(
					endpoint,
					user,
					script,
					env,
					auth,
					dbHandler,
					dbPasswords,
					out,
				)
				if err != nil {
					fmt.Fprintf(statusWriter, "\nError running script '%s': %s\n", script.Name, err.Error())
				} else {
					fmt.Fprintf(statusWriter, "\nScript '%s' Exited Successfully\n", script.Name)
				}
			}
			group.Done()
		}()
	}
	group.Wait()
	return errors.Join(runErrors...)
}

func RunSSHCmd(_ *arg.Parser) {
	// Database
	var dbHandler http.HandlerFunc
	dbPasswords := make(map[string]string)
	if config.Database != "" {
		// Open Database
		db, err := sql.Open("sqlite3", config.Database)
		if err != nil {
			log.Fatalf("Unable to open database: %s\n", err.Error())
		}

		// Auth
		authenticator := auth.NewDigestAuthenticator(
			"Script Database",
			MapSecretProvider("Script Database", dbPasswords, md5.New),
		)
		dbHandler = authenticator.Wrap(WrapAuthHandler(&DBHandler{DB: db}))
	} else {
		dbHandler = nil
	}

	// Run command
	err := RunSSHCmdArgs(*args.RunSSH, dbHandler, dbPasswords)

	// Error
	if err != nil {
		log.Fatal(err)
	}
}
