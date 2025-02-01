package main

import (
	"bufio"
	"fmt"
	"io"

	lua "github.com/yuin/gopher-lua"
)

// type LuaFiler interface {
// 	io.Closer
// 	io.Reader
// 	io.Writer
// 	io.Seeker
// }

type CombineCloser struct {
	c []io.Closer
}

func (c *CombineCloser) Close() error {
	for _, c2 := range c.c {
		err := c2.Close()
		if err != nil {
			return err
		}
	}
	return nil
}

type LuaFile struct {
	c io.Closer
	r *bufio.Reader
	w io.Writer
	s io.Seeker
}

func NewLuaFile(L *lua.LState, c io.Closer, r io.Reader, w io.Writer, s io.Seeker) *lua.LUserData {
	ud := L.NewUserData()
	ud.Value = &LuaFile{
		c: c,
		r: bufio.NewReader(r),
		w: w,
		s: s,
	}
	L.SetMetatable(ud, L.GetTypeMetatable("go_io"))
	return ud
}

func registerLuaFileType(L *lua.LState) {
	mt := L.NewTypeMetatable("go_io")
	L.SetGlobal("go_io", mt)
	// methods
	L.SetField(mt, "__index", L.SetFuncs(L.NewTable(), map[string]lua.LGFunction{
		"close":   LuaFileClose,
		"flush":   LuaFileFlush,
		"lines":   LuaFileLines,
		"read":    LuaFileRead,
		"seek":    LuaFileSeek,
		"setvbuf": LuaFileSetVBuf,
		"write":   LuaFileWrite,
	}))
}

func LuaFileClose(L *lua.LState) int {
	f, ok := L.CheckUserData(1).Value.(*LuaFile)
	if !ok {
		L.ArgError(1, "First argument must be a go_io")
	}
	if f.c == nil {
		L.Error(lua.LString("This object does not support closing"), 1)
	}

	err := f.c.Close()
	if err != nil { //&& err != io.EOF {
		L.Error(lua.LString("Error closing file: "+err.Error()), 1)
	}
	return 0
}

func LuaFileFlush(L *lua.LState) int {
	L.Error(lua.LString("not implemented"), 1)
	return 0
}

func LuaFileLines(L *lua.LState) int {
	L.Error(lua.LString("not implemented"), 1)
	return 0
}

func LuaFileRead(L *lua.LState) int {
	f, ok := L.CheckUserData(1).Value.(*LuaFile)
	if !ok {
		L.ArgError(1, "First argument must be a go_io")
	}
	if f.r == nil {
		L.Error(lua.LString("This object does not support reading"), 1)
	}

	format := L.CheckAny(2)
	switch format.Type() {
	case lua.LTNumber:
		size, _ := format.(lua.LNumber)
		if size == 0 {
			L.Push(lua.LString(""))
			return 1
		}
		buf := make([]byte, int(size))
		n, err := f.r.Read(buf)
		if err == io.EOF {
			if n == 0 {
				L.Push(lua.LNil)
				return 1
			}
		} else if err != nil {
			L.Error(lua.LString(err.Error()), 1)
		}
		L.Push(lua.LString(buf[:n]))
		return 1
	case lua.LTString:
		switch format.(lua.LString) {
		case "*n":
			var num lua.LNumber
			_, err := fmt.Scanf("%f", &num)
			if err != nil {
				L.Error(lua.LString(err.Error()), 1)
			}
			L.Push(num)
		case "*a":
			data, err := io.ReadAll(f.r)
			if err != nil {
				L.Error(lua.LString(err.Error()), 1)
			}
			L.Push(lua.LString(data))
		case "*l":
			data, err := f.r.ReadBytes('\n')
			if err != nil {
				if err == io.EOF {
					if len(data) == 0 {
						L.Push(lua.LNil)
						return 1
					}
				}
				L.Error(lua.LString(err.Error()), 1)
			}
			L.Push(lua.LString(data))
		default:
			L.Error(lua.LString("Invalid format"), 1)
		}
	}
	return 1
}

func LuaFileSeek(L *lua.LState) int {
	f, ok := L.CheckUserData(1).Value.(*LuaFile)
	if !ok {
		L.ArgError(1, "First argument must be a go_io")
	}
	if f.s == nil {
		L.Error(lua.LString("This object does not support seeking"), 1)
	}

	whences := map[string]int{
		"set": io.SeekStart,
		"cur": io.SeekCurrent,
		"end": io.SeekEnd,
	}

	whenceArg := L.CheckString(2)
	whence, ok := whences[whenceArg]
	if !ok {
		L.ArgError(2, "invalid whence")
	}
	offset := L.CheckInt64(3)

	pos, err := f.s.Seek(offset, whence)
	if err != nil {
		L.Error(lua.LString(err.Error()), 1)
	}

	L.Push(lua.LNumber(pos))
	return 1
}

func LuaFileSetVBuf(L *lua.LState) int {
	L.Error(lua.LString("not implemented"), 1)
	return 0
}

func LuaFileWrite(L *lua.LState) int {
	f, ok := L.CheckUserData(1).Value.(*LuaFile)
	if !ok {
		L.ArgError(1, "First argument must be a go_io")
	}
	if f.w == nil {
		L.Error(lua.LString("This object does not support writing"), 1)
	}

	n := L.GetTop()
	total := 0

	for i := 2; i <= n; i++ {
		val := L.Get(i)
		n, err := f.w.Write([]byte(val.String()))
		if err != nil {
			L.Push(lua.LNil)
			L.Push(lua.LString(err.Error()))
			return 2
		}
		total += n
	}

	L.Push(lua.LNumber(total))
	return 1
}
