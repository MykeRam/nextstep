create table public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company text not null check (char_length(trim(company)) > 0),
  role text not null check (char_length(trim(role)) > 0),
  status text not null check (status in ('Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected')),
  location text not null default '',
  job_url text not null default '',
  applied_date date,
  follow_up_date date,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index applications_user_id_idx on public.applications (user_id);
create index applications_user_follow_up_idx on public.applications (user_id, follow_up_date);

revoke all on table public.applications from anon, authenticated;
grant select, insert, update, delete on table public.applications to authenticated;

alter table public.applications enable row level security;

create policy "Users can view their own applications"
on public.applications
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own applications"
on public.applications
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own applications"
on public.applications
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own applications"
on public.applications
for delete
to authenticated
using ((select auth.uid()) = user_id);
