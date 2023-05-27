import Builder from './Builder';
import FileManager from './FileManager';
import PakManager from './PakManager';
import Watcher from './Watcher';
import Simutrans from './Simutrans';
import Messenger from './Messenger';
import { startAutoPakOption } from 'app/types/global';


export default class AutoPakManager extends PakManager {
  running = false;
  timer: NodeJS.Timeout | null = null;
  watcher: Watcher;
  simutrans?: Simutrans;

  constructor(messenger: Messenger, builder: Builder, fileManager: FileManager, watcher: Watcher) {
    super(messenger, builder, fileManager);
    this.watcher = watcher;
  }

  public startAutoPak(options: startAutoPakOption) {
    this.makeobjPath = options.makeobjPath;
    this.simutrans = new Simutrans(options.simutransPath);
    this.size = options.size;
    this.pakPath = options.pakPath;
    this.sourcePath = options.sourcePath;

    if (!this.sourcePath) {
      throw new Error('動作に必要な設定値が不足しています');
    }

    this.watcher.start(this.fileManager.getWatchTarget(this.sourcePath), (pathes) => this.onReady(pathes), (path) => this.onUpdate(path));
  }

  private onReady(pathes: onReadyArgs) {
    this.messenger.send('AutoPakManager.onReady', 'debug', '監視準備完了', pathes);
    this.doProcess();
  };

  private onUpdate(path: string) {
    this.messenger.send('AutoPakManager.onUpdate', 'debug', '変更検知', path);
    this.doProcess();
  };

  private async doProcess() {
    try {
      if (!this.sourcePath) {
        throw new Error('動作に必要な設定値が不足しています');
      }
      await this.beginAbortTransaction();
      this.messenger.send('AutoPakManager.doProcess', 'info', 'Pakファイル作成開始');
      const dirs = await this.fileManager.findDatDirectories(this.sourcePath);

      await this.doPakWithMerge(dirs);

      this.messenger.send('AutoPakManager.doProcess', 'info', 'Simutrans起動');
      this.simutrans?.run();

    } catch (error: unknown) {
      this.errorHandler(error);
    }
  };

  public stop() {
    super.stop();

    this.watcher.stop();
    return this.messenger.send('AutoPakManager.stop', 'warning', '処理を中断しました');
  }
}
