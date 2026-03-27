-- MARQ local development seed (Phase 1 definition of done)
-- Run after migrations via `supabase db reset` (see config.toml [db.seed]).
-- Idempotent: safe to re-run on existing data.

-- ---------------------------------------------------------------------------
-- Organization + global permission catalog
-- ---------------------------------------------------------------------------
insert into public.organizations (id, slug, name, plan, seats, used_seats, status)
values
  ('11111111-1111-1111-1111-111111111111', 'demo-org', 'Demo Organization', 'Starter', 25, 3, 'Active')
on conflict (id) do nothing;

insert into public.permissions (key, description)
values
  ('people.read', 'Read people records'),
  ('people.write', 'Write people records'),
  ('finance.read', 'Read finance records'),
  ('finance.write', 'Write finance records'),
  ('work.read', 'Read work records'),
  ('work.write', 'Write work records')
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- Org role + permission grants (stable role id for seeds and tests)
-- ---------------------------------------------------------------------------
insert into public.roles (id, organization_id, name, description, is_system)
values (
  '22222222-2222-2222-2222-222222222221',
  '11111111-1111-1111-1111-111111111111',
  'Organization Admin',
  'Full administrative access within the organization',
  true
)
on conflict (id) do nothing;

insert into public.role_permissions (role_id, permission_id)
select '22222222-2222-2222-2222-222222222221', p.id
from public.permissions p
where p.key in (
  'people.read',
  'people.write',
  'finance.read',
  'finance.write',
  'work.read',
  'work.write'
)
on conflict (role_id, permission_id) do nothing;

-- ---------------------------------------------------------------------------
-- People: departments + employees (user_id null until linked to auth.users)
-- ---------------------------------------------------------------------------
insert into public.departments (
  id,
  organization_id,
  name,
  description,
  lead_user_id,
  member_count,
  budget,
  parent_department_id,
  status
)
values
  (
    '33333333-3333-3333-3333-333333333331',
    '11111111-1111-1111-1111-111111111111',
    'Engineering',
    'Software development and infrastructure',
    null,
    10,
    1000000,
    null,
    'Active'
  ),
  (
    '33333333-3333-3333-3333-333333333332',
    '11111111-1111-1111-1111-111111111111',
    'Finance',
    'Financial operations and accounting',
    null,
    5,
    500000,
    null,
    'Active'
  )
on conflict (id) do nothing;

insert into public.employees (
  id,
  organization_id,
  user_id,
  department_id,
  manager_employee_id,
  job_title,
  employment_type,
  salary,
  phone,
  location,
  join_date,
  last_seen_at,
  status,
  skills
)
values
  (
    '44444444-4444-4444-4444-444444444441',
    '11111111-1111-1111-1111-111111111111',
    null,
    '33333333-3333-3333-3333-333333333331',
    null,
    'VP Engineering',
    'Full-time',
    150000,
    null,
    'Remote',
    '2024-01-10',
    now(),
    'Active',
    array['Leadership', 'System Design']
  ),
  (
    '44444444-4444-4444-4444-444444444442',
    '11111111-1111-1111-1111-111111111111',
    null,
    '33333333-3333-3333-3333-333333333331',
    null,
    'QA Engineer',
    'Full-time',
    80000,
    null,
    'Remote',
    '2024-04-01',
    now(),
    'Active',
    array['API Testing']
  ),
  (
    '44444444-4444-4444-4444-444444444443',
    '11111111-1111-1111-1111-111111111111',
    null,
    '33333333-3333-3333-3333-333333333332',
    null,
    'Finance Analyst',
    'Full-time',
    90000,
    null,
    'Chicago',
    '2024-06-15',
    now(),
    'Active',
    array['Forecasting']
  )
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Optional next step (not automated here): create users in auth.users, mirror
-- to public.users, and insert organization_memberships linking demo users to
-- the demo org and role above.
-- ---------------------------------------------------------------------------
