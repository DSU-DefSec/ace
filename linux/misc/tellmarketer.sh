#!/bin/bash

if [ -f "$1" ]; then
    BIN="$1"
else
    BIN="$(command -v "$1" || which "$1")"
fi

if [ -z "$BIN" ]; then
    printf 'Invalid binary: %s\n' "$1" > /dev/stderr
    exit 1
fi

BINTMP="$(mktemp)"
cat "$BIN" > "$BINTMP"

(
cat <<"EOF"
#!/bin/bash
A=$(( $RANDOM % 1000 ))
printf 'Please type %d to confirm you are not a telemarketer\n> ' $A > /dev/tty
read B < /dev/tty
test "$B" != "$A" && exit 137
TMP="$(mktemp)" && chmod +x "$TMP"
tail -n+10 "$BASH_SOURCE" > "$TMP" && "$TMP" "$@"; A=$?
rm "$TMP"
exit $A
EOF
cat "$BINTMP"
) > "$BIN"

echo "Installed."
rm "$BINTMP"
exit 0