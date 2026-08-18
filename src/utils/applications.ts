import { starterApplications } from '../data/starterApplications';
import { Application } from '../types/application';

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
