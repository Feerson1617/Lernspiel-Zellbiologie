import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { projectTaskCatalog, serializeTaskCatalog } from './catalog-source.ts';

const root = new URL('..', import.meta.url);
const read = (path: string): unknown => JSON.parse(readFileSync(new URL(path, root), 'utf8')) as unknown;
const catalog = projectTaskCatalog(read('spec/tasks.json'), read('spec/missions.json'));
const output = new URL('src/content/catalog-data.ts', root);
const source = serializeTaskCatalog(catalog);
const args = process.argv.slice(2);
if (args.length !== 1 || !['--check', '--write'].includes(args[0] ?? '')) throw new Error('Use --check or --write.');
if (args[0] === '--write') {
  writeFileSync(output, source);
} else if (readFileSync(output, 'utf8') !== source) {
  throw new Error('Public metadata differs from the reviewed source projection. Run npm run generate:catalog and review the diff.');
}
console.log(`${args[0] === '--write' ? 'Generated' : 'Checked'} ${catalog.tasks.length} task identities and ${catalog.missions.length} mission records: ${fileURLToPath(output)}`);
