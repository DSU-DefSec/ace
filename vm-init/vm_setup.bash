#!/bin/bash

HTTP_PROXY="https://10.120.0.200:8080"
HTTPS_PROXY="https://10.120.0.200:8080"

cp proxy.crt /etc/docker/certs.d/registry-1.docker.io/ca.crt

# Update and upgrade the system
sudo apt-get update
sudo apt-get upgrade -y

# Install the necessary packages
sudo apt-get install -y \
    curl \
    openssh-server \
    ssh \
    wget

# Install Docker and Docker Compose 
# Copied instructions taken from https://docs.docker.com/engine/install/ubuntu/

# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Configure Docker to use a proxy
echo '{
  "proxies": {
    "http-proxy": "https://10.120.0.200:8080",
    "https-proxy": "https://10.120.0.200:8080",
    "no-proxy": "*.test.example.com,.example.org,127.0.0.0/8"
  }
}' | sudo tee /etc/docker/daemon.json > /dev/null

# Restart Docker to apply the changes
sudo systemctl restart docker

# Install Splunk
#
# wget -O splunk.deb "https://download.splunk.com/products/splunk/releases/9.4.1/linux/splunk-9.4.1-e3bdab203ac8-linux-amd64.deb"
# sudo dpkg -i splunk.deb -y


