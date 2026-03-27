-- MARQ Supabase foundation - migration 004
-- Baseline RLS policies for tenant isolation.

create or replace function public.is_org_member(org_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.organization_memberships om
    where om.organization_id = org_id
      and om.user_id = auth.uid()
  )
$$;

create or replace function public.can_access_org_row(org_id uuid)
returns boolean
language sql
stable
as $$
  select public.is_platform_admin()
      or org_id = public.current_org_id()
      or public.is_org_member(org_id)
$$;

alter table public.organizations enable row level security;
alter table public.roles enable row level security;
alter table public.organization_memberships enable row level security;
alter table public.departments enable row level security;
alter table public.employees enable row level security;
alter table public.time_sessions enable row level security;
alter table public.leave_requests enable row level security;
alter table public.fines enable row level security;
alter table public.channels enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.channel_members enable row level security;
alter table public.message_reactions enable row level security;
alter table public.notification_reads enable row level security;
alter table public.accounts enable row level security;
alter table public.transactions enable row level security;
alter table public.payroll_runs enable row level security;
alter table public.payroll_postings enable row level security;
alter table public.billing_invoices enable row level security;
alter table public.reimbursements enable row level security;
alter table public.expense_reports enable row level security;
alter table public.loans enable row level security;
alter table public.cost_centers enable row level security;
alter table public.finance_reports enable row level security;
alter table public.projects enable row level security;
alter table public.sprints enable row level security;
alter table public.milestones enable row level security;
alter table public.tasks enable row level security;
alter table public.issues enable row level security;
alter table public.task_dependencies enable row level security;
alter table public.time_logs enable row level security;
alter table public.time_corrections enable row level security;
alter table public.workday_rules enable row level security;
alter table public.break_rules enable row level security;
alter table public.activity_log enable row level security;

drop policy if exists org_select on public.organizations;
create policy org_select on public.organizations
for select using (public.can_access_org_row(id));

drop policy if exists org_update_admin on public.organizations;
create policy org_update_admin on public.organizations
for update using (public.can_access_org_row(id) and public.current_role() in ('org_admin', 'platform_admin'))
with check (public.can_access_org_row(id) and public.current_role() in ('org_admin', 'platform_admin'));

create or replace function public.apply_org_table_policy(table_name text)
returns void
language plpgsql
as $$
declare
  select_policy_name text := table_name || '_org_select';
  mod_policy_name text := table_name || '_org_mod';
begin
  execute format('drop policy if exists %I on public.%I', select_policy_name, table_name);
  execute format(
    'create policy %I on public.%I for select using (public.can_access_org_row(organization_id))',
    select_policy_name,
    table_name
  );

  execute format('drop policy if exists %I on public.%I', mod_policy_name, table_name);
  execute format(
    'create policy %I on public.%I for all using (public.can_access_org_row(organization_id)) with check (public.can_access_org_row(organization_id))',
    mod_policy_name,
    table_name
  );
end;
$$;

select public.apply_org_table_policy('roles');
select public.apply_org_table_policy('organization_memberships');
select public.apply_org_table_policy('departments');
select public.apply_org_table_policy('employees');
select public.apply_org_table_policy('time_sessions');
select public.apply_org_table_policy('leave_requests');
select public.apply_org_table_policy('fines');
select public.apply_org_table_policy('channels');
select public.apply_org_table_policy('messages');
select public.apply_org_table_policy('notifications');
select public.apply_org_table_policy('accounts');
select public.apply_org_table_policy('transactions');
select public.apply_org_table_policy('payroll_runs');
select public.apply_org_table_policy('payroll_postings');
select public.apply_org_table_policy('billing_invoices');
select public.apply_org_table_policy('reimbursements');
select public.apply_org_table_policy('expense_reports');
select public.apply_org_table_policy('loans');
select public.apply_org_table_policy('cost_centers');
select public.apply_org_table_policy('finance_reports');
select public.apply_org_table_policy('projects');
select public.apply_org_table_policy('sprints');
select public.apply_org_table_policy('milestones');
select public.apply_org_table_policy('tasks');
select public.apply_org_table_policy('issues');
select public.apply_org_table_policy('time_logs');
select public.apply_org_table_policy('time_corrections');
select public.apply_org_table_policy('workday_rules');
select public.apply_org_table_policy('break_rules');
select public.apply_org_table_policy('activity_log');

drop policy if exists channel_members_access on public.channel_members;
create policy channel_members_access on public.channel_members
for all using (
  exists (
    select 1
    from public.channels c
    where c.id = channel_members.channel_id
      and public.can_access_org_row(c.organization_id)
  )
)
with check (
  exists (
    select 1
    from public.channels c
    where c.id = channel_members.channel_id
      and public.can_access_org_row(c.organization_id)
  )
);

drop policy if exists message_reactions_access on public.message_reactions;
create policy message_reactions_access on public.message_reactions
for all using (
  exists (
    select 1
    from public.messages m
    where m.id = message_reactions.message_id
      and public.can_access_org_row(m.organization_id)
  )
)
with check (
  exists (
    select 1
    from public.messages m
    where m.id = message_reactions.message_id
      and public.can_access_org_row(m.organization_id)
  )
);

drop policy if exists notification_reads_access on public.notification_reads;
create policy notification_reads_access on public.notification_reads
for all using (
  exists (
    select 1
    from public.notifications n
    where n.id = notification_reads.notification_id
      and public.can_access_org_row(n.organization_id)
  )
)
with check (
  exists (
    select 1
    from public.notifications n
    where n.id = notification_reads.notification_id
      and public.can_access_org_row(n.organization_id)
  )
);

drop policy if exists task_dependencies_access on public.task_dependencies;
create policy task_dependencies_access on public.task_dependencies
for all using (public.can_access_org_row(organization_id))
with check (public.can_access_org_row(organization_id));
