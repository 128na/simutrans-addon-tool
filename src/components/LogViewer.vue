<template>
  <q-checkbox
    v-model="showDebug"
    :label="$t('デバッグログを表示')"
    class="text-white" />
  <q-separator :dark="true"/>
  <q-list
    separator
    :dark="true">
    <q-item
      v-for="(l, index) in logger.getReverseLogs()"
      v-show="!(showDebug===false && l.level==='debug')"
      :key="index"
      v-ripple
      clickable
      @click="copy(l)">
      <q-item-section :class="`text-${l.color}`">
        <q-item-label>
          <q-icon
            v-if="l.icon"
            :name="l.icon"
            class="q-mr-xs" />
          {{ l.datetime }} [{{ l.level.toUpperCase() }}]
        </q-item-label>
        <q-item-label class="message">{{ $t(l.message) }}</q-item-label>
        <q-item-label
          v-if="l.args"
          class="message">{{ formatArgs(l.args) }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Logger from '../services/logger';
import { copyToClipboard, useQuasar } from 'quasar';
import { ref } from 'vue';

defineProps({
  logger: { type: Logger, required: true },
});

const showDebug = ref(true);
const $q = useQuasar();
const { t } = useI18n();
const copy = async (l: Log) => {
  try {
    await copyToClipboard(`${l.datetime} [${l.level.toUpperCase()}]\n${l.message}`);
    $q.notify({ type: 'positive', message: t('コピーしました') });
  } catch (error) {
    $q.notify({ type: 'negative', message: t('コピーに失敗しました') });
  }
};

const formatArgs = (args: unknown) => {
  switch (typeof args) {
    case 'string':
      return args;
    case 'number':
      return String(args);
    case 'boolean':
      return args ? 'true' : 'false';

    default:
      return JSON.stringify(args, null, 4);
  }
};
</script>
<style>
.message {
  white-space: pre-wrap;
}
</style>
