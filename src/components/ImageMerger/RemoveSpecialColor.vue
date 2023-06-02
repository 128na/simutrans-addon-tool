<template>
  <q-card>
    <q-card-section>
      <q-input
        v-model="modelValue.comment"
        :label="$t('コメント')"
        class="q-mb-md"
      />
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import { Rule } from 'app/types/global';
defineProps<{
  modelValue: Rule;
}>();
</script>
