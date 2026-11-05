import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync } from 'node:fs';
import { join, resolve, normalize } from 'node:path';

const root = process.cwd();
const exported = join(root, 'classroom-export');
const viteConfig = join(root, '.classroom-vite.config.mjs');
const progressFile = join(root, 'src/persistence/progress-store.ts');
const m602UI = join(root, 'src/ui/m602-learning.ts');
const progressOriginal = readFileSync(progressFile, 'utf8');
const uiOriginal = readFileSync(m602UI, 'utf8');
const outputs = [];
mkdirSync(exported, { recursive: true });

function run(command, args, extraEnv = {}) {
  execFileSync(command, args, { cwd: root, env: { ...process.env, ...extraEnv }, stdio: 'inherit' });
}
function resolveAsset(folder, spec) {
  assert(!/^(?:https?:|\/|\/\/|\.\.\/)/i.test(spec), 'Absolute or remote production dependency: ' + spec);
  const clean = spec.replace(/^\.\//, '');
  const path = resolve(folder, clean);
  assert(path.startsWith(resolve(folder) + '/'), 'Asset escapes output directory');
  return path;
}
function inlineHtml(folder) {
  let html = readFileSync(join(folder, 'index.html'), 'utf8');
  const scriptTags = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+\.js)["'][^>]*><\/script>/gi)];
  assert.equal(scriptTags.length, 1, 'The HTML export needs one JS bundle, without split runtime chunks');
  const js = readFileSync(resolveAsset(folder, scriptTags[0][1]), 'utf8');
  html = html.replace(scriptTags[0][0], () => '<script type="module">\n' + js.replace(/<\/script/gi, '<\\/script') + '\n</script>');
  const linkTags = [...html.matchAll(/<link\b[^>]*>/gi)].filter(m => /\brel=["']stylesheet["']/i.test(m[0]));
  for (const tag of linkTags) {
    const match = tag[0].match(/\bhref=["']([^"']+\.css)["']/i);
    assert(match, 'CSS tag without local asset');
    const css = readFileSync(resolveAsset(folder, match[1]), 'utf8');
    assert(!/url\(\s*["']?(?:https?:|\/|\.\/|\.\.\/)/i.test(css), 'External CSS dependency');
    html = html.replace(tag[0], () => '<style>\n' + css.replace(/<\/style/gi, '<\\/style') + '\n</style>');
  }
  const favicon = readFileSync(join(root, 'src/assets/favicon.svg'));
  const icon = '<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,' + favicon.toString('base64') + '">';
  const oldIcon = html.match(/<link\b[^>]*\brel=["']icon["'][^>]*>/i);
  html = oldIcon ? html.replace(oldIcon[0], icon) : html.replace('</head>', icon + '\n</head>');
  assert(!/<script\b[^>]*\bsrc=/i.test(html), 'External JavaScript remains');
  assert(!/<link\b[^>]*\brel=["'](?:stylesheet|modulepreload)["']/i.test(html), 'External stylesheet or chunk remains');
  assert(!/["'](?:\.\/|\/)assets\/[^"']+\.(?:js|css)["']/i.test(html), 'Compiled asset reference remains');
  assert(html.includes('Zelllabor 11') && html.includes('type="module"'), 'Expected app entry missing');
  return html;
}
function build(mode) {
  const folder = 'dist-classroom-' + mode;
  run(process.execPath, ['node_modules/vite/bin/vite.js', 'build', '--config', '.classroom-vite.config.mjs'], { CLASSROOM_OUT: folder });
  const dest = join(root, folder);
  const all = readdirSync(join(dest, 'assets'));
  assert(all.filter(x => x.endsWith('.js')).length === 1, 'Build generated multiple JS chunks');
  return inlineHtml(dest);
}
function scormAdapter() {
  return [
    '<script>',
    '(function () {',
    '  "use strict";',
    '  var api = null, initialized = false, finished = false;',
    '  function search(w) {',
    '    for (var i = 0; w && i < 12; i++) {',
    '      try { if (w.API && typeof w.API.LMSInitialize === "function") return w.API; } catch (_) {}',
    '      try { if (w.parent === w) break; w = w.parent; } catch (_) { break; }',
    '    }',
    '    return null;',
    '  }',
    '  api = search(window);',
    '  if (!api) { try { if (window.opener) api = search(window.opener); } catch (_) {} }',
    '  if (api) { try { initialized = String(api.LMSInitialize("")) === "true"; } catch (_) {} }',
    '  function end() {',
    '    if (api && initialized && !finished) {',
    '      finished = true;',
    '      try { api.LMSFinish(""); } catch (_) {}',
    '    }',
    '  }',
    '  window.addEventListener("pagehide", end, { once: true });',
    '  // No LMSSetValue, score, lesson_status, suspend_data or learner data reporting.',
    '})();',
    '</script>'
  ].join('\n');
}
const config = [
  "import base from './vite.config.ts';",
  "import { defineConfig, mergeConfig } from 'vite';",
  "export default defineConfig(mergeConfig(base, {",
  "  base: './',",
  "  build: {",
  "    outDir: process.env.CLASSROOM_OUT || 'dist-classroom',",
  "    cssCodeSplit: false,",
  "    assetsInlineLimit: 100000000,",
  "    rollupOptions: { output: { inlineDynamicImports: true } }",
  "  }",
  "}));",
  ''
].join('\n');
writeFileSync(viteConfig, config);
try {
  run('npm', ['run', 'check:types']);
  const normal = build('html');
  const htmlFile = join(exported, 'Zelllabor11-Backup.html');
  writeFileSync(htmlFile, normal, 'utf8');
  outputs.push(htmlFile);

  const progressNeedle = "return typeof window === 'undefined' ? null : window.localStorage;";
  assert(progressOriginal.includes(progressNeedle), 'Persistence API changed; do not silently export tracking');
  const memoryPort = [
    'return {',
    '    getItem(key: string) { return classroomSessionProgress.get(key) ?? null; },',
    '    setItem(key: string, value: string) { classroomSessionProgress.set(key, value); },',
    '    removeItem(key: string) { classroomSessionProgress.delete(key); }',
    '  };'
  ].join('\n');
  const patched = 'const classroomSessionProgress = new Map<string, string>();\n' +
    progressOriginal.replace(progressNeedle, memoryPort);
  writeFileSync(progressFile, patched, 'utf8');
  const labelOld = 'Deine Rohantworten und Hilfeereignisse bleiben nur in dieser Sitzung. Lokal gespeichert werden ausschließlich die acht vorhandenen Fortschrittsmetadaten je bestätigtem Versuch.';
  const labelNew = 'In dieser SCORM-Version bleiben Antworten, digitale Hilfen und Bearbeitungsnachweise nur während der geöffneten Sitzung im Speicher. Es werden keine Antworten, Punktzahlen oder Fortschrittsdaten an itslearning gesendet.';
  assert(uiOriginal.includes(labelOld), 'SCORM storage wording changed');
  writeFileSync(m602UI, uiOriginal.replace(labelOld, labelNew), 'utf8');
  run('npm', ['run', 'check:types']);
  let scormHtml = build('scorm');
  assert(!scormHtml.includes('window.localStorage'), 'SCORM output still accesses browser persistent storage');
  scormHtml = scormHtml.replace('</head>', scormAdapter() + '\n</head>');
  const stage = join(exported, 'scorm-stage');
  mkdirSync(stage, { recursive: true });
  writeFileSync(join(stage, 'index.html'), scormHtml, 'utf8');
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<manifest identifier="ZELLABOR11_SCORM12" version="1.0" xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2" xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2">',
    '  <metadata><schema>ADL SCORM</schema><schemaversion>1.2</schemaversion></metadata>',
    '  <organizations default="ORG_ZL11">',
    '    <organization identifier="ORG_ZL11"><title>Zelllabor 11</title>',
    '      <item identifier="ITEM_ZL11" identifierref="RES_ZL11"><title>Zelllabor 11: Biologie Jahrgang 11</title></item>',
    '    </organization>',
    '  </organizations>',
    '  <resources>',
    '    <resource identifier="RES_ZL11" type="webcontent" adlcp:scormtype="sco" href="index.html">',
    '      <file href="index.html"/>',
    '    </resource>',
    '  </resources>',
    '</manifest>',
    ''
  ].join('\n');
  writeFileSync(join(stage, 'imsmanifest.xml'), xml, 'utf8');
  const zipFile = join(exported, 'Zelllabor11-SCORM-1.2.zip');
  const zipScript = [
    'from zipfile import ZipFile, ZIP_DEFLATED',
    'from xml.etree import ElementTree as ET',
    'from pathlib import Path',
    'import sys',
    'd, dest = Path(sys.argv[1]), Path(sys.argv[2])',
    "ET.parse(d / 'imsmanifest.xml')",
    "with ZipFile(dest, 'w', compression=ZIP_DEFLATED, compresslevel=9) as z:",
    "    z.write(d / 'imsmanifest.xml', 'imsmanifest.xml')",
    "    z.write(d / 'index.html', 'index.html')",
    "with ZipFile(dest) as z:",
    "    assert sorted(z.namelist()) == ['imsmanifest.xml', 'index.html']",
    "    assert z.testzip() is None"
  ].join('\n');
  run('python3', ['-c', zipScript, stage, zipFile]);
  outputs.push(zipFile);
  const sum = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
  const metadata = {
    source: 'Feerson1617/Lernspiel-Zellbiologie',
    sourceMainAtExport: 'e679a6f7706a3132730e02fbacc73422c1e4bf1d',
    html: { name: 'Zelllabor11-Backup.html', bytes: readFileSync(htmlFile).length, sha256: sum(htmlFile) },
    scorm: { name: 'Zelllabor11-SCORM-1.2.zip', bytes: readFileSync(zipFile).length, sha256: sum(zipFile), progress: 'memory_only', lmsData: 'no SetValue' },
    note: 'SCORM LMS may separately log the launch or duration; this content sends no answers, grades or completion data.'
  };
  writeFileSync(join(exported, 'EXPORT-MANIFEST.json'), JSON.stringify(metadata, null, 2) + '\n');
  console.log(JSON.stringify(metadata, null, 2));
} finally {
  writeFileSync(progressFile, progressOriginal, 'utf8');
  writeFileSync(m602UI, uiOriginal, 'utf8');
  rmSync(viteConfig, { force: true });
}