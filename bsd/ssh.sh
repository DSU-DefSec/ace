#!/bin/bash
# CHECK IF SSH IS RUNNING, if so, print message
if [ $(systemctl is-active ssh | grep -vw "active" 2>/dev/null) ]
then
	echo "SSH is DOWN"
fi

# secure ssh
sed -i '1s;^;PermitRootLogin No\n;' /etc/ssh/sshd_config
sed -i '1s;^;PubkeyAuthentication No\n;' /etc/ssh/sshd_config
sed -i '1s;^;UsePam No\n;' /etc/ssh/sshd_config
sed -i '1s;^;UseDns No\n;' /etc/ssh/sshd_config
sed -i '1s;^;AddressFamily inet\n;' /etc/ssh/sshd_config

# restart
systemctl restart ssh
