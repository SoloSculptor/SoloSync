const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const fsWatcher = require('./fs-watcher')
const octoprint_api = require('./octoprint-api')
const userData = require('./user-data');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 375, height: 812 })

  var { Menu } = require("electron");
  var template = [{
      label: "Application",
      submenu: [
          { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
          { type: "separator" },
          { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
      ]}, {
      label: "Edit",
      submenu: [
          { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
          { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
          { type: "separator" },
          { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
          { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
          { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
          { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
      ]}
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  global.config =
    {
      baseurl: userData.get('baseurl'),
      apikey: userData.get('apikey'),
      watchfolder: userData.get('watchfolder')
    }

  // and load the index.html of the app.
  win.loadFile('index.html')

  ipcMain.on('config-changed', (event, arg) => {
    console.log(`setting userData ${arg} to ${global.config[arg]}`)
    userData.set(arg, global.config[arg]);
    console.log(`userData ${arg} is set to ${userData.get(arg)}`)
  })

  ipcMain.on('open-folder', (event, arg) => {
    console.log(arg);
    dialog.showOpenDialog({
      properties: ['openDirectory']
    }, function (path) {
      event.returnValue = path;
    });
  })

  ipcMain.on('watch-folder', (event, arg) => {
    var watcher = fsWatcher.start(arg);
    if (watcher != null) {
      watcher.on('ready', function () {
        console.info('From here can you check for real changes, the initial scan has been completed.');
        // Declare the listeners of the watcher
        watcher
          .on('add', function (path) {
            console.log('File', path, 'has been added');
            octoprint_api.upload(path);
          })
          .on('addDir', function (path) {
            console.log('Directory', path, 'has been added');
          })
          .on('change', function (path) {
            console.log('File', path, 'has been changed');
            octoprint_api.upload(path);
          })
          .on('unlink', function (path) {
            console.log('File', path, 'has been removed');
          })
          .on('unlinkDir', function (path) {
            console.log('Directory', path, 'has been removed');
          })
          .on('error', function (error) {
            console.log('Error happened', error);
          })
        // .on('raw', function(event, path, details) {
        //      // This event should be triggered everytime something happens.
        //      console.log('Raw event info:', event, path, details);
        // });
      })
    }
  })

  // Open the DevTools.
  // win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

