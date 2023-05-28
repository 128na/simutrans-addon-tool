import Makeobj from '../services/Makeobj';
import Messenger from '../services/Messenger';
import MessagingApi from './MessagingApi';

export default abstract class BasePakApi extends MessagingApi {
  makeobj: Makeobj;
  abortController?: AbortController;
  makeobjPath?: string;
  size?: number;
  pakPath?: string;
  sourcePath?: string;

  constructor(messenger: Messenger) {
    super(messenger);
    this.makeobj = new Makeobj();
  }

  /**
   * 開始済みのabortControllerがあれば中断して新たなabortControllerを作成する
   */
  protected async beginAbortTransaction() {
    if (this.abortController && this.abortController.signal.aborted === false) {
      this.abortController.abort();
      await new Promise<void>((ok) => {
        setTimeout(() => {
          ok();
        }, 100);
      });
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
      this.messenger.send('BasePakApi.doPakWithMerge', 'debug', 'Pak作成開始', dir);
      const tmpPak = this.fileManager.createTmpPath(dir);
      const result = await this.makeobj.pak(this.makeobjPath, this.size, tmpPak, files, this.abortController);
      if (result.isSuccess) {
        this.messenger.send('BasePakApi.doPakWithMerge', 'success', result.stdout);
        tmpPaks.push(tmpPak);
      } else {
        this.messenger.send('BasePakApi.doPakWithMerge', 'error', result.stderr);
        hasFailed = true;
      }
    }
    this.abortController = undefined;

    if (hasFailed) {
      await this.deleteFiles(tmpPaks);
      throw new Error('Pak作成失敗したフォルダがあるため中断しました');
    }
    if (tmpPaks.length < 2) {
      this.messenger.send('BasePakApi.doPakWithMerge', 'debug', 'Pakファイル移動');
      await this.fileManager.rename(tmpPaks[0], this.pakPath);
      return this.messenger.send('BasePakApi.doPakWithoutMerge', 'success', 'Pak作成完了');
    }
    this.messenger.send('BasePakApi.doPakWithMerge', 'debug', '各フォルダ内のpakマージ');
    const result = await this.makeobj.merge(this.makeobjPath, tmpPaks, this.pakPath);
    if (result.isSuccess) {
      this.messenger.send('BasePakApi.doPakWithMerge', 'success', result.stdout);
    } else {
      this.messenger.send('BasePakApi.doPakWithMerge', 'error', result.stderr);
    }
    await this.deleteFiles(tmpPaks);
    return this.messenger.send('BasePakApi.doPakWithMerge', 'success', 'Pak作成完了');
  }

  /**
   * pakファイルを各ディレクトリにobj単位で書き出す
   */
  protected async doPakWithoutMerge(dirs: string[][]) {
    if (!this.makeobjPath || !this.size) {
      throw new Error('動作に必要な設定値が不足しています');
    }

    let hasFailed = false;
    for (const files of dirs) {
      const dir = this.fileManager.getDirname(files[0]);
      this.messenger.send('BasePakApi.doPakWithMerge', 'debug', 'Pak作成開始', dir);
      const result = await this.makeobj.pakByDirectory(this.makeobjPath, this.size, files, this.abortController);
      if (result.isSuccess) {
        this.messenger.send('BasePakApi.doPakWithoutMerge', 'success', result.stdout);
      } else {
        this.messenger.send('BasePakApi.doPakWithoutMerge', 'error', result.stderr);
        hasFailed = true;
      }
    }
    this.abortController = undefined;
    if (hasFailed) {
      this.messenger.send('BasePakApi.doPakWithoutMerge', 'warning', 'Pak作成に失敗したものがあります');
    }
    this.messenger.send('BasePakApi.doPakWithoutMerge', 'success', 'Pak作成完了');
  }

  /**
   * ファイルの削除
   */
  protected deleteFiles(files: string[]): Promise<void[]> {
    this.messenger.send('BasePakApi.deleteFiles', 'debug', 'ファイル削除', files);
    return this.fileManager.deletefiles(files);
  }

  protected stop() {
    if (this.abortController && this.abortController.signal.aborted === false) {
      this.messenger.send('BasePakApi.stop', 'warning', '処理を中断しています');
      this.abortController.abort();
    }
  }
}
