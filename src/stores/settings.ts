import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    makeobjPath: '',
    simutransPath: '',
    resizeobjPath: '',
  }),
  actions: {
    async loadFromElectronStore() {
      this.makeobjPath = ((await window.electronAPI.getCache('makeobjPath')) || '') as string;
      this.simutransPath = ((await window.electronAPI.getCache('simutransPath')) || '') as string;
      this.resizeobjPath = ((await window.electronAPI.getCache('resizeobjPath')) || '') as string;
    }
  }
});
