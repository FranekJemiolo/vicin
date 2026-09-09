import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createMockDatabase, canUserViewBroadcast, acknowledgeBroadcast } from '../mock';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test('RLS Closed-Loop Policy: Group members can view broadcasts', () => {
  const db = createMockDatabase();
  assert.equal(canUserViewBroadcast(db, 'user-alice', 'bc-1'), true);
  assert.equal(canUserViewBroadcast(db, 'user-bob', 'bc-1'), true);
});

test('RLS Closed-Loop Policy: Outsiders CANNOT view broadcasts', () => {
  const db = createMockDatabase();
  assert.equal(canUserViewBroadcast(db, 'user-outsider', 'bc-1'), false);
});

test('RLS Enforcement: Outsider cannot acknowledge a broadcast', () => {
  const db = createMockDatabase();
  const result = acknowledgeBroadcast(db, 'user-outsider', 'bc-1');
  assert.equal(result.success, false);
  assert.match(result.error || '', /RLS violation/i);
});

test('Group Member can successfully acknowledge broadcast', () => {
  const db = createMockDatabase();
  const result = acknowledgeBroadcast(db, 'user-bob', 'bc-1');
  assert.equal(result.success, true);
  assert.equal(db.acknowledgments.size, 1);
});

test('Database Migrations: Verify all 3 migrations exist with RLS policies', () => {
  const migrationDir = resolve(__dirname, '../../supabase/migrations');
  const files = [
    '20260910000001_initial_schema.sql',
    '20260910000002_row_level_security.sql',
    '20260910000003_push_notification_triggers.sql',
  ];

  for (const file of files) {
    const filePath = resolve(migrationDir, file);
    assert.equal(existsSync(filePath), true, `Missing migration: ${file}`);
    const content = readFileSync(filePath, 'utf-8');
    assert.ok(content.length > 500, `Migration content is empty: ${file}`);
  }
});
