import { Application } from '../../types/application';
import { formatDate, getTodayKey } from '../../utils/applications';

type FollowUpRemindersProps = {
  applications: Application[];
  onComplete: (id: string) => void;
  onEdit: (application: Application) => void;
  onSnooze: (id: string, days: number) => void;
};

export function FollowUpReminders({
  applications,
  onComplete,
  onEdit,
  onSnooze,
}: FollowUpRemindersProps) {
  const today = getTodayKey();
  const overdueApplications = applications.filter(
    (application) => application.followUpDate < today,
  );
  const todayApplications = applications.filter(
    (application) => application.followUpDate === today,
  );
  const reminders = [
    ...overdueApplications.map((application) => ({ application, label: 'Overdue' })),
    ...todayApplications.map((application) => ({ application, label: 'Due today' })),
  ];

  if (reminders.length === 0) return null;

  return (
    <section className="reminder-banner" aria-labelledby="reminders-title">
      <div>
        <h2 id="reminders-title">Follow-up reminders</h2>
        <p>
          {overdueApplications.length > 0
            ? `${overdueApplications.length} overdue item${overdueApplications.length === 1 ? '' : 's'}`
            : 'Everything is on track'}
          {todayApplications.length > 0 ? ` · ${todayApplications.length} due today` : ''}
        </p>
      </div>
      <ul>
        {reminders.map(({ application, label }) => (
          <li key={application.id}>
            <span className={label === 'Overdue' ? 'reminder-overdue' : ''}>{label}</span>
            <div className="reminder-item-actions">
              <button onClick={() => onEdit(application)} type="button">
                {application.company} · {formatDate(application.followUpDate)}
              </button>
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
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
