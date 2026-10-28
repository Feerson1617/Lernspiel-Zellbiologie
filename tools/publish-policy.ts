import { lstatSync, readdirSync } from 'node:fs';
import { isAbsolute, join, relative, sep } from 'node:path';

export function assertRepositoryFiles(files: readonly string[], allowed: readonly string[]): void {
  const approved = new Set(allowed);
  if (files.some((file) => !approved.has(file))) {
    throw new Error('Unapproved repository files found. Review the explicit repository allowlist before committing.');
  }
}

export function assertDistFiles(files: readonly string[], patterns: readonly string[]): void {
  const approved = patterns.map((pattern) => new RegExp(pattern));
  if (!files.includes('index.html') || files.some((file) => !approved.some((pattern) => pattern.test(file)))) {
    throw new Error('The build contains missing or unapproved publication files.');
  }
}

/** P03a authorizes only the lazy learner entry to carry the current M6.02
 * contract and its reused shape-validator label. Neither is editorial data.
 * The initial entry and all other files retain the previous contract barrier. */
export function assertPublicBundleText(path: string, source: string): void {
  const forbidden = /sourceMappingURL|reference-fixtures|model-vectors|spec\/tasks|naming-input\/1\.0\.0|naming-term|Interne Benennungsprobe|m602-cued-cases|p02c-cases|INTERNE P02c-BEDIENPROBE/;
  const m602Contract = /m602-response\/1\.0\.0|m602-cued-relations\/1\.0\.0/;
  if (forbidden.test(source) || (m602Contract.test(source) && !/^assets\/m602-entry-[A-Za-z0-9_-]{8,}\.js$/.test(path))) {
    throw new Error('The build contains source maps, editorial reference data or an unapproved assessment entry.');
  }
}

/** Do not follow symlinks into private material, including symlinked directories. */
export function listRegularFiles(root: string): string[] {
  if (!lstatSync(root).isDirectory() || lstatSync(root).isSymbolicLink()) {
    throw new Error('Publication root must be a regular directory.');
  }
  const files: string[] = [];
  function visit(directory: string): void {
    for (const name of readdirSync(directory)) {
      const path = join(directory, name);
      const stat = lstatSync(path);
      if (stat.isSymbolicLink()) throw new Error('Symlinks are not approved for publication.');
      if (stat.isDirectory()) visit(path);
      else if (stat.isFile()) files.push(relative(root, path).split(sep).join('/'));
      else throw new Error('Only regular files may be published.');
    }
  }
  visit(root);
  return files.sort();
}

/** Runtime chunks may contain src and installed libraries, never authoring/QA data. */
export function assertRuntimeModule(id: string, root: string, approvedFiles: readonly string[]): void {
  if (id.startsWith('\0') || !isAbsolute(id)) return;
  const file = id.split('?')[0] ?? id;
  const path = relative(root, file).split(sep).join('/');
  if (path.startsWith('node_modules/')) return;
  if ((path !== 'index.html' && !path.startsWith('src/')) || !approvedFiles.includes(path)) {
    throw new Error('Runtime import outside src: authoring, reference and private files must stay outside the bundle.');
  }
}

export function publishedAssetPaths(html: string, base: string): string[] {
  return [...html.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)].map((match) => {
    const url = match[1] ?? '';
    if (!url.startsWith(base) || url.includes('..') || url.includes('?') || url.includes('#')) {
      throw new Error('A built asset URL does not use the approved GitHub Pages base path.');
    }
    return url.slice(base.length);
  });
}
