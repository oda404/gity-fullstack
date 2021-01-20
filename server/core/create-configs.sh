#!/usr/bin/env bash

GITY_CONF_DIR=/etc/gity
CONFIG_FILES=(
    "git" 
    "pg" 
    "redis" 
    "entities/repo" 
    "entities/user"
)

echo "Creating default configurations in $GITY_CONF_DIR ..."
sudo mkdir $GITY_CONF_DIR 2> /dev/null
sudo mkdir $GITY_CONF_DIR/entities 2> /dev/null

for config_file in "${CONFIG_FILES[@]}"
do
    FILE="$GITY_CONF_DIR/$config_file"
    if [ -f "$FILE.json" ]; then
        printf "File '"$FILE.json"' already exists. Do you want to replace it ? [Y/n] "
        read response
        if [ "$response" == "Y" ] || [ "$response" == "y" ]; then
            sudo cp $(dirname $BASH_SOURCE)/default-configs/$config_file.json $GITY_CONF_DIR/$config_file.json
        else
            continue
        fi
    else
        sudo cp $(dirname $BASH_SOURCE)/default-configs/$config_file.json $GITY_CONF_DIR/$config_file.json
    fi
done

echo "Done."
