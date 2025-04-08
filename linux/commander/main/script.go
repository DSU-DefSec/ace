package main

import (
	"fmt"
	"os"
	"regexp"
	"strconv"
)

type ScriptParam struct {
	Name      string
	Validator string
}

type Script struct {
	Name    string
	Desc    string
	Ports   map[string]int
	Params  map[string]string
	Content string
	Exe     string
}

func ParseScript(raw string, name string) Script {
	// TODO: figure out how to only compile these once and use them globally
	shebangRE := regexp.MustCompile(`^#!(.+?)\n`)
	paramRE := regexp.MustCompile(`(?m)^#@param[\t ]+([A-Z0-9_]+)[\t ]+(.+?)$`)
	descRE := regexp.MustCompile(`(?m)^#@desc(?:[\t ]+(.*?)|)$`)
	portRE := regexp.MustCompile(`(?m)^#@port[\t ]+([A-Z0-9_]+)[\t ]+(\d+)$`)

	ret := Script{
		Content: raw,
		Name:    name[len(config.Scripts)+1:],
		Exe:     "",
		Desc:    "",
		Params:  make(map[string]string),
		Ports:   make(map[string]int),
	}

	m := shebangRE.FindStringSubmatch(raw)
	if m != nil {
		ret.Exe = m[1]
	}

	for _, m := range descRE.FindAllStringSubmatch(raw, -1) {
		ret.Desc += m[1] + "\n"
	}

	for _, m := range paramRE.FindAllStringSubmatch(raw, -1) {
		ret.Params[m[1]] = m[2]
	}

	for _, m := range portRE.FindAllStringSubmatch(raw, -1) {
		i, err := strconv.Atoi(m[2])
		if err != nil {
			fmt.Fprintf(os.Stderr, "Invalid Port: '%s' (%s)\n", m[2], err.Error())
		}
		ret.Ports[m[1]] = i
	}
	return ret
}
