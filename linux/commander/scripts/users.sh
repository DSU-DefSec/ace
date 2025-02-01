#!/bin/sh
#@desc Gets user information.

set -e

request_db() {
    # Not 100% sure if this is required but it makes me feel better
    REQ_URL="$CMDR_DB_URL"
    test -n "$2" && REQ_URL="$REQ_URL&format=$2"
    curl \
    --digest \
    -u "$CMDR_DB_USER:$CMDR_DB_PASS" \
    -s \
    -H 'Content-Type: text/sql' \
    "$REQ_URL" \
    --data-binary "$1"
}

ADDR=$(echo "$SSH_CONNECTION" | cut -d' ' -f3)

request_db \
"CREATE TABLE if NOT EXISTS users (
    \"user\" TEXT,
    \"pass\" TEXT,
    \"uid\" INTEGER,
    \"gid\" INTEGER,
    \"info\" TEXT,
    \"home\" TEXT,
    \"shell\" TEXT,
    \"ip\" TEXT,
    \"groups\" TEXT
);
DELETE FROM users WHERE ip = \"$ADDR\";" \
# >/dev/null

while IFS=: read PASSWD_USER PASSWD_PASS PASSWD_UID PASSWD_GID PASSWD_INFO PASSWD_HOME PASSWD_SHELL; do
    request_db \
    "INSERT INTO users (
        user,
        pass,
        uid,
        gid,
        info,
        home,
        shell,
        ip,
        groups
    ) VALUES (
        \"$PASSWD_USER\",
        \"$PASSWD_PASS\",
        \"$PASSWD_UID\",
        \"$PASSWD_GID\",
        \"$PASSWD_INFO\",
        \"$PASSWD_HOME\",
        \"$PASSWD_SHELL\",
        \"$ADDR\",
        \"$(groups "$PASSWD_USER")\"
    );" \
    # >/dev/null
done < /etc/passwd