#!/bin/bash

cd client
ng build --prod -pr false
cd ..

rm -rf ./deploy
mkdir deploy

cp -r ./server/* ./deploy
cp -r ./client/dist ./deploy

rm ./deploy/yarn.lock
rm -rf ./deploy/node_modules

rm ./deploy.zip

cd deploy
zip -r ../deploy.zip .