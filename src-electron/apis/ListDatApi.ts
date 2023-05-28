import { ipcMain } from 'electron';
import Api from '../base/Api';
import { DatAddon, listOption } from 'app/types/global';
import { readFileSync } from 'fs';

export default class ListDatApi extends Api {
  protected register(): void {
    ipcMain.removeHandler('listFromDat');
    ipcMain.handle('listFromDat', async (event, options: listOption) => this.listFromDat(options));
  }

  private async listFromDat(options: listOption) {
    const allFiles = await this.fileManager.findFiles(options.target, '.dat');
    const result: DatAddon[] = allFiles.map((f) => {
      return { file: f.replace(options.target, ''), dat: readFileSync(f, 'utf-8') };
    });

    return result;
  }
}
