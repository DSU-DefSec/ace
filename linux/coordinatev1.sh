#!/usr/bin/env bash

#!/usr/bin/env sh

ROUNDS=0
WORDS=2
WORD_LENGTH=5
NUMBERS=2
NUMBER_LENGTH=4

#region HMAC
set -e

# Converts to hex, one octet per line
toHex() {
    xxd -p -c1
}

# Converts from hex
fromHex() {
    xxd -r -p
}

# Takes a byte to xor stdin (as lines of octets) with
xor() {
    while read BYTE; do printf "%02x\n" "$(( $1 ^ 0x$BYTE ))"; done
}

# First arg is padding line, second is length
pad() {
    i=0
    while read LINE; do
        echo "$LINE"
        i="$(($i + 1))"
    done
    while [ "$i" -lt "$2" ]; do
        echo "$1"
        i="$(($i + 1))"
    done
}

# converts K to opad for HMAC
# First arg is block size
opad() {
    xor 0x5C | pad 0x5C "$1" 
}

# converts K to ipad for HMAC
# First arg is block size
ipad() {
    xor 0x36 | pad 0x36 "$1"
}

# First arg is hash func
# Second arg is hash output size
hashFunc() {
    fromHex | "$1" | fold -w2 | head -n "$2"
}

# First arg is hash func (Must output hex first)
# Second arg is block size
# Third arg is hash output length in bytes
kPrime() {
    i=0
    k="$(head -n "$2")"
    if [ "$(echo -n "$k" | wc -l)" -gt "$2" ]; then
        (echo "$k" && cat) | "$1" | fold -w2 | head -n "$3"
    else
        echo "$k"
    fi | pad 00 "$2"
}

# First arg is key
# Second arg is hash func
# Third arg is block size
# Fourth arg is hash func output length in bytes
# Stdin is message
# Stdout is the HMAC in hex
hmac() {
    (
        echo -n "$1" | toHex | kPrime "$2" "$3" "$4" | opad "$3" 
        (
            echo -n "$1" | toHex | kPrime "$2" "$3" "$4" | ipad "$3"
            cat
        ) | hashFunc "$2" "$4"
    ) | hashFunc "$2" "$4"
}
#endregion HMAC

#region PRNG

advance() {
    # echo $state > /dev/tty
    state=$(echo "$state" | fold -w2 | hmac "$1" sha256sum 64 32 | tr -d '\n')
    # echo $((0x$(tail -c+$((2 * (0x$(head -c2 <<<"$state") % 28))) <<<"$state" | head -c8)))
    # echo "$state" >&2
    echo $((0x$(tail -c+$((1 + 2 * (0x$(head -c2 <<<"$state") % 28))) <<<"$state" | head -c8 | fold -w2 | tac | tr -d '\n')))
}

#endregion PRNG

#region Constants
consonant() {
    tail -n+$1 <<EOF | head -n1
b
c
d
f
g
h
j
k
l
m
n
p
q
r
s
t
v
w
x
z
bl
cl
fl
gl
pl
sl
br
cr
dr
fr
gr
pr
tr
sc
sk
sm
sn
sp
st
sw
tw
EOF
}

vowel() {
    tail -n+$1 <<EOF | head -n1
a
e
i
o
u
ai
ay
ea
ey
ee
ey
ei
ie
oa
oe
ue
eu
oi
oy
ou
au
oo
EOF
}

symbol() {
    tail -n+$1 <<'EOF' | head -n1
@
#
$
%
&
!
?
:
*
^
_
-
+
=
<
EOF
}

#endregion Constants

generate_password() {
    for i in $(seq $ROUNDS); do
        advance "$1" > /dev/null
        printf '%d / %d\r' $i $ROUNDS > /dev/tty
    done

    # Generate words
    for i in $(seq $WORDS); do
        for j in $(seq $WORD_LENGTH); do
            if [ $(($j % 2)) -eq 0 ]; then
                consonant $(($(advance "$1") % 41 + 1)) | tr -d '\n'
            else
                vowel $(($(advance "$1") % 22 + 1)) | tr -d '\n'
            fi
            advance "$1" > /dev/null
        done
        symbol $(($(advance "$1") % 15 + 1)) | tr -d '\n'
        advance "$1" > /dev/null
    done

    # Generate numbers
    for i in $(seq $NUMBERS); do
        for j in $(seq $NUMBER_LENGTH); do
            echo $(($(advance "$1") % 10)) | tr -d '\n'
            advance "$1" > /dev/null
        done
        symbol $(($(advance "$1") % 15 + 1)) | tr -d '\n'
        advance "$1" > /dev/null
    done
}

fatal() {
    echo "$2" >&2
    exit $1
}

log() {
  echo "$1" >&2
}

usage() {
  echo "Usage: $0 -u <username> -p <password> -i <ip-range> [-t <threads>] [-s <script-file>] [-E <var=value>] [-S]"
  echo ""
  echo "Arguments:"
  echo "  -u <username>    Username for SSH connection (default: root)"
  echo "  -p <password>    Password for SSH connection"
  echo "  -i <ip-range>    IP range in format: xxx.xxx.xxx.start-end (e.g., 10.20.100.1-100)"
  echo "  -t <threads>     Maximum number of concurrent connections (default: $(nproc))"
  echo "  -s <script-file> Script file to execute on remote hosts"
  echo "  -E <var=value>   Optional environment variables to pass to remote script"
  echo "  -P               Use passgen"
  echo "                   (can be specified multiple times for multiple variables)"
  echo "  -S               Use sudo to escalate privileges (uses same password as SSH login)"
  echo ""
  echo "Environment variables are optional and scripts can run without them."
}

