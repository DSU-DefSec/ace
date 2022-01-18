#!/bin/bash
mv /etc/prof{i,y}le.d; mv /etc/prof{i,y}le
for f in ('~/.profile' '~/.bashrc' '~/.bash_login'); do 
    find /home /root -name "file" -exec rm {} \; 
done