import { ipcMain, type BrowserWindow } from 'electron';
import Builder from '../services/Builder';
import Watcher from '../services/Watcher';
import FileManager from '../services/FileManager';
import PakManager from '../services/PakManager';
import AutoPakManager from '../services/AutoPakManager';
import Messenger from '../services/Messenger';
import { DatAddon, PakAddon, PakConvertedAddon, startAutoPakOption, startPakOption } from 'app/types/global';
import { MakeobjAsync } from 'simutrans-makeobj-wrapper';
import { readFileSync } from 'fs';
import { listOption } from 'app/types/global';

const builder = new Builder();
const fileManager = new FileManager();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function registerPakApi(mainWindow: BrowserWindow): void {
  const pakManager = new PakManager(new Messenger(mainWindow, 'updatePak'), builder, fileManager);
  ipcMain.removeListener('startPak', (event, options: startPakOption) => pakManager.startPak(options));
  ipcMain.on('startPak', (event, options: startPakOption) => pakManager.startPak(options));
  ipcMain.removeListener('stopPak', () => pakManager.stop());
  ipcMain.on('stopPak', () => pakManager.stop());

  const autoPakManager = new AutoPakManager(new Messenger(mainWindow, 'updateAutoPak'), builder, fileManager, new Watcher());
  ipcMain.removeListener('startAutoPak', (event, options: startAutoPakOption) => autoPakManager.startAutoPak(options));
  ipcMain.on('startAutoPak', (event, options: startAutoPakOption) => autoPakManager.startAutoPak(options));
  ipcMain.removeListener('stopAutoPak', () => autoPakManager.stop());
  ipcMain.on('stopAutoPak', () => autoPakManager.stop());

  ipcMain.removeHandler('listFromPak');
  ipcMain.handle('listFromPak', async (event, options: listOption): Promise<PakConvertedAddon[]> => {
    const allFiles = await fileManager.findFiles(options.target, '.pak');
    const makeobj = new MakeobjAsync(options.makeobjPath);

    // 4096文字超えるとエラーになる ENAMETOOLONG
    const fileChunk = fileManager.chunk(allFiles, 20);
    let result: PakAddon[] = [];
    for (const files of fileChunk) {
      result = result.concat(await makeobj.listNames(...files.flat().flat()));
    }
    // pakディレクトリをルートとして相対パスを返す
    return result.map(r => {
      return { file: r.pak.replace(options.target, ''), objs: r.objs }
    });
  });

  ipcMain.removeHandler('listFromDat');
  ipcMain.handle('listFromDat', async (event, options: listOption): Promise<DatAddon[]> => {
    const allFiles = await fileManager.findFiles(options.target, '.dat');
    const result: DatAddon[] = allFiles.map(f => { return { file: f.replace(options.target, ''), dat: readFileSync(f, 'utf-8') } });

    return result;
  });
  console.log('[ListPakApi] registered');
}
