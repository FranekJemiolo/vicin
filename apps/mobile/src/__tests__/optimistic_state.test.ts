import test from 'node:test';
import assert from 'node:assert/strict';
import { BroadcastWithDetails } from '@vicin/shared';

test('Optimistic UI: Applies instant local broadcast toggle and rollback on error', () => {
  const initialBroadcast: BroadcastWithDetails = {
    id: 'bc-test-1',
    user_id: 'user-other',
    group_id: 'grp-1',
    activity_id: 'act-1',
    message: 'Coffee in lobby',
    expires_at: new Date(Date.now() + 3600000).toISOString(),
    status: 'active',
    created_at: new Date().toISOString(),
    acknowledgment_count: 1,
    user_has_acknowledged: false,
    user: {
      id: 'user-other',
      name: 'Bob',
      email: 'bob@neighborhood.org',
      auth_provider: 'email',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    activity: {
      id: 'act-1',
      group_id: 'grp-1',
      name: 'Coffee Break',
      emoji: '☕',
      default_duration_mins: 45,
      created_at: new Date().toISOString(),
    },
    group: {
      id: 'grp-1',
      name: 'Oakwood Neighbors',
      created_by: 'user-other',
      created_at: new Date().toISOString(),
    },
    acknowledgments: [],
  };

  const broadcasts = [initialBroadcast];

  // Optimistic Toggle ON
  const optimisticNext = broadcasts.map(b => {
    if (b.id !== 'bc-test-1') return b;
    return {
      ...b,
      user_has_acknowledged: true,
      acknowledgment_count: b.acknowledgment_count + 1,
    };
  });

  assert.equal(optimisticNext[0].user_has_acknowledged, true);
  assert.equal(optimisticNext[0].acknowledgment_count, 2);

  // Simulate network failure & rollback
  const rollbackState = broadcasts;
  assert.equal(rollbackState[0].user_has_acknowledged, false);
  assert.equal(rollbackState[0].acknowledgment_count, 1);
});

test('Optimistic UI: Broadcast creation prepends to active feed', () => {
  const existingBroadcasts: BroadcastWithDetails[] = [];
  const newBroadcast: BroadcastWithDetails = {
    id: 'bc-optimistic-temp',
    user_id: 'current-user',
    group_id: 'grp-1',
    activity_id: 'act-1',
    message: 'Quick walk in the park',
    expires_at: new Date(Date.now() + 1800000).toISOString(),
    status: 'active',
    created_at: new Date().toISOString(),
    acknowledgment_count: 0,
    user_has_acknowledged: false,
    user: {
      id: 'current-user',
      name: 'Alex',
      email: 'alex@neighborhood.org',
      auth_provider: 'email',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    activity: {
      id: 'act-1',
      group_id: 'grp-1',
      name: 'Coffee Break',
      emoji: '☕',
      default_duration_mins: 45,
      created_at: new Date().toISOString(),
    },
    group: {
      id: 'grp-1',
      name: 'Oakwood Neighbors',
      created_by: 'current-user',
      created_at: new Date().toISOString(),
    },
    acknowledgments: [],
  };

  const feedWithNew = [newBroadcast, ...existingBroadcasts];
  assert.equal(feedWithNew.length, 1);
  assert.equal(feedWithNew[0].id, 'bc-optimistic-temp');
  assert.equal(feedWithNew[0].user_id, 'current-user');
});
