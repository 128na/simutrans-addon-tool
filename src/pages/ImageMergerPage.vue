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

          <div class="q-mb-md">
            <q-btn
              color="secondary"
              :label="$t('変更を保存')"
              :disable="!hasChange"
              @click="writeMergeOption"
            />
            <q-btn
              outline
              color="negative"
              :label="$t('変更をクリア')"
              :disable="!hasChange"
              @click="clear"
            />
          </div>
          <div class="q-mb-md">
            <q-btn
              color="primary"
              :label="$t('変換を実行')"
              @click="start"
            />
          </div>
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
import { Ref,  ref, watch } from 'vue';
import Logger from '../services/logger';
import LogViewer from '../components/LogViewer.vue';
import MainTitle from 'src/components/MainTitle.vue';
import InfoText from 'src/components/InfoText.vue';
import SubTitle from 'src/components/SubTitle.vue';
import { ImageMergeOption } from 'app/types/global';
import SelectFile from 'src/components/SelectFile.vue';
import MergeOptionEditor from 'src/components/ImageMerger/MergeOptionEditor.vue';
import { useSettingsStore } from 'src/stores/settings';
import { useI18n } from 'vue-i18n';

const splitterModel = ref(50);

const definitionPath = ref(((await window.electronAPI.getCache('imageMerger.definitionPath')) || '') as string);

const getDefault = (): ImageMergeOption => {
  return Object.create({ version: 1, definitions: [], comment: '' });
};
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

const clear = async () => {
  mergeOption.value = definitionPath.value
    ? await readMergeOption()
    : getDefault();
  updateOriginal(mergeOption.value);
};

const updatecache = async(key: string, val: unknown) => {
  window.electronAPI.setCache(key, val);
  mergeOption.value = await readMergeOption();
};

const logger = ref(new Logger());
logger.value.info('ここに実行結果が出力されます。');

const store = useSettingsStore();
const { t } = useI18n();
const start = () => {
  if (!store.imageMergerPath) {
    return window.electronAPI.showError(t('SimutransImageMergerが選択されていません。'));
  }
  window.imageMergerAPI.merge(store.imageMergerPath, JSON.stringify(mergeOption.value));
};

let original: string | undefined = undefined;
const hasChange = ref(false);
watch(mergeOption, (v) => {
  hasChange.value = original !== JSON.stringify(v);
}, { deep: true });
const updateOriginal = (option: ImageMergeOption) => {
  original = JSON.stringify(option);
};
updateOriginal(mergeOption.value);

window.electronAPI.ipcMessenger((event, channel, level, message, args = undefined) => {
  if (channel === 'imageMerger') {
    logger.value[level](message, args);
  }
});
</script>
