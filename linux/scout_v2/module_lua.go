package main

import (
	"encoding/base64"
	"io"
	"strings"
	"time"

	"github.com/sergeymakinen/go-crypt/sha256"
	lua "github.com/yuin/gopher-lua"

	_ "embed"

	"golang.org/x/crypto/ssh"
)

type ScoutLua struct {
	// Internal variables
	client  *ssh.Client
	passgen PassgenOptions

	// Variables to be passed to the script
	username, password string
	address            string
	using_passgen      bool
}

//go:embed scout.lua
var lib_lua string

func (s *ScoutLua) Loader(L *lua.LState) int {
	module_function, err := L.Load(strings.NewReader(lib_lua), "scout.lua")
	if err != nil {
		L.Error(lua.LString(err.Error()), 1)
	}

	L.Push(module_function)
	L.Call(0, 1)
	mod2 := L.ToTable(-1)

	mod := L.SetFuncs(mod2, map[string]lua.LGFunction{
		"ssh":       s.OpenSSHSession,
		"crypt":     s.LuaCrypt,
		"sleep":     s.Sleep,
		"passgen":   s.LuaPassgen,
		"b64encode": s.B64Encode,
		"b64decode": s.B64Decode,
	})

	mod.RawSetString("username", lua.LString(s.username))
	mod.RawSetString("password", lua.LString(s.password))
	mod.RawSetString("address", lua.LString(s.address))
	mod.RawSetString("using_passgen", lua.LBool(s.using_passgen))

	L.Push(mod)
	return 1
}

func (s *ScoutLua) Sleep(L *lua.LState) int {
	val := L.CheckNumber(1)
	time.Sleep(time.Duration(val * lua.LNumber(time.Second)))
	return 0
}

func (s *ScoutLua) OpenSSHSession(L *lua.LState) int {
	cmd := L.CheckString(1)
	session, err := s.client.NewSession()
	if err != nil {
		L.Error(lua.LString(err.Error()), 1)
	}

	err = session.RequestPty("xterm", 24, 80, ssh.TerminalModes{
		ssh.ICANON: 0,
		ssh.OPOST:  0,
	})
	if err != nil {
		L.Error(lua.LString(err.Error()), 1)
	}

	stdin, err := session.StdinPipe()
	if err != nil {
		L.Error(lua.LString(err.Error()), 1)
	}
	stdout, err := session.StdoutPipe()
	stderr, err := session.StderrPipe()

	// stdout := bytes.NewBuffer(nil)
	// session.Stdout = stdout
	// stderr := bytes.NewBuffer(nil)
	// session.Stderr = stderr

	ret := L.NewTable()

	ret.RawSetString("stdin", NewLuaFile(L, stdin, nil, stdin, nil))
	ret.RawSetString("stdout", NewLuaFile(L, nil, stdout, nil, nil))
	ret.RawSetString("stderr", NewLuaFile(L, nil, stderr, nil, nil))
	ret.RawSetString("wait", L.NewFunction(func(l *lua.LState) int {
		// fmt.Println(s, cmd)
		err := session.Wait()
		status, ok := err.(*ssh.ExitError)
		if ok {
			L.Push(lua.LNumber(status.ExitStatus()))
			return 1
		} else if err != nil {
			L.Error(lua.LString((err.Error())), 1)
			return 0
		} else {
			L.Push(lua.LNumber(0))
			return 1
		}
	}))
	ret.RawSetString("close", L.NewFunction(func(l *lua.LState) int {
		err := session.Close()
		if err != nil && err != io.EOF {
			L.Error(lua.LString((err.Error())), 1)
		}
		return 0
	}))
	ret.RawSetString("signal", L.NewFunction(func(l *lua.LState) int {
		err := session.Signal(ssh.Signal(L.CheckString(2)))
		if err != nil && err != io.EOF {
			L.Error(lua.LString((err.Error())), 1)
		}
		return 0
	}))

	L.Push(ret)

	session.Start(cmd)

	return 1
}

func (s *ScoutLua) LuaCrypt(L *lua.LState) int {
	new_hash, err := sha256.NewHash(L.CheckString(1), 32768)
	if err != nil {
		L.Error(lua.LString(err.Error()), 1)
	}

	L.Push(lua.LString(new_hash))
	return 1
}

func (s *ScoutLua) LuaPassgen(L *lua.LState) int {
	secret := L.CheckString(1)

	password := GeneratePassword([]byte(get_passgen_secret()+secret), s.passgen)
	L.Push(lua.LString(password))
	return 1
}

func (s *ScoutLua) B64Encode(L *lua.LState) int {
	val := L.CheckString(1)
	ret := base64.StdEncoding.EncodeToString([]byte(val))
	L.Push(lua.LString(ret))
	return 1
}

func (s *ScoutLua) B64Decode(L *lua.LState) int {
	val := L.CheckString(1)
	ret, err := base64.StdEncoding.DecodeString(val)
	if err != nil {
		L.Error(lua.LString(err.Error()), 1)
	}
	L.Push(lua.LString(ret))
	return 1
}
