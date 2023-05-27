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
      this.messenger.send('PakManager.startPak', 'info', 'Pakファイル作成開始');
      const dirs = await this.fileManager.findDatDirectories(this.sourcePath);
      this.messenger.send('PakManager.startPak', 'debug', 'dat一覧', dirs);

      if (this.pakPath) {
        await this.doPakWithMerge(dirs);
      } else {
        await this.doPakWithoutMerge(dirs);
      }

    } catch (error: unknown) {
      this.errorHandler(error);
    }
  }

  /**
   * 開始済みのabortControllerがあれば中断して新たなabortControllerを作成する
   */
  protected async beginAbortTransaction() {
    if (this.abortController && this.abortController.signal.aborted === false) {
      this.abortController.abort();
      await new Promise<void>(ok => { setTimeout(() => { ok(); }, 100) });
    }
    this.abortController = new AbortController();
    return this.abortController;
  }

  /**
   * pakファイルを各ディレクトリに書き出し、出力先にマージする
   */
  protected async doPakWithMerge(dirs: string[][]) {
    if (!this.makeobjPath || !this.size || !this.pakPath) {
      throw new Error('動作に必要な設定値が不足しています');
    }

    let hasFailed = false;
    const tmpPaks = [];
    for (const files of dirs) {
      if (hasFailed) {
        continue;
      }
      const dir = this.fileManager.getDirname(files[0]);
      this.messenger.send('PakManager.doPakWithMerge', 'debug', 'pak化開始', dir);
      const tmpPak = this.fileManager.createTmpPath(dir);
      const result = await this.builder.pak(this.makeobjPath, this.size, tmpPak, files, this.abortController);
      if (result.isSuccess) {
        this.messenger.send('PakManager.doPakWithMerge', 'success', result.stdout);
        tmpPaks.push(tmpPak);
      } else {
        this.messenger.send('PakManager.doPakWithMerge', 'error', result.stderr);
        hasFailed = true;
      }
    }
    this.abortController = undefined;

    if (hasFailed) {
      await this.deleteFiles(tmpPaks);
      throw new Error('Pak化失敗したフォルダがあるため中断しました');
    }
    if (tmpPaks.length < 2) {
      this.messenger.send('PakManager.doPakWithMerge', 'debug', 'pakファイル移動');
      await this.fileManager.rename(tmpPaks[0], this.pakPath);
      return this.messenger.send('PakManager.doPakWithoutMerge', 'success', 'Pak化成功');
    }
    this.messenger.send('PakManager.doPakWithMerge', 'debug', '各フォルダ内のpakマージ');
    const result = await this.builder.merge(this.makeobjPath, tmpPaks, this.pakPath);
    if (result.isSuccess) {
      this.messenger.send('PakManager.doPakWithMerge', 'success', result.stdout);
    } else {
      this.messenger.send('PakManager.doPakWithMerge', 'error', result.stderr);
    }
    await this.deleteFiles(tmpPaks);
    return this.messenger.send('PakManager.doPakWithMerge', 'success', 'Pak化成功');
  }

  /**
   * pakファイルを各ディレクトリにobj単位で書き出す
   */
  private async doPakWithoutMerge(dirs: string[][]) {
    if (!this.makeobjPath || !this.size) {
      throw new Error('動作に必要な設定値が不足しています');
    }

    let hasFailed = false;
    for (const files of dirs) {
      const dir = this.fileManager.getDirname(files[0]);
      this.messenger.send('PakManager.doPakWithMerge', 'debug', 'pak化開始', dir);
      const result = await this.builder.pakByDirectory(this.makeobjPath, this.size, files, this.abortController);
      if (result.isSuccess) {
        this.messenger.send('PakManager.doPakWithoutMerge', 'success', result.stdout);
      } else {
        this.messenger.send('PakManager.doPakWithoutMerge', 'error', result.stderr);
        hasFailed = true;
      }
    }
    this.abortController = undefined;
    if (hasFailed) {
      this.messenger.send('PakManager.doPakWithoutMerge', 'warning', 'Pak化に失敗したものがあります');
    }
    this.messenger.send('PakManager.doPakWithoutMerge', 'success', 'Pak化成功');
  }


  /**
   * ファイルの削除
   */
  private deleteFiles(files: string[]): Promise<void[]> {
    this.messenger.send('PakManager.deleteFiles', 'debug', 'ファイル削除', files);
    return this.fileManager.deletefiles(files);
  }

  /**
   * エラーキャッチ
   */
  protected errorHandler(error: unknown) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return this.messenger.send('PakManager.errorHandler', 'warning', '処理を中断しました');
      }
      return this.messenger.send('PakManager.errorHandler', 'error', error.message);
    }
    this.messenger.send('PakManager.errorHandler', 'error', 'エラーが発生しました', error);
  };

  public stop() {
    if (this.abortController && this.abortController.signal.aborted === false) {
      this.messenger.send('PakManager.stop', 'warning', '処理を中断しています');
      this.abortController.abort();
    }
  }
}
