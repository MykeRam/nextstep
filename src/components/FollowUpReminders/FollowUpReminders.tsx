import { Application } from '../../types/application';
import { formatDate } from '../../utils/applications';

type FollowUpRemindersProps = {
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

export function FollowUpReminders({ applications, onEdit }: FollowUpRemindersProps) {
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
            <button onClick={() => onEdit(application)} type="button">
              {application.company} · {formatDate(application.followUpDate)}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
