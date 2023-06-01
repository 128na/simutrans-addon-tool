<template>
  <q-page>
    <q-splitter
      v-model="splitterModel"
      class="max-height-without-header"
    >
      <template #before>
        <q-page padding>
          <MainTitle>
            {{ $t('画像変換') }}
          </MainTitle>

          <SelectFile
            v-model="definitionPath"
            :title="$t('定義ファイル')"
            :filters="[{ name: 'definition', extensions: ['json'] }]"
            @update:model-value="updatecache('imageMerger.definitionPath', $event)"
          />
          <InfoText>{{ $t('定義ファイルを選択します。') }}</InfoText>

          <MergeOptionEditor v-model="mergeOption" />

          <q-btn
            color="primary"
            @click="start"
          >{{ $t('実行') }}</q-btn>
          <q-btn
            outline
            color="negative"
            @click="clear"
          >{{ $t('クリア') }}</q-btn>
          <q-btn
            color="secondary"
            @click="writeMergeOption"
          >{{ $t('保存') }}</q-btn>
        </q-page>
      </template>

      <template #after>
        <q-page
          padding
          class="bg-dark"
        >
          <SubTitle class="text-white">{{ $t('実行ログ') }}</SubTitle>
          <LogViewer :logger="logger" />
        </q-page>
      </template>
    </q-splitter>
  </q-page>
</template>
<script setup lang="ts">
import { Ref, ref } from 'vue';
import Logger from '../services/logger';
import LogViewer from '../components/LogViewer.vue';
import MainTitle from 'src/components/MainTitle.vue';
import InfoText from 'src/components/InfoText.vue';
import SubTitle from 'src/components/SubTitle.vue';
import { ImageMergeOption } from 'app/types/global';
import SelectFile from 'src/components/SelectFile.vue';
import MergeOptionEditor from 'src/components/ImageMerger/MergeOptionEditor.vue';

const splitterModel = ref(50);

const getDefault = (): ImageMergeOption => {
  return Object.create({ version: 1, definitions: [], comment: '' });
};

const definitionPath = ref(((await window.electronAPI.getCache('imageMerger.definitionPath')) || '') as string);
const readMergeOption = async (): Promise<ImageMergeOption> => {
  const data = await window.electronAPI.readFile(definitionPath.value);
  if (data) {
    return JSON.parse(data);
  }
  return getDefault();
};
const writeMergeOption = async (): Promise<void> => {
  const data = JSON.stringify(mergeOption.value, null, 2);
  await window.electronAPI.writeFile(definitionPath.value, data);
};
const mergeOption: Ref<ImageMergeOption> = ref(definitionPath.value ? await readMergeOption() : getDefault());
const clear = () => {
  mergeOption.value = getDefault();
};

const updatecache = (key: string, val: unknown) => {
  window.electronAPI.setCache(key, val);
  readMergeOption();
};

const logger = ref(new Logger());
logger.value.info('ここに実行結果が出力されます。');

const start = async () => {
  //
};

window.electronAPI.ipcMessenger((event, channel, level, message, args = undefined) => {
  if (channel === 'imageMerger') {
    logger.value[level](message, args);
  }
});
</script>
