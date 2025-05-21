
echo "Removing old files ..."
cd ./dist || exit
find . -depth -mindepth 1 -not -path "./.git" -not -path "./.git/**" -print0 -delete
cd ..

echo "Compiling ..."
npx -c tsc

echo "Copying settings ..."
cp package.json ./dist/

echo "Copying statics ..."
cp -r ./src/js ./src/static ./src/styles ./src/views ./dist

echo "done."
