#!/bin/bash

# Usage example: ./init_box.sh nomus-staging staging
#   assuming you have a nomus-staging SSH entry in ~/.ssh/config

# boxid is the ssh identifier
boxid=$1
boxenv=$2
app_name=nomus-web

# Run the box init script (basic installations and working dir setup)
ssh $boxid 'sudo bash -s' < ./init_box_remote.sh

# Transfer the env-specific files
scp ./$boxenv/* $boxid:~/$app_name

# Transfer the env-agnostic Makefile
scp ./Makefile $boxid:~/$app_name/Makefile