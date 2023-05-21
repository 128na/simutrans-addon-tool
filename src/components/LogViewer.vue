<template>
  <q-list separator :dark="true">
    <q-item v-for="(l, index) in logger.getReverseLogs()" :key="index" @click="copy(l)" clickable v-ripple>
      <q-item-section :class="`text-${l.color}`">
        <q-item-label>
          <q-icon v-if="l.icon" :name="l.icon" class="q-mr-xs" />
          {{ l.datetime }} [{{ l.level.toUpperCase() }}]
        </q-item-label>
        <q-item-label class="message">{{ l.message }}</q-item-label>
        <q-item-label class="message" v-if="l.args">{{ $t(JSON.stringify(l.args, null, 4)) }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Logger from '../services/logger';
import { copyToClipboard, useQuasar } from 'quasar'

defineProps({
  logger: { type: Logger, required: true },
});

const $q = useQuasar();
const { t } = useI18n();
const copy = async (l: Log) => {
  try {
    await copyToClipboard(`${l.datetime} [${l.level.toUpperCase()}]\n${l.message}`);
    $q.notify({ type: 'positive', message: t('コピーしました') })
  } catch (error) {
    $q.notify({ type: 'negative', message: t('コピーに失敗しました') })
  }
};
</script>
<style>
.message {
  white-space: pre-line;
}
</style>
