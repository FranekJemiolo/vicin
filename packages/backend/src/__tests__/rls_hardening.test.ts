import test from 'node:test';
import assert from 'node:assert/strict';
import { createMockDatabase } from '../mock';
import { Broadcast } from '@vicin/shared';

test('RLS Hardening: Prevent cross-group broadcast query leakage', () => {
  const db = createMockDatabase();

  // Create a second private group
  db.groups.set('group-secret', {
    id: 'group-secret',
    name: 'Top Secret Building Group',
    created_by: 'user-bob',
    created_at: new Date().toISOString(),
  });

  // Only Bob is a member of group-secret
  db.members.set('group-secret:user-bob', {
    group_id: 'group-secret',
    user_id: 'user-bob',
    role: 'owner',
    push_enabled: true,
    joined_at: new Date().toISOString(),
  });

  // Broadcast in group-secret
  db.broadcasts.set('bc-secret-1', {
    id: 'bc-secret-1',
    user_id: 'user-bob',
    group_id: 'group-secret',
    activity_id: 'act-coffee',
    message: 'Secret rooftop gathering',
    expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
    status: 'active',
    created_at: new Date().toISOString(),
  });

  // Query function simulating SELECT * FROM broadcasts WHERE is_group_member(group_id, auth.uid())
  const getVisibleBroadcasts = (userId: string): Broadcast[] => {
    const visible: Broadcast[] = [];
    for (const b of db.broadcasts.values()) {
      if (db.members.has(`${b.group_id}:${userId}`)) {
        visible.push(b);
      }
    }
    return visible;
  };

  // Alice is NOT a member of group-secret
  const aliceBroadcasts = getVisibleBroadcasts('user-alice');
  assert.equal(
    aliceBroadcasts.some(b => b.id === 'bc-secret-1'),
    false
  );

  // Bob IS a member of group-secret
  const bobBroadcasts = getVisibleBroadcasts('user-bob');
  assert.equal(
    bobBroadcasts.some(b => b.id === 'bc-secret-1'),
    true
  );
});

test('RLS Hardening: Prevent unauthorized broadcast mutation by non-author', () => {
  const db = createMockDatabase();
  const broadcast = db.broadcasts.get('bc-1');
  assert.ok(broadcast);
  assert.equal(broadcast.user_id, 'user-alice');

  // Mutation function enforcing RLS policy: USING (user_id = auth.uid())
  const updateBroadcastMessage = (
    userId: string,
    broadcastId: string,
    newMessage: string
  ): { success: boolean; error?: string } => {
    const target = db.broadcasts.get(broadcastId);
    if (!target) return { success: false, error: 'Not found' };
    if (target.user_id !== userId) {
      return { success: false, error: 'RLS: Unauthorized update on foreign broadcast record' };
    }
    target.message = newMessage;
    return { success: true };
  };

  // Bob tries to edit Alice's broadcast -> BLOCKED
  const bobAttempt = updateBroadcastMessage('user-bob', 'bc-1', 'Hacked message');
  assert.equal(bobAttempt.success, false);
  assert.match(bobAttempt.error || '', /Unauthorized update/i);
  assert.notEqual(db.broadcasts.get('bc-1')?.message, 'Hacked message');

  // Alice edits her own broadcast -> ALLOWED
  const aliceAttempt = updateBroadcastMessage('user-alice', 'bc-1', 'Updated note by Alice');
  assert.equal(aliceAttempt.success, true);
  assert.equal(db.broadcasts.get('bc-1')?.message, 'Updated note by Alice');
});

test('RLS Hardening: Prevent unauthorized member deletion by non-admin', () => {
  const db = createMockDatabase();

  const removeGroupMember = (
    actorId: string,
    groupId: string,
    targetUserId: string
  ): { success: boolean; error?: string } => {
    const actorMember = db.members.get(`${groupId}:${actorId}`);
    if (!actorMember) return { success: false, error: 'Actor is not a member' };

    // Member can leave on their own OR admin/owner can remove
    if (actorId === targetUserId || actorMember.role === 'owner' || actorMember.role === 'admin') {
      db.members.delete(`${groupId}:${targetUserId}`);
      return { success: true };
    }
    return { success: false, error: 'RLS: Admin permissions required' };
  };

  // Charlie (regular member) tries to kick Alice (owner)
  db.members.set('group-village:user-charlie', {
    group_id: 'group-village',
    user_id: 'user-charlie',
    role: 'member',
    push_enabled: true,
    joined_at: new Date().toISOString(),
  });

  const unauthorizedKick = removeGroupMember('user-charlie', 'group-village', 'user-alice');
  assert.equal(unauthorizedKick.success, false);
  assert.match(unauthorizedKick.error || '', /Admin permissions required/i);
  assert.ok(db.members.has('group-village:user-alice'));

  // Alice (owner) kicks Charlie -> ALLOWED
  const authorizedKick = removeGroupMember('user-alice', 'group-village', 'user-charlie');
  assert.equal(authorizedKick.success, true);
  assert.equal(db.members.has('group-village:user-charlie'), false);
});
