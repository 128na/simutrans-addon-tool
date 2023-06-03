<template>
  <q-input
    v-model="modelValue.comment"
    :label="$t('コメント')"
    class="q-mb-md"
  />
  <q-input
    v-model="modelValue.threthold"
    type="number"
    :label="$t('アルファの閾値')"
    :min="0"
    :max="255"
  />
  <InfoText>
    {{ $t('範囲') }}: 0-255<br />
    {{ $t('閾値よりも低い（透明度の高い）色を透過色に置換します。') }}
    {{ $t('それ以上の色は不透明に塗りつぶします。') }}
  </InfoText>
</template>
<script setup lang="ts">
import InfoText from '../InfoText.vue';

defineProps<{
  modelValue: RemoveTransparentRule;
}>();
</script>
