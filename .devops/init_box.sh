#!/bin/bash

# Usage example: ./init_box.sh rolocha-staging staging
#   assuming you have a rolocha-staging SSH entry in ~/.ssh/config

# boxid is the ssh identifier
boxid=$1
boxenv=$2
app_name=rolocha-web

# Run the box init script (basic installations and working dir setup)
ssh $boxid 'sudo bash -s' < ./init_box_remote.sh

# Transfer the docker-composes 
scp ../docker-compose.yml $boxid:~/$app_name/docker-compose.yml
scp ./docker-compose.$boxenv.yml $boxid:~/$app_name/docker-compose.override.yml

# Transfer the deployment Makefile
scp ./Makefile $boxid:~/$app_name/Makefile

# Transfer the nginx configuration
ssh $boxid "mkdir -p ~/$app_name/nginx-conf"
scp ./nginx-conf/nginx-$boxenv.conf $boxid:~/$app_name/nginx-conf/nginx-$boxenv.conf

# Transfer the appropriate .env file over
scp ../.env.$2 $1:~/$app_name/.env
