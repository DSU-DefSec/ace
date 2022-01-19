# Generate user passwords

echo "[+] Password changes for $HOSTNAME:"
for u in $(cat /etc/passwd | grep -E "/bin/.*sh" | grep -v "root" | cut -d":" -f1); do

    # Hash the current nanosecond with a salt
    ns=$(date +%N)
    pw=$(echo "${ns}$RANDOM" | sha256sum | cut -d" " -f1 | cut -c -12)

    # Print the password to the terminal
    echo "$u,$pw"

# Terminate the for loop
done

echo "[.] Submit these to the scoring engine, then enact them when approved."

# Execute password changes (after they are approved)
# for creds in $(cat ./pws); do
#   u=$(cat $creds | cut -d "," -f1)
#   pw=$(cat $creds | cut -d "," -f2)
#   echo "$u:$pw" | chpasswd
#   echo "$u,$pw"
# done
