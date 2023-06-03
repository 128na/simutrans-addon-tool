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
    <InfoText>{{ $t('ドラッグで順序を変えられます。') }}</InfoText>
    <draggable
      v-model="modelValue.definitions"
      item-key="getKey"
      class="q-mb-md"
    >
      <template #item="{ element, index }: { element: Definition, index: number }">
        <ExpandButton
          :label="`${index + 1}. ${element.outputPath || $t('定義')}`"
          :header="element.comment"
        >
          <q-card>
            <q-card-section>
              <DefinitionEditor v-model="modelValue.definitions[index]" />
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
    <div class="q-mb-md">
      <SmallSecondaryButton
        :label="$t('定義を追加')"
        @click="add"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import SubTitle from '../SubTitle.vue';
import DefinitionEditor from './DefinitionEditor.vue';
import SmallSecondaryButton from '../buttons/SmallSecondaryButton.vue';
import ExpandButton from '../buttons/ExpandButton.vue';
import draggable from 'vuedraggable';
import InfoText from '../InfoText.vue';
import SmallNegativeButton from '../buttons/SmallNegativeButton.vue';
import { useI18n } from 'vue-i18n';
const props = defineProps<{
  modelValue: ImageMergeOption;
}>();
const { t } = useI18n();

const add = () => {
  props.modelValue.definitions.push({ outputPath: '', comment: '', rules: [] });
};
const remove = (index: number) => {
  window.confirm(t('削除しますか？')) && props.modelValue.definitions.splice(index, 1);
};
</script>
