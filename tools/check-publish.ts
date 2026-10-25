import { inspectReachableHistory } from './publish-history.ts';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { lstatSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { assertDistFiles, assertRepositoryFiles, listRegularFiles, publishedAssetPaths } from './publish-policy.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const policy = JSON.parse(readFileSync(join(root, 'publish.allowlist.json'), 'utf8')) as {
  repositoryFiles: string[]; distPatterns: string[]; base: string;
};
const manifest = JSON.parse(readFileSync(join(root, 'qa/source-manifest.json'), 'utf8')) as {
  protectedFiles: { path: string; sha256: string }[];
};

const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
assertRepositoryFiles(files, policy.repositoryFiles);
const history = inspectReachableHistory(root, policy.repositoryFiles);
for (const file of files) {
  if (!lstatSync(join(root, file)).isFile() || lstatSync(join(root, file)).isSymbolicLink()) {
    throw new Error('The repository allowlist permits regular files only.');
  }
}
for (const file of manifest.protectedFiles) {
  const hash = createHash('sha256').update(readFileSync(join(root, file.path))).digest('hex');
  if (hash !== file.sha256) throw new Error('A protected concept or specification file changed; separate justification is required.');
}

const dist = join(root, 'dist');
const published = listRegularFiles(dist);
assertDistFiles(published, policy.distPatterns);
const references = publishedAssetPaths(readFileSync(join(dist, 'index.html'), 'utf8'), policy.base);
if (references.length < 3 || references.some((file) => !published.includes(file))) {
  throw new Error('The built page references missing assets.');
}
for (const file of published.filter((path) => /\.(?:js|css|html)$/.test(path))) {
  if (/sourceMappingURL|reference-fixtures|model-vectors|spec\/tasks|naming-input\/1\.0\.0|naming-term|Interne Benennungsprobe|m602-response\/1\.0\.0|m602-cued-relations\/1\.0\.0|m602-cued-cases|p02c-cases|INTERNE P02c-BEDIENPROBE/.test(readFileSync(join(dist, file), 'utf8'))) {
    throw new Error('The build contains source maps or editorial reference data.');
  }
}
console.log(`Publication check passed: ${files.length} approved repository files; ${history.paths} historical paths in ${history.trees} policy-checked trees; ${history.blobs} inspected blobs; ${manifest.protectedFiles.length} unchanged protected files; ${published.length} dist files; ${references.length} local asset references.`);
