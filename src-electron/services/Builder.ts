import { lstatSync, readdirSync } from 'fs';
import { dirname, resolve, sep as s } from 'path';
import { MakeobjAsync } from 'simutrans-makeobj-wrapper';
import MakeobjResult from 'simutrans-makeobj-wrapper/dist/src/MakeobjResponse';

export default class Builder {
  abortControler?: AbortController;

  public async pak(makeobjPath: string, size: number, pakPath: string, sourcePath: string): Promise<MakeobjResult> {
    const datFiles = this.findDatFiles(resolve(sourcePath));

    if (datFiles.length < 1) {
      throw new Error(`dat file not found in ${sourcePath}.`);
    }
    const resolvedPakPath = resolve(pakPath);

    const cwd = dirname(datFiles[0]);

    this.abortControler = new AbortController();
    const makeobj = new MakeobjAsync(resolve(makeobjPath), this.abortControler);
    return makeobj.exec(
      {
        cwd,
        signal: this.abortControler.signal,
      },
      `PAK${size}`,
      resolvedPakPath,
      ...datFiles
    );
  }

  public stop(): void | Promise<void> {
    if (this.abortControler && this.abortControler.signal.aborted === false) {
      this.abortControler.abort();
      return new Promise((ok) => setTimeout(ok, 500));
    }
  }

  private findDatFiles(folder: string): string[] {
    return readdirSync(folder)
      .map((f) => resolve(`${folder}${s}${f}`))
      .filter((f) => lstatSync(f).isFile() && f.endsWith('.dat'));
  }

  private getAllFiles(folder: string): string[] {
    return readdirSync(folder).flatMap((f) => (lstatSync(f).isDirectory() ? this.getAllFiles(f) : f));
  }
}
