#!/bin/bash

# Function to check if a command is available
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install fail2ban using apt
install_fail2ban_apt() {
    sudo apt update
    sudo apt install -y fail2ban
}

# Function to install fail2ban using yum
install_fail2ban_yum() {
    sudo yum install -y epel-release # Enable EPEL repository for CentOS/RHEL
    sudo yum install -y fail2ban
}

# Function to install fail2ban using dnf (Fedora)
install_fail2ban_dnf() {
    sudo dnf install -y fail2ban
}

# Determine the package manager based on the Linux distribution
if command_exists apt; then
    echo "Detected Debian/Ubuntu-based distribution."
    install_fail2ban_apt
elif command_exists yum; then
    echo "Detected CentOS/RHEL-based distribution."
    install_fail2ban_yum
elif command_exists dnf; then
    echo "Detected Fedora-based distribution."
    install_fail2ban_dnf
else
    echo "Unsupported distribution. Cannot install fail2ban."
    exit 1
fi

# Enable and start fail2ban service
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Enable SSH protection in fail2ban configuration
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo sed -i '/^\[sshd\]$/,/^\[/ s/enabled = false/enabled = true/' /etc/fail2ban/jail.local

# Restart fail2ban to apply changes
sudo systemctl restart fail2ban

echo "fail2ban installed, started, and configured for SSH protection."


