# WorkOS Navigation Skeleton Core — SYSTEM LAW

**Status:** IMMUTABLE SYSTEM LAW 🔒  
**Authority:** WorkOS Constitution — Navigation Architecture  
**Foundation:** Role Boundary Core v1.0.0  
**Version:** 1.0.0  
**Date:** January 7, 2026

---

## 🎯 Executive Summary

This document defines the **permanent, immutable navigation architecture** for all WorkOS user roles. Navigation is **role-isolated and non-overlapping** — each brain sees only what it has permission to access.

### **Three Navigation Universes**

1. **EMPLOYEE** — Personal Workspace (Own Data Only)
2. **ORG ADMIN** — Control Center (Org-Wide Control)
3. **PLATFORM ADMIN** — Platform Console (Cross-Org Operations)

**Critical Principle:** No role can see another role's navigation tree. Navigation is permission-enforced and context-aware.

---

## 📋 Table of Contents

1. [Navigation Architecture Overview](#navigation-architecture-overview)
2. [EMPLOYEE Navigation Universe](#employee-navigation-universe)
3. [ORG ADMIN Navigation Universe](#org-admin-navigation-universe)
4. [PLATFORM ADMIN Navigation Universe](#platform-admin-navigation-universe)
5. [Domain Visibility Matrix](#domain-visibility-matrix)
6. [Screen Access Matrix](#screen-access-matrix)
7. [Breadcrumb Rules](#breadcrumb-rules)
8. [Cross-OS Linking Rules](#cross-os-linking-rules)
9. [Default Landing Pages](#default-landing-pages)
10. [Escalation Paths](#escalation-paths)
11. [Navigation State Management](#navigation-state-management)
12. [Implementation Rules](#implementation-rules)

---

# 1. Navigation Architecture Overview

## 1.1 Core Principles

### **Principle 1: Role Isolation**
```
Each role operates in a completely separate navigation universe.
No crossover. No shared navigation trees. No confusion.

EMPLOYEE      ORG ADMIN      PLATFORM ADMIN
   🔒            🔒              🔒
   ↓             ↓               ↓
Personal      Control        Platform
Workspace     Center         Console
```

### **Principle 2: Permission-First Navigation**
```
Navigation is built FROM permissions, not TO permissions.
If you can't access it, you can't see it.
No "disabled" menu items. Hide completely.
```

### **Principle 3: Contextual Hierarchy**
```
Navigation depth matches operational need:
• EMPLOYEE: Shallow (focus on personal tasks)
• ORG ADMIN: Deep (comprehensive org control)
• PLATFORM ADMIN: Wide (cross-org visibility)
```

### **Principle 4: Default Landing Intelligence**
```
Each role lands on their most critical screen:
• EMPLOYEE → My Work Dashboard
• ORG ADMIN → Admin Dashboard (Live Activity)
• PLATFORM ADMIN → Platform Console
```

---

## 1.2 Navigation Component Hierarchy

```
NAVIGATION SYSTEM
├─ Top Bar
│  ├─ Logo (WorkOS)
│  ├─ Role Indicator
│  ├─ Search (role-scoped)
│  ├─ Notifications
│  └─ User Menu
│     ├─ Profile
│     ├─ Settings (personal)
│     └─ Logout
│
├─ Sidebar (ROLE-SPECIFIC)
│  ├─ Primary Navigation
│  │  ├─ Domain Groups
│  │  └─ Module Links
│  └─ Footer
│     └─ Help/Support
│
├─ Breadcrumbs (contextual)
│  └─ Path Trail
│
└─ Content Area
   ├─ Page Header
   ├─ Action Bar
   └─ Main Content
```

---

# 2. EMPLOYEE Navigation Universe

## 2.1 Philosophy: Personal Workspace

**Core Focus:** My data, my work, my submissions  
**Visibility:** Own records only  
**Depth:** Shallow — focus on daily tasks  
**Style:** Task-oriented, simple, uncluttered

---

## 2.2 EMPLOYEE Sidebar Tree

```
╔══════════════════════════════════════════════════════════════╗
║                     WORKOS — EMPLOYEE                        ║
╚══════════════════════════════════════════════════════════════╝

🏠 My Dashboard                                    [/dashboard]
   └─ Quick Actions
   └─ Today's Summary
   └─ Recent Activity
   └─ Upcoming Leave

━━━━━━━━━ MY WORKSPACE ━━━━━━━━━━

📋 My Work                                         [/work]
   ├─ 📊 Work Home                                 [/work]
   ├─ ✅ My Tasks                                  [/work/tasks]
   └─ 📌 My Assignments                            [/work/assignments]

⏱️  My Time                                        [/time]
   ├─ ⏱️  Tracking                                 [/time/tracking]
   ├─ 📝 My Sessions                               [/time/sessions]
   ├─ 🏖️  Leave Requests                          [/time/leave-requests]
   └─ ⚠️  My Fines                                 [/time/fines]

💰 My Money                                        [/finance]
   ├─ 💵 My Earnings                               [/finance/my-earnings]
   ├─ 📄 Payslips                                  [/finance/payslips]
   ├─ 🧾 Submit Expense                            [/finance/submit-expense]
   └─ 📋 My Submissions                            [/finance/my-submissions]

💬 Messages                                        [/communicate]
   ├─ 💬 My Conversations                          [/communicate/channels]
   └─ 👤 Direct Messages                           [/communicate/dms]

━━━━━━━━━ PERSONAL ━━━━━━━━━━

📈 My Activity                                     [/analytics]
   ├─ 📊 Overview                                  [/analytics/activity-overview]
   └─ 📈 My Analytics                              [/analytics/my-analytics]

👤 Profile                                         [/profile]
   ├─ 📝 Edit Profile
   ├─ 🔒 Privacy Settings
   └─ 🔔 Notification Preferences

━━━━━━━━━ ORGANIZATION ━━━━━━━━━━

📖 Company                                         
   ├─ 👥 Team Directory                            [/people/directory]
   ├─ 📚 Policies (Read-Only)                      [/organization/policies]
   └─ ℹ️  About                                    [/organization/about]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔔 Notifications                                   [/notifications]
❓ Help & Support                                  [/help]
🚪 Logout

╚══════════════════════════════════════════════════════════════╝
```

---

## 2.3 EMPLOYEE Domain Visibility

| Domain | Visibility | Access Level | Notes |
|--------|-----------|--------------|-------|
| **Execution OS** | ✅ Partial | Own work only | Tasks, assignments (own) |
| **People OS** | ✅ Limited | Directory view | Names/roles only, no salary |
| **Time OS** | ✅ Full | Own data only | Track, view, request leave |
| **Finance OS** | ✅ Partial | Own money only | Earnings, expenses, payslips |
| **Organization OS** | ✅ Read-Only | Basic info | Policies, company info |
| **Business OS** | ❌ Hidden | None | No access |
| **Intelligence OS** | ✅ Partial | Own activity | Own analytics only |
| **Platform OS** | ❌ Hidden | None | No access |
| **Security & Compliance** | ✅ Partial | Own consent | Own privacy settings |
| **Integrations** | ❌ Hidden | None | No access |
| **Billing** | ❌ Hidden | None | No access |

---

## 2.4 EMPLOYEE Screen Access Matrix

### **✅ OPERATIONAL (Full Access)**

| Screen | Route | Actions |
|--------|-------|---------|
| My Dashboard | `/dashboard` | View, interact |
| Work Home | `/work` | View own work |
| My Tasks | `/work/tasks` | Create, update, complete |
| My Assignments | `/work/assignments` | View, update status |
| Time Tracking | `/time/tracking` | Start/stop timer, manual log |
| My Sessions | `/time/sessions` | View, manage active |
| Leave Requests | `/time/leave-requests` | Create, view, cancel pending |
| My Fines | `/time/fines` | View only |
| My Earnings | `/finance/my-earnings` | View only |
| Payslips | `/finance/payslips` | View, download |
| Submit Expense | `/finance/submit-expense` | Create, submit |
| My Submissions | `/finance/my-submissions` | View, edit pending |
| My Conversations | `/communicate/channels` | View, send messages |
| Direct Messages | `/communicate/dms` | View, send DMs |
| Activity Overview | `/analytics/activity-overview` | View own |
| My Analytics | `/analytics/my-analytics` | View own |
| Profile | `/profile` | Edit limited fields |

### **👁️ READ-ONLY**

| Screen | Route | Restrictions |
|--------|-------|-------------|
| Team Directory | `/people/directory` | View names/roles only |
| Company Policies | `/organization/policies` | Read only, no edit |
| Company About | `/organization/about` | Read only |

### **🚫 FORBIDDEN (Hidden/No Access)**

```
All screens not listed above, including:
• Org-wide work management
• Employee management
• Org-wide time tracking
• Org-wide finance
• Admin dashboards
• Analytics (team/org)
• Security settings (org)
• Integrations
• Billing
• Platform settings
• Any approval screens
```

---

## 2.5 EMPLOYEE Navigation Rules

### **Default Landing Page**
```
First login of day:     /dashboard
Return to app:          /dashboard
After action:           Return to previous screen
Deep link (valid):      Navigate to requested screen
Deep link (invalid):    Redirect to /dashboard + error
```

### **Breadcrumb Pattern**
```
My Dashboard
My Dashboard > My Work
My Dashboard > My Work > My Tasks
My Dashboard > My Work > My Tasks > [Task Name]

(Always starts with "My Dashboard")
```

### **Cross-Domain Navigation**
```
❌ BLOCKED: Cannot navigate to admin screens
❌ BLOCKED: Cannot navigate to org-wide views
✅ ALLOWED: Can navigate between own modules
✅ ALLOWED: Can view read-only org info
```

### **Escalation Path**
```
Need approval?     → Submit request → Wait for admin
Need access?       → Contact admin (no self-serve)
Have question?     → Help center or contact support
```

---

# 3. ORG ADMIN Navigation Universe

## 3.1 Philosophy: Control Center

**Core Focus:** Org-wide management, approvals, configuration  
**Visibility:** All org data  
**Depth:** Deep — comprehensive control  
**Style:** Dashboard-centric, data-rich, action-oriented

---

## 3.2 ORG ADMIN Sidebar Tree

```
╔══════════════════════════════════════════════════════════════╗
║                    WORKOS — ORG ADMIN                        ║
╚══════════════════════════════════════════════════════════════╝

🎛️  Admin Dashboard                               [/admin/dashboard]
    └─ Live Activity
    └─ Pending Approvals
    └─ Org Health
    └─ Quick Actions

━━━━━━━━━ EXECUTION OS ━━━━━━━━━━

🏗️  Work                                          [/work]
    ├─ 🏠 Work Home                                [/work]
    ├─ 📊 Projects                                 [/work/projects]
    ├─ ✅ Tasks (All)                             [/work/tasks]
    ├─ 🎯 Milestones                              [/work/milestones]
    ├─ 📌 Assignments                             [/work/assignments]
    └─ 📈 Reports                                 [/work/reports]

━━━━━━━━━ PEOPLE OS ━━━━━━━━━━

👥 People                                         [/people]
    ├─ 👨‍💼 Employees                              [/people/employees]
    ├─ 👤 Members                                  [/people/members]
    ├─ 🏢 Departments                             [/people/departments]
    └─ 🔐 Roles & Access                          [/people/roles-access]

━━━━━━━━━ TIME OS ━━━━━━━━━━

⏱️  Time                                          [/time]
    ├─ ⏱️  Tracking (All)                         [/time/tracking]
    ├─ 📝 Sessions (All)                          [/time/sessions]
    ├─ ✏️  Corrections                            [/time/corrections]
    ├─ ⏸️  Break Rules                            [/time/break-rules]
    ├─ 🏖️  Leave Management                       [/time/leave-management]
    ├─ ✅ Leave Approvals                         [/time/leave-approvals]
    └─ ⚠️  Fines                                  [/time/fines]

━━━━━━━━━ FINANCE OS ━━━━━━━━━━

💰 Finance                                        [/finance]
    ├─ 🎛️  Finance Cockpit                       [/finance/cockpit]
    ├─ 📥 Finance Inbox                           [/finance/inbox]
    ├─ ➕ Quick Add                               [/finance/quick-add]
    ├─ 📖 Ledger                                  [/finance/ledger]
    ├─ 💳 Accounts/Wallets                        [/finance/accounts-wallets]
    ├─ 📤 Import Center                           [/finance/import-center]
    ├─ ✅ Review & Decide                         [/finance/review-decide]
    ├─ 💵 Reimbursements                          [/finance/reimbursements]
    ├─ 💼 Payroll Posting                         [/finance/payroll-posting]
    ├─ 📊 Costing & Profit                        [/finance/costing-profit]
    ├─ 📈 Reports                                 [/finance/reports]
    ├─ 🏦 Loans/Liabilities                       [/finance/loans-liabilities]
    ├─ 👥 Team Permissions                        [/finance/team-permissions]
    └─ ⚙️  Finance Settings                       [/finance/settings]

━━━━━━━━━ BUSINESS OS ━━━━━━━━━━

💬 Communication                                  [/communicate]
    ├─ 📢 Channels                                [/communicate/channels]
    ├─ 💬 Direct Messages                         [/communicate/dms]
    └─ 🤖 Bots & Integrations                     [/communicate/bots]

━━━━━━━━━ INTELLIGENCE OS ━━━━━━━━━━

📊 Analytics                                      [/analytics]
    ├─ 🔴 Live Activity                           [/analytics/live-activity]
    ├─ 📊 Activity Overview                       [/analytics/activity-overview]
    ├─ ⌨️  Input Counters                         [/analytics/input-counters]
    ├─ 📸 Screenshot Review                       [/analytics/screenshot-review]
    ├─ 📱 App Reports                             [/analytics/app-reports]
    ├─ 📈 Analytics                               [/analytics/analytics]
    └─ 📋 Reports                                 [/analytics/reports]

━━━━━━━━━ SECURITY & COMPLIANCE ━━━━━━━━━━

🔐 Security                                       [/security]
    ├─ 🔒 Consent & Privacy                       [/security/consent-privacy]
    ├─ 📦 Data Retention                          [/security/data-retention]
    ├─ 📜 Audit Logs                              [/security/audit-logs]
    └─ ⚙️  Security Settings                      [/security/settings]

━━━━━━━━━ INTEGRATIONS ━━━━━━━━━━

🔌 Integrations                                   [/integrations]
    ├─ 🔗 All Integrations                        [/integrations/all]
    └─ 📚 API Docs                                [/integrations/api-docs]

━━━━━━━━━ BILLING ━━━━━━━━━━

💳 Billing                                        [/billing]
    ├─ 📋 Current Plan                            [/billing/current-plan]
    ├─ 📜 Billing History                         [/billing/history]
    └─ 🧾 Invoices                                [/billing/invoices]

━━━━━━━━━ ORGANIZATION ━━━━━━━━━━

⚙️  Organization                                  [/organization]
    ├─ 🏢 Profile                                 [/organization/profile]
    ├─ ⚙️  Settings                               [/organization/settings]
    ├─ 📚 Policies                                [/organization/policies]
    └─ 🎨 Branding                                [/organization/branding]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔔 Notifications                                  [/notifications]
👤 Profile                                        [/profile]
❓ Help & Support                                 [/help]
🚪 Logout

╚══════════════════════════════════════════════════════════════╝
```

---

## 3.3 ORG ADMIN Domain Visibility

| Domain | Visibility | Access Level | Notes |
|--------|-----------|--------------|-------|
| **Execution OS** | ✅ Full | Complete control | All projects, tasks, teams |
| **People OS** | ✅ Full | Complete control | All employees, full CRUD |
| **Time OS** | ✅ Full | Complete control | All tracking, approvals, rules |
| **Finance OS** | ✅ Full | Complete control | Full financial operations |
| **Organization OS** | ✅ Full | Complete control | All org settings |
| **Business OS** | ✅ Full | Complete control | All communication |
| **Intelligence OS** | ✅ Full | Complete control | All org analytics |
| **Platform OS** | ❌ Hidden | None | No platform access |
| **Security & Compliance** | ✅ Full | Org-level | Org audit logs, policies |
| **Integrations** | ✅ Full | Org-level | Org integrations, API |
| **Billing** | ✅ View | Read-only | Can view, cannot modify plan |

---

## 3.4 ORG ADMIN Screen Access Matrix

### **✅ OPERATIONAL (Full Access)**

| Screen | Route | Actions |
|--------|-------|---------|
| Admin Dashboard | `/admin/dashboard` | View, monitor, quick actions |
| All Work Screens | `/work/*` | Full CRUD |
| All People Screens | `/people/*` | Full CRUD |
| All Time Screens | `/time/*` | Full CRUD + Approvals |
| All Finance Screens | `/finance/*` | Full CRUD + Approvals |
| All Communication | `/communicate/*` | Full access |
| All Analytics | `/analytics/*` | Full access |
| All Security | `/security/*` | Full org control |
| All Integrations | `/integrations/*` | Connect, configure |
| Organization Settings | `/organization/*` | Full control |

### **👁️ READ-ONLY**

| Screen | Route | Restrictions |
|--------|-------|-------------|
| Current Plan | `/billing/current-plan` | View only, cannot change |
| Billing History | `/billing/history` | View only |
| Invoices | `/billing/invoices` | View, download only |

### **🚫 FORBIDDEN (Hidden/No Access)**

```
All platform-level screens:
• Platform Console
• Platform Analytics (cross-org)
• Other Organizations
• Platform Admin Management
• Platform Billing Settings
• Global Policies
• System Health
• Feature Flags
• Global Audit Logs
```

### **⚠️ REQUIRES APPROVAL (External Process)**

| Action | Approval Process |
|--------|-----------------|
| Change Billing Plan | Request to Platform Admin |
| Delete Organization | Request to Platform Admin |
| Increase Seat Limit | Request to Platform Admin (or auto-billing) |

---

## 3.5 ORG ADMIN Navigation Rules

### **Default Landing Page**
```
First login:            /admin/dashboard
Return to app:          /admin/dashboard
After approval action:  Return to approval queue
Deep link (valid):      Navigate to requested screen
Deep link (invalid):    Redirect to /admin/dashboard + error
```

### **Breadcrumb Pattern**
```
Admin Dashboard
Admin Dashboard > Finance
Admin Dashboard > Finance > Cockpit
Admin Dashboard > Finance > Ledger > [Entry Details]

(Always starts with "Admin Dashboard")
```

### **Cross-Domain Navigation**
```
❌ BLOCKED: Cannot navigate to platform screens
❌ BLOCKED: Cannot navigate to other orgs
✅ ALLOWED: Full navigation within org
✅ ALLOWED: Cross-domain org navigation
✅ ALLOWED: Deep linking to any org screen
```

### **Approval Workflow Navigation**
```
Pending Approval Notification → Click → Direct to approval screen
After Approval → Show success → Return to queue
After Denial → Show reason modal → Return to queue
Batch Approvals → Multi-select → Approve all → Return to queue
```

### **Escalation Path**
```
Need platform feature?  → Contact platform admin
Need more seats?        → Billing upgrade request
Technical issue?        → Support ticket
```

---

# 4. PLATFORM ADMIN Navigation Universe

## 4.1 Philosophy: Platform Console

**Core Focus:** Cross-org operations, platform management, system health  
**Visibility:** All organizations (read-only operational data)  
**Depth:** Wide — high-level oversight  
**Style:** Analytical, monitoring-focused, minimal operational depth

---

## 4.2 PLATFORM ADMIN Sidebar Tree

```
╔══════════════════════════════════════════════════════════════╗
║                 WORKOS — PLATFORM ADMIN                      ║
╚══════════════════════════════════════════════════════════════╝

🌐 Platform Console                               [/platform/console]
    └─ System Health
    └─ Active Organizations
    └─ Platform Metrics
    └─ Recent Events

━━━━━━━━━ ORGANIZATIONS ━━━━━━━━━━

🏢 Organizations                                  [/platform/organizations]
    ├─ 📊 All Organizations                       [/platform/organizations/all]
    ├─ ➕ Create Organization                     [/platform/organizations/create]
    └─ 🔍 Organization Detail                     [/platform/organizations/:id]
        ├─ Overview (Metadata)
        ├─ Subscription
        ├─ Usage Stats
        ├─ Billing Info
        └─ Audit Log (Org-specific)

━━━━━━━━━ PLATFORM OPERATIONS ━━━━━━━━━━

💳 Platform Billing                               [/platform/billing]
    ├─ 💰 Revenue Dashboard                       [/platform/billing/revenue]
    ├─ 💺 Seat Sales                              [/platform/billing/seat-sales]
    ├─ 📋 Billing Plans                           [/platform/billing/plans]
    └─ 🧾 All Invoices                            [/platform/billing/invoices]

🌍 Global Policies                                [/platform/policies]
    ├─ 🔐 Security Policies                       [/platform/policies/security]
    ├─ ✅ Compliance Rules                        [/platform/policies/compliance]
    └─ ⚙️  Platform Rules                         [/platform/policies/platform]

🔧 System Health                                  [/platform/health]
    ├─ 📊 Performance                             [/platform/health/performance]
    ├─ ✅ Uptime                                  [/platform/health/uptime]
    └─ 🚨 Alerts                                  [/platform/health/alerts]

👨‍💼 Platform Admins                               [/platform/admins]
    ├─ 👥 Admin Management                        [/platform/admins/management]
    └─ 🔐 Permissions                             [/platform/admins/permissions]

━━━━━━━━━ INTELLIGENCE ━━━━━━━━━━

📊 Platform Analytics                             [/platform/analytics]
    ├─ 📈 Usage Metrics                           [/platform/analytics/usage]
    ├─ 🌐 Cross-Org Analytics                     [/platform/analytics/cross-org]
    └─ 💰 Revenue Analytics                       [/platform/analytics/revenue]

━━━━━━━━━ SECURITY ━━━━━━━━━━

📜 Global Audit Logs                              [/platform/audit]
    ├─ 🌐 All Platform Actions                    [/platform/audit/all]
    ├─ 👨‍💼 Org Admin Actions                      [/platform/audit/org-admins]
    └─ 🚨 Security Events                         [/platform/audit/security]

🔐 Security & Compliance                          [/platform/security]
    ├─ 🔒 Platform Security                       [/platform/security/settings]
    ├─ 📋 Compliance Reports                      [/platform/security/compliance]
    └─ 📦 Data Retention                          [/platform/security/retention]

━━━━━━━━━ INTEGRATIONS ━━━━━━━━━━

🔌 Platform Integrations                          [/platform/integrations]
    ├─ 🛒 Integration Marketplace                 [/platform/integrations/marketplace]
    ├─ 🔑 API Management                          [/platform/integrations/api]
    └─ 📊 Usage Monitoring                        [/platform/integrations/usage]

━━━━━━━━━ FINANCE ━━━━━━━━━━

💰 Platform Finance                               [/platform/finance]
    ├─ ⚙️  Platform Settings                      [/platform/finance/settings]
    └─ 💳 Billing Configuration                   [/platform/finance/config]

━━━━━━━━━ PLATFORM ━━━━━━━━━━

⚙️  Platform Settings                             [/platform/settings]
    ├─ 🚩 Feature Flags                           [/platform/settings/feature-flags]
    ├─ ⚙️  Configuration                          [/platform/settings/config]
    └─ 🔧 Maintenance Mode                        [/platform/settings/maintenance]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔔 Notifications                                  [/notifications]
👤 Profile                                        [/profile]
❓ Help & Support                                 [/help]
🚪 Logout

╚══════════════════════════════════════════════════════════════╝
```

---

## 4.3 PLATFORM ADMIN Domain Visibility

| Domain | Visibility | Access Level | Notes |
|--------|-----------|--------------|-------|
| **Execution OS** | ✅ Analytics | Read-only metadata | No operational access |
| **People OS** | ✅ Analytics | Seat counts only | No employee details |
| **Time OS** | ✅ Analytics | Aggregated metrics | No individual logs |
| **Finance OS** | ✅ Settings | Platform config | No org ledgers |
| **Organization OS** | ✅ Full | All orgs | Metadata + subscription |
| **Business OS** | ❌ Hidden | None | No org communications |
| **Intelligence OS** | ✅ Full | Cross-org | Aggregated analytics |
| **Platform OS** | ✅ Full | Complete control | All platform settings |
| **Security & Compliance** | ✅ Full | Global | All audit logs |
| **Integrations** | ✅ Full | Platform | Marketplace management |
| **Billing** | ✅ Full | Platform | All org billing |

---

## 4.4 PLATFORM ADMIN Screen Access Matrix

### **✅ OPERATIONAL (Full Access)**

| Screen | Route | Actions |
|--------|-------|---------|
| Platform Console | `/platform/console` | Monitor, manage |
| All Organizations | `/platform/organizations/all` | View, create, manage |
| Create Organization | `/platform/organizations/create` | Full CRUD |
| Organization Detail | `/platform/organizations/:id` | View metadata, manage subscription |
| Revenue Dashboard | `/platform/billing/revenue` | View, analyze |
| Seat Sales | `/platform/billing/seat-sales` | View, manual adjust |
| Billing Plans | `/platform/billing/plans` | Create, edit, deprecate |
| All Invoices | `/platform/billing/invoices` | View, generate, adjust |
| Global Policies | `/platform/policies/*` | Create, edit, delete |
| System Health | `/platform/health/*` | Monitor, configure |
| Platform Admins | `/platform/admins/*` | Manage, assign permissions |
| Platform Analytics | `/platform/analytics/*` | View all |
| Global Audit Logs | `/platform/audit/*` | View all (no edit) |
| Security & Compliance | `/platform/security/*` | Configure, monitor |
| Platform Integrations | `/platform/integrations/*` | Manage marketplace |
| Platform Finance | `/platform/finance/*` | Configure settings |
| Platform Settings | `/platform/settings/*` | Full control |

### **👁️ READ-ONLY**

| Screen | Route | Restrictions |
|--------|-------|-------------|
| Org Work Data | `/platform/organizations/:id/work` | Metadata only |
| Org Employee Data | `/platform/organizations/:id/people` | Count only, no PII |
| Org Time Data | `/platform/organizations/:id/time` | Aggregated only |
| Org Finance Data | `/platform/organizations/:id/finance` | High-level metrics only |

### **🚫 FORBIDDEN (No Access)**

```
All org operational screens:
• Individual org work management (tasks, projects)
• Individual employee management (CRUD)
• Individual time tracking/approvals
• Org finance ledger operations
• Org-level approvals (leave, expenses)
• Org internal communications
• Individual employee activity data
• Org settings (branding, policies) — unless org requests help
```

### **⚠️ CRITICAL OPERATIONS (Extreme Audit)**

| Action | Audit Level | Requirements |
|--------|------------|--------------|
| Delete Organization | Critical | Test orgs only, permanent log |
| Create Platform Admin | Critical | Full audit trail |
| Modify Global Policy | Critical | Impact assessment required |
| Access Org PII | Critical | Legal/compliance only |
| Toggle Feature Flag | Critical | Rollback plan required |

---

## 4.5 PLATFORM ADMIN Navigation Rules

### **Default Landing Page**
```
First login:            /platform/console
Return to app:          /platform/console
After org action:       Return to org detail
Deep link (valid):      Navigate to requested screen
Deep link (invalid):    Redirect to /platform/console + error
```

### **Breadcrumb Pattern**
```
Platform Console
Platform Console > Organizations
Platform Console > Organizations > [Org Name]
Platform Console > Organizations > [Org Name] > Subscription

(Always starts with "Platform Console")
```

### **Cross-Domain Navigation**
```
❌ BLOCKED: Cannot navigate to org operational screens
❌ BLOCKED: Cannot perform org-level approvals
✅ ALLOWED: Can navigate to all platform screens
✅ ALLOWED: Can view org metadata
✅ ALLOWED: Can navigate cross-org analytics
```

### **Organization Detail Navigation**
```
Organizations List → Click Org → Org Detail View
Org Detail View → Tabs:
  ├─ Overview (metadata, stats)
  ├─ Subscription (plan, billing)
  ├─ Usage (seats, activity)
  ├─ Billing (invoices, payments)
  └─ Audit (org-specific events)

(No deep navigation into org operational data)
```

### **Escalation Path**
```
Org needs help?         → Provide support, but don't operate
Billing issue?          → Adjust in platform billing
Security incident?      → Review audit logs, take action
Feature request?        → Manage feature flags
```

---

# 5. Domain Visibility Matrix

## 5.1 Complete Domain Access by Role

```
DOMAIN                     EMPLOYEE    ORG ADMIN    PLATFORM ADMIN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Execution OS               
├─ Work Home               ✅ Own      ✅ All       👁️  Metadata
├─ Projects                ✅ Assigned ✅ All       👁️  Metadata
├─ Tasks                   ✅ Own      ✅ All       👁️  Metadata
├─ Milestones              ✅ Assigned ✅ All       👁️  Metadata
├─ Assignments             ✅ Own      ✅ All       👁️  Metadata
└─ Reports                 ✅ Own      ✅ All       👁️  Aggregated

People OS                  
├─ Employees               ❌ No       ✅ All       👁️  Count
├─ Members                 ❌ No       ✅ All       👁️  Count
├─ Departments             👁️  Own    ✅ All       👁️  Metadata
├─ Roles & Access          ❌ No       ✅ All       ❌ No
└─ Directory               👁️  Basic  ✅ All       ❌ No

Time OS                    
├─ Tracking                ✅ Own      ✅ All       👁️  Aggregated
├─ Sessions                ✅ Own      ✅ All       👁️  Aggregated
├─ Corrections             ✅ Request  ✅ Approve   ❌ No
├─ Break Rules             👁️  View   ✅ Manage    ❌ No
├─ Leave Management        ✅ Request  ✅ Manage    ❌ No
├─ Leave Approvals         ❌ No       ✅ Approve   ❌ No
└─ Fines                   ✅ Own      ✅ All       👁️  Aggregated

Finance OS                 
├─ Cockpit                 ❌ No       ✅ Full      👁️  Settings
├─ Inbox                   ❌ No       ✅ Full      ❌ No
├─ Quick Add               ❌ No       ✅ Full      ❌ No
├─ Ledger                  ❌ No       ✅ Full      ❌ No
├─ Accounts/Wallets        ❌ No       ✅ Full      👁️  Config
├─ Import Center           ❌ No       ✅ Full      ❌ No
├─ Review & Decide         ❌ No       ✅ Full      ❌ No
├─ Reimbursements          ✅ Submit   ✅ Approve   ❌ No
├─ Payroll Posting         ❌ No       ✅ Full      ❌ No
├─ Costing & Profit        ❌ No       ✅ Full      👁️  Metrics
├─ Reports                 ✅ Own      ✅ All       👁️  Aggregated
├─ Loans/Liabilities       ❌ No       ✅ Full      ❌ No
├─ Team Permissions        ❌ No       ✅ Full      ❌ No
└─ Settings                ❌ No       ✅ Full      ✅ Platform

Organization OS            
├─ Profile                 👁️  Basic  ✅ Full      ✅ All
├─ Settings                ❌ No       ✅ Full      👁️  View
├─ Policies                👁️  View   ✅ Full      👁️  View
└─ Branding                ❌ No       ✅ Full      ❌ No

Business OS                
└─ Communication           ✅ DMs      ✅ All       ❌ No

Intelligence OS            
├─ Live Activity           ✅ Own      ✅ All       👁️  Platform
├─ Activity Overview       ✅ Own      ✅ All       👁️  Cross-org
├─ Input Counters          ✅ Own      ✅ All       ❌ No
├─ Screenshot Review       ✅ Own      ✅ All       ❌ No
├─ App Reports             ✅ Own      ✅ All       👁️  Aggregated
├─ Analytics               ✅ Own      ✅ All       ✅ Platform
└─ Reports                 ✅ Own      ✅ All       ✅ Platform

Platform OS                
├─ Console                 ❌ No       ❌ No        ✅ Full
├─ Organizations           ❌ No       ❌ No        ✅ Full
├─ System Health           ❌ No       ❌ No        ✅ Full
└─ Platform Settings       ❌ No       ❌ No        ✅ Full

Security & Compliance      
├─ Consent & Privacy       ✅ Own      ✅ Org       ✅ Platform
├─ Data Retention          👁️  View   ✅ Org       ✅ Platform
├─ Audit Logs              ✅ Own      ✅ Org       ✅ Global
└─ Security Settings       ✅ Own      ✅ Org       ✅ Platform

Integrations               
├─ Integrations            ❌ No       ✅ Org       ✅ Platform
└─ API Docs                ❌ No       ✅ View      ✅ Full

Billing                    
├─ Current Plan            👁️  View   👁️  View    ✅ Full
├─ Billing History         ❌ No       👁️  View    ✅ Full
└─ Invoices                ❌ No       👁️  View    ✅ Full

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Legend:
✅ Full Access    👁️  Read-Only    ❌ No Access
```

---

# 6. Screen Access Matrix

## 6.1 All 50+ Routes by Role

```
ROUTE                              EMPLOYEE    ORG ADMIN    PLATFORM ADMIN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CORE ROUTES
/dashboard                         ✅ Own      ✅ Admin     ❌ Redirect
/admin/dashboard                   ❌ Hidden   ✅ Full      ❌ Hidden
/platform/console                  ❌ Hidden   ❌ Hidden    ✅ Full

WORK (Execution OS)
/work                              ✅ Own      ✅ All       👁️  Metadata
/work/projects                     ✅ Assigned ✅ All       👁️  Metadata
/work/tasks                        ✅ Own      ✅ All       👁️  Metadata
/work/milestones                   ✅ Assigned ✅ All       👁️  Metadata
/work/assignments                  ✅ Own      ✅ All       👁️  Metadata
/work/reports                      ✅ Own      ✅ All       👁️  Aggregated

PEOPLE (People OS)
/people/employees                  ❌ Hidden   ✅ Full      👁️  Count
/people/members                    ❌ Hidden   ✅ Full      👁️  Count
/people/departments                👁️  Own    ✅ Full      👁️  Metadata
/people/roles-access               ❌ Hidden   ✅ Full      ❌ Hidden
/people/directory                  👁️  Basic  ✅ Full      ❌ Hidden

TIME (Time OS)
/time/tracking                     ✅ Own      ✅ All       👁️  Aggregated
/time/sessions                     ✅ Own      ✅ All       👁️  Aggregated
/time/corrections                  ✅ Request  ✅ Approve   ❌ Hidden
/time/break-rules                  👁️  View   ✅ Full      ❌ Hidden
/time/leave-management             ❌ Hidden   ✅ Full      ❌ Hidden
/time/leave-requests               ✅ Own      ❌ Hidden    ❌ Hidden
/time/leave-approvals              ❌ Hidden   ✅ Full      ❌ Hidden
/time/fines                        ✅ Own      ✅ All       👁️  Aggregated

FINANCE (Finance OS)
/finance/cockpit                   ❌ Hidden   ✅ Full      👁️  Settings
/finance/inbox                     ❌ Hidden   ✅ Full      ❌ Hidden
/finance/quick-add                 ❌ Hidden   ✅ Full      ❌ Hidden
/finance/ledger                    ❌ Hidden   ✅ Full      ❌ Hidden
/finance/accounts-wallets          ❌ Hidden   ✅ Full      👁️  Config
/finance/import-center             ❌ Hidden   ✅ Full      ❌ Hidden
/finance/review-decide             ❌ Hidden   ✅ Full      ❌ Hidden
/finance/reimbursements            ✅ Submit   ✅ Approve   ❌ Hidden
/finance/payroll-posting           ❌ Hidden   ✅ Full      ❌ Hidden
/finance/costing-profit            ❌ Hidden   ✅ Full      👁️  Metrics
/finance/reports                   ✅ Own      ✅ All       👁️  Aggregated
/finance/loans-liabilities         ❌ Hidden   ✅ Full      ❌ Hidden
/finance/team-permissions          ❌ Hidden   ✅ Full      ❌ Hidden
/finance/settings                  ❌ Hidden   ✅ Full      ✅ Platform
/finance/my-earnings               ✅ Own      ❌ Hidden    ❌ Hidden
/finance/payslips                  ✅ Own      ❌ Hidden    ❌ Hidden
/finance/submit-expense            ✅ Create   ❌ Hidden    ❌ Hidden
/finance/my-submissions            ✅ Own      ❌ Hidden    ❌ Hidden

COMMUNICATION (Business OS)
/communicate/channels              ✅ DMs      ✅ All       ❌ Hidden
/communicate/dms                   ✅ Full     ✅ All       ❌ Hidden
/communicate/bots                  ❌ Hidden   ✅ Full      ❌ Hidden

ANALYTICS (Intelligence OS)
/analytics/live-activity           ✅ Own      ✅ All       ✅ Platform
/analytics/activity-overview       ✅ Own      ✅ All       ✅ Cross-org
/analytics/input-counters          ✅ Own      ✅ All       ❌ Hidden
/analytics/screenshot-review       ✅ Own      ✅ All       ❌ Hidden
/analytics/app-reports             ✅ Own      ✅ All       👁️  Aggregated
/analytics/analytics               ✅ Own      ✅ All       ✅ Platform
/analytics/reports                 ✅ Own      ✅ All       ✅ Platform
/analytics/my-analytics            ✅ Own      ❌ Hidden    ❌ Hidden

SECURITY & COMPLIANCE
/security/consent-privacy          ✅ Own      ✅ Org       ✅ Platform
/security/data-retention           👁️  View   ✅ Org       ✅ Platform
/security/audit-logs               ✅ Own      ✅ Org       ✅ Global
/security/settings                 ✅ Own      ✅ Org       ✅ Platform

INTEGRATIONS
/integrations/all                  ❌ Hidden   ✅ Full      ✅ Platform
/integrations/api-docs             ❌ Hidden   ✅ View      ✅ Full

BILLING
/billing/current-plan              👁️  View   👁️  View    ✅ Full
/billing/history                   ❌ Hidden   👁️  View    ✅ Full
/billing/invoices                  ❌ Hidden   👁️  View    ✅ Full

ORGANIZATION
/organization/profile              👁️  Basic  ✅ Full      ✅ All
/organization/settings             ❌ Hidden   ✅ Full      👁️  View
/organization/policies             👁️  View   ✅ Full      👁️  View
/organization/branding             ❌ Hidden   ✅ Full      ❌ Hidden
/organization/about                👁️  View   ✅ Full      ❌ Hidden

PLATFORM (Platform OS)
/platform/organizations/all        ❌ Hidden   ❌ Hidden    ✅ Full
/platform/organizations/create     ❌ Hidden   ❌ Hidden    ✅ Full
/platform/organizations/:id        ❌ Hidden   ❌ Hidden    ✅ Full
/platform/billing/revenue          ❌ Hidden   ❌ Hidden    ✅ Full
/platform/billing/seat-sales       ❌ Hidden   ❌ Hidden    ✅ Full
/platform/billing/plans            ❌ Hidden   ❌ Hidden    ✅ Full
/platform/billing/invoices         ❌ Hidden   ❌ Hidden    ✅ Full
/platform/policies/security        ❌ Hidden   ❌ Hidden    ✅ Full
/platform/policies/compliance      ❌ Hidden   ❌ Hidden    ✅ Full
/platform/policies/platform        ❌ Hidden   ❌ Hidden    ✅ Full
/platform/health/performance       ❌ Hidden   ❌ Hidden    ✅ Full
/platform/health/uptime            ❌ Hidden   ❌ Hidden    ✅ Full
/platform/health/alerts            ❌ Hidden   ❌ Hidden    ✅ Full
/platform/admins/management        ❌ Hidden   ❌ Hidden    ✅ Full
/platform/admins/permissions       ❌ Hidden   ❌ Hidden    ✅ Full
/platform/analytics/usage          ❌ Hidden   ❌ Hidden    ✅ Full
/platform/analytics/cross-org      ❌ Hidden   ❌ Hidden    ✅ Full
/platform/analytics/revenue        ❌ Hidden   ❌ Hidden    ✅ Full
/platform/audit/all                ❌ Hidden   ❌ Hidden    ✅ Full
/platform/audit/org-admins         ❌ Hidden   ❌ Hidden    ✅ Full
/platform/audit/security           ❌ Hidden   ❌ Hidden    ✅ Full
/platform/security/settings        ❌ Hidden   ❌ Hidden    ✅ Full
/platform/security/compliance      ❌ Hidden   ❌ Hidden    ✅ Full
/platform/security/retention       ❌ Hidden   ❌ Hidden    ✅ Full
/platform/integrations/marketplace ❌ Hidden   ❌ Hidden    ✅ Full
/platform/integrations/api         ❌ Hidden   ❌ Hidden    ✅ Full
/platform/integrations/usage       ❌ Hidden   ❌ Hidden    ✅ Full
/platform/finance/settings         ❌ Hidden   ❌ Hidden    ✅ Full
/platform/finance/config           ❌ Hidden   ❌ Hidden    ✅ Full
/platform/settings/feature-flags   ❌ Hidden   ❌ Hidden    ✅ Full
/platform/settings/config          ❌ Hidden   ❌ Hidden    ✅ Full
/platform/settings/maintenance     ❌ Hidden   ❌ Hidden    ✅ Full

COMMON
/profile                           ✅ Own      ✅ Own       ✅ Own
/notifications                     ✅ Own      ✅ Own       ✅ Own
/help                              ✅ All      ✅ All       ✅ All

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Legend:
✅ Full Access    👁️  Read-Only    ❌ Hidden/Forbidden
```

---

# 7. Breadcrumb Rules

## 7.1 Breadcrumb Patterns by Role

### **EMPLOYEE Breadcrumbs**

```
Pattern: My Dashboard > [Domain] > [Screen] > [Detail]

Examples:
My Dashboard
My Dashboard > My Work
My Dashboard > My Work > My Tasks
My Dashboard > My Work > My Tasks > Fix Login Bug

My Dashboard > My Time
My Dashboard > My Time > Leave Requests
My Dashboard > My Time > Leave Requests > New Request

My Dashboard > My Money
My Dashboard > My Money > Submit Expense
My Dashboard > My Money > Submit Expense > Travel Receipt

Rules:
✅ Always starts with "My Dashboard"
✅ Uses "My" prefix for personal domains
✅ Maximum 4 levels deep
✅ No org-wide context
```

### **ORG ADMIN Breadcrumbs**

```
Pattern: Admin Dashboard > [Domain] > [Module] > [Screen] > [Detail]

Examples:
Admin Dashboard
Admin Dashboard > Finance
Admin Dashboard > Finance > Cockpit
Admin Dashboard > Finance > Ledger
Admin Dashboard > Finance > Ledger > Entry #12345

Admin Dashboard > People
Admin Dashboard > People > Employees
Admin Dashboard > People > Employees > John Doe
Admin Dashboard > People > Employees > John Doe > Edit

Admin Dashboard > Time
Admin Dashboard > Time > Leave Approvals
Admin Dashboard > Time > Leave Approvals > Pending
Admin Dashboard > Time > Leave Approvals > Sarah Smith Request

Rules:
✅ Always starts with "Admin Dashboard"
✅ Domain name (not "My")
✅ Can go 5+ levels deep
✅ Shows org-wide context
✅ Detail views show entity names
```

### **PLATFORM ADMIN Breadcrumbs**

```
Pattern: Platform Console > [Section] > [Screen] > [Detail]

Examples:
Platform Console
Platform Console > Organizations
Platform Console > Organizations > All Organizations
Platform Console > Organizations > Acme Corp
Platform Console > Organizations > Acme Corp > Subscription

Platform Console > Billing
Platform Console > Billing > Revenue Dashboard
Platform Console > Billing > Billing Plans
Platform Console > Billing > Billing Plans > Enterprise Plan

Platform Console > Analytics
Platform Console > Analytics > Cross-Org Analytics
Platform Console > Analytics > Cross-Org Analytics > Time Tracking

Rules:
✅ Always starts with "Platform Console"
✅ High-level sections
✅ Maximum 5 levels deep
✅ Organization names shown in detail views
✅ No operational depth (stays high-level)
```

---

## 7.2 Breadcrumb Interaction Rules

### **Click Behavior**

```
RULE 1: All breadcrumb segments are clickable (except current)
Click "My Dashboard" → Navigate to /dashboard
Click "Finance" → Navigate to /finance
Click "Employees" → Navigate to /people/employees

RULE 2: Current page is NOT clickable
My Dashboard > My Work > [My Tasks] ← Not clickable
                         ^^^^^^^^

RULE 3: Clicking navigates to that level
Admin Dashboard > Finance > Cockpit > [Entry Details]
                            ^^^^^^^ Click here
                            ↓
                  Navigate to /finance/cockpit
```

### **Context Preservation**

```
RULE 4: Breadcrumbs preserve filters/context where appropriate
Admin Dashboard > Analytics > Activity Overview [Filtered: Engineering]
                              ^^^^^^^^^^^^^^^^ Click here
                              ↓
                Navigate to /analytics/activity-overview
                Preserve "Engineering" filter

RULE 5: Detail breadcrumbs show entity name
Admin Dashboard > People > Employees > [John Doe]
                                       ^^^^^^^^^
                              Shows employee name, not ID
```

---

# 8. Cross-OS Linking Rules

## 8.1 Permitted Cross-Links by Role

### **EMPLOYEE Cross-Links**

```
✅ ALLOWED:
My Work → My Time (link task to time log)
My Time → My Work (view related task from time session)
My Submissions → My Earnings (view how expense affects earnings)
My Activity → My Work (jump to task from activity timeline)

❌ FORBIDDEN:
My Work ↛ Team Analytics (no access)
My Time ↛ Org Time Reports (no access)
My Money ↛ Org Finance (no access)
My Activity ↛ Team Activity (no access)

PATTERN:
Own data can link to other own data.
Cannot link to org-wide data (doesn't exist in their universe).
```

### **ORG ADMIN Cross-Links**

```
✅ ALLOWED (Full Cross-Domain):
Work Projects → Finance Costing (view project costs)
Employees → Time Tracking (view employee time)
Time Sessions → Work Tasks (see what was worked on)
Finance Entries → Work Projects (link expense to project)
Leave Approvals → Employees (view employee details)
Reimbursements → Employees (view requestor)
Analytics → Any Domain (cross-reference)

❌ FORBIDDEN:
Org Data ↛ Platform Settings (no access)
Org Data ↛ Other Orgs (no access)

PATTERN:
Full cross-linking within organization.
Can navigate freely between all org domains.
Deep integration between modules.
```

### **PLATFORM ADMIN Cross-Links**

```
✅ ALLOWED:
Organizations → Billing (view org subscription)
Billing → Organizations (view org from invoice)
Analytics → Organizations (drill down to org)
Audit Logs → Organizations (view org details)
Organizations → Audit Logs (view org-specific logs)

⚠️  LIMITED:
Organizations → Org Analytics (aggregated only)
Organizations ↛ Org Operational Data (read-only metadata)

❌ FORBIDDEN:
Platform ↛ Org Work Items (no operational access)
Platform ↛ Org Employee Details (privacy)
Platform ↛ Org Time Logs (privacy)
Platform ↛ Org Finance Ledger (privacy)

PATTERN:
Cross-link between platform-level screens.
Can view org metadata, not operational data.
Analytics cross-link allowed (aggregated).
```

---

## 8.2 Link Rendering Rules

### **Smart Link Display**

```typescript
// EMPLOYEE: Links only to accessible screens
<Link to="/work/tasks/123">Fix Login Bug</Link>  // ✅ Own task
<span className="text-gray-400">Project Alpha</span>  // ❌ No link (no project access)

// ORG ADMIN: Full linking
<Link to="/work/projects/456">Project Alpha</Link>  // ✅ Can access
<Link to="/people/employees/789">John Doe</Link>  // ✅ Can access

// PLATFORM ADMIN: Metadata linking only
<Link to="/platform/organizations/acme">Acme Corp</Link>  // ✅ Can access
<span className="text-gray-400">Project Alpha</span>  // ❌ No operational link
```

### **Cross-Domain Link Patterns**

```
PATTERN 1: Entity Reference Links
"Task assigned to [John Doe]"
              ↓
Employee: No link (no access to employee data)
Org Admin: Link to /people/employees/john-doe
Platform Admin: No link (no employee access)

PATTERN 2: Financial Propagation Links
"Expense linked to [Project Alpha]"
                 ↓
Employee: No link (no project access)
Org Admin: Link to /work/projects/alpha
Platform Admin: No link (no project access)

PATTERN 3: Time→Work Links
"Time logged for [Fix Login Bug]"
                ↓
Employee: Link to /work/tasks/123 (if own task)
Org Admin: Link to /work/tasks/123
Platform Admin: No link (no operational access)
```

---

## 8.3 Forbidden Link Enforcement

### **Link Sanitization**

```javascript
// Sanitize links based on role
function renderLink(targetUrl, text, userRole) {
  // Check if user has permission to target
  if (!hasPermission(userRole, targetUrl)) {
    // Return plain text instead of link
    return <span className="text-muted">{text}</span>;
  }
  
  // Render link
  return <Link to={targetUrl}>{text}</Link>;
}

// Example usage:
renderLink('/people/employees/123', 'John Doe', 'EMPLOYEE')
// Returns: <span className="text-muted">John Doe</span>

renderLink('/people/employees/123', 'John Doe', 'ORG_ADMIN')
// Returns: <Link to="/people/employees/123">John Doe</Link>
```

### **Deep Link Protection**

```
SCENARIO: Employee receives deep link to org-wide analytics
URL: /analytics/activity-overview?team=engineering

ENFORCEMENT:
1. User clicks link
2. System checks: Does EMPLOYEE have access to /analytics/activity-overview?
3. Answer: No (employee only has /analytics/my-analytics)
4. Action: Redirect to /dashboard
5. Show error: "You don't have permission to view org-wide analytics"
6. Log: Attempted access to forbidden screen
```

---

# 9. Default Landing Pages

## 9.1 Landing Page by Role & Context

### **EMPLOYEE Landing Pages**

```
CONTEXT                          LANDING PAGE            ROUTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
First login (ever)               My Dashboard            /dashboard
First login (today)              My Dashboard            /dashboard
Return to app                    My Dashboard            /dashboard
After time log                   My Time Tracking        /time/tracking
After expense submission         My Submissions          /finance/my-submissions
After leave request              Leave Requests          /time/leave-requests
Deep link (valid)                Requested screen        [as specified]
Deep link (invalid)              My Dashboard + error    /dashboard
Logout → Login                   My Dashboard            /dashboard
Session expired → Login          My Dashboard            /dashboard
```

### **ORG ADMIN Landing Pages**

```
CONTEXT                          LANDING PAGE            ROUTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
First login (ever)               Admin Dashboard         /admin/dashboard
First login (today)              Admin Dashboard         /admin/dashboard
Return to app                    Admin Dashboard         /admin/dashboard
After approval action            Return to approval list [contextual]
After data entry                 Return to previous      [contextual]
Deep link (valid)                Requested screen        [as specified]
Deep link (invalid)              Admin Dashboard + error /admin/dashboard
Pending approvals exist          Admin Dashboard         /admin/dashboard
                                 (with approval badge)
Logout → Login                   Admin Dashboard         /admin/dashboard
Session expired → Login          Admin Dashboard         /admin/dashboard
```

### **PLATFORM ADMIN Landing Pages**

```
CONTEXT                          LANDING PAGE            ROUTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
First login (ever)               Platform Console        /platform/console
First login (today)              Platform Console        /platform/console
Return to app                    Platform Console        /platform/console
After org creation               New org detail          /platform/organizations/:id
After config change              Platform Console        /platform/console
Deep link (valid)                Requested screen        [as specified]
Deep link (invalid)              Platform Console + error /platform/console
System alerts exist              Platform Console        /platform/console
                                 (with alert indicators)
Logout → Login                   Platform Console        /platform/console
Session expired → Login          Platform Console        /platform/console
```

---

## 9.2 Contextual Redirect Rules

### **Post-Action Redirects**

```
ACTION                           REDIRECT TO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EMPLOYEE:
Create task                      Task list (/work/tasks)
Submit expense                   My submissions (/finance/my-submissions)
Request leave                    Leave requests (/time/leave-requests)
Log time                         Stay on tracking (/time/tracking)
Update profile                   Profile (/profile)
Send message                     Stay in conversation

ORG ADMIN:
Approve leave                    Return to approval queue
Approve expense                  Return to approval queue
Create employee                  Employee list (/people/employees)
Post to ledger                   Ledger (/finance/ledger)
Create project                   Project detail (/work/projects/:id)
Generate report                  Report view (show generated report)
Bulk action                      Return to list (with success banner)

PLATFORM ADMIN:
Create organization              Org detail (/platform/organizations/:id)
Create billing plan              Plan list (/platform/billing/plans)
Toggle feature flag              Settings page (stay)
Create platform admin            Admin list (/platform/admins/management)
Generate platform report         Report view
```

---

## 9.3 Error State Landing Pages

### **Permission Denied**

```
SCENARIO: User tries to access forbidden screen

EMPLOYEE tries to access /admin/dashboard:
1. Check permission: DENIED
2. Redirect to: /dashboard
3. Show toast: "You don't have permission to access admin features"
4. Log attempt: Audit trail

ORG ADMIN tries to access /platform/console:
1. Check permission: DENIED
2. Redirect to: /admin/dashboard
3. Show toast: "Platform console is only available to Platform Admins"
4. Log attempt: Audit trail

PLATFORM ADMIN tries to access /finance/ledger:
1. Check permission: DENIED (org operational data)
2. Redirect to: /platform/console
3. Show toast: "Platform Admins cannot access org operational data"
4. Log attempt: Audit trail
```

### **Not Found (404)**

```
SCENARIO: User navigates to non-existent route

Any role → /non-existent-page:
1. Check if route exists: NO
2. Redirect to: Role-specific landing page
   - EMPLOYEE → /dashboard
   - ORG ADMIN → /admin/dashboard
   - PLATFORM ADMIN → /platform/console
3. Show toast: "Page not found"
4. Log: 404 error
```

### **Session Expired**

```
SCENARIO: Session expires mid-session

Any role → session expired:
1. Detect: Session timeout
2. Save: Current route (for return)
3. Redirect to: /login
4. Show message: "Your session has expired. Please log in again."
5. After login: Return to saved route (if still valid)
   - If route still accessible: Navigate there
   - If route no longer accessible: Go to landing page
```

---

# 10. Escalation Paths

## 10.1 EMPLOYEE Escalation Paths

### **Need Approval**

```
SCENARIO: Employee needs leave approval

PATH:
1. Employee submits leave request (/time/leave-requests)
2. System creates approval task
3. Org Admin notified
4. Employee waits (can view status)
5. Admin approves/denies
6. Employee notified of decision

EMPLOYEE ACTIONS:
✅ Submit request
✅ View status
✅ Cancel pending request
❌ Cannot approve own request
❌ Cannot escalate to platform
```

### **Need Access to Restricted Data**

```
SCENARIO: Employee needs access to project financials

PATH:
1. Employee identifies need
2. Employee contacts Org Admin (Help → Contact Admin)
3. Org Admin evaluates request
4. Decision:
   ├─ Grant access: Admin adds employee to finance team
   ├─ Deny access: Explain why via communication
   └─ Provide summary: Admin shares relevant data without full access

EMPLOYEE ACTIONS:
✅ Request via Help system
❌ Cannot self-serve access
❌ Cannot view without permission
```

### **Technical Issue**

```
SCENARIO: Employee encounters bug

PATH:
1. Employee encounters issue
2. Employee goes to Help & Support (/help)
3. Options:
   ├─ Search knowledge base
   ├─ Submit support ticket
   └─ Contact Org Admin
4. Support team responds
5. Issue resolved

EMPLOYEE ACTIONS:
✅ Report via Help system
✅ View knowledge base
❌ Cannot escalate to Platform Admin directly
```

---

## 10.2 ORG ADMIN Escalation Paths

### **Need Platform Feature**

```
SCENARIO: Org Admin needs feature flag enabled

PATH:
1. Org Admin identifies need
2. Org Admin contacts Platform Admin
   - Via support ticket
   - Via platform communication channel
3. Platform Admin reviews request
4. Decision:
   ├─ Enable feature: Platform Admin toggles flag
   ├─ Deny request: Explain why
   └─ Schedule: Add to roadmap

ORG ADMIN ACTIONS:
✅ Request feature
✅ Provide justification
❌ Cannot toggle feature flags directly
❌ Cannot access platform settings
```

### **Need More Seats**

```
SCENARIO: Org Admin needs to add more employees

PATH:
1. Org Admin tries to add employee
2. System: "Seat limit reached"
3. Options:
   ├─ Upgrade plan: Self-serve billing upgrade
   ├─ Contact Platform Admin: Request seat increase
   └─ Remove inactive users: Free up seats
4. If upgrade: Billing processed automatically
5. If request: Platform Admin reviews and approves

ORG ADMIN ACTIONS:
✅ Upgrade plan (self-serve if enabled)
✅ Request increase from Platform Admin
✅ Manage existing seats
❌ Cannot bypass seat limits
```

### **Billing Issue**

```
SCENARIO: Org Admin disputes invoice

PATH:
1. Org Admin reviews invoice (/billing/invoices)
2. Org Admin identifies issue
3. Org Admin contacts Platform Admin
   - Via support ticket
   - Via billing support
4. Platform Admin reviews
5. Decision:
   ├─ Adjust invoice: Platform Admin creates credit
   ├─ Explain charges: Clarify billing
   └─ Escalate: Involve finance team

ORG ADMIN ACTIONS:
✅ View invoices
✅ Request review
❌ Cannot modify invoices directly
❌ Cannot access platform billing settings
```

### **Security Incident**

```
SCENARIO: Org Admin detects suspicious activity

PATH:
1. Org Admin views audit logs (/security/audit-logs)
2. Org Admin identifies suspicious activity
3. Immediate actions:
   ├─ Disable user account (if compromised)
   ├─ Revoke API keys (if exposed)
   └─ Lock down access (if necessary)
4. Contact Platform Admin
5. Platform Admin reviews global logs
6. Coordinate response

ORG ADMIN ACTIONS:
✅ View org audit logs
✅ Disable compromised accounts
✅ Escalate to Platform Admin
✅ Implement org-level security measures
❌ Cannot view global security logs directly (request via Platform Admin)
```

---

## 10.3 PLATFORM ADMIN Escalation Paths

### **Org Requests Help**

```
SCENARIO: Org Admin requests platform assistance

PATH:
1. Org Admin submits request
2. Platform Admin reviews in support queue
3. Platform Admin actions:
   ├─ Provide guidance: Explain feature
   ├─ Enable feature: Toggle flag
   ├─ Investigate issue: Review logs
   └─ Escalate: Contact engineering team
4. Platform Admin responds
5. Issue resolved

PLATFORM ADMIN ACTIONS:
✅ Review org metadata
✅ Enable features
✅ Review org-specific audit logs
⚠️  View org data (with org permission)
❌ Cannot perform org operations directly
```

### **System-Wide Issue**

```
SCENARIO: Platform Admin detects platform outage

PATH:
1. Platform Admin monitors system health (/platform/health)
2. Platform Admin detects issue
3. Immediate actions:
   ├─ Enable maintenance mode
   ├─ Notify all orgs
   └─ Alert engineering team
4. Engineering team investigates
5. Issue resolved
6. Post-mortem

PLATFORM ADMIN ACTIONS:
✅ Monitor system health
✅ Enable maintenance mode
✅ Notify users
✅ View system logs
✅ Coordinate with engineering
```

### **Legal/Compliance Request**

```
SCENARIO: Legal request for org data

PATH:
1. Legal team contacts Platform Admin
2. Platform Admin reviews request
3. Validate:
   ├─ Legal authority (warrant, subpoena)
   ├─ Scope of request
   └─ Compliance requirements
4. If valid:
   ├─ Access org data (with extreme audit)
   ├─ Export requested data
   └─ Provide to legal
5. Notify org (if legally permissible)
6. Full audit trail

PLATFORM ADMIN ACTIONS:
✅ Review legal requests
✅ Access org data (with legal authority)
✅ Export data (with extreme audit)
✅ Maintain compliance
⚠️  Critical audit level
```

---

# 11. Navigation State Management

## 11.1 State Persistence Rules

### **URL State (Query Parameters)**

```
ALLOWED PARAMETERS BY ROLE:

EMPLOYEE:
?tab=pending              (My Submissions)
?filter=thisWeek          (My Time)
?sort=date                (My Tasks)
?view=grid                (View preference)

ORG ADMIN:
?tab=pending              (Approvals)
?filter=department        (Filter by dept)
?employee=john-doe        (Filter by employee)
?dateRange=2024-01        (Date filter)
?status=approved          (Status filter)
?sort=date                (Sort preference)
?view=grid                (View preference)
?page=2                   (Pagination)

PLATFORM ADMIN:
?org=acme-corp            (Filter by org)
?tab=subscription         (Org detail tab)
?dateRange=2024-Q1        (Date range)
?status=active            (Org status)
?plan=enterprise          (Billing plan filter)
?sort=revenue             (Sort preference)
?page=2                   (Pagination)

RULES:
✅ URL params persist across refresh
✅ URL params are shareable (within role)
❌ Cannot craft URL to bypass permissions
❌ Invalid params are ignored
```

### **Local Storage State**

```
STORED STATE BY ROLE:

EMPLOYEE:
- View preferences (grid/list)
- Recent tasks
- Draft submissions
- Notification settings
- Last visited pages

ORG ADMIN:
- Filter preferences
- Dashboard layout
- Recent employees viewed
- Approval queue settings
- Report templates
- Last visited pages

PLATFORM ADMIN:
- Filter preferences
- Dashboard layout
- Recent orgs viewed
- Analytics preferences
- Alert settings
- Last visited pages

RULES:
✅ Local storage per role
✅ Cleared on logout
✅ Not shared across devices
❌ Cannot contain sensitive data
```

### **Session State (In-Memory)**

```
SESSION STATE:

ALL ROLES:
- Current role
- User ID
- Org ID (Employee/Org Admin)
- Session token
- Permissions cache
- Current route
- Navigation history

RULES:
✅ Cleared on logout
✅ Cleared on session expire
✅ Not persisted to disk
✅ Used for permission checks
```

---

## 11.2 Navigation History Rules

### **Back Button Behavior**

```
EMPLOYEE:
Browser back → Navigate to previous screen (if accessible)
If previous screen was /admin/dashboard (after role change):
  → Navigate to /dashboard instead

ORG ADMIN:
Browser back → Navigate to previous screen
Modal close → Return to background screen (not back in history)
After approval → Back goes to approval list (not detail)

PLATFORM ADMIN:
Browser back → Navigate to previous screen
Org detail tabs → Tab change doesn't add to history
After org creation → Back goes to org list (not create form)

RULES:
✅ Respect browser history
✅ Skip inaccessible screens in history
✅ Modal actions don't add to history
❌ Cannot back into forbidden screens
```

### **Forward Navigation Limits**

```
RULE: Maximum navigation depth

EMPLOYEE: 4 levels
My Dashboard > My Work > My Tasks > Task Detail
(Cannot go deeper)

ORG ADMIN: 6 levels
Admin Dashboard > Finance > Ledger > Entry > Edit > Confirm
(Can go deeper if needed)

PLATFORM ADMIN: 5 levels
Platform Console > Organizations > Acme > Subscription > Edit
(Stays high-level)

ENFORCEMENT:
If depth exceeded → Breadcrumbs truncate middle
Dashboard > ... > Current Parent > Current
```

---

# 12. Implementation Rules

## 12.1 Frontend Routing

### **Route Definition Structure**

```typescript
// Role-based route configuration
const routes: RouteConfig[] = [
  // Employee routes
  {
    path: '/dashboard',
    component: EmployeeDashboard,
    roles: ['EMPLOYEE'],
    exact: true,
  },
  {
    path: '/work/tasks',
    component: MyTasks,
    roles: ['EMPLOYEE'],
    breadcrumb: 'My Dashboard > My Work > My Tasks',
  },
  
  // Org Admin routes
  {
    path: '/admin/dashboard',
    component: AdminDashboard,
    roles: ['ORG_ADMIN'],
    exact: true,
  },
  {
    path: '/people/employees',
    component: EmployeeManagement,
    roles: ['ORG_ADMIN'],
    breadcrumb: 'Admin Dashboard > People > Employees',
  },
  
  // Platform Admin routes
  {
    path: '/platform/console',
    component: PlatformConsole,
    roles: ['PLATFORM_ADMIN'],
    exact: true,
  },
  {
    path: '/platform/organizations/all',
    component: OrganizationList,
    roles: ['PLATFORM_ADMIN'],
    breadcrumb: 'Platform Console > Organizations > All Organizations',
  },
  
  // Shared routes
  {
    path: '/profile',
    component: Profile,
    roles: ['EMPLOYEE', 'ORG_ADMIN', 'PLATFORM_ADMIN'],
  },
];
```

### **Route Guard Implementation**

```typescript
// Route guard component
function ProtectedRoute({ 
  component: Component, 
  roles, 
  ...rest 
}: ProtectedRouteProps) {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  
  // Check if user has required role
  if (!roles.includes(role)) {
    // Redirect to role-specific landing page
    const landing = getLandingPageForRole(role);
    navigate(landing);
    
    // Show error
    toast.error("You don't have permission to access this page");
    
    // Log attempt
    logPermissionViolation({
      userId: user.id,
      attemptedRoute: rest.path,
      userRole: role,
      requiredRoles: roles,
    });
    
    return null;
  }
  
  return <Component {...rest} />;
}
```

---

## 12.2 Sidebar Generation

### **Dynamic Sidebar by Role**

```typescript
// Sidebar configuration
function getSidebarForRole(role: UserRole): SidebarConfig {
  switch (role) {
    case 'EMPLOYEE':
      return {
        sections: [
          {
            title: 'MY WORKSPACE',
            items: [
              { icon: '📋', label: 'My Work', path: '/work' },
              { icon: '⏱️', label: 'My Time', path: '/time' },
              { icon: '💰', label: 'My Money', path: '/finance' },
              { icon: '💬', label: 'Messages', path: '/communicate' },
            ],
          },
          {
            title: 'PERSONAL',
            items: [
              { icon: '📈', label: 'My Activity', path: '/analytics' },
              { icon: '👤', label: 'Profile', path: '/profile' },
            ],
          },
          {
            title: 'ORGANIZATION',
            items: [
              { icon: '👥', label: 'Team Directory', path: '/people/directory' },
              { icon: '📚', label: 'Policies', path: '/organization/policies' },
            ],
          },
        ],
      };
      
    case 'ORG_ADMIN':
      return {
        sections: [
          {
            title: 'EXECUTION OS',
            items: [
              { 
                icon: '🏗️', 
                label: 'Work', 
                path: '/work',
                children: [
                  { label: 'Work Home', path: '/work' },
                  { label: 'Projects', path: '/work/projects' },
                  { label: 'Tasks', path: '/work/tasks' },
                  { label: 'Milestones', path: '/work/milestones' },
                  { label: 'Assignments', path: '/work/assignments' },
                  { label: 'Reports', path: '/work/reports' },
                ],
              },
            ],
          },
          // ... more sections
        ],
      };
      
    case 'PLATFORM_ADMIN':
      return {
        sections: [
          {
            title: 'ORGANIZATIONS',
            items: [
              { icon: '🏢', label: 'Organizations', path: '/platform/organizations' },
            ],
          },
          {
            title: 'PLATFORM OPERATIONS',
            items: [
              { icon: '💳', label: 'Platform Billing', path: '/platform/billing' },
              { icon: '🌍', label: 'Global Policies', path: '/platform/policies' },
              { icon: '🔧', label: 'System Health', path: '/platform/health' },
              { icon: '👨‍💼', label: 'Platform Admins', path: '/platform/admins' },
            ],
          },
          // ... more sections
        ],
      };
  }
}
```

---

## 12.3 Breadcrumb Generation

### **Automatic Breadcrumb Builder**

```typescript
// Generate breadcrumbs from route
function generateBreadcrumbs(
  currentPath: string, 
  role: UserRole
): Breadcrumb[] {
  const segments = currentPath.split('/').filter(Boolean);
  const breadcrumbs: Breadcrumb[] = [];
  
  // Add landing page
  const landing = getLandingPageForRole(role);
  breadcrumbs.push({
    label: getLandingPageLabel(role),
    path: landing,
  });
  
  // Build breadcrumbs from path segments
  let pathAccumulator = '';
  segments.forEach((segment, index) => {
    pathAccumulator += `/${segment}`;
    
    // Get human-readable label
    const label = getSegmentLabel(segment, role);
    
    // Don't link to current page
    const isLast = index === segments.length - 1;
    
    breadcrumbs.push({
      label,
      path: isLast ? undefined : pathAccumulator,
    });
  });
  
  return breadcrumbs;
}

// Example output:
// EMPLOYEE: /work/tasks/123
// → [
//     { label: 'My Dashboard', path: '/dashboard' },
//     { label: 'My Work', path: '/work' },
//     { label: 'My Tasks', path: '/work/tasks' },
//     { label: 'Fix Login Bug', path: undefined }, // current page
//   ]

// ORG ADMIN: /people/employees/456
// → [
//     { label: 'Admin Dashboard', path: '/admin/dashboard' },
//     { label: 'People', path: '/people' },
//     { label: 'Employees', path: '/people/employees' },
//     { label: 'John Doe', path: undefined }, // current page
//   ]
```

---

## 12.4 Permission Checking

### **Centralized Permission System**

```typescript
// Permission check service
class PermissionService {
  private permissions: Map<UserRole, Set<string>>;
  
  constructor() {
    this.permissions = new Map([
      ['EMPLOYEE', new Set([
        '/dashboard',
        '/work',
        '/work/tasks',
        '/work/assignments',
        '/time/tracking',
        '/time/sessions',
        '/time/leave-requests',
        '/time/fines',
        '/finance/my-earnings',
        '/finance/payslips',
        '/finance/submit-expense',
        '/finance/my-submissions',
        // ... all employee routes
      ])],
      ['ORG_ADMIN', new Set([
        '/admin/dashboard',
        '/work',
        '/work/projects',
        '/work/tasks',
        '/people/employees',
        '/people/members',
        '/time/tracking',
        '/time/corrections',
        '/finance/cockpit',
        '/finance/ledger',
        // ... all org admin routes
      ])],
      ['PLATFORM_ADMIN', new Set([
        '/platform/console',
        '/platform/organizations/all',
        '/platform/organizations/create',
        '/platform/billing/revenue',
        '/platform/health/performance',
        // ... all platform admin routes
      ])],
    ]);
  }
  
  hasAccess(role: UserRole, route: string): boolean {
    const rolePermissions = this.permissions.get(role);
    if (!rolePermissions) return false;
    
    // Exact match
    if (rolePermissions.has(route)) return true;
    
    // Wildcard match (e.g., /work/* for /work/tasks/123)
    const wildcardRoute = route.split('/').slice(0, -1).join('/') + '/*';
    return rolePermissions.has(wildcardRoute);
  }
  
  canPerformAction(
    role: UserRole, 
    action: Action, 
    resource: Resource
  ): boolean {
    // Check action-level permissions
    const actionKey = `${action}:${resource}`;
    const rolePermissions = this.permissions.get(role);
    return rolePermissions?.has(actionKey) ?? false;
  }
}
```

---

# 13. Constitutional Status

## 13.1 Immutability Declaration

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│          🔒 NAVIGATION SKELETON — IMMUTABLE 🔒             │
│                                                             │
│  This Navigation Skeleton Core is IMMUTABLE SYSTEM LAW     │
│                                                             │
│  Changes require:                                           │
│  ✅ Constitutional amendment                               │
│  ✅ Role Boundary Core alignment                           │
│  ✅ Security review                                        │
│  ✅ Impact assessment                                      │
│  ✅ Migration plan                                         │
│  ✅ Full audit trail                                       │
│                                                             │
│  Navigation structure cannot be bypassed                   │
│  Role isolation cannot be compromised                      │
│  Permission boundaries are absolute                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 13.2 Enforcement Hierarchy

```
NAVIGATION ENFORCEMENT PRIORITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1️⃣  Role Boundary Core (Permission Foundation)
    ↓ Defines what each role can access
2️⃣  Navigation Skeleton Core (This Document)
    ↓ Implements navigation based on permissions
3️⃣  Route Configuration
    ↓ Technical implementation of navigation
4️⃣  UI Components
    ↓ Renders navigation visually
5️⃣  User Preferences
    ↓ Cannot bypass any above
```

---

# 14. Version Control

## Version History

| Version | Date | Changes | Authority |
|---------|------|---------|-----------|
| 1.0.0 | 2026-01-07 | Initial immutable specification | WorkOS Constitution + Role Boundary Core |

---

## 🔒 END OF NAVIGATION SKELETON CORE 🔒

**This document defines the permanent navigation architecture for WorkOS.**  
**All navigation must implement these role-isolated structures.**  
**No exceptions. No crossover. No confusion.**

---

**Last Updated:** January 7, 2026  
**Authority:** WorkOS Constitution + Role Boundary Core  
**Status:** ACTIVE AND IMMUTABLE  
**Classification:** SYSTEM LAW 🔒
