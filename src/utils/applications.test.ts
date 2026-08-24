import { applicationFixture } from '../test/applicationFixture';
import { describe, expect, it } from 'vitest';
import { getFollowUpPriority, getSnoozedFollowUpDate, getStatusHistory } from './applications';

describe('getStatusHistory', () => {
  it('returns the saved timeline when it exists', () => {
    expect(getStatusHistory(applicationFixture)).toEqual(applicationFixture.statusHistory);
  });

  it('creates a sensible timeline entry for older saved applications', () => {
    const { statusHistory, ...applicationWithoutHistory } = applicationFixture;

    expect(getStatusHistory(applicationWithoutHistory)).toEqual([
      { status: 'Applied', changedAt: '2026-08-20T12:00:00.000Z' },
    ]);
  });
});

describe('follow-up helpers', () => {
  const today = new Date('2026-08-24T12:00:00');

  it('labels overdue, due-today, and upcoming follow-ups', () => {
    expect(getFollowUpPriority('2026-08-23', today)).toBe('overdue');
    expect(getFollowUpPriority('2026-08-24', today)).toBe('today');
    expect(getFollowUpPriority('2026-08-25', today)).toBe('upcoming');
  });

  it('calculates a snoozed date from today', () => {
    expect(getSnoozedFollowUpDate(3, today)).toBe('2026-08-27');
  });
});
