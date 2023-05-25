import type { MenuItemConstructorOptions, BrowserWindow } from 'electron';

import { Menu } from 'electron';

const isMac = process.platform === 'darwin';
const prod = process.env.PROD;

const devTools: MenuItemConstructorOptions[] = prod ? [] : [{ role: 'toggleDevTools' }, { role: 'forceReload' }];

export default function registerMenu(mainWindow: BrowserWindow) {
  const template: MenuItemConstructorOptions[] = [
    {
      label: 'Tools',
      submenu: [
        {
          label: 'About',
          click: () => mainWindow.webContents.send('router', { name: 'about' }),
        },
        {
          label: 'Pak',
          click: () => mainWindow.webContents.send('router', { name: 'pak' }),
        },
        {
          label: 'AutoPak',
          click: () => mainWindow.webContents.send('router', { name: 'autoPak' }),
        },
        {
          label: 'Links',
          click: () => mainWindow.webContents.send('router', { name: 'links' }),
        },
      ],
    },
    {
      label: 'Misc',
      submenu: [{ role: 'reload' }, { role: 'forceReload' }, { role: 'about' }, { type: 'separator' }, { role: isMac ? 'close' : 'quit' }],
    },
    ...devTools,
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(prod ? null : menu);
  console.log('[Menu] registered');
}
