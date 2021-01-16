#!/usr/bin/env bash

GITY_CONF_DIR=/etc/gity
CONF_FILES=(
    "git" 
    "pg" 
    "redis" 
    "entities/repo" 
    "entities/user"
)

echo "Creating default configurations in $GITY_CONF_DIR ..."
sudo mkdir $GITY_CONF_DIR 2> /dev/null
sudo mkdir $GITY_CONF_DIR/entities 2> /dev/null

for conf_file in "${CONF_FILES[@]}"
do
    FILE="$GITY_CONF_DIR/$conf_file"
    if [ -f "$FILE.json" ]; then
        printf "File '"$FILE.json"' already exists. Do you want to replace it ? [Y/n] "
        read response
        if [ "$response" == "Y" ] || [ "$response" == "y" ]; then
            sudo cp $(dirname $BASH_SOURCE)/conf/$conf_file-default.json $GITY_CONF_DIR/$conf_file.json
        else
            continue
        fi
    else
        sudo cp $(dirname $BASH_SOURCE)/conf/$conf_file-default.json $GITY_CONF_DIR/$conf_file.json
    fi
done

echo "Done."
