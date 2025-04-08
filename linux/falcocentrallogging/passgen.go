package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/binary"
	"strings"
	// "math/big"
)

var consonants = []string{"b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "z", "bl", "cl", "fl", "gl", "pl", "sl", "br", "cr", "dr", "fr", "gr", "pr", "tr", "sc", "sk", "sm", "sn", "sp", "st", "sw", "tw"}
var vowels = []string{"a", "e", "i", "o", "u", "ai", "ay", "ea", "ey", "ee", "ey", "ei", "ie", "oa", "oe", "ue", "eu", "oi", "oy", "ou", "au", "oo"}
var symbols = []string{"@", "#", "$", "%", "&", "!", "?", ":", "*", "^", "_", "-", "+", "=", "<"}

type PassgenOptions struct {
	Rounds       int `default:"1000" help:"Number of rounds"`
	Words        int `default:"2" help:"Number of words"`
	WordLength   int `default:"5" help:"Word length"`
	Numbers      int `default:"2" help:"Number of numbers"`
	NumberLength int `default:"4" help:"Number length"`
}

// func CalculateStates(options PassgenOptions) *big.Int {
// 	ret := big.NewInt(1)
// 	var base, power big.Int
// 	base.SetInt64(10)
// 	power.SetInt64(int64(options.NumberLength * options.Numbers))
// 	base.Exp(&base, &power, nil)
// 	ret.Mul(ret, &base)
// 	base.SetInt64(int64(len(consonants)))
// 	power.SetInt64(int64(options.Words * (options.WordLength/2 + 1)))
// 	base.Exp(&base, &power, nil)
// 	ret.Mul(ret, &base)
// 	base.SetInt64(int64(len(vowels)))
// 	power.SetInt64(int64(options.Words * (options.WordLength / 2)))
// 	base.Exp(&base, &power, nil)
// 	ret.Mul(ret, &base)
// 	base.SetInt64(int64(len(symbols)))
// 	power.SetInt64(int64((options.Words + options.Numbers)))
// 	base.Exp(&base, &power, nil)
// 	ret.Mul(ret, &base)
// 	return ret
// }

func GeneratePassword(secret []byte, options PassgenOptions) string {
	var state []byte
	advance := func() int {
		h := hmac.New(sha256.New, secret)
		h.Write(state)
		var ret []byte
		state = h.Sum(ret)
		o := int((state)[0]) % (len(state) - 4)
		return int(binary.LittleEndian.Uint32((state)[o : o+4]))
	}
	for i := 0; i < options.Rounds; i++ {
		advance()
	}

	var ret strings.Builder

	// Generate words
	for i := 0; i < options.Words; i++ {
		for j := 0; j < options.WordLength; j++ {
			if j%2 == 0 {
				ret.WriteString(vowels[advance()%len(vowels)])
			} else {
				ret.WriteString(consonants[advance()%len(consonants)])
			}
		}
		ret.WriteString(symbols[advance()%len(symbols)])
	}

	// Generate numbers
	for i := 0; i < options.Numbers; i++ {
		for j := 0; j < options.NumberLength; j++ {
			ret.WriteByte(byte(0x30 + advance()%10))
		}
		ret.WriteString(symbols[advance()%len(symbols)])
	}

	return ret.String()
}
