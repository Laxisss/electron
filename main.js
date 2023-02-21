const { app, BrowserWindow, dialog, ipcMain, shell, Notification } = require('electron');
const path = require('path');
const { execFile } = require('child_process');
const pngquant = import('pngquant-bin');
const fs = require('fs');

// pngquant.then(data => console.log(data.default));
let win;
const createWindow = () => {
  win = new BrowserWindow({
    show: false,
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.maximize();
  win.show();
  // reading.hideContent(false);
  // electron.remote.getCurrentWindow().setFullScreen(false);
  // electron.remote.getCurrentWindow().setMenuBarVisibility(true)

  win.loadFile('index.html');
}

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (canceled) {
    return;
  } else {
    // return filePaths[0]
    // for(let path of filePaths) {
    //   console.log(path)
    //   fs.writeFileSync('./input/input.png', path);
    // }
    const INCREMENT = 0.03
    const INTERVAL_DELAY = 100
    let c = 0
    progressInterval = setInterval(() => {
      // update progress bar to next value
      // values between 0 and 1 will show progress, >1 will show indeterminate or stick at 100%
      win.setProgressBar(c)

      // increment or reset progress bar
      if (c < 2) {
        c += INCREMENT
      } else {
        c = (-INCREMENT * 5) // reset to a bit less than 0 to show reset state
      }
    }, INTERVAL_DELAY)


    // console.log(app.getPath('temp'))
    const tempPath = path.join(app.getPath('temp'),'./electron');
    if(!fs.existsSync(tempPath)) {
      fs.mkdir(tempPath, (err)=> {
        console.log(err);
      })
    }
    // fs.writeFileSync(path.join(tempPath,'./input/input.png'), fs.readFileSync(filePaths[0]));
    if(fs.existsSync(path.join(tempPath,'./output.png'))) {
      fs.unlinkSync(path.join(tempPath,'./output.png'));
    }
    return new Promise((resolve, reject) => {
      pngquant.then(data => {
        execFile(data.default, ['-o', path.join(tempPath,'./output.png'), filePaths[0]], err => {
          console.log('Image minified!', err);
          clearInterval(progressInterval);
          resolve('done');
          const NOTIFICATION_TITLE = 'Compression terminée'
          const NOTIFICATION_BODY = 'Votre image est prête à être récupérée'
          showNotification(NOTIFICATION_TITLE, NOTIFICATION_BODY);
          shell.openPath(tempPath);
        });
      });
    })
  }
}
function showNotification(title, body) {
  new Notification({ title, body }).show(); 
}

app.whenReady().then(() => {
  ipcMain.handle('sendFile', handleFileOpen)
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})