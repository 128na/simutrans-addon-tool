<template>
  <q-page>
    <q-splitter v-model="splitterModel" class="max-height-without-header">
      <template v-slot:before>
        <q-page padding>
          <MainTitle>
            {{ $t('自動Pak化') }}
          </MainTitle>

          <SelectDir v-model="sourcePath" :title="$t('ソースフォルダ')" :disable="watching"
            @update:model-value="updatecache('sourcePath', $event)" />
          <InfoText>{{ $t('datファイルのあるフォルダを選択します。') }}</InfoText>

          <InputPakSize v-model="size" :title="$t('pakサイズ')" :disable="watching"
            @update:model-value="updatecache('size', $event)" />
          <InfoText>{{ $t('pakサイズを指定します。（16～32767）') }}</InfoText>

          <SaveFile v-model="pakPath" :title="$t('pak出力先')" default-path="output.pak" :disable="watching"
            @update:model-value="updatecache('pakPath', $event)" />
          <InfoText>{{ $t('生成したpakファイルの保存先を指定します。') }}</InfoText>

          <SelectFile v-model="makeobjPath" :title="$t('makeobj')" :filters="[{ name: 'makeobj', extensions: ['exe'] }]"
            :disable="watching" @update:model-value="updatecache('makeobjPath', $event)" />
          <InfoText>{{ $t('makeobj実行ファイルを指定します。') }}</InfoText>

          <SelectFile v-model="simutransPath" :title="$t('simutrans')" :disable="watching"
            :filters="[{ name: 'simutrans', extensions: ['exe'] }]"
            @update:model-value="updatecache('simutransPath', $event)" />
          <InfoText>{{ $t('simutrans実行ファイルを指定します。') }}</InfoText>

          <template v-if="watching">
            <q-btn color="negative" @click="stopPak">{{ $t('停止') }}</q-btn>
          </template>
          <template v-else>
            <q-btn color="primary" @click="startPak">{{ $t('開始') }}</q-btn>
          </template>
        </q-page>
      </template>

      <template v-slot:after>
        <q-page padding class="bg-dark">
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
import SelectFile from '../components/SelectFile.vue';
import InputPakSize from '../components/InputPakSize.vue';
import SaveFile from '../components/SaveFile.vue';
import MainTitle from 'src/components/MainTitle.vue';
import InfoText from 'src/components/InfoText.vue';
import SubTitle from 'src/components/SubTitle.vue';
import { useI18n } from 'vue-i18n';

const splitterModel = ref(50);

const sourcePath = ref((await window.electronAPI.getCache('sourcePath') || '') as string);
const makeobjPath = ref((await window.electronAPI.getCache('makeobjPath') || '') as string);
const simutransPath = ref((await window.electronAPI.getCache('simutransPath') || '') as string);
const pakPath = ref((await window.electronAPI.getCache('pakPath') || '') as string);
const size = ref((await window.electronAPI.getCache('size') || 128) as number);
const logger = ref(new Logger());

const { t } = useI18n();
logger.value.info(t('ここに実行結果が出力されます。'));

const updatecache = (key: string, val: unknown) => window.electronAPI.setCache(key, val);

const watching = ref(false);

const stopPak = () => {
  window.autoPakAPI.stopAutoPak();
  watching.value = false;
};
const startPak = () => {
  if (!sourcePath.value) {
    return alert(t('ソースフォルダが選択されていません'));
  }
  if (!makeobjPath.value) {
    return alert(t('makeobjが選択されていません'));
  }
  if (!simutransPath.value) {
    return alert(t('simutransが選択されていません'));
  }
  if (!pakPath.value) {
    return alert('pak出力先が選択されていません');
  }

  watching.value = true;
  window.autoPakAPI.startAutoPak({
    simutransPath: simutransPath.value,
    makeobjPath: makeobjPath.value,
    size: size.value,
    pakPath: pakPath.value,
    sourcePath: sourcePath.value,
  });
};

window.autoPakAPI.updateAutoPak((event, level, message, args = undefined) => {
  logger.value[level](message, args);
});
</script>
