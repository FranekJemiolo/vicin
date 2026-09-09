import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('EAS Build Configuration: Validates build profiles and distribution settings', () => {
  const easPath = path.resolve(__dirname, '../../../../apps/mobile/eas.json');
  assert(fs.existsSync(easPath), 'eas.json must exist in apps/mobile');

  const content = JSON.parse(fs.readFileSync(easPath, 'utf8'));

  // CLI & Auto-versioning
  assert.equal(content.cli?.appVersionSource, 'remote');

  // Development Profile
  assert(content.build?.development, 'Development profile must exist');
  assert.equal(content.build.development.developmentClient, true);
  assert.equal(content.build.development.ios?.simulator, true);

  // Preview Profile (Internal distribution: Simulator & APK)
  assert(content.build?.preview, 'Preview profile must exist');
  assert.equal(content.build.preview.distribution, 'internal');
  assert.equal(
    content.build.preview.ios?.simulator,
    true,
    'Preview iOS should build for simulator'
  );
  assert.equal(content.build.preview.android?.buildType, 'apk', 'Preview Android should build APK');
  assert.equal(
    content.build.preview.autoIncrement,
    true,
    'Preview should auto-increment build numbers'
  );

  // Production Profile (App Store & Play Store)
  assert(content.build?.production, 'Production profile must exist');
  assert.equal(content.build.production.ios?.simulator, false);
  assert.equal(content.build.production.android?.buildType, 'app-bundle');
  assert.equal(content.build.production.autoIncrement, true);
});
