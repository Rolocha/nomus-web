#!/bin/bash

echo 'grabbing local db'
mongodump -h localhost:27017 -d rolocha-dev -u nomus -p admin -o /tmp/nomus-db-backup
echo 'clearing out staging db'
mongo ec2-52-20-46-100.compute-1.amazonaws.com/rolocha-staging -u nomus -p jZHfJdBK2Bo --eval "printjson(db.dropDatabase())"
echo 'transferring local db backup to staging db'
mongorestore -h ec2-52-20-46-100.compute-1.amazonaws.com -d rolocha-staging -u nomus -p jZHfJdBK2Bo /tmp/nomus-db-backup/rolocha-dev