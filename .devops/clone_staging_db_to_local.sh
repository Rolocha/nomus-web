#!/bin/bash

# Run this via docker exec -i db bash < ./clone_staging_db_to_local.sh

SRC_HOST=ec2-52-20-46-100.compute-1.amazonaws.com
SRC_DB=rolocha-staging
SRC_USER=nomus
SRC_PASS=jZHfJdBK2Bo

DST_HOST=localhost:27017
DST_DB=nomus-dev
DST_USER=nomus
DST_PASS=nomus

CACHE_FOLDER=/tmp/nomus-db-backup

echo 'grabbing source db'
mongodump -h $SRC_HOST \
 -d $SRC_DB \
 -u $SRC_USER \
 -p $SRC_PASS \
 -o $CACHE_FOLDER

echo 'clearing out destination db'
mongo $DST_HOST/$DST_DB \
  -u $DST_USER \
  -p $DST_PASS \
  --eval "printjson(db.dropDatabase())"

echo 'transferring source db to destination db'
mongorestore -h $DST_HOST \
  -d $DST_DB \
  -u $DST_USER \
  -p $DST_PASS \
  $CACHE_FOLDER/$SRC_DB