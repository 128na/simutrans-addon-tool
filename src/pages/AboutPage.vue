<template>
  <q-page padding>
    <MainTitle>
      {{ $t('ツールについて') }}
    </MainTitle>
    <p>
      {{ $t('Simutransのアドオン作成を支援するツール集です。') }}
    </p>
    <SubTitle>
      {{ $t('翻訳について') }}
    </SubTitle>
    <p>
      {{ $t('このツールでは日本語をベースに作成しています。そのため翻訳が不完全な個所がある場合があります。') }}
    </p>
    <SubTitle>
      {{ $t('更新情報') }}
    </SubTitle>
    <ul>
      <li v-for="(value, key) in histories" :key="key">
        v{{ key }} {{ $t(value) }}
      </li>
    </ul>
  </q-page>
</template>

<script lang="ts" setup>
import MainTitle from 'src/components/MainTitle.vue';
import SubTitle from 'src/components/SubTitle.vue';

const histories = {
  '0.1': 'Pak化、自動Pak化機能を追加しました',
};
</script>
