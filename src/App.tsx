import { FormEvent, useEffect, useMemo, useState } from 'react';

const STATUSES = ['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected'] as const;
type Status = (typeof STATUSES)[number];
type Application = { id: string; company: string; role: string; status: Status; location: string; appliedDate: string; followUpDate: string; notes: string };
type Draft = Omit<Application, 'id'>;

const emptyDraft: Draft = { company: '', role: '', status: 'Saved', location: '', appliedDate: '', followUpDate: '', notes: '' };
const starterApplications: Application[] = [
  { id: '1', company: 'Figma', role: 'Frontend Engineer', status: 'Interviewing', location: 'Remote', appliedDate: '2026-08-12', followUpDate: '2026-08-20', notes: 'Prepare for technical interview.' },
  { id: '2', company: 'Notion', role: 'Software Engineer', status: 'Applied', location: 'San Francisco, CA', appliedDate: '2026-08-10', followUpDate: '2026-08-19', notes: '' },
  { id: '3', company: 'Linear', role: 'Product Engineer', status: 'Saved', location: 'Remote', appliedDate: '', followUpDate: '', notes: 'Tailor résumé before applying.' },
];

function loadApplications(): Application[] {
  try { const stored = localStorage.getItem('nextstep-applications'); return stored ? JSON.parse(stored) : starterApplications; }
  catch { return starterApplications; }
}

export default function App() {
  const [applications, setApplications] = useState<Application[]>(loadApplications);
  const [statusFilter, setStatusFilter] = useState<'All' | Status>('All');
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => { localStorage.setItem('nextstep-applications', JSON.stringify(applications)); }, [applications]);
  const visibleApplications = useMemo(() => applications.filter((application) => {
    const matchesStatus = statusFilter === 'All' || application.status === statusFilter;
    const searchable = `${application.company} ${application.role} ${application.location}`.toLowerCase();
    return matchesStatus && searchable.includes(query.toLowerCase());
  }), [applications, query, statusFilter]);
  const statusCounts = Object.fromEntries(STATUSES.map((status) => [status, applications.filter((application) => application.status === status).length])) as Record<Status, number>;
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

  return <main className="app-shell">
    <header><div><p className="eyebrow">JOB APPLICATION COMMAND CENTER</p><h1>NextStep</h1><p className="subtitle">Keep your opportunities and next moves in one place.</p></div><div className="summary"><strong>{applications.length}</strong><span>applications</span></div></header>
    <section className="status-summary" aria-label="Application status summary">{STATUSES.map((status) => <article key={status}><strong>{statusCounts[status]}</strong><span>{status}</span></article>)}</section>
    <section className="card form-card"><div className="section-heading"><h2>{editingId ? 'Edit application' : 'Add an application'}</h2>{editingId && <button className="link-button" onClick={cancelEdit}>Cancel</button>}</div>
      <form onSubmit={saveApplication}>
        <label>Company<input required value={draft.company} onChange={(event) => updateDraft('company', event.target.value)} placeholder="e.g. Acme Inc." /></label>
        <label>Role<input required value={draft.role} onChange={(event) => updateDraft('role', event.target.value)} placeholder="e.g. Frontend Developer" /></label>
        <label>Status<select value={draft.status} onChange={(event) => updateDraft('status', event.target.value)}>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label>
        <label>Location<input value={draft.location} onChange={(event) => updateDraft('location', event.target.value)} placeholder="Remote or city" /></label>
        <label>Applied date<input type="date" value={draft.appliedDate} onChange={(event) => updateDraft('appliedDate', event.target.value)} /></label>
        <label>Follow-up date<input type="date" value={draft.followUpDate ?? ''} onChange={(event) => updateDraft('followUpDate', event.target.value)} /></label>
        <label className="wide">Notes<textarea value={draft.notes} onChange={(event) => updateDraft('notes', event.target.value)} placeholder="Follow-up date, contacts, preparation notes…" rows={2} /></label>
        <button className="primary-button" type="submit">{editingId ? 'Save changes' : 'Add application'}</button>
      </form>
    </section>
    <section className="card applications-card"><div className="toolbar"><div><h2>Applications</h2><p>{visibleApplications.length} shown</p></div><div className="filters"><input aria-label="Search applications" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" /><select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'All' | Status)}><option>All</option>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select></div></div>
      {visibleApplications.length === 0 ? <p className="empty-state">No applications match those filters.</p> : <ul className="application-list">{visibleApplications.map((application) => <li key={application.id}><div><strong>{application.role}</strong><span>{application.company}{application.location && ` · ${application.location}`}</span>{application.followUpDate && <small className="follow-up">Follow up {new Date(`${application.followUpDate}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</small>}{application.notes && <small>{application.notes}</small>}</div><span className={`status ${application.status.toLowerCase()}`}>{application.status}</span><time>{application.appliedDate ? `Applied ${new Date(`${application.appliedDate}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}` : 'Not applied yet'}</time><div className="row-actions"><button onClick={() => editApplication(application)}>Edit</button><button className="delete-button" onClick={() => deleteApplication(application.id)}>Delete</button></div></li>)}</ul>}
    </section>
  </main>;
}
