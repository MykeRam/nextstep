export const STATUSES = ['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected'] as const;

export type Status = (typeof STATUSES)[number];

export type StatusHistoryEntry = {
  status: Status;
  changedAt: string;
};

export type Application = {
  id: string;
  company: string;
  role: string;
  status: Status;
  location: string;
  jobUrl: string;
  appliedDate: string;
  followUpDate: string;
  notes: string;
  statusHistory?: StatusHistoryEntry[];
};

export type ApplicationDraft = Omit<Application, 'id' | 'statusHistory'>;

export type SortOption = 'followUp' | 'appliedDate' | 'company';

export type View = 'list' | 'board';
