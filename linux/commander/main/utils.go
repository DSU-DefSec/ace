package main

import (
	"crypto/rand"
	"encoding/binary"
	"encoding/hex"
	"fmt"
	"hash"
	"net/http"

	auth "github.com/abbot/go-http-auth"
)

const pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

func genRandomString(length int) string {
	ret := make([]byte, length)
	rand.Read(ret)
	for i, c := range ret {
		ret[i] = pool[int(c)%len(pool)]
	}
	return string(ret)
}

// Looks passwords up in a map
// - If realm is not empty, is is matched
// - if h is not nil, it is used to hash the secret before returning it
func MapSecretProvider(realm string, m map[string]string, h func() hash.Hash) func(user, realm string) string {
	return func(u, r string) string {
		if r != "" && r != realm {
			return ""
		}
		pass, ok := m[u]
		if !ok {
			return ""
		}
		if h != nil {
			h2 := h()
			fmt.Fprintf(h2, "%s:%s:%s", u, r, pass)
			pass = hex.EncodeToString(h2.Sum(nil))
		}
		return pass
	}
}

// Tries all providers in order
func StackProvider(providers ...auth.SecretProvider) func(user, realm string) string {
	return func(user, realm string) string {
		for _, provider := range providers {
			ret := provider(user, realm)
			if ret != "" {
				return ret
			}
		}
		return ""
	}
}

// Wrap regular handler in authenticated handler func
func WrapAuthHandler(h http.Handler) auth.AuthenticatedHandlerFunc {
	return func(w http.ResponseWriter, r *auth.AuthenticatedRequest) {
		h.ServeHTTP(w, &r.Request)
	}
}

func randRange(a, b int) int {
	raw := make([]byte, 4)
	rand.Read(raw)
	return int(binary.LittleEndian.Uint32(raw))%(b-a) + a
}
