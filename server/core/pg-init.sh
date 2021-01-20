#!/bin/bash

#This script should be run on a fresh db installation

exit_if_exit_code_fucked()
{
    if [ $? != 0 ]; then
        echo "Fatal error. Aborting."
        exit
    fi
}

echo "Initiating PG DB ..."

printf "Superuser for your PostgreSQL installation (leave blank for 'postgres'): "
read DB_ROOT_USER

if [ ! "$DB_ROOT_USER" ]; then
    DB_ROOT_USER="postgres"
fi

printf "Password for user $DB_ROOT_USER: "
read DB_PASS

echo ""

SCRIPT_DIR=$(dirname $BASH_SOURCE)

tsc --build $SCRIPT_DIR/
DB_PASS="$DB_PASS" DB_ROOT_USER="$DB_ROOT_USER" $SCRIPT_DIR/pg-databases.sh
exit_if_exit_code_fucked
echo ""
DB_PASS="$DB_PASS" DB_ROOT_USER="$DB_ROOT_USER" $SCRIPT_DIR/pg-migrations.sh
exit_if_exit_code_fucked
echo ""
DB_PASS="$DB_PASS" DB_ROOT_USER="$DB_ROOT_USER" $SCRIPT_DIR/pg-users.sh
exit_if_exit_code_fucked
echo ""
DB_PASS="$DB_PASS" DB_ROOT_USER="$DB_ROOT_USER" $SCRIPT_DIR/pg-functions.sh
exit_if_exit_code_fucked
echo ""
DB_PASS="$DB_PASS" DB_ROOT_USER="$DB_ROOT_USER" $SCRIPT_DIR/pg-insert-gity-user.sh
