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
      selectMultiFiles: (options: Electron.OpenDialogOptions) => Promise<string[]>;
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
      resizeobj: (args: ResizeobjArgs) => Promise<void>;
    };

    imageAPI: {
      merge: (options: mergeImageOption) => Promise<void>;
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

type IpcChannel = 'pak' | 'autoPak' | 'resizeobj' | 'mergeImage';

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
  target: string[];
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

interface MergeImageOption {
  version: number;
  definitions: MergeDefinition[];
  comment?: string
}
interface MergeDefinition {
  outputPath: string;
  rules: MergeRule[];
  comment?: string
}
interface MergeRule {
  /* ルール名 */
  name: string;
  comment?: string
}

/* 画像合成ルール */
interface MergeImageRule extends MergeRule {
  name: 'mergeImage';
  /* ファイルパス */
  pathes: string[];
  /* 合成方式 */
  mode: 'normal';
  offset: {
    x: number,
    y: number,
  }
}
/* 透明を透過色にする */
interface RemoveTransparentRule extends MergeRule {
  name: 'removeTransparent';
  /* 透明色に置換するアルファの閾値(0-255) */
  threthold: number
}
/* 指定色置換 */
interface ReplaceColorRule extends MergeRule {
  name: 'replaceColor';
  search: RGB;
  replace: RGBA;
}
/* 特殊色削除 */
interface RemoveSpecialColorRule extends MergeRule {
  name: 'removeSpecialColor';
}
