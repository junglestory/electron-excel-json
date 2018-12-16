'use strict'
const os = require('os');
const electron = require('electron')
const autoUpdater = require('electron-updater').autoUpdater
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')
const excelToJson = require('convert-excel-to-json');
const squirrelUrl = "https://electron-excel-json.herokuapp.com";
const version = app.getVersion();
const platform = os.platform() + '_' + os.arch();

let mainWindow
let contents

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  contents = mainWindow.webContents
  // contents.openDevTools()

  // Add this condition to avoid error when running your application locally
  if (process.env.NODE_ENV !== "dev") startAutoUpdater(squirrelUrl + '/update/' + platform + '/'+ version )
  // autoUpdater.checkForUpdates()
}

app.on('ready', createWindow)

const startAutoUpdater = (squirrelUrl) => {
  // The Squirrel application will watch the provided URL
  electron.autoUpdater.setFeedURL(`${squirrelUrl}`);
console.log("squirrelUrl : " + `${squirrelUrl}`);

autoUpdater.on('update-available', function () {
  console.log('A new update is available')
  contents.send('updater-message', 'A new update is available')
})
autoUpdater.on('checking-for-update', function () {
  console.log('Checking-for-update')
  contents.send('updater-message', 'Checking for Update..')
})
autoUpdater.on('error', function (error) {
  console.log('error')
  console.error(error)
  contents.send('updater-message', 'Got Error')
})
autoUpdater.on('download-progress', function (bytesPerSecond, percent, total, transferred) {
  console.log(`${bytesPerSecond}, ${percent}, ${total}, ${transferred}`)
  contents.send('updater-message', `download progress : ${bytesPerSecond}, ${percent}, ${total}, ${transferred}`)
})
autoUpdater.on('update-downloaded', function (event) {
  console.log('update-downloaded')
  console.log(event)
  contents.send('updater-message', 'update-downloaded')
  autoUpdater.quitAndInstall();
})

autoUpdater.on('update-not-available', function () {
  console.log('update-not-available')
  contents.send('updater-message', 'update-not-available')
})

  // Display a success message on successful update
  // electron.autoUpdater.addListener("update-downloaded", (event, releaseNotes, releaseName) => {
  //   electron.dialog.showMessageBox({"message": `The release ${releaseName} has been downloaded`});
  // });

  // // Display an error message on update error
  // electron.autoUpdater.addListener("error", (error) => {
  //   electron.dialog.showMessageBox({"message": "Auto updater error: " + error});
  // });

  // tell squirrel to check for updates
  electron.autoUpdater.checkForUpdates();
 

 
  /* Log whats happening
  TODO send autoUpdater events to renderer so that we could console log it in developer tools
  You could alsoe use nslog or other logging to see what's happening */
  // autoUpdater.on('error', err => console.log(err));
  // autoUpdater.on('checking-for-update', () => console.log('checking-for-update'));
  // autoUpdater.on('update-available', () => console.log('update-available'));
  // autoUpdater.on('update-not-available', () => console.log('update-not-available'));

  
}

const handleSquirrelEvent = () => {
  if (process.argv.length === 1) {
    return false;
  }

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
    case '--squirrel-uninstall':
      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      app.quit();
      return true;
  }
}

if (handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}

/*
autoUpdater.on('update-available', function () {
  console.log('A new update is available')
  contents.send('updater-message', 'A new update is available')
})
autoUpdater.on('checking-for-update', function () {
  console.log('Checking-for-update')
  contents.send('updater-message', 'Checking for Update..')
})
autoUpdater.on('error', function (error) {
  console.log('error')
  console.error(error)
  contents.send('updater-message', 'Got Error')
})
autoUpdater.on('download-progress', function (bytesPerSecond, percent, total, transferred) {
  console.log(`${bytesPerSecond}, ${percent}, ${total}, ${transferred}`)
  contents.send('updater-message', `download progress : ${bytesPerSecond}, ${percent}, ${total}, ${transferred}`)
})
autoUpdater.on('update-downloaded', function (event) {
  console.log('update-downloaded')
  console.log(event)
  contents.send('updater-message', 'update-downloaded')
  autoUpdater.quitAndInstall();
})

autoUpdater.on('update-not-available', function () {
  console.log('update-not-available')
  contents.send('updater-message', 'update-not-available')
})
*/