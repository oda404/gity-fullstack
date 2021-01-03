#!/usr/bin/bash

print_help()
{
    echo "Script for starting/configuring the server"
    echo ""
    echo "By default all services are started in screen sessions"
    echo "with corresponding names. If either service is manually"
    echo "specified then only it and any others will be started."
    echo ""
    echo "Usage:"
    echo "  ./server.sh [options]"
    echo ""
    echo "Options:"
    echo "  -d, --deps                 Install deps for all sub projects"
    echo "  -c, --configure            Configure the server-side"
    echo "  -g, --git-service          Start git-service"
    echo "  -p, --private-api-service  Start private-api-service"
    echo "  -P, --public-api-service   Start public-api-service"
}

if [ $# -eq 0 ]; then
    pushd git-service/ && tsc --build && popd
    screen -d -m -S gity-git-service yarn --cwd git-service start
    pushd private-api-service/ && tsc --build && popd
    screen -d -m -S gity-private-api-service yarn --cwd private-api-service start
else
    for arg in $@
    do
        case $arg in
            "-d" | "--deps")
                yarn --cwd core/
                yarn --cwd git-service/
                yarn --cwd private-api-service/
                ;;
            "-c" | "--configure")
                echo ""
                ./core/create-default-conf.sh
                echo ""
                ./core/pg-init.sh
                ;;
            "-h" | "--help")
                print_help
                ;;
            "-g" | "--git-service")
                pushd git-service/ && tsc --build && popd
                screen -d -m -S gity-git-service yarn --cwd git-service start
                ;;
            "-p" | "--private-api-service")
                pushd private-api-service/ && tsc --build && popd
                screen -d -m -S gity-private-api-service yarn --cwd private-api-service start
                ;;
            "-P" | "--public-api-service")
                ;;
        esac
    done
fi
