#!/bin/bash

# Template credit to CPP

# PATCH_URL will need to be changed once correct path is known during comp
PATCH_URL=http://10.120.0.9/Proxy_Certificates/certificate.crt
PROXY=10.120.0.200:8080                # This is what regionals was

RHEL(){
    sudo yum install -y ca-certificates
    # Install certificate
    curl -o cert.crt "$PATCH_URL"
    sudo cp cert.crt /etc/pki/ca-trust/source/anchors/
    sudo update-ca-trust

    # configure for yum
    echo "proxy=http://$PROXY" | sudo tee -a /etc/yum.conf >/dev/null
    echo "proxy=https://$PROXY" | sudo tee -a /etc/yum.conf >/dev/null

    echo "export http_proxy=\"$PROXY\"" | sudo tee -a /etc/environment >/dev/null
    echo "export https_proxy=\"$PROXY\"" | sudo tee -a /etc/environment >/dev/null
}

DEBIAN(){
    # download and install certificate
    sudo apt-get install -y ca-certificates
    sudo apt-get install -y curl
    curl -o cert.crt "$PATCH_URL"
    sudo cp cert.crt /usr/local/share/ca-certificates/
    sudo update-ca-certificates

    #configure for apt
    echo "Acquire::http::Proxy \"$PROXY\";" | sudo tee -a /etc/apt/apt.conf >/dev/null
    echo "Acquire::https::Proxy \"$PROXY\";" | sudo tee -a /etc/apt/apt.conf >/dev/null

    #configure for environment
    echo "export http_proxy=\"$PROXY\"" | sudo tee -a /etc/environment >/dev/null
    echo "export https_proxy=\"$PROXY\"" | sudo tee -a /etc/environment >/dev/null
}

UBUNTU(){
    DEBIAN
}

ALPINE(){
    apk add --no-cache ca-certificates

    # Install certificate
    curl -o cert.crt "$PATCH_URL"
    sudo cp cert.crt /usr/local/share/ca-certificates/
    sudo update-ca-certificates

    # Configure proxy
    echo "http://$PROXY/alpine/latest/main" | sudo tee -a /etc/apk/repositories >/dev/null
    echo "https://$PROXY/alpine/latest/main" | sudo tee -a /etc/apk/repositories >/dev/null
    echo "http://$PROXY/alpine/latest/community" | sudo tee -a /etc/apk/repositories >/dev/null
    echo "https://$PROXY/alpine/latest/community" | sudo tee -a /etc/apk/repositories >/dev/null

    #configure for environment
    echo "export http_proxy=\"$PROXY\"" | sudo tee -a /etc/environment >/dev/null
    echo "export https_proxy=\"$PROXY\"" | sudo tee -a /etc/environment >/dev/null
}

SLACK(){
    echo "its fucked I dont even know what slack is"
}

if command -v yum >/dev/null ; then
    RHEL
elif command -v apt-get >/dev/null ; then
    if $(cat /etc/os-release | grep -qi Ubuntu); then
        UBUNTU
    else
        DEBIAN
    fi
elif command -v apk >/dev/null ; then
    ALPINE
elif command -v slapt-get >/dev/null || (cat /etc/os-release | grep -i slackware) ; then
    SLACK
fi





