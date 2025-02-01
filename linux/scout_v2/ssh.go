package main

import (
	"fmt"
	"time"

	"golang.org/x/crypto/ssh"
)

func LoginSSH(addr string, users, passwords []string) (client *ssh.Client, user string, password string, err error) {
	// Check every username
	for _, user = range users {
		// Create a client config with the username
		config := ssh.ClientConfig{
			User:            user,
			HostKeyCallback: ssh.InsecureIgnoreHostKey(),
			Timeout:         10 * time.Second,
		}

		// Check every password
		for _, password = range passwords {
			// Attempt login with password
			config.Auth = []ssh.AuthMethod{ssh.Password(password)}
			client, err = ssh.Dial("tcp", addr, &config)

			// If the login succeeds, break out of the loop
			if err == nil {
				return
			}
		}
	}

	// If none of our connections succeeded, return an error
	err = fmt.Errorf("unable to connect to %s: %s", addr, err.Error())

	return
}
