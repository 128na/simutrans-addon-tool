import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    makeobjPath: '',
    simutransPath: '',
    resizeobjPath: '',
    imageMergerPath: '',
  }),
  actions: {
    async loadFromElectronStore() {
      this.makeobjPath = ((await window.electronAPI.getCache('makeobjPath')) || '') as string;
      this.simutransPath = ((await window.electronAPI.getCache('simutransPath')) || '') as string;
      this.resizeobjPath = ((await window.electronAPI.getCache('resizeobjPath')) || '') as string;
      this.imageMergerPath = ((await window.electronAPI.getCache('imageMergerPath')) || '') as string;
    },
  },
});
