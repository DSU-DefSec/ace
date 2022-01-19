#!/bin/bash

# backup /etc/passwd just in case
cp /etc/passwd /etc/passwd.bak
chmod 644 /etc/passwd.bak

# set rbash for non-root users
head -1 /etc/passwd > /etc/pw
sed -n '1!p' /etc/passwd | sed 's/\/bin\/bash/\/bin\/rbash/g' >> /etc/pw

mv /etc/pw /etc/passwd
