-- MARQ Supabase foundation - migration 003
-- Core domain tables for time, communication, finance, work, analytics, notifications.

create table if not exists public.time_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  session_date date not null,
  check_in_at timestamptz not null,
  check_out_at timestamptz,
  total_minutes integer not null default 0 check (total_minutes >= 0),
  status text not null check (status in ('Active', 'Completed', 'Incomplete', 'Manual')),
  notes text,
  ip text,
  location text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leave_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  leave_type text not null check (leave_type in ('Vacation', 'Sick Leave', 'Personal', 'Parental', 'Bereavement', 'Unpaid')),
  start_date date not null,
  end_date date not null,
  days numeric(8,2) not null check (days >= 0),
  reason text not null,
  status text not null default 'Pending' check (status in ('Pending', 'Approved', 'Rejected', 'Cancelled')),
  approved_by uuid references public.users(id) on delete set null,
  approved_at timestamptz,
  submitted_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fines (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  session_id uuid references public.time_sessions(id) on delete set null,
  fine_type text not null check (fine_type in ('Late Arrival', 'Early Departure', 'Absent', 'Break Violation', 'Policy Violation')),
  amount numeric(14,2) not null check (amount >= 0),
  currency text not null default 'USD',
  fine_date date not null,
  description text not null,
  status text not null default 'Active' check (status in ('Active', 'Paid', 'Waived', 'Disputed')),
  issued_by uuid references public.users(id) on delete set null,
  issued_at timestamptz not null default now(),
  paid_at timestamptz,
  waived_by uuid references public.users(id) on delete set null,
  waived_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.channels (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  description text,
  channel_type text not null check (channel_type in ('public', 'private', 'direct')),
  created_by uuid not null references public.users(id) on delete restrict,
  pinned boolean not null default false,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists public.channel_members (
  channel_id uuid not null references public.channels(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (channel_id, user_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  channel_id uuid not null references public.channels(id) on delete cascade,
  sender_id uuid not null references public.users(id) on delete restrict,
  content text not null,
  status text not null default 'sent' check (status in ('sent', 'delivered', 'read')),
  edited boolean not null default false,
  edited_at timestamptz,
  reply_to_message_id uuid references public.messages(id) on delete set null,
  pinned boolean not null default false,
  attachments jsonb not null default '[]'::jsonb,
  mentions uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  notif_type text not null check (notif_type in ('info', 'warning', 'success', 'error', 'action_required')),
  title text not null,
  message text not null,
  is_read boolean not null default false,
  action_url text,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  account_type text not null check (account_type in ('bank', 'wallet', 'credit', 'savings', 'petty_cash', 'investment')),
  balance numeric(14,2) not null default 0,
  currency text not null default 'USD',
  status text not null default 'Active' check (status in ('Active', 'Frozen', 'Closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete restrict,
  transaction_type text not null check (transaction_type in ('income', 'expense', 'transfer', 'payroll', 'reimbursement', 'adjustment')),
  category text not null,
  description text not null,
  amount numeric(14,2) not null check (amount >= 0),
  currency text not null default 'USD',
  status text not null default 'Pending' check (status in ('Posted', 'Pending', 'Voided', 'Processing')),
  transaction_date date not null,
  created_by uuid references public.users(id) on delete set null,
  project_id uuid,
  tags text[] not null default '{}',
  reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payroll_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  month text not null,
  period text not null,
  employee_count integer not null default 0 check (employee_count >= 0),
  total_gross numeric(14,2) not null default 0 check (total_gross >= 0),
  total_deductions numeric(14,2) not null default 0 check (total_deductions >= 0),
  total_net numeric(14,2) not null default 0 check (total_net >= 0),
  currency text not null default 'USD',
  status text not null default 'Draft' check (status in ('Draft', 'Processing', 'Processed', 'Failed')),
  processed_at timestamptz,
  processed_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, month)
);

create table if not exists public.billing_invoices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  invoice_number text not null,
  period text not null,
  issue_date date not null,
  due_date date not null,
  seats integer not null default 0 check (seats >= 0),
  price_per_seat numeric(14,2) not null default 0 check (price_per_seat >= 0),
  subtotal numeric(14,2) not null default 0 check (subtotal >= 0),
  tax numeric(14,2) not null default 0 check (tax >= 0),
  amount numeric(14,2) not null default 0 check (amount >= 0),
  currency text not null default 'USD',
  status text not null default 'Pending' check (status in ('Paid', 'Pending', 'Overdue', 'Cancelled')),
  plan text not null,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, invoice_number)
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'planning',
  owner_user_id uuid references public.users(id) on delete set null,
  start_date date,
  target_end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo',
  priority text not null default 'medium',
  assignee_user_id uuid references public.users(id) on delete set null,
  due_date date,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references public.users(id) on delete set null,
  action text not null,
  target text not null,
  target_type text not null check (target_type in ('task', 'project', 'employee', 'leave', 'fine', 'finance', 'system')),
  details text,
  ip text,
  created_at timestamptz not null default now()
);

create table if not exists public.time_corrections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  session_id uuid not null references public.time_sessions(id) on delete cascade,
  original_check_in_at timestamptz not null,
  original_check_out_at timestamptz not null,
  corrected_check_in_at timestamptz not null,
  corrected_check_out_at timestamptz not null,
  reason text not null,
  status text not null default 'Pending' check (status in ('Pending', 'Approved', 'Rejected')),
  reviewed_by uuid references public.users(id) on delete set null,
  reviewed_at timestamptz,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workday_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  start_time time not null,
  end_time time not null,
  grace_period_minutes integer not null default 0 check (grace_period_minutes >= 0),
  working_days smallint[] not null default '{1,2,3,4,5}',
  timezone text not null default 'UTC',
  applies_to text[] not null default '{}',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.break_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  max_breaks integer not null default 1 check (max_breaks >= 0),
  max_break_duration integer not null default 0 check (max_break_duration >= 0),
  max_total_break_time integer not null default 0 check (max_total_break_time >= 0),
  paid_break boolean not null default false,
  applies_to text[] not null default '{}',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.message_reactions (
  message_id uuid not null references public.messages(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  emoji text not null,
  reacted_at timestamptz not null default now(),
  primary key (message_id, user_id, emoji)
);

create table if not exists public.notification_reads (
  notification_id uuid not null references public.notifications(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (notification_id, user_id)
);

create table if not exists public.reimbursements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  amount numeric(14,2) not null check (amount >= 0),
  currency text not null default 'USD',
  category text not null,
  description text not null,
  expense_date date not null,
  receipt_url text,
  status text not null default 'Pending' check (status in ('Pending', 'Approved', 'Rejected', 'Paid')),
  submitted_at timestamptz not null default now(),
  reviewed_by uuid references public.users(id) on delete set null,
  reviewed_at timestamptz,
  paid_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.expense_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  title text not null,
  period text not null,
  total_amount numeric(14,2) not null default 0 check (total_amount >= 0),
  currency text not null default 'USD',
  status text not null default 'Draft' check (status in ('Draft', 'Submitted', 'Approved', 'Rejected', 'Paid')),
  line_items jsonb not null default '[]'::jsonb,
  submitted_at timestamptz,
  approved_by uuid references public.users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.loans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  loan_type text not null check (loan_type in ('loan', 'liability', 'advance')),
  employee_id uuid references public.employees(id) on delete set null,
  creditor text not null,
  principal_amount numeric(14,2) not null check (principal_amount >= 0),
  outstanding_balance numeric(14,2) not null check (outstanding_balance >= 0),
  currency text not null default 'USD',
  interest_rate numeric(8,4) not null default 0 check (interest_rate >= 0),
  start_date date not null,
  due_date date not null,
  status text not null default 'Active' check (status in ('Active', 'Paid', 'Overdue', 'Defaulted')),
  monthly_payment numeric(14,2) not null default 0 check (monthly_payment >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cost_centers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  department_id uuid references public.departments(id) on delete set null,
  name text not null,
  budget numeric(14,2) not null default 0 check (budget >= 0),
  spent numeric(14,2) not null default 0 check (spent >= 0),
  committed numeric(14,2) not null default 0 check (committed >= 0),
  currency text not null default 'USD',
  period text not null,
  status text not null check (status in ('On Track', 'At Risk', 'Over Budget')),
  manager_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name, period)
);

create table if not exists public.finance_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  report_type text not null check (report_type in ('P&L', 'Cash Flow', 'Balance Sheet', 'Expense Summary', 'Payroll Summary', 'Project Burn')),
  title text not null,
  period text not null,
  generated_by uuid references public.users(id) on delete set null,
  file_url text,
  status text not null default 'Generating' check (status in ('Generating', 'Ready', 'Failed')),
  summary jsonb,
  generated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.payroll_postings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  payroll_run_id uuid references public.payroll_runs(id) on delete set null,
  period text not null,
  month text not null,
  total_amount numeric(14,2) not null default 0 check (total_amount >= 0),
  currency text not null default 'USD',
  employee_count integer not null default 0 check (employee_count >= 0),
  department_breakdown jsonb not null default '[]'::jsonb,
  status text not null default 'Draft' check (status in ('Draft', 'Posted', 'Reversed')),
  ledger_ref text,
  posted_at timestamptz,
  posted_by uuid references public.users(id) on delete set null,
  reversed_at timestamptz,
  reversed_by uuid references public.users(id) on delete set null,
  reversal_reason text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sprints (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  status text not null default 'planning',
  start_date date,
  end_date date,
  goal text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  status text not null default 'pending',
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.issues (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  title text not null,
  description text,
  severity text,
  status text,
  reported_by uuid references public.users(id) on delete set null,
  assigned_to uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.task_dependencies (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  from_task_id uuid not null references public.tasks(id) on delete cascade,
  to_task_id uuid not null references public.tasks(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (from_task_id, to_task_id),
  check (from_task_id <> to_task_id)
);

create table if not exists public.time_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  employee_id uuid references public.employees(id) on delete set null,
  log_date date not null,
  minutes integer not null check (minutes >= 0),
  note text,
  created_at timestamptz not null default now()
);

create index if not exists idx_time_sessions_org_created on public.time_sessions (organization_id, created_at desc);
create index if not exists idx_leave_requests_org_created on public.leave_requests (organization_id, created_at desc);
create index if not exists idx_fines_org_created on public.fines (organization_id, created_at desc);
create index if not exists idx_channels_org_created on public.channels (organization_id, created_at desc);
create index if not exists idx_messages_org_created on public.messages (organization_id, created_at desc);
create index if not exists idx_notifications_org_created on public.notifications (organization_id, created_at desc);
create index if not exists idx_accounts_org_created on public.accounts (organization_id, created_at desc);
create index if not exists idx_transactions_org_created on public.transactions (organization_id, created_at desc);
create index if not exists idx_payroll_runs_org_created on public.payroll_runs (organization_id, created_at desc);
create index if not exists idx_billing_invoices_org_created on public.billing_invoices (organization_id, created_at desc);
create index if not exists idx_projects_org_created on public.projects (organization_id, created_at desc);
create index if not exists idx_tasks_org_created on public.tasks (organization_id, created_at desc);
create index if not exists idx_activity_log_org_created on public.activity_log (organization_id, created_at desc);
create index if not exists idx_time_corrections_org_created on public.time_corrections (organization_id, created_at desc);
create index if not exists idx_workday_rules_org_created on public.workday_rules (organization_id, created_at desc);
create index if not exists idx_break_rules_org_created on public.break_rules (organization_id, created_at desc);
create index if not exists idx_reimbursements_org_created on public.reimbursements (organization_id, created_at desc);
create index if not exists idx_expense_reports_org_created on public.expense_reports (organization_id, created_at desc);
create index if not exists idx_loans_org_created on public.loans (organization_id, created_at desc);
create index if not exists idx_cost_centers_org_created on public.cost_centers (organization_id, created_at desc);
create index if not exists idx_finance_reports_org_created on public.finance_reports (organization_id, created_at desc);
create index if not exists idx_payroll_postings_org_created on public.payroll_postings (organization_id, created_at desc);
create index if not exists idx_sprints_org_created on public.sprints (organization_id, created_at desc);
create index if not exists idx_milestones_org_created on public.milestones (organization_id, created_at desc);
create index if not exists idx_issues_org_created on public.issues (organization_id, created_at desc);
create index if not exists idx_time_logs_org_created on public.time_logs (organization_id, created_at desc);

drop trigger if exists tr_time_sessions_updated_at on public.time_sessions;
create trigger tr_time_sessions_updated_at before update on public.time_sessions
for each row execute procedure public.set_updated_at();

drop trigger if exists tr_leave_requests_updated_at on public.leave_requests;
create trigger tr_leave_requests_updated_at before update on public.leave_requests
for each row execute procedure public.set_updated_at();

drop trigger if exists tr_fines_updated_at on public.fines;
create trigger tr_fines_updated_at before update on public.fines
for each row execute procedure public.set_updated_at();

drop trigger if exists tr_channels_updated_at on public.channels;
create trigger tr_channels_updated_at before update on public.channels
for each row execute procedure public.set_updated_at();

drop trigger if exists tr_messages_updated_at on public.messages;
create trigger tr_messages_updated_at before update on public.messages
for each row execute procedure public.set_updated_at();

drop trigger if exists tr_accounts_updated_at on public.accounts;
create trigger tr_accounts_updated_at before update on public.accounts
for each row execute procedure public.set_updated_at();

drop trigger if exists tr_transactions_updated_at on public.transactions;
create trigger tr_transactions_updated_at before update on public.transactions
for each row execute procedure public.set_updated_at();

drop trigger if exists tr_payroll_runs_updated_at on public.payroll_runs;
create trigger tr_payroll_runs_updated_at before update on public.payroll_runs
for each row execute procedure public.set_updated_at();

drop trigger if exists tr_billing_invoices_updated_at on public.billing_invoices;
create trigger tr_billing_invoices_updated_at before update on public.billing_invoices
for each row execute procedure public.set_updated_at();

drop trigger if exists tr_projects_updated_at on public.projects;
create trigger tr_projects_updated_at before update on public.projects
for each row execute procedure public.set_updated_at();

drop trigger if exists tr_tasks_updated_at on public.tasks;
create trigger tr_tasks_updated_at before update on public.tasks
for each row execute procedure public.set_updated_at();

drop trigger if exists tr_time_corrections_updated_at on public.time_corrections;
create trigger tr_time_corrections_updated_at before update on public.time_corrections
for each row execute procedure public.set_updated_at();

drop trigger if exists tr_workday_rules_updated_at on public.workday_rules;
create trigger tr_workday_rules_updated_at before update on public.workday_rules
for each row execute procedure public.set_updated_at();

drop trigger if exists tr_break_rules_updated_at on public.break_rules;
create trigger tr_break_rules_updated_at before update on public.break_rules
for each row execute procedure public.set_updated_at();

drop trigger if exists tr_reimbursements_updated_at on public.reimbursements;
create trigger tr_reimbursements_updated_at before update on public.reimbursements
for each row execute procedure public.set_updated_at();

drop trigger if exists tr_expense_reports_updated_at on public.expense_reports;
create trigger tr_expense_reports_updated_at before update on public.expense_reports
for each row execute procedure public.set_updated_at();

drop trigger if exists tr_loans_updated_at on public.loans;
create trigger tr_loans_updated_at before update on public.loans
for each row execute procedure public.set_updated_at();

drop trigger if exists tr_cost_centers_updated_at on public.cost_centers;
create trigger tr_cost_centers_updated_at before update on public.cost_centers
for each row execute procedure public.set_updated_at();

drop trigger if exists tr_payroll_postings_updated_at on public.payroll_postings;
create trigger tr_payroll_postings_updated_at before update on public.payroll_postings
for each row execute procedure public.set_updated_at();

drop trigger if exists tr_sprints_updated_at on public.sprints;
create trigger tr_sprints_updated_at before update on public.sprints
for each row execute procedure public.set_updated_at();

drop trigger if exists tr_milestones_updated_at on public.milestones;
create trigger tr_milestones_updated_at before update on public.milestones
for each row execute procedure public.set_updated_at();

drop trigger if exists tr_issues_updated_at on public.issues;
create trigger tr_issues_updated_at before update on public.issues
for each row execute procedure public.set_updated_at();
