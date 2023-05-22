import type Electron from 'electron';
import type MakeobjResult from 'simutrans-makeobj-wrapper/dist/src/MakeobjResponse';
import type Router from 'vue-router';

interface pakOption {
  makeobjPath: string, size: number, pakPath: string, sourcePath: string
}

interface startPakOption {
  makeobjPath: string, size: number, pakPath: string, sourcePath: string, simutransPath: string
}

interface updateAutoPakArgs {
  (event: Electron.IpcRendererEvent, level: Level, message: string, args?: unknown): void
}

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
      pak: (options: pakOption) => Promise<MakeobjResult>,
      startAutoPak: (options: startPakOption) => Promise<unknown>
      stopAutoPak: () => Promise<void>
      updateAutoPak: (callback: updateAutoPakArgs) => void,
    }
  }
}
