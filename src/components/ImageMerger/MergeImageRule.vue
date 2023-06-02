<template>
  <q-card>
    <q-list>
      <q-item>
        <q-item-section>{{ $t('オフセット') }}</q-item-section>
        <q-item-section>
          <q-input
            v-model="modelValue.offset.x"
            type="number"
            label="x"
          />
        </q-item-section>
        <q-item-section>
          <q-input
            v-model="modelValue.offset.y"
            type="number"
            label="y"
          />
        </q-item-section>
      </q-item>
      <q-item-label header>{{ $t('画像一覧') }}</q-item-label>
      <q-item v-show="modelValue.pathes.length < 1">
        <q-item-section>{{ $t('画像が選択されていません。') }}</q-item-section>
      </q-item>
      <q-item
        v-for="(path, i) in modelValue.pathes"
        :key="i"
      >
        <q-item-section side>
          <UpButton
            :disable="i === 0"
            @click="swap(i, i - 1)"
          />
          <DownButton
            :disable="i === modelValue.pathes.length - 1"
            @click="swap(i, i + 1)"
          />
        </q-item-section>
        <q-item-section>
          <q-img
            :src="`local-image://${path}`"
            class="thumb"
          >
            <div class="breakable absolute-bottom thumb-desc">{{ i + 1 }}. {{ path }}</div>
          </q-img>
        </q-item-section>
        <q-item-section side>
          <DeleteButton @click="remove(i)" />
        </q-item-section>
      </q-item>
      <q-item>
        <SmallSecondaryButton
          :label="$t('画像を追加')"
          @click="add"
        />
      </q-item>
    </q-list>
  </q-card>
</template>
<script setup lang="ts">
import { MergeImageRule } from 'app/types/global';
import UpButton from '../buttons/UpButton.vue';
import DownButton from '../buttons/DownButton.vue';
import DeleteButton from '../buttons/DeleteButton.vue';
import { useI18n } from 'vue-i18n';
import SmallSecondaryButton from '../buttons/SmallSecondaryButton.vue';
const props = defineProps<{
  modelValue: MergeImageRule;
}>();
const { t } = useI18n();
const add = async () => {
  const pathes = await window.electronAPI.selectMultiFiles({ filters: [{ name: 'image', extensions: ['png'] }] });
  props.modelValue.pathes.splice(-1, 0, ...pathes);
};
const remove = async (index: number) => {
  window.confirm(t('削除しますか？')) && props.modelValue.pathes.splice(index, 1);
};
const swap = (index1: number, index2: number) => {
  props.modelValue.pathes[index1] = props.modelValue.pathes.splice(index2, 1, props.modelValue.pathes[index1])[0];
};
</script>
<style>
.thumb {
  max-width: 300px;
}
.thumb-desc {
  padding:8px !important;
}
</style>
