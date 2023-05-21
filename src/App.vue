<template>
  <ul class="nav nav-tabs">
    <li class="nav-item">
      <router-link
        class="nav-link"
        :to="{name:'top'}"
      >
        About
      </router-link>
    </li>
    <li class="nav-item">
      <router-link
        class="nav-link"
        :to="{name:'pak'}"
      >
        Pak化
      </router-link>
    </li>
    <li class="nav-item">
      <router-link
        class="nav-link"
        :to="{name:'autoPak'}"
      >
        自動Pak化
      </router-link>
    </li>
    <li class="nav-item">
      <router-link
        class="nav-link"
        :to="{name:'links'}"
      >
        リンク集
      </router-link>
    </li>
  </ul>
  <div class="container-fluid">
    <Suspense>
      <template #default>
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </template>
      <template #fallback>
        読み込み中...
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
