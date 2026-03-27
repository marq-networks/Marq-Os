-- MARQ Phase 1 completion - RLS for identity/catalog tables not covered in 004.
-- permissions: global catalog (read for authenticated clients).
-- users: self row access (+ platform admin read-all).
-- role_permissions: scoped via parent role organization.

alter table public.permissions enable row level security;
alter table public.users enable row level security;
alter table public.role_permissions enable row level security;

drop policy if exists permissions_authenticated_read on public.permissions;
create policy permissions_authenticated_read on public.permissions
for select
to authenticated
using (true);

drop policy if exists users_select_self on public.users;
create policy users_select_self on public.users
for select
using (auth.uid() = id);

drop policy if exists users_select_platform on public.users;
create policy users_select_platform on public.users
for select
using (public.is_platform_admin());

drop policy if exists users_update_self on public.users;
create policy users_update_self on public.users
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists role_permissions_org_access on public.role_permissions;
create policy role_permissions_org_access on public.role_permissions
for all
using (
  exists (
    select 1
    from public.roles r
    where r.id = role_permissions.role_id
      and public.can_access_org_row(r.organization_id)
  )
)
with check (
  exists (
    select 1
    from public.roles r
    where r.id = role_permissions.role_id
      and public.can_access_org_row(r.organization_id)
  )
);
