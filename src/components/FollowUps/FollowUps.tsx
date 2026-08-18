import { Application } from '../../types/application';
import { formatDate } from '../../utils/applications';

type FollowUpsProps = {
  applications: Application[];
  onEdit: (application: Application) => void;
};

export function FollowUps({ applications, onEdit }: FollowUpsProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <section className="card follow-ups-card" aria-labelledby="follow-ups-title">
      <div className="section-heading">
        <div>
          <h2 id="follow-ups-title">Upcoming follow-ups</h2>
          <p>Keep your next action in view.</p>
        </div>
        <span className="follow-up-count">{applications.length} scheduled</span>
      </div>
      {applications.length === 0 ? (
        <p className="empty-state">No follow-ups scheduled yet.</p>
      ) : (
        <ul className="follow-ups-list">
          {applications.map((application) => {
            const overdue = new Date(`${application.followUpDate}T00:00:00`) < today;
            return (
              <li key={application.id}>
                <div>
                  <strong>{application.company}</strong>
                  <span>{application.role}</span>
                </div>
                <time className={overdue ? 'overdue' : ''}>
                  {overdue
                    ? `Overdue · ${formatDate(application.followUpDate)}`
                    : formatDate(application.followUpDate)}
                </time>
                <button onClick={() => onEdit(application)}>Edit</button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
