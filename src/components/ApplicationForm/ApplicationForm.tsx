import { FormEvent } from 'react';

import { ApplicationDraft, STATUSES } from '../../types/application';

type ApplicationFormProps = {
  draft: ApplicationDraft;
  editing: boolean;
  onCancel: () => void;
  onChange: (field: keyof ApplicationDraft, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function ApplicationForm({
  draft,
  editing,
  onCancel,
  onChange,
  onSubmit,
}: ApplicationFormProps) {
  return (
    <section className="card form-card">
      <div className="section-heading">
        <h2>{editing ? 'Edit application' : 'Add an application'}</h2>
        {editing && (
          <button className="link-button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
      <form onSubmit={onSubmit}>
        <label>
          Company
          <input
            required
            value={draft.company}
            onChange={(event) => onChange('company', event.target.value)}
            placeholder="e.g. Acme Inc."
          />
        </label>
        <label>
          Role
          <input
            required
            value={draft.role}
            onChange={(event) => onChange('role', event.target.value)}
            placeholder="e.g. Frontend Developer"
          />
        </label>
        <label>
          Status
          <select value={draft.status} onChange={(event) => onChange('status', event.target.value)}>
            {STATUSES.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
        <label>
          Location
          <input
            value={draft.location}
            onChange={(event) => onChange('location', event.target.value)}
            placeholder="Remote or city"
          />
        </label>
        <label>
          Job URL
          <input
            type="url"
            value={draft.jobUrl}
            onChange={(event) => onChange('jobUrl', event.target.value)}
            placeholder="https://…"
          />
        </label>
        <label>
          Applied date
          <input
            type="date"
            value={draft.appliedDate}
            onChange={(event) => onChange('appliedDate', event.target.value)}
          />
        </label>
        <label>
          Follow-up date
          <input
            type="date"
            value={draft.followUpDate}
            onChange={(event) => onChange('followUpDate', event.target.value)}
          />
        </label>
        <label className="wide">
          Notes
          <textarea
            value={draft.notes}
            onChange={(event) => onChange('notes', event.target.value)}
            placeholder="Follow-up date, contacts, preparation notes…"
            rows={2}
          />
        </label>
        <button className="primary-button" type="submit">
          {editing ? 'Save changes' : 'Add application'}
        </button>
      </form>
    </section>
  );
}
