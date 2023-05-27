<template>
  <q-page>
    <q-splitter
      v-model="splitterModel"
      class="max-height-without-header">
      <template #before>
        <q-page padding>
          <MainTitle>
            {{ $t('resizeobj') }}
          </MainTitle>

          <SelectDir
            v-model="targetResizePath"
            :title="$t('フォルダ')"
            @update:model-value="updatecache('targetResizePath', $event)" />
          <InfoText>{{ $t('pakファイルのあるフォルダを選択します。') }}</InfoText>

          <SubTitle>オプション</SubTitle>
          <InfoText>
            オプションの詳しい説明はこちらを参照して下さい。<br />
            <ExternalLink url="https://wa-st.github.io/resizeobj/"/>
          </InfoText>

          <div class="q-mb-md">
            <q-input
              v-model.number="resizeOptions.a"
              :label="$t('アンチエイリアス')"
              :max="100"
              :min="0"
              type="number"
              @update:model-value="updatecache('resizeOptions.a', $event)" />
          </div>

          <div class="q-mb-md">
            <label>{{ $t('-A 画像縮小時の特殊色') }}</label>
            <q-option-group
              v-model="resizeOptions.s"
              :options="[
                {value:0,label:$t('0 : 特殊色を使用しない')},
                {value:1,label:$t('1 : 縮小元エリアの左上が特殊色の場合にその特殊色を出力(既定値)')},
                {value:2,label:$t('2 : 縮小元エリアで特殊色が半数以上使用されている場合にその特殊色を出力')}
              ]"
              @update:model-value="updatecache('resizeOptions.s', $event)" />
          </div>

          <div class="q-mb-md">
            <InputPakSize
              v-model="resizeOptions.w"
              :title="$t('-W 変換後のPakサイズ')"
              @update:model-value="updatecache('resizeOptions.w', $event)" />
            <InfoText>{{ $t('変換後のPakサイズを指定します。（16～32767）') }}</InfoText>
          </div>

          <div class="q-mb-md">
            <label>{{ $t('-K 原寸大モード') }}</label>
            <q-option-group
              v-model="resizeOptions.k"
              :options="[
                {value:false,label:$t('使用しない')},
                {value:true,label:$t('使用する')},
              ]"
              @update:model-value="updatecache('resizeOptions.k', $event)" />
          </div>
          <div class="q-mb-md">
            <label>{{ $t('-Ka 原寸大モードでのアニメーション') }}</label>
            <q-option-group
              v-model="resizeOptions.ka"
              :options="[
                {value:false,label:$t('そのまま')},
                {value:true,label:$t('取り除く')},
              ]"
              @update:model-value="updatecache('resizeOptions.ka', $event)" />
          </div>
          <div class="q-mb-md">
            <label>{{ $t('-X 拡大モード') }}</label>
            <q-option-group
              v-model="resizeOptions.x"
              :options="[
                {value:false,label:$t('使用しない')},
                {value:true,label:$t('使用する')},
              ]"
              @update:model-value="updatecache('resizeOptions.x', $event)" />
          </div>

          <div class="q-mb-md">
            <q-input
              v-model.number="resizeOptions.m"
              :label="$t('-M オフセット')"
              type="number"
              @update:model-value="updatecache('resizeOptions.m', $event)" />
            <q-input
              v-model="resizeOptions.e"
              :label="$t('-E 出力ファイルの拡張子')"
              @update:model-value="updatecache('resizeOptions.e', $event)" />
            <q-input
              v-model="resizeOptions.t"
              :label="$t('-T アドオン名先頭への追加文字')"
              @update:model-value="updatecache('resizeOptions.t', $event)" />
          </div>
          <div class="q-mb-md">
            <label>{{ $t('-N ヘッダ書き換え') }}</label>
            <q-option-group
              v-model="resizeOptions.n"
              :options="[
                {value:false,label:$t('する')},
                {value:true,label:$t('しない')},
              ]"
              @update:model-value="updatecache('resizeOptions.n', $event)" />
          </div>

          <q-btn
            color="primary"
            @click="start">{{ $t('実行') }}</q-btn>
        </q-page>
      </template>

      <template #after>
        <q-page
          padding
          class="bg-dark">
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
import MainTitle from 'src/components/MainTitle.vue';
import InfoText from 'src/components/InfoText.vue';
import SubTitle from 'src/components/SubTitle.vue';
import { useI18n } from 'vue-i18n';
import { ResizeobjOptions } from 'app/types/global';
import { useSettingsStore } from 'src/stores/settings';
import InputPakSize from 'src/components/InputPakSize.vue';
import ExternalLink from 'src/components/ExternalLink.vue';

const splitterModel = ref(50);

const targetResizePath = ref(((await window.electronAPI.getCache('targetResizePath')) || '') as string);
const resizeOptions = ref(Object.assign(
  { a: 0, s: 1, w: 64, k: false, ka: false, x: false, m: 4, e: '.64.pak', t: '', n: false },
  await window.electronAPI.getCache('resizeOptions') || {}
) as unknown as ResizeobjOptions);
const logger = ref(new Logger());
logger.value.info('ここに実行結果が出力されます。');

const updatecache = (key: string, val: unknown) => window.electronAPI.setCache(key, val);

const store = useSettingsStore();
const { t } = useI18n();
const start = async () => {
  if (!targetResizePath.value) {
    return window.electronAPI.showError(t('フォルダが選択されていません'));
  }
  if (!store.resizeobjPath) {
    return window.electronAPI.showError(t('resizeが選択されていません'));
  }

  const result  = await window.resizeobjAPI.resizeobj({
    resizeobjPath: store.resizeobjPath,
    target: targetResizePath.value,
    options: Object.assign({}, resizeOptions.value),
  });
  console.log({result})
};

</script>
