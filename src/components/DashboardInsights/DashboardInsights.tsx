import { Application, STATUSES, Status } from '../../types/application';
import { formatDate } from '../../utils/applications';

type DashboardInsightsProps = {
  applications: Application[];
  onEdit: (application: Application) => void;
};

function getTodayKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getCurrentMonthKey() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
}

export function DashboardInsights({ applications, onEdit }: DashboardInsightsProps) {
  const today = getTodayKey();
  const activeApplications = applications.filter(
    (application) => !['Saved', 'Offer', 'Rejected'].includes(application.status),
  );
  const responseApplications = applications.filter(
    (application) => !['Saved', 'Rejected'].includes(application.status),
  );
  const positiveResponses = applications.filter((application) =>
    ['Interviewing', 'Offer'].includes(application.status),
  );
  const responseRate = responseApplications.length
    ? Math.round((positiveResponses.length / responseApplications.length) * 100)
    : 0;
  const submittedThisMonth = applications.filter((application) =>
    application.appliedDate.startsWith(getCurrentMonthKey()),
  ).length;
  const statusCounts = Object.fromEntries(
    STATUSES.map((status) => [
      status,
      applications.filter((application) => application.status === status).length,
    ]),
  ) as Record<Status, number>;
  const nextAction = applications
    .filter(
      (application) =>
        application.followUpDate && !['Offer', 'Rejected'].includes(application.status),
    )
    .sort((first, second) => first.followUpDate.localeCompare(second.followUpDate))[0];

  const nextActionLabel = nextAction
    ? nextAction.followUpDate < today
      ? 'Overdue follow-up'
      : nextAction.followUpDate === today
        ? 'Follow up today'
        : `Next follow-up · ${formatDate(nextAction.followUpDate)}`
    : 'No follow-ups scheduled';

  return (
    <section className="card dashboard-insights" aria-labelledby="insights-title">
      <div className="section-heading">
        <div>
          <h2 id="insights-title">Dashboard insights</h2>
          <p>A quick read on your search momentum.</p>
        </div>
        <span className="insights-period">Current month</span>
      </div>
      <div className="insight-metrics">
        <div>
          <span>Active pipeline</span>
          <strong>{activeApplications.length}</strong>
          <small>Applied or interviewing</small>
        </div>
        <div>
          <span>Response rate</span>
          <strong>{responseRate}%</strong>
          <small>Interviews and offers</small>
        </div>
        <div>
          <span>This month</span>
          <strong>{submittedThisMonth}</strong>
          <small>Applications submitted</small>
        </div>
        <div>
          <span>Offers</span>
          <strong>{statusCounts.Offer}</strong>
          <small>Decisions in your favor</small>
        </div>
      </div>
      <div className="insight-details">
        <div className="next-action">
          <span>Best next action</span>
          {nextAction ? (
            <button onClick={() => onEdit(nextAction)} type="button">
              <strong>{nextActionLabel}</strong>
              <small>
                {nextAction.company} · {nextAction.role}
              </small>
            </button>
          ) : (
            <p>Add a follow-up date to surface your next action here.</p>
          )}
        </div>
        <div className="pipeline-breakdown">
          <span>Pipeline breakdown</span>
          <ul>
            {STATUSES.map((status) => (
              <li key={status}>
                <span>{status}</span>
                <div aria-label={`${status}: ${statusCounts[status]}`} className="insight-bar">
                  <span
                    style={{
                      width: `${(statusCounts[status] / Math.max(applications.length, 1)) * 100}%`,
                    }}
                  />
                </div>
                <strong>{statusCounts[status]}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
