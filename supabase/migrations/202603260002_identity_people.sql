-- MARQ Supabase foundation - migration 002
-- Identity, RBAC, organization, and people domain tables.

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  plan text not null default 'Free' check (plan in ('Free', 'Starter', 'Professional', 'Enterprise')),
  seats integer not null default 1 check (seats >= 0),
  used_seats integer not null default 0 check (used_seats >= 0),
  status text not null default 'Active' check (status in ('Active', 'Suspended', 'Trial')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  avatar_url text,
  status text not null default 'Active' check (status in ('Active', 'Away', 'Offline', 'Suspended', 'Deactivated')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  description text not null default '',
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (role_id, permission_id)
);

create table if not exists public.organization_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role_id uuid references public.roles(id) on delete set null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  description text,
  lead_user_id uuid references public.users(id) on delete set null,
  member_count integer not null default 0 check (member_count >= 0),
  budget numeric(14,2) not null default 0 check (budget >= 0),
  parent_department_id uuid references public.departments(id) on delete set null,
  status text not null default 'Active' check (status in ('Active', 'Archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references public.users(id) on delete set null,
  department_id uuid not null references public.departments(id) on delete restrict,
  manager_employee_id uuid references public.employees(id) on delete set null,
  job_title text not null,
  employment_type text not null check (employment_type in ('Full-time', 'Part-time', 'Contract', 'Intern')),
  salary numeric(14,2) check (salary is null or salary >= 0),
  phone text,
  location text,
  join_date date not null,
  last_seen_at timestamptz,
  status text not null default 'Active' check (status in ('Active', 'Away', 'Offline', 'Suspended', 'Deactivated')),
  skills text[] not null default '{}',
  created_by uuid references public.users(id) on delete set null,
  updated_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_roles_org_created on public.roles (organization_id, created_at desc);
create index if not exists idx_memberships_org_user on public.organization_memberships (organization_id, user_id);
create index if not exists idx_departments_org_created on public.departments (organization_id, created_at desc);
create index if not exists idx_employees_org_created on public.employees (organization_id, created_at desc);
create index if not exists idx_employees_department on public.employees (department_id);

drop trigger if exists tr_organizations_updated_at on public.organizations;
create trigger tr_organizations_updated_at before update on public.organizations
for each row execute procedure public.set_updated_at();

drop trigger if exists tr_users_updated_at on public.users;
create trigger tr_users_updated_at before update on public.users
for each row execute procedure public.set_updated_at();

drop trigger if exists tr_roles_updated_at on public.roles;
create trigger tr_roles_updated_at before update on public.roles
for each row execute procedure public.set_updated_at();

drop trigger if exists tr_memberships_updated_at on public.organization_memberships;
create trigger tr_memberships_updated_at before update on public.organization_memberships
for each row execute procedure public.set_updated_at();

drop trigger if exists tr_departments_updated_at on public.departments;
create trigger tr_departments_updated_at before update on public.departments
for each row execute procedure public.set_updated_at();

drop trigger if exists tr_employees_updated_at on public.employees;
create trigger tr_employees_updated_at before update on public.employees
for each row execute procedure public.set_updated_at();
