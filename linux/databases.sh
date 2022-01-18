# find if a database is present, try to log in with default creds (if applicable), harden if possible
service mysql status /dev/null 2>&1
if [ $? -eq 0 ]; then
	echo "mysql is installed"
	mysql -u root -e "quit"
	if [ $? -eq 0 ]; then
		echo "Able to login with empty password on the mysql database"
	fi
fi

service postgresql status
if [ $? -eq 0 ]; then
	echo "Postgres is installed"
	mysql -u root -e "quit"
	if [ $? -eq 0 ]; then
		echo "Able to login with empty password on the postgres database"
	fi
fi

# Back up dataase
mysqldump --all-databases > backup.sql
ns=$(date + %N)
pass=$(echo "{ns}$REPLY" | sha256sum | cut -d" " -f1)
echo "[*] key for database dump: $pass"
gpg -c --pinentry-mode=loopback --passphrase $pass backup.sql
rm backup.sql