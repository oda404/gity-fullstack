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

printf "User: "
read DB_ROOT_USER

printf "Password for user $DB_ROOT_USER: "
read DB_PASS

echo ""

tsc --build
DB_PASS="$DB_PASS" DB_ROOT_USER="$DB_ROOT_USER" ./pg-databases.sh
echo ""
DB_PASS="$DB_PASS" DB_ROOT_USER="$DB_ROOT_USER" ./pg-migrations.sh
echo ""
DB_PASS="$DB_PASS" DB_ROOT_USER="$DB_ROOT_USER" ./pg-users.sh
echo ""
DB_PASS="$DB_PASS" DB_ROOT_USER="$DB_ROOT_USER" ./pg-functions.sh
echo ""
DB_PASS="$DB_PASS" DB_ROOT_USER="$DB_ROOT_USER" ./pg-insert-gity-user.sh
