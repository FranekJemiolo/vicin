import test from 'node:test';
import assert from 'node:assert/strict';
import { colors, radius, buttonStyles, badgeStyles } from '../index';

test('UI Tokens: Colors define required brand availability indicators', () => {
  assert.equal(colors.brand.DEFAULT, '#10B981');
  assert.equal(colors.background.DEFAULT, '#090A0F');
  assert.equal(colors.accent.amber, '#F59E0B');
});

test('UI Tokens: Radii scale contains standard tokens', () => {
  assert.equal(radius.sm, 8);
  assert.equal(radius.md, 12);
  assert.equal(radius.lg, 16);
});

test('UI Components: Button style map has variants and sizes', () => {
  assert.ok(buttonStyles.variants.primary.includes('#10B981'));
  assert.ok(buttonStyles.variants.danger.includes('#F43F5E'));
  assert.ok(buttonStyles.sizes.md.includes('px-4'));
});

test('UI Components: Badge style map has brand and amber variants', () => {
  assert.ok(badgeStyles.variants.brand.includes('#10B981'));
  assert.ok(badgeStyles.variants.amber.includes('#F59E0B'));
});
