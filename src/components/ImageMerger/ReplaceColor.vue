<template>
  <q-card>
    <q-list>
      <q-item>
        <q-input
          v-model="modelValue.comment"
          :label="$t('コメント')"
          class="q-mb-md"
        />
      </q-item>
      <q-item>
        <q-item-section
          side
          top
        >
          {{ $t('対象の色') }}
          <q-color
            :model-value="rgb"
            format-model="hex"
            :palette="simuPalatte"
            @change="
              (val) => {
                rgb = val;
              }
            "
          />
        </q-item-section>
        <q-item-section
          side
          top
        >
          {{ $t('置換後の色') }}
          <q-color
            :model-value="rgba"
            format-model="hexa"
            :palette="simuPalatte"
            @change="
              (val) => {
                rgba = val;
              }
            "
          />
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>
<script setup lang="ts">
import { ReplaceColorRule } from 'app/types/global';
import { computed } from 'vue';
const props = defineProps<{
  modelValue: ReplaceColorRule;
}>();

const rgb = computed({
  get: () => {
    const [r, g, b] = [props.modelValue.search.r.toString(16).padStart(2, '0'), props.modelValue.search.g.toString(16).padStart(2, '0'), props.modelValue.search.b.toString(16).padStart(2, '0')];

    return `#${r}${g}${b}`;
  },
  set: (hex: string) => {
    props.modelValue.search.r = parseInt(hex.substring(1, 3), 16);
    props.modelValue.search.g = parseInt(hex.substring(3, 5), 16);
    props.modelValue.search.b = parseInt(hex.substring(5, 7), 16);
  },
});
const rgba = computed({
  get: () => {
    const [r, g, b, a] = [props.modelValue.replace.r.toString(16).padStart(2, '0'), props.modelValue.replace.g.toString(16).padStart(2, '0'), props.modelValue.replace.b.toString(16).padStart(2, '0'), props.modelValue.replace.a.toString(16).padStart(2, '0')];

    return `#${r}${g}${b}${a}`;
  },
  set: (hexa: string) => {
    props.modelValue.replace.r = parseInt(hexa.substring(1, 3), 16);
    props.modelValue.replace.g = parseInt(hexa.substring(3, 5), 16);
    props.modelValue.replace.b = parseInt(hexa.substring(5, 7), 16);
    props.modelValue.replace.a = parseInt(hexa.substring(7, 9), 16);
  },
});

const simuPalatte: string[] = ['rgb(231, 255, 255)', 'rgb(107, 107, 107)', 'rgb(155, 155, 155)', 'rgb(179, 179, 179)', 'rgb(201, 201, 201)', 'rgb(223, 223, 223)', 'rgb(87, 101, 111)', 'rgb(127, 155, 241)', 'rgb(255, 255, 83)', 'rgb(255, 33, 29)', 'rgb(1, 221, 1)', 'rgb(227, 227, 255)', 'rgb(193, 177, 209)', 'rgb(77, 77, 77)', 'rgb(255, 1, 127)', 'rgb(1, 1, 255)', 'rgb(36, 75, 103)', 'rgb(57, 94, 124)', 'rgb(76, 113, 145)', 'rgb(96, 132, 167)', 'rgb(116, 151, 189)', 'rgb(136, 171, 211)', 'rgb(156, 190, 233)', 'rgb(176, 210, 255)', 'rgb(123, 88, 3)', 'rgb(142, 111, 4)', 'rgb(161, 134, 5)', 'rgb(180, 157, 7)', 'rgb(198, 180, 8)', 'rgb(217, 203, 10)', 'rgb(236, 226, 11)', 'rgb(255, 249, 13)'];
</script>
