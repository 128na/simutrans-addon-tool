import { BrowserWindow } from 'electron';
import Builder from '../services/Builder';
import FileManager from '../services/FileManager';


export default class PakManager {
  mainWindow: BrowserWindow;
  builder: Builder;
  fileManager: FileManager;
  abortController?: AbortController;
  makeobjPath?: string;
  size?: number;
  pakPath?: string;
  sourcePath?: string;
  channel = 'updatePak';

  constructor(mainWindow: BrowserWindow, builder: Builder, fileManager: FileManager) {
    this.mainWindow = mainWindow
    this.builder = builder;
    this.fileManager = fileManager;
  }

  protected send(level: Level, message: string, ...args: unknown[]) {
    this.mainWindow.webContents.send(this.channel, level, message, ...args);
  }

  /**
   * 開始済みのabortControllerがあれば中断して新たなabortControllerを作成する
   */
  public async beginAbortTransaction(): Promise<AbortController> {
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
  public async findDirectories(path: string): Promise<string[][]> {
    this.send('debug', 'Pakファイル作成開始');

    const dirs = await this.fileManager.findDatDirectories(path);
    // console.log('[PakManager.startPak]', { dirs });
    if (dirs.length < 1) {
      throw new Error('指定フォルダ内にdatファイルがありません');
    }
    return dirs;
  }

  /**
   * エラーキャッチ
   */
  public errorHandler(error: unknown) {
    if (error instanceof Error) {
      console.log('[PakManager.errorHandler] type is ', error?.name);
      if (error.name === 'AbortError') {
        return this.send('warning', '処理を中断しました');
      }
      return this.send('error', error.message);
    }
    console.log('[PakManager.errorHandler] unknown error', error);
    this.send('error', 'エラーが発生しました', error);
  };

  /**
   * ディレクトリごとにpak化する
   */
  public async doPak(makeobjPath: string, size: number, dirs: string[][]) {
    let hasFailed = false;
    const tmpPaks = [];
    for (const files of dirs) {
      if (hasFailed) {
        continue;
      }
      const dir = this.fileManager.getDirname(files[0]);
      this.send('debug', dir);
      const tmpPak = this.fileManager.createTmpPath(dir);
      const result = await this.builder.pak(makeobjPath, size, tmpPak, files, this.abortController);
      if (result.isSuccess) {
        this.send('success', result.stdout);
        tmpPaks.push(tmpPak);
      } else {
        this.send('error', result.stderr);
        hasFailed = true;
      }
    }
    return { hasFailed, tmpPaks };
  };

  /**
   * pak化失敗したらtmppaksを削除する
   */
  public async pakFailed(tmpPaks: string[]) {
    await this.deleteFiles(tmpPaks);
    this.send('error', 'Pak化失敗したフォルダがあるため中断しました');
  }

  /**
   * pakファイルが1つならpakPathへ移動する
   */
  public async tmpPakMove(tmpPaks: string[], pakPath: string) {
    this.send('debug', 'pakファイル移動');
    return this.fileManager.rename(tmpPaks[0], pakPath);
  }

  /**
   * pakファイルが複数ならマージしてtmp.pakを削除
   */
  public async tmpPakMege(tmpPaks: string[], makeobjPath: string, pakPath: string) {
    this.send('debug', '各フォルダのpakマージ');
    const result = await this.builder.merge(makeobjPath, tmpPaks, pakPath);
    if (result.isSuccess) {
      this.send('success', result.stdout);
    } else {
      this.send('error', result.stderr);
    }
    await this.deleteFiles(tmpPaks);
  }

  /**
   * ファイルの削除
   */
  public deleteFiles(files: string[]): Promise<void[]> {
    this.send('debug', 'ファイル削除', files);
    return this.fileManager.deletefiles(files);
  }

  public async startPak(options: { makeobjPath: string, size: number, pakPath: string, sourcePath: string }) {
    this.makeobjPath = options.makeobjPath;
    this.size = options.size;
    this.pakPath = options.pakPath;
    this.sourcePath = options.sourcePath;

    try {
      await this.beginAbortTransaction();
      const dirs = await this.findDirectories(this.sourcePath);

      const { hasFailed, tmpPaks } = await this.doPak(this.makeobjPath, this.size, dirs);

      if (hasFailed) {
        return this.pakFailed(tmpPaks);
      }
      if (tmpPaks.length < 2) {
        return this.tmpPakMove(tmpPaks, this.pakPath);
      }
      return this.tmpPakMege(tmpPaks, this.makeobjPath, this.pakPath);

    } catch (error: unknown) {
      this.errorHandler(error);
    }
  }
}
