# get base stuff
apt update
apt install -y ansible-core
apt install -y python3-pip

# install specific palo mods
ansible-galaxy collection install paloaltonetworks.panos
pip install -r requirements.txt

# Needs to be modified to run in script
    # ask for password
curl -H "Content-Type: application/x-www-form-urlencoded" -X POST https://firewall/api/?type=keygen -d 'user=<user>&password=<password>'


# output to fw.yml file for invintory and encrypt with ansible-vault for another password
echo "all:
  hosts:
    firewall:
      hosts: <firewall>
      ip_address: <password>
      api_key: <api_key>
      ansible_python_interpreter: /usr/bin/python3" > fw.yml

# encrypt vault
ansible-vault encrypt fw.yml
