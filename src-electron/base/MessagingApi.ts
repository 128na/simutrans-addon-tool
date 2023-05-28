import Messenger from '../services/Messenger';
import FileManager from '../services/FileManager';

export default abstract class MessagingApi {
  messenger: Messenger;
  fileManager: FileManager;

  constructor(messenger: Messenger) {
    this.messenger = messenger;
    this.fileManager = new FileManager();

    this.register();
  }

  protected abstract register(): void;

  /**
   * エラーキャッチ
   */
  protected errorHandler(error: unknown) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return this.messenger.send('MessagingApi.errorHandler', 'warning', '処理を中断しました');
      }
      return this.messenger.send('MessagingApi.errorHandler', 'error', error.message);
    }
    this.messenger.send('MessagingApi.errorHandler', 'error', 'エラーが発生しました', error);
  }
}
