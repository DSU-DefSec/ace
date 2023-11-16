import os
import paramiko
import yaml

def Root_Password_Changes(ssh, root_password):
    ssh.exec_command(f'passwd root {root_password}')

def User_Password_Changes(ssh, user_password):
    ssh.exec_command(f'for u in $(cat /etc/passwd|grep -v ^root:|cut -d: -f1);do echo "$u:{user_password}"|chpasswd;done')

def files_to_backup(ssh, files_to_backup):
    for file in files_to_backup:
        ssh.exec_command(f'cp {file} /root/{file}')
def firewall_stuff(ssh, ports):
    #Implement this here lol
    pass




# Read the YAML data from a file
config_path = 'config.yml'
with open(config_path, 'r') as file:
    data = yaml.safe_load(file)

# Extract the files_to_backup entry
enabled_modules = data.get('enabled_modules', [])
files_to_backup_entry = data.get('files_to_backup', [])

# Print the resulting files_to_backup entry
print(files_to_backup_entry)
with open("boxes.conf","r") as boxes:
    config_dict = {}
    for line in boxes:
        if '#' not in line:
            #Create base ssh config
            ssh = paramiko.SSHClient()
            components = line.strip().split(',')

            # Extract individual components
            ip_address = components[0]
            default_password = components[1]
            root_password = components[2]
            user_password = components[3]
            known_critical_services = components[4:]
            ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            ssh.connect(ip_address, username='root', password=default_password)
            if "Root_Password_Changes" in enabled_modules:
                Root_Password_Changes(ssh, root_password)

