import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

export default class Simutrans {

  private simutransPath: string;
  private childProcess?: ChildProcessWithoutNullStreams;

  constructor(simutransPath: string) {
    this.simutransPath = simutransPath;
  }
  public run(): void {
    if (this.childProcess) {
      this.childProcess.kill();
    }
    try {
      this.childProcess = spawn(this.simutransPath, { detached: true });
    } catch (e) {
      console.error(e);
    }
  }
}
