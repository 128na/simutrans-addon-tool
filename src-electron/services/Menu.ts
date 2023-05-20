import type { MenuItemConstructorOptions, BrowserWindow } from 'electron';

import { Menu } from 'electron';

const isMac = process.platform === 'darwin';

export default function registerMenu(mainWindow: BrowserWindow) {
  const template: MenuItemConstructorOptions[] = [
    {
      label: 'tools',
      submenu: [
        {
          label: 'Top',
          click() { mainWindow.webContents.send('router', { name: 'top' }); },
        },
        {
          label: 'AutoPak',
          click() { mainWindow.webContents.send('router', { name: 'autoPak' }); },
        },
        {
          label: 'missing',
          click() { mainWindow.webContents.send('router', { name: 'missing' }); },
        },
      ],
    },
    {
      label: 'misc',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { role: 'about' },
        { type: 'separator' },
        { role: isMac ? 'close' : 'quit' },
      ],
    },

  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
