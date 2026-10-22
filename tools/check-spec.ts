import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const manifest = JSON.parse(readFileSync(join(root, 'qa/source-manifest.json'), 'utf8')) as {
  protectedFiles: { path: string }[];
};
// Run the unchanged checker on an exact temporary copy of the concept package.
// This prevents its recursive binary scan and implicit tsc type discovery from
// inspecting development dependencies. No source, expectation or check is altered.
const directory = mkdtempSync(join(tmpdir(), 'zelllabor11-concept-'));
let status = 1;
try {
  for (const file of manifest.protectedFiles) {
    const destination = join(directory, file.path);
    mkdirSync(dirname(destination), { recursive: true });
    copyFileSync(join(root, file.path), destination);
  }
  const venv = join(root, '.venv/bin/python');
  const result = spawnSync(existsSync(venv) ? venv : 'python3', [join(directory, 'tools/check_spec.py')], { cwd: directory, stdio: 'inherit' });
  if (result.error) console.error(result.error.message);
  status = result.status ?? 1;
  const report = join(directory, 'QA/Konzeptpruefung.json');
  if (existsSync(report)) {
    mkdirSync(join(root, 'qa/generated'), { recursive: true });
    copyFileSync(report, join(root, 'qa/generated/concept.json'));
  }
} finally {
  rmSync(directory, { recursive: true, force: true });
}
process.exitCode = status;
