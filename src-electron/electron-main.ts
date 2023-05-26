import { app, BrowserWindow, nativeTheme } from 'electron';
import path from 'path';
import os from 'os';
import registerMenu from './services/Menu';
import registerElectronApi from './apis/ElectronApi';
import registerAutoPakApi from './apis/AutoPakApi';
import registerVue3DevToolForWin from './services/DevTool';
import registerListPakApi from './apis/ListPakApi';
import registerGithubApi from './apis/GithubApi';

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'));
  }
} catch (_) { }

let mainWindow: BrowserWindow | undefined;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    show: false,
    width: 1024,
    height: 768,
    useContentSize: true,
    webPreferences: {
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });

  if (process.env.DEBUGGING) {
    if (platform === 'win32') {
      registerVue3DevToolForWin();
    }
  }

  registerMenu(mainWindow);
  registerElectronApi(mainWindow);
  registerAutoPakApi(mainWindow);
  registerListPakApi(mainWindow);
  registerGithubApi(mainWindow);

  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow?.webContents.closeDevTools();
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });
  mainWindow.once('ready-to-show', () => {
    mainWindow && mainWindow.show();
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === undefined) {
    createWindow();
  }
});
