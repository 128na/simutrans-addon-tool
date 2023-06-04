import messages from '../src/i18n';
import path from 'path';
import { extractLangText, readContent, readJsFiles, validateMissing, validateUntranslated } from './lib';

console.log('Check for unused translation keys.\n');
const jsFiles = readContent([...readJsFiles(path.join(__dirname, '..', 'src')), ...readJsFiles(path.join(__dirname, '..', 'src-electron'))]);
validateMissing(messages, jsFiles);

console.log('Check for untranslated text.\n');
const keys = extractLangText(jsFiles);
validateUntranslated(messages, keys);

process.exit(0);
