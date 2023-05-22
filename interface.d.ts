import type Electron from 'electron';
import type Router from 'vue-router';

interface pakOption {
  makeobjPath: string, size: number, pakPath: string, sourcePath: string
}

interface startPakOption {
  makeobjPath: string, size: number, pakPath: string, sourcePath: string, simutransPath: string
}


interface updatePakArgs {
  (event: Electron.IpcRendererEvent, level: Level, message: string, args?: unknown): void
}
type updateAutoPakArgs = updatePakArgs

declare global {
  interface Window {
    electronAPI: {
      router: (callback: (event: Electron.IpcRendererEvent, value: Router.RouteRecordRaw) => void) => void;
      selectDir: () => Promise<string>,
      selectSingleFile: (options: Electron.OpenDialogOptions) => Promise<string>,
      saveFile: (options: Electron.SaveDialogOptions) => Promise<string>,
      openUrl: (url: string) => Promise<void>,
      openDir: (path: string) => Promise<string>,
      getCache: (key: string) => Promise<unknown>,
      setCache: (key: string, value: unknown) => Promise<void>,
    }
    autoPakAPI: {
      startPak: (options: pakOption) => void,
      updatePak: (callback: updatePakArgs) => void,
      startAutoPak: (options: startPakOption) => void
      stopAutoPak: () => void
      updateAutoPak: (callback: updateAutoPakArgs) => void,
    }
  }
}
