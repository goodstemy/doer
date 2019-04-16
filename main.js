const { app, BrowserWindow, ipcMain } = require('electron');
const http = require('http');
const https = require('https');
const fs = require('fs');

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

  ipcMain.on('download-url', (event, arg) => {
    event.sender.send('download-status', 'started');

    let path = `${__dirname}/${arg}`;

    // if (fs.existsSync(path)) {
    //     const splittedPath = path.split('.');
    //     splittedPath[splittedPath.length] = splittedPath[splittedPath.length - 1];
    //     splittedPath[splittedPath.length - 1] = +new Date;
    //     path = splittedPath.join('');
    // }

    // console.log(path);
    // const file = fs.createWriteStream(path);

    if (arg.split(':')[0] === 'https') {
        https.get(arg, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers['location']) {
                
            }
            console.log('statusCode:', res.statusCode);
            console.log('headers:', res.headers);

            res.on('data', (d) => {
                process.stdout.write(d);
            });
        }).on('error', (e) => {
            console.error(e);
        });
    }

    // if (arg.split('/')[0] === 'http')

    

    // let i = 0;
    // let interval = null;

    // interval = setInterval(() => {
    //     if (i === 100) {
    //         clearInterval(interval);
    //     }
    //     event.sender.send('download-status', {
    //         percent: i
    //     });
    //     i++;
    // }, 50);
  });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
