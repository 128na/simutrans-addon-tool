<template>
  <q-card-section> {{ index + 1 }}. {{ $t('特殊色削除') }} </q-card-section>
</template>
<script setup lang="ts">
import { Rule } from 'app/types/global';
defineProps<{
  modelValue: Rule;
  index: number;
}>();
</script>
