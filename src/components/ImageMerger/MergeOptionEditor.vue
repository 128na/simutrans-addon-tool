<template>
  <div>
    <SubTitle>{{ $t('定義情報') }}</SubTitle>

    <q-input
      :model-value="modelValue.version"
      :label="$t('定義バージョン')"
      :readonly="true"
      class="q-mb-md"
    />
    <q-input
      v-model="modelValue.comment"
      :label="$t('コメント')"
      class="q-mb-md"
    />

    <SubTitle>{{ $t('定義一覧') }}</SubTitle>
    <q-list
      v-if="modelValue.definitions.length"
      class="q-mb-md"
    >
      <DefinitionEditor
        v-for="(_, index) in modelValue.definitions"
        :key="index"
        v-model="modelValue.definitions[index]"
        :definition-index="index"
      />
    </q-list>
    <div class="q-mb-md">
      <q-btn
        :label="$t('定義を追加')"
        @click="addDef"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ImageMergeOption } from 'app/types/global';
import SubTitle from '../SubTitle.vue';
import DefinitionEditor from './DefinitionEditor.vue';
const props = defineProps<{
  modelValue: ImageMergeOption;
}>();

const addDef = () => {
  props.modelValue.definitions.push({ outputPath: '', comment: '', rules: [] });
};
</script>
