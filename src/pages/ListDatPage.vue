<template>
  <q-page>
    <q-splitter
      v-model="splitterModel"
      class="max-height-without-header">
      <template #before>
        <q-page padding>
          <MainTitle>
            {{ $t('Datリスト') }}
          </MainTitle>

          <SelectDir
            v-model="targetDatDir"
            :disable="running"
            :title="$t('フォルダ')"
            @update:model-value="updatecache('targetDatDir', $event)" />
          <InfoText>{{ $t('Datファイルのあるフォルダを選択します') }}</InfoText>

          <q-btn-group>
            <q-btn
              color="primary"
              :loading="running"
              @click="startList"
            >{{ $t('実行') }}</q-btn>
          </q-btn-group>
        </q-page>
      </template>

      <template #after>
        <q-page padding>
          <SubTitle>{{ $t('アドオン一覧') }}</SubTitle>
          <q-btn-group outline>
            <q-btn
              outline
              color="secondary"
              :label="$t('コピー（テキスト）')"
              @click="copyText"/>
            <q-separator />
            <q-btn
              outline
              color="secondary"
              :label="$t('コピー（json）')"
              @click="copyJson"/>
            <q-separator />
            <q-btn
              outline
              color="secondary"
              :label="$t('コピー（json元データ）')"
              @click="copyRawJson"/>
          </q-btn-group>
          <InfoText v-show="datCount !== null">{{$t('概要')}} dat: {{ datCount }}{{$t('個')}}, obj: {{ objCount }}{{$t('個')}}</InfoText >
          <q-input
            :model-value="addonText"
            :readonly="true"
            autogrow
            type="textarea"
          />
        </q-page>
      </template>
    </q-splitter>
  </q-page>
</template>
<script setup lang="ts">
import { Ref, computed, ref } from 'vue';
import MainTitle from 'src/components/MainTitle.vue';
import InfoText from 'src/components/InfoText.vue';
import SubTitle from 'src/components/SubTitle.vue';
import { useI18n } from 'vue-i18n';
import SelectDir from 'src/components/SelectDir.vue';
import { copyToClipboard, useQuasar } from 'quasar';
import { useSettingsStore } from 'src/stores/settings';
import { Dat } from 'simutrans-dat-parser';
import { DatConvertedAddon } from 'app/types/global';

const splitterModel = ref(50);
const running = ref(false);
const targetDatDir = ref(((await window.electronAPI.getCache('targetDatDir')) || '') as string);

const updatecache = (key: string, val: unknown) => window.electronAPI.setCache(key, val);

const { t } = useI18n();
const addons: Ref<DatConvertedAddon[] | null> = ref(null);
const addonText = computed(() => {
  if (!addons.value) {
    return t('ここに実行結果が出力されます。');
  }
  return addons.value.map(a => {
    return `${a.file}\n${a.dat.objs.map(o=>o.name).join('\n')}`;
  }).join('\n')
});
const addonObjs = computed(() => {
  if (!addons.value) {
    return t('ここに実行結果が出力されます。');
  }
  return addons.value.map(a => {
    return { file: a.file, objs: a.dat.objs.map(o => o.name) };
  });
});
const objCount = computed(() => {
  if (!addons.value) {
    return null;
  }
  return addons.value.reduce((total, a) => total + a.dat.objs.length, 0);
})
const datCount = computed(() => {
  if (!addons.value) {
    return null;
  }
  return addons.value.length;
})

const $q = useQuasar();
const copy = async (text:string) => {
  try {
    await copyToClipboard(text);
    $q.notify({ type: 'positive', message: t('コピーしました') });
  } catch (error) {
    $q.notify({ type: 'negative', message: t('コピーに失敗しました') });
  }
};

const copyText = () => { copy(addonText.value); };
const copyJson = () => { copy(JSON.stringify(addonObjs.value, null,4)); };
const copyRawJson = () => { copy(JSON.stringify(addons.value, null,4)); };

const store = useSettingsStore();
const startList = async () => {
  if (!targetDatDir.value) {
    return window.electronAPI.showError(t('フォルダが選択されていません'));
  }
  if (!store.makeobjPath) {
    return window.electronAPI.showError(t('Makeobjが選択されていません'));
  }

  try {
    running.value = true;
    addons.value = null;

      const result = await window.makeobjApi.listFromDat({
      makeobjPath: store.makeobjPath,
      target: targetDatDir.value,
    });
    addons.value = result.map(r => {
      return {
        file: r.file,
        dat: new Dat(r.dat)
      }
    });
  } catch (error) {

  } finally {
    running.value = false;
  }
};
</script>
