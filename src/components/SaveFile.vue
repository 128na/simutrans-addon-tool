<template>
  <label
    :for="inputId"
    class="form-label"
  >{{ title }}</label>
  <input
    :value="modelValue || unselectLabel"
    type="text"
    class="form-control mb-1"
    :readonly="true"
    @click="modelValue || handle()"
  />
  <div class="btn-group">
    <button
      :id="inputId"
      class="btn btn-sm btn-outline-secondary"
      @click="handle"
    >
      {{ selectLabel }}
    </button>
    <button
      class="btn btn-sm btn-outline-secondary"
      @click="open"
    >
      {{ openLabel }}
    </button>
  </div>
</template>
<script setup lang="ts">

const props = withDefaults(defineProps<{
  modelValue: string
  title: string
  inputId: string
  unselectLabel?: string
  selectLabel?: string
  defaultPath?: string
  openLabel?: string
}>(), {
  unselectLabel: '未選択',
  selectLabel: '選択',
  openLabel: 'フォルダ表示',
  defaultPath: undefined,
});

const emit = defineEmits<{
  'update:modelValue': [value: string|null]
}>();
const handle = async ()=>emit('update:modelValue', await window.electronAPI.saveFile({defaultPath:props.defaultPath}));
const open = () => window.electronAPI.openDir(props.modelValue);

</script>
