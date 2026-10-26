import { HttpError } from './auth.ts';

export function json(value: unknown, status = 200) {
  return new Response(JSON.stringify(value), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
}

export async function input(request: Request, allowed: string[], limit = 8192): Promise<Record<string, unknown>> {
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') {
    throw new HttpError(415, 'Send a JSON request.');
  }
  if (Number(request.headers.get('content-length')) > limit) throw new HttpError(413, `File or request exceeds the ${limit}-byte limit.`);
  if (!request.body) throw new HttpError(400, 'Request body is required.');
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) { await reader.cancel(); throw new HttpError(413, `File or request exceeds the ${limit}-byte limit.`); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  let data: unknown;
  try { data = JSON.parse(new TextDecoder().decode(bytes)); }
  catch { throw new HttpError(400, 'Request must contain valid JSON.'); }
  if (!data || typeof data !== 'object' || Array.isArray(data) ||
      Object.keys(data).some(key => !allowed.includes(key))) {
    throw new HttpError(400, 'Request contains unsupported fields.');
  }
  return Object.fromEntries(Object.entries(data));
}

export function text(value: unknown, name: string, max = 120, required = true) {
  if (typeof value !== 'string' || value.length > max ||
      Array.from(value).some(char => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127) || (required && !value.trim())) {
    throw new HttpError(400, `Enter a valid ${name}.`);
  }
  return value.trim();
}
