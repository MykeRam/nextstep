import { Application, ApplicationDraft } from '../types/application';

export const applicationFixture: Application = {
  id: 'application-1',
  company: 'Acme Inc.',
  role: 'Frontend Developer',
  status: 'Applied',
  location: 'Remote',
  jobUrl: 'https://example.com/jobs/frontend-developer',
  appliedDate: '2026-08-20',
  followUpDate: '2026-08-27',
  notes: 'Ask about the design system and frontend platform team.',
  statusHistory: [
    { status: 'Saved', changedAt: '2026-08-18T12:00:00.000Z' },
    { status: 'Applied', changedAt: '2026-08-20T12:00:00.000Z' },
  ],
};

export const applicationDraftFixture: ApplicationDraft = {
  company: applicationFixture.company,
  role: applicationFixture.role,
  status: applicationFixture.status,
  location: applicationFixture.location,
  jobUrl: applicationFixture.jobUrl,
  appliedDate: applicationFixture.appliedDate,
  followUpDate: applicationFixture.followUpDate,
  notes: applicationFixture.notes,
};
