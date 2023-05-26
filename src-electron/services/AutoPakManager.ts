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

  private onReady(pathes: onReadyArgs) {
    console.log('[onReady]');
    this.messenger.send('debug', '監視準備完了', pathes);
    this.doProcess();
  };

  private onUpdate(path: string) {
    console.log('[onUpdate]', { path });
    this.messenger.send('debug', '変更検知', path);
    this.doProcess();
  };

  private async doProcess() {
    console.log('[AutoPakManager.doProcess] start');
    try {
      if (!this.sourcePath) {
        throw new Error('動作に必要な設定値が不足しています');
      }
      await this.beginAbortTransaction();
      const dirs = await this.findDirectories(this.sourcePath);

      const { hasFailed, tmpPaks } = await this.doPak(dirs);

      if (hasFailed) {
        return this.pakFailed(tmpPaks);
      }
      if (tmpPaks.length < 2) {
        await this.tmpPakMove(tmpPaks);
      } else {
        await this.tmpPakMege(tmpPaks);
      }
      this.messenger.send('debug', 'Simutrans起動');
      this.simutrans?.run();

    } catch (error: unknown) {
      this.errorHandler(error);
    }
  };

  public startAutoPak(options: startAutoPakOption) {
    console.log(this);
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
}
