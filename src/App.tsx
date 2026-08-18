type Status = 'Saved' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';

type Application = {
  company: string;
  role: string;
  status: Status;
  location: string;
  applied: string;
  initials: string;
  color: string;
};

const applications: Application[] = [
  { company: 'Figma', role: 'Frontend Engineer', status: 'Interviewing', location: 'Remote', applied: 'Aug 12', initials: 'F', color: '#f36a45' },
  { company: 'Notion', role: 'Software Engineer', status: 'Applied', location: 'San Francisco, CA', applied: 'Aug 10', initials: 'N', color: '#111111' },
  { company: 'Vercel', role: 'Frontend Developer', status: 'Applied', location: 'Remote', applied: 'Aug 08', initials: 'V', color: '#111111' },
  { company: 'Linear', role: 'Product Engineer', status: 'Saved', location: 'Remote', applied: '—', initials: 'L', color: '#5e6ad2' },
];

const statusOrder: Status[] = ['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

export default function App() {
  const active = applications.filter(({ status }) => !['Offer', 'Rejected'].includes(status));
  const count = (status: Status) => applications.filter((application) => application.status === status).length;

  return (
    <div className="shell">
      <aside className="sidebar">
        <a className="brand" href="#top"><span>✦</span> NextStep</a>
        <p className="workspace-label">WORKSPACE</p>
        <nav>
          <a className="nav-link active" href="#top"><span>▦</span> Overview</a>
          <a className="nav-link" href="#applications"><span>▤</span> Applications</a>
          <a className="nav-link" href="#calendar"><span>◷</span> Calendar</a>
          <a className="nav-link" href="#insights"><span>◌</span> Insights</a>
        </nav>
        <div className="sidebar-bottom">
          <a className="nav-link" href="#settings"><span>⚙</span> Settings</a>
          <div className="profile"><div className="avatar">MY</div><div><strong>Myke</strong><small>Job seeker</small></div><span className="more">•••</span></div>
        </div>
      </aside>

      <main id="top">
        <header className="topbar">
          <div className="breadcrumb">Overview <span>/</span> Dashboard</div>
          <div className="header-actions"><button className="icon-button" aria-label="Notifications">♧</button><button className="add-button">＋ Add application</button></div>
        </header>
        <section className="content">
          <div className="welcome-row"><div><p className="eyebrow">MONDAY, AUGUST 16</p><h1>Good morning, Myke.</h1><p className="subhead">Here’s where your job search stands today.</p></div><button className="today-button">⌄ &nbsp; This month</button></div>

          <section className="stats" aria-label="Application statistics">
            <Metric label="Total applications" value="24" change="↑ 4 this month" />
            <Metric label="In progress" value={String(active.length)} change="Across 3 stages" />
            <Metric label="Interviews" value={String(count('Interviewing'))} change="Next one in 2 days" accent />
            <Metric label="Response rate" value="38%" change="↑ 8% from last month" />
          </section>

          <section className="panel progress-panel">
            <div className="panel-heading"><div><h2>Application pipeline</h2><p>Move forward, one thoughtful application at a time.</p></div><a href="#applications">View board →</a></div>
            <div className="pipeline">
              {statusOrder.slice(0, 4).map((status) => <div className="stage" key={status}><div className="stage-top"><span>{status}</span><b>{count(status)}</b></div><div className="bar-track"><div className={`bar bar-${status.toLowerCase()}`} style={{ width: `${Math.max(count(status) * 30, status === 'Offer' ? 4 : 0)}%` }} /></div></div>)}
            </div>
          </section>

          <div className="lower-grid">
            <section className="panel applications" id="applications"><div className="panel-heading"><div><h2>Recent applications</h2><p>Your latest opportunities.</p></div><button className="text-button">See all</button></div><div className="application-list">{applications.map((application) => <ApplicationRow key={application.company} application={application} />)}</div></section>
            <section className="panel tasks"><div className="panel-heading"><div><h2>Coming up</h2><p>Keep the momentum going.</p></div><button className="text-button">View calendar</button></div><div className="task"><span className="task-dot purple" /><div><strong>Figma interview preparation</strong><small>Thursday · 10:00 AM</small></div><span className="task-arrow">→</span></div><div className="task"><span className="task-dot orange" /><div><strong>Follow up with Notion</strong><small>Friday · Due in 4 days</small></div><span className="task-arrow">→</span></div><div className="task"><span className="task-dot blue" /><div><strong>Tailor résumé for Linear</strong><small>Saved application</small></div><span className="task-arrow">→</span></div></section>
          </div>
        </section>
      </main>
    </div>
  );
}

function Metric({ label, value, change, accent = false }: { label: string; value: string; change: string; accent?: boolean }) {
  return <article className={`metric ${accent ? 'accent-metric' : ''}`}><p>{label}</p><div><strong>{value}</strong><span>{change}</span></div></article>;
}

function ApplicationRow({ application }: { application: Application }) {
  return <article className="application-row"><div className="company-mark" style={{ background: application.color }}>{application.initials}</div><div className="application-name"><strong>{application.role}</strong><span>{application.company} · {application.location}</span></div><span className={`status status-${application.status.toLowerCase()}`}>{application.status}</span><time>{application.status === 'Saved' ? 'Saved today' : `Applied ${application.applied}`}</time><button className="row-more" aria-label={`More options for ${application.company}`}>•••</button></article>;
}
