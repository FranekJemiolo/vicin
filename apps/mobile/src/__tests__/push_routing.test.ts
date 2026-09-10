import test from 'node:test';
import assert from 'node:assert/strict';

test('Push Routing: Resolves deep-link targets from notification payloads', () => {
  interface NotificationData {
    url?: string;
    broadcastId?: string;
    inviteToken?: string;
  }

  const resolveRoute = (data: NotificationData) => {
    if (data.inviteToken) {
      return { screen: 'AcceptInviteModal', params: { token: data.inviteToken } };
    }
    if (data.broadcastId) {
      return { screen: 'FeedScreen', params: { broadcastId: data.broadcastId } };
    }
    if (data.url && data.url.startsWith('vicin://invite/')) {
      const token = data.url.replace('vicin://invite/', '');
      return { screen: 'AcceptInviteModal', params: { token } };
    }
    return { screen: 'FeedScreen', params: {} };
  };

  const invitePayload = resolveRoute({ inviteToken: 'inv_12345' });
  assert.equal(invitePayload.screen, 'AcceptInviteModal');
  assert.equal(invitePayload.params.token, 'inv_12345');

  const broadcastPayload = resolveRoute({ broadcastId: 'bc-999' });
  assert.equal(broadcastPayload.screen, 'FeedScreen');
  assert.equal(broadcastPayload.params.broadcastId, 'bc-999');

  const urlPayload = resolveRoute({ url: 'vicin://invite/deep_token_abc' });
  assert.equal(urlPayload.screen, 'AcceptInviteModal');
  assert.equal(urlPayload.params.token, 'deep_token_abc');
});
