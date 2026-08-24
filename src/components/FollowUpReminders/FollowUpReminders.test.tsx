import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { applicationFixture } from '../../test/applicationFixture';
import { FollowUpReminders } from './FollowUpReminders';

describe('FollowUpReminders', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-24T12:00:00'));
  });

  afterEach(() => vi.useRealTimers());

  it('shows due-today reminders with complete and snooze actions', () => {
    const onComplete = vi.fn();
    const onSnooze = vi.fn();
    const dueTodayApplication = { ...applicationFixture, followUpDate: '2026-08-24' };

    render(
      <FollowUpReminders
        applications={[dueTodayApplication]}
        onComplete={onComplete}
        onEdit={vi.fn()}
        onSnooze={onSnooze}
      />,
    );

    expect(screen.getByText('Due today')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Complete follow-up for Acme Inc.' }));
    fireEvent.change(screen.getByLabelText('Snooze follow-up for Acme Inc.'), {
      target: { value: '7' },
    });

    expect(onComplete).toHaveBeenCalledWith(applicationFixture.id);
    expect(onSnooze).toHaveBeenCalledWith(applicationFixture.id, 7);
  });
});
