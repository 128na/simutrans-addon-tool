import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    makeobjPath: '',
    simutransPath: '',
  }),
  actions: {
    async loadFromElectronStore() {
      this.makeobjPath = ((await window.electronAPI.getCache('makeobjPath')) || '') as string;
      this.simutransPath = ((await window.electronAPI.getCache('simutransPath')) || '') as string;
    }
  }
});
