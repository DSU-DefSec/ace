#!/bin/sh

#@desc Restored backups created with `backup.sh`
#@desc BACKUP_ID is the ID of the backup to restore
#@desc
#@desc This script will restore a backup from one box to a different box. Be careful.
#@desc It's usually a good idea to take a backup before attempting a restore.

#@param BACKUP_ID [0-9]+

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

request_db delimited <<EOF | tar xvz -C /
SELECT data FROM backups WHERE id = $BACKUP_ID LIMIT 1
EOF