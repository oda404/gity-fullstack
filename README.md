# gity
A fullstack solution to host your own git repositories.
## The stack includes:
- Web frontend (NextJS)
- Private API (Typescript)
- Git service (Typescript)

## Install
PostgreSQL and Redis are required.

```console
$ git clone https://github.com/oda404/gity-fullstack
$ cd gity-fullstack/server/core
$ ./create-configs.sh
```
This will set up the default configs in `/etc/gity/`, which you will need to edit.<br>
Jump to [Configs](#Configs) to see which files need to updated.

```console
$ ./pg-init.sh
```
This will setup the PostgreSQL databases, tables and users.

## Configs
The following files and fields need updated based on your setup:
### /etc/gity/web.json
- hostname (Host of the web frontend)
### /etc/gity/redis.json
- hostname (Host of the redis server)
- port
### /etc/gity/private-api.json
- port (The port you want to start the Private API on)
### /etc/gity/pg.json
- hostname (Host of the PostgreSQL server)
- port
### /etc/gity/git.json
- usersRootDir (The directory where all the users and their repositories will be stored)
### /etc/gity/git-service.json
- port (The port you want to start the Git Service on)
