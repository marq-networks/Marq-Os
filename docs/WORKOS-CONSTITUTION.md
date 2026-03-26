# WORKOS CONSTITUTION

**Version:** 1.0  
**Status:** Canonical Source of Truth  
**Last Updated:** January 7, 2026  

---

## 📜 PREAMBLE

This document establishes the foundational architecture, rules, and invariants for the WorkOS multi-organization workforce operating system. All design decisions, module implementations, and integrations MUST comply with this constitution.

**Authority:** This document supersedes all conflicting implementation decisions.  
**Immutability:** Changes require explicit constitutional amendment.  
**Enforcement:** Violations trigger immediate refactoring.

---

## 🎭 ROLE LAYERS (Canonical Names)

### 1. Platform Admin
**Purpose:** Manages the entire SaaS platform across all organizations.  
**Scope:** Multi-tenant system administration, billing, infrastructure, global settings.  
**Access:** Full system access, organization lifecycle management, platform analytics.  
**Use Case:** Platform operator managing 1000+ organizations.

### 2. Org Owner
**Purpose:** Ultimate authority within a single organization.  
**Scope:** Organization-wide settings, billing, subscription, domain configuration.  
**Access:** All Org Admin permissions + organization lifecycle decisions.  
**Use Case:** CEO/Founder who owns the account and makes final decisions.

### 3. Org Admin
**Purpose:** Day-to-day administration of an organization.  
**Scope:** User management, department structure, policies, compliance, analytics.  
**Access:** Full CRUD on users, settings, integrations; read-only on some finance.  
**Use Case:** HR Manager, IT Admin, Office Manager.

### 4. Manager
**Purpose:** Team leadership and oversight within departments/projects.  
**Scope:** Team performance, work assignment, approvals, reporting.  
**Access:** Team data, approval workflows, limited admin functions.  
**Use Case:** Engineering Manager, Team Lead, Department Head.

### 5. Employee
**Purpose:** Individual contributor performing work.  
**Scope:** Personal productivity, time tracking, task completion, expense submission.  
**Access:** Own data, assigned tasks, team information (read-only).  
**Use Case:** Developer, Designer, Analyst, any individual contributor.

---

## 🔧 TEMPORARY DEVELOPMENT MODE (No-Auth Switcher)

**Status:** ACTIVE during Phases A-D (until Phase E: Auth Last)  
**Purpose:** Enable rapid development and testing without authentication overhead.

### Role Switcher Behavior

**Location:** Top-right corner of AppShell header  
**Visibility:** Always visible (no login required)  
**Labels:**
- **"Employee"** → Employee view (`/employee/*` routes)
- **"Org Admin"** → Org Admin view (`/admin/*` and `/org/*` routes)
- **"Platform Admin"** → Platform Admin view (`/super/*` routes)

**Internal State Mapping:**
```typescript
UI Label         Internal Mode    Routes Access
─────────────────────────────────────────────────────
Employee      →  WORKSPACE     →  /employee/*
Org Admin     →  CONTROL       →  /admin/*, /org/*
Platform Admin→  PLATFORM      →  /super/*
```

### Canonical Role Consolidation

**Org Admin View** currently consolidates three constitutional roles:
- **Org Owner** (ultimate org authority)
- **Org Admin** (day-to-day admin)
- **Manager** (team leadership)

**Why Consolidated:** In development, one switcher position covers all organizational administration. In Phase E (Auth), these will be differentiated via:
- Permission granularity (Manager has limited access)
- Sub-toggles or permission-based UI filtering
- Role-specific dashboards within the Org Admin view

### Navigation Flow

**On Role Switch:**
```
Employee clicked      → Navigate to /employee/dashboard
Org Admin clicked     → Navigate to /admin/dashboard
Platform Admin clicked→ Navigate to /super/console
```

**Auto-navigation ensures:**
- Users land on appropriate default screen
- No broken routes or empty states
- Consistent UX across role switches

### Development Rules

✅ **ALLOWED (until Phase E):**
- Switch roles freely without authentication
- Access all routes across all roles
- Test cross-role workflows instantly
- View all screens without login

❌ **FORBIDDEN:**
- Implement authentication before Phase E
- Hide the role switcher
- Add login/logout flows prematurely
- Create permission checks (Phase D only)

### Phase E: Auth Transition

**When authentication is implemented (Phase E):**

1. **Remove role switcher** from UI
2. **Add login/logout** functionality
3. **Implement session management** (JWT, cookies)
4. **Role assigned by backend** (no manual switching)
5. **Permission checks** enforce role boundaries
6. **Differentiate Org Owner/Admin/Manager** via permissions

**Until then:** Role switcher remains visible and functional for all development and testing.

---

### Verification Checklist

**Current State (Pre-Auth):**
- [ ] Role switcher visible in top-right
- [ ] Three roles: Employee, Org Admin, Platform Admin
- [ ] Clicking each role navigates to correct default route
- [ ] No authentication required to switch
- [ ] All routes accessible regardless of selected role
- [ ] Internal state uses WORKSPACE/CONTROL/PLATFORM

**Phase E Requirements (Future):**
- [ ] Remove role switcher component
- [ ] Implement login screen
- [ ] Backend assigns role on authentication
- [ ] Permission system enforces role boundaries
- [ ] Org Owner/Admin/Manager differentiated

---

## 🏛️ DOMAIN MODEL (Canonical Domains)

### 1. WORK

