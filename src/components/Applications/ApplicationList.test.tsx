import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { applicationFixture } from '../../test/applicationFixture';
import { ApplicationList } from './ApplicationList';

describe('ApplicationList', () => {
  it('exposes details and application actions for a listed role', () => {
    const onDelete = vi.fn();
    const onEdit = vi.fn();
    const onStatusChange = vi.fn();
    const onViewDetails = vi.fn();

    render(
      <ApplicationList
        applications={[applicationFixture]}
        onDelete={onDelete}
        onEdit={onEdit}
        onStatusChange={onStatusChange}
        onViewDetails={onViewDetails}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Details' }));
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    fireEvent.change(screen.getByLabelText('Update status for Acme Inc.'), {
      target: { value: 'Interviewing' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(onViewDetails).toHaveBeenCalledWith(applicationFixture);
    expect(onEdit).toHaveBeenCalledWith(applicationFixture);
    expect(onStatusChange).toHaveBeenCalledWith(applicationFixture.id, 'Interviewing');
    expect(onDelete).toHaveBeenCalledWith(applicationFixture.id);
  });
});
