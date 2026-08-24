import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { applicationFixture } from '../../test/applicationFixture';
import { FollowUps } from './FollowUps';

describe('FollowUps', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-24T12:00:00'));
  });

  afterEach(() => vi.useRealTimers());

  it('labels the priority and supports complete, snooze, and edit actions', () => {
    const onComplete = vi.fn();
    const onEdit = vi.fn();
    const onSnooze = vi.fn();

    render(
      <FollowUps
        applications={[applicationFixture]}
        onComplete={onComplete}
        onEdit={onEdit}
        onSnooze={onSnooze}
      />,
    );

    expect(screen.getByText('Upcoming · Aug 27')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Complete follow-up for Acme Inc.' }));
    fireEvent.change(screen.getByLabelText('Snooze follow-up for Acme Inc.'), {
      target: { value: '3' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

    expect(onComplete).toHaveBeenCalledWith(applicationFixture.id);
    expect(onSnooze).toHaveBeenCalledWith(applicationFixture.id, 3);
    expect(onEdit).toHaveBeenCalledWith(applicationFixture);
  });
});