**Owns (Data):**
- Projects (metadata, timelines, budgets, status)
- Tasks (assignments, dependencies, completion)
- Milestones (deadlines, deliverables)
- Work assignments (who does what)
- Work reports (progress, blockers)

**Owns (Workflows):**
- Project creation and lifecycle
- Task assignment and tracking
- Milestone planning
- Work progress reporting
- Team collaboration on deliverables

**Does NOT Own:**
- Employee master data (→ PEOPLE)
- Billable hours calculation (→ FINANCE)
- Time logs (→ TIME)
- Financial cost of projects (→ FINANCE)
- Communication threads (→ COMMUNICATION)

**Canonical Truth:** Work defines WHAT gets done and WHO is assigned.

---

### 2. PEOPLE

**Owns (Data):**
- Employee master records (identity, employment details)
- Organization structure (departments, teams, hierarchy)
- Roles and permissions (access control definitions)
- Employment lifecycle (hire, promote, terminate)
- Employee profiles (skills, certifications, compensation)

**Owns (Workflows):**
- Employee onboarding
- Role assignment
- Department management
- Org chart maintenance
- Employee directory

**Does NOT Own:**
- Time logs (→ TIME)
- Salary payments (→ FINANCE)
- Project assignments (→ WORK)
- Performance metrics (→ ANALYTICS)
- Leave balances (→ TIME)

**Canonical Truth:** People defines WHO exists in the organization.

---

### 3. TIME

**Owns (Data):**
- Time logs (clock in/out, duration)
- Attendance records (presence, absence)
- Leave balances (annual, sick, PTO)
- Time violations (late, early departure)
- Fines and penalties (time-based)
- Break tracking
- Session data

**Owns (Workflows):**
- Time tracking (start/stop)
- Leave request and approval
- Attendance corrections
- Fine assessment and waiver
- Break rule enforcement
- Workday rule configuration

**Does NOT Own:**
- Employee master data (→ PEOPLE)
- Payroll calculations (→ FINANCE)
- Project time allocation (→ WORK)
- Fine payment collection (→ FINANCE)

**Canonical Truth:** Time defines WHEN work happened and attendance status.

---

### 4. FINANCE

**Owns (Data):**
- Ledger entries (all financial transactions)
- Accounts and wallets (balances, bank accounts)
- Expenses and reimbursements (claims, approvals)
- Invoices and revenue (AR)
- Bills and payables (AP)
- Payroll postings (salary disbursements)
- Project costing (profit/loss by project)
- Loans and liabilities

**Owns (Workflows):**
- Transaction recording (double-entry)
- Expense approval
- Reimbursement processing
- Payroll posting
- Invoice generation
- Financial reporting
- Auto-classification (AI)

**Does NOT Own:**
- Employee records (→ PEOPLE)
- Time log data (→ TIME)
- Project metadata (→ WORK)
- Leave balances (→ TIME)

**Canonical Truth:** Finance defines HOW MUCH and WHERE money flows.

---

### 5. COMMUNICATION

**Owns (Data):**
- Messages and threads (chat, DMs)
- Channels (teams, projects, topics)
- Notifications (system alerts)
- Announcements (org-wide)
- File attachments (in context of messages)

**Owns (Workflows):**
- Messaging (send, reply, react)
- Channel management (create, archive, members)
- Notification delivery
- Search across conversations

**Does NOT Own:**
- Employee directory (→ PEOPLE)
- Project metadata (→ WORK)
- File storage master (→ PLATFORM)
- Email integration (→ INTEGRATIONS)

**Canonical Truth:** Communication defines HOW teams collaborate in real-time.

---

### 6. ANALYTICS

**Owns (Data):**
- Aggregated metrics (KPIs, trends)
- Reports (pre-built, custom)
- Dashboards (real-time, historical)
- Activity logs (user actions)
- Input counters (keyboard, mouse)
- Screenshot metadata

**Owns (Workflows):**
- Report generation
- Dashboard rendering
- Metric calculation
- Activity monitoring
- Productivity analysis

**Does NOT Own:**
- Source data (reads from all domains)
- Raw time logs (→ TIME)
- Financial transactions (→ FINANCE)
- Employee data (→ PEOPLE)

**Canonical Truth:** Analytics READS all data, OWNS no source data.

---

### 7. SECURITY & COMPLIANCE

**Owns (Data):**
- Audit logs (who did what, when)
- Access control lists (permissions)
- Consent records (GDPR, privacy)
- Data retention policies
- Security settings (2FA, SSO)
- Session tokens

**Owns (Workflows):**
- Authentication (login, SSO)
- Authorization (permission checks)
- Audit trail generation
- Compliance reporting
- Data retention enforcement

**Does NOT Own:**
- Employee identities (→ PEOPLE)
- Business data (domains own their data)
- Billing records (→ FINANCE)

**Canonical Truth:** Security GATES all access, OWNS no business data.

---

### 8. PLATFORM

**Owns (Data):**
- Organization records (tenants)
- Subscription plans (features, limits)
- Platform settings (global config)
- Billing cycles (platform-level)
- Usage quotas (API limits, storage)

**Owns (Workflows):**
- Organization provisioning
- Subscription management
- Platform billing
- Feature flag control
- System maintenance

**Does NOT Own:**
- Organization business data (domains own)
- User authentication (→ SECURITY)
- Individual org settings (→ Org Owner)

**Canonical Truth:** Platform defines WHICH orgs exist and WHAT they can access.

---

### 9. INTEGRATIONS

