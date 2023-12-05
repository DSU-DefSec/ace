import os
import paramiko
import yaml

from datetime import datetime

def log_command_execution(command, result, box):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open('Command_Log.txt', 'a') as log_file:
        log_file.write(f"[{timestamp}] Box: {box}\n")
        log_file.write(f"Command: {command}\n")
        log_file.write(f"Result:\n{result}\n")
        log_file.write("=" * 40 + "\n\n")

def Root_Password_Changes(ssh, root_password, box):
    command = f'passwd root {root_password}'
    _, stdout, _ = ssh.exec_command(command)
    result = stdout.read().decode('utf-8').strip()
    log_command_execution(command, result, box)

def User_Password_Changes(ssh, user_password, box):
    command = f'for u in $(cat /etc/passwd | grep -v ^root: | cut -d: -f1); do echo "$u:{user_password}" | chpasswd; done'
    _, stdout, _ = ssh.exec_command(command)
    result = stdout.read().decode('utf-8').strip()
    log_command_execution(command, result, box)

def files_to_backup(ssh, files_to_backup, box):
    for file in files_to_backup:
        command = f'cp {file} /root/{file}'
        _, stdout, _ = ssh.exec_command(command)
        result = stdout.read().decode('utf-8').strip()
        log_command_execution(command, result, box)

def firewall_stuff(ssh, ports, box):
    # Implement this here
    command = "Your Firewall Command Here"
    _, stdout, _ = ssh.exec_command(command)
    result = stdout.read().decode('utf-8').strip()
    log_command_execution(command, result, box)

def audit_Users(ssh, box):
    _, stdout, _ = ssh.exec_command("grep -E '/bash$|/sh$' /etc/passwd")
    users_data = stdout.read().decode('utf-8').strip()
    section_header = f"=== {box} ==="
    data_to_write = f"{section_header}\n{users_data}\n\n"
    with open('Audited_Users.txt', 'a') as file:
        file.write(data_to_write)
    log_command_execution("Audit Users", users_data, box)

def execute_BashScript(ssh, script, box):
    with open(script, 'r') as bash_script:
        for line in bash_script:
            _, stdout, _ = ssh.exec_command(line)
            result = stdout.read().decode('utf-8').strip()
            log_command_execution(line, result, box)
def change_SSH_Settings(ssh,box):
    #Maybe move to yml undecided atm
    ssh_commands = [
    "sed -i '1s;^;PermitRootLogin yes\n;' /etc/ssh/sshd_config",
    "sed -i '1s;^;PubkeyAuthentication no\n;' /etc/ssh/sshd_config",
    "sed -i '1s;^;UseDNS no\n;' /etc/ssh/sshd_config",
	"sed -i '1s;^;PermitEmptyPasswords no\n;' /etc/ssh/sshd_config",
	"sed -i '1s;^;AddressFamily inet\n;' /etc/ssh/sshd_config"
    # Add more commands as needed
]
    for command in ssh_commands:
        _, stdout, _ = ssh.exec_command(line)
        result = stdout.read().decode('utf-8').strip()
        log_command_execution(line, result, box)

def modify_php_settings(ssh, php_config_path, settings, box):
    for setting, value in settings.items():
        command = f"echo '{setting} = {value}' >> {php_config_path}"
        _, stdout, _ = ssh.exec_command(command)
        result = stdout.read().decode('utf-8').strip()
        log_command_execution(command, result, box)


def run_single_command(ssh,box,cmd):
    _, stdout, _ = ssh.exec_command(cmd)
    result = stdout.read().decode('utf-8').strip()
    log_command_execution(cmd, result, box)





# Read the YAML data from a file
config_path = 'config.yml'
with open(config_path, 'r') as file:
    data = yaml.safe_load(file)

# Extract the files_to_backup entry
enabled_modules = data.get('enabled_modules', [])
files_to_backup_entry = data.get('files_to_backup', [])
php_settings_entry = data.get('php_settings', {})
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

