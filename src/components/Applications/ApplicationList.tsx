import { Application, STATUSES, Status } from '../../types/application';
import { formatDate } from '../../utils/applications';

type ApplicationListProps = {
  applications: Application[];
  onDelete: (id: string) => void;
  onEdit: (application: Application) => void;
  onStatusChange: (id: string, status: Status) => void;
};

export function ApplicationList({
  applications,
  onDelete,
  onEdit,
  onStatusChange,
}: ApplicationListProps) {
  return (
    <ul className="application-list">
      {applications.map((application) => (
        <li key={application.id}>
          <div>
            <strong>{application.role}</strong>
            <span>
              {application.company}
              {application.location && ` · ${application.location}`}
            </span>
            {application.jobUrl && (
              <a className="job-link" href={application.jobUrl} target="_blank" rel="noreferrer">
                Open job post ↗
              </a>
            )}
            {application.followUpDate && (
              <small className="follow-up">Follow up {formatDate(application.followUpDate)}</small>
            )}
            {application.notes && <small>{application.notes}</small>}
          </div>
          <select
            className={`status status-select ${application.status.toLowerCase()}`}
            aria-label={`Update status for ${application.company}`}
            value={application.status}
            onChange={(event) => onStatusChange(application.id, event.target.value as Status)}
          >
            {STATUSES.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
          <time>
            {application.appliedDate
              ? `Applied ${formatDate(application.appliedDate)}`
              : 'Not applied yet'}
          </time>
          <div className="row-actions">
            <button onClick={() => onEdit(application)}>Edit</button>
            <button className="delete-button" onClick={() => onDelete(application.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
