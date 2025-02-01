package main

import (
	"github.com/alexflint/go-arg"
)

// TODO: Add usage strings
type Args struct {
	RunSSH     *SSHArgs        `arg:"subcommand:run" help:"Runs scripts on targets"`
	ListScript *ListScriptArgs `arg:"subcommand:list" help:"Lists available scripts"`
	ServeArgs  *ServeArgs      `arg:"subcommand:serve" help:"Serves the web UI"`
	Config     string          `default:"config.yaml" help:"Path to the config file"`
}

var args Args
var config Config

func main() {
	p := arg.MustParse(&args)
	config = loadConfig(args.Config)

	if args.RunSSH != nil {
		RunSSHCmd(p)
	} else if args.ListScript != nil {
		ListScript(p)
	} else if args.ServeArgs != nil {
		ServeWeb(p)
	}
}
