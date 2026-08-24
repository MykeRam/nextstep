import { Application, STATUSES, Status } from '../../types/application';
import { formatDate } from '../../utils/applications';

type ApplicationBoardProps = {
  applications: Application[];
  statuses: readonly Status[];
  onStatusChange: (id: string, status: Status) => void;
  onViewDetails: (application: Application) => void;
};

export function ApplicationBoard({
  applications,
  statuses,
  onStatusChange,
  onViewDetails,
}: ApplicationBoardProps) {
  return (
    <div className="board-view">
      {statuses.map((status) => {
        const applicationsInStage = applications.filter(
          (application) => application.status === status,
        );

        return (
          <section className="board-column" key={status}>
            <div className="board-column-heading">
              <strong>{status}</strong>
              <span>{applicationsInStage.length}</span>
            </div>
            {applicationsInStage.length === 0 ? (
              <p>No applications</p>
            ) : (
              applicationsInStage.map((application) => (
                <article className="board-card" key={application.id}>
                  <strong>{application.role}</strong>
                  <span>{application.company}</span>
                  {application.jobUrl && (
                    <a
                      className="job-link"
                      href={application.jobUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open job post ↗
                    </a>
                  )}
                  {application.followUpDate && (
                    <small>Follow up {formatDate(application.followUpDate)}</small>
                  )}
                  <button
                    className="board-details-button"
                    onClick={() => onViewDetails(application)}
                  >
                    Details
                  </button>
                  <select
                    aria-label={`Update status for ${application.company}`}
                    value={application.status}
                    onChange={(event) =>
                      onStatusChange(application.id, event.target.value as Status)
                    }
                  >
                    {STATUSES.map((stage) => (
                      <option key={stage}>{stage}</option>
                    ))}
                  </select>
                </article>
              ))
            )}
          </section>
        );
      })}
    </div>
  );
}
