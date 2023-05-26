import { dirname, join, resolve } from 'path';
import { readdir, unlink, rename } from 'node:fs/promises';
import { existsSync } from 'fs';

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
    return Promise.all(files.map(f => {
      if (existsSync(f)) {
        unlink(f);
      }
    }));
  }

  public rename(oldPath: string, newPath: string): Promise<void> {
    console.log('[FileManager.rename]', { oldPath, newPath });
    return rename(oldPath, newPath);
  }

  public getWatchTarget(path: string): string[] {
    const target = [
      join(path, '**', '*.dat'),
      join(path, '**', '*.png'),
    ];

    console.log('[FileManager.target]', { target });

    return target;
  }

  public async findFiles(dir: string, ext?: string): Promise<string[]> {
    const dirents = await readdir(resolve(dir), { withFileTypes: true });
    let files: string[] = [];
    for (const d of dirents) {
      if (d.isDirectory()) {
        files = files.concat(await this.findFiles(join(dir, d.name), ext));
      }
      if (d.isFile()) {
        if (!ext || d.name.endsWith(ext))
          files.push(join(dir, d.name));
      }
    }
    return files;
  }

  /**
   * 配列チャンク化
   * @link https://qiita.com/yarnaimo/items/e92600237d65876f8dd8
   */
  public chunk<T>(arr: T[], size: number): T[][] {
    return arr.reduce(
      (newarr, _, i) => (i % size ? newarr : [...newarr, arr.slice(i, i + size)]),
      [] as T[][]
    )
  }
}
