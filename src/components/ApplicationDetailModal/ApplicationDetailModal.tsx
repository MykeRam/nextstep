import { useEffect } from 'react';
import { Application } from '../../types/application';
import { formatDate, formatTimestamp, getStatusHistory } from '../../utils/applications';

type ApplicationDetailModalProps = {
  application: Application | null;
  onClose: () => void;
  onEdit: (application: Application) => void;
};

export function ApplicationDetailModal({
  application,
  onClose,
  onEdit,
}: ApplicationDetailModalProps) {
  useEffect(() => {
    if (!application) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [application, onClose]);

  if (!application) return null;

  const statusHistory = [...getStatusHistory(application)].sort((first, second) =>
    second.changedAt.localeCompare(first.changedAt),
  );

  return (
    <div
      className="application-detail-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="application-detail-title"
        aria-modal="true"
        className="application-detail-modal"
        role="dialog"
      >
        <div className="application-detail-heading">
          <div>
            <p className={`status ${application.status.toLowerCase()}`}>{application.status}</p>
            <h2 id="application-detail-title">{application.role}</h2>
            <p>{application.company}</p>
          </div>
          <button
            aria-label="Close application details"
            className="modal-close-button"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="application-detail-grid">
          <div>
            <span>Location</span>
            <strong>{application.location || 'Not provided'}</strong>
          </div>
          <div>
            <span>Applied</span>
            <strong>
              {application.appliedDate ? formatDate(application.appliedDate) : 'Not applied yet'}
            </strong>
          </div>
          <div>
            <span>Follow-up</span>
            <strong>
              {application.followUpDate ? formatDate(application.followUpDate) : 'Not scheduled'}
            </strong>
          </div>
        </div>

        {application.jobUrl && (
          <a
            className="application-detail-link"
            href={application.jobUrl}
            rel="noreferrer"
            target="_blank"
          >
            Open job post ↗
          </a>
        )}

        <section className="application-detail-section">
          <h3>Notes</h3>
          <p>{application.notes || 'No notes added yet.'}</p>
        </section>

        <section className="application-detail-section">
          <h3>Status timeline</h3>
          <ol className="status-timeline">
            {statusHistory.map((entry, index) => (
              <li key={`${entry.status}-${entry.changedAt}-${index}`}>
                <span className={`status ${entry.status.toLowerCase()}`}>{entry.status}</span>
                <time>{formatTimestamp(entry.changedAt)}</time>
              </li>
            ))}
          </ol>
        </section>

        <button
          className="primary-button application-detail-edit"
          onClick={() => onEdit(application)}
          type="button"
        >
          Edit application
        </button>
      </section>
    </div>
  );
}
