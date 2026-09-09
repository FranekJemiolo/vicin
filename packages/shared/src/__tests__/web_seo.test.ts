import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Web SEO & Polish: Manifest and Favicon assets exist', () => {
  const rootDir = path.resolve(__dirname, '../../../../');
  const manifestPath = path.join(rootDir, 'apps/web/public/manifest.json');
  const faviconPath = path.join(rootDir, 'apps/web/public/favicon.svg');
  const layoutPath = path.join(rootDir, 'apps/web/src/app/layout.tsx');
  const pagePath = path.join(rootDir, 'apps/web/src/app/page.tsx');

  assert(fs.existsSync(manifestPath), 'manifest.json must exist in apps/web/public');
  assert(fs.existsSync(faviconPath), 'favicon.svg must exist in apps/web/public');

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert.equal(manifest.name, 'Vicin - Spontaneous Availability');
  assert.equal(manifest.theme_color, '#10B981');

  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  assert(layoutContent.includes('openGraph:'));
  assert(layoutContent.includes('twitter:'));
  assert(layoutContent.includes('manifest:'));

  const pageContent = fs.readFileSync(pagePath, 'utf8');
  assert(pageContent.includes('handleJoinWaitlist'));
  assert(pageContent.includes('id="waitlist"'));
});