**Owns (Data):**
- Integration configurations (API keys, webhooks)
- Connected apps (OAuth tokens)
- Sync logs (import/export history)
- API request logs

**Owns (Workflows):**
- Third-party app connections
- Data import/export
- Webhook management
- API documentation
- Integration marketplace

**Does NOT Own:**
- Imported business data (→ respective domains)
- Employee SSO (→ SECURITY)
- Internal APIs (each domain owns)

**Canonical Truth:** Integrations define HOW external systems connect.

---

## ⚖️ DATA FLOW LAW (Mandatory Rules)

### Rule 1: TIME → triggers → FINANCE
**Law:** All time-based financial events MUST flow from TIME to FINANCE.

**Valid Flows:**
```
Time Log → Billable Hours Calculation → Finance Ledger Entry
Attendance Violation → Fine Creation → Finance Receivable
Leave Taken → Payroll Adjustment → Finance Posting
```

**Violations (FORBIDDEN):**
```
❌ Finance creating time logs
❌ Finance calculating attendance without TIME data
❌ Payroll running without TIME approval
❌ Time logs stored in Finance database
```

**Enforcement:** Finance CANNOT create time data. Finance MUST wait for TIME events.

---

### Rule 2: PEOPLE → anchors → WORK
**Law:** All work assignments MUST reference PEOPLE as the source of truth.

**Valid Flows:**
```
Employee Record → Project Assignment → Task Ownership
Department → Team Formation → Work Allocation
Role Definition → Permission → Work Access
```

**Violations (FORBIDDEN):**
```
❌ Work creating employee records
❌ Projects storing employee data separately
❌ Task assignments to non-existent employees
❌ Work domain managing org structure
```

**Enforcement:** Work CANNOT create employees. Work MUST reference PEOPLE IDs.

---

### Rule 3: WORK → produces → FINANCE
**Law:** Work activities generate financial implications that flow to FINANCE.

**Valid Flows:**
```
Project Creation → Budget Allocation → Finance Account
Task Completion → Billable Revenue → Finance Invoice
Milestone Reached → Payment Trigger → Finance Transaction
```

**Violations (FORBIDDEN):**
```
❌ Finance creating projects
❌ Work storing financial balances
❌ Projects calculating P&L independently
❌ Work bypassing Finance for billing
```

**Enforcement:** Work CANNOT do accounting. Work MUST emit financial events to FINANCE.

---

### Rule 4: FINANCE → pays → PEOPLE
**Law:** All compensation flows from FINANCE to PEOPLE.

**Valid Flows:**
```
Payroll Posting (Finance) → Employee Payment → People Record Update
Reimbursement Approval (Finance) → Payment → Employee Balance
Bonus Calculation (Finance) → Distribution → People Compensation
```

**Violations (FORBIDDEN):**
```
❌ People domain calculating salaries
❌ People domain processing payments
❌ Employee records storing financial transactions
❌ People bypassing Finance for compensation
```

**Enforcement:** People CANNOT do payments. FINANCE owns all money movement.

---

### Rule 5: ANALYTICS → reads all
**Law:** Analytics ONLY reads data; it NEVER creates source data.

**Valid Flows:**
```
Time Logs → Analytics Read → Productivity Report
Finance Ledger → Analytics Aggregate → Revenue Dashboard
Work Tasks → Analytics Query → Team Performance Metrics
```

**Violations (FORBIDDEN):**
```
❌ Analytics creating time logs
❌ Analytics modifying financial data
❌ Analytics becoming source of truth
❌ Business logic in Analytics domain
```

**Enforcement:** Analytics is READ-ONLY. All writes go to source domains.

---

### Rule 6: SECURITY → gates all
**Law:** Security MUST gate all access but OWNS no business data.

**Valid Flows:**
```
User Login → Security Check → Domain Access Granted
API Call → Security Token Validation → Data Access
Action Attempt → Permission Check → Authorization Decision
```

**Violations (FORBIDDEN):**
```
❌ Security storing employee business data
❌ Security bypassed for "admin convenience"
❌ Domains implementing their own auth
❌ Business logic in Security domain
```

**Enforcement:** All access goes through SECURITY. Security delegates to domains.

---

### Rule 7: PLATFORM → bills all
**Law:** Platform manages subscriptions; domains report usage.

**Valid Flows:**
```
Org Creation → Platform Provisioning → Subscription Active
Usage Metrics (from domains) → Platform Billing → Invoice
Feature Request → Platform Feature Flag → Access Granted
```

**Violations (FORBIDDEN):**
```
❌ Platform accessing org business data directly
❌ Domains handling their own billing
❌ Platform creating employee records
❌ Platform bypassing org ownership
```

**Enforcement:** Platform is TENANT-AWARE but DATA-AGNOSTIC.

---

## 📋 MODULE REGISTRY (Exhaustive Inventory)

### WORK DOMAIN

**Employee View:**
- **My Work** (`/employee/my-work`) - Personal task dashboard, assigned work
- **My Tasks** - Individual task list (if separate from My Work)

**Admin View:**
- **Work Home** (`/admin/work-home`) - Work domain dashboard, overview
- **Projects** (`/admin/projects`) - Project management, CRUD, timelines
- **Tasks** (`/admin/tasks`) - Task management across projects
- **Milestones** (`/admin/milestones`) - Project milestones, deadlines
- **Assignments** (`/admin/assignments`) - Work allocation to employees
- **Work Reports** (`/admin/work-reports`) - Progress tracking, status reports

**Platform View:**
- None (work is org-scoped)

---

### PEOPLE DOMAIN

**Employee View:**
- None (employees see limited profile via settings)

**Admin View:**
- **Employees** (`/admin/users`) - Employee directory, management (P01)
- **Members** (`/admin/members`) - Team membership (alternate view)
- **Departments** (`/admin/departments`) - Department structure, management
- **Roles & Access** (`/admin/roles-access`) - Permission management

**Platform View:**
- None (people are org-scoped)

---

### TIME DOMAIN

**Employee View:**
- **Time Tracking** (`/employee/time-tracking`) - Clock in/out, personal logs
- **My Fines** (`/employee/my-fines`) - Personal fine history, appeals

**Admin View:**
- **Time Tracking** (`/admin/time-logs`) - All employee time logs
- **Sessions** (`/admin/sessions`) - Active sessions, monitoring
- **Corrections** (`/admin/corrections`) - Time log correction approvals
- **Workday Rules** (`/admin/workday-rules`) - Working hours configuration
- **Break Rules** (`/admin/break-rules`) - Break policy configuration
- **Fines** (`/admin/fines`) - Fine management, waivers (AT01)
- **Leave Management** (`/admin/leave-management`) - Leave policies, quotas
- **Leave Approvals** (`/admin/leave-approvals`) - Leave request approvals

**Platform View:**
- None (time is org-scoped)

---

### FINANCE DOMAIN

**Employee View:**
- None (employees submit via reimbursements if needed)

**Admin/Org Owner View:**
- **Cockpit** (`/org/finance/cockpit`) - Financial dashboard, 2050 design
- **Inbox (Approvals)** (`/org/finance/inbox`) - Pending approvals, classifications
- **Quick Add** (`/org/finance/quick-add`) - Rapid transaction entry
- **Ledger** (`/org/finance/ledger-control`) - Immutable ledger view
- **Accounts & Wallets** (`/org/finance/accounts`) - Bank accounts, cash management
- **Import Center** (`/org/finance/import`) - CSV/bank feed imports
- **Review & Decide** (`/org/finance/review`) - Classification queue
- **Reimbursements** (`/org/finance/reimbursements`) - Employee expense claims
- **Payroll Posting** (`/org/finance/payroll-posting`) - Salary disbursements
- **Costing & Profit** (`/org/finance/costing-profit`) - Project P&L
- **Reports** (`/org/finance/reports`) - Financial reports, P&L, balance sheet
- **Loans & Liabilities** (`/org/finance/loans`) - Debt tracking
- **Team & Permissions** (`/org/finance/team-permissions`) - Finance team access
- **Finance Settings** (`/org/finance/settings`) - Chart of accounts, rules
- **Billing** (`/admin/billing`) - Org subscription billing (if org-managed)
- **Billing Plans** (`/admin/billing-plans`) - Plan selection (if org-managed)

**Platform View:**
- **Platform Billing** - Global subscription management (if platform admin needs it)

---

### COMMUNICATION DOMAIN

**Employee View:**
- **Communicate** (`/employee/communicate`) - Personal inbox, DMs, channels

**Admin View:**
- **Communicate** (`/admin/communicate`) - Org-wide channels, management (AC01)
- **Channel Management** (`/admin/channel-management`) - Create, archive channels (AC02)
- **Channel View** (`/admin/channel-view`) - Channel details, members (AC03)
- **Bot Integration Manager** (`/admin/bot-integration-manager`) - Chat bot config (AC04)

**Platform View:**
- None (communication is org-scoped)

**Belongs Here:**
- Direct messages, group chats
- Channel discussions
- Notifications (system-generated)
- Announcements (org-wide broadcasts)
- File sharing (in message context)

**Does NOT Belong:**
- Email (→ INTEGRATIONS)
- External chat (→ INTEGRATIONS)
- Video calls (→ INTEGRATIONS if not native)

---

### ANALYTICS DOMAIN

**Employee View:**
- None (employees see limited personal stats if any)

**Admin View:**
- **Live Activity** (`/admin/live-activity`) - Real-time user activity (A02)
- **Activity Overview** (`/admin/activity-overview`) - Activity summaries (A13)
- **Input Counters** (`/admin/input-counters`) - Keyboard/mouse tracking (A15)
- **Screenshot Review** (`/admin/screenshot-review`) - Screenshot management (A16)
- **App Reports** (`/admin/app-reports`) - Application usage reports (A14)
- **Analytics** (`/admin/analytics`) - Custom analytics dashboard (A18)
- **Reports** (`/admin/reports`) - General reporting (A19)
- **Offline Sync** (`/admin/offline-sync`) - Sync status (A17)

**Platform View:**
- **Platform Analytics** - Multi-org metrics, usage trends

**Belongs Here:**
- KPI dashboards
- Productivity metrics
- Activity monitoring
- Custom reports
- Data visualization

**Does NOT Belong:**
- Source data storage (reads from domains)
- Business logic (domains own)
- Transaction creation (read-only)

---

### SECURITY & COMPLIANCE DOMAIN

**Employee View:**
- None (employees interact via consent prompts, settings)

**Admin View:**
- **Consent & Privacy** (`/admin/consent`) - GDPR consent management (A20)
- **Data Retention** (`/admin/data-retention`) - Retention policies (A21)
- **Audit Logs** (`/admin/audit-logs`) - Security audit trail (A22)
- **Security** (`/admin/security`) - Security settings, 2FA, SSO (A23)

