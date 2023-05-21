<template>
  <label
    :for="inputId"
    class="form-label"
  >{{ title }}</label>
  <!-- makeobj help: "Works with PAK16 up to PAK32767 but only up to 255 are tested" -->
  <input
    :value="modelValue"
    type="number"
    class="form-control mb-1"
    :min="16"
    :max="32767"
    @input:modelValue="$emit('update:modelValue', Number($event.target.value))"
    @change:modelValue="$emit('update:modelValue', Number($event.target.value))"
  />
  <div class="btn-group">
    <button
      class="btn btn-sm btn-outline-secondary"
      @click="$emit('update:modelValue', 64)"
    >
      64
    </button>
    <button
      class="btn btn-sm btn-outline-secondary"
      @click="$emit('update:modelValue', 128)"
    >
      128
    </button>
    <button
      class="btn btn-sm btn-outline-secondary"
      @click="$emit('update:modelValue', 192)"
    >
      192
    </button>
    <button
      class="btn btn-sm btn-outline-secondary"
      @click="$emit('update:modelValue', 256)"
    >
      256
    </button>
  </div>
</template>
<script setup lang="ts">

defineProps({
  modelValue: {
    type: Number, default:128,
  },
  title: {
    type: String, required:true,
  },
  inputId: {
    type: String, required:true,
  },
});
defineEmits<{
  'update:modelValue': [value: number]
}>();

</script>
