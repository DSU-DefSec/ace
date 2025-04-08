#!/usr/bin/env bash 
read -p "Cisco FTD IP: " ftd_ip
read -p "Cisco FMC IP: " fmc_ip
read -p "Cisco PW: " cisco_pw


#Line below came from chatgpt
api_key=$(curl -s -k -H "Content-Type: application/x-www-form-urlencoded" -X POST "https://${palo_ip}/api/?type=keygen" -d "user=admin&password=${palo_pw}" | grep -oP '(?<=<key>)[^<]+')

# Output to fw.yml 
cat >> data/inv.yml <<EOF
cisco:
  hosts:
    ${ftd_ip}:
      username: admin
      password: {{ cisco_pw }}
      fw: fw2
  vars:
    ftd_ip: ${ftd_ip}
EOF

cat ~/data/inv.yml