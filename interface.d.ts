import type Electron from 'electron';
import type MakeobjResult from 'simutrans-makeobj-wrapper/dist/src/MakeobjResponse';
import type Router from 'vue-router';

interface pakOption {
  makeobjPath: string, size: number, pakPath: string, sourcePath: string
}

interface startPakOption {
  makeobjPath: string, size: number, pakPath: string, sourcePath: string, simutransPath: string
}

type Level = 'debug' | 'info' | 'error';
type Color = 'dark' | 'positive' | 'negative';
interface Log {
  datetime: string,
  level: Level,
  color: Color,
  message: string,
  args: unknown[]
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
      startAutoPak: (options: startPakOption) => Promise<MakeobjResult>
      abortAutoPak: () => Promise<void>
    }
  }
}
