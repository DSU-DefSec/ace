#!/bin/bash

if [ -f "$1" ]; then
    BIN="$1"
else
    BIN="$(which "$1")"
fi

if [ ! -f "$BIN" ]; then
    printf 'Invalid binary: %s\n' "$1" > /dev/stderr
    exit 1
else
    printf 'Targeteing binary: %s\n' "$BIN" > /dev/stderr
fi

if grep '#/bin/bash' "$BIN" ; then
    printf 'Not a bincrypted binary.\n' > /dev/stderr
    exit 1
fi

TMP="$(mktemp)"
tail -n+7 "$BIN" | openssl enc -aes-256-cbc -d -out "$TMP" || exit $?
cat "$TMP" > "$BIN"
rm "$TMP"