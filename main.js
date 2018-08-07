const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;

let mainWindow;

let template = [
  {
    label: 'ファイル',
    submenu: [
      {
        label: '終了',
        role: 'close'
      }
    ]
  }, {
    label: 'ヘルプ',
    submenu: [
      {
        label: 'バージョン',
        click: function () {
          const messageVal = 'node ' + process.versions.node + ', Chrome ' + process.versions.chrome + ', Electron ' + process.versions.electron + '.';

          electron.dialog.showMessageBox(mainWindow, {type: 'none', title: 'version', message: messageVal});
        }
      }
    ]
  }
];

function createWindow() {
  const newMenu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(newMenu);

  mainWindow = new BrowserWindow({width: 800, height: 600});
 
  mainWindow.loadFile('index.html');
 
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);
 
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
