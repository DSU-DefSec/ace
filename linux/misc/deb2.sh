#!/bin/bash

DIR="$(mktemp -d)"

function genPassword() {
    cat /dev/urandom | tr -cd '[:alnum:]' | head -c64
}

PREINST_EOF="$(genPassword)"
POSTINST_EOF="$(genPassword)"
DATA_EOF="$(genPassword)"

ar x --output="$DIR" "$1"

cat >"installer.sh" <<EOF
SCRIPT="\$(mktemp)"
set -e
cat >"\$SCRIPT" <<"$PREINST_EOF"
$(tar -xOf "$DIR/control.tar.gz" ./preinst)
$PREINST_EOF
echo Running preinst...
chmod +x "\$SCRIPT" && "\$SCRIPT" install
echo Ran preinst
echo Exracting...
base64 -d <<"$DATA_EOF" | tar -xzC /
$(base64 "$DIR/data.tar.gz")
$DATA_EOF
echo Extracted
cat >"\$SCRIPT" <<"$POSTINST_EOF"
$(tar -xOf "$DIR/control.tar.gz" ./postinst)
$POSTINST_EOF
echo Running postinst...
chmod +x "\$SCRIPT" && "\$SCRIPT" configure
echo Ran postinst...
rm "\$SCRIPT"
EOF

rm -rf "$DIR"