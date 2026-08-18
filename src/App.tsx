import { FormEvent, useEffect, useMemo, useState } from 'react';

const STATUSES = ['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected'] as const;
type Status = (typeof STATUSES)[number];
type Application = { id: string; company: string; role: string; status: Status; location: string; jobUrl: string; appliedDate: string; followUpDate: string; notes: string };
type Draft = Omit<Application, 'id'>;

const emptyDraft: Draft = { company: '', role: '', status: 'Saved', location: '', jobUrl: '', appliedDate: '', followUpDate: '', notes: '' };
const starterApplications: Application[] = [
  { id: '1', company: 'Figma', role: 'Frontend Engineer', status: 'Interviewing', location: 'Remote', jobUrl: 'https://www.figma.com/careers/', appliedDate: '2026-08-12', followUpDate: '2026-08-20', notes: 'Prepare for technical interview.' },
  { id: '2', company: 'Notion', role: 'Software Engineer', status: 'Applied', location: 'San Francisco, CA', jobUrl: 'https://www.notion.com/careers', appliedDate: '2026-08-10', followUpDate: '2026-08-19', notes: '' },
  { id: '3', company: 'Linear', role: 'Product Engineer', status: 'Saved', location: 'Remote', jobUrl: 'https://linear.app/careers', appliedDate: '', followUpDate: '', notes: 'Tailor résumé before applying.' },
];

