import chokidar from 'chokidar';
import fs from 'fs';

export default class Watcher {
  options: chokidar.WatchOptions | undefined;
  watcher: chokidar.FSWatcher | undefined;

  constructor(
    options = {
      ignoreInitial: true,
      awaitWriteFinish: { stabilityThreshold: 1000 },
    },
  ) {
    this.options = options;
  }

  public start(pathes: string[], onReady: (pathes: onReadyArgs) => void, onUpdate: (path: string, stats?: fs.Stats) => void) {
    this.watcher = chokidar
      .watch(pathes, this.options)
      .on('ready', () => {
        if (this.watcher) {
          onReady(this.watcher.getWatched());
        }
      })
      .on('add', onUpdate)
      .on('change', onUpdate)
      .on('unlink', onUpdate)
      .on('addDir', onUpdate)
      .on('unlinkDir', onUpdate);
  }

  public stop() {
    return this.watcher?.close();
  }
}
