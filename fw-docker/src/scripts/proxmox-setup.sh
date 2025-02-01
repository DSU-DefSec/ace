#!/usr/bin/env bash 
read -p "Proxmox IP: " prox_ip
read -p "Proxmox User: " prox_user
read -p "Proxmox PW: " prox_pw

# Output to fw.yml 
cat >> data/inv.yml <<EOF
proxmox:
  hosts:
    ${prox_ip}:
      ansible_user: ${prox_user}
      ansible_password: ${prox_pw}
EOF

cat ~/data/inv.yml

