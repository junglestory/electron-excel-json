# delete older files
rm -rf dist

# create mac app and dmg
electron-packager ./ electron-excel-json --platform=darwin --arch x64 --out dist --prune

electron-installer-dmg ./dist/electron-excel-json-darwin-x64/electron-excel-json.app electron-excel-json --out=./dist