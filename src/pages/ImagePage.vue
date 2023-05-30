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

          <SelectFiles
            v-model="targetPath"
            :title="$t('pngファイル')"
            :filters="[{ name: 'image', extensions: ['png'] }]"
            @update:model-value="updatecache('imageMagic.targetPath', $event)"
          />
          <InfoText>{{ $t('pngファイルを選択します。') }}</InfoText>

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
import { useI18n } from 'vue-i18n';
import SubTitle from 'src/components/SubTitle.vue';
import SelectFiles from 'src/components/SelectFiles.vue';

const splitterModel = ref(50);

const targetPath = ref(((await window.electronAPI.getCache('imageMagic.targetPath')) || []) as string[]);

const logger = ref(new Logger());
logger.value.info('ここに実行結果が出力されます。');

const updatecache = (key: string, val: unknown) => window.electronAPI.setCache(key, val);

const { t } = useI18n();

const loadImage = async (path: string) => {
  const data = await window.imageAPI.loadImage(path);
  console.log({data})
  return new Promise<HTMLImageElement>((ok) => {
    const img = new Image();
    img.addEventListener('load', () => ok(img), false);
    img.src = data;
  });
};

const createCanvas = (image:HTMLImageElement):HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('ctx is null');
  }
  ctx.drawImage(image, 0, 0);
  return canvas;
}

const start = async () => {
  if (!targetPath.value.length) {
    return window.electronAPI.showError(t('pngファイルが選択されていません。'));
  }

  const img = await loadImage(targetPath.value[0]);
  const canvas = createCanvas(img);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('ctx is null');
  }
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    [data[i], data[i + 1], data[i + 2]] = [255, 0, 0];
  }
  ctx.putImageData(imageData, 0, 0);

  window.imageAPI.saveImage(targetPath.value[0].replace('.png', '.out.png'), canvas.toDataURL());
};

window.electronAPI.ipcMessenger((event, channel, level, message, args = undefined) => {
  if (channel === 'image') {
    logger.value[level](message, args);
  }
});
</script>
