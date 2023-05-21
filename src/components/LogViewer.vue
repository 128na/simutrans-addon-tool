<template>
  <div
    ref="viewer"
    class="form-control viewer bg-light overflow-auto"
  >
    <div
      v-for="(l, index) in logger.getLogs(10)"
      :key="index"
      class="mb-3"
      :class="`text-${l.color}`"
    >
      <div>
        <component
          :is="l.icon"
          v-if="l.icon"
        />
        [{{ l.datetime }}] [{{ l.level }}]
      </div>
      <div>
        {{ l.message }}
      </div>
      <div v-if="l.args.length">
        {{ JSON.stringify(l.args) }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Ref} from 'vue';
import { ref, watch } from 'vue';
import Logger from '../services/logger';
const props = defineProps({
  logger: {type:Logger, required:true},
});

const viewer:Ref<Element|null> = ref(null);
watch(props.logger, () => {
  console.log('logger changed', viewer.value);
  if (viewer.value) {
    const el = viewer.value;
    setTimeout(() => el.scrollTo({ top: el.scrollHeight}), 100);
  }
});
</script>
<style>
.viewer {
  height: 75vh;
  white-space: pre-line;
}
</style>
