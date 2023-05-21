<template>
  <h1>Pak化</h1>
  <div class="row">
    <div class="col-6">
      <div class="mb-3">
        <SelectDir
          v-model="sourcePath"
          input-id="sourcePath"
          title="ソースフォルダ"
          @update:model-value="updatecache('sourcePath', $event)"
        />
        <p><small>datファイルのあるフォルダを選択します。</small></p>
      </div>
      <div class="mb-3">
        <SelectFile
          v-model="makeobjPath"
          input-id="makeobjPath"
          title="makeobj"
          :filters="[{ name: 'Makeobj', extensions: ['exe'] }]"
          @update:model-value="updatecache('makeobjPath', $event)"
        />
        <p><small>makeobjの場所を指定します。</small></p>
      </div>
      <div class="mb-3">
        <InputPakSize
          v-model="size"
          input-id="size"
          title="pakサイズ"
          @update:model-value="updatecache('size', $event)"
        />
        <p><small>pakサイズを指定します。(16~32767)</small></p>
      </div>
      <div class="mb-3">
        <SaveFile
          v-model="pakPath"
          input-id="pakPath"
          title="pak出力先"
          default-path="output.pak"
          @update:model-value="updatecache('pakPath', $event)"
        />
        <p><small>生成したpakの保存先を指定します。</small></p>
      </div>
      <div class="mb-3">
        <button
          class="btn btn-primary"
          @click="handlePak"
        >
          Pak化
        </button>
      </div>
    </div>
    <div class="col-6">
      実行ログ
      <LogViewer :logger="logger" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import Logger from '../services/logger';
import LogViewer from '../components/LogViewer.vue';
import SelectDir from '../components/SelectDir.vue';
import SelectFile from '../components/SelectFile.vue';
import InputPakSize from '../components/InputPakSize.vue';
import SaveFile from '../components/SaveFile.vue';

const sourcePath = ref((await window.electronAPI.getCache('sourcePath') || '') as string);
const makeobjPath = ref((await window.electronAPI.getCache('makeobjPath') || '') as string);
const pakPath = ref((await window.electronAPI.getCache('pakPath') || '') as string);
const size = ref((await window.electronAPI.getCache('size') || 128) as number);
const logger = ref(new Logger());

const updatecache = (key: string, val: unknown) => window.electronAPI.setCache(key, val);

const handlePak = async () => {
  if (!sourcePath.value) {
    return alert('ソースフォルダが選択されていません');
  }
  if (!makeobjPath.value) {
    return alert('makeobjが選択されていません');
  }
  try {
    const result = await window.autoPakAPI.pak({
      makeobjPath: makeobjPath.value,
      size: size.value,
      pakPath: pakPath.value,
      sourcePath: sourcePath.value,
    });
    console.log({ result });

    if (result.status === 0) {
      logger.value.info(result.stdout);
    } else {
      logger.value.error(result.stderr);
    }

  } catch (error: unknown) {
    alert('えらー');
  }
};

</script>
