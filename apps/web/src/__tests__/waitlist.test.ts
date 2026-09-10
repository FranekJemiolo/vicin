import test from 'node:test';
import assert from 'node:assert/strict';

test('Waitlist: Validates email pattern and parses circle location', () => {
  const validateWaitlistEntry = (email: string, circle: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
    return {
      email: email.trim().toLowerCase(),
      circleName: circle.trim() || 'General Neighborhood',
      submittedAt: new Date().toISOString(),
    };
  };

  const valid = validateWaitlistEntry('alex@neighborhood.org', 'Oakwood B4');
  assert.equal(valid.email, 'alex@neighborhood.org');
  assert.equal(valid.circleName, 'Oakwood B4');

  const defaultCircle = validateWaitlistEntry('sarah@domain.com', '');
  assert.equal(defaultCircle.circleName, 'General Neighborhood');

  assert.throws(() => validateWaitlistEntry('invalid-email-string', 'NYC'));
});
