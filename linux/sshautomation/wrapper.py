#Write wrapper to handle ssh connections? Replacing paramiko?
import subprocess;
import time;
import datetime;
def run_ssh_command(host, cmd):
    try:
        # Use subprocess to run the SSH command
        process = subprocess.Popen(
            ["ssh", host, cmd],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True  # For Python 3.7 and later
        )

        # Capture the output and errors
        stdout, stderr = process.communicate()

        # Print the output
        print("Output:")
        print(stdout)

        # Print any errors
        if stderr:
            print("Errors:")
            print(stderr)

    except Exception as e:
        print(f"Error: {e}")

def push_to_scp(host, cmd, file, path):
    try:
        # Use subprocess to run the SCP command
        scp_command = f"scp {file} {host}:{path}"
        process = subprocess.Popen(
            scp_command,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True  # For Python 3.7 and later
        )

        # Capture the output and errors
        stdout, stderr = process.communicate()

        # Print the output
        print("Output:")
        print(stdout)

        # Print any errors
        if stderr:
            print("Errors:")
            print(stderr)

    except Exception as e:
        print(f"Error: {e}")


import subprocess

def pull_from_scp(host, remote_file, local_path):
    try:
        # Use subprocess to run the SCP command for pulling
        scp_command = f"scp {host}:{remote_file} {local_path}"
        process = subprocess.Popen(
            scp_command,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True  # For Python 3.7 and later
        )

        # Capture the output and errors
        stdout, stderr = process.communicate()

        # Print the output
        print("Output:")
        print(stdout)

        # Print any errors
        if stderr:
            print("Errors:")
            print(stderr)

    except Exception as e:
        print(f"Error: {e}")



def log_command_execution(command, result, box):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open('Command_Log.txt', 'a') as log_file:
        log_file.write(f"[{timestamp}] Box: {box}\n")
        log_file.write(f"Command: {command}\n")
        log_file.write(f"Result:\n{result}\n")
        log_file.write("=" * 40 + "\n\n")
