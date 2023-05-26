import { startPakOption } from 'app/types/global';
import Builder from '../services/Builder';
import FileManager from '../services/FileManager';
import Messenger from './Messenger';


export default class PakManager {
  messenger: Messenger;
  builder: Builder;
  fileManager: FileManager;
  abortController?: AbortController;
  makeobjPath?: string;
  size?: number;
  pakPath?: string;
  sourcePath?: string;

  constructor(messenger: Messenger, builder: Builder, fileManager: FileManager) {
    this.messenger = messenger
    this.builder = builder;
    this.fileManager = fileManager;
  }

  public async startPak(options: startPakOption) {
    this.makeobjPath = options.makeobjPath;
    this.size = options.size;
    this.pakPath = options.pakPath;
    this.sourcePath = options.sourcePath;

    try {
      if (!this.sourcePath) {
        throw new Error('動作に必要な設定値が不足しています');
      }
      await this.beginAbortTransaction();
      const dirs = await this.findDirectories(this.sourcePath);

      if (this.pakPath) {
        await this.doPakWithMerge(dirs);
      } else {
        await this.doPakWithoutMerge(dirs);
      }

    } catch (error: unknown) {
      this.errorHandler(error);
    }
  }

  public stop() {
    if (this.abortController && this.abortController.signal.aborted === false) {
      console.log('[AutoPakManager.errorHandler] abortController exists, abort');
      this.messenger.send('warning', '処理を中断しました');
      this.abortController.abort();
    }
  }

  private async doPakWithoutMerge(dirs: string[][]) {
    const { hasFailed } = await this.doPakWithoutTmp(dirs);
    if (hasFailed) {
      this.messenger.send('warning', 'Pak化に失敗したものがあります');
    }
    this.messenger.send('success', 'Pak化成功');
  }

  private async doPakWithMerge(dirs: string[][]) {
    const { hasFailed, tmpPaks } = await this.doPak(dirs);

    if (hasFailed) {
      return this.pakFailed(tmpPaks);
    }
    if (tmpPaks.length < 2) {
      return this.tmpPakMove(tmpPaks);
    }
    return this.tmpPakMege(tmpPaks);
  }

  /**
   * 開始済みのabortControllerがあれば中断して新たなabortControllerを作成する
   */
  protected async beginAbortTransaction(): Promise<AbortController> {
    if (this.abortController && this.abortController.signal.aborted === false) {
      console.log('[PakManager.errorHandler] abortController exists, abort');
      this.abortController.abort();
      await new Promise<void>(ok => { setTimeout(() => { ok(); }, 100) });
    }
    this.abortController = new AbortController();
    console.log('[PakManager.errorHandler] abortController created');
    return this.abortController;
  }

  /**
   * ソースディレクトリからdat一覧をサブディレクトリ単位で取得する
   */
  protected async findDirectories(path: string): Promise<string[][]> {
    this.messenger.send('debug', 'Pakファイル作成開始');

    const dirs = await this.fileManager.findDatDirectories(path);
    // console.log('[PakManager.startPak]', { dirs });
    if (dirs.length < 1) {
      throw new Error('指定フォルダ内にdatファイルがありません');
    }
    return dirs;
  }

  /**
   * ディレクトリごとにpak化する
   */
  protected async doPak(dirs: string[][]) {
    if (!this.makeobjPath || !this.size) {
      throw new Error('動作に必要な設定値が不足しています');
    }

    let hasFailed = false;
    const tmpPaks = [];
    for (const files of dirs) {
      if (hasFailed) {
        continue;
      }
      const dir = this.fileManager.getDirname(files[0]);
      this.messenger.send('debug', dir);
      const tmpPak = this.fileManager.createTmpPath(dir);
      const result = await this.builder.pak(this.makeobjPath, this.size, tmpPak, files, this.abortController);
      if (result.isSuccess) {
        this.messenger.send('success', result.stdout);
        tmpPaks.push(tmpPak);
      } else {
        this.messenger.send('error', result.stderr);
        hasFailed = true;
      }
    }
    return { hasFailed, tmpPaks };
  };

  /**
   * ディレクトリごとにpak化する
   */
  protected async doPakWithoutTmp(dirs: string[][]) {
    if (!this.makeobjPath || !this.size) {
      throw new Error('動作に必要な設定値が不足しています');
    }

    let hasFailed = false;
    for (const files of dirs) {
      const dir = this.fileManager.getDirname(files[0]);
      this.messenger.send('debug', dir);
      const result = await this.builder.pakByDirectory(this.makeobjPath, this.size, files, this.abortController);
      if (result.isSuccess) {
        this.messenger.send('success', result.stdout);
      } else {
        this.messenger.send('error', result.stderr);
        hasFailed = true;
      }
    }
    return { hasFailed };
  };

  /**
   * pak化失敗したらtmpPaksを削除する
   */
  protected async pakFailed(tmpPaks: string[]) {
    await this.deleteFiles(tmpPaks);
    this.messenger.send('error', 'Pak化失敗したフォルダがあるため中断しました');
  }

  /**
   * pakファイルが1つならpakPathへ移動する
   */
  protected async tmpPakMove(tmpPaks: string[]) {
    if (!this.pakPath) {
      throw new Error('動作に必要な設定値が不足しています');
    }
    this.messenger.send('debug', 'pakファイル移動');
    return this.fileManager.rename(tmpPaks[0], this.pakPath);
  }

  /**
   * pakファイルが複数ならマージしてtmp.pakを削除
   */
  protected async tmpPakMege(tmpPaks: string[]) {
    if (!this.makeobjPath || !this.pakPath) {
      throw new Error('動作に必要な設定値が不足しています');
    }
    this.messenger.send('debug', '各フォルダ内のpakマージ');
    const result = await this.builder.merge(this.makeobjPath, tmpPaks, this.pakPath);
    if (result.isSuccess) {
      this.messenger.send('success', result.stdout);
    } else {
      this.messenger.send('error', result.stderr);
    }
    await this.deleteFiles(tmpPaks);
  }

  /**
   * ファイルの削除
   */
  private deleteFiles(files: string[]): Promise<void[]> {
    this.messenger.send('debug', 'ファイル削除', files);
    return this.fileManager.deletefiles(files);
  }

  /**
   * エラーキャッチ
   */
  protected errorHandler(error: unknown) {
    if (error instanceof Error) {
      console.log('[PakManager.errorHandler] type is ', error.name);
      if (error.name === 'AbortError') {
        return this.messenger.send('warning', '処理を中断しました');
      }
      return this.messenger.send('error', error.message);
    }
    console.log('[PakManager.errorHandler] unknown error', error);
    this.messenger.send('error', 'エラーが発生しました', error);
  };
}