**Platform View:**
- **Platform Security** - Global security policies, threat monitoring

**Belongs Here:**
- Authentication (login, SSO, 2FA)
- Authorization (role checks, permissions)
- Audit trails (who did what)
- Compliance (GDPR, SOC2)
- Session management

**Does NOT Belong:**
- Business data (domains own)
- Employee master data (→ PEOPLE)
- Financial compliance (→ FINANCE for rules)

---

### PLATFORM DOMAIN

**Employee View:**
- None

**Admin/Org Owner View:**
- **Org Settings** (`/admin/settings`) - Organization configuration (A30)

**Platform View:**
- **Platform Settings** (`/super/platform-settings`) - Global platform config
- **Organizations** (`/super/organizations`) - Tenant management
- **Subscriptions** - Plan management (if exists)
- **Platform Billing** - Multi-org billing (if separate from org billing)

**Belongs Here:**
- Organization lifecycle (create, suspend, delete)
- Subscription plans (features, limits)
- Platform-level billing (SaaS revenue)
- Feature flags (global toggles)
- System maintenance

**Does NOT Belong:**
- Org business data (domains own)
- User management (→ PEOPLE within org)
- Org-specific settings (→ Org Owner view)

---

### INTEGRATIONS DOMAIN

**Employee View:**
- None

**Admin View:**
- **Integrations** (`/admin/integrations`) - Connected apps, OAuth (A27)
- **API Docs** (`/admin/api-docs`) - API documentation viewer (A28)

**Platform View:**
- **Integration Marketplace** - Available integrations catalog

**Belongs Here:**
- Third-party app connections (Slack, Google, etc.)
- OAuth flows (connect external accounts)
- Webhooks (inbound/outbound)
- API management (keys, rate limits)
- Data import/export (CSV, bank feeds)

**Does NOT Belong:**
- Native features (build in domains)
- Internal APIs (each domain exposes)
- SSO authentication (→ SECURITY)

---

## 🎨 UX BINDING RULES

### Rule 1: Single Source of Truth for Navigation
**Law:** All navigation MUST be defined in `/src/app/data/navigation.ts`.

**Requirements:**
- ONE navigation config file, NO duplicates
- Employee, Admin, Platform arrays clearly separated
- No hardcoded nav in components
- All routes declared in nav config

**Verification:**
```
[ ] navigation.ts exists and is the ONLY nav definition
[ ] No nav items hardcoded in AppShell or SidebarNav
[ ] All routes in App.tsx match nav config paths
[ ] No orphaned routes (routes without nav entries)
```

---

### Rule 2: No Duplicated Shells/Layouts
**Law:** ONE AppShell, ONE layout system.

**Requirements:**
- AppShell wraps all views
- PageLayout for consistent page structure
- No per-domain custom shells
- Reuse existing layout components

**Verification:**
```
[ ] Only one AppShell component exists
[ ] All screens use PageLayout or DataTable
[ ] No custom layout shells per domain
[ ] Styling system (Tailwind v4) consistent across all pages
```

---

### Rule 3: No "Report Pages" Auto-Created
**Law:** Do NOT create generic "report pages" in Platform Admin or Super Admin.

**Requirements:**
- Platform Admin sees ONLY platform-scoped data (orgs, billing)
- Org Admin sees org-scoped reports in ANALYTICS domain
- Reports belong in their respective domains (Finance Reports in Finance, etc.)
- No duplication of reports across role views

**Verification:**
```
[ ] Platform Admin has NO business data reports
[ ] Platform Admin sees only: orgs, subscriptions, platform analytics
[ ] Org Admin sees domain reports in correct domains
[ ] No "generic reports" in Platform Admin sidebar
```

---

### Rule 4: Diagnostics Output Policy
**Law:** Diagnostic outputs MUST be written to `/docs/diagnostics/*.md` ONLY. Never create routes or UI screens for diagnostics.

**Requirements:**
- All diagnostic outputs write to `/docs/diagnostics/` directory
- Diagnostics are markdown files (`.md` format)
- NO diagnostic routes in any role view (Employee/Admin/Platform)
- NO diagnostic screens/components/pages created
- Diagnostics remain accessible via file system only

**Rationale:**
- Prevents route/screen proliferation
- Keeps diagnostic data separate from production UI
- Maintains clean navigation structure
- Diagnostics are development artifacts, not user features

**Allowed Diagnostic Outputs:**
```
✅ /docs/diagnostics/navigation-audit.md
✅ /docs/diagnostics/data-flow-check.md
✅ /docs/diagnostics/route-coverage.md
✅ /docs/diagnostics/domain-boundaries.md
✅ /docs/diagnostics/skeleton-compliance.md
```

**Forbidden Diagnostic Outputs:**
```
❌ /super/diagnostics (route)
❌ /admin/system-diagnostics (route)
❌ DiagnosticsScreen.tsx (component)
❌ SystemHealthDashboard.tsx (unless Platform Admin feature)
❌ Any diagnostic route in navigation.ts
```

**Verification:**
```
[ ] No diagnostic routes in App.tsx
[ ] No diagnostic items in navigation.ts
[ ] All diagnostics in /docs/diagnostics/ directory
[ ] Diagnostic files are markdown only
[ ] No DiagnosticScreen components in /src/app/components/
```

**Exception:**
- Platform Admin MAY have a "System Health" screen if it's a production feature for monitoring platform status (not a diagnostic dump).
- Such screens must be intentional features in the Module Registry, not auto-generated reports.

---

