<template>
  <q-input
    :model-value="modelValue || $t(unselectLabel)"
    :readonly="true"
    :label="title"
    class="q-mb-sm"
    @click="modelValue || handle()"
  />
  <q-btn-group outline>
    <SmallSecondaryButton
      :disable="disable"
      :label="$t(selectLabel)"
      @click="handle"
    />
    <SmallSecondaryButton
      :disable="disable"
      :label="$t(clearLabel)"
      @click="clear"
    />
    <SmallSecondaryButton
      :disable="!modelValue"
      :label="$t(openLabel)"
      @click="open"
    />
  </q-btn-group>
</template>
<script setup lang="ts">
import SmallSecondaryButton from './buttons/SmallSecondaryButton.vue';

const props = withDefaults(
  defineProps<{
    modelValue: string;
    title: string;
    unselectLabel?: string;
    selectLabel?: string;
    defaultPath?: string;
    openLabel?: string;
    clearLabel?: string;
    disable?: boolean;
  }>(),
  {
    unselectLabel: '未選択',
    selectLabel: '選択',
    openLabel: 'フォルダ表示',
    clearLabel: 'クリア',
    defaultPath: undefined,
    disable: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string | null];
}>();
const handle = async () => {
  if (props.disable === false) {
    const result = await window.electronAPI.saveFile({ defaultPath: props.defaultPath });
    if (result) {
      emit('update:modelValue', result);
    }
  }
};
const clear = async () => props.disable === false && emit('update:modelValue', '');
const open = () => window.electronAPI.openDir(props.modelValue);
</script>
