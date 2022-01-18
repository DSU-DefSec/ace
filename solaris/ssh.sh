#!/bin/bash
# CHECK IF SSH IS RUNNING, if so, print message
svcs ssh
if [ echo $? -eq 0 ]
then
	echo "SSH server running on Solaris"
fi

# secure sshd_config
echo "PermitRootLogin No" > ssh.txt
echo "PubkeyAuthentication No" >> ssh.txt
echo "UsePam No" >> ssh.txt
echo "UseDns No" >> ssh.txt
echo "AddressFamily inet" >> ssh.txt

cp ssh.txt /etc/ssh/sshd_config
rm ssh.txt

# restart
svcadm restart ssh