#! /bin/bash

app_name=nomus-web

# Install make
sudo apt install make

# Install Docker
apt-get update
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
apt-key fingerprint 0EBFCD88
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
apt-get update
apt-get install -y docker-ce

# Install Docker Compose
curl -L https://github.com/docker/compose/releases/download/1.16.1/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
docker-compose --version

# Enable non-root Docker access
usermod -aG docker ubuntu
newgrp docker

# Start the Docker daemon
sudo service docker start

# Install AWS CLI (need it later to pull Docker images from ECS)
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
sudo apt install unzip # Also need to install unzip to extract the cli installer
unzip awscliv2.zip
sudo ./aws/install
rm -rf ./aws
rm awscliv2.zip

# Set up working directory
mkdir ~/$app_name
chmod +rw ~/$app_name
chown ubuntu ~/$app_name
cd ~/$app_name

# Add useful aliases
echo 'alias dc="docker-compose"' >> ~/.bash_aliases