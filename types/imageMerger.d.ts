interface ImageMergeOption {
  version: number;
  definitions: Definition[];
  comment?: string;
}
interface Definition {
  outputPath: string;
  rules: Rule[];
  comment?: string;
}
interface Rule {
  /* ルール名 */
  name: 'mergeImage' | 'removeTransparent' | 'replaceColor' | 'removeSpecialColor';
  comment?: string;
}

/* 画像合成ルール */
interface MergeImageRule extends Rule {
  name: 'mergeImage';
  /* ファイルパス */
  pathes: string[];
  /* 合成方式 */
  mode: 'normal';
  offset: {
    x: number;
    y: number;
  };
}
/* 透明を透過色にする */
interface RemoveTransparentRule extends Rule {
  name: 'removeTransparent';
  /* 透明色に置換するアルファの閾値(0-255) */
  threthold: number;
}
/* 指定色置換 */
interface ReplaceColorRule extends Rule {
  name: 'replaceColor';
  search: RGB;
  replace: RGBA;
}
/* 特殊色削除 */
interface RemoveSpecialColorRule extends Rule {
  name: 'removeSpecialColor';
}

type ExtendedRule = MergeImageRule | RemoveTransparentRule | ReplaceColorRule | RemoveSpecialColorRule;
