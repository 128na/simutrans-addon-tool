import { ipcMain } from 'electron';
import { startAutoPakOption } from 'app/types/global';
import BasePakApi from '../base/BasePakApi';
import Watcher from '../services/Watcher';
import Simutrans from '../services/Simutrans';
import Messenger from '../services/Messenger';

export default class AutoPakApi extends BasePakApi {
  watcher: Watcher;
  simutrans?: Simutrans;

  constructor(messenger: Messenger) {
    super(messenger);
    this.watcher = new Watcher();
  }

  protected register(): void {
    ipcMain.removeAllListeners('startAutoPak');
    ipcMain.on('startAutoPak', (event, options: startAutoPakOption) => this.start(options));
    ipcMain.removeAllListeners('stopAutoPak');
    ipcMain.on('stopAutoPak', () => this.stop());
  }

  private start(options: startAutoPakOption) {
    this.makeobjPath = options.makeobjPath;
    this.simutrans = new Simutrans(options.simutransPath);
    this.size = options.size;
    this.pakPath = options.pakPath;
    this.sourcePath = options.sourcePath;

    if (!this.sourcePath) {
      throw new Error('動作に必要な設定値が不足しています。');
    }

    this.watcher.start(
      this.fileManager.getWatchTarget(this.sourcePath),
      (pathes) => this.onReady(pathes),
      (path) => this.onUpdate(path)
    );
  }

  private onReady(pathes: onReadyArgs) {
    this.messenger.send('AutoPakApi.onReady', 'debug', '監視準備完了', pathes);
    this.doProcess();
  }

  private onUpdate(path: string) {
    this.messenger.send('AutoPakApi.onUpdate', 'debug', '変更検知', path);
    this.doProcess();
  }

  private async doProcess() {
    try {
      if (!this.sourcePath) {
        throw new Error('動作に必要な設定値が不足しています。');
      }
      await this.beginAbortTransaction();
      this.messenger.send('AutoPakApi.doProcess', 'info', 'Pak作成開始');
      const dirs = await this.fileManager.findDatDirectories(this.sourcePath);

      await this.doPakWithMerge(dirs);

      this.messenger.send('AutoPakApi.doProcess', 'info', 'Simutrans起動開始。');
      this.simutrans?.run();
    } catch (error: unknown) {
      this.errorHandler(error);
    }
  }

  protected stop() {
    super.stop();

    this.watcher.stop();
    return this.messenger.send('AutoPakApi.stop', 'warning', '処理を中断しました。');
  }
}
