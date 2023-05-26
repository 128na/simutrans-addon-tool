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
      {{ $t('このツールでは日本語をベースに作成しています。そのため翻訳が不完全な個所がある場合があります。') }}<br />
      {{ $t('翻訳に協力いただける方を募集しています。こちらから提案できます。') }}<br />
      <ExternalLink :url="issuePage" />
    </p>
    <SubTitle>
      {{ $t('開発情報') }}
    </SubTitle>
    <p>
      {{ $t('公開されている最新のバージョン') }} : {{ latest.version }} ({{ latest.created_at }})<br />
      {{ $t('最新版はこちらから入手できます。') }}<br />
      <ExternalLink :url="latest.url || releasePage" />
    </p>
    <SubTitle>
      {{ $t('更新情報') }}
    </SubTitle>
    <ul>
      <li
        v-for="(value, key) in histories"
        :key="key">v{{ key }} {{ $t(value) }}</li>
    </ul>
  </q-page>
</template>

<script lang="ts" setup>
import ExternalLink from 'src/components/ExternalLink.vue';
import MainTitle from 'src/components/MainTitle.vue';
import SubTitle from 'src/components/SubTitle.vue';

const histories = {
  '0.1': 'Pak化、自動Pak化機能を追加しました',
};
const releasePage = `${process.env.APP_REPOSITORY_URL}/release`;
const issuePage = `${process.env.APP_REPOSITORY_URL}/issues`;

const latest = await window.githubAPI.getLatestRelease();
console.log({latest})
</script>
