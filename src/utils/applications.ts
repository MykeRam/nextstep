import { starterApplications } from '../data/starterApplications';
import { Application, Status, StatusHistoryEntry } from '../types/application';

const STARTER_DATA_VERSION = '2';

export function loadApplications(): Application[] {
  try {
    const stored = localStorage.getItem('nextstep-applications');
    const storedApplications: Application[] = stored ? JSON.parse(stored) : [];
    const starterDataVersion = localStorage.getItem('nextstep-starter-data-version');

    if (starterDataVersion !== STARTER_DATA_VERSION) {
      localStorage.setItem('nextstep-starter-data-version', STARTER_DATA_VERSION);
      const storedIds = new Set(storedApplications.map((application) => application.id));
      return [...storedApplications, ...starterApplications.filter(({ id }) => !storedIds.has(id))];
    }

    return storedApplications;
  } catch {
    return starterApplications;
  }
}

export function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export function getStatusHistory(application: Application): StatusHistoryEntry[] {
  if (application.statusHistory?.length) return application.statusHistory;

  return [
    {
      status: application.status,
      changedAt: application.appliedDate ? `${application.appliedDate}T12:00:00.000Z` : '',
    },
  ];
}

export function createStatusHistoryEntry(status: Status): StatusHistoryEntry {
  return { status, changedAt: new Date().toISOString() };
}

export function formatTimestamp(timestamp: string) {
  if (!timestamp) return 'Date not recorded';

  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
