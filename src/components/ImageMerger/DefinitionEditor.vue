<template>
  <q-expansion-item
    expand-separator
    :default-opened="true"
    :label="`${$t('定義')} ${definitionIndex + 1}`"
    :caption="modelValue.comment"
    class="bg-grey-2"
  >
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
        <SubTitle>
          {{ $t('コマンド一覧') }}
        </SubTitle>
        <div v-show="modelValue.rules.length < 1">
          <p>{{ $t('コマンドがありません。') }}</p>
        </div>
        <component
          :is="components[rule.name]"
          v-for="(rule, ruleIndex) in modelValue.rules"
          :key="ruleIndex"
          v-model="modelValue.rules[ruleIndex]"
          :index="ruleIndex"
        />
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>
<script setup lang="ts">
import { Definition } from 'app/types/global';
import SaveFile from '../SaveFile.vue';
import MergeImageRule from './MergeImageRule.vue';
import RemoveSpecialColor from './RemoveSpecialColor.vue';
import RemoveTransparent from './RemoveTransparent.vue';
import ReplaceColor from './ReplaceColor.vue';
import SubTitle from '../SubTitle.vue';
defineProps<{
  modelValue: Definition;
  definitionIndex: number;
}>();

const components = {
  mergeImage: MergeImageRule,
  removeSpecialColor: RemoveSpecialColor,
  removeTransparent: RemoveTransparent,
  replaceColor: ReplaceColor,
};
</script>
