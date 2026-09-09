import test from 'node:test';
import assert from 'node:assert/strict';
import { createMockDatabase } from '../mock';

test('Push Notification Preferences: Filter out members with push_enabled = false', () => {
  const db = createMockDatabase();

  // Diana is a member of group-westside with push_enabled = false
  db.groups.set('group-westside', {
    id: 'group-westside',
    name: 'Westside Lofts',
    created_by: 'user-bob',
    created_at: new Date().toISOString(),
  });

  db.members.set('group-westside:user-bob', {
    group_id: 'group-westside',
    user_id: 'user-bob',
    role: 'owner',
    push_enabled: true,
    joined_at: new Date().toISOString(),
  });

  db.members.set('group-westside:user-diana', {
    group_id: 'group-westside',
    user_id: 'user-diana',
    role: 'member',
    push_enabled: false, // Muted notifications
    joined_at: new Date().toISOString(),
  });

  // Function simulating database trigger handle_new_broadcast() logic
  const getEligiblePushRecipients = (
    groupId: string,
    authorId: string
  ): Array<{ userId: string; pushToken: string }> => {
    const recipients: Array<{ userId: string; pushToken: string }> = [];

    for (const member of db.members.values()) {
      if (
        member.group_id === groupId &&
        member.user_id !== authorId &&
        member.push_enabled === true
      ) {
        const user = db.users.get(member.user_id);
        if (user?.expo_push_token) {
          recipients.push({ userId: user.id, pushToken: user.expo_push_token });
        }
      }
    }

    return recipients;
  };

  // Bob creates broadcast -> Diana has push_enabled = false, so 0 notifications dispatched
  const recipientsBobBroadcast = getEligiblePushRecipients('group-westside', 'user-bob');
  assert.equal(recipientsBobBroadcast.length, 0);

  // Now Diana toggles push notifications back on
  db.members.get('group-westside:user-diana')!.push_enabled = true;
  db.users.set('user-diana', {
    id: 'user-diana',
    email: 'diana@vicin.app',
    auth_provider: 'email',
    name: 'Diana Prince',
    expo_push_token: 'ExponentPushToken[mock_diana_token]',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const updatedRecipients = getEligiblePushRecipients('group-westside', 'user-bob');
  assert.equal(updatedRecipients.length, 1);
  assert.equal(updatedRecipients[0].userId, 'user-diana');
});

test('Push Notification Preferences: Author is never notified of their own broadcast', () => {
  const db = createMockDatabase();
  // Alice is in group-village with push_enabled = true
  const getEligiblePushRecipients = (
    groupId: string,
    authorId: string
  ): Array<{ userId: string; pushToken: string }> => {
    const recipients: Array<{ userId: string; pushToken: string }> = [];

    for (const member of db.members.values()) {
      if (
        member.group_id === groupId &&
        member.user_id !== authorId &&
        member.push_enabled === true
      ) {
        const user = db.users.get(member.user_id);
        if (user?.expo_push_token) {
          recipients.push({ userId: user.id, pushToken: user.expo_push_token });
        }
      }
    }

    return recipients;
  };

  const recipients = getEligiblePushRecipients('group-village', 'user-alice');
  assert.ok(!recipients.some(r => r.userId === 'user-alice'));
  assert.ok(recipients.some(r => r.userId === 'user-bob'));
});
