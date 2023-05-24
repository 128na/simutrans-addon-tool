<template>
  <q-select v-model="locale" :options="localeOptions" label="Language" dense emit-value map-options options-dense @update:model-value="handle" />
</template>
<script setup type="ts">
import { useI18n } from 'vue-i18n';

const { locale } = useI18n({ useScope: 'global' });
locale.value = await window.electronAPI.getCache('lang') || 'ja';
const localeOptions = [
  { value: 'ja', label: '日本語' },
  { value: 'en', label: 'English' },
];
const handle = (lang) => {
  window.electronAPI.setCache('lang', lang);
}
</script>
