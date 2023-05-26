import type Electron from 'electron';
import type Router from 'vue-router';

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

interface listPakOption {
  makeobjPath: string;
  pakPath: string;
}

interface updatePakArgs {
  (event: Electron.IpcRendererEvent, level: Level, message: string, args?: unknown): void;
}
type updateAutoPakArgs = updatePakArgs;

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
    };
    autoPakAPI: {
      startPak: (options: startPakOption) => void;
      stopPak: () => void;
      updatePak: (callback: updatePakArgs) => void;

      startAutoPak: (options: startAutoPakOption) => void;
      stopAutoPak: () => void;
      updateAutoPak: (callback: updatePakArgs) => void;

      listPak: (options: listPakOption) => Promise<addon[]>;
    };
    githubAPI: {
      getLatestRelease: () => Promise<OctokitResponse>;
    };

  }
}
