import { HttpError } from './auth.ts';
import { text } from './http.ts';

export function integer(value: unknown, name: string, min = 0, max = Number.MAX_SAFE_INTEGER): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < min || value > max) {
    throw new HttpError(400, `Enter a valid ${name}.`);
  }
  return value;
}

export function choice<T extends string>(value: unknown, name: string, values: readonly T[]): T {
  if (typeof value !== 'string' || !values.includes(value as T)) throw new HttpError(400, `Enter a valid ${name}.`);
  return value as T;
}

export function identifier(value: unknown, name: string) {
  const result = text(value, name, 80);
  if (!/^[A-Za-z0-9_-]+$/.test(result)) throw new HttpError(400, `Enter a valid ${name}.`);
  return result;
}

export function calendarDate(value: unknown, name: string): string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
      !Number.isFinite(Date.parse(`${value}T00:00:00Z`)) ||
      new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) !== value) {
    throw new HttpError(400, `Enter a valid ${name}.`);
  }
  return value;
}

export function instant(value: unknown, name: string): string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) {
    throw new HttpError(400, `Enter a valid ${name} with a timezone.`);
  }
  calendarDate(value.slice(0, 10), name);
  const hours = Number(value.slice(11, 13));
  const minutes = Number(value.slice(14, 16));
  const seconds = Number(value.slice(17, 19));
  const offset = value.match(/[+-](\d{2}):(\d{2})$/);
  const parsed = Date.parse(value);
  if (hours > 23 || minutes > 59 || seconds > 59 || !Number.isFinite(parsed) ||
      (offset && (Number(offset[1]) > 23 || Number(offset[2]) > 59))) {
    throw new HttpError(400, `Enter a valid ${name}.`);
  }
  const normalized = new Date(parsed).toISOString();
  if (!/^\d{4}-/.test(normalized)) throw new HttpError(400, `Enter a valid ${name} within the supported date range.`);
  return normalized;
}

export function timezone(value: unknown) {
  const zone = text(value, 'access timezone', 100);
  try { new Intl.DateTimeFormat('en-US', { timeZone: zone }).format(); }
  catch { throw new HttpError(400, 'Enter a valid access timezone.'); }
  return zone;
}

export function addCalendarDays(date: string, days: number) {
  const value = new Date(`${calendarDate(date, 'calendar date')}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

// Resolve the calendar boundary in its IANA zone, not by adding 24-hour periods
// to an already-zoned instant: an intervening DST transition changes its offset.
export function localMidnight(date: string, zone: string) {
  calendarDate(date, 'enrollment date');
  timezone(zone);
  const desired = Date.parse(`${date}T00:00:00Z`);
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  });
  let resolved = desired;
  for (let i = 0; i < 5; i++) {
    const parts = Object.fromEntries(formatter.formatToParts(new Date(resolved)).map(part => [part.type, part.value]));
    const shown = Date.parse(`${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}Z`);
    const correction = desired - shown;
    if (!correction) return new Date(resolved).toISOString();
    resolved += correction;
  }
  throw new HttpError(400, 'The enrollment date has no local midnight in its access timezone.');
}

export function graduationAccessExpiresAt(graduationDate: string, zone: string) {
  return localMidnight(addCalendarDays(graduationDate, 61), zone);
}

export function fingerprint(data: Record<string, unknown>) {
  return JSON.stringify(Object.fromEntries(Object.keys(data).sort().map(key => [key, data[key]])));
}

export function idempotency(request: Request, data: Record<string, unknown>) {
  const header = request.headers.get('idempotency-key');
  const body = data.idempotencyKey;
  const key = text(body ?? header, 'idempotency key', 200);
  if (header !== null && text(header, 'idempotency key', 200) !== key) throw new HttpError(400, 'Idempotency keys do not match.');
  return key;
}

export function interval(start: string, end: string | null, name: string) {
  if (end !== null && start >= end) throw new HttpError(400, `${name} must end after it starts.`);
}
