package main

import (
	"bytes"
	"fmt"
	"time"
	"golang.org/x/crypto/ssh"
)

// ExecuteSSHCommand connects to the SSH server and runs a command.
func ExecuteSSHCommand(user, password,addr, command string) (string, error) { // Change this to your target server

	config := &ssh.ClientConfig{
		User: user,
		Auth: []ssh.AuthMethod{
			ssh.Password(password),
		},
		HostKeyCallback: ssh.InsecureIgnoreHostKey(), // Insecure, use proper key verification in production
		Timeout:         5 * time.Second,             // Set a timeout for better reliability
	}

	client, err := ssh.Dial("tcp", addr, config)
	if err != nil {
		return "", fmt.Errorf("failed to connect: %w", err)
	}
	defer client.Close()

	session, err := client.NewSession()
	if err != nil {
		return "", fmt.Errorf("failed to create session: %w", err)
	}
	defer session.Close()

	var output bytes.Buffer
	session.Stdout = &output

	if err := session.Run(command); err != nil {
		return "", fmt.Errorf("failed to run command: %w", err)
	}

	return output.String(), nil
}
