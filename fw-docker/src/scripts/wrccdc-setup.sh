#!/usr/bin/env bash 
read -p "FW IP: " fw_ip
read -p "FW User: " fw_user
read -p "FW Wan net: " fw_wan_net

# Output to fw.yml 
cat >> ~/data/inv.yml <<EOF
wrccdc_fw:
  hosts:
    ${fw_ip}:
      ansible_user: ${fw_user}
      wan_net: ${fw_wan_net}
      wan_mask: ${fw_wan_net}0/24
      lan_net: 192.168.220.
      lan_mask: 192.168.220.0/24
EOF

cat ~/data/inv.yml

