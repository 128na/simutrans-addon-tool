<template>
  <q-input :model-value="modelValue || $t(unselectLabel)" :readonly="true" :label="title" @click="modelValue || handle()" class="q-mb-sm" />
  <q-btn-group outline>
    <q-btn outline dense color="secondary" :disable="disable" @click="handle">
      {{ $t(selectLabel) }}
    </q-btn>
    <q-btn outline dense color="secondary" @click="open">
      {{ $t(openLabel) }}
    </q-btn>
  </q-btn-group>
</template>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string;
    title: string;
    unselectLabel?: string;
    selectLabel?: string;
    openLabel?: string;
    disable?: boolean;
  }>(),
  {
    unselectLabel: '未選択',
    selectLabel: '選択',
    openLabel: 'フォルダ表示',
    disable: false,
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();
const handle = async () => props.disable === false && emit('update:modelValue', await window.electronAPI.selectDir());
const open = () => window.electronAPI.openDir(props.modelValue);
</script>
