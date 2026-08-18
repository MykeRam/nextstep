import { Application } from '../types/application';
import { supabase } from '../lib/supabase';

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
  if (!supabase || applications.length === 0) return null;

  const { error } = await supabase
    .from('applications')
    .upsert(applications.map((application) => toRow(application, userId)));

  return error?.message ?? null;
}

export async function deleteCloudApplication(id: string) {
  if (!supabase) return 'Cloud sync has not been configured yet.';

  const { error } = await supabase.from('applications').delete().eq('id', id);
  return error?.message ?? null;
}
