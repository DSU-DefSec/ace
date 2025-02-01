//go:build wasm

package main

import (
	"fmt"
	"syscall/js"
)

func ChangePasswords(items []UserPass) error {
	return nil
}

func GetSecret(_ bool) ([]byte, error) {
	g := js.Global()
	// if g.IsUndefined() {
	// 	log.Fatalln("Global is undefined")
	// }

	var secret string
	// document := g.Get("document")
	// if document.IsUndefined() {
	// 	log.Fatalln("Document is undefined")
	// }
	// secretInput := document.Call("getElementById", "secret")
	// if secretInput.IsNull() {
	// 	secretVal := g.Call("prompt", "Enter secret")
	// 	if secretVal.Type() != js.TypeString {
	// 		return nil, fmt.Errorf("unable to get secret: prompt returned %s", secretVal.Type().String())
	// 	}
	// 	secret = secretVal.String()
	// } else {
	// 	secret = secretInput.Get("value").String()
	// }
	secretVal := g.Call("prompt", "Enter secret")
	if secretVal.Type() != js.TypeString {
		return nil, fmt.Errorf("unable to get secret: prompt returned %s", secretVal.Type().String())
	}
	secret = secretVal.String()

	// fmt.Println(secret)

	return []byte(secret), nil
}

func GetUserList() ([]string, error) {
	return nil, fmt.Errorf("GetUserList() not implemented in WASM")
}
