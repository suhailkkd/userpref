#building client
echo "building client"
cd client
npm install --prod
npm run build

echo "building server"
cd ../
npm install --prod


echo "bundlind client to server"
rm -rf public
mkdir -p public
cp -r client/build public/

