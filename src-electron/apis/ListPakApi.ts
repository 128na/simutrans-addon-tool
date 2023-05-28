import { ipcMain } from 'electron';
import Api from '../base/Api';
import { PakAddon, PakConvertedAddon, listOption } from 'app/types/global';
import { MakeobjAsync } from 'simutrans-makeobj-wrapper';

export default class ListPakApi extends Api {
  protected register(): void {
    ipcMain.removeHandler('listFromPak');
    ipcMain.handle('listFromPak', async (event, options: listOption) => this.listFromPak(options));
  }

  private async listFromPak(options: listOption) {
    const allFiles = await this.fileManager.findFiles(options.target, '.pak');
    const makeobj = new MakeobjAsync(options.makeobjPath);

    // 4096文字超えるとエラーになる ENAMETOOLONG
    const fileChunk = this.fileManager.chunk(allFiles, 20);
    let result: PakAddon[] = [];
    for (const files of fileChunk) {
      result = result.concat(await makeobj.listNames(...files.flat().flat()));
    }
    // pakディレクトリをルートとして相対パスを返す
    return result.map((r): PakConvertedAddon => {
      return { file: r.pak.replace(options.target, ''), objs: r.objs };
    });
  }
}
