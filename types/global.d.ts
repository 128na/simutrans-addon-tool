import type Electron from 'electron';
import type Router from 'vue-router';
import { Dat } from 'simutrans-dat-parser';

declare global {
  interface Window {
    electronAPI: {
      router: (callback: (event: Electron.IpcRendererEvent, value: Router.RouteRecordRaw) => void) => void;
      showError: (message: string) => Promise<string>;
      selectDir: () => Promise<string>;
      selectSingleFile: (options: Electron.OpenDialogOptions) => Promise<string>;
      saveFile: (options: Electron.SaveDialogOptions) => Promise<string>;
      openUrl: (url: string) => Promise<void>;
      openDir: (path: string) => Promise<string>;
      getCache: (key: string) => Promise<unknown>;
      setCache: (key: string, value: unknown) => Promise<void>;

      ipcMessenger: (callback: ipcMessengerCb) => void;
    };
    makeobjApi: {
      startPak: (options: startPakOption) => void;
      stopPak: () => void;

      startAutoPak: (options: startAutoPakOption) => void;
      stopAutoPak: () => void;

      listFromPak: (options: listOption) => Promise<PakConvertedAddon[]>;
      listFromDat: (options: listOption) => Promise<DatAddon[]>;
    };
    githubAPI: {
      getLatestRelease: () => Promise<OctokitResponse>;
    };

    resizeobjAPI: {
      resizeobj: (args: ResizeobjArgs) => Promise<unknown>;
    };
  }
}

interface startPakOption {
  makeobjPath: string;
  size: number;
  pakPath: string;
  sourcePath: string;
}

interface startAutoPakOption {
  makeobjPath: string;
  size: number;
  pakPath: string;
  sourcePath: string;
  simutransPath: string;
}

interface listOption {
  makeobjPath: string;
  target: string;
}

type IpcChannel = 'pak' | 'autoPak' | 'resizeobj';

interface ipcMessengerCb {
  (event: Electron.IpcRendererEvent, channel: IpcChannel, level: Level, message: string, args?: unknown): void;
}

interface DatAddon {
  file: string;
  dat: string;
}
interface DatConvertedAddon {
  file: string;
  dat: Dat;
}
interface PakAddon {
  pak: string;
  objs: string[];
}
interface PakConvertedAddon {
  file: string;
  objs: string[];
}

interface ResizeobjArgs {
  resizeobjPath: string;
  target: string;
  options: ResizeobjOptions;
}
interface ResizeobjOptions {
  [key: string]: unknown;
  a?: number;
  s?: 0 | 1 | 2;
  w?: number;
  k?: boolean;
  ka?: boolean;
  x?: boolean;
  m?: number;
  e?: string;
  t?: string;
  n?: boolean;
}
