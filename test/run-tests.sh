#!/bin/bash

# get flags

Uflag=''
sflag=''

while getopts 'U:D:s:' flag; do
	case "${flag}" in
		U) Uflag="${OPTARG}" ;;
		s) sflag="${OPTARG}" ;;
		*) error "Unexpected option ${flag}" ;;
	esac
done

if [ -z "$Uflag" ]; then
    echo "User is missing"
    exit 1
fi
if [ -z "$sflag" ]; then
    echo "Server is missing"
    exit 1
fi

# split into host and port

IFS=':' read -ra ADDR <<< "$sflag"
host=${ADDR[0]}
port=${ADDR[1]}

# read password from terminal

stty_orig=`stty -g`
stty -echo
read -p "Enter password:" passwd
stty $stty_orig

dbname=test_$RANDOM

PGPASSWORD=$passwd createdb -U $Uflag $dbname
PGPASSWORD=$passwd psql -U $Uflag -d $dbname -a -f db/create.sql

mkdir -p bin
rm -rf bin/*

# generate database defines

$(npm bin)/node-sql-generate --dsn "postgres://$Uflag:$passwd@$sflag/$dbname" > bin/tables.js

env PGUSER=$Uflag PGDATABASE=$dbname PGPASSWORD=$passwd PGHOST=$host PGPORT=$port DB_TABLES=bin/tables.js mocha "test/**/common.js"

PGPASSWORD=$passwd dropdb -U $Uflag $dbname