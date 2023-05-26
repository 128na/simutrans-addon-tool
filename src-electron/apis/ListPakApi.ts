import { ipcMain, type BrowserWindow } from 'electron';
import { DatAddon, PakAddon, listOption } from 'interface';
import { MakeobjAsync } from 'simutrans-makeobj-wrapper';
import FileManager from '../services/FileManager';
import { readFileSync } from 'fs';

const fileManager = new FileManager();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function registerListPakApi(mainWindow: BrowserWindow): void {
  ipcMain.removeHandler('listFromPak');
  ipcMain.handle('listFromPak', async (event, options: listOption) => {
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
  ipcMain.handle('listFromDat', async (event, options: listOption) => {
    const allFiles = await fileManager.findFiles(options.target, '.dat');
    const result: DatAddon[] = allFiles.map(f => { return { file: f.replace(options.target, ''), dat: readFileSync(f, 'utf-8') } });

    return result;
  });
  console.log('[ListPakApi] registered');
}
