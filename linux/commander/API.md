# Commander API Documentation

## Auth

HTTP Digest authentication is used.
For browsers, a login window will show up automatically.
For `cURL`, use the `--digest` and `-u` options.

Authentication is done via a `.htdigest` file.
The `htdigest` utility can be used to create and modify users.
There is currently no other way to modify users.

## Endpoints

### `/www/`
- Contains static files

### `/scripts`
- With no additional path, it returns a list of scripts
  - Note that script content is stripped out
- With a path, it returns the content of the script
- A POST request allows for a script upload
  - Body is just the raw script contents
```json
[
  {
    "Name": "scripts/linpeas.sh",
    "Desc": "",
    "Params": {},
    "Content": "",
    "Exe": "/bin/sh"
  },
  {
    "Name": "scripts/test.sh",
    "Desc": "A simple script to test functionality.\nDescriptions can have multiple lines!\n\nParameter Descriptions:\n- STATUS_CODE: the code to exit with\n",
    "Params": {
      "STATUS_CODE": "\\d+"
    },
    "Content": "",
    "Exe": "/bin/ash"
  },
  {
    "Name": "scripts/uploaded.sh",
    "Desc": "Does absolutely nothing\n",
    "Params": {},
    "Content": "",
    "Exe": "/bin/ash"
  }
]
```

### `/output`
- With no path, returns a json object of the available outputs
- With a path, it returns associated output (Or a directory listing)
- The directory structure is `TIMESTAMP_SCRIPT/TARGET.cast`
  - `TIMESTAMP`: RFC 3339-formatted timestamp
  - `SCRIPT`: Script name
  - `TARGET`: Name of the target
```json
{
  "2024-07-30T09:20:06-05:00_test.sh": [
    "output/2024-07-30T09:20:06-05:00_test.sh/SSH-Test.cast"
  ],
  "2024-07-30T09:20:32-05:00_test.sh": [
    "output/2024-07-30T09:20:32-05:00_test.sh/SSH-Test.cast"
  ],
  "2024-07-30T09:23:40-05:00_test.sh": [
    "output/2024-07-30T09:23:40-05:00_test.sh/SSH-Test.cast"
  ],
  "2024-07-30T09:29:52-05:00_test.sh": [
    "output/2024-07-30T09:29:52-05:00_test.sh/SSH-Test.cast"
  ],
  "2024-07-30T09:30:22-05:00_test.sh": [
    "output/2024-07-30T09:30:22-05:00_test.sh/SSH-Test.cast"
  ],
  "2024-07-30T09:31:56-05:00_test.sh": [
    "output/2024-07-30T09:31:56-05:00_test.sh/SSH-Test.cast"
  ],
  "2024-07-30T09:36:02-05:00_test.sh": [
    "output/2024-07-30T09:36:02-05:00_test.sh/SSH-Test.cast"
  ],
  "2024-07-30T09:36:24-05:00_test.sh": [
    "output/2024-07-30T09:36:24-05:00_test.sh/SSH-Test.cast"
  ],
  "2024-07-30T09:36:58-05:00_test.sh": [
    "output/2024-07-30T09:36:58-05:00_test.sh/SSH-Test.cast"
  ],
  "2024-07-30T09:39:06-05:00_test.sh": [
    "output/2024-07-30T09:39:06-05:00_test.sh/SSH-Test.cast"
  ],
  "2024-07-30T15:06:42-05:00_test.sh": null,
  "2024-07-30T15:07:19-05:00_test.sh": [
    "output/2024-07-30T15:07:19-05:00_test.sh/SSH-Test.cast"
  ],
  "2024-07-30T15:09:34-05:00_test.sh": [
    "output/2024-07-30T15:09:34-05:00_test.sh/SSH-Test.cast"
  ],
  "2024-07-30T15:20:05-05:00_test.sh": [
    "output/2024-07-30T15:20:05-05:00_test.sh/SSH-Test.cast"
  ],
  "2024-08-16T11:08:24-05:00_test.sh": [
    "output/2024-08-16T11:08:24-05:00_test.sh/SSH-Test.cast"
  ]
}
```

### `/config`
- Returns the config as JSON
- Only read, no write

Example:
```json
{
  "Endpoints": {
    "SSH-Test": {
      "Host": "10.0.2.123",
      "Port": 22,
      "User": "root",
      "Passwords": null,
      "Keys": null,
      "Env": {
        "STATUS_CODE": "0"
      }
    }
  },
  "Scripts": "scripts",
  "Output": "output",
  "Passwords": [
    "Password1!"
  ],
  "Keys": null,
  "Env": {
    "LANG": "en-US"
  },
  "Passgen": {
    "Rounds": 1000,
    "Words": 2,
    "WordLength": 5,
    "Numbers": 2,
    "NumberLength": 4
  },
  "Database": "data.db",
  "HTDigest": ".htdigest"
}
```

