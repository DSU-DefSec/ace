#!/bin/bash

# CHECK IF SSH IS RUNNING, if so, print message
if service sshd status > /dev/null; then
	echo "[+] SSH is active on this system."
fi

# secure ssh
# We're using root over SSH, so we enable it
sed -i '1s;^;PermitRootLogin Yes\n;' /etc/ssh/sshd_config
sed -i '1s;^;PubkeyAuthentication No\n;' /etc/ssh/sshd_config
sed -i '1s;^;UsePam No\n;' /etc/ssh/sshd_config
sed -i '1s;^;UseDns No\n;' /etc/ssh/sshd_config
sed -i '1s;^;AddressFamily inet\n;' /etc/ssh/sshd_config

# restart
systemctl restart ssh
