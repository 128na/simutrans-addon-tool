import { spawn } from 'child_process';
import { lstatSync, readdirSync } from 'fs';
import { dirname, resolve, sep as s } from 'path';
import { Makeobj } from 'simutrans-makeobj-wrapper';
import MakeobjResult from 'simutrans-makeobj-wrapper/dist/src/MakeobjResponse';

export default class Builder {
  makeobj: Makeobj;
  makeobjPath: string;

  constructor(makeobjPath: string) {
    this.makeobjPath = makeobjPath;
    this.makeobj = new Makeobj(resolve(makeobjPath));
  }

  public pak(size: number, pakPath: string, sourcePath: string): Promise<MakeobjResult> {
    const datFiles = this.findDatFiles(resolve(sourcePath));

    if (datFiles.length < 1) {
      throw new Error(`dat file not found in ${sourcePath}.`);
    }
    const resolvedPakPath = resolve(pakPath);

    const cwd = dirname(datFiles[0]);
    const command = [`PAK${size}`, resolvedPakPath, ...datFiles];
    console.log('[Builder] execute makeobj', { makeobj: this.makeobjPath, command, cwd });

    const child = spawn(this.makeobjPath, command, { cwd });

    return new Promise((resolve, reject) => {
      let stdout = '';
      let stderr = '';
      child.stdout.on('data', (data) => { stdout += data.toString().replace(/\r\n/gi, '\n').replace(/\r/gi, '\n'); });
      child.stderr.on('data', (data) => { stderr += data.toString().replace(/\r\n/gi, '\n').replace(/\r/gi, '\n'); });
      child.on('close', (status) => { resolve(new MakeobjResult({ status, stdout, stderr })); });
      child.on('error', (err) => { reject(err); });
    });
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
