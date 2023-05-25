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
            :title="$t('フォルダ')"
            :disable="running"
            @update:model-value="updatecache('listTargetPath', $event)" />
          <InfoText>{{ $t('Pakファイルのあるフォルダを選択します') }}</InfoText>

          <q-btn-group>
            <q-btn
              color="primary"
              :loading="running"
              @click="startList">{{ $t('実行') }}</q-btn>
          </q-btn-group>
        </q-page>
      </template>

      <template #after>
        <q-page
          padding>
          <SubTitle>{{ $t('アドオン一覧') }}</SubTitle>
          <ul>
            <li
              v-for="addon in addons"
              :key="addon.pak">
              {{ addon.pak }}
              <ul>
                <li
                  v-for="obj in addon.objs"
                  :key="obj">{{ obj }}</li>
              </ul>

            </li>
          </ul>

        </q-page>
      </template>
    </q-splitter>
  </q-page>
</template>
<script setup lang="ts">
import { Ref, ref } from 'vue';
import MainTitle from 'src/components/MainTitle.vue';
import InfoText from 'src/components/InfoText.vue';
import SubTitle from 'src/components/SubTitle.vue';
import { useI18n } from 'vue-i18n';
import SelectDir from 'src/components/SelectDir.vue';

const splitterModel = ref(50);

const listTargetPath = ref(((await window.electronAPI.getCache('listTargetPath')) || '') as string);
const makeobjPath = ref(((await window.electronAPI.getCache('makeobjPath')) || '') as string);

const { t } = useI18n();

const updatecache = (key: string, val: unknown) => window.electronAPI.setCache(key, val);

const running = ref(false);
const addons:Ref<addon[]|null> = ref(null);
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
