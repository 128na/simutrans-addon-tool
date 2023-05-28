import FileManager from '../services/FileManager';

export default abstract class Api {
  fileManager: FileManager;

  constructor() {
    this.fileManager = new FileManager();

    this.register();
  }

  protected abstract register(): void;
}
