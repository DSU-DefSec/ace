# Non-root user password changes.

if [[ -z $PW_LOC ]]; then
    PW_LOC="/root/.pw"
fi

if [[ -z $ENACT_PW ]]; then

    # Generate new passwords for all users.
    echo "[+] Password changes for $HOSTNAME:"
    for u in $(cat /etc/passwd | grep -E "/bin/.*sh" | grep -v "root" | cut -d":" -f1); do

        # Hash the current nanosecond with a salt
        ns=$(date +%N)
        pw=$(echo "${ns}$RANDOM" | sha256sum | cut -d" " -f1 | cut -c -12)

        # Print the password to the terminal
        echo "$u,$pw"
        echo "$u,$pw" >> $PW_LOC

    done

else

    # Execute password changes (after they are approved)
    for creds in $(cat $PW_LOC); do
        u=$(echo $creds | cut -d "," -f1)
        pw=$(echo $creds | cut -d "," -f2)
        echo "$u:$pw" | chpasswd
    done

    echo "[+] Enacted password changes for $HOSTNAME."

    rm $PW_LOC
    unset PW_LOC
    unset ENACT_PW
fi
