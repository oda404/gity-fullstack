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
    echo "  -d, --db-pass <pass>   Sets DB_PASS"
    echo "  -p, --pass    <pass>   Sets PASS"
}

while :
do
    case "$1" in
        "-h" | "--help")
            print_help
            exit
            ;;

        "-d" | "-db-pass")
            DB_PASS="$2"
            shift 2
            ;;

        "-p" | "-pass")
            PASS="$2"
            shift 2
            ;;

        --)
            shift
            break
            ;;
    esac
done

if [ -z $DB_PASS ]; then
    DB_PASS="pass"
    echo "Warning DB_PASS was not set." 
fi

if [ -z $PASS ]; then
    PASS="123456789"
    echo "Warning PASS was not set." 
fi

tsc --build
DB_PASS="$DB_PASS" ./migrations.sh
DB_PASS="$DB_PASS" ./functions.sh
DB_PASS="$DB_PASS" PASS="$PASS" ./create-gity-user.sh
DB_PASS="$DB_PASS" ./constraints.sh
