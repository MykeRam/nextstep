import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { applicationFixture } from '../../test/applicationFixture';
import { ApplicationDetailModal } from './ApplicationDetailModal';

describe('ApplicationDetailModal', () => {
  it('shows full application details and closes with Escape', () => {
    const onClose = vi.fn();

    render(
      <ApplicationDetailModal
        application={applicationFixture}
        onClose={onClose}
        onEdit={vi.fn()}
      />,
    );

    expect(screen.getByRole('dialog')).toHaveTextContent('Frontend Developer');
    expect(screen.getByText(applicationFixture.notes)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open job post ↗' })).toHaveAttribute(
      'href',
      applicationFixture.jobUrl,
    );
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getAllByText('Applied')).toHaveLength(3);

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
