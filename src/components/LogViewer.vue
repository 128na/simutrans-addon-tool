<template>
  <q-list separator :dark="true">
    <q-item v-for="(l, index) in logger.getLogs(100).reverse()" :key="index" clickable v-ripple @click="copy(l)">
      <q-item-section>
        <q-item-label :class="`text-${l.color}`">{{ l.datetime }} [{{ l.level.toUpperCase() }}]</q-item-label>
        <q-item-label class="message" :class="`text-${l.color}`">{{ l.message }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>
<script setup lang="ts">
import Logger from '../services/logger';
import { copyToClipboard, useQuasar } from 'quasar'
import { Log } from 'app/interface';

defineProps({
  logger: { type: Logger, required: true },
});

const $q = useQuasar();
const copy = async (l: Log) => {
  try {
    await copyToClipboard(`${l.datetime} [${l.level.toUpperCase()}]\n${l.message}`);
    $q.notify({ message: 'Copied.' })
  } catch (error) {

  }
};
</script>
<style>
.message {
  white-space: pre-line;
}
</style>
