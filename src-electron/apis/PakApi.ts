import { ipcMain } from 'electron';
import { startPakOption } from 'app/types/global';
import BasePakApi from '../base/BasePakApi';

export default class PakApi extends BasePakApi {

  protected register(): void {
    ipcMain.removeListener('startPak', (event, options: startPakOption) => this.startPak(options));
    ipcMain.on('startPak', (event, options: startPakOption) => this.startPak(options));
    ipcMain.removeListener('stopPak', () => this.stop());
    ipcMain.on('stopPak', () => this.stop());
  }

  private async startPak(options: startPakOption) {
    this.makeobjPath = options.makeobjPath;
    this.size = options.size;
    this.pakPath = options.pakPath;
    this.sourcePath = options.sourcePath;

    try {
      if (!this.sourcePath) {
        throw new Error('動作に必要な設定値が不足しています');
      }
      await this.beginAbortTransaction();
      this.messenger.send('PakApi.startPak', 'info', 'Pakファイル作成開始');
      const dirs = await this.fileManager.findDatDirectories(this.sourcePath);
      this.messenger.send('PakApi.startPak', 'debug', 'dat一覧', dirs);

      if (this.pakPath) {
        await this.doPakWithMerge(dirs);
      } else {
        await this.doPakWithoutMerge(dirs);
      }

    } catch (error: unknown) {
      this.errorHandler(error);
    }
  }
}
