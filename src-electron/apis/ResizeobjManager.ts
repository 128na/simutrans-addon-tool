import { ipcMain, type BrowserWindow } from 'electron';
import { ResizeobjArgs, ResizeobjOptions } from 'app/types/global';
import path from 'path';
import Manager from './Manager';
import { spawn } from 'child_process';

const argMapping: { [key: string]: { flag: string, defaultValue: unknown } } = {
  a: { flag: '-A', defaultValue: 0 },
  s: { flag: '-S', defaultValue: 1 },
  w: { flag: '-W', defaultValue: 64 },
  k: { flag: '-K', defaultValue: false },
  ka: { flag: '-Ka', defaultValue: false },
  x: { flag: '-X', defaultValue: false },
  m: { flag: '-M', defaultValue: 4 },
  e: { flag: '-E', defaultValue: '.64.pak' },
  t: { flag: '-T', defaultValue: '' },
  n: { flag: '-N', defaultValue: false },
};

export default class ResizeobjManager implements Manager {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  register(mainWindow: BrowserWindow): void {
    ipcMain.removeHandler('resizeobj');
    ipcMain.handle('resizeobj', (event, args: ResizeobjArgs) => this.handler(args));
  }

  async handler(args: ResizeobjArgs) {
    try {
      console.log({ args });
      const target = path.join(args.target, '*.pak');
      const options = this.buildOption(args.options);

      return new Promise(ok => {
        // ダイアログ抑止オプションは必須なので固定
        const child = spawn(args.resizeobjPath, ['-D', ...options, target]);
        let stdout = '';
        let stderr = '';
        child.stdout.on('data', (data) => { stdout += data });
        child.stderr.on('data', (data) => { stderr += data });
        child.on('close', (code) => {
          ok({ code, stdout, stderr });
        });
      })
    } catch (error) {

    }
  }

  private buildOption(options: ResizeobjOptions): string[] {
    const opt = [];
    for (const key in options) {
      const map = argMapping[key];
      //  デフォルト値と異なる場合のみ指定する
      if (map && options[key] !== map.defaultValue) {
        switch (typeof options[key]) {
          case 'boolean':
            opt.push(map.flag);
            break;
          case 'number':
            opt.push(`${map.flag}=${options[key]}`);
            break;
          case 'string':
            opt.push(`${map.flag}="${options[key]}"`);
            break;
          default:
            console.warn('unknown type', { key, map, options });
            break;
        }
      }
    }
    return opt;
  }
}
