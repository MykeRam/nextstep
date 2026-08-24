import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SaveConfirmation } from './SaveConfirmation';

describe('SaveConfirmation', () => {
  it('announces a successful update and supports its exit state', () => {
    const { rerender } = render(
      <SaveConfirmation exiting={false} message="Application updated." />,
    );

    expect(screen.getByRole('status')).toHaveTextContent('Application updated.');

    rerender(<SaveConfirmation exiting message="Application updated." />);

    expect(screen.getByRole('status')).toHaveClass('save-confirmation_exiting');
  });
});
