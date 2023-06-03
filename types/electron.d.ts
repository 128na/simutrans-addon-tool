type IpcChannel = 'pak' | 'autoPak' | 'resizeobj' | 'imageMerger';

interface ipcMessengerCb {
  (event: Electron.IpcRendererEvent, channel: IpcChannel, level: Level, message: string, args?: unknown): void;
}
