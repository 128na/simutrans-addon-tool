<template>
  <q-page>
    <q-splitter
      v-model="splitterModel"
      class="max-height-without-header"
    >
      <template #before>
        <q-page padding>
          <MainTitle>
            {{ $t('自動Pak') }}
          </MainTitle>

          <WarningCard v-show="!store.simutransPath">
            {{ $t('Simutrans実行ファイルが選択されていません。') }}<br />
            {{ $t('設定画面から実行ファイルを選択してください。') }}
          </WarningCard>

          <WarningCard v-show="!store.makeobjPath">
            {{ $t('makeobj実行ファイルが選択されていません。') }}<br />
            {{ $t('設定画面から実行ファイルを選択してください。') }}
          </WarningCard>

          <SelectDir
            v-model="sourcePath"
            :title="$t('ソースフォルダ')"
            :disable="watching"
            @update:model-value="updatecache('autoPak.sourcePath', $event)"
          />
          <InfoText>{{ $t('Datファイルのあるフォルダを選択します。') }}</InfoText>

          <InputPakSize
            v-model="size"
            :title="$t('Pakサイズ')"
            :disable="watching"
            @update:model-value="updatecache('autoPak.size', $event)"
          />
          <InfoText>{{ $t('Pakサイズを指定します。（16～32767）') }}</InfoText>

          <SaveFile
            v-model="pakPath"
            :title="$t('Pak出力先')"
            default-path="output.pak"
            :disable="watching"
            @update:model-value="updatecache('autoPak.pakPath', $event)"
          />
          <InfoText>{{ $t('生成したPakファイルの保存先を選択します。') }}</InfoText>

          <template v-if="watching">
            <NegativeButton
              :label="$t('停止')"
              @click="stopAutoPak"
            />
          </template>
          <template v-else>
            <PrimaryButton
              :label="$t('開始')"
              @click="startAutoPak"
            />
          </template>
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
import { ref } from 'vue';
import Logger from '../services/logger';
import LogViewer from '../components/LogViewer.vue';
import SelectDir from '../components/SelectDir.vue';
import InputPakSize from '../components/InputPakSize.vue';
import SaveFile from '../components/SaveFile.vue';
import MainTitle from 'src/components/MainTitle.vue';
import InfoText from 'src/components/InfoText.vue';
import SubTitle from 'src/components/SubTitle.vue';
import { useI18n } from 'vue-i18n';
import { useSettingsStore } from 'src/stores/settings';
import PrimaryButton from 'src/components/buttons/PrimaryButton.vue';
import NegativeButton from 'src/components/buttons/NegativeButton.vue';
import WarningCard from 'src/components/WarningCard.vue';

const splitterModel = ref(50);
const watching = ref(false);

const sourcePath = ref(((await window.electronAPI.getCache('autoPak.sourcePath')) || '') as string);
const pakPath = ref(((await window.electronAPI.getCache('autoPak.pakPath')) || '') as string);
const size = ref(((await window.electronAPI.getCache('autoPak.size')) || 128) as number);
const logger = ref(new Logger());
logger.value.info('ここに実行結果が出力されます。');

const updatecache = (key: string, val: unknown) => window.electronAPI.setCache(key, val);

const store = useSettingsStore();
const { t } = useI18n();
const stopAutoPak = () => {
  window.makeobjApi.stopAutoPak();
  watching.value = false;
};
const startAutoPak = () => {
  if (!sourcePath.value) {
    return window.electronAPI.showError(t('ソースフォルダが選択されていません。'));
  }
  if (!store.makeobjPath) {
    return window.electronAPI.showError(t('makeobj実行ファイルが選択されていません。'));
  }
  if (!store.simutransPath) {
    return window.electronAPI.showError(t('Simutrans実行ファイルが選択されていません。'));
  }
  if (!pakPath.value) {
    return window.electronAPI.showError('pak出力先が選択されていません');
  }

  watching.value = true;
  window.makeobjApi.startAutoPak({
    simutransPath: store.simutransPath,
    makeobjPath: store.makeobjPath,
    size: size.value,
    pakPath: pakPath.value,
    sourcePath: sourcePath.value,
  });
};

window.electronAPI.ipcMessenger((event, channel, level, message, args = undefined) => {
  if (channel === 'autoPak') {
    logger.value[level](message, args);
  }
});
</script>
