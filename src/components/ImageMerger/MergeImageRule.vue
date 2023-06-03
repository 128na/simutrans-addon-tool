<template>
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
  <draggable
    v-model="modelValue.pathes"
    item-key="getKey"
  >
    <template #item="{ element, index }: { element: string, index: number }">
      <div class="img-frame sortable">
        <q-img
          :src="`local-image://${element}`"
          class="thumb"
        >
          <div class="breakable absolute-bottom thumb-desc">{{ index + 1 }}. {{ element }}</div>
        </q-img>
        <DeleteButton
          class="img-btn"
          @click="remove(index)"
        />
      </div>
    </template>
  </draggable>
  <q-item>
    <SmallSecondaryButton
      :label="$t('画像を追加')"
      @click="add"
    />
  </q-item>
</template>
<script setup lang="ts">
import DeleteButton from '../buttons/DeleteButton.vue';
import { useI18n } from 'vue-i18n';
import SmallSecondaryButton from '../buttons/SmallSecondaryButton.vue';
import draggable from 'vuedraggable';
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
</script>
<style scoped>
.thumb-desc {
  padding: 8px !important;
}
.img-frame {
  position: relative;
}
.img-btn {
  position: absolute;
  top: 8px;
  right: 8px;
}
</style>
