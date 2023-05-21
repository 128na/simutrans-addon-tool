<template>
  <div class="container-fluid">
    <RouterView v-slot="{ Component }">
      <template v-if="Component">
        <KeepAlive>
          <Suspense>
            <component :is="Component"></component>

            <template #fallback>
              <div clas="q-pa-md">{{ $t('読み込み中...') }}</div>
            </template>
          </Suspense>
        </KeepAlive>
      </template>
    </RouterView>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();
// handle routing from main process menu.
window.electronAPI.router((event, value) => {
  router.push(value);
});
</script>
