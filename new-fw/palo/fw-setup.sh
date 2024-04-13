# get base stuff
apt update
apt install -y ansible-core
apt install -y python3-pip

# install specific palo mods
ansible-galaxy collection install paloaltonetworks.panos
pip install -r requirements.txt

# Needs to be modified to run in script
curl -H "Content-Type: application/x-www-form-urlencoded" -X POST https://firewall/api/?type=keygen -d 'user=<user>&password=<password>'
