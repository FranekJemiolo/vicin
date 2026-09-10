import test from 'node:test';
import assert from 'node:assert/strict';

interface LiveActivityAttributes {
  activityName: string;
  activityEmoji: string;
  groupName: string;
  authorName: string;
}

interface LiveActivityContentState {
  expiresAtTimestamp: number;
  acknowledgmentCount: number;
  status: 'active' | 'ended' | 'dismissed';
}

class MockLiveActivityController {
  private activeActivities = new Map<
    string,
    { attributes: LiveActivityAttributes; contentState: LiveActivityContentState }
  >();

  startActivity(
    id: string,
    attributes: LiveActivityAttributes,
    initialState: LiveActivityContentState
  ) {
    this.activeActivities.set(id, { attributes, contentState: initialState });
    return { activityId: id };
  }

  updateActivity(id: string, updatedState: Partial<LiveActivityContentState>) {
    const existing = this.activeActivities.get(id);
    if (!existing) throw new Error(`Activity ${id} not found`);
    existing.contentState = { ...existing.contentState, ...updatedState };
    this.activeActivities.set(id, existing);
  }

  endActivity(id: string) {
    const existing = this.activeActivities.get(id);
    if (existing) {
      existing.contentState.status = 'ended';
      this.activeActivities.set(id, existing);
    }
  }

  getActivity(id: string) {
    return this.activeActivities.get(id);
  }
}

test('LiveActivity: Starts iOS lock-screen activity with correct attributes', () => {
  const controller = new MockLiveActivityController();
  const expiresAt = Date.now() + 45 * 60 * 1000;

  controller.startActivity(
    'bc-101',
    {
      activityName: 'Coffee Break',
      activityEmoji: '☕',
      groupName: 'Oakwood Pod',
      authorName: 'Alex',
    },
    {
      expiresAtTimestamp: expiresAt,
      acknowledgmentCount: 0,
      status: 'active',
    }
  );

  const activity = controller.getActivity('bc-101');
  assert(activity);
  assert.equal(activity.attributes.activityName, 'Coffee Break');
  assert.equal(activity.attributes.activityEmoji, '☕');
  assert.equal(activity.contentState.acknowledgmentCount, 0);
  assert.equal(activity.contentState.status, 'active');
});

test('LiveActivity: Updates acknowledgment count and terminates smoothly', () => {
  const controller = new MockLiveActivityController();
  controller.startActivity(
    'bc-202',
    {
      activityName: 'Walk Dog',
      activityEmoji: '🐕',
      groupName: 'Building 4',
      authorName: 'Sarah',
    },
    {
      expiresAtTimestamp: Date.now() + 30 * 60 * 1000,
      acknowledgmentCount: 0,
      status: 'active',
    }
  );

  controller.updateActivity('bc-202', { acknowledgmentCount: 3 });
  assert.equal(controller.getActivity('bc-202')?.contentState.acknowledgmentCount, 3);

  controller.endActivity('bc-202');
  assert.equal(controller.getActivity('bc-202')?.contentState.status, 'ended');
});
