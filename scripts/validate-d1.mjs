import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

export function validateD1(config, environment) {
  if (!['preview', 'production'].includes(environment)) {
    throw new Error('Remote operations require --env preview or --env production.');
  }
  const databases = [config, config.env?.preview, config.env?.production].map(mapping => {
    if (mapping?.d1_databases?.length !== 1 || mapping.d1_databases[0].binding !== 'DB') {
      throw new Error('Each environment must have exactly one DB mapping.');
    }
    return mapping.d1_databases[0];
  });
  for (const field of ['database_id', 'database_name']) {
    const values = databases.map(database => database[field]?.trim().toLowerCase());
    if (values.some(value => !value) || new Set(values).size !== 3) {
      throw new Error(`D1 ${field} values must be distinct across default, preview and production.`);
    }
  }
  const selected = databases[environment === 'preview' ? 1 : 2];
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(selected.database_id) ||
      selected.database_id === '00000000-0000-0000-0000-000000000000') {
    throw new Error(`Provision a verified ${environment} D1 UUID before remote use; see docs/phase2-setup.md.`);
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  // Local development may use placeholders; deployment and standalone checks may not.
  if (process.env.WRANGLER_COMMAND !== 'dev') {
    try {
      const source = await readFile(new URL('../wrangler.jsonc', import.meta.url), 'utf8');
      const { config, error } = ts.parseConfigFileTextToJson('wrangler.jsonc', source);
      if (error) throw new Error('Cannot parse wrangler.jsonc.');
      validateD1(config, process.argv[2]);
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
  }
}
