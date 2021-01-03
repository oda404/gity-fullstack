#!/usr/bin/bash

#This script should be run on a fresh db installation

parsed_args=$(getopt -o d:p:h --long db-pass:,pass:,help -- "$@")
eval set -- $parsed_args

print_help()
{
    echo "Script for setting up the database"
    echo ""
    echo "Usage:"
    echo "  ./init-pg [options]"
    echo ""
    echo "Options:"
    echo "  -h, --help             Prints this message"
}

check_exit_code()
{
    if [ $? != 0 ]; then
        echo "Fatal error. Aborting."
        exit
    fi
}

while :
do
    case "$1" in
        "-h" | "--help")
            print_help
            exit
            ;;
            
        --)
            shift
            break
            ;;
    esac
done

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
check_exit_code
echo ""
DB_PASS="$DB_PASS" DB_ROOT_USER="$DB_ROOT_USER" $SCRIPT_DIR/pg-migrations.sh
check_exit_code
echo ""
DB_PASS="$DB_PASS" DB_ROOT_USER="$DB_ROOT_USER" $SCRIPT_DIR/pg-users.sh
check_exit_code
echo ""
DB_PASS="$DB_PASS" DB_ROOT_USER="$DB_ROOT_USER" $SCRIPT_DIR/pg-functions.sh
check_exit_code
echo ""
DB_PASS="$DB_PASS" DB_ROOT_USER="$DB_ROOT_USER" $SCRIPT_DIR/pg-insert-gity-user.sh
