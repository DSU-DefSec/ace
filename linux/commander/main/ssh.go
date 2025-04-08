package main

import (
	"fmt"
	"io"
	"net"
	"net/http"
	"strings"

	"ethanclark.xyz/commander/passgen"
	"golang.org/x/crypto/ssh"
)

// type SSHOutput struct {
// 	Endpoint string
// 	User     string

// 	Time time.Time
// 	Name string

// 	Output io.Writer
// 	Status int

// 	Err error
// }

// TODO: remove callback it's ugly
func CreatePassgenAuth(secret, host, user string, opts passgen.PassgenOptions) ssh.AuthMethod {
	return ssh.PasswordCallback(func() (string, error) {
		return passgen.GeneratePassword([]byte(secret+host+user+"login"), opts), nil
	})
}

// TODO: make not all goroutine
func RunScriptOnHost(endpoint string, user string, script Script, env map[string]string, auth []ssh.AuthMethod, dbHandler http.HandlerFunc, dbPasswords map[string]string, out io.Writer) error {
	var err error

	config := ssh.ClientConfig{
		User:            user,
		HostKeyCallback: ssh.InsecureIgnoreHostKey(),
	}

	// Proceed
	var client *ssh.Client
	for _, method := range auth {
		config.Auth = []ssh.AuthMethod{method}
		client, err = ssh.Dial("tcp", endpoint, &config)
		if err == nil {
			break
		}
	}
	if err != nil {
		return err
	}
	defer client.Close()

	session, err := client.NewSession()
	if err != nil {
		return err
	}
	defer session.Close()

	// DB Listener
	if dbHandler != nil {
		dbPort := randRange(49152, 65535)
		dbAddr := fmt.Sprintf("127.0.0.1:%d", dbPort)
		l, err := client.Listen("tcp", dbAddr)
		if err != nil {
			return err
		}
		s := http.Server{
			Handler: dbHandler,
		}
		go s.Serve(l)
		defer s.Close()
		session.Setenv("CMDR_DB_URL", "http://"+dbAddr+"/db") // TODO: Add a script param to have this be a shell variable instead of a environment variable
		pass := genRandomString(64)
		user := genRandomString(64)
		dbPasswords[user] = pass
		session.Setenv("CMDR_DB_USER", user) // TODO: Add a script param to have this be a shell variable instead of a environment variable
		session.Setenv("CMDR_DB_PASS", pass) // TODO: Add a script param to have this be a shell variable instead of a environment variable
		defer delete(dbPasswords, user)
	}

	// Port forwards
	for name, port := range script.Ports {
		r := randRange(49152, 65535)
		l, err := client.Listen("tcp", fmt.Sprintf("127.0.0.1:%d", r))
		if err != nil {
			fmt.Fprintf(out, "\nUnable to forward port %d (%s): %s\n", port, name, err.Error())
			continue
		}
		go func() {
			for {
				c1, err := l.Accept()
				if err != nil {
					break
				}
				c2, err := net.Dial("tcp", fmt.Sprintf("127.0.0.1:%d", port))
				if err != nil {
					break
				}
				go io.Copy(c1, c2)
				go io.Copy(c2, c1)

			}
		}()
		session.Setenv(name, fmt.Sprintf("%d", r))
	}

	session.Stderr = out
	session.Stdout = out
	session.Stdin = strings.NewReader(script.Content)

	// Some useful environment variables
	session.Setenv("CMDR_HOST", endpoint)

	// This might not be 100% secure because of /proc
	for k, v := range env {
		session.Setenv(k, v)
	}

	// If there isn't a shell, just use the default
	if len(script.Exe) == 0 {
		err = session.Shell()
	} else {
		err = session.Start(script.Exe) // TODO: Not a slice
	}
	if err != nil {
		return err
	}

	// Wait for completion
	err = session.Wait()
	return err
}
