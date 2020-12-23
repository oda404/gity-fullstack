#!/usr/bin/bash

#This script should be run on a fresh db installation

if [ $# -eq 0 ]; then
    echo "No password for user gity was provided"
else
    tsc --build
    ./migrations.sh
    ./functions.sh
    PASS="$1" ./create-gity-user.sh
    ./constraints.sh
fi
