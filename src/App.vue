<template>
  <RouterView />
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();
// handle routing from main process menu.
window.electronAPI.router((event, value) => {
  router.push(value);
});
</script>