function loadApplications(): Application[] {
  try { const stored = localStorage.getItem('nextstep-applications'); return stored ? JSON.parse(stored) : starterApplications; }
  catch { return starterApplications; }
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function App() {
  const [applications, setApplications] = useState<Application[]>(loadApplications);
  const [statusFilter, setStatusFilter] = useState<'All' | Status>('All');
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'list' | 'board'>('list');
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => { localStorage.setItem('nextstep-applications', JSON.stringify(applications)); }, [applications]);
  const visibleApplications = useMemo(() => applications.filter((application) => {
    const matchesStatus = statusFilter === 'All' || application.status === statusFilter;
    const searchable = `${application.company} ${application.role} ${application.location}`.toLowerCase();
    return matchesStatus && searchable.includes(query.toLowerCase());
  }), [applications, query, statusFilter]);
  const statusCounts = Object.fromEntries(STATUSES.map((status) => [status, applications.filter((application) => application.status === status).length])) as Record<Status, number>;
  const boardStatuses = statusFilter === 'All' ? STATUSES : [statusFilter];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingFollowUps = useMemo(() => applications
    .filter((application) => application.followUpDate && !['Offer', 'Rejected'].includes(application.status))
    .sort((first, second) => first.followUpDate.localeCompare(second.followUpDate)), [applications]);
  const updateDraft = (field: keyof Draft, value: string) => setDraft((current) => ({ ...current, [field]: value }));

  function saveApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.company.trim() || !draft.role.trim()) return;
    if (editingId) setApplications((current) => current.map((application) => application.id === editingId ? { ...draft, id: editingId } : application));
    else setApplications((current) => [{ ...draft, id: crypto.randomUUID() }, ...current]);
    setDraft(emptyDraft); setEditingId(null);
  }
  function editApplication(application: Application) { const { id, ...applicationDraft } = application; setDraft(applicationDraft); setEditingId(id); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function cancelEdit() { setDraft(emptyDraft); setEditingId(null); }
  function deleteApplication(id: string) { setApplications((current) => current.filter((application) => application.id !== id)); if (editingId === id) cancelEdit(); }
  function updateApplicationStatus(id: string, status: Status) { setApplications((current) => current.map((application) => application.id === id ? { ...application, status } : application)); }
  function filterByStatus(status: Status) { setStatusFilter((current) => current === status ? 'All' : status); setView('list'); }

  return <main className="app-shell">
    <header><div><p className="eyebrow">JOB APPLICATION COMMAND CENTER</p><h1>NextStep</h1><p className="subtitle">Keep your opportunities and next moves in one place.</p></div><div className="summary"><strong>{applications.length}</strong><span>applications</span></div></header>
    <section className="status-summary" aria-label="Application status summary">{STATUSES.map((status) => <button key={status} className={statusFilter === status ? 'active' : ''} aria-pressed={statusFilter === status} onClick={() => filterByStatus(status)}><strong>{statusCounts[status]}</strong><span>{status}</span></button>)}</section>
    <section className="card follow-ups-card" aria-labelledby="follow-ups-title"><div className="section-heading"><div><h2 id="follow-ups-title">Upcoming follow-ups</h2><p>Keep your next action in view.</p></div><span className="follow-up-count">{upcomingFollowUps.length} scheduled</span></div>
      {upcomingFollowUps.length === 0 ? <p className="empty-state">No follow-ups scheduled yet.</p> : <ul className="follow-ups-list">{upcomingFollowUps.map((application) => { const overdue = new Date(`${application.followUpDate}T00:00:00`) < today; return <li key={application.id}><div><strong>{application.company}</strong><span>{application.role}</span></div><time className={overdue ? 'overdue' : ''}>{overdue ? `Overdue · ${formatDate(application.followUpDate)}` : formatDate(application.followUpDate)}</time><button onClick={() => editApplication(application)}>Edit</button></li>; })}</ul>}
    </section>
    <section className="card form-card"><div className="section-heading"><h2>{editingId ? 'Edit application' : 'Add an application'}</h2>{editingId && <button className="link-button" onClick={cancelEdit}>Cancel</button>}</div>
      <form onSubmit={saveApplication}>
        <label>Company<input required value={draft.company} onChange={(event) => updateDraft('company', event.target.value)} placeholder="e.g. Acme Inc." /></label>
        <label>Role<input required value={draft.role} onChange={(event) => updateDraft('role', event.target.value)} placeholder="e.g. Frontend Developer" /></label>
        <label>Status<select value={draft.status} onChange={(event) => updateDraft('status', event.target.value)}>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label>
        <label>Location<input value={draft.location} onChange={(event) => updateDraft('location', event.target.value)} placeholder="Remote or city" /></label>
        <label>Job URL<input type="url" value={draft.jobUrl ?? ''} onChange={(event) => updateDraft('jobUrl', event.target.value)} placeholder="https://…" /></label>
        <label>Applied date<input type="date" value={draft.appliedDate} onChange={(event) => updateDraft('appliedDate', event.target.value)} /></label>
        <label>Follow-up date<input type="date" value={draft.followUpDate ?? ''} onChange={(event) => updateDraft('followUpDate', event.target.value)} /></label>
        <label className="wide">Notes<textarea value={draft.notes} onChange={(event) => updateDraft('notes', event.target.value)} placeholder="Follow-up date, contacts, preparation notes…" rows={2} /></label>
        <button className="primary-button" type="submit">{editingId ? 'Save changes' : 'Add application'}</button>
      </form>
    </section>
    <section className="card applications-card"><div className="toolbar"><div><h2>Applications</h2><p>{visibleApplications.length} shown</p></div><div className="filters"><input aria-label="Search applications" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" /><select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'All' | Status)}><option>All</option>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select><div className="view-toggle" aria-label="Application view"><button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>List</button><button className={view === 'board' ? 'active' : ''} onClick={() => setView('board')}>Board</button></div></div></div>
      {visibleApplications.length === 0 ? <p className="empty-state">No applications match those filters.</p> : view === 'list' ? <ul className="application-list">{visibleApplications.map((application) => <li key={application.id}><div><strong>{application.role}</strong><span>{application.company}{application.location && ` · ${application.location}`}</span>{application.jobUrl && <a className="job-link" href={application.jobUrl} target="_blank" rel="noreferrer">Open job post ↗</a>}{application.followUpDate && <small className="follow-up">Follow up {formatDate(application.followUpDate)}</small>}{application.notes && <small>{application.notes}</small>}</div><select className={`status status-select ${application.status.toLowerCase()}`} aria-label={`Update status for ${application.company}`} value={application.status} onChange={(event) => updateApplicationStatus(application.id, event.target.value as Status)}>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select><time>{application.appliedDate ? `Applied ${formatDate(application.appliedDate)}` : 'Not applied yet'}</time><div className="row-actions"><button onClick={() => editApplication(application)}>Edit</button><button className="delete-button" onClick={() => deleteApplication(application.id)}>Delete</button></div></li>)}</ul> : <div className="board-view">{boardStatuses.map((status) => { const applicationsInStage = visibleApplications.filter((application) => application.status === status); return <section className="board-column" key={status}><div className="board-column-heading"><strong>{status}</strong><span>{applicationsInStage.length}</span></div>{applicationsInStage.length === 0 ? <p>No applications</p> : applicationsInStage.map((application) => <article className="board-card" key={application.id}><strong>{application.role}</strong><span>{application.company}</span>{application.jobUrl && <a className="job-link" href={application.jobUrl} target="_blank" rel="noreferrer">Open job post ↗</a>}{application.followUpDate && <small>Follow up {formatDate(application.followUpDate)}</small>}<select aria-label={`Update status for ${application.company}`} value={application.status} onChange={(event) => updateApplicationStatus(application.id, event.target.value as Status)}>{STATUSES.map((stage) => <option key={stage}>{stage}</option>)}</select></article>)}</section>; })}</div>}
    </section>
  </main>;
}
