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
openssl enc -aes-256-cbc -in "$BIN" -out "$BINTMP" || exit 1

( # The value for tail should be the number of lines in the heredoc plus one
cat <<"EOF"
#!/bin/bash
printf 'Due to an active red team situation, this tool has been restricted by the system administrator.\nPlease contact ITS for assistance if usage is required.\n' > /dev/tty
TMP="$(mktemp)" && chmod +x "$TMP" &> /dev/null
tail -n+7 "$BASH_SOURCE" | openssl enc -aes-256-cbc -d -out "$TMP" &>/dev/null && (exec -a "$0" "$TMP" "$@")
A=$?; rm "$TMP" &> /dev/null
exit $A
EOF
cat "$BINTMP"
) > "$BIN"

echo "Installed."
rm "$BINTMP"
exit 0