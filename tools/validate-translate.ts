import messages from '../src/i18n';
import path from 'path';
import { readContent, readJsFiles, validate } from './lib';

const jsFiles = readContent([...readJsFiles(path.join(__dirname, '..', 'src')), ...readJsFiles(path.join(__dirname, '..', 'src-electron'))]);
const { exists, notExists } = validate(messages, jsFiles);

const red = '\u001b[31m';
const green = '\u001b[32m';
const reset = '\u001b[0m';

if (exists.length) {
  console.log(`${green}exists keys:\n${exists.join('\n')}${reset}\n`);
}
if (notExists.length) {
  console.error(`${red}not exists keys:\n${notExists.join('\n')}${reset}\n`);
}
process.exit(notExists.length ? 1 : 0);
