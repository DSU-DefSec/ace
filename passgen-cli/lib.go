package main

import "C"

//export CGeneratePassword
func CGeneratePassword(secret *C.char) *C.char {
	opts := PassgenOptions{
		Rounds:       1000,
		Words:        2,
		WordLength:   5,
		Numbers:      2,
		NumberLength: 4,
	}
	secret2 := C.GoString(secret)
	ret := GeneratePassword([]byte(secret2), opts)
	return C.CString(ret)
}
