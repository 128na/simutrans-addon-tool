<template>
  <q-input
    v-model="modelValue.comment"
    :label="$t('コメント')"
    class="q-mb-md"
  />
</template>
<script setup lang="ts">
defineProps<{
  modelValue: Rule;
}>();
</script>
