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

          <WarningCard v-show="!store.imageMergerPath">
            {{ $t('SimutransImageMerger実行ファイルが選択されていません。') }}<br />
            {{ $t('設定画面から実行ファイルを選択してください。') }}
          </WarningCard>

          <SubTitle>
            {{ $t('定義ファイル') }}
          </SubTitle>
          <q-btn-group outline>
            <SmallSecondaryButton
              :label="$t('読み込む')"
              @click="read"
            />
            <q-separator />
            <SmallSecondaryButton
              :label="$t('変更を保存')"
              :disable="!hasChange"
              @click="write"
            />
          </q-btn-group>
          <MergeOptionEditor v-model="mergeOption" />
          <div class="q-mb-md text-right">
            <SmallNegativeButton
              :label="$t('クリア')"
              @click="clear"
            />
          </div>
          <div class="q-mb-md">
            <PrimaryButton
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
import { Ref, ref, watch } from 'vue';
import Logger from '../services/logger';
import LogViewer from '../components/LogViewer.vue';
import MainTitle from 'src/components/MainTitle.vue';
import SubTitle from 'src/components/SubTitle.vue';
import MergeOptionEditor from 'src/components/ImageMerger/MergeOptionEditor.vue';
import { useSettingsStore } from 'src/stores/settings';
import { useI18n } from 'vue-i18n';
import SmallNegativeButton from 'src/components/buttons/SmallNegativeButton.vue';
import SmallSecondaryButton from 'src/components/buttons/SmallSecondaryButton.vue';
import PrimaryButton from 'src/components/buttons/PrimaryButton.vue';
import { useQuasar } from 'quasar';
import WarningCard from 'src/components/WarningCard.vue';

const $q = useQuasar();
const store = useSettingsStore();
const { t } = useI18n();

const getDefault = (): ImageMergeOption => {
  return Object.assign({}, { version: 1, comment: '', definitions: [] });
};

const splitterModel = ref(50);
const mergeOption: Ref<ImageMergeOption> = ref(getDefault());

const read = async () => {
  try {
    const path = await window.electronAPI.selectSingleFile({ filters: [{ name: 'Merge definition', extensions: ['json'] }] });
    if (path) {
      const json = await window.electronAPI.readFile(path);
      if (json) {
        mergeOption.value = JSON.parse(json) as ImageMergeOption;
        updateOriginal(mergeOption.value);
        $q.notify({ type: 'positive', message: t('ファイルを読み込みました。') });
        return;
      }
    }
    mergeOption.value = getDefault();
  } catch (error) {
    $q.notify({ type: 'negative', message: t('読み込みに失敗しました。') });
  }
};

const write = async () => {
  try {
    const data = JSON.stringify(mergeOption.value, null, 2);
    const path = await window.electronAPI.saveFile({ filters: [{ name: 'Merge definition', extensions: ['json'] }] });
    if (path) {
      await window.electronAPI.writeFile(path, data);
      hasChange.value = false;
      $q.notify({ type: 'positive', message: t('保存しました。') });
    }
  } catch (error) {
    $q.notify({ type: 'negative', message: t('保存に失敗しました。') });
  }
};

const clear = async () => {
  if (window.confirm(t('変更をクリアしますか？'))) {
    mergeOption.value = getDefault();
    hasChange.value = false;
    $q.notify({ type: 'positive', message: t('変更をクリアしました。') });
  }
};

const logger = ref(new Logger());
logger.value.info('ここに実行結果が出力されます。');

const start = () => {
  if (!store.imageMergerPath) {
    return window.electronAPI.showError(t('SimutransImageMerger実行ファイルが選択されていません。'));
  }
  window.imageMergerAPI.merge(store.imageMergerPath, JSON.stringify(mergeOption.value));
};

let original: string | undefined = undefined;
const hasChange = ref(false);
watch(
  mergeOption,
  (v) => {
    console.log('change mergeOption');
    hasChange.value = original !== JSON.stringify(v);
  },
  { deep: true }
);
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
