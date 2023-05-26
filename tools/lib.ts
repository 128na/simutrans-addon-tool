import fs from 'fs';
import path from 'path';

interface FileEnt {
  [path: string]: string
}

interface LangEnt {
  [lang: string]: MessageEnt
}

interface MessageEnt {
  [key: string]: string
}

export const readJsFiles = (dir: string) => {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((dirent): string | string[] => {
      if (dirent.isFile()) {
        return path.join(dir, dirent.name);
      }
      return readJsFiles(path.join(dir, dirent.name));
    })
    // 翻訳ファイル以外のts,vueファイル
    .filter(f => !f.includes('i18n') && (f.endsWith('.ts') || f.endsWith('.vue')));
};

export const readContent = (files: string[]): FileEnt => {
  return files.reduce((prev, current) => {
    prev[current] = fs.readFileSync(current).toString().replaceAll(/\s/g, '');
    return prev;
  }, {} as { [path: string]: string });
}

export const validate = (messages: LangEnt, jsFiles: FileEnt) => {
  const exists = [];
  const notExists = [];
  for (const lang in messages) {
    for (const key in messages[lang]) {
      const result = existsInJsFiles(key, jsFiles);
      if (result) {
        exists.push(key);
      } else {
        notExists.push(key);
      }
    }
  }
  return { exists, notExists };
}

export const existsInJsFiles = (value: string, jsFiles: FileEnt): string | null => {
  for (const filename in jsFiles) {
    if (jsFiles[filename].includes(value)) {
      return filename;
    }
  }
  return null;
}
