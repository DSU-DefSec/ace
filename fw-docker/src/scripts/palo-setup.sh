#!/usr/bin/env bash 
read -p "Palo IP: " palo_ip
read -p "Palo PW: " palo_pw
read -p "Team Num: " team_num
read -p "Local DNS: " local_dns

# ssh-keygen -t rsa -b 4096 -C "ansible@localhost" -f ~/.ssh/id_rsa -N ""


#Line below came from chatgpt
api_key=$(curl -s -k -H "Content-Type: application/x-www-form-urlencoded" -X POST "https://${palo_ip}/api/?type=keygen" -d "user=admin&password=${palo_pw}" | grep -oP '(?<=<key>)[^<]+')

# Output to fw.yml 
cat >> data/inv.yml <<EOF
palo:
  hosts:
    ${palo_ip}:
      ip_address: ${palo_ip}
      api_key: ${api_key}
      lan_net: 10.${team_num}.${team_num}.
      lan_mask: 10.${team_num}.${team_num}.0/24
      local_dns: ${local_dns}
      #desired_version: 11.2.4
EOF

cat ~/data/inv.yml
