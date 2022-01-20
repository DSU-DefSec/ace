#!/bin/bash

# back up /etc/passwd just in case
cp /etc/passwd /etc/passwd.bak
chmod 644 /etc/passwd.bak

# set rbash for non-root users
head -1 /etc/passwd > /etc/pw
sed -n '1!p' /etc/passwd | sed 's/\/bin\/sh/\/bin\/bash/g' | \
    sed 's/\/bin\/bash/\/bin\/rbash/g' >> /etc/pw
mv /etc/pw /etc/passwd
echo "[+] Set all non-root shells to /bin/rbash."
