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

export type FollowUpPriority = 'overdue' | 'today' | 'upcoming';

export function getTodayKey(currentDate = new Date()) {
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getFollowUpPriority(
  followUpDate: string,
  currentDate = new Date(),
): FollowUpPriority {
  const today = getTodayKey(currentDate);

  if (followUpDate < today) return 'overdue';
  if (followUpDate === today) return 'today';
  return 'upcoming';
}

export function getSnoozedFollowUpDate(days: number, currentDate = new Date()) {
  const date = new Date(currentDate);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return getTodayKey(date);
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
