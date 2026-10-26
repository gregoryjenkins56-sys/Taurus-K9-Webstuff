import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const root = new URL('../', import.meta.url);
const files = new Map([
  ['/', ['tests/fixtures/contract-preview.html', 'text/html']],
  ...['adobe'].flatMap(provider => [
    [`/${provider}/`, ['tests/fixtures/provider-portal.html', 'text/html']],
    [`/${provider}`, ['tests/fixtures/provider-portal.html', 'text/html']]
  ]),
  ['/tests/fixtures/provider-portal.js', ['tests/fixtures/provider-portal.js', 'text/javascript']],
  ['/tests/fixtures/provider-portal.css', ['tests/fixtures/provider-portal.css', 'text/css']],
  ['/draft-contract.json', ['server/contracts/training-contract.draft.json', 'application/json']],
  ['/portal/css/portal.css', ['portal/css/portal.css', 'text/css']],
  ['/portal/css/agreement.css', ['portal/css/agreement.css', 'text/css']],
  ['/portal/js/agreement.js', ['portal/js/agreement.js', 'text/javascript']],
  ['/portal/js/agreement-model.js', ['portal/js/agreement-model.js', 'text/javascript']],
  ['/tests/fixtures/contract-preview.js', ['tests/fixtures/contract-preview.js', 'text/javascript']],
  ['/tests/fixtures/contract-preview-store.js', ['tests/fixtures/contract-preview-store.js', 'text/javascript']],
  ['/tests/fixtures/contract-preview-pdf.js', ['tests/fixtures/contract-preview-pdf.js', 'text/javascript']],
  ['/tests/fixtures/provider-templates.js', ['tests/fixtures/provider-templates.js', 'text/javascript']],
  ['/vendor/pdf-lib.js', ['node_modules/pdf-lib/dist/pdf-lib.esm.min.js', 'text/javascript']],
  ['/vendor/lucide.js', ['node_modules/lucide/dist/umd/lucide.min.js', 'text/javascript']]
]);

export function createPreviewServer() {
  return createServer(async (request, response) => {
    response.setHeader('cache-control', 'no-store');
    response.setHeader('x-content-type-options', 'nosniff');
    response.setHeader('referrer-policy', 'no-referrer');
    response.setHeader('x-frame-options', 'DENY');
    const host = request.headers.host ?? '';
    if (!/^(127\.0\.0\.1|localhost)(:\d+)?$/.test(host)) {
      response.writeHead(403).end('Local preview hosts only.');
      return;
    }
    const url = new URL(request.url, `http://${host}`);
    const entry = files.get(url.pathname);
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405, { allow: 'GET, HEAD' }).end();
      return;
    }
    if (!entry) { response.writeHead(404).end('Not found. No production APIs are available in this simulation.'); return; }
    try {
      const bytes = await readFile(new URL(entry[0], root));
      response.writeHead(200, { 'content-type': `${entry[1]}; charset=utf-8` });
      response.end(request.method === 'HEAD' ? undefined : bytes);
    } catch {
      response.writeHead(503).end('Preview asset unavailable. Install local dependencies first.');
    }
  });
}

export async function startPreview(port = 4173, tryNextPort = true) {
  const server = createPreviewServer();
  try {
    await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); });
  } catch (error) {
    if (error.code === 'EADDRINUSE' && tryNextPort && port < 4193) return startPreview(port + 1);
    throw error;
  }
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT ?? 4173);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('PORT must be between 1024 and 65535.');
  const server = await startPreview(port, process.env.PREVIEW_STRICT_PORT !== '1');
  console.log(`Taurus K9 simulation: http://127.0.0.1:${server.address().port}/`);
  console.log('Local only. Draft placeholders. No production access or real signing.');
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => server.close());
}