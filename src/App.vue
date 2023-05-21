<template>
  <div class="container-fluid">
    <Suspense>
      <template #default>
        <router-view v-slot="{ Component }">
          <keep-alive include="PakPage,AutoPakPage">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </template>
      <template #fallback>
        {{ $t('読み込み中...') }}
      </template>
    </suspense>
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
