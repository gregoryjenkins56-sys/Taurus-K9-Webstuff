import { cp, mkdir, rm } from 'node:fs/promises';

const output = new URL('../dist/', import.meta.url);
await rm(output, { recursive: true, force: true });
await mkdir(new URL('portal/js/', output), { recursive: true });
for (const file of [
  'index.html', 'css', 'js', 'images', 'social',
  'portal/index.html', 'portal/css', 'portal/js/client.js'
]) {
  await cp(new URL(`../${file}`, import.meta.url), new URL(file, output), { recursive: true });
}
console.log('Built public asset allowlist; backend, secrets, tests, and demo fixtures excluded.');
