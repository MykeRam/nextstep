alter table public.applications
add column status_history jsonb not null default '[]'::jsonb;

update public.applications
set status_history = jsonb_build_array(
  jsonb_build_object(
    'status',
    status,
    'changedAt',
    created_at
  )
)
where status_history = '[]'::jsonb;
