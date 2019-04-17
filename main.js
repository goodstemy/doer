const { app, BrowserWindow, ipcMain } = require('electron');
const request = require('request');
const notifier = require('node-notifier');
const fs = require('fs');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadFile(`${__dirname}/view/index.html`);
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  ipcMain.on('download-url', async (event, arg) => {
    event.sender.send('download-status', 'started');

    await downloadFile(event, arg).catch(console.error);
  });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (mainWindow === null) createWindow();
});

async function downloadFile(e, uri) {
  const dest = getFileName(uri);
  let contentLength = 0;

  let dataToWrite = '';
  let percent = 0;

  request(uri, (err, res, body) => {
    if (err) {
      console.error(err);
      return;
    }
  })
  .on('response', (data) => {
    contentLength = data.headers['content-length'];
  })
  .on('data', (chunk) => {
    dataToWrite += chunk.toString();
    fs.appendFileSync(dest, chunk, (err) => console.error);
    if (percent !== Math.floor(dataToWrite.length / contentLength * 100)) {
      percent = Math.floor(dataToWrite.length / contentLength * 100);
      e.sender.send('download-status', {percent});
      console.log(`${percent}% downloaded...`);
    }
  })
  .on('end', () => {
    e.sender.send('download-status', {percent: 100});
    e.sender.send('download-status', 'finished');

    console.log('Downloaded');
    notifier.notify({
      title: 'DOER Notification',
      message: `File ${dest.split('/').pop()} downloaded to ${dest}`
    });
  });
}

function getFileName(uri) {
  const pathname = url.parse(uri).pathname;
  return path.join(__dirname, path.basename(pathname));
}