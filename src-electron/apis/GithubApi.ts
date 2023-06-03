import { ipcMain } from 'electron';
import { Octokit } from '@octokit/rest';
import Api from '../base/Api';
import { GithubVersionResponse } from 'app/types/global';

export default class GithubApi extends Api {
  octokit: Octokit;
  constructor() {
    super();
    this.octokit = new Octokit();
  }

  protected register(): void {
    ipcMain.removeHandler('getLatestRelease');
    ipcMain.handle('getLatestRelease', () => this.getLatestRelease());
  }

  private async getLatestRelease(): Promise<GithubVersionResponse> {
    // https://github.com/128na/simutrans-addon-tool
    const response = await this.octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
      owner: '128na',
      repo: 'simutrans-addon-tool',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    const result = {
      version: response.data.tag_name,
      created_at: response.data.created_at,
      url: response.data.html_url,
    };
    return result;
  }
}
