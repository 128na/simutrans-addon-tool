<template>
  <q-page padding>
    <MainTitle>
      {{ $t('設定') }}
    </MainTitle>
    <SelectFile
      v-model="store.makeobjPath"
      :title="$t('Makeobj')"
      :filters="[{ name: 'Makeobj', extensions: ['exe'] }]"
      @update:model-value="updatecache('makeobjPath', $event)"
    />
    <InfoText>
      {{ $t('Makeobj実行ファイルを選択します。') }}<br />
      <ExternalLink :url="$t('https://www.simutrans.com/ja/download')" />
    </InfoText>

    <SelectFile
      v-model="store.simutransPath"
      :title="$t('Simutrans')"
      :filters="[{ name: 'Simutrans', extensions: ['exe'] }]"
      @update:model-value="updatecache('simutransPath', $event)"
    />
    <InfoText>
      {{ $t('Simutrans実行ファイルを選択します。') }}<br />
      <ExternalLink :url="$t('https://www.simutrans.com/ja/download')" />
    </InfoText>

    <SelectFile
      v-model="store.resizeobjPath"
      :title="$t('resizeobj')"
      :filters="[{ name: 'resizeobj', extensions: ['exe'] }]"
      @update:model-value="updatecache('resizeobjPath', $event)"
    />
    <InfoText>
      {{ $t('resizeobj実行ファイルを選択します。') }}<br />
      <ExternalLink url="https://github.com/wa-st/resizeobj/releases" />
    </InfoText>

    <SelectFile
      v-model="store.imageMergerPath"
      :title="$t('SimutransImageMerger')"
      :filters="[{ name: 'simutrans-image-merger', extensions: ['exe'] }]"
      @update:model-value="updatecache('imageMergerPath', $event)"
    />
    <InfoText>
      {{ $t('SimutransImageMerger実行ファイルを選択します。') }}<br />
      <ExternalLink url="https://github.com/128na/simutrans-image-merger/releases" />
    </InfoText>
  </q-page>
</template>
<script setup lang="ts">
import MainTitle from 'src/components/MainTitle.vue';
import InfoText from 'src/components/InfoText.vue';
import SelectFile from 'src/components/SelectFile.vue';
import { useSettingsStore } from 'src/stores/settings';
import ExternalLink from 'src/components/ExternalLink.vue';

const store = useSettingsStore();

const updatecache = (key: string, val: unknown) => window.electronAPI.setCache(key, val);
</script>
