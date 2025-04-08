## Structure

- `passgen`
  - Literally just generates passwords
  - Format for a secret is `USERNAME + HOSTNAME + SECRET`

- Scripts are stored in a directory passed as an argument/config.
- stdout/stderr is stored as asciicast v2 newline delimited JSON in a directory per job, with a subdirectory per host
  - Need to write some code to help manage and play the scripts back
  - Example:
    - `CMDR_Output/JOB_ID_testScript.sh/ssh-test-host.out.cast`
    - `CMDR_Output/JOB_ID_testScript.sh/ssh-test-host.err.cast`

## Script metadata
- Shebang - denotes the executable to use
- Parameters
  - Name and regex validator
  - If it's supposed to be optional, make sure the validator matches an empty string
    - It's up the script to handle empty values and fill in defaults
  - Name is first, and everything after the name and associated whitespace until the end of the line (minus trailing whitespace) is considered the validator
    - `#@param MAC_ADDRESS [0-9A-Fa-f]+(?::[0-9A-Fa-f]+){5}` MAC Address
    - `#@param MY_OPTIONAL_NUMBER \d+|` Matches basic integers (The `|` allows for an empty match, so it's optional)
- Description
  - The description is responsible for documenting both the script and the parameters
  - Example
    - `#@desc This is my script`
    - `#@desc Descriptions spanning multiple lines are joined with newlines`