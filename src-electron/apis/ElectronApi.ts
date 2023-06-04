import type { BrowserWindow } from 'electron';
import { dialog, ipcMain, shell } from 'electron';
import Store from 'electron-store';
import { existsSync, lstatSync, readFile, writeFile } from 'node:fs';
import { dirname } from 'node:path';
import Api from '../base/Api';

export default class ElectronApi extends Api {
  store: Store<Record<string, unknown>>;
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    super();
    this.store = new Store();
    this.mainWindow = mainWindow;
  }

  protected register(): void {
    /**
     * ディレクトリ選択
     * @see https://www.electronjs.org/ja/docs/latest/api/dialog#dialogshowopendialogbrowserwindow-options
     */
    ipcMain.removeHandler('showError');
    ipcMain.handle('showError', (event, message) => dialog.showErrorBox('Error', message));

    /**
     * ディレクトリ選択
     * @see https://www.electronjs.org/ja/docs/latest/api/dialog#dialogshowopendialogbrowserwindow-options
     */
    ipcMain.removeHandler('selectDir');
    ipcMain.handle('selectDir', async () => {
      const result = await dialog.showOpenDialog(this.mainWindow, { properties: ['openDirectory'] });
      return result.filePaths[0] || '';
    });

    /**
     * ファイル選択
     */
    ipcMain.removeHandler('selectFile');
    ipcMain.handle('selectFile', async (event, { multiSelections, filters }) => {
      const result = await dialog.showOpenDialog(this.mainWindow, {
        properties: multiSelections ? ['openFile', 'multiSelections'] : ['openFile'],
        filters: [...filters, { name: 'All Files', extensions: ['*'] }],
      });

      return multiSelections ? result.filePaths : result.filePaths[0] || '';
    });

    /**
     * ファイル読み取り
     */
    ipcMain.removeHandler('readFile');
    ipcMain.handle('readFile', async (event, filepath) => {
      return new Promise<string | undefined>((ok, ng) => {
        readFile(filepath, (err, data) => {
          if (err) {
            return ng(err);
          }
          return ok(data.toString());
        });
      });
    });

    /**
     * ファイル書き込み
     */
    ipcMain.removeHandler('writeFile');
    ipcMain.handle('writeFile', async (event, filepath, data) => {
      return new Promise<undefined>((ok, ng) => {
        writeFile(filepath, data, {}, (err) => {
          if (err) {
            return ng(err);
          }
          return ok(undefined);
        });
      });
    });

    /**
     * ファイル保存先選択
     * @see https://www.electronjs.org/ja/docs/latest/api/dialog#dialogshowsavedialogbrowserwindow-options
     */
    ipcMain.removeHandler('saveFile');
    ipcMain.handle('saveFile', async (event, { defaultPath, filters }) => {
      filters = filters ? [...filters, { name: 'All Files', extensions: ['*'] }] : undefined;
      const result = await dialog.showSaveDialog(this.mainWindow, {
        defaultPath,
        filters,
      });

      return result.filePath || '';
    });

    /**
     * URL表示
     * @see https://www.electronjs.org/ja/docs/latest/api/shell#shellopenexternalurl-options
     */
    ipcMain.removeHandler('openUrl');
    ipcMain.handle('openUrl', (event, url: string) => shell.openExternal(url));

    /**
     * ディレクトリ表示
     */
    ipcMain.removeHandler('openDir');
    ipcMain.handle('openDir', (event, path: string) => {
      if (existsSync(path) && lstatSync(path).isDirectory()) {
        return shell.openPath(path);
      }
      return shell.openPath(dirname(path));
    });

    /**
     * キャッシュストア操作
     *
     * @link https://github.com/sindresorhus/electron-store/issues/210
     */
    ipcMain.removeHandler('getCache');
    ipcMain.handle('getCache', (event, key: string) => this.store.get(`cache.${key}`));

    ipcMain.removeHandler('setCache');
    ipcMain.handle('setCache', (event, key: string, value: unknown) => this.store.set(`cache.${key}`, value));
  }
}
