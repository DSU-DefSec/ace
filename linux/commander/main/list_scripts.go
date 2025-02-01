package main

import (
	"fmt"
	"io/fs"
	"os"
	"path/filepath"

	"github.com/alexflint/go-arg"
)

type ListScriptArgs struct {
	Short bool `help:"Don't print any descriptions"`
	// Pattern string
}

func ListScript(parser *arg.Parser) {
	ListScriptWalkFunc := func(path string, info fs.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if info.IsDir() {
			return nil
		}

		raw, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		s := ParseScript(string(raw), path)

		fmt.Printf("# %s\n", s.Name)
		fmt.Printf("Exe: %s\n", s.Exe)
		if !args.ListScript.Short {
			fmt.Printf("%s\n", s.Desc)
		}

		if len(s.Params) > 0 {
			fmt.Printf("Params: \n")
			for name, validator := range s.Params {
				fmt.Printf("- %s `%s`\n", name, validator)
			}
		}

		fmt.Printf("\n")

		return nil
	}

	filepath.Walk(config.Scripts, ListScriptWalkFunc)
}
