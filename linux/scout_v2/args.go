package main

import "github.com/alexflint/go-arg"

type Args struct {
	Passwords []string `arg:"-p,required" help:"Comma-separated list of passwords to try"`
	Users     []string `arg:"-u,required" help:"Comma-separated list of users to try"`
	Targets   []string `arg:"-t,required" help:"List of subnets/addresses to try"`

	Variables map[string]string `arg:"-v" help:"Sets variables in the Lua environment"`

	Passgen bool   `arg:"-P" default:"true" help:"Use passgen"`
	Debug   bool   `arg:"-D" default:"false" help:"Kills the program after a single script error (and shows a traceback)"`
	Script  string `arg:"-s" help:"Path to the script to run. Defaults to the embedded securing script if not specified"`
	// ManagementSubnet string   `arg:"-m,required" help:"Subnet to allow root SSH connections from (and whitelist all ports)"`
	// SubnetWhitelist  []string `arg:"-w" help:"Comma-separated list of subnets/addresses to whitelist"`

	Config string `arg:"-c" default:"config.yaml" help:"Path to write the config file to. Will be overwritten"`
	// BackupDir string `arg:"-d" default:"scout-backups" help:"Path to the backup directory"`
}

func GetArgs() Args {
	var ret Args
	arg.MustParse(&ret)
	return ret
}
