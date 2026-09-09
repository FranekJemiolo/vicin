import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateExpiration,
  isBroadcastActive,
  getRemainingSeconds,
  formatCountdown,
} from '../utils/time';

test('calculateExpiration adds minutes accurately to UTC ISO string', () => {
  const base = new Date('2026-09-10T12:00:00.000Z');
  const result = calculateExpiration(30, base);
  assert.equal(result, '2026-09-10T12:30:00.000Z');
});

test('isBroadcastActive identifies future and past timestamps', () => {
  const base = new Date('2026-09-10T12:00:00.000Z');
  const future = '2026-09-10T12:15:00.000Z';
  const past = '2026-09-10T11:59:00.000Z';

  assert.equal(isBroadcastActive(future, base), true);
  assert.equal(isBroadcastActive(past, base), false);
});

test('getRemainingSeconds correctly clamps to 0', () => {
  const base = new Date('2026-09-10T12:00:00.000Z');
  const future = '2026-09-10T12:02:00.000Z';
  const past = '2026-09-10T11:50:00.000Z';

  assert.equal(getRemainingSeconds(future, base), 120);
  assert.equal(getRemainingSeconds(past, base), 0);
});

test('formatCountdown formats various time spans', () => {
  const base = new Date('2026-09-10T12:00:00.000Z');
  assert.equal(formatCountdown('2026-09-10T13:30:00.000Z', base), '1h 30m');
  assert.equal(formatCountdown('2026-09-10T12:15:20.000Z', base), '15m 20s');
  assert.equal(formatCountdown('2026-09-10T12:00:45.000Z', base), '45s');
  assert.equal(formatCountdown('2026-09-10T11:59:00.000Z', base), 'Expired');
});
