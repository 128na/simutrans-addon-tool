<template>
  <!-- makeobj help: "Works with PAK16 up to PAK32767 but only up to 255 are tested" -->
  <q-input
    :model-value="modelValue"
    type="number"
    :label="title"
    :min="16"
    :max="32767"
    :readonly="disable"
    @input:modelValue="$emit('update:modelValue', Number($event.target.value))"
    @change:modelValue="$emit('update:modelValue', Number($event.target.value))"
    class="q-mb-sm"
  />

  <q-btn-group outline>
    <q-btn
      outline
      dense
      color="secondary"
      v-for="size in sizes"
      :key="size"
      :disable="disable"
      @click="$emit('update:modelValue', size)"
    >
      {{ size }}
    </q-btn>
  </q-btn-group>
</template>
<script setup lang="ts">
defineProps({
  modelValue: { type: Number, default: 128 },
  title: { type: String, required: true },
  disable: { type: Boolean, default: false },
});
defineEmits<{
  'update:modelValue': [value: number];
}>();

const sizes = [64, 128, 192, 256, 384, 512];
</script>
