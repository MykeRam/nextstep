import { Application, StatusHistoryEntry } from '../types/application';
import { supabase } from '../lib/supabase';
import { getStatusHistory } from '../utils/applications';

type ApplicationRow = {
  id: string;
  user_id: string;
  company: string;
  role: string;
  status: Application['status'];
  location: string;
  job_url: string;
  applied_date: string | null;
  follow_up_date: string | null;
  notes: string;
  status_history: StatusHistoryEntry[];
  created_at: string;
  updated_at: string;
};

function fromRow(row: ApplicationRow): Application {
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    status: row.status,
    location: row.location,
    jobUrl: row.job_url,
    appliedDate: row.applied_date ?? '',
    followUpDate: row.follow_up_date ?? '',
    notes: row.notes,
    statusHistory: Array.isArray(row.status_history) ? row.status_history : [],
  };
}

function toRow(application: Application, userId: string) {
  return {
    id: application.id,
    user_id: userId,
    company: application.company,
    role: application.role,
    status: application.status,
    location: application.location,
    job_url: application.jobUrl,
    applied_date: application.appliedDate || null,
    follow_up_date: application.followUpDate || null,
    notes: application.notes,
    status_history: getStatusHistory(application),
    updated_at: new Date().toISOString(),
  };
}

export async function fetchCloudApplications(userId: string) {
  if (!supabase) return { applications: [], error: 'Cloud sync has not been configured yet.' };

  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return {
    applications: error ? [] : (data as ApplicationRow[]).map(fromRow),
    error: error?.message ?? null,
  };
}

export async function upsertCloudApplication(application: Application, userId: string) {
  if (!supabase) return 'Cloud sync has not been configured yet.';

  const { error } = await supabase.from('applications').upsert(toRow(application, userId));
  return error?.message ?? null;
}

export async function seedCloudApplications(applications: Application[], userId: string) {
  if (!supabase || applications.length === 0) return { applications, error: null };

  // Starter data has stable IDs for local demo mode. Give each account its own
  // IDs before inserting so one user's demo rows can never collide with another's.
  const seededApplications = applications.map((application) => ({
    ...application,
    id: crypto.randomUUID(),
  }));

  const { error } = await supabase
    .from('applications')
    .insert(seededApplications.map((application) => toRow(application, userId)));

  return { applications: seededApplications, error: error?.message ?? null };
}

export async function deleteCloudApplication(id: string) {
  if (!supabase) return 'Cloud sync has not been configured yet.';

  const { error } = await supabase.from('applications').delete().eq('id', id);
  return error?.message ?? null;
}