### Rule 5: View Switcher Visibility
**Law:** Role switcher MUST remain visible for development; auth comes last.

**Requirements:**
- Employee/Admin/Super switcher always visible (no auth wall)
- Open access during development
- Auth implementation ONLY in Phase E (final)
- No login flows until explicitly built

**Verification:**
```
[ ] View switcher visible in all environments
[ ] No authentication required to access any view
[ ] All three role views accessible via switcher
[ ] Login/logout NOT implemented (Phase E only)
```

---

### Rule 6: Semantic Sidebar Organization
**Law:** Sidebar MUST follow 5-layer semantic OS structure (as of Phase 4.2).

**Structure:**
```
EXECUTION OS
├─ Work (projects, tasks, assignments)
└─ Communication (chat, channels)

ORGANIZATION OS
├─ People (employees, departments, roles)
└─ Time (tracking, leave, fines)

BUSINESS OS
└─ Finance (ledger, payroll, reporting)

INTELLIGENCE OS
└─ Analytics (reports, dashboards, activity)

PLATFORM OS
├─ Security (audit, compliance, access)
├─ Platform (settings, integrations)
└─ Platform Admin (orgs, billing) [Platform view only]
```

**Verification:**
```
[ ] Sidebar follows 5-layer structure
[ ] No items outside these layers
[ ] All 57 nav items placed correctly (14 Employee, 33 Admin, 10 Platform)
[ ] No duplicate items across layers
```

---

### Rule 7: Route Naming Consistency
**Law:** Routes MUST follow consistent patterns.

**Patterns:**
```
Employee:   /employee/{domain-item}
Admin:      /admin/{domain-item}
Org Owner:  /org/{domain}/{item}
Platform:   /super/{item}
```

**Examples:**
```
✅ /employee/my-work
✅ /admin/users
✅ /org/finance/cockpit
✅ /super/organizations

❌ /admin/employee-list (use /admin/users)
❌ /org/finance-cockpit (missing domain separator)
❌ /super/admin/orgs (extra nesting)
```

**Verification:**
```
[ ] All routes follow role prefix pattern
[ ] No inconsistent naming (users vs employees)
[ ] Finance routes use /org/finance/* pattern
[ ] Platform routes use /super/* pattern
```

---

## 🗺️ BUILD ORDER ROADMAP

### PHASE A: SKELETON (Nav + Routes + Stubs)
**Goal:** Navigation structure exists, all routes render SOMETHING.

**Tasks:**
1. Create navigation.ts with all 57+ items
2. Define all route paths in App.tsx
3. Create stub components (empty PageLayout)
4. Wire routes to stubs
5. Verify: Click any nav item → page loads (even if empty)

**Deliverables:**
- [ ] navigation.ts with employee/admin/platform arrays
- [ ] App.tsx with all <Route> definitions
- [ ] Stub components for every route
- [ ] Zero 404s when clicking nav items

**Success Criteria:**
- All nav items clickable
- All routes render (even empty)
- View switcher works
- No broken links

---

### PHASE B: Screen Stubs + Dummy Data
**Goal:** All screens show realistic UI with mock data.

**Tasks:**
1. Replace empty stubs with PageLayout + KPI cards
2. Create mockData.ts files per domain
3. Add DataTable components with sample data
4. Add StatusBadge, Button components
5. Verify: Every screen looks "real" but non-functional

**Deliverables:**
- [ ] mockData.ts files (employeeData, finesData, etc.)
- [ ] All screens use PageLayout
- [ ] KPI cards on all dashboards
- [ ] DataTables with sample rows

**Success Criteria:**
- All screens visually complete
- Mock data realistic
- UI components consistent
- No "TODO" placeholders

---

### PHASE C: Wiring + Flows
**Goal:** Inter-domain flows work (TIME → FINANCE, etc.).

**Tasks:**
1. Implement data flow rules (TIME triggers FINANCE)
2. Link employee IDs across domains
3. Add toast notifications for actions
4. Wire filters, search, bulk operations
5. Implement cross-module navigation (e.g., correction → fine)

**Deliverables:**
- [ ] Data Flow Law implemented
- [ ] Employee IDs consistent across modules
- [ ] Correction → Fine linking works
- [ ] Work → Finance cost tracking works
- [ ] Toast system functional

**Success Criteria:**
- Can create fine from correction
- Time logs linked to employees
- Finance shows project costs
- All cross-references resolve

---

### PHASE D: Polish + Permissions
**Goal:** Production-ready UI, role-based visibility.

**Tasks:**
1. Implement role-based nav filtering
2. Add permission checks (manager vs employee)
3. Polish UI (animations, loading states)
4. Add form validation
5. Implement modals (add employee, create fine, etc.)

