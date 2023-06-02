import { app, ipcMain } from 'electron';
import MessagingApi from '../base/MessagingApi';
import { nanoid } from 'nanoid'
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
export default class extends MessagingApi {
  protected register(): void {
    ipcMain.removeAllListeners('merge');
    ipcMain.on('merge', (event, imageMergerPath: string, json: string) => this.merge(imageMergerPath, json));
  }

  private async merge(imageMergerPath: string, json: string) {
    const tmppath = this.getTmppath('.json');

    writeFileSync(tmppath, json);

    this.spawn(imageMergerPath, [tmppath]);
  }

  private getTmppath(ext = ''): string {
    const dir = join(app.getPath('temp'), process.env.APP_NAME || 'simutrans-addon-tool');
    if (!existsSync(dir)) {
      mkdirSync(dir);
    }
    return join(dir, nanoid() + ext);
  }
}
