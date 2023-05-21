<template>
  <!-- makeobj help: "Works with PAK16 up to PAK32767 but only up to 255 are tested" -->
  <q-input :model-value="modelValue" type="number" :label="title" :min="16" :max="32767"
    @input:modelValue="$emit('update:modelValue', Number($event.target.value))"
    @change:modelValue="$emit('update:modelValue', Number($event.target.value))" class="q-mb-sm" />
  <q-btn-group outline>
    <q-btn outline dense color="secondary" @click="$emit('update:modelValue', 64)">64</q-btn>
    <q-btn outline dense color="secondary" @click="$emit('update:modelValue', 128)">128</q-btn>
    <q-btn outline dense color="secondary" @click="$emit('update:modelValue', 192)">192</q-btn>
    <q-btn outline dense color="secondary" @click="$emit('update:modelValue', 256)">256</q-btn>
  </q-btn-group>
</template>
<script setup lang="ts">

defineProps({
  modelValue: {
    type: Number, default: 128,
  },
  title: {
    type: String, required: true,
  },
});
defineEmits<{
  'update:modelValue': [value: number]
}>();

</script>
