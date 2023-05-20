import { lstatSync, readdirSync } from 'fs';
import { dirname, resolve, sep as s } from 'path';
import { Makeobj } from 'simutrans-makeobj-wrapper';

export class Builder {
  makeobj: Makeobj;

  constructor(makeobjPath: string) {
    this.makeobj = new Makeobj(resolve(makeobjPath));
  }

  public pak(size: number, pakPath: string, sourcePath: string) {

    const datFiles = this.findDatFiles(resolve(sourcePath));

    if (datFiles.length < 1) {
      throw new Error(`dat file not found in ${sourcePath}.`);
    }
    pakPath = resolve(pakPath);

    console.log({ pakPath, datFiles });

    const result = this.makeobj.exec({ cwd: dirname(datFiles[0]) }, `PAK${size}`, pakPath, ...datFiles);
    console.log('pak result', { result });
    return result;
  }

  private findDatFiles(folder: string): string[] {
    return readdirSync(folder)
      .map(f => resolve(`${folder}${s}${f}`))
      .filter(f => lstatSync(f).isFile() && f.endsWith('.dat'))
      ;
  }

  private getAllFiles(folder: string): string[] {
    return readdirSync(folder)
      .flatMap(f => lstatSync(f).isDirectory() ? this.getAllFiles(f) : f);
  }

}
