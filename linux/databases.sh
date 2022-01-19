# find if a database is present, try to log in with default creds (if applicable), harden if possible
service mysql status > /dev/null
if [ $? -eq 0 ]; then
	echo "[+] mysql/mariadb is active!"
	mysql -u root -e "quit"
	if [ $? -eq 0 ]; then
		echo "[!] Able to login with empty password on the mysql database!"
	fi
	# Back up databases
	mysqldump --all-databases > backup.sql
	ns=$(date + %N)
	pass=$(echo "{ns}$REPLY" | sha256sum | cut -d" " -f1)
	echo "[+] Backed up database. Key for database dump: $pass"
	gpg -c --pinentry-mode=loopback --passphrase $pass backup.sql
	rm backup.sql
fi

service postgresql status > /dev/null
if [ $? -eq 0 ]; then
	echo "[+] postgres is installed!"
fi
