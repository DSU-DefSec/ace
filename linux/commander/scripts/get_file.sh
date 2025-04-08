#@desc Get file(s) from a box and upload to the database
#@desc The file(s) all go to the file UI
#@desc The `FILES` param is the same as backup.sh 

#@param FILES ((\\\\)*\\[$\\;&|]|[^$\\;&|\n])+
set -xe
request_db() {
    # Not 100% sure if this is required but it makes me feel better
    REQ_URL="$CMDR_DB_URL"
    test -n "$1" && REQ_URL="$REQ_URL&format=$1"
    curl \
    --digest \
    -u "$CMDR_DB_USER:$CMDR_DB_PASS" \
    -s \
    -H 'Content-Type: text/sql' \
    "$REQ_URL" \
    --data-binary @-
}

request_db <<"EOF"
CREATE TABLE IF NOT EXISTS files (
    "name" TEXT,
    "type" TEXT,
    "modified" INTEGER,
    "data" BLOB,
    "id" INTEGER PRIMARY KEY
)
EOF

for FILE in $FILES; do
    TYPE="$(file -ib "$FILE" || echo 'application/octet-stream')"
    MODIFIED="$(stat -c '%Y' "$FILE")"
    echo Uploading "$FILE"
    # Upload
    (
        printf "INSERT INTO files (name, type, modified, data) VALUES (\"%s\", \"%s\", %d, x'" "$FILE" "$TYPE" "$MODIFIED"
        # Backup (Unescaping the expansion of $FILES is intended)
        cat $FILE | xxd -p | tr -d '\n'
        echo "')"
    ) | request_db
done