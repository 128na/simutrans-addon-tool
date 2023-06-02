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
      <q-expansion-item
        v-for="(definition, index) in modelValue.definitions"
        :key="index"
        expand-separator
        :default-opened="false"
        :label="`${$t('定義')} ${index + 1}`"
        :caption="definition.comment"
        class="bg-grey-2"
      >
        <DefinitionEditor v-model="modelValue.definitions[index]" />
      </q-expansion-item>
    </q-list>
    <div class="q-mb-md">
      <SmallSecondaryButton
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
import SmallSecondaryButton from '../buttons/SmallSecondaryButton.vue';
const props = defineProps<{
  modelValue: ImageMergeOption;
}>();

const addDef = () => {
  props.modelValue.definitions.push({ outputPath: '', comment: '', rules: [] });
};
</script>
