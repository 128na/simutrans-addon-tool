<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen" />

        <q-toolbar-title
          class="cursor-pointer"
          @click="leftDrawerOpen = !leftDrawerOpen"
        >
          {{ appName }}
        </q-toolbar-title>

        <div>v.{{ appVersion }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :show-if-above="false"
      bordered>
      <q-list>
        <q-item-label header>
          <switch-lang />
        </q-item-label>
        <q-item
          clickable
          :to="{ name: 'about' }">
          <q-item-section avatar><q-icon name="help" /></q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('ツールについて') }}</q-item-label>
            <q-item-label caption>{{ $t('使い方、更新情報') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'pak' }">
          <q-item-section avatar><q-icon name="refresh" /></q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('Pak') }}</q-item-label>
            <q-item-label caption>{{ $t('Pakファイル作成') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'autoPak' }">
          <q-item-section avatar><q-icon name="autorenew" /></q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('自動Pak') }}</q-item-label>
            <q-item-label caption>{{ $t('ソース更新を検知して自動Pak化') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'listPak' }">
          <q-item-section avatar><q-icon name="format_list_numbered" /></q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('Pakリスト') }}</q-item-label>
            <q-item-label caption>{{ $t('Pakファイル内のアドオンリスト化') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'listDat' }">
          <q-item-section avatar><q-icon name="format_list_numbered" /></q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('Datリスト') }}</q-item-label>
            <q-item-label caption>{{ $t('Datファイル内のアドオンリスト化') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'settings' }">
          <q-item-section avatar><q-icon name="settings" /></q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('設定') }}</q-item-label>
            <q-item-label caption>{{ $t('Makeobj、Simutransの設定など') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'links' }">
          <q-item-section avatar><q-icon name="link" /></q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('リンク集') }}</q-item-label>
            <q-item-label caption>{{ $t('Simutrans関連のリンク集') }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <RouterView v-slot="{ Component }">
        <template v-if="Component">
          <KeepAlive :include="shouldKeep">
            <Suspense>
              <component :is="Component"></component>

              <template #fallback>
                <div clas="q-pa-md">{{ $t('読み込み中...') }}</div>
              </template>
            </Suspense>
          </KeepAlive>
        </template>
      </RouterView>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import SwitchLang from 'src/components/SwitchLang.vue';
import { ref } from 'vue';

const appName = process.env.APP_NAME;
const appVersion = process.env.APP_VERSION;
const leftDrawerOpen = ref(true);

const shouldKeep = ['PakPage', 'AutoPakPage'];
</script>
