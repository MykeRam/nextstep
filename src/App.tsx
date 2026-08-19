import { FormEvent, useEffect, useMemo, useState } from 'react';

import { ApplicationForm } from './components/ApplicationForm/ApplicationForm';
import { AppHeader } from './components/AppHeader/AppHeader';
import { DashboardInsights } from './components/DashboardInsights/DashboardInsights';
import { AppFooter } from './components/AppFooter/AppFooter';
import { Applications } from './components/Applications/Applications';
import { AuthPanel } from './components/AuthPanel/AuthPanel';
import { FollowUps } from './components/FollowUps/FollowUps';
import { FollowUpReminders } from './components/FollowUpReminders/FollowUpReminders';
import { LandingPage } from './components/LandingPage/LandingPage';
import { StatusSummary } from './components/StatusSummary/StatusSummary';
import { emptyDraft } from './data/starterApplications';
import { useAuth } from './hooks/useAuth';
import {
  deleteCloudApplication,
  fetchCloudApplications,
  seedCloudApplications,
  upsertCloudApplication,
} from './services/applications';
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
  const { isConfigured, loading, sendMagicLink, signOut, user } = useAuth();
  const [applications, setApplications] = useState<Application[]>(loadApplications);
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('followUp');
  const [view, setView] = useState<View>('list');
  const [draft, setDraft] = useState<ApplicationDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [cloudSyncing, setCloudSyncing] = useState(false);
  const [syncError, setSyncError] = useState('');
  // Temporary preview mode: replay the entrance sequence on every signed-in refresh.
  const shouldPlayDashboardEntrance = Boolean(user);

  useEffect(() => {
    localStorage.setItem('nextstep-applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    if (!user) {
      setCloudSyncing(false);
      setSyncError('');
      return;
    }

    const userId = user.id;
    let active = true;

    async function syncCloudApplications() {
      setCloudSyncing(true);
      const { applications: cloudApplications, error } = await fetchCloudApplications(userId);

      if (!active) return;

      if (error) {
        setSyncError(error);
      } else if (cloudApplications.length > 0) {
        setApplications(cloudApplications);
      } else {
        const migrationError = await seedCloudApplications(applications, userId);
        if (active && migrationError) setSyncError(migrationError);
      }

      if (active) setCloudSyncing(false);
    }

    void syncCloudApplications();

    return () => {
      active = false;
    };
  }, [user?.id]);

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

    const applicationToSave = { ...draft, id: editingId ?? crypto.randomUUID() };

    if (editingId) {
      setApplications((current) =>
        current.map((application) =>
          application.id === editingId ? applicationToSave : application,
        ),
      );
    } else {
      setApplications((current) => [applicationToSave, ...current]);
    }

    if (user) {
      void upsertCloudApplication(applicationToSave, user.id).then((error) =>
        setSyncError(error ?? ''),
      );
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

    if (user) {
      void deleteCloudApplication(id).then((error) => setSyncError(error ?? ''));
    }
  }

  function updateApplicationStatus(id: string, status: Status) {
    const updatedApplication = applications.find((application) => application.id === id);
    setApplications((current) =>
      current.map((application) =>
        application.id === id ? { ...application, status } : application,
      ),
    );

    if (user && updatedApplication) {
      void upsertCloudApplication({ ...updatedApplication, status }, user.id).then((error) =>
        setSyncError(error ?? ''),
      );
    }
  }

  function filterByStatus(status: Status) {
    setStatusFilter((current) => (current === status ? 'All' : status));
    setView('list');
  }

  if (loading) {
    return (
      <main className="landing-shell landing-shell_loading">
        <p>Checking your secure session…</p>
      </main>
    );
  }

  if (!user) {
    return <LandingPage isConfigured={isConfigured} onSendMagicLink={sendMagicLink} />;
  }

  return (
    <main className={`app-shell${shouldPlayDashboardEntrance ? ' dashboard-entrance' : ''}`}>
      <div className="dashboard-stage dashboard-stage_header">
        <AppHeader applicationCount={applications.length} />
      </div>
      <div
        className="dashboard-stage dashboard-stage_account"
        style={{ '--entrance-order': 8 } as React.CSSProperties}
      >
        <AuthPanel
          isConfigured={isConfigured}
          loading={loading}
          onSendMagicLink={sendMagicLink}
          onSignOut={signOut}
          shouldAnimate={shouldPlayDashboardEntrance}
          syncError={syncError}
          syncing={cloudSyncing}
          user={user}
        />
      </div>
      <div className="dashboard-stage" style={{ '--entrance-order': 1 } as React.CSSProperties}>
        <StatusSummary
          activeStatus={statusFilter}
          statusCounts={statusCounts}
          onFilter={filterByStatus}
        />
      </div>
      <div className="dashboard-stage" style={{ '--entrance-order': 2 } as React.CSSProperties}>
        <DashboardInsights applications={applications} onEdit={editApplication} />
      </div>
      <div className="dashboard-stage" style={{ '--entrance-order': 3 } as React.CSSProperties}>
        <FollowUpReminders applications={upcomingFollowUps} onEdit={editApplication} />
      </div>
      <div className="dashboard-stage" style={{ '--entrance-order': 4 } as React.CSSProperties}>
        <FollowUps applications={upcomingFollowUps} onEdit={editApplication} />
      </div>
      <div className="dashboard-stage" style={{ '--entrance-order': 5 } as React.CSSProperties}>
        <ApplicationForm
          draft={draft}
          editing={Boolean(editingId)}
          onCancel={cancelEdit}
          onChange={updateDraft}
          onSubmit={saveApplication}
        />
      </div>
      <div className="dashboard-stage" style={{ '--entrance-order': 6 } as React.CSSProperties}>
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
      </div>
      <div className="dashboard-stage" style={{ '--entrance-order': 7 } as React.CSSProperties}>
        <AppFooter />
      </div>
    </main>
  );
}
