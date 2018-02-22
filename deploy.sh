#!/bin/bash

cd client
ng build --prod -pr false  2> /dev/null
cd ..

rm -rf ./deploy  2> /dev/null
mkdir deploy

cp -r ./server/* ./deploy
cp -r ./client/dist ./deploy

rm ./deploy/yarn.lock
rm -rf ./deploy/node_modules

rm ./deploy.zip  2> /dev/null

cd deploy
zip -rq ../deploy.zip .

cd ..
rm -rf ./deploy