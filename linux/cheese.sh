#!/bin/bash

# remove gcc and other compilers
rm `which nc` `which wget` `which gcc` `which cmake`
echo "[+] Removed common 'bad' binaries."

# red team backdoor
cat << 'EOF' > /bin/redd
#!/bin/bash
echo "Caught one boys!" >> /var/log/honeypot
ri(){
    echo -n "root@$HOSTNAME:~# "
    read i; if [ -n "$i" ]; then
      echo "-bash: $i: command not found"
      echo "$(date +"%A %r") -- $i" >> /var/log/honeypot
    fi; ri
}
trap "ri" SIGINT SIGTSTP exit; ri
EOF

chmod +x /bin/redd
touch /var/log/honeypot
chmod 722 /var/log/honeypot

echo "[+] Set up honeypot, tail /var/log/honeypot."
