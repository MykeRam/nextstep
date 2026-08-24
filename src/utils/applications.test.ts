import { applicationFixture } from '../test/applicationFixture';
import { describe, expect, it } from 'vitest';
import { getStatusHistory } from './applications';

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
