#!/usr/bin/env sh

set -e
rm -vf ./passgen-cli ./passgen-cli.exe www/passgen.wasm ./passgen-win.a ./passgen-linux.a

# Build windows
CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build
# GOOS=windows GOARCH=amd64 go build -buildmode=c-shared -o passgen-win.a
# GOOS=windows GOARCH=amd64 CGO_ENABLED=1 CC=x86_64-w64-mingw32-gcc go build -buildmode=c-shared -o passgen-win.dll dummy.go passgen.go
echo Built Windows

# Build linux
CGO_ENABLED=0 go build && strip ./passgen-cli
GOARCH=amd64 go build -buildmode=c-archive -o passgen-linux.a
echo Built Linux

exit 0

# Build WASM
GOOS=js GOARCH=wasm go build -o www/passgen.wasm
echo Built WASM

# Webpack
cd www
webpack