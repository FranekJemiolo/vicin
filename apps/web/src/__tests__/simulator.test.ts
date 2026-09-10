import test from 'node:test';
import assert from 'node:assert/strict';

interface DemoBroadcast {
  id: string;
  name: string;
  emoji: string;
  activity: string;
  duration: string;
  note: string;
  timeRemaining: string;
  acks: number;
  userAcked: boolean;
}

test('Web Simulator: Creates and prepends a new broadcast correctly', () => {
  const initialBroadcasts: DemoBroadcast[] = [
    {
      id: '1',
      name: 'Bob Martinez',
      emoji: '☕',
      activity: 'Coffee Break',
      duration: '45m',
      note: 'In lobby',
      timeRemaining: '38m left',
      acks: 2,
      userAcked: false,
    },
  ];

  const newBroadcast: DemoBroadcast = {
    id: '2',
    name: 'You',
    emoji: '🍕',
    activity: 'Quick Lunch',
    duration: '30m',
    note: 'Grabbing slices nearby',
    timeRemaining: '30m left',
    acks: 0,
    userAcked: false,
  };

  const updatedFeed = [newBroadcast, ...initialBroadcasts];
  assert.equal(updatedFeed.length, 2);
  assert.equal(updatedFeed[0].name, 'You');
  assert.equal(updatedFeed[0].emoji, '🍕');
});

test('Web Simulator: Toggles acknowledgment and updates count', () => {
  const broadcast: DemoBroadcast = {
    id: 'bc-1',
    name: 'Alice',
    emoji: '🐕',
    activity: 'Dog Walk',
    duration: '30m',
    note: 'In park',
    timeRemaining: '15m left',
    acks: 1,
    userAcked: false,
  };

  const toggleAck = (b: DemoBroadcast): DemoBroadcast => ({
    ...b,
    userAcked: !b.userAcked,
    acks: b.userAcked ? b.acks - 1 : b.acks + 1,
  });

  const acked = toggleAck(broadcast);
  assert.equal(acked.userAcked, true);
  assert.equal(acked.acks, 2);

  const unacked = toggleAck(acked);
  assert.equal(unacked.userAcked, false);
  assert.equal(unacked.acks, 1);
});
