import { BrowserWindow } from 'electron';

export default class Messenger {
  mainWindow: BrowserWindow;
  channel: string;

  constructor(mainWindow: BrowserWindow, channel: string) {
    this.mainWindow = mainWindow;
    this.channel = channel;
  }

  public send(location: string, level: Level, message: string, ...args: unknown[]): void {
    console.log(`[${location}] [${level.toUpperCase()}] ${message}`, ...args);

    this.mainWindow.webContents.send(this.channel, level, message, ...args);
  }
}
