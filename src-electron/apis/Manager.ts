import { BrowserWindow } from 'electron';

export default interface Manager {
  register(mainWindow: BrowserWindow): void;
}
