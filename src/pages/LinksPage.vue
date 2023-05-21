<template>
  <h1>Links</h1>

  <ul>
    <li>
      <a href="#" @click="handleLink('https://forum.simutrans.com')">
        International Simutrans Forum
      </a>
      <br>（英語）公式フォーラム
    </li>
    <li>
      <a href="#" @click="handleLink('https://simutrans-germany.com/wiki/wiki/en_Index')">
        Einglish Simutrans Wiki
      </a>
      <br>（英語）公式wiki。dat情報は最新なことが多い
    </li>
    <li>
      <a href="#" @click="handleLink('https://japanese.simutrans.com')">
        Simutrans 日本語化・解説
      </a>
      <br>（日本語）非公式wiki
    </li>
    <li>
      <a href="#" @click="handleLink('https://simutrans-portal.128-bit.net')">
        Siimutrans Addon Portal
      </a>
      <br>（日本語）非公式アドオン投稿サイト
    </li>
    <li>
      <a href="#" @click="handleLink('https://wikiwiki.jp/twitrans')">
        Simutrans的な実験室
      </a>
      <br>（日本語）非公式wiki
    </li>
  </ul>
</template>
<script lang="ts" setup>
const handleLink = (url: string) => {
  window.electronAPI.openUrl(url);
};
</script>
