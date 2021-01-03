#!/usr/bin/bash

GITY_CONF_DIR=/etc/gity

echo "Creating default configurations in $GITY_CONF_DIR ..."
sudo mkdir $GITY_CONF_DIR
sudo cp $(dirname $BASH_SOURCE)/conf/pg-default.json $GITY_CONF_DIR/pg.json
sudo cp $(dirname $BASH_SOURCE)/conf/redis-default.json $GITY_CONF_DIR/redis.json
sudo cp $(dirname $BASH_SOURCE)/conf/git-default.json $GITY_CONF_DIR/git.json
echo "Done."
