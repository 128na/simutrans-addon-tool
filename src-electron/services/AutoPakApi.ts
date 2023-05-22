import { ipcMain, type BrowserWindow } from 'electron';
import { Builder } from './Builder';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function registerAutoPakApi(mainWindow: BrowserWindow): void {
  ipcMain.removeHandler('pak');
  ipcMain.handle('pak', async (event, { makeobjPath, size, pakPath, sourcePath }) => {
    const builder = new Builder(makeobjPath);

    const result = builder.pak(size, pakPath, sourcePath);

    console.log('pak result', { result });

    return result;
  });

  let timer: NodeJS.Timer | null = null;
  ipcMain.removeHandler('startAutoPak');
  ipcMain.handle('startAutoPak', async (event, { makeobjPath, size, pakPath, simutransPath, sourcePath }) => {

    timer = setInterval(() => {
      mainWindow.webContents.send('updateAutoPak', 'debug', 'ping');
    }, 1000);
    return 'testing';
  });
  ipcMain.removeHandler('stopAutoPak');
  ipcMain.handle('stopAutoPak', async () => {
    timer && clearInterval(timer);
    // testging
  });
}
