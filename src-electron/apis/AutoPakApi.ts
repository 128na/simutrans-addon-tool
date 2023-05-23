import { ipcMain, type BrowserWindow } from 'electron';
import Builder from '../services/Builder';
import Watcher from '../services/Watcher';
import Simutrans from '../services/Simutrans';

const abortControler = new AbortController();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function registerAutoPakApi(mainWindow: BrowserWindow): void {
  ipcMain.removeHandler('startPak');
  ipcMain.on(
    'startPak',
    async (event, { makeobjPath, size, pakPath, sourcePath }) => {
      const builder = new Builder(makeobjPath, abortControler);

      try {
        mainWindow.webContents.send(
          'updatePak',
          'debug',
          'Pakファイル作成開始'
        );
        const result = await builder.pak(size, pakPath, sourcePath);

        if (result.status === 0) {
          console.log('[startPak] pak result', { result });
          mainWindow.webContents.send('updatePak', 'success', result.stdout);
        } else {
          mainWindow.webContents.send('updatePak', 'error', result.stderr);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          mainWindow.webContents.send('updatePak', 'error', error.message);
        } else {
          mainWindow.webContents.send(
            'updatePak',
            'エラーが発生しました',
            error
          );
        }
      }
    }
  );

  const watcher = new Watcher();
  let running = false;
  let timer: NodeJS.Timeout | null = null;

  ipcMain.removeHandler('startAutoPak');
  ipcMain.on(
    'startAutoPak',
    async (
      event,
      { makeobjPath, size, pakPath, simutransPath, sourcePath }
    ) => {
      console.log('[startAutoPak]');
      mainWindow.webContents.send('updateAutoPak', 'debug', '監視準備開始');
      const builder = new Builder(makeobjPath, abortControler);
      const simutrans = new Simutrans(simutransPath);

      const onReady = (pathes: onReadyArgs) => {
        console.log('[onReady]');
        mainWindow.webContents.send(
          'updateAutoPak',
          'debug',
          '監視準備完了',
          pathes
        );
        doProcess();
      };

      const onUpdate = (path: string) => {
        console.log('[onUpdate]', { path });
        mainWindow.webContents.send('updateAutoPak', 'debug', '変更検知', path);
        doProcess();
      };

      const doProcess = async () => {
        // pak化処理中なら後で再実行する
        if (running) {
          if (timer) {
            // 再実行待ちがあるならタイマーリセットする
            console.log('[doProcess] running is true, timer exists, clear');
            clearTimeout(timer);
          }
          timer = setTimeout(() => doProcess(), 5000);
          console.log('[doProcess] set timer');
          mainWindow.webContents.send(
            '[doProcess] updateAutoPak',
            'info',
            '前のpak化完了待ち'
          );
          return;
        }
        // 待ちが終わった＝現時点でファイルはすべて最新化済みなので後続のタイマーはリセットする
        if (timer) {
          console.log('[doProcess] running is false, timer exists, clear');
          clearTimeout(timer);
        }

        console.log('[doProcess] start');
        try {
          running = true;
          mainWindow.webContents.send(
            'updateAutoPak',
            'debug',
            'Pakファイル作成開始'
          );
          const result = await builder.pak(size, pakPath, sourcePath);
          if (!running) {
            return;
          }

          if (result.status === 0) {
            console.log('[doProcess] pak result', { result });
            mainWindow.webContents.send(
              'updateAutoPak',
              'success',
              result.stdout
            );
            simutrans.run();
            mainWindow.webContents.send(
              'updateAutoPak',
              'success',
              'Simutrans起動中'
            );
          } else {
            mainWindow.webContents.send(
              'updateAutoPak',
              'error',
              result.stderr
            );
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            mainWindow.webContents.send(
              'updateAutoPak',
              'error',
              error.message
            );
          } else {
            mainWindow.webContents.send(
              'updateAutoPak',
              'エラーが発生しました',
              error
            );
          }
        } finally {
          console.log('[doProcess] finished');
          running = false;
        }
      };

      watcher.start(sourcePath, onReady, onUpdate);
    }
  );

  ipcMain.removeHandler('stopAutoPak');
  ipcMain.on('stopAutoPak', async () => {
    console.log('[stopAutoPak]');
    abortControler.abort();
    mainWindow.webContents.send('updateAutoPak', 'info', '監視停止');
    running = false;
  });

  console.log('[AutoPakApi] registered');
}
