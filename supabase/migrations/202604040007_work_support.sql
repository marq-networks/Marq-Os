create table if not exists public.task_lists (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  milestone_id uuid references public.milestones(id) on delete set null,
  sprint_id uuid references public.sprints(id) on delete set null,
  name text not null,
  status text not null default 'Active' check (status in ('Active', 'Completed')),
  task_count integer not null default 0,
  completed_tasks integer not null default 0,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.task_dependencies
  add column if not exists type text not null default 'blocks';

alter table public.time_logs
  add column if not exists billable boolean not null default false;
