#!/usr/bin/env bash 
read -p "Palo IP: " palo_ip
read -p "Palo PW: " palo_pw

sudo apt update
sudo apt install -y cowsay ansible-core python3-pip

sudo ansible-galaxy collection install paloaltonetworks.panos
pip install -r requirements.txt

#Line below came from chatgpt 😎
api_key=$(curl -s -k -H "Content-Type: application/x-www-form-urlencoded" -X POST "https://${palo_ip}/api/?type=keygen" -d "user=admin&password=${palo_pw}" | grep -oP '(?<=<key>)[^<]+')

# Output to fw.yml 
cat > fw.yml <<EOF
all:
  hosts:
    firewall:
      hosts:
        - ${palo_ip}
      vars:
        api_key: ${api_key}
EOF

sudo ansible-vault encrypt fw.yml