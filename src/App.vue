<template>
  <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <Suspense>
        <component :is="Component"></component>

        <template #fallback>
          <div clas="q-pa-md">{{ $t('読み込み中...') }}</div>
        </template>
      </Suspense>
    </template>
  </RouterView>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useSettingsStore } from './stores/settings';

const router = useRouter();
// handle routing from main process menu.
window.electronAPI.router((event, value) => {
  router.push(value);
});

const store = useSettingsStore();
store.loadFromElectronStore();
</script>
