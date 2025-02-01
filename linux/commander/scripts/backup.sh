#@desc Backs `FILES` up to a tar file stored in the database.
#@desc
#@desc `FILES` is a list of files to back up. Can contain globs, escapes, etc.
#@desc The paths must all be absolute (or relative to the root directory)
#@desc
#@desc The validator will find most errors in `FILES`, but it won't get everything.
#@desc Be careful not to execute commands by accident.

#@param FILES ((\\\\)*\\[$\\;&|]|[^$\\;&|\n])+

set -e

ADDR=$(echo "$SSH_CONNECTION" | cut -d' ' -f3)

request_db() {
    # Not 100% sure if this is required but it makes me feel better
    REQ_URL="$CMDR_DB_URL?nonce=$(tr -cd '[:alnum:]' </dev/urandom | head -c $(($RANDOM % 192 + 64)))"
    test -n "$1" && REQ_URL="$REQ_URL&format=$1"
    curl \
    --digest \
    -u "$CMDR_DB_USER:$CMDR_DB_PASS" \
    -s \
    -H 'Content-Type: text/sql' \
    "$REQ_URL" \
    --data-binary @-
}

# Schema
request_db <<EOF
CREATE TABLE IF NOT EXISTS backups (
    "time" INTEGER,
    "box" TEXT,
    "id" INTEGER PRIMARY KEY,
    "data" BLOB
)
EOF

# Current unix time
TIME=$(date +%s)
echo 'Backup started at' $TIME
echo 'Backing up:' $FILES

# Upload
(
    printf "INSERT INTO backups (time, box, data) VALUES (%d, \"%s\", x'" $TIME $ADDR
    # Backup (Unescaping the expansion of $FILES is intended)
    tar -C / -czv $FILES | xxd -p | tr -d '\n'
    echo "')"
) | request_db