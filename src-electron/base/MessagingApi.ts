import Messenger from '../services/Messenger';
import FileManager from '../services/FileManager';
import { SpawnOptionsWithoutStdio, spawn } from 'child_process';

export default abstract class MessagingApi {
  messenger: Messenger;
  fileManager: FileManager;

  constructor(messenger: Messenger) {
    this.messenger = messenger;
    this.fileManager = new FileManager();

    this.register();
  }

  protected abstract register(): void;

  protected spawn(exePath: string, args: string[] = [], options: SpawnOptionsWithoutStdio = {}) {
    return new Promise<number | null>((ok) => {
      const child = spawn(exePath, args, options);
      child.stdout.on('data', (data) => this.onStdout(data));
      child.stderr.on('data', (data) => this.onStderr(data));
      child.on('close', (code) => ok(code));
    });
  }

  protected onStdout(data: Buffer): void {
    return this.messenger.send('MessagingApi.onStdout', 'success', this.bufferToString(data));
  }

  protected onStderr(data: Buffer): void {
    return this.messenger.send('MessagingApi.onStderr', 'error', this.bufferToString(data));
  }

  protected bufferToString(buf: Buffer): string {
    return buf.toString().replace(/\r\n/gi, '\n').replace(/\r/gi, '\n');
  }

  /**
   * エラーキャッチ
   */
  protected errorHandler(error: unknown) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return this.messenger.send('MessagingApi.errorHandler', 'warning', '処理を中断しました。');
      }
      return this.messenger.send('MessagingApi.errorHandler', 'error', error.message);
    }
    this.messenger.send('MessagingApi.errorHandler', 'error', 'エラーが発生しました。', error);
  }
}
