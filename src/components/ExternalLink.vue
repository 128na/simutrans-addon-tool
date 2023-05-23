<template>
  <a href="#" @click.prevent="handleLink" class="text-primary">
    <q-icon name="output" class="q-mr-xs" />
    <slot />
    <template v-if="!$slots.default">{{ url }}</template>
  </a>
</template>
<script lang="ts" setup>
const props = defineProps<{
  url: string;
}>();

const handleLink = () => {
  window.electronAPI.openUrl(props.url);
};
</script>
