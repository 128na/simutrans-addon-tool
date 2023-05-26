import { ipcMain, type BrowserWindow } from 'electron';
import { listPakOption } from 'app/interface';
import { MakeobjAsync } from 'simutrans-makeobj-wrapper';
import FileManager from '../services/FileManager';

const fileManager = new FileManager();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function registerListPakApi(mainWindow: BrowserWindow): void {
  ipcMain.removeHandler('listPak');
  ipcMain.handle('listPak', async (event, options: listPakOption) => {
    const allFiles = await fileManager.findPakFiles(options.pakPath);
    const makeobj = new MakeobjAsync(options.makeobjPath);

    // 4096文字超えるとエラーになる ENAMETOOLONG
    const fileChunk = fileManager.chunk(allFiles, 20);
    let result: addon[] = [];
    for (const files of fileChunk) {
      result = result.concat(await makeobj.listNames(...files.flat().flat()));
    }
    // pakディレクトリをルートとして相対パスを返す
    result = result.map(r => Object.assign(r, { pak: r.pak.replace(options.pakPath, '') }));
    return result;
  });

  console.log('[ListPakApi] registered');
}
