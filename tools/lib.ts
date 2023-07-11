import fs from 'fs';
import path from 'path';

interface FileEnt {
  [path: string]: string;
}

interface LangEnt {
  [lang: string]: MessageEnt;
}

interface MessageEnt {
  [key: string]: string;
}

export const readJsFiles = (dir: string) => {
  return (
    fs
      .readdirSync(dir, { withFileTypes: true })
      .flatMap((dirent): string | string[] => {
        if (dirent.isFile()) {
          return path.join(dir, dirent.name);
        }
        return readJsFiles(path.join(dir, dirent.name));
      })
      // 翻訳ファイル以外のts,vueファイル
      .filter((f) => !f.includes('i18n') && (f.endsWith('.ts') || f.endsWith('.vue')))
  );
};

export const readContent = (files: string[]): FileEnt => {
  return files.reduce(
    (prev, current) => {
      prev[current] = fs.readFileSync(current).toString();
      return prev;
    },
    {} as { [path: string]: string },
  );
};

const red = '\u001b[31m';
const green = '\u001b[32m';
const reset = '\u001b[0m';
export const validateMissing = (messages: LangEnt, jsFiles: FileEnt) => {
  for (const lang in messages) {
    if (lang === 'ja') {
      continue; // ja is default language
    }
    console.log(`${lang}-------------------------\n`);
    const exists = [];
    const notExists = [];
    for (const key in messages[lang]) {
      const result = existsInJsFiles(key, jsFiles);
      if (result) {
        exists.push(key);
      } else {
        notExists.push(key);
      }
    }
    if (exists.length) {
      console.log(`${green}exists keys:\n${exists.join('\n')}${reset}\n`);
    }
    if (notExists.length) {
      console.error(`${red}not exists keys:\n${notExists.join('\n')}${reset}\n`);
    }
  }
};

export const existsInJsFiles = (value: string, jsFiles: FileEnt): string | null => {
  for (const filename in jsFiles) {
    if (jsFiles[filename].includes(`'${value}'`)) {
      return filename;
    }
  }
  return null;
};

export const extractLangText = (jsFiles: FileEnt): string[] => {
  const regexp = /\\?t\('([^']+)'\)/g;
  const lang: Set<string> = new Set();
  for (const filename in jsFiles) {
    const matches = jsFiles[filename].matchAll(regexp);
    [...matches].forEach((match) => {
      lang.add(match[1]);
    });
  }
  return Array.from(lang);
};

export const existsInLangFiles = (key: string, messages: MessageEnt): boolean => {
  return messages.hasOwnProperty(key);
};

export const validateUntranslated = (messages: LangEnt, keys: string[]) => {
  for (const lang in messages) {
    if (lang === 'ja') {
      continue; // ja is default language
    }
    console.log(`${lang}-------------------------\n`);
    const exists = [];
    const notExists = [];
    for (const key of keys) {
      const result = existsInLangFiles(key, messages[lang]);
      if (result) {
        exists.push(key);
      } else {
        notExists.push(key);
      }
    }
    if (exists.length) {
      console.log(`${green}exists keys:\n${exists.join('\n')}${reset}\n`);
    }
    if (notExists.length) {
      console.error(`${red}not exists keys:\n${notExists.join('\n')}${reset}\n`);
    }
  }
};
