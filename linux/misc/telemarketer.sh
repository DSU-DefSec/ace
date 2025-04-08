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

BINTMP="$(mktemp)"
cat "$BIN" > "$BINTMP"

( # The value for tail should be the number of lines in the heredoc plus one
cat <<"EOF"
#!/bin/bash
A=$(( $RANDOM % 1000 ))
printf 'Please type %d to confirm you are not a telemarketer\n> ' $A > /dev/tty
read B < /dev/tty
test "$B" != "$A" && exit 137
TMP="$(mktemp)" && chmod +x "$TMP"
tail -n+10 "$BASH_SOURCE" > "$TMP" && (exec -a "$0" "$TMP" "$@"); A=$?
rm "$TMP"
exit $A
EOF
cat "$BINTMP"
) > "$BIN"

echo "Installed."
rm "$BINTMP"
exit 0