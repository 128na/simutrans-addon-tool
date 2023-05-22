import type { BrowserWindow } from 'electron';
import { app, dialog, ipcMain, shell } from 'electron';
import Store from 'electron-store';
import { lstatSync } from 'node:fs';
import { dirname } from 'node:path';
const store = new Store();
/**
 * 汎用API
 */
export default function registerElectronApi(mainWindow: BrowserWindow): void {
  /**
   * ディレクトリ選択
   * @see https://www.electronjs.org/ja/docs/latest/api/dialog#dialogshowopendialogbrowserwindow-options
   */
  ipcMain.removeHandler('selectDir');
  ipcMain.handle('selectDir', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    });
    console.log('directories selected', result.filePaths);

    return result.filePaths[0] || '';
  });

  /**
   * ファイル選択
   */
  ipcMain.removeHandler('selectFile');
  ipcMain.handle('selectFile', async (event, { multiSelections, filters }) => {
    console.log({ filters });
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: multiSelections ? ['openFile', 'multiSelections'] : ['openFile'],
      filters: [
        ...filters,
        { name: 'All Files', extensions: ['*'] },
      ],
    });
    console.log('files selected', result.filePaths);

    return multiSelections ? result.filePaths : result.filePaths[0] || '';
  });

  /**
   * ファイル保存先選択
   * @see https://www.electronjs.org/ja/docs/latest/api/dialog#dialogshowsavedialogbrowserwindow-options
   */
  ipcMain.removeHandler('saveFile');
  ipcMain.handle('saveFile', async (event, { defaultPath }) => {
    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath,
    });
    console.log('directories selected', result.filePath);

    return result.filePath || '';
  });

  /**
   * URL表示
   * @see https://www.electronjs.org/ja/docs/latest/api/shell#shellopenexternalurl-options
   */
  ipcMain.removeHandler('openUrl');
  ipcMain.handle('openUrl', (event, url: string) => {
    return shell.openExternal(url);
  });


  /**
   * ディレクトリ表示
   */
  ipcMain.removeHandler('openDir');
  ipcMain.handle('openDir', (event, path: string) => {
    return shell.openPath(lstatSync(path).isDirectory() ? path : dirname(path));
  });

  /**
   * キャッシュストア操作
   *
   * @link https://github.com/sindresorhus/electron-store/issues/210
   */
  console.log('store location is ', app.getPath('userData'));
  ipcMain.removeHandler('getCache');
  ipcMain.handle('getCache', (event, key: string) => {
    const value = store.get(`cache.${key}`);
    console.log('getCache', { key, value });
    return value;
  });
  ipcMain.removeHandler('setCache');
  ipcMain.handle('setCache', (event, key: string, value: unknown) => {
    console.log('setCache', { key, value });
    return store.set(`cache.${key}`, value);
  });

}
