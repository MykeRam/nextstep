import { useState } from 'react';

import { FollowUpCalendar } from '../FollowUpCalendar/FollowUpCalendar';
import { Application } from '../../types/application';
import { formatDate, getFollowUpPriority } from '../../utils/applications';

type FollowUpsProps = {
  applications: Application[];
  onComplete: (id: string) => void;
  onEdit: (application: Application) => void;
  onSnooze: (id: string, days: number) => void;
};

export function FollowUps({ applications, onComplete, onEdit, onSnooze }: FollowUpsProps) {
  const [view, setView] = useState<'list' | 'calendar'>('list');
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
              const priority = getFollowUpPriority(application.followUpDate);
              const priorityLabel =
                priority === 'overdue'
                  ? 'Overdue'
                  : priority === 'today'
                    ? 'Due today'
                    : 'Upcoming';

              return (
                <li key={application.id}>
                  <div>
                    <strong>{application.company}</strong>
                    <span>{application.role}</span>
                  </div>
                  <time className={`follow-up-priority follow-up-priority_${priority}`}>
                    {priorityLabel} · {formatDate(application.followUpDate)}
                  </time>
                  <div className="follow-up-item-actions">
                    <button
                      aria-label={`Complete follow-up for ${application.company}`}
                      onClick={() => onComplete(application.id)}
                      type="button"
                    >
                      Complete
                    </button>
                    <select
                      aria-label={`Snooze follow-up for ${application.company}`}
                      defaultValue=""
                      onChange={(event) => {
                        const days = Number(event.target.value);
                        if (!days) return;

                        onSnooze(application.id, days);
                        event.target.value = '';
                      }}
                    >
                      <option value="">Snooze</option>
                      <option value="1">1 day</option>
                      <option value="3">3 days</option>
                      <option value="7">7 days</option>
                    </select>
                    <button onClick={() => onEdit(application)} type="button">
                      Edit
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
