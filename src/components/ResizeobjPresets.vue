<template>

  <div>
    <q-btn
      color="secondary"
      outline
      dense
      :label="$t('表示する')"
      class="q-mb-md"
      @click="show=!show"
    />
  </div>

  <q-slide-transition>
    <div v-show="show">
      <q-list
        rounded
        bordered
        separator
      >
        <q-item
          v-ripple
          clickable
          @click="handle('expansion')"
        >
          <q-item-section>{{$t('64から128に拡大変換')}}</q-item-section>
        </q-item>
        <q-item
          v-ripple
          clickable
          @click="handle('shrink')"
        >
          <q-item-section>{{$t('128から64に縮小変換（デフォルト）')}}</q-item-section>
        </q-item>
        <q-item
          v-ripple
          clickable
          @click="handle('originalSize')"
        >
          <q-item-section>{{$t('128から64に原寸大変換')}}</q-item-section>
        </q-item>
        <q-item
          v-ripple
          clickable
          @click="handle('shrink256')"
        >
          <q-item-section>{{$t('256から128に縮小変換')}}</q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-slide-transition>
</template>
<script setup lang="ts">
import { ResizeobjOptions } from 'app/types/global';
import { ref } from 'vue';
const emit = defineEmits<{
  'selectPreset': [value: ResizeobjOptions];
}>();

const show = ref(false);

const opt = {
  'shrink': {},
  'originalSize': {k:true},
  'expansion': {x:true},
  'shrink256': {w:128},
}

const handle = (key: keyof typeof opt) => emit('selectPreset', opt[key]);
</script>