**Deliverables:**
- [ ] Role-based nav (employee sees 14 items, admin sees 33)
- [ ] Permission system (can't edit if not admin)
- [ ] All modals functional (add, edit, delete)
- [ ] Form validation working
- [ ] Loading states, error handling

**Success Criteria:**
- Employees can't access admin routes
- Managers see approval queues
- Forms validate before submit
- Modals open/close smoothly

---

### PHASE E: Auth Last
**Goal:** Authentication, real user accounts, production deployment.

**Tasks:**
1. Implement login/logout
2. Add session management
3. Integrate SSO (if needed)
4. Remove view switcher (use real auth)
5. Deploy to production

**Deliverables:**
- [ ] Login screen functional
- [ ] Session persistence (JWT, cookies)
- [ ] SSO integration (Google, Microsoft)
- [ ] View switcher replaced with real auth
- [ ] Production deployment

**Success Criteria:**
- Users must log in
- Roles assigned via backend
- Session timeout works
- SSO login works
- View switcher removed

---

## 🔍 VERIFICATION CHECKLISTS

### Constitutional Compliance Checklist
Run this before any major release:

**Role Layers:**
- [ ] All 5 roles clearly defined (Platform, Org Owner, Org Admin, Manager, Employee)
- [ ] No ambiguous roles (e.g., "Super User" instead of Platform Admin)
- [ ] Role purposes documented

**Domain Model:**
- [ ] All 9 domains exist (WORK, PEOPLE, TIME, FINANCE, COMM, ANALYTICS, SECURITY, PLATFORM, INTEGRATIONS)
- [ ] Each domain has clear ownership rules
- [ ] No domain overlap (e.g., TIME and PEOPLE both storing employee data)

**Data Flow Law:**
- [ ] TIME → FINANCE flow implemented
- [ ] PEOPLE → WORK anchoring works
- [ ] WORK → FINANCE cost tracking works
- [ ] FINANCE → PEOPLE payment flow exists
- [ ] ANALYTICS read-only (no writes)
- [ ] SECURITY gates all access
- [ ] PLATFORM bills all orgs

**Module Registry:**
- [ ] All modules listed in this doc exist in nav
- [ ] No unlisted modules in nav (orphans)
- [ ] All modules in correct domains

**UX Binding:**
- [ ] Single navigation.ts source of truth
- [ ] No duplicate shells/layouts
- [ ] No report pages in Platform Admin
- [ ] View switcher visible (until Phase E)

---

### Data Flow Validation Checklist

**TIME → FINANCE:**
- [ ] Time logs trigger billable hours calculation
- [ ] Fines create finance receivables
- [ ] Leave taken adjusts payroll
- [ ] Finance CANNOT create time data

**PEOPLE → WORK:**
- [ ] Projects reference employee IDs from PEOPLE
- [ ] Task assignments validate employee existence
- [ ] Work CANNOT create employees

**WORK → FINANCE:**
- [ ] Projects create budget allocations
- [ ] Milestones trigger payment events
- [ ] Work costing feeds into Finance P&L
- [ ] Work CANNOT store balances

**FINANCE → PEOPLE:**
- [ ] Payroll postings update employee records
- [ ] Reimbursements paid via FINANCE
- [ ] PEOPLE CANNOT process payments

**ANALYTICS → ALL:**
- [ ] Analytics reads TIME logs (read-only)
- [ ] Analytics reads FINANCE ledger (read-only)
- [ ] Analytics reads WORK tasks (read-only)
- [ ] Analytics CANNOT write to any domain

**SECURITY → ALL:**
- [ ] All routes protected by auth (Phase E)
- [ ] All API calls validate permissions
- [ ] Audit logs capture all actions
- [ ] Security CANNOT own business data

---

### Navigation Audit Checklist

**Sidebar Structure:**
- [ ] Employee view: 14 items
- [ ] Admin view: 33 items
- [ ] Platform Admin view: 10 items
- [ ] All items in correct semantic layers (5 layers)

**Route Consistency:**
- [ ] All nav items have matching routes
- [ ] All routes have nav entries (no orphans)
- [ ] Route naming follows pattern (/employee/*, /admin/*, /org/*, /super/*)

**No Dead Links:**
- [ ] Every nav item clickable
- [ ] Every route renders (no 404s)
- [ ] Breadcrumbs work (if implemented)

---

### Skeleton Lock Audit

**Rules Enforced:**
- [ ] NO new routes created outside agreed skeleton
- [ ] NO new domains added
- [ ] NO new role layers invented
- [ ] NO duplicate layouts/shells
- [ ] NO breaking changes to navigation.ts structure

**Phase Compliance:**
- [ ] Currently in Phase: _____ (A/B/C/D/E)
- [ ] All Phase A tasks complete (if past A)
- [ ] All Phase B tasks complete (if past B)
- [ ] All Phase C tasks complete (if past C)
- [ ] All Phase D tasks complete (if past D)
- [ ] Phase E NOT started (auth last)

---

## 📊 CURRENT STATE SNAPSHOT

**Last Updated:** January 7, 2026  
**Current Phase:** B/C (Screen stubs exist, wiring in progress)  
**Total Routes:** 57+  
**Domains Implemented:** 9/9 (all defined)  
**Data Flow Rules:** 4/7 implemented (TIME→FINANCE, PEOPLE→WORK, WORK→FINANCE, Corrections→Fines)

**Recent Milestones:**
- ✅ Phase 4.2: NAV-TO-ROUTE FIX (100% navigation coverage)
- ✅ PEOPLE → EMPLOYEES CORE LAYER (10 employees, 51 fields)
- ✅ TIME → FINES + CORRECTIONS (28 fines, correction linking)
- ✅ FINANCE module (13 screens, 2050 Cockpit, immutable ledger)
- ✅ WORK module (5 screens, Zoho-style execution)
- ✅ COMMUNICATE module (7 screens, 3-panel Cliq-style)

**Pending Work:**
- [ ] Complete ANALYTICS domain screens
- [ ] Complete SECURITY domain screens
- [ ] Add employee detail routing (P02)
- [ ] Implement add/edit modals (employees, fines)
- [ ] Build org chart visualization
- [ ] Add real-time WebSocket (Communication)

---

## 🚨 VIOLATION EXAMPLES (Learn from These)

### ❌ VIOLATION 1: Finance Creating Time Logs
**What Happened:**
```javascript
// WRONG: Finance domain creating time data
function processPayroll() {
  const timeLog = createTimeLog(employeeId, hours); // ❌
  const payment = calculateSalary(timeLog);
  postToLedger(payment);
}
```

**Why Wrong:** Finance does NOT own time data. This violates Data Flow Law Rule 1.

**Correct Approach:**
```javascript
// RIGHT: Finance reads TIME data
function processPayroll() {
  const timeLogs = TIME.getApprovedLogs(employeeId); // ✅ Read from TIME
  const payment = calculateSalary(timeLogs);
  postToLedger(payment);
}
```

---

### ❌ VIOLATION 2: Work Storing Employee Data
**What Happened:**
```javascript
// WRONG: Work domain duplicating employee data
const project = {
  id: 'proj-1',
  name: 'Website Redesign',
  team: [
    { id: 'emp-1', name: 'Sarah', email: 'sarah@co.com' } // ❌ Duplicate
  ]
};
```

**Why Wrong:** PEOPLE owns employee master data. This violates Data Flow Law Rule 2.

**Correct Approach:**
```javascript
// RIGHT: Work references PEOPLE
const project = {
  id: 'proj-1',
  name: 'Website Redesign',
  teamIds: ['emp-1', 'emp-2'] // ✅ Reference only
};

// Resolve via PEOPLE domain
const team = project.teamIds.map(id => PEOPLE.getEmployee(id));
```

---

### ❌ VIOLATION 3: Analytics Modifying Data
**What Happened:**
```javascript
// WRONG: Analytics creating/updating data
function generateReport() {
  const metrics = calculateMetrics();
  updateEmployeePerformance(metrics); // ❌ Write operation
  return metrics;
}
```

**Why Wrong:** Analytics is READ-ONLY. This violates Data Flow Law Rule 5.

**Correct Approach:**
```javascript
// RIGHT: Analytics only reads
function generateReport() {
  const timeLogs = TIME.getLogs(); // ✅ Read
  const tasks = WORK.getTasks(); // ✅ Read
  const metrics = calculateMetrics(timeLogs, tasks);
  return metrics; // ✅ No writes
}
```

---

### ❌ VIOLATION 4: Creating "Super Reports" in Platform Admin
**What Happened:**
```
Platform Admin Sidebar:
├─ Organizations
├─ Billing
├─ Employee Reports  ❌ WRONG
├─ Financial Reports ❌ WRONG
└─ Project Reports   ❌ WRONG
```

**Why Wrong:** Platform Admin sees platform data ONLY. Org reports belong in Org Admin.

**Correct Approach:**
```
Platform Admin Sidebar:
├─ Organizations (multi-tenant)
├─ Subscriptions (platform billing)
├─ Platform Analytics (usage trends across orgs)
└─ Platform Settings

Org Admin Sidebar → ANALYTICS:
├─ Employee Reports
├─ Financial Reports (or in FINANCE domain)
└─ Project Reports (or in WORK domain)
```

---

### ❌ VIOLATION 5: Bypassing Security for "Admin Convenience"
**What Happened:**
```javascript
// WRONG: Skipping auth for admins
function getEmployeeData(userId) {
  if (currentUser.role === 'admin') {
    return db.employees.get(userId); // ❌ No auth check
  }
  return SECURITY.checkPermission(userId, 'read:employees'); // ✅ Only for non-admins
}
```

**Why Wrong:** ALL access goes through SECURITY. No exceptions.

**Correct Approach:**
```javascript
// RIGHT: Everyone goes through security
function getEmployeeData(userId) {
  const hasPermission = SECURITY.checkPermission(currentUser, 'read:employees', userId);
  if (!hasPermission) throw new ForbiddenError();
  return db.employees.get(userId); // ✅ After auth
}
```

---

## 🎯 CONSTITUTIONAL AMENDMENTS

Any changes to this constitution require:

1. **Justification:** Why is the change needed?
2. **Impact Analysis:** What breaks? What needs updating?
3. **Migration Plan:** How do we transition?
4. **Documentation Update:** Update this doc + all affected docs
5. **Approval:** (Define approval process: architect, lead, etc.)

**Amendment Log:**
```
Version 1.0 (2026-01-07): Initial constitution
- Defined 5 role layers
- Defined 9 domains
- Established 7 data flow laws
- Catalogued 57+ modules
- Set UX binding rules
- Outlined 5-phase roadmap
```

---

## 📚 RELATED DOCUMENTS

- **Architecture Decision Records (ADRs):** `/docs/adrs/` (if exists)
- **API Documentation:** `/docs/api/` (if exists)
- **Domain Models:** `/docs/domains/` (if exists)
- **Installation Guides:** `/PHASE-*.md` (root level)
- **Quick Start Guides:** `/PEOPLE-LAYER-QUICK-START.md`, `/TIME-FINES-QUICK-TEST.md`

---

## ✅ FINAL AUTHORITY

This document is the **SINGLE SOURCE OF TRUTH** for:
- Role definitions
- Domain boundaries
- Data flow rules
- Module organization
- UX conventions
- Build sequencing

**When in doubt, consult this constitution.**

**When this conflicts with code, FIX THE CODE.**

**When this is incomplete, AMEND THIS DOCUMENT FIRST.**

---

**END OF WORKOS CONSTITUTION v1.0**