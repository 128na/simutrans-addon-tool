import { app, BrowserWindow, nativeTheme } from 'electron';
import path from 'path';
import os from 'os';
import registerVue3DevToolForWin from './services/DevTool';
import ResizeobjApi from './apis/ResizeobjApi';
import AutoPakApi from './apis/AutoPakApi';
import PakApi from './apis/PakApi';
import Messenger from './services/Messenger';
import ListPakApi from './apis/ListPakApi';
import ListDatApi from './apis/ListDatApi';
import GithubApi from './apis/GithubApi';
import ElectronApi from './apis/ElectronApi';
import MenuApi from './apis/MenuApi';
import ImageMergerApi from './apis/ImageMergerApi';
import { registerProtocol } from './apis/FileProtocol';

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'));
  }
} catch (_) {}

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

  new MenuApi();
  new ElectronApi(mainWindow);
  new GithubApi();
  new ListPakApi();
  new ListDatApi();
  new PakApi(new Messenger(mainWindow, 'pak'));
  new AutoPakApi(new Messenger(mainWindow, 'autoPak'));
  new ResizeobjApi(new Messenger(mainWindow, 'resizeobj'));
  new ImageMergerApi(new Messenger(mainWindow, 'imageMerger'));

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

app.on('ready', () => {
  registerProtocol();
});
