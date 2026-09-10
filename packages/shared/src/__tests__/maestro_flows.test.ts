import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Maestro E2E Flows: Validates flow definition and captured screenshot assets', () => {
  const rootDir = path.resolve(__dirname, '../../../../');
  const baseFlowPath = path.join(rootDir, '.maestro/flow.yaml');
  const inviteFlowPath = path.join(rootDir, '.maestro/invite_flow.yaml');
  const settingsFlowPath = path.join(rootDir, '.maestro/settings_flow.yaml');
  const profileFlowPath = path.join(rootDir, '.maestro/profile_flow.yaml');
  const assetsDir = path.join(rootDir, 'apps/web/public/assets');

  assert(fs.existsSync(baseFlowPath), '.maestro/flow.yaml must exist');
  assert(fs.existsSync(inviteFlowPath), '.maestro/invite_flow.yaml must exist');
  assert(fs.existsSync(settingsFlowPath), '.maestro/settings_flow.yaml must exist');
  assert(fs.existsSync(profileFlowPath), '.maestro/profile_flow.yaml must exist');

  const baseFlow = fs.readFileSync(baseFlowPath, 'utf8');
  const inviteFlow = fs.readFileSync(inviteFlowPath, 'utf8');
  const settingsFlow = fs.readFileSync(settingsFlowPath, 'utf8');
  const profileFlow = fs.readFileSync(profileFlowPath, 'utf8');

  assert(baseFlow.includes('appId: com.franekjemiolo.vicin'));
  assert(inviteFlow.includes('appId: com.franekjemiolo.vicin'));
  assert(settingsFlow.includes('appId: com.franekjemiolo.vicin'));
  assert(profileFlow.includes('appId: com.franekjemiolo.vicin'));
  assert(inviteFlow.includes('vicin://invite/'));
  assert(inviteFlow.includes("I'm in"));
  assert(settingsFlow.includes('Ping Pong'));
  assert(profileFlow.includes('Display Name'));

  // Check assets exist
  assert(fs.existsSync(assetsDir), 'apps/web/public/assets directory must exist');
  const assetFiles = fs.readdirSync(assetsDir);
  assert(assetFiles.length >= 7, 'Must have at least 7 captured assets');

  const expectedScreenshots = [
    '01_login_screen.svg',
    '02_active_feed.svg',
    '03_create_broadcast.svg',
    '04_acknowledged_broadcast.svg',
    '05_invite_generation.svg',
    '06_accept_invite.svg',
    '07_multi_user_acknowledgment.svg',
  ];

  for (const file of expectedScreenshots) {
    assert(assetFiles.includes(file), `Expected asset ${file} to exist in public/assets`);
    const content = fs.readFileSync(path.join(assetsDir, file), 'utf8');
    assert(content.includes('<svg'), `${file} must be a valid SVG`);
  }
});
