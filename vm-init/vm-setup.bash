#!/bin/bash

echo "

Doing cert and proxy stuff

"

sudo cp proxy.crt /usr/share/ca-certificates/.
echo proxy.crt | sudo tee -a /etc/ca-certificates.conf >/dev/null
sudo update-ca-certificates

echo "http_proxy=http://10.120.0.200:8080/
https_proxy=http://10.120.0.200:8080/
no_proxy=10.0.0.0/8,10.*
export http_proxy
export https_proxy
export no_proxy" >>~/.bashrc

source .bashrc

echo "use_proxy=yes
http_proxy=http://10.120.0.200:8080/
https_proxy=http://10.120.0.200:8080/
no_proxy=10.0.0.0/8" >>.wgetrc

cp -r ace/fw-docker/src/* .
cp ace/fw-docker/src/.ansible.cfg .
cp -r ace/fw-ansible .

# Update and upgrade the system
sudo apt-get update
# sudo apt-get upgrade -y

# Install the necessary packages
sudo apt-get install -y \
  curl \
  wget \
  ca-certificates \
  python3 \
  python3-pip \
  ansible 

# Install Docker and Docker Compose
# Copied instructions taken from https://docs.docker.com/engine/install/ubuntu/

echo "


Prep for Docker install


"
# Add Docker's official GPG key:
sudo install -m 0755 -d /etc/apt/keyrings
wget http://download.docker.com/linux/ubuntu/gpg
# curl -fsSL https://download.docker.com/linux/ubuntu/gpg
sudo mv gpg /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" |
  sudo tee /etc/apt/sources.list.d/docker.list >/dev/null

echo "

Install Docker

"

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo mkdir -p /etc/docker/certs.d/registry-1.docker.io
sudo cp proxy.crt /etc/docker/certs.d/registry-1.docker.io/ca.crt

# Configure Docker to use a proxy
echo '{
  "proxies": {
    "http-proxy": "http://10.120.0.200:8080/",
    "https-proxy": "http://10.120.0.200:8080/",
    "no-proxy": "127.0.0.0/8"
  }
}' | sudo tee /etc/docker/daemon.json >/dev/null

# Restart Docker to apply the changes
sudo systemctl restart docker

ansible-galaxy collection install fw-ansible -vv
pip install --break-system-packages -r ~/fw-ansible/requirements.txt
chmod +x scripts/*


# Install Splunk
#
# wget -O splunk.deb "https://download.splunk.com/products/splunk/releases/9.4.1/linux/splunk-9.4.1-e3bdab203ac8-linux-amd64.deb"
# sudo dpkg -i splunk.deb -y
