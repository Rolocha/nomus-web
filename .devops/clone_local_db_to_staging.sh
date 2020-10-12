#!/bin/bash

# Run this via docker exec -i db bash < ./clone_local_db_to_staging.sh

echo 'grabbing local db'
mongodump -h localhost:27017 -d nomus-dev -u nomus -p nomus -o /tmp/nomus-db-backup
echo 'clearing out staging db'
mongo ec2-52-20-46-100.compute-1.amazonaws.com/nomus-dev -u nomus -p jZHfJdBK2Bo --eval "printjson(db.dropDatabase())"
echo 'transferring local db backup to staging db'
mongorestore -h ec2-52-20-46-100.compute-1.amazonaws.com -d nomus-dev -u nomus -p jZHfJdBK2Bo /tmp/nomus-db-backup/nomus-dev