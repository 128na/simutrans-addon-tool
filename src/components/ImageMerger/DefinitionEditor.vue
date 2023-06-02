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
    </q-card-section>
    <q-card-section>
      <q-item-label header>{{ $t('コマンド一覧') }}</q-item-label>
      <div v-show="modelValue.rules.length < 1">
        <p>{{ $t('コマンドがありません。') }}</p>
      </div>

      <q-expansion-item
        v-for="(rule, ruleIndex) in modelValue.rules"
        :key="ruleIndex"
        expand-separator
        :default-opened="true"
        :label="`${ruleIndex + 1}. ${$t(components[rule.name].label)}`"
        :caption="rule.comment"
        class="bg-grey-2"
      >
        <component
          :is="components[rule.name].component"
          v-model="modelValue.rules[ruleIndex]"
        />
      </q-expansion-item>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import { Definition } from 'app/types/global';
import SaveFile from '../SaveFile.vue';
import MergeImageRule from './MergeImageRule.vue';
import RemoveSpecialColor from './RemoveSpecialColor.vue';
import RemoveTransparent from './RemoveTransparent.vue';
import ReplaceColor from './ReplaceColor.vue';
defineProps<{
  modelValue: Definition;
}>();

const components = {
  mergeImage: {component:MergeImageRule, label:'画像合成'},
  removeSpecialColor: {component:RemoveSpecialColor, label:'特殊色削除'},
  removeTransparent: {component:RemoveTransparent, label:'透過色置換'},
  replaceColor: {component:ReplaceColor, label:'指定色置換'},
};

</script>
