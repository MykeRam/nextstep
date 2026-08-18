import { STATUSES, Status } from '../../types/application';

type StatusSummaryProps = {
  activeStatus: Status | 'All';
  statusCounts: Record<Status, number>;
  onFilter: (status: Status) => void;
};

export function StatusSummary({ activeStatus, statusCounts, onFilter }: StatusSummaryProps) {
  return (
    <section className="status-summary" aria-label="Application status summary">
      {STATUSES.map((status) => (
        <button
          key={status}
          className={activeStatus === status ? 'active' : ''}
          aria-pressed={activeStatus === status}
          onClick={() => onFilter(status)}
        >
          <strong>{statusCounts[status]}</strong>
          <span>{status}</span>
        </button>
      ))}
    </section>
  );
}