Config Structure:
```go
type EndpointConfig struct {
	// Name of endpoint (Try to limit to alphanumeric/underscores/hyphens/periods, please. This eventually ends up in a file path)
	Host      string            // IP or domain name
	Port      int               // Port (Default 22)
	User      string            // User to log in as
	Passwords []string          // Passwords to try
	Keys      []string          // Private keys to try
	Env       map[string]string // Hard coded environment variables
}

type Config struct {
	Endpoints map[string]EndpointConfig // List of endpoints (Key is endpoint name)
	Scripts   string                    // Path to directory of scripts
	Output    string                    // Path to directory to store script output in
	Passwords []string                  // Global Passwords to try
	Keys      []string                  // Global keys to try
	Env       map[string]string         // Global environment variables
	Passgen   PassgenOptions            // Passgen Config
	Database  string                    // Path to the script database
	HTDigest  string                    // Path to .htdigest file for webui
}
```

### `/db`
- Allows access to the script database
- POST body is raw SQL
- Query parameters:
  - `format`
    - `tsv`: tab-separated values
    - `csv`: comma-separated values
    - `json`: list of objects mapping columns to values
    - `delimited`: Allows manually setting the field separator (`fs`) and record separator (`rs`)
    - If no format is given, the response body will contain a line denoting how many rows were affected.

Example:
`curl --digest -u 'admin:Password1!' 'http://commander.lan/db?format=json' --data-binary 'SELECT * FROM USERS;'`
Response: (NOTE: json is not pretty printed)
```json
[
  {
    "user": "root",
    "pass": "x",
    "uid": "0",
    "gid": "0",
    "info": "root",
    "home": "/root",
    "shell": "/bin/ash",
    "ip": "10.0.2.123"
  },
  {
    "user": "guest",
    "pass": "x",
    "uid": "405",
    "gid": "100",
    "info": "guest",
    "home": "/dev/null",
    "shell": "/sbin/nologin",
    "ip": "10.0.2.123"
  },
  {
    "user": "nobody",
    "pass": "x",
    "uid": "65534",
    "gid": "65534",
    "info": "nobody",
    "home": "/",
    "shell": "/sbin/nologin",
    "ip": "10.0.2.123"
  },
  {
    "user": "santa",
    "pass": "x",
    "uid": "1000",
    "gid": "1000",
    "info": "Linux User,,,",
    "home": "/home/santa",
    "shell": "/bin/ash",
    "ip": "10.0.2.123"
  },
  {
    "user": "admin",
    "pass": "x",
    "uid": "1001",
    "gid": "1001",
    "info": "Linux User,,,",
    "home": "/home/admin",
    "shell": "/bin/ash",
    "ip": "10.0.2.123"
  }
]
```

### `/ssh`
- Allows starting an SSH job
- Takes the same parameters as CLI, but as JSON
- Returns an error or "Success" on success
  - May change this later to get some form of useful output

Example request:
```json
{
    "targets": ["SSH-Test"],
    "scripts": ["test.sh"],
    "env": {
        "STATUS_CODE": "0"
    }
}
```

Request structure:
```go
type SSHArgs struct {
	Targets     []string
	Scripts     []string
	Env         map[string]string
	NoPassgen   bool `default:"false"`
	Interactive bool `default:"true"`  // Not relevant for web
	Echo        bool `default:"false"` // Not relevant for web
}
```

# Script Format
Scripts can have metadata
- If a shebang is present, the executable is used to run the script (by passing the script contents to stdin)
- There are several comment meta tags
  - `#@param NAME VALIDATOR` registers a parameter and validator. The parameter name must only contain uppercase alphanumeric characters and underscores, and it is passed as an environment variable. The parameters are validated using the validator expression before being passed in
  - `#@desc` Everything after this directive is treated as a line of the description for the script. They do not have to be consecutive, and are concatenated in the order they appear.
  - `#@port NAME NUMBER` Forwards port `NUMBER` of the client to a random port on the server. The script can retrive the port number via the environment variable specified by `NAME`. (Same rules apply as param names)
- Additionally, the database URL and credentials are given by the `CMDR_DB_URL` and `CMDR_DB_USER`/`CMDR_DB_PASS` variables, respectively.

Example:
```bash
#!/bin/ash
#@desc A simple script to test functionality.
#@desc Descriptions can have multiple lines!
#@desc
#@desc Parameter Descriptions:
#@desc - STATUS_CODE: the code to exit with

#@param STATUS_CODE \d+

#@port GIT_PORT

set -e

id
printenv

# "admin:password"
request_db() {
    REQ_URL="$CMDR_DB_URL?nonce=$(tr -cd '[:alnum:]' </dev/urandom | head -c $(($RANDOM % 192 + 64)))"
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
    \"ip\" TEXT
);
DELETE FROM users;" \
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
        ip
    ) VALUES (
        \"$PASSWD_USER\",
        \"$PASSWD_PASS\",
        \"$PASSWD_UID\",
        \"$PASSWD_GID\",
        \"$PASSWD_INFO\",
        \"$PASSWD_HOME\",
        \"$PASSWD_SHELL\",
        \"$ADDR\"
    );" \
    # >/dev/null
done < /etc/passwd

for i in $(seq 100);  do sleep 0.01; printf '\r%d / 100' $i; done; echo

git clone "http://127.0.0.1:$GIT_PORT"

exit $STATUS_CODE
```