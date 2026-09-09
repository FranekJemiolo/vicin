import { addMinutes, isAfter, parseISO } from 'date-fns';

/**
 * Computes an expiration ISO timestamp in UTC given a duration in minutes.
 */
export function calculateExpiration(durationMins: number, baseDate: Date = new Date()): string {
  return addMinutes(baseDate, durationMins).toISOString();
}

/**
 * Checks whether a broadcast ISO expiration timestamp is still active.
 */
export function isBroadcastActive(expiresAt: string, now: Date = new Date()): boolean {
  try {
    const expiry = parseISO(expiresAt);
    return isAfter(expiry, now);
  } catch {
    return false;
  }
}

/**
 * Returns remaining seconds until expiration, clamped to 0.
 */
export function getRemainingSeconds(expiresAt: string, now: Date = new Date()): number {
  try {
    const expiry = parseISO(expiresAt);
    const diff = Math.floor((expiry.getTime() - now.getTime()) / 1000);
    return Math.max(0, diff);
  } catch {
    return 0;
  }
}

/**
 * Formats countdown string: e.g. "45m left", "2m 30s", "Expired".
 */
export function formatCountdown(expiresAt: string, now: Date = new Date()): string {
  const remainingSeconds = getRemainingSeconds(expiresAt, now);
  if (remainingSeconds <= 0) {
    return 'Expired';
  }

  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}
