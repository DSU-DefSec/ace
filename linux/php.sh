#!/bin/bash

# find path of php.ini
if [ -f /etc/php.ini ]; then
	ini=/etc/php.ini
elif [ -f /etc/apache2/php.ini ]; then
	ini=/etc/php.ini
else
	echo "[*] default php.ini path not found. I saved config options in /tmp/php.ini. Copy this file to one of the following locations: "
	ini=/tmp/php.ini
	find / -name "php.ini" 2>/dev/null
fi

echo "disable_functions = shell_exec, exec, passthru, proc_open, popen, system, phpinfo" >> $ini
echo "max_execution_time = 3" >> $ini
echo "register_globals = off" >> $ini
echo "magic_quotes_gpc = on" >> $ini 
echo "allow_url_fopen = off" >> $ini 
echo "allow_url_include = off" >> $ini 
echo "display_errors = off" >> $ini 
echo "short_open_tag = off" >> $ini 
echo "session.cookie_httponly = 1" >> $ini 
echo "session.use_only_cookies = 1" >> $ini 
echo "session.cookie_secure = 1" >> $ini 
