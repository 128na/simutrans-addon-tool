<template>
  <q-card>
    <q-card-section>
      <SaveFile
        v-model="modelValue.outputPath"
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
          <template #item="{element,index}:{element:ExtendedRule,index:number}">
            <q-expansion-item
              expand-separator
              :default-opened="true"
              :label="`${index + 1}. ${$t(components[element.name].label)}`"
              :caption="element.comment"
              header-class="bg-grey-2 sortable"
            >
              <component
                :is="components[element.name].component"
                v-model="modelValue.rules[index]"
              />
            </q-expansion-item>
          </template>
        </draggable>
      </div>

      <q-btn-dropdown
        color="secondary"
        dense
        outline
        :label="$t('処理を追加')"
      >
        <q-list>
          <q-item
            v-for="(rule,index) in rules"
            :key="index"
            v-close-popup
            dense
            clickable
            @click="add(rule.value)"
          >
            <q-item-section>
              <q-item-label>{{$t(rule.name)}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import { Definition, ExtendedRule } from 'app/types/global';
import SaveFile from '../SaveFile.vue';
import MergeImageRule from './MergeImageRule.vue';
import RemoveSpecialColor from './RemoveSpecialColor.vue';
import RemoveTransparent from './RemoveTransparent.vue';
import ReplaceColor from './ReplaceColor.vue';
import draggable from 'vuedraggable'

const props = defineProps<{
  modelValue: Definition;
}>();

const components = {
  mergeImage: { component: MergeImageRule, label: '画像合成' },
  removeSpecialColor: { component: RemoveSpecialColor, label: '特殊色削除' },
  removeTransparent: { component: RemoveTransparent, label: '透過色置換' },
  replaceColor: { component: ReplaceColor, label: '指定色置換' },
};
const rules: { name: string, value: ExtendedRule }[] = [
  { name: '画像合成', value: { name: 'mergeImage', comment: '', pathes: [], mode: 'normal', offset: { x: 0, y: 0 } } },
  { name: '特殊色削除', value: { name: 'removeSpecialColor', comment: '' } },
  { name: '透過色置換', value: { name: 'removeTransparent', comment: '', threthold: 128 } },
  { name: '指定色置換', value: { name: 'replaceColor', comment: '', search: { r: 255, g: 0, b: 0 }, replace: { r: 0, g: 0, b: 255, a: 255 } } },
];
const add = (val: ExtendedRule) => {
  props.modelValue.rules.push(Object.create(val));
}
</script>
