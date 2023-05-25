import { dirname, join, resolve } from 'path';
import { readdir, unlink, rename } from 'node:fs/promises';

export default class FileManager {

  /**
   * ディレクトリ単位でdatファイル一覧を返す
   */
  public async findDatDirectories(dir: string): Promise<string[][]> {
    const dirents = await readdir(resolve(dir), { withFileTypes: true });

    let dirs: string[][] = [];
    const files: string[] = [];
    for (const d of dirents) {
      if (d.isDirectory()) {
        dirs = dirs.concat(await this.findDatDirectories(join(dir, d.name)));
      }
      if (d.isFile()) {
        files.push(join(dir, d.name));
      }
    }
    const result = [files.filter(f => f.endsWith('.dat')), ...dirs].filter(d => d.length);
    // console.log('[FileManager.findDatDirectories]', { dir, result });
    return result;
  }

  public createTmpPath(dir: string, tmpname = 'tmp.pak'): string {
    console.log('[FileManager.createTmpPath]', { dir, tmpname });
    return join(dir, tmpname);
  }

  public getDirname(filepath: string): string {
    console.log('[FileManager.getDirname]', { filepath });
    return dirname(filepath);
  }

  public deletefiles(files: string[]): Promise<void[]> {
    console.log('[FileManager.deletefiles]', { files });
    return Promise.all(files.map(f => unlink(f)));
  }

  public rename(oldPath: string, newPath: string): Promise<void> {
    console.log('[FileManager.rename]', { oldPath, newPath });
    return rename(oldPath, newPath);
  }
}
