import { ipcMain } from 'electron';
import MessagingApi from '../base/MessagingApi';
import { MergeImageOption } from 'app/types/global';


export default class extends MessagingApi {
  protected register(): void {
    ipcMain.removeHandler('merge');
    ipcMain.handle('merge', (event, option: MergeImageOption) => this.merge(option));
  }

  private async merge(option: MergeImageOption) {
    console.log('[merge]', option);
  }

}
