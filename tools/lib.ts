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

const red = '\u001b[31m';
const green = '\u001b[32m';
const reset = '\u001b[0m';

export const validate = (messages: LangEnt, jsFiles: FileEnt) => {
  let allPassed = true;
  for (const lang in messages) {
    for (const key in messages[lang]) {
      const exists = existsInJsFiles(key, jsFiles);
      if (exists) {
        console.log(`${green}"${key}" is exists in ${exists}${reset}.`);
      } else {
        allPassed = false;
        console.error(`${red}"${key}" is not exist.`);
      }
    }
  }
  return allPassed;
}

export const existsInJsFiles = (value: string, jsFiles: FileEnt): string | null => {
  for (const filename in jsFiles) {
    if (jsFiles[filename].includes(value)) {
      return filename;
    }
  }
  return null;
}
