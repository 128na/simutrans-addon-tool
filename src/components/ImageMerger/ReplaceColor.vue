<template>
  <q-expansion-item
    expand-separator
    :default-opened="true"
    :label="`${index + 1}. ${$t('指定色置換')}`"
    :caption="modelValue.comment"
  >
    <q-card>
      <q-card-section> 詳細設定 </q-card-section>
    </q-card>
  </q-expansion-item>
</template>
<script setup lang="ts">
import { Rule } from 'app/types/global';
defineProps<{
  modelValue: Rule;
  index: number;
}>();
</script>
