#!/bin/sh
users=`getent passwd | cut -d ":" -f 1`m                                                                                                      
for user in $users; do                 
    pass=`dd if=/dev/urandom count=4 bs=1 | digest -a md5 | cut -c -10`          
    hash=`/usr/sfw/bin/openssl passwd -1 "$pass"`                                                                                                                            
    echo "$user:$hash:::::::" >> /etc/shadow.bak  
    echo "$user,$pass"
done
mv /etc/shadow.bak /etc/shadow