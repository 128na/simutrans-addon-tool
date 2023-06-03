import { app, ipcMain } from 'electron';
import MessagingApi from '../base/MessagingApi';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
export default class extends MessagingApi {
  protected register(): void {
    ipcMain.removeAllListeners('merge');
    ipcMain.on('merge', (event, imageMergerPath: string, json: string) => this.merge(imageMergerPath, json));
  }

  private async merge(imageMergerPath: string, json: string) {
    const tmppath = this.getTmppath('.json');

    writeFileSync(tmppath, json);

    await this.spawn(imageMergerPath, [tmppath]);
    unlinkSync(tmppath);
  }

  private getTmppath(ext = ''): string {
    const dir = join(app.getPath('temp'), process.env.APP_NAME || 'simutrans-addon-tool');
    if (!existsSync(dir)) {
      mkdirSync(dir);
    }
    return join(dir, uuidv4() + ext);
  }
}
