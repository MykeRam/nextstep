import { useState } from 'react';

import { FollowUpCalendar } from '../FollowUpCalendar/FollowUpCalendar';
import { Application } from '../../types/application';
import { formatDate } from '../../utils/applications';

type FollowUpsProps = {
  applications: Application[];
  onEdit: (application: Application) => void;
};

export function FollowUps({ applications, onEdit }: FollowUpsProps) {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <section className="card follow-ups-card" aria-labelledby="follow-ups-title">
      <div className="section-heading">
        <div>
          <h2 id="follow-ups-title">Follow-ups</h2>
          <p>Keep your next action in view.</p>
        </div>
        <div className="follow-ups-actions">
          <span className="follow-up-count">{applications.length} scheduled</span>
          <div className="view-toggle" aria-label="Follow-up view">
            <button
              className={view === 'list' ? 'active' : ''}
              onClick={() => setView('list')}
              type="button"
            >
              List
            </button>
            <button
              className={view === 'calendar' ? 'active' : ''}
              onClick={() => setView('calendar')}
              type="button"
            >
              Calendar
            </button>
          </div>
        </div>
      </div>
      <div className="view-content-transition" key={view}>
        {view === 'calendar' ? (
          <FollowUpCalendar applications={applications} onEdit={onEdit} />
        ) : applications.length === 0 ? (
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
      </div>
    </section>
  );
}
