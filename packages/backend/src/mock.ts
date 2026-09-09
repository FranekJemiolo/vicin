import { User, Group, GroupMember, Activity, Broadcast, Acknowledgment } from '@vicin/shared';

export interface DatabaseState {
  users: Map<string, User>;
  groups: Map<string, Group>;
  members: Map<string, GroupMember>; // key: `${groupId}:${userId}`
  activities: Map<string, Activity>;
  broadcasts: Map<string, Broadcast>;
  acknowledgments: Map<string, Acknowledgment>; // key: `${broadcastId}:${userId}`
}

export function createMockDatabase(): DatabaseState {
  const users = new Map<string, User>([
    [
      'user-alice',
      {
        id: 'user-alice',
        email: 'alice@vicin.app',
        auth_provider: 'email',
        name: 'Alice Chen',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        expo_push_token: 'ExponentPushToken[mock_alice_token]',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    [
      'user-bob',
      {
        id: 'user-bob',
        email: 'bob@vicin.app',
        auth_provider: 'google',
        name: 'Bob Martinez',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        expo_push_token: 'ExponentPushToken[mock_bob_token]',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    [
      'user-outsider',
      {
        id: 'user-outsider',
        email: 'outsider@vicin.app',
        auth_provider: 'email',
        name: 'Outsider Olivia',
        avatar_url: null,
        expo_push_token: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  ]);

  const groups = new Map<string, Group>([
    [
      'group-village',
      {
        id: 'group-village',
        name: 'Greenwich Village Pod',
        description: 'Neighbors on 10th & Bleeker',
        created_by: 'user-alice',
        created_at: new Date().toISOString(),
      },
    ],
  ]);

  const members = new Map<string, GroupMember>([
    [
      'group-village:user-alice',
      {
        group_id: 'group-village',
        user_id: 'user-alice',
        role: 'owner',
        push_enabled: true,
        joined_at: new Date().toISOString(),
      },
    ],
    [
      'group-village:user-bob',
      {
        group_id: 'group-village',
        user_id: 'user-bob',
        role: 'member',
        push_enabled: true,
        joined_at: new Date().toISOString(),
      },
    ],
  ]);

  const activities = new Map<string, Activity>([
    [
      'act-coffee',
      {
        id: 'act-coffee',
        group_id: 'group-village',
        name: 'Coffee Break',
        emoji: '☕',
        default_duration_mins: 30,
        created_at: new Date().toISOString(),
      },
    ],
  ]);

  const broadcasts = new Map<string, Broadcast>([
    [
      'bc-1',
      {
        id: 'bc-1',
        user_id: 'user-alice',
        group_id: 'group-village',
        activity_id: 'act-coffee',
        message: 'At Joe Coffee for the next hour!',
        expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
        status: 'active',
        created_at: new Date().toISOString(),
      },
    ],
  ]);

  const acknowledgments = new Map<string, Acknowledgment>();

  return { users, groups, members, activities, broadcasts, acknowledgments };
}

/**
 * Checks RLS permission: Is a user authorized to view broadcasts for a group?
 */
export function canUserViewBroadcast(
  db: DatabaseState,
  userId: string,
  broadcastId: string
): boolean {
  const broadcast = db.broadcasts.get(broadcastId);
  if (!broadcast) return false;
  return db.members.has(`${broadcast.group_id}:${userId}`);
}

/**
 * Acknowledges a broadcast with optimistic verification
 */
export function acknowledgeBroadcast(
  db: DatabaseState,
  userId: string,
  broadcastId: string
): { success: boolean; error?: string } {
  const broadcast = db.broadcasts.get(broadcastId);
  if (!broadcast) return { success: false, error: 'Broadcast not found' };
  if (!db.members.has(`${broadcast.group_id}:${userId}`)) {
    return { success: false, error: 'User is not a member of this group (RLS violation)' };
  }
  if (broadcast.status !== 'active') {
    return { success: false, error: 'Broadcast is not active' };
  }

  const key = `${broadcastId}:${userId}`;
  db.acknowledgments.set(key, {
    id: `ack-${Date.now()}`,
    broadcast_id: broadcastId,
    user_id: userId,
    created_at: new Date().toISOString(),
  });

  return { success: true };
}
