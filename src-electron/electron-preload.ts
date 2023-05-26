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
import { listPakOption, startAutoPakOption, startPakOption, updateAutoPakArgs, updatePakArgs } from 'app/interface';
import type { IpcRendererEvent, OpenDialogOptions, SaveDialogOptions } from 'electron';
import { contextBridge, ipcRenderer } from 'electron';
import type { RouteRecordRaw } from 'vue-router';

contextBridge.exposeInMainWorld('electronAPI', {
  router: (callback: (event: IpcRendererEvent, value: RouteRecordRaw) => void) => ipcRenderer.on('router', callback),
  selectDir: () => ipcRenderer.invoke('selectDir'),
  showError: (message: string) => ipcRenderer.invoke('showError', message),
  selectSingleFile: (options?: OpenDialogOptions) => ipcRenderer.invoke('selectFile', { multiSelections: false, ...options }),
  saveFile: (options: SaveDialogOptions) => ipcRenderer.invoke('saveFile', options),
  openUrl: (path: string) => ipcRenderer.invoke('openUrl', path),
  openDir: (path: string) => ipcRenderer.invoke('openDir', path),
  getCache: (key: string) => ipcRenderer.invoke('getCache', key),
  setCache: (key: string, value: unknown) => ipcRenderer.invoke('setCache', key, value),
});

contextBridge.exposeInMainWorld('autoPakAPI', {
  startPak: (options: startPakOption) => ipcRenderer.send('startPak', options),
  stopPak: () => ipcRenderer.send('stopPak'),
  updatePak: (callback: updatePakArgs) => ipcRenderer.on('updatePak', callback),

  startAutoPak: (options: startAutoPakOption) => ipcRenderer.send('startAutoPak', options),
  stopAutoPak: () => ipcRenderer.send('stopAutoPak'),
  updateAutoPak: (callback: updateAutoPakArgs) => ipcRenderer.on('updateAutoPak', callback),

  listPak: (options: listPakOption) => ipcRenderer.invoke('listPak', options),
});

contextBridge.exposeInMainWorld('githubAPI', {
  getLatestRelease: () => ipcRenderer.invoke('getLatestRelease'),
});
