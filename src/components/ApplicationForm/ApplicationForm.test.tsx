import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { applicationDraftFixture } from '../../test/applicationFixture';
import { ApplicationForm } from './ApplicationForm';

describe('ApplicationForm', () => {
  it('reports field changes and submits an application', () => {
    const onChange = vi.fn();
    const onSubmit = vi.fn();

    render(
      <ApplicationForm
        draft={applicationDraftFixture}
        editing={false}
        onCancel={vi.fn()}
        onChange={onChange}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(screen.getByLabelText('Company'), { target: { value: 'Updated Acme' } });
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'Interviewing' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Add application' }).closest('form')!);

    expect(onChange).toHaveBeenCalledWith('company', 'Updated Acme');
    expect(onChange).toHaveBeenCalledWith('status', 'Interviewing');
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
