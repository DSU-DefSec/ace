package main

import (
	"bufio"
	"fmt"
	"io"
	"log"
	"os"

	"github.com/alexflint/go-arg"
)

type UserPass struct {
	user, pass string
}

type Args struct {
	PassgenOptions
	Prefix string `arg:"-p" help:"Common prefix to be prepended to each line of input"`

	Delimiter    string `arg:"-d" default:"," help:"Delimiter between input and password"`
	PasswordOnly bool   `arg:"-n" default:"false" help:"Only print the password on the line, no secret or delimiter"`
	Interactive  bool   `arg:"-i" default:"false" help:"Gives a prompt to type items into and implies -n"`

	Change    bool `arg:"-c" default:"false" help:"Actually change the users passwords as well."`
	Verbose   bool `arg:"-v" default:"false" help:"Display users while changing passwords"`
	Stdin     bool `arg:"-s" default:"false" help:"Read secret from stdin"`
	Quiet     bool `arg:"-q" default:"false" help:"Don't output generated passwords"`
	Dump      bool `arg:"-D" default:"false" help:"Dump a list of enabled users without generating any passwords"`
	EnvSecret bool `arg:"-E" default:"false" help:"Read the secret from PASSGEN_SECRET instead of asking for it interactively"`

	Files []string `arg:"positional" help:"Optional list of files to read from. If left blank, stdin is used"`
}

func (Args) Description() string {
	return `Generates passwords deterministically based on lines of input.
Lines are read, then prepended with the secret read from input and the prefix`
}

func GetArgs() Args {
	var ret Args
	arg.MustParse(&ret)
	return ret
}

func ProcessInput(r io.Reader, secret []byte, args Args) error {
	if args.Interactive {
		fmt.Printf("> ")
	}

	scanner := bufio.NewScanner(r)
	items := []UserPass{}
	for scanner.Scan() {
		line := scanner.Bytes()

		// Assemble the secret
		temp_secret := make([]byte, 0, len(secret)+len(line)+32)
		temp_secret = append(temp_secret, secret...)
		temp_secret = append(temp_secret, []byte(args.Prefix)...)
		temp_secret = append(temp_secret, line...)

		// Generate the password
		new_password := GeneratePassword(temp_secret, args.PassgenOptions)
		if !args.Quiet {
			if args.PasswordOnly || args.Interactive {
				fmt.Println(new_password)
			} else {
				fmt.Printf("%s%s%s\n", scanner.Text(), args.Delimiter, new_password)
			}
		}
		if args.Change {
			if args.Interactive {
				err := ChangePasswords([]UserPass{{string(line), new_password}})
				if err != nil {
					return err
				}
			} else {
				items = append(items, UserPass{string(line), new_password})
			}
		}

		// Print the prompt if it's interactive
		if args.Interactive {
			fmt.Printf("> ")
		}
	}

	err := scanner.Err()
	if err != nil {
		return err
	}

	if args.Change && !args.Interactive {
		err = ChangePasswords(items)
		if err != nil {
			return err
		}
	}

	return nil
}

func main() {
	// Get arguments
	args := GetArgs()

	if args.Dump {
		users, err := GetUserList()
		if err != nil {
			log.Fatal(err)
		}
		for _, user := range users {
			fmt.Println(user)
		}
		os.Exit(0)
	}

	var secret []byte
	var err error
	if args.EnvSecret {
		secret = []byte(os.Getenv("PASSGEN_SECRET"))
	} else {
		secret, err = GetSecret(args.Stdin)

		if err != nil {
			log.Fatalf("Error reading password: %s\n", err.Error())
		}
	}

	// If no paths were supplied, just use stdin
	if len(args.Files) > 0 {
		for _, path := range args.Files {
			// Open the file
			f, err := os.Open(path)
			if err != nil {
				log.Fatalf("Unable to open '%s': %s", path, err.Error())
			}

			// Process the file
			err = ProcessInput(f, secret, args)
			if err != nil {
				log.Fatalf("Error generating passwords for '%s': %s\n", path, err.Error())
			}

			// Close the file
			err = f.Close()
			if err != nil {
				log.Fatalf("Unable to close '%s': %s", path, err.Error())
			}
		}
	} else {
		// Process stdin
		err := ProcessInput(os.Stdin, secret, args)
		if err != nil {
			log.Fatalf("Error generating passwords: %s\n", err.Error())
		}
	}
}
