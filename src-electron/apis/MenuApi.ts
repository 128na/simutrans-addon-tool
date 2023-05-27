import type { MenuItemConstructorOptions } from 'electron';

import { Menu } from 'electron';
import Api from '../base/Api';

const prod = process.env.PROD;
const template: MenuItemConstructorOptions[] = [
  { role: 'reload' },
  { role: 'forceReload' },
  { role: 'toggleDevTools' },
];

export default class MenuApi extends Api {
  protected register(): void {
    Menu.setApplicationMenu(prod ? null : Menu.buildFromTemplate(template));
  }
}

