import { ApplicationBoard } from './ApplicationBoard';
import { ApplicationList } from './ApplicationList';
import { Application, SortOption, STATUSES, Status, View } from '../../types/application';

type ApplicationsProps = {
  applications: Application[];
  boardStatuses: readonly Status[];
  query: string;
  sortBy: SortOption;
  statusFilter: Status | 'All';
  view: View;
  onDelete: (id: string) => void;
  onEdit: (application: Application) => void;
  onQueryChange: (query: string) => void;
  onSortChange: (sortBy: SortOption) => void;
  onStatusChange: (id: string, status: Status) => void;
  onStatusFilterChange: (status: Status | 'All') => void;
  onViewChange: (view: View) => void;
};

export function Applications({
  applications,
  boardStatuses,
  query,
  sortBy,
  statusFilter,
  view,
  onDelete,
  onEdit,
  onQueryChange,
  onSortChange,
  onStatusChange,
  onStatusFilterChange,
  onViewChange,
}: ApplicationsProps) {
  return (
    <section className="card applications-card">
      <div className="toolbar">
        <div>
          <h2>Applications</h2>
          <p>{applications.length} shown</p>
        </div>
        <div className="filters">
          <input
            aria-label="Search applications"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search"
          />
          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(event) => onStatusFilterChange(event.target.value as Status | 'All')}
          >
            <option>All</option>
            {STATUSES.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
          <select
            aria-label="Sort applications"
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value as SortOption)}
          >
            <option value="followUp">Soonest follow-up</option>
            <option value="appliedDate">Newest applied</option>
            <option value="company">Company A–Z</option>
          </select>
          <div className="view-toggle" aria-label="Application view">
            <button
              className={view === 'list' ? 'active' : ''}
              onClick={() => onViewChange('list')}
            >
              List
            </button>
            <button
              className={view === 'board' ? 'active' : ''}
              onClick={() => onViewChange('board')}
            >
              Board
            </button>
          </div>
        </div>
      </div>
      {applications.length === 0 ? (
        <p className="empty-state">No applications match those filters.</p>
      ) : view === 'list' ? (
        <ApplicationList
          applications={applications}
          onDelete={onDelete}
          onEdit={onEdit}
          onStatusChange={onStatusChange}
        />
      ) : (
        <ApplicationBoard
          applications={applications}
          statuses={boardStatuses}
          onStatusChange={onStatusChange}
        />
      )}
    </section>
  );
}
