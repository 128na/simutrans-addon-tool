import messages from '../src/i18n';
import path from 'path';
import { readContent, readJsFiles, validate } from './lib';

const jsFiles = readContent([
  ...readJsFiles(path.join(__dirname, '..', 'src')),
  ...readJsFiles(path.join(__dirname, '..', 'src-electron'))
]);
const result = validate(messages, jsFiles);

process.exit(result ? 1 : 0);
