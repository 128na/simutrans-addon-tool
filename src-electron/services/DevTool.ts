import { session } from 'electron';
import { readdirSync } from 'fs';
import path from 'path';

export default async function registerVue3DevToolForWin() {
  const devToolsDir = path.join(process.env.APPDATA || '', '..', 'Local\\Google\\Chrome\\User Data\\Default\\Extensions', 'nhdogjmejiglipccpnnnanhbledajbpd');
  const devToolsPath = path.join(devToolsDir, getVersion(devToolsDir));
  console.log('[DevTool] versions', process.versions);
  console.log('[DevTool] devToolsPath', devToolsPath);

  await session.defaultSession.loadExtension(devToolsPath);
  console.log('[DevTool] vue3 devtool registered');
}

const getVersion = (path: string): string => {
  const files = readdirSync(path);
  console.log('[DevTool] exists versions', { files });
  if (files.length < 1) {
    throw new Error('vue devtool not found!');
  }

  return files[0];
};
