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
}
