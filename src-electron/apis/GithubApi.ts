import { BrowserWindow, ipcMain } from 'electron';
import { Octokit } from '@octokit/rest';

const octokit = new Octokit();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function registerGithubApi(mainWindow: BrowserWindow): void {
  ipcMain.removeHandler('getLatestRelease');
  ipcMain.handle('getLatestRelease', async () => {
    // https://github.com/128na/simutrans-addon-tool
    const response = await octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
      owner: '128na',
      repo: 'simutrans-addon-tool',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    const result = {
      version: response.data.tag_name,
      created_at: response.data.created_at,
      url: response.data.html_url,
    }
    console.log('[getLatestRelease]', { result });
    return result;
  });

  console.log('[GithubApi] registered');
}
