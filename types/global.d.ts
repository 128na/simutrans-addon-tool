import { Router } from 'vue-router';

declare global {
  interface Window {
    electronAPI: {
      router: (callback: (event: Electron.IpcRendererEvent, value: Router.RouteRecordRaw) => void) => void;
      showError: (message: string) => Promise<string>;
      selectDir: () => Promise<string>;
      selectSingleFile: (options: Electron.OpenDialogOptions) => Promise<string>;
      selectMultiFiles: (options: Electron.OpenDialogOptions) => Promise<string[]>;
      saveFile: (options: Electron.SaveDialogOptions) => Promise<string>;
      openUrl: (url: string) => Promise<void>;
      openDir: (path: string) => Promise<string>;
      getCache: (key: string) => Promise<unknown>;
      setCache: (key: string, value: unknown) => Promise<void>;
      readFile: (filepath: string) => Promise<string | undefined>;
      writeFile: (filepath: string, data: string) => Promise<undefined>;

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
      getLatestRelease: () => Promise<GithubVersionResponse>;
    };

    resizeobjAPI: {
      resizeobj: (args: ResizeobjArgs) => Promise<void>;
    };

    imageMergerAPI: {
      merge: (imageMergerPath: string, json: string) => Promise<void>;
    };
  }
}
