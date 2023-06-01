import { ipcMain } from 'electron';
import MessagingApi from '../base/MessagingApi';
import { ImageMergeOption } from 'app/types/global';

export default class extends MessagingApi {
  protected register(): void {
    ipcMain.removeHandler('merge');
    ipcMain.handle('merge', (event, option: ImageMergeOption) => this.merge(option));
  }

  private async merge(option: ImageMergeOption) {
    const json = JSON.stringify(option, null, 2);
    console.log('[merge]', json);
  }
}
