export default function registerCheckUpdate() {
  require('update-electron-app')({
    updateInterval: '1 hour',
  });
}
