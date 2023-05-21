<template>
  <q-page padding>
    <MainTitle>
      {{ $t('ツールについて') }}
    </MainTitle>
    <p>
      {{ $t('Simutransのアドオン作成を支援するツール集です。') }}
    </p>
    <SubTitle>
      {{ $t('更新情報') }}
    </SubTitle>
    <ul>
      <li>{{ $t('v0.0 pak化機能を追加しました') }}</li>
    </ul>
  </q-page>
</template>

<script lang="ts" setup>
import MainTitle from 'src/components/MainTitle.vue';
import SubTitle from 'src/components/SubTitle.vue';
</script>