# Default arguments
USERNAME="root"
PASSWORD=""
IP_BASE=""
START=""
END=""
PROCESSES=$(nproc) # Maximum number of concurrent SSH connections
SUDO=false # Whether to use sudo for privilege escalation
USE_PASSGEN=false

# Default script to run (empty means just run 'ip a | grep' as before)
REMOTE_SCRIPT=""

# Environment variables to pass to remote script
ENV_VARS=""

OPTS=$(getopt -o "u:p:i:t:s:E:SPh" --long 'username:,password:,range:,processes:,script:,env:,sudo,passgen,help' -n "$0" -- "$@")
test $? -ne 0 && fatal 1 "Unable to parse options"

eval set -- "$OPTS"

while true; do
  case "$1" in
  -u | --username)
    USERNAME=$2
    shift 2
    ;;
  -p | --password)
    PASSWORD=$2
    shift 2
    ;;
  -i | --range)
    RANGE=$2
    IP_BASE=$(echo "$RANGE" | tr '.-' '\n' | head -n3 | tr '\n' .)
    START=$(echo "$RANGE" | tr '.-' '\n' | tail -n2 | head -n1)
    END=$(echo "$RANGE" | tr '.-' '\n' | tail -n1)
    test "$START" -le "$END" 2>/dev/null || fatal 3 "Invalid range: $RANGE"
    shift 2
    ;;
  -t | --processes)
    PROCESSES=$2
    shift 2
    ;;
  -s | --script)
    SCRIPT=$2
    test -f "$SCRIPT" || fatal 2 "$SCRIPT doesn't exist"
    shift 2
    ;;
  -E | --env)
    ENV="$ENV $2"
    shift 2
    ;;
  -S | --sudo)
    SUDO=true
    shift
    ;;
  -P | --passgen)
    USE_PASSGEN=true
    shift
    ;;
  -h | --help)
    usage
    exit 0
    ;;
  --)
    shift
    break
    ;;
  *)
    echo "Invalid argument: $1"
    usage
    exit 1
    ;;
  esac
done

test -z "$PASSWORD" && fatal 4 "Please specify a password"
test -z "$IP_BASE"  && fatal 4 "Please specify a range"
test -z "$START"    && fatal 4 "Please specify a range"
test -z "$END"      && fatal 4 "Please specify a range"
test -z "$SCRIPT"   && fatal 4 "Please specify a script"

script --version || fatal 5 "Need 'script' installed"
ssh -V || fatal 5 "Need 'ssh' installed"

escape_shell() {
  printf \'
  sed -e "s/'/'\\\\''/g"
  printf \'
}

gen_random_string() {
  tr -dC '[:alnum:]' </dev/urandom | head -c "$1"
  echo
}

log_connection_failure() {
  log "$1"
  rm -f "$2.out" "$2.time"
}

ssh_to_host() {
  HOST="$1"
  OUTPUT_DIR="$2"
  test -z "$OUTPUT_DIR" && OUTPUT_DIR='.'
  set -e

  # REMOTE_UPLOAD_PATH="/tmp/$(gen_random_string 8)"

  $SUDO && SUDO_CMD=' sudo -i'
  
  log "Attempting connection to $HOST..."
  (
    sleep 1
    echo "$PASSWORD"
    sleep 1
    $SUDO && echo "$PASSWORD"
    test -n "$ENV" && echo "export $ENV"
    cat "$SCRIPT"
    echo
  ) | script -e -q -T "$OUTPUT_DIR/$HOST.time" -O "$OUTPUT_DIR/$HOST.out" -c "ssh -t -o StrictHostKeyChecking=no -o ConnectTimeout=10 $USERNAME@$HOST$SUDO_CMD" > /dev/null && log "Connected to $HOST and ran $SCRIPT" || log_connection_failure "Failed to connect to $HOST" "$OUTPUT_DIR/$HOST"
}

get_running_jobs() {
  jobs | grep -iE 'Running +ssh_to_host' | wc -l
}

OUTPUT_DIR="output/$(date +'%Y-%m-%dT%H:%M:%S')"
mkdir -p "$OUTPUT_DIR"

RAN=0
for TARGET in $(seq $START $END); do
    while [ $(get_running_jobs) -ge $PROCESSES ]; do
      echo -ne "$RAN / $(($END - $START))\\r"
      sleep 1
    done
    $USE_PASSGEN && PASSWORD="$(generate_password $PASSGEN_SECRET$USERNAME)"
    ssh_to_host "$IP_BASE$TARGET" "$OUTPUT_DIR" &
    RAN=$(($RAN + 1))
done

sleep 1

while [ $(get_running_jobs) -gt 0 ]; do
  echo -ne "$(get_running_jobs) Left\\r"
  sleep 1
done
