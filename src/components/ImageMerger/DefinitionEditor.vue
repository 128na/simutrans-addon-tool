<template>
  <SaveFile
    v-model="modelValue.outputPath"
    default-path="merge.png"
    :title="$t('画像の保存先')"
  />
  <q-input
    v-model="modelValue.comment"
    :label="$t('コメント')"
  />
  <q-item-label header>{{ $t('処理一覧') }}</q-item-label>
  <div v-show="modelValue.rules.length < 1">
    <p>{{ $t('処理がありません。') }}</p>
  </div>
  <div class="q-mb-md">
    <draggable
      v-model="modelValue.rules"
      item-key="getKey"
    >
      <template #item="{ element, index }: { element: ExtendedRule, index: number }">
        <ExpandButton
          :label="`${index + 1}. ${$t(components[element.name].label)}`"
          :caption="element.comment"
        >
          <q-card>
            <q-card-section>
              <component
                :is="components[element.name].component"
                v-model="modelValue.rules[index]"
              />
              <div class="text-right">
                <SmallNegativeButton
                  :label="$t('削除')"
                  @click="remove(index)"
                />
              </div>
            </q-card-section>
          </q-card>
        </ExpandButton>
      </template>
    </draggable>
  </div>
  <DropButton :label="$t('処理を追加')">
    <q-list>
      <q-item
        v-for="(rule, index) in rules"
        :key="index"
        v-close-popup
        dense
        clickable
        @click="add(rule.value)"
      >
        <q-item-section>
          <q-item-label>{{ $t(rule.name) }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </DropButton>
</template>
<script setup lang="ts">
import SaveFile from '../SaveFile.vue';
import ExpandButton from '../buttons/ExpandButton.vue';
import SmallNegativeButton from '../buttons/SmallNegativeButton.vue';
import DropButton from '../buttons/DropButton.vue';
import MergeImageRule from './MergeImageRule.vue';
import RemoveSpecialColor from './RemoveSpecialColor.vue';
import RemoveTransparent from './RemoveTransparent.vue';
import ReplaceColor from './ReplaceColor.vue';
import draggable from 'vuedraggable';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  modelValue: Definition;
}>();
const { t } = useI18n();

const components = {
  mergeImage: { component: MergeImageRule, label: '画像合成' },
  removeSpecialColor: { component: RemoveSpecialColor, label: '特殊色削除' },
  removeTransparent: { component: RemoveTransparent, label: '透過色置換' },
  replaceColor: { component: ReplaceColor, label: '指定色置換' },
};
const rules: { name: string; value: ExtendedRule }[] = [
  { name: '画像合成', value: { name: 'mergeImage', comment: '', pathes: [], mode: 'normal', offset: { x: 0, y: 0 } } },
  { name: '特殊色削除', value: { name: 'removeSpecialColor', comment: '' } },
  { name: '透過色置換', value: { name: 'removeTransparent', comment: '', threthold: 128 } },
  { name: '指定色置換', value: { name: 'replaceColor', comment: '', search: { r: 255, g: 0, b: 0 }, replace: { r: 0, g: 0, b: 255, a: 255 } } },
];
const add = (val: ExtendedRule) => {
  props.modelValue.rules.push(Object.create(val));
};
const remove = (index: number) => {
  window.confirm(t('削除しますか？')) && props.modelValue.rules.splice(index, 1);
};
</script>
