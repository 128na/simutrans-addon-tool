<template>
  <q-page padding>
    <MainTitle>
      {{ $t('リンク集') }}
    </MainTitle>

    <SubTitle>
      {{ $t('公式サイト') }}
    </SubTitle>
    <ul>
      <li v-for="link in officialLinks" :key="link.url">
        <p>
          <ExternalLink :url="link.url">{{ link.title }}</ExternalLink>
          {{ $t(link.description) }}
        </p>
      </li>
    </ul>

    <SubTitle>
      {{ $t('非公式サイト') }}
    </SubTitle>
    <ul>
      <li v-for="link in unofficialLinks" :key="link.url">
        <p>
          <ExternalLink :url="link.url">{{ link.title }}</ExternalLink>
          {{ $t(link.description) }}
        </p>
      </li>
    </ul>

    <template v-if="dev">
      <SubTitle> Links for development </SubTitle>
      <ul>
        <li v-for="link in devLinks" :key="link.url">
          <p>
            <ExternalLink :url="link.url" />
          </p>
        </li>
      </ul>
    </template>
  </q-page>
</template>
<script lang="ts" setup>
import ExternalLink from 'src/components/ExternalLink.vue';
import MainTitle from 'src/components/MainTitle.vue';
import SubTitle from 'src/components/SubTitle.vue';

const officialLinks = [
  {
    title: 'International Simutrans Forum',
    description: '（英語）公式フォーラム',
    url: 'https://forum.simutrans.com',
  },
  {
    title: 'English Simutrans Wiki',
    description: '（英語など）公式wiki。dat情報など日本語wikiよりも最新なことが多い。',
    url: 'http://wiki.simutrans-germany.com/',
  },
];
const unofficialLinks = [
  {
    title: 'Simutrans 日本語化・解説',
    description: '（日本語）古くからある日本語wiki',
    url: 'https://japanese.simutrans.com',
  },
  {
    title: 'Simutrans Addon Portal',
    description: '（日本語）アドオン投稿サイト',
    url: 'https://simutrans-portal.128-bit.net',
  },
  {
    title: 'Simutrans的な実験室',
    description: '（日本語）wiki。鉄道会社別のアドオン一覧が便利。',
    url: 'https://wikiwiki.jp/twitrans',
  },
];

const dev = process.env.DEV;
const devLinks = [
  {
    url: 'https://ja.vuejs.org/',
  },
  {
    url: 'https://v3.router.vuejs.org/ja/',
  },
  {
    url: 'https://quasar.dev/',
  },
  {
    url: 'https://www.electronjs.org/ja/',
  },
  {
    url: 'https://fonts.google.com/icons',
  },
  {
    url: 'https://www.deepl.com/ja/translator#ja/en/',
  },
];
</script>
