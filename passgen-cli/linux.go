//go:build linux

package main

import (
	"os"
	"regexp"
	"strings"

	"github.com/sergeymakinen/go-crypt/sha256"
	"golang.org/x/term"
)

func parseUnixDB(db string) (ret [][]string) {
	lines := strings.Split(db, "\n")
	for _, line := range lines {
		ret = append(ret, strings.Split(line, ":"))
	}
	return
}

func serializeUnixDB(db [][]string) string {
	b := &strings.Builder{}
	for _, line := range db {
		b.WriteString(strings.Join(line, ":"))
		b.WriteRune('\n')
	}
	return b.String()
}

func ChangePasswords(items []UserPass) error {
	// Convert items to map for faster lookup
	itemMap := make(map[string]string)
	for _, i := range items {
		itemMap[i.user] = i.pass
	}

	// Load the shadow file
	shadow, err := os.ReadFile("/etc/shadow")
	if err != nil {
		return err
	}

	// Back it up
	os.WriteFile("/etc/shadow-", shadow, 0o600)

	// Parse the DB
	shadow_db := parseUnixDB(string(shadow))

	// Patch the shadow file
	for _, record := range shadow_db {
		pass, exists := itemMap[record[0]]
		if exists {
			// Generate the new hash
			new_hash, err := sha256.NewHash(pass, 32768)
			if err != nil {
				return err
			}
			record[1] = new_hash
		}
	}

	// Serialize the new database
	new_shadow := serializeUnixDB(shadow_db)

	// Write it back to the host
	err = os.WriteFile("/etc/shadow", []byte(new_shadow), 0o600)
	if err != nil {
		return err
	}

	return nil
}

func GetSecret(useStdin bool) ([]byte, error) {
	var tty *os.File
	var err error
	os.WriteFile("/dev/tty", []byte("Enter secret: "), os.ModePerm)

	if useStdin {
		tty = os.Stdin
	} else {
		tty, err = os.Open("/dev/tty")
		if err != nil {
			return nil, err
		}
	}

	secret, err := term.ReadPassword(int(tty.Fd()))
	err = tty.Close()

	os.WriteFile("/dev/tty", []byte("\n"), os.ModePerm)

	return secret, err
}

func GetUserList() ([]string, error) {
	// Load the passwd file
	passwd, err := os.ReadFile("/etc/passwd")
	if err != nil {
		return nil, err
	}

	// Parse the DB
	passwd_db := parseUnixDB(string(passwd))
	shellRegex := regexp.MustCompile(`sh$`)

	ret := make([]string, 0, len(passwd_db))
	for _, record := range passwd_db {
		if len(record) >= 7 && shellRegex.MatchString(record[6]) && record[1] == "x" {
			ret = append(ret, record[0])
		}
	}
	return ret, nil
}
