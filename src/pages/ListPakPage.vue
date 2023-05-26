<template>
  <q-page>
    <q-splitter
      v-model="splitterModel"
      class="max-height-without-header">
      <template #before>
        <q-page padding>
          <MainTitle>
            {{ $t('Pakリスト') }}
          </MainTitle>

          <SelectDir
            v-model="listTargetPath"
            :disable="running"
            :title="$t('フォルダ')"
            @update:model-value="updatecache('listTargetPath', $event)" />
          <InfoText>{{ $t('Pakファイルのあるフォルダを選択します') }}</InfoText>

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
          </q-btn-group>
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

const splitterModel = ref(50);

const listTargetPath = ref(((await window.electronAPI.getCache('listTargetPath')) || '') as string);
const makeobjPath = ref(((await window.electronAPI.getCache('makeobjPath')) || '') as string);

const { t } = useI18n();
const $q = useQuasar();

const updatecache = (key: string, val: unknown) => window.electronAPI.setCache(key, val);

const running = ref(false);
const addons: Ref<addon[] | null> = ref(null);
const addonText = computed(() => {
  if (!addons.value) {
    return '';
  }
  return addons.value.map(a => {
    return `[${a.pak}]\n${a.objs.join('\n')}`;
  }).join('\n')
});

const copy = async (text:string) => {
  try {
    await copyToClipboard(text);
    $q.notify({ type: 'positive', message: t('コピーしました') });
  } catch (error) {
    $q.notify({ type: 'negative', message: t('コピーに失敗しました') });
  }
};

const copyText = () => { copy(addonText.value); };
const copyJson = () => { copy(JSON.stringify(addons.value, null,4)); };

const startList = async () => {
  if (!listTargetPath.value) {
    return window.electronAPI.showError(t('Pakファイルが選択されていません'));
  }
  if (!makeobjPath.value) {
    return window.electronAPI.showError(t('Makeobjが選択されていません'));
  }

  try {
    running.value = true;
    addons.value = [];

    addons.value = await window.autoPakAPI.listPak({
      makeobjPath: makeobjPath.value,
      pakPath: listTargetPath.value,
    });
  } catch (error) {

  } finally {
    running.value = false;
  }
};
</script>
