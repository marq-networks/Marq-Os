-- MARQ Supabase foundation - migration 001
-- Extensions and helper functions/triggers shared by all tables.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_org_id()
returns uuid
language sql
stable
as $$
  select nullif(auth.jwt() ->> 'organization_id', '')::uuid
$$;

create or replace function public.current_role()
returns text
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'role', '')
$$;

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
as $$
  select public.current_role() = 'platform_admin'
$$;
