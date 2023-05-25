import { ipcMain, type BrowserWindow } from 'electron';
import Builder from '../services/Builder';
import Watcher from '../services/Watcher';
import FileManager from '../services/FileManager';
import PakManager from '../services/PakManager';
import AutoPakManager from '../services/AutoPakManager';
import Messenger from '../services/Messenger';

const builder = new Builder();
const fileManager = new FileManager();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function registerAutoPakApi(mainWindow: BrowserWindow): void {
  const pakManager = new PakManager(new Messenger(mainWindow, 'updatePak'), builder, fileManager);
  ipcMain.removeListener('startPak', (event, options) => pakManager.startPak(options));
  ipcMain.on('startPak', (event, options) => pakManager.startPak(options));

  const autoPakManager = new AutoPakManager(new Messenger(mainWindow, 'updateAutoPak'), builder, fileManager, new Watcher());
  ipcMain.removeListener('startAutoPak', (event, options) => autoPakManager.startWatch(options));
  ipcMain.on('startAutoPak', (event, options) => autoPakManager.startWatch(options));
  ipcMain.removeListener('stopAutoPak', () => autoPakManager.stop());
  ipcMain.on('stopAutoPak', () => autoPakManager.stop());

  console.log('[AutoPakApi] registered');
}
