<template>
  <q-page>
    <q-splitter
      v-model="splitterModel"
      class="max-height-without-header"
    >
      <template #before>
        <q-page padding>
          <MainTitle>
            {{ $t('resizeobj') }}
          </MainTitle>

          <SelectFiles
            v-model="targetPath"
            :title="$t('Pakファイル')"
            @update:model-value="updatecache('resizeobj.targetPath', $event)"
          />
          <InfoText>{{ $t('Pakファイルを選択します。') }}</InfoText>

          <SubTitle>
            {{ $t('用途別プリセット') }}
          </SubTitle>
          <ResizeobjPresets @select-preset="setOptions" />

          <SubTitle>
            {{ $t('オプション') }}
          </SubTitle>

          <div>
            <q-btn
              color="secondary"
              outline
              dense
              :label="$t('表示する')"
              class="q-mb-md"
              @click="showOption = !showOption"
            />
          </div>

          <q-slide-transition>
            <div v-show="showOption">
              <InfoText>
                {{ $t('オプションの詳しい説明はこちらを参照して下さい。') }}<br />
                <ExternalLink url="https://wa-st.github.io/resizeobj/" />
              </InfoText>

              <div class="q-mb-md">
                <q-input
                  v-model.number="options.a"
                  :label="$t('-A : アンチエイリアス')"
                  :max="100"
                  :min="0"
                  type="number"
                  @update:model-value="updatecache('resizeobj.options.a', $event)"
                />
              </div>

              <div class="q-mb-md">
                <label>{{ $t('-S : 画像縮小時の特殊色') }}</label>
                <q-option-group
                  v-model="options.s"
                  :options="[
                    { value: 0, label: $t('0 : 特殊色を使用しない') },
                    { value: 1, label: $t('1 : 縮小元エリアの左上が特殊色の場合にその特殊色を出力(既定値)') },
                    { value: 2, label: $t('2 : 縮小元エリアで特殊色が半数以上使用されている場合にその特殊色を出力') },
                  ]"
                  @update:model-value="updatecache('resizeobj.options.s', $event)"
                />
              </div>

              <div class="q-mb-md">
                <InputPakSize
                  v-model="options.w"
                  :title="$t('-W : 変換後のPakサイズ')"
                  @update:model-value="updatecache('resizeobj.options.w', $event)"
                />
                <InfoText>{{ $t('変換後のPakサイズを指定します。') }}</InfoText>
              </div>

              <div>
                <q-toggle
                  v-model="options.k"
                  :label="$t('-K : 原寸大モードを使用する')"
                  @update:model-value="updatecache('resizeobj.options.k', $event)"
                />
              </div>
              <div>
                <q-toggle
                  v-model="options.ka"
                  :label="$t('-Ka : 原寸大モードでアニメーションを取り除く')"
                  @update:model-value="updatecache('resizeobj.options.ka', $event)"
                />
              </div>
              <div>
                <q-toggle
                  v-model="options.x"
                  :label="$t('-X : 拡大モードを使用する')"
                  @update:model-value="updatecache('resizeobj.options.x', $event)"
                />
              </div>

              <div class="q-mb-md">
                <q-input
                  v-model.number="options.m"
                  :label="$t('-M : オフセット')"
                  type="number"
                  @update:model-value="updatecache('resizeobj.options.m', $event)"
                />
                <q-input
                  v-model="options.e"
                  :label="$t('-E : 出力ファイルの拡張子')"
                  @update:model-value="updatecache('resizeobj.options.e', $event)"
                />
                <q-input
                  v-model="options.t"
                  :label="$t('-T : アドオン名先頭への追加文字')"
                  @update:model-value="updatecache('resizeobj.options.t', $event)"
                />
              </div>
              <div>
                <q-toggle
                  v-model="options.n"
                  :label="$t('-N : ヘッダを書き換える')"
                  @update:model-value="updatecache('resizeobj.options.n', $event)"
                />
              </div>

              <div class="q-my-md">
                <q-btn
                  color="negative"
                  dense
                  outline
                  @click="setOptions()"
                >{{ $t('オプションをリセット') }}</q-btn>
              </div>
            </div>
          </q-slide-transition>

          <q-btn
            color="primary"
            @click="start"
          >{{ $t('実行') }}</q-btn>
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
import MainTitle from 'src/components/MainTitle.vue';
import InfoText from 'src/components/InfoText.vue';
import ResizeobjPresets from 'src/components/ResizeobjPresets.vue';
import { useI18n } from 'vue-i18n';
import { ResizeobjOptions } from 'app/types/global';
import { useSettingsStore } from 'src/stores/settings';
import InputPakSize from 'src/components/InputPakSize.vue';
import ExternalLink from 'src/components/ExternalLink.vue';
import SubTitle from 'src/components/SubTitle.vue';
import SelectFiles from 'src/components/SelectFiles.vue';

const splitterModel = ref(50);

const targetPath = ref(((await window.electronAPI.getCache('resizeobj.targetPath')) || '') as string[]);

const showOption = ref(false);
const defaultOption: ResizeobjOptions = { a: 100, s: 1, w: 64, k: false, ka: false, x: false, m: 4, e: '.64.pak', t: '', n: false };
const options = ref(Object.assign({}, defaultOption, (await window.electronAPI.getCache('resizeobj.options')) || {}) as unknown as ResizeobjOptions);
const setOptions = (opt: ResizeobjOptions = {}) => {
  options.value = Object.assign({}, defaultOption, opt);
  updatecache('resizeobj.options', Object.assign({}, defaultOption, opt));
};

const logger = ref(new Logger());
logger.value.info('ここに実行結果が出力されます。');

const updatecache = (key: string, val: unknown) => window.electronAPI.setCache(key, val);

const store = useSettingsStore();
const { t } = useI18n();
const start = async () => {
  if (!targetPath.value.length) {
    return window.electronAPI.showError(t('Pakファイルが選択されていません。'));
  }
  if (!store.resizeobjPath) {
    return window.electronAPI.showError(t('resizeが選択されていません'));
  }

  const result = await window.resizeobjAPI.resizeobj({
    resizeobjPath: store.resizeobjPath,
    target: [...targetPath.value],
    options: Object.assign({}, options.value),
  });
  console.log({ result });
};

window.electronAPI.ipcMessenger((event, channel, level, message, args = undefined) => {
  if (channel === 'resizeobj') {
    logger.value[level](message, args);
  }
});
</script>
