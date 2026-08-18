import { FormEvent, useEffect, useMemo, useState } from 'react';

import { ApplicationForm } from './components/ApplicationForm/ApplicationForm';
import { AppHeader } from './components/AppHeader/AppHeader';
import { Applications } from './components/Applications/Applications';
import { FollowUps } from './components/FollowUps/FollowUps';
import { StatusSummary } from './components/StatusSummary/StatusSummary';
import { emptyDraft } from './data/starterApplications';
import {
  Application,
  ApplicationDraft,
  SortOption,
  STATUSES,
  Status,
  View,
} from './types/application';
import { loadApplications } from './utils/applications';

export default function App() {
  const [applications, setApplications] = useState<Application[]>(loadApplications);
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('followUp');
  const [view, setView] = useState<View>('list');
  const [draft, setDraft] = useState<ApplicationDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('nextstep-applications', JSON.stringify(applications));
  }, [applications]);

  const visibleApplications = useMemo(
    () =>
      applications
        .filter((application) => {
          const matchesStatus = statusFilter === 'All' || application.status === statusFilter;
          const searchable =
            `${application.company} ${application.role} ${application.location}`.toLowerCase();
          return matchesStatus && searchable.includes(query.toLowerCase());
        })
        .sort((first, second) => {
          if (sortBy === 'company') return first.company.localeCompare(second.company);
          if (sortBy === 'appliedDate') {
            return (second.appliedDate || '').localeCompare(first.appliedDate || '');
          }
          return (first.followUpDate || '9999-12-31').localeCompare(
            second.followUpDate || '9999-12-31',
          );
        }),
    [applications, query, sortBy, statusFilter],
  );

  const statusCounts = Object.fromEntries(
    STATUSES.map((status) => [
      status,
      applications.filter((application) => application.status === status).length,
    ]),
  ) as Record<Status, number>;

  const upcomingFollowUps = useMemo(
    () =>
      applications
        .filter(
          (application) =>
            application.followUpDate && !['Offer', 'Rejected'].includes(application.status),
        )
        .sort((first, second) => first.followUpDate.localeCompare(second.followUpDate)),
    [applications],
  );

  const boardStatuses = statusFilter === 'All' ? STATUSES : [statusFilter];

  function updateDraft(field: keyof ApplicationDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function saveApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.company.trim() || !draft.role.trim()) return;

    if (editingId) {
      setApplications((current) =>
        current.map((application) =>
          application.id === editingId ? { ...draft, id: editingId } : application,
        ),
      );
    } else {
      setApplications((current) => [{ ...draft, id: crypto.randomUUID() }, ...current]);
    }

    setDraft(emptyDraft);
    setEditingId(null);
  }

  function editApplication(application: Application) {
    const { id, ...applicationDraft } = application;
    setDraft(applicationDraft);
    setEditingId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setDraft(emptyDraft);
    setEditingId(null);
  }

  function deleteApplication(id: string) {
    setApplications((current) => current.filter((application) => application.id !== id));
    if (editingId === id) cancelEdit();
  }

  function updateApplicationStatus(id: string, status: Status) {
    setApplications((current) =>
      current.map((application) =>
        application.id === id ? { ...application, status } : application,
      ),
    );
  }

  function filterByStatus(status: Status) {
    setStatusFilter((current) => (current === status ? 'All' : status));
    setView('list');
  }

  return (
    <main className="app-shell">
      <AppHeader applicationCount={applications.length} />
      <StatusSummary
        activeStatus={statusFilter}
        statusCounts={statusCounts}
        onFilter={filterByStatus}
      />
      <FollowUps applications={upcomingFollowUps} onEdit={editApplication} />
      <ApplicationForm
        draft={draft}
        editing={Boolean(editingId)}
        onCancel={cancelEdit}
        onChange={updateDraft}
        onSubmit={saveApplication}
      />
      <Applications
        applications={visibleApplications}
        boardStatuses={boardStatuses}
        query={query}
        sortBy={sortBy}
        statusFilter={statusFilter}
        view={view}
        onDelete={deleteApplication}
        onEdit={editApplication}
        onQueryChange={setQuery}
        onSortChange={setSortBy}
        onStatusChange={updateApplicationStatus}
        onStatusFilterChange={setStatusFilter}
        onViewChange={setView}
      />
    </main>
  );
}
