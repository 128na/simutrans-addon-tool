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
      <q-item-label header>{{ $t('ドラッグで順序を変えられます') }}</q-item-label>
      <draggable
        v-model="modelValue.definitions"
        item-key="getKey"
      >
        <template #item="{element,index}:{element:Definition,index:number}">
          <q-expansion-item
            expand-separator
            :default-opened="false"
            :label="`${index + 1}. ${element.outputPath || $t('定義')}`"
            :caption="element.comment"
            class="bg-grey-2"
          >
            <DefinitionEditor v-model="modelValue.definitions[index]" />
          </q-expansion-item>
        </template>
      </draggable>
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
import { Definition, ImageMergeOption } from 'app/types/global';
import SubTitle from '../SubTitle.vue';
import DefinitionEditor from './DefinitionEditor.vue';
import SmallSecondaryButton from '../buttons/SmallSecondaryButton.vue';
import draggable from 'vuedraggable'
const props = defineProps<{
  modelValue: ImageMergeOption;
}>();

const addDef = () => {
  props.modelValue.definitions.push({ outputPath: '', comment: '', rules: [] });
};
</script>
