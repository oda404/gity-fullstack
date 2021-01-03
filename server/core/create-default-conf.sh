#!/usr/bin/bash

GITY_CONF_DIR=/etc/gity

sudo mkdir $GITY_CONF_DIR
sudo cp conf/pg-default.json $GITY_CONF_DIR/pg.json
sudo cp conf/redis-default.json $GITY_CONF_DIR/redis.json
sudo cp conf/git-default.json $GITY_CONF_DIR/git.json
