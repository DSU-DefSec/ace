#!/usr/bin/env bash 
read -p "Palo IP: " palo_ip
read -p "Palo PW: " palo_pw

sudo apt update
sudo apt install -y ansible-core python3-pip

sudo ansible-galaxy collection install paloaltonetworks.panos
pip install -r requirements.txt

ssh-keygen -t rsa -b 4096 -C "ansible@localhost" -f ~/.ssh/id_rsa -N ""


#Line below came from chatgpt
api_key=$(curl -s -k -H "Content-Type: application/x-www-form-urlencoded" -X POST "https://${palo_ip}/api/?type=keygen" -d "user=admin&password=${palo_pw}" | grep -oP '(?<=<key>)[^<]+')

# Output to fw.yml 
cat > fw.yml <<EOF
firewall:
  hosts:
    ${palo_ip}:
  vars:
    ip_address: ${palo_ip}
    api_key: ${api_key}
EOF

cat ~/.ssh/id_rsa.pub
cat fw.yml

# sudo ansible-vault encrypt fw.yml
