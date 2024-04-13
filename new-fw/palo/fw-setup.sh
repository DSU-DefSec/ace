# Vars
read -p "Palo IP: " palo_ip
read -p "Palo PW: " palo_pw

# get base stuff
apt update
apt install -y ansible-core
apt install -y python3-pip

# install specific palo mods
ansible-galaxy collection install paloaltonetworks.panos
pip install -r requirements.txt

# Needs to be modified to run in script
    # ask for password
curl -H "Content-Type: application/x-www-form-urlencoded" -X POST https://$[palo_ip]/api/?type=keygen -d 'user=admin&password=$[palo_pw]'

# output to fw.yml file for invintory and encrypt with ansible-vault for another password
echo "all:
  hosts:
    firewall:
      hosts: '$palo_ip'
      api_key: <api_key> 
      " > fw.yml
      # ansible_python_interpreter: /usr/bin/python3

# encrypt vault
ansible-vault encrypt fw.yml
