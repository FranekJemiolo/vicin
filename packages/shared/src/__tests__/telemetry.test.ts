import test from 'node:test';
import assert from 'node:assert/strict';

test('Telemetry & Toast Schema: Validates error severities', () => {
  const allowedSeverities = ['success', 'error', 'warning', 'info'] as const;
  type ToastType = (typeof allowedSeverities)[number];

  const createToastPayload = (type: ToastType, message: string) => {
    assert(message.length > 0, 'Message cannot be empty');
    assert(allowedSeverities.includes(type), 'Type must be a valid severity level');
    return {
      id: 'mock-id-123',
      type,
      message,
      timestamp: new Date().toISOString(),
    };
  };

  const successToast = createToastPayload('success', 'Broadcast active!');
  assert.equal(successToast.type, 'success');
  assert.equal(successToast.message, 'Broadcast active!');

  const errorToast = createToastPayload('error', 'Network failure while broadcasting');
  assert.equal(errorToast.type, 'error');
  assert.equal(errorToast.message, 'Network failure while broadcasting');

  assert.throws(() => {
    // @ts-expect-error invalid type check
    createToastPayload('critical', 'Failure');
  });
});

test('Telemetry: Error Boundary State Transition', () => {
  interface State {
    hasError: boolean;
    error: Error | null;
  }

  const getDerivedStateFromError = (error: Error): State => {
    return {
      hasError: true,
      error,
    };
  };

  const initialState: State = { hasError: false, error: null };
  const mockError = new Error('Database connection timed out');
  const errorState = getDerivedStateFromError(mockError);

  assert.equal(initialState.hasError, false);
  assert.equal(errorState.hasError, true);
  assert.equal(errorState.error?.message, 'Database connection timed out');
});
