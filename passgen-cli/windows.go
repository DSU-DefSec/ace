//go:build windows

package main

import (
	"fmt"
	"os"

	wapi "github.com/iamacarpet/go-win64api"
	"golang.org/x/term"
)

func ChangePasswords(items []UserPass) error {
	for _, val := range items {
		_, err := wapi.ChangePassword(val.user, val.pass)
		// proc := exec.Command("net", "user", val.user, val.pass)
		// err := proc.Wait()
		if err != nil {
			return err
		}
	}
	return nil
}

func GetSecret(_ bool) ([]byte, error) {
	// scanner := bufio.NewScanner(os.Stdin)
	// var secret []byte
	// if scanner.Scan() {
	// 	secret = scanner.Bytes()
	// }
	// err := scanner.Err()
	fmt.Fprintf(os.Stderr, "Enter Secret: ")
	secret, err := term.ReadPassword(int(os.Stdin.Fd()))
	fmt.Fprintf(os.Stderr, "\n")
	return secret, err
}

func GetUserList() ([]string, error) {
	users, err := wapi.ListLocalUsers()
	if err != nil {
		return nil, err
	}

	ret := make([]string, 0, len(users))
	for _, record := range users {
		if record.IsEnabled {
			ret = append(ret, record.Username)
		}
	}

	return ret, nil
}
