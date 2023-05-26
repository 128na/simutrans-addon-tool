<template>
  <q-page padding>
    <MainTitle>
      {{ $t('設定') }}
    </MainTitle>
    <SelectFile
      v-model="store.makeobjPath"
      :title="$t('Makeobj')"
      :filters="[{ name: 'Makeobj', extensions: ['exe'] }]"
      @update:model-value="updatecache('makeobjPath', $event)" />
    <InfoText>{{ $t('Makeobj実行ファイルを選択します。') }}</InfoText>

    <SelectFile
      v-model="store.simutransPath"
      :title="$t('Simutrans')"
      :filters="[{ name: 'Simutrans', extensions: ['exe'] }]"
      @update:model-value="updatecache('simutransPath', $event)" />
    <InfoText>{{ $t('Simutrans実行ファイルを選択します。') }}</InfoText>
  </q-page>
</template>
<script setup lang="ts">
import MainTitle from 'src/components/MainTitle.vue';
import InfoText from 'src/components/InfoText.vue';
import SelectFile from 'src/components/SelectFile.vue';
import { useSettingsStore } from 'src/stores/settings';

const store = useSettingsStore();

const updatecache = (key: string, val: unknown) => window.electronAPI.setCache(key, val);

</script>
