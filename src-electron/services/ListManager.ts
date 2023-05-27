import { DatAddon, PakAddon, PakConvertedAddon, listOption } from 'app/types/global';
import FileManager from './FileManager';
import { MakeobjAsync } from 'simutrans-makeobj-wrapper';
import { readFileSync } from 'fs';


export default class ListManager {
  fileManager: FileManager;
  constructor(fileManager: FileManager) {
    this.fileManager = fileManager;
  }

  public async listFromPak(options: listOption) {
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
      return { file: r.pak.replace(options.target, ''), objs: r.objs }
    });
  }

  public async listFromDat(options: listOption) {
    const allFiles = await this.fileManager.findFiles(options.target, '.dat');
    const result: DatAddon[] = allFiles.map(f => { return { file: f.replace(options.target, ''), dat: readFileSync(f, 'utf-8') } });

    return result;
  }
}
