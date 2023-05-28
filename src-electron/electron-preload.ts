/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 *
 * WARNING!
 * If accessing Node functionality (like importing @electron/remote) then in your
 * electron-main.ts you will need to set the following when you instantiate BrowserWindow:
 *
 * mainWindow = new BrowserWindow({
 *   // ...
 *   webPreferences: {
 *     // ...
 *     sandbox: false // <-- to be able to import @electron/remote in preload script
 *   }
 * }
 */
import { ResizeobjArgs, listOption, startAutoPakOption, startPakOption, ipcMessengerCb } from 'app/types/global';
import type { IpcRendererEvent, OpenDialogOptions, SaveDialogOptions } from 'electron';
import { contextBridge, ipcRenderer } from 'electron';
import type { RouteRecordRaw } from 'vue-router';

contextBridge.exposeInMainWorld('electronAPI', {
  router: (callback: (event: IpcRendererEvent, value: RouteRecordRaw) => void) => ipcRenderer.on('router', callback),
  selectDir: () => ipcRenderer.invoke('selectDir'),
  showError: (message: string) => ipcRenderer.invoke('showError', message),
  selectSingleFile: (options?: OpenDialogOptions) => ipcRenderer.invoke('selectFile', { multiSelections: false, ...options }),
  selectMultiFiles: (options?: OpenDialogOptions) => ipcRenderer.invoke('selectFile', { multiSelections: true, ...options }),
  saveFile: (options: SaveDialogOptions) => ipcRenderer.invoke('saveFile', options),
  openUrl: (path: string) => ipcRenderer.invoke('openUrl', path),
  openDir: (path: string) => ipcRenderer.invoke('openDir', path),
  getCache: (key: string) => ipcRenderer.invoke('getCache', key),
  setCache: (key: string, value: unknown) => ipcRenderer.invoke('setCache', key, value),

  ipcMessenger: (callback: ipcMessengerCb) => ipcRenderer.on('ipcMessenger', callback),
});

contextBridge.exposeInMainWorld('makeobjApi', {
  startPak: (options: startPakOption) => ipcRenderer.send('startPak', options),
  stopPak: () => ipcRenderer.send('stopPak'),

  startAutoPak: (options: startAutoPakOption) => ipcRenderer.send('startAutoPak', options),
  stopAutoPak: () => ipcRenderer.send('stopAutoPak'),

  listFromPak: (options: listOption) => ipcRenderer.invoke('listFromPak', options),
  listFromDat: (options: listOption) => ipcRenderer.invoke('listFromDat', options),
});

contextBridge.exposeInMainWorld('githubAPI', {
  getLatestRelease: () => ipcRenderer.invoke('getLatestRelease'),
});

contextBridge.exposeInMainWorld('resizeobjAPI', {
  resizeobj: (args: ResizeobjArgs) => ipcRenderer.send('resizeobj', args),
});
