# WorkOS Role Boundary Core — SYSTEM LAW

**Status:** IMMUTABLE SYSTEM LAW 🔒  
**Authority:** WorkOS Constitution — Security Architecture  
**Version:** 1.0.0  
**Date:** January 7, 2026

---

## 🎯 Executive Summary

This document defines the **permanent, immutable permission architecture** for all WorkOS user roles. These boundaries are **system law** and cannot be bypassed or overridden except through constitutional amendment.

### **Three System Brains**

1. **EMPLOYEE** — Workspace Mode
2. **ORG ADMIN** — Control Mode  
3. **PLATFORM ADMIN** — Platform Mode (Super Admin)

---

## 📋 Table of Contents

1. [Permission Matrix by Role](#permission-matrix-by-role)
2. [Domain-Specific Permissions](#domain-specific-permissions)
3. [Sidebar Visibility Map](#sidebar-visibility-map)
4. [Action Rights Map](#action-rights-map)
5. [Approval Chain Architecture](#approval-chain-architecture)
6. [Audit Responsibility Map](#audit-responsibility-map)
7. [Forbidden Access Zones](#forbidden-access-zones)
8. [Permission Enforcement Rules](#permission-enforcement-rules)

---

# 1. Permission Matrix by Role

## 1.1 EMPLOYEE (Workspace Mode)

### **Core Philosophy**
Employees operate in a **personal workspace** where they:
- View their own data
- Submit requests/entries
- Track their own activity
- Cannot see org-wide data
- Cannot approve anything
- Cannot access admin functions

### **Permission Summary**

| Action | Scope |
|--------|-------|
| **VIEW** | Own data only (work, time, earnings, submissions) |
| **CREATE** | Submissions, expense reports, time logs, leave requests |
| **EDIT** | Own pending submissions (before approval) |
| **APPROVE** | Nothing |
| **DELETE** | Own draft submissions only |
| **NEVER** | Org-wide data, other employees' data, settings, approvals |

---

## 1.2 ORG ADMIN (Control Mode)

### **Core Philosophy**
Org Admins operate in **control mode** where they:
- View all org data
- Manage employees and teams
- Approve requests
- Configure org policies
- Cannot access platform settings
- Cannot see other organizations

### **Permission Summary**

| Action | Scope |
|--------|-------|
| **VIEW** | All org data, all employees, all submissions, all reports |
| **CREATE** | Employees, projects, policies, rules, org-level entries |
| **EDIT** | All org data, employee info, policies, configurations |
| **APPROVE** | Leave requests, corrections, reimbursements, time adjustments |
| **DELETE** | Draft entries, test data (with audit trail) |
| **NEVER** | Platform settings, other orgs, billing plans, global policies |

---

## 1.3 PLATFORM ADMIN (Platform Mode)

### **Core Philosophy**
Platform Admins operate at **platform level** where they:
- View all organizations
- Manage platform settings
- Control billing and plans
- Monitor system health
- Cannot modify org data directly
- Full audit access

### **Permission Summary**

| Action | Scope |
|--------|-------|
| **VIEW** | All orgs, all platform data, system health, global audit logs |
| **CREATE** | Organizations, platform admins, global policies, billing plans |
| **EDIT** | Platform settings, org subscriptions, global policies |
| **APPROVE** | Org creation requests, plan changes (if workflow enabled) |
| **DELETE** | Test orgs only, with extreme audit requirements |
| **NEVER** | Direct modification of org operational data |

---

# 2. Domain-Specific Permissions

## 2.1 Execution OS (WORK)

### **EMPLOYEE Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **Own Tasks** | ✅ All | ✅ Yes | ✅ Own | ❌ No | ❌ No |
| **Own Assignments** | ✅ All | ❌ No | ✅ Status only | ❌ No | ❌ No |
| **Projects (Assigned)** | ✅ Details | ❌ No | ❌ No | ❌ No | ❌ No |
| **Team Projects** | ✅ List only | ❌ No | ❌ No | ❌ No | ❌ No |
| **All Projects** | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| **Milestones** | ✅ Assigned | ❌ No | ❌ No | ❌ No | ❌ No |
| **Work Reports** | ✅ Own only | ❌ No | ❌ No | ❌ No | ❌ No |

### **ORG ADMIN Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **All Tasks** | ✅ Org-wide | ✅ Yes | ✅ All | ❌ No | ✅ Yes (audit) |
| **All Assignments** | ✅ Org-wide | ✅ Yes | ✅ All | ❌ No | ✅ Yes |
| **All Projects** | ✅ Org-wide | ✅ Yes | ✅ All | ✅ Milestones | ✅ Yes (audit) |
| **All Milestones** | ✅ Org-wide | ✅ Yes | ✅ All | ✅ Completion | ✅ Yes |
| **Work Reports** | ✅ All | ✅ Custom | ✅ All | ❌ No | ✅ Yes |

### **PLATFORM ADMIN Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **All Org Projects** | ✅ Read-only | ❌ No | ❌ No | ❌ No | ❌ No |
| **Project Analytics** | ✅ Aggregated | ❌ No | ❌ No | ❌ No | ❌ No |
| **System-wide Metrics** | ✅ All | ❌ No | ❌ No | ❌ No | ❌ No |

---

## 2.2 People OS (PEOPLE)

### **EMPLOYEE Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **Own Profile** | ✅ Full | ❌ No | ✅ Limited | ❌ No | ❌ No |
| **Team Members** | ✅ Basic info | ❌ No | ❌ No | ❌ No | ❌ No |
| **Org Directory** | ✅ Names/roles | ❌ No | ❌ No | ❌ No | ❌ No |
| **Departments** | ✅ Own dept | ❌ No | ❌ No | ❌ No | ❌ No |
| **Roles & Access** | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| **Salary Data** | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |

**Edit Restrictions:**
- Can edit: Contact info, emergency contacts, profile photo
- Cannot edit: Name, role, department, salary, permissions

### **ORG ADMIN Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **All Employees** | ✅ Full | ✅ Yes | ✅ All | ✅ Onboarding | ✅ Offboard |
| **All Members** | ✅ Full | ✅ Invite | ✅ All | ✅ Access | ✅ Remove |
| **Departments** | ✅ All | ✅ Yes | ✅ All | ❌ No | ✅ Yes (if empty) |
| **Roles & Access** | ✅ All | ✅ Yes | ✅ All | ✅ Permissions | ✅ Yes |
| **Salary Data** | ✅ All | ✅ Yes | ✅ All | ❌ No | ❌ No |
| **Org Chart** | ✅ All | ✅ Build | ✅ All | ❌ No | ❌ No |

### **PLATFORM ADMIN Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **Org Employees (Read)** | ✅ Metadata | ❌ No | ❌ No | ❌ No | ❌ No |
| **Seat Count** | ✅ All orgs | ❌ No | ✅ Limits | ❌ No | ❌ No |
| **Platform Admins** | ✅ All | ✅ Yes | ✅ All | ✅ Promotion | ✅ Yes |

---

## 2.3 Time OS (TIME)

### **EMPLOYEE Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **Own Time Logs** | ✅ All | ✅ Auto/Manual | ✅ Before submit | ❌ No | ❌ No |
| **Own Sessions** | ✅ All | ✅ Start/Stop | ✅ Active only | ❌ No | ❌ No |
| **Corrections (Own)** | ✅ Own | ✅ Request | ❌ No | ❌ No | ❌ No |
| **Break Rules** | ✅ View only | ❌ No | ❌ No | ❌ No | ❌ No |
| **Leave Requests** | ✅ Own | ✅ Submit | ✅ Pending | ❌ No | ✅ Pending only |
| **Own Fines** | ✅ All | ❌ No | ❌ No | ❌ No | ❌ No |
| **Team Time Logs** | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |

### **ORG ADMIN Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **All Time Logs** | ✅ Org-wide | ✅ Manual | ✅ All | ❌ No | ✅ Yes (audit) |
| **All Sessions** | ✅ Org-wide | ❌ No | ✅ Corrections | ❌ No | ❌ No |
| **Corrections** | ✅ All | ✅ Admin | ✅ All | ✅ Approve/Deny | ✅ Rejected |
| **Break Rules** | ✅ All | ✅ Create | ✅ All | ❌ No | ✅ Yes |
| **Leave Requests** | ✅ All | ✅ Yes | ✅ All | ✅ Approve/Deny | ✅ Yes |
| **All Fines** | ✅ All | ✅ Issue | ✅ All | ❌ No | ✅ Waive |
| **Workday Rules** | ✅ All | ✅ Create | ✅ All | ❌ No | ✅ Yes |

### **PLATFORM ADMIN Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **Time Analytics** | ✅ Aggregated | ❌ No | ❌ No | ❌ No | ❌ No |
| **Usage Metrics** | ✅ All orgs | ❌ No | ❌ No | ❌ No | ❌ No |

---

## 2.4 Finance OS (FINANCE)

### **EMPLOYEE Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **Own Earnings** | ✅ All | ❌ No | ❌ No | ❌ No | ❌ No |
| **Own Payslips** | ✅ All | ❌ No | ❌ No | ❌ No | ❌ No |
| **Expense Submissions** | ✅ Own | ✅ Submit | ✅ Pending | ❌ No | ✅ Draft only |
| **Reimbursements (Own)** | ✅ Own | ✅ Request | ✅ Pending | ❌ No | ❌ No |
| **Finance Cockpit** | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| **Ledger** | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| **Accounts** | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| **Company Finances** | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |

### **ORG ADMIN Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **Finance Cockpit** | ✅ Full | ❌ No | ✅ Config | ❌ No | ❌ No |
| **Finance Inbox** | ✅ All | ✅ Assign | ✅ All | ✅ Classify | ✅ Reject |
| **Quick Add** | ✅ All | ✅ Create | ✅ Before lock | ❌ No | ✅ Before lock |
| **Ledger (Immutable)** | ✅ Full | ✅ Append | ❌ Never | ❌ No | ❌ Never |
| **Accounts/Wallets** | ✅ All | ✅ Create | ✅ All | ❌ No | ✅ Unused only |
| **Import Center** | ✅ All | ✅ Import | ✅ Mapping | ✅ Reconcile | ✅ Failed |
| **Review & Decide** | ✅ All | ❌ No | ✅ Classify | ✅ Approve | ✅ Reject |
| **Reimbursements** | ✅ All | ✅ Yes | ✅ All | ✅ Approve | ✅ Reject |
| **Payroll Posting** | ✅ All | ✅ Post | ✅ Before lock | ❌ No | ✅ Before lock |
| **Costing & Profit** | ✅ Full | ✅ Rules | ✅ All | ❌ No | ✅ Rules |
| **Reports** | ✅ All | ✅ Generate | ✅ Saved | ❌ No | ✅ Saved |
| **Loans/Liabilities** | ✅ All | ✅ Create | ✅ All | ❌ No | ✅ Paid off |
| **Team Permissions** | ✅ All | ✅ Assign | ✅ All | ❌ No | ✅ Revoke |
| **Finance Settings** | ✅ All | ✅ Configure | ✅ All | ❌ No | ❌ No |

**Critical Finance Rules:**
- ✅ **Ledger is APPEND-ONLY** — No edits, no deletes, ever
- ✅ **All entries generate audit trail**
- ✅ **Corrections create new entries, never modify**
- ✅ **Locked periods cannot be modified**

### **PLATFORM ADMIN Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **Org Finances (Read)** | ✅ Metadata | ❌ No | ❌ No | ❌ No | ❌ No |
| **Platform Finance Console** | ✅ Full | ❌ No | ✅ Settings | ❌ No | ❌ No |
| **Billing Plans** | ✅ All | ✅ Create | ✅ All | ❌ No | ✅ Deprecated |
| **Revenue Analytics** | ✅ All | ❌ No | ❌ No | ❌ No | ❌ No |

---

## 2.5 Organization OS

### **EMPLOYEE Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **Org Profile (Basic)** | ✅ Name/logo | ❌ No | ❌ No | ❌ No | ❌ No |
| **Org Settings** | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| **Org Policies** | ✅ View only | ❌ No | ❌ No | ❌ No | ❌ No |

### **ORG ADMIN Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **Org Profile** | ✅ Full | ❌ No | ✅ All | ❌ No | ❌ No |
| **Org Settings** | ✅ All | ✅ Configure | ✅ All | ❌ No | ❌ No |
| **Org Policies** | ✅ All | ✅ Create | ✅ All | ❌ No | ✅ Yes |
| **Workday Config** | ✅ All | ✅ Create | ✅ All | ❌ No | ✅ Yes |
| **Branding** | ✅ All | ✅ Upload | ✅ All | ❌ No | ✅ Yes |

### **PLATFORM ADMIN Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **All Orgs** | ✅ Full | ✅ Create | ✅ Metadata | ✅ Creation | ✅ Test only |
| **Org Subscriptions** | ✅ All | ✅ Assign | ✅ All | ❌ No | ❌ No |
| **Global Policies** | ✅ All | ✅ Create | ✅ All | ❌ No | ✅ Yes |

---

## 2.6 Business OS

### **EMPLOYEE Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **Business Metrics** | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| **KPIs** | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| **Business Reports** | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |

### **ORG ADMIN Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **Business Metrics** | ✅ All | ✅ Define | ✅ All | ❌ No | ✅ Yes |
| **KPIs** | ✅ All | ✅ Create | ✅ All | ❌ No | ✅ Yes |
| **Business Reports** | ✅ All | ✅ Generate | ✅ Saved | ❌ No | ✅ Saved |
| **Goals & OKRs** | ✅ All | ✅ Create | ✅ All | ✅ Review | ✅ Yes |

### **PLATFORM ADMIN Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **Platform Metrics** | ✅ All | ✅ Define | ✅ All | ❌ No | ✅ Yes |
| **Cross-Org Analytics** | ✅ All | ✅ Reports | ❌ No | ❌ No | ❌ No |

---

## 2.7 Intelligence OS (ANALYTICS)

### **EMPLOYEE Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **Own Activity** | ✅ All | ❌ No | ❌ No | ❌ No | ❌ No |
| **Own Analytics** | ✅ All | ❌ No | ❌ No | ❌ No | ❌ No |
| **Own Screenshots** | ✅ Own | ❌ No | ❌ No | ❌ No | ✅ Request delete |
| **Team Analytics** | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| **Live Activity (Team)** | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |

### **ORG ADMIN Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **Live Activity** | ✅ Org-wide | ❌ No | ❌ No | ❌ No | ❌ No |
| **Activity Overview** | ✅ All | ❌ No | ✅ Filters | ❌ No | ❌ No |
| **Input Counters** | ✅ All | ❌ No | ✅ Config | ❌ No | ❌ No |
| **Screenshot Review** | ✅ All | ❌ No | ✅ Annotate | ❌ No | ✅ Yes |
| **App Reports** | ✅ All | ✅ Generate | ✅ Config | ❌ No | ✅ Yes |
| **Analytics** | ✅ All | ✅ Custom | ✅ All | ❌ No | ✅ Yes |
| **Reports** | ✅ All | ✅ Generate | ✅ Saved | ❌ No | ✅ Saved |

### **PLATFORM ADMIN Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **Platform Analytics** | ✅ All | ✅ Custom | ✅ All | ❌ No | ✅ Yes |
| **System Metrics** | ✅ All | ❌ No | ❌ No | ❌ No | ❌ No |
| **Usage Analytics** | ✅ All orgs | ✅ Reports | ❌ No | ❌ No | ❌ No |

---

## 2.8 Platform OS

### **EMPLOYEE Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **Platform Settings** | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| **System Health** | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |

### **ORG ADMIN Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **Org Settings** | ✅ All | ✅ Configure | ✅ All | ❌ No | ❌ No |
| **Platform Status** | ✅ View only | ❌ No | ❌ No | ❌ No | ❌ No |

### **PLATFORM ADMIN Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **Platform Settings** | ✅ All | ✅ Configure | ✅ All | ❌ No | ❌ No |
| **System Health** | ✅ All | ❌ No | ✅ Config | ❌ No | ❌ No |
| **Feature Flags** | ✅ All | ✅ Create | ✅ Toggle | ❌ No | ✅ Yes |
| **Platform Console** | ✅ All | ❌ No | ✅ Config | ❌ No | ❌ No |

---

## 2.9 Security & Compliance

### **EMPLOYEE Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **Own Consent** | ✅ View | ❌ No | ✅ Preferences | ❌ No | ❌ No |
| **Privacy Settings** | ✅ Own | ❌ No | ✅ Own | ❌ No | ❌ No |
| **Own Audit Logs** | ✅ Own actions | ❌ No | ❌ No | ❌ No | ❌ No |
| **Org Security** | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |

### **ORG ADMIN Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **Consent Management** | ✅ All | ✅ Policies | ✅ All | ❌ No | ❌ No |
| **Data Retention** | ✅ All | ✅ Policies | ✅ All | ❌ No | ❌ No |
| **Org Audit Logs** | ✅ All | ❌ No | ❌ No | ❌ No | ❌ Never |
| **Security Settings** | ✅ All | ✅ Configure | ✅ All | ❌ No | ❌ No |
| **2FA Enforcement** | ✅ Status | ✅ Policies | ✅ All | ❌ No | ❌ No |

### **PLATFORM ADMIN Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **Global Audit Logs** | ✅ All | ❌ No | ❌ No | ❌ No | ❌ Never |
| **Security Policies** | ✅ All | ✅ Create | ✅ All | ❌ No | ✅ Deprecated |
| **Compliance Reports** | ✅ All | ✅ Generate | ❌ No | ❌ No | ❌ No |
| **Data Retention (Platform)** | ✅ All | ✅ Policies | ✅ All | ❌ No | ❌ No |

---

## 2.10 Integrations

### **EMPLOYEE Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **Personal Integrations** | ✅ Available | ✅ Connect | ✅ Settings | ❌ No | ✅ Disconnect |
| **Org Integrations** | ✅ List only | ❌ No | ❌ No | ❌ No | ❌ No |
| **API Access** | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |

### **ORG ADMIN Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **All Integrations** | ✅ All | ✅ Connect | ✅ Configure | ❌ No | ✅ Disconnect |
| **API Keys** | ✅ All | ✅ Generate | ✅ Rotate | ❌ No | ✅ Revoke |
| **API Docs** | ✅ All | ❌ No | ❌ No | ❌ No | ❌ No |
| **Webhooks** | ✅ All | ✅ Create | ✅ All | ❌ No | ✅ Yes |

### **PLATFORM ADMIN Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **Platform Integrations** | ✅ All | ✅ Add | ✅ Configure | ✅ Approve | ✅ Remove |
| **Integration Marketplace** | ✅ All | ✅ Publish | ✅ All | ✅ Approve | ✅ Unpublish |
| **API Usage (All Orgs)** | ✅ All | ❌ No | ❌ No | ❌ No | ❌ No |

---

## 2.11 Billing

### **EMPLOYEE Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **Org Plan** | ✅ View only | ❌ No | ❌ No | ❌ No | ❌ No |
| **Billing** | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |

### **ORG ADMIN Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **Current Plan** | ✅ Full | ❌ No | ❌ No | ❌ No | ❌ No |
| **Billing History** | ✅ All | ❌ No | ❌ No | ❌ No | ❌ No |
| **Plan Changes** | ✅ View | ✅ Request | ❌ No | ❌ No | ❌ No |
| **Payment Methods** | ✅ Masked | ✅ Add | ✅ Update | ❌ No | ✅ Remove |
| **Invoices** | ✅ All | ❌ No | ❌ No | ❌ No | ❌ No |

### **PLATFORM ADMIN Permissions**

| Entity | View | Create | Edit | Approve | Delete |
|--------|------|--------|------|---------|--------|
| **All Org Billing** | ✅ Full | ❌ No | ✅ Adjust | ✅ Plans | ❌ No |
| **Billing Plans** | ✅ All | ✅ Create | ✅ All | ❌ No | ✅ Deprecate |
| **Platform Revenue** | ✅ All | ❌ No | ❌ No | ❌ No | ❌ No |
| **Seat Sales** | ✅ All | ✅ Manual | ✅ All | ❌ No | ❌ No |
| **Invoices (All)** | ✅ All | ✅ Generate | ✅ Adjust | ❌ No | ❌ No |

---

# 3. Sidebar Visibility Map

## 3.1 EMPLOYEE Sidebar (Workspace Mode)

```
✅ VISIBLE                           ❌ HIDDEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏠 Dashboard                         ⚙️  Settings (Org-level)
📋 My Work                           👥 Team Management
💬 Communicate (DMs only)            📊 All Analytics
⏱️  My Time                          🔒 Admin Controls
   • Tracking                        💰 Finance (Org-level)
   • Sessions                        🏢 Organization Settings
   • Leave Requests                  🔐 Security Settings
   • My Fines                        🔌 Org Integrations
💰 My Money                          📈 Reports (Org-wide)
   • Dashboard                       🎛️  Platform Settings
   • Submit Expense                  
   • My Submissions                  
   • Payslips                        
📈 My Activity                       
   • Overview                        
   • Analytics                       
🔔 Notifications                     
👤 Profile                           
```

---

## 3.2 ORG ADMIN Sidebar (Control Mode)

```
✅ VISIBLE                           ❌ HIDDEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎛️  Admin Dashboard                 🌐 Platform Console
📊 Live Activity                     🏢 Other Organizations
━━━━━ EXECUTION OS ━━━━━            🔐 Platform Settings
🏗️  Work                            👨‍💼 Platform Admins
   • Home                            💳 Platform Billing
   • Projects                        🌍 Global Policies
   • Tasks                           🔧 System Health
   • Milestones                      📜 Global Audit Logs
   • Assignments                     
   • Reports                         
━━━━━ ORGANIZATION OS ━━━━━         
👥 People                            
   • Employees                       
   • Members                         
   • Departments                     
   • Roles & Access                  
━━━━━ TIME OS ━━━━━                 
⏱️  Time                            
   • Tracking (All)                  
   • Sessions (All)                  
   • Corrections                     
   • Break Rules                     
   • Leave Management                
   • Leave Approvals                 
   • Fines                           
━━━━━ FINANCE OS ━━━━━              
💰 Finance                           
   • Cockpit                         
   • Inbox                           
   • Quick Add                       
   • Ledger                          
   • Accounts/Wallets                
   • Import Center                   
   • Review & Decide                 
   • Reimbursements                  
   • Payroll Posting                 
   • Costing & Profit                
   • Reports                         
   • Loans/Liabilities               
   • Team Permissions                
   • Settings                        
━━━━━ BUSINESS OS ━━━━━             
💬 Communication                     
   • Channels                        
   • DMs                             
   • Bots/Integrations               
━━━━━ INTELLIGENCE OS ━━━━━         
📈 Analytics                         
   • Live Activity                   
   • Activity Overview               
   • Input Counters                  
   • Screenshot Review               
   • App Reports                     
   • Analytics                       
   • Reports                         
━━━━━ SECURITY & COMPLIANCE ━━━━━   
🔐 Security                          
   • Consent & Privacy               
   • Data Retention                  
   • Audit Logs                      
   • Security Settings               
━━━━━ INTEGRATIONS ━━━━━            
🔌 Integrations                      
   • All Integrations                
   • API Docs                        
━━━━━ BILLING ━━━━━                 
💳 Billing                           
   • Current Plan                    
   • Billing History                 
   • Invoices                        
━━━━━ PLATFORM ━━━━━                
⚙️  Organization Settings           
```

---

## 3.3 PLATFORM ADMIN Sidebar (Platform Mode)

```
✅ VISIBLE                           ❌ HIDDEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Platform Console                  📋 Org Work Items
🏢 Organizations                     👤 Individual Employees
   • All Organizations               ⏱️  Individual Time Logs
   • Org Detail View                 💬 Org Communications
   • Create Organization             
━━━━━ PLATFORM OPERATIONS ━━━━━     
💳 Platform Billing                  
   • Revenue Dashboard               
   • Seat Sales                      
   • Billing Plans                   
   • All Invoices                    
🌍 Global Policies                   
   • Security Policies               
   • Compliance Rules                
   • Platform Rules                  
🔧 System Health                     
   • Performance                     
   • Uptime                          
   • Alerts                          
👨‍💼 Platform Admins                
   • Admin Management                
   • Permissions                     
━━━━━ INTELLIGENCE ━━━━━            
📊 Platform Analytics                
   • Usage Metrics                   
   • Cross-Org Analytics             
   • Revenue Analytics               
━━━━━ SECURITY ━━━━━                
📜 Global Audit Logs                 
   • All Platform Actions            
   • Org Admin Actions               
   • Security Events                 
🔐 Security & Compliance             
   • Platform Security               
   • Compliance Reports              
   • Data Retention                  
━━━━━ INTEGRATIONS ━━━━━            
🔌 Platform Integrations             
   • Integration Marketplace         
   • API Management                  
   • Usage Monitoring                
━━━━━ FINANCE ━━━━━                 
💰 Platform Finance Console          
   • Platform Settings               
   • Billing Configuration           
━━━━━ PLATFORM ━━━━━                
⚙️  Platform Settings               
   • Feature Flags                   
   • Configuration                   
   • Maintenance Mode                
```

---

# 4. Action Rights Map

## 4.1 Critical Actions by Role

### **EMPLOYEE Actions**

| Action | Domains | Audit Level | Approval Required |
|--------|---------|-------------|-------------------|
| Submit expense | Finance | Medium | Yes (Admin) |
| Request leave | Time | High | Yes (Admin) |
| Log time | Time | Medium | No |
| Create task | Work | Low | No |
| Update own profile | People | Low | No |
| Request correction | Time | High | Yes (Admin) |
| Delete draft | Finance/Work | Low | No |
| View payslip | Finance | Medium | No |

### **ORG ADMIN Actions**

| Action | Domains | Audit Level | Approval Required |
|--------|---------|-------------|-------------------|
| Create employee | People | High | No |
| Approve leave | Time | High | No |
| Post to ledger | Finance | Critical | No |
| Approve reimbursement | Finance | High | No |
| Delete employee | People | Critical | Soft delete only |
| Issue fine | Time | High | No |
| Modify policies | Org | High | No |
| Access audit logs | Security | Medium | No |
| Export data | All | High | No |
| Configure integration | Integrations | Medium | No |

### **PLATFORM ADMIN Actions**

| Action | Domains | Audit Level | Approval Required |
|--------|---------|-------------|-------------------|
| Create organization | Platform | Critical | No |
| Delete organization | Platform | Critical | Yes (Manual) |
| Modify billing plan | Billing | High | No |
| Access global logs | Security | Critical | No |
| Create platform admin | Platform | Critical | No |
| Toggle feature flag | Platform | High | No |
| View org finances | Finance | High | No |
| Modify platform settings | Platform | Critical | No |

---

## 4.2 Action Capability Matrix

```
ACTION                          EMPLOYEE    ORG ADMIN    PLATFORM ADMIN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Create Work Items            ✅ Own      ✅ All       ❌ None
👥 Manage Employees             ❌ None     ✅ Org       ❌ None
⏱️  Log Time                    ✅ Own      ✅ All       ❌ None
💰 View Finances                ✅ Own      ✅ Org       ✅ All (Read)
✅ Approve Requests             ❌ None     ✅ Org       ❌ None
🗑️  Delete Records              ✅ Drafts   ✅ Most      ✅ Test only
📊 View Analytics               ✅ Own      ✅ Org       ✅ Platform
⚙️  Configure Settings          ✅ Own      ✅ Org       ✅ Platform
🔌 Manage Integrations          ✅ Personal ✅ Org       ✅ Platform
📜 Access Audit Logs            ✅ Own      ✅ Org       ✅ Global
🔐 Modify Security              ❌ None     ✅ Org       ✅ Platform
💳 Manage Billing               ❌ None     ✅ View      ✅ Full
🏢 Manage Organizations         ❌ None     ❌ None      ✅ All
👨‍💼 Manage Admins              ❌ None     ❌ None      ✅ Platform
🎛️  Toggle Feature Flags        ❌ None     ❌ None      ✅ All
```

---

# 5. Approval Chain Architecture

## 5.1 Approval Workflows

### **Leave Requests**

```
EMPLOYEE                    ORG ADMIN                   RESULT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Submit Leave Request   →   Review Request          →   Approved
                           ├─ Approve               →   ✅ Leave Granted
                           ├─ Deny                  →   ❌ Request Denied
                           └─ Request More Info     →   ⏸️  Pending

Audit: High
Notification: Employee notified immediately
Reversal: Admin can cancel approved leave (audit trail)
```

### **Time Corrections**

```
EMPLOYEE                    ORG ADMIN                   RESULT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Request Correction     →   Review Request          →   Decision
                           ├─ Approve               →   ✅ Time Updated
                           ├─ Deny                  →   ❌ No Change
                           └─ Modify & Approve      →   ⚡ Adjusted Update

Audit: High
Ledger: Correction entry created (never modifies original)
Notification: Employee notified with reason
```

### **Expense Reimbursements**

```
EMPLOYEE                    ORG ADMIN                   FINANCE POSTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Submit Expense         →   Review Submission       →   Post to Ledger
                           ├─ Approve               →   ✅ Reimbursement Scheduled
                           ├─ Deny                  →   ❌ Rejected
                           ├─ Request Receipt       →   ⏸️  Pending Info
                           └─ Approve Partial       →   ⚡ Adjusted Amount

Audit: High
Ledger: Immutable entry created upon approval
Notification: Employee + Finance Team
Payment: Queued for next payroll cycle
```

### **Finance Review & Decide**

```
SYSTEM/IMPORT              ORG ADMIN                   LEDGER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Unclassified Entry     →   Review Entry            →   Classification
                           ├─ Approve Category      →   ✅ Auto-filed
                           ├─ Modify Category       →   ⚡ Manual Override
                           ├─ Split Entry           →   🔀 Multiple Entries
                           └─ Reject                →   ❌ Move to Rejected

Audit: Critical
AI Learning: System learns from decisions
Ledger: Immutable once approved
```

### **Organization Creation (Platform)**

```
REQUEST                     PLATFORM ADMIN              RESULT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Org Creation Request   →   Review Request          →   Provision
(External/API)             ├─ Approve               →   ✅ Org Created
                           ├─ Deny                  →   ❌ Rejected
                           └─ Request Info          →   ⏸️  Pending

Audit: Critical
Billing: Plan assigned automatically
Notification: Org admin credentials sent
```

---

## 5.2 Approval Authority Matrix

```
APPROVAL TYPE              EMPLOYEE    ORG ADMIN    PLATFORM ADMIN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Leave Requests             ❌ No       ✅ Yes       ❌ No
Time Corrections           ❌ No       ✅ Yes       ❌ No
Expense Reimbursements     ❌ No       ✅ Yes       ❌ No
Finance Classification     ❌ No       ✅ Yes       ❌ No
Project Milestones         ❌ No       ✅ Yes       ❌ No
Employee Onboarding        ❌ No       ✅ Yes       ❌ No
Policy Changes             ❌ No       ✅ Yes       ❌ No
Organization Creation      ❌ No       ❌ No        ✅ Yes
Billing Plan Changes       ❌ No       ❌ No        ✅ Yes
Platform Admin Promotion   ❌ No       ❌ No        ✅ Yes
Feature Flag Toggle        ❌ No       ❌ No        ✅ Yes
Global Policy Changes      ❌ No       ❌ No        ✅ Yes
```

---

# 6. Audit Responsibility Map

## 6.1 Audit Trail Requirements by Role

### **EMPLOYEE Actions**

| Action Category | Audit Level | Retention | Who Can View |
|----------------|-------------|-----------|--------------|
| Time logging | Medium | 7 years | Self + Admin |
| Expense submission | High | 7 years | Self + Admin |
| Leave requests | High | 7 years | Self + Admin |
| Profile changes | Low | 7 years | Self + Admin |
| Work item updates | Medium | 7 years | Self + Admin |
| Communication | Low | 3 years | Self + Admin |

### **ORG ADMIN Actions**

| Action Category | Audit Level | Retention | Who Can View |
|----------------|-------------|-----------|--------------|
| Employee management | Critical | Permanent | Admin + Platform |
| Approval actions | Critical | Permanent | Admin + Platform |
| Finance entries | Critical | Permanent | Admin + Platform |
| Policy changes | Critical | Permanent | Admin + Platform |
| Data exports | Critical | Permanent | Admin + Platform |
| Security config | Critical | Permanent | Admin + Platform |
| Integration setup | High | Permanent | Admin + Platform |
| Report generation | Medium | 7 years | Admin only |

### **PLATFORM ADMIN Actions**

| Action Category | Audit Level | Retention | Who Can View |
|----------------|-------------|-----------|--------------|
| Org creation/deletion | Critical | Permanent | Platform only |
| Platform admin changes | Critical | Permanent | Platform only |
| Billing modifications | Critical | Permanent | Platform only |
| Feature flag changes | Critical | Permanent | Platform only |
| Global policy changes | Critical | Permanent | Platform only |
| System config changes | Critical | Permanent | Platform only |
| Cross-org data access | Critical | Permanent | Platform only |

---

## 6.2 Audit Event Types

### **Critical Events (Always Logged)**

```
🔴 CRITICAL — Permanent Retention + Immediate Alert
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Employee created/deleted
• Admin role granted/revoked
• Finance ledger entry posted
• Approval granted/denied (any type)
• Data export performed
• Security settings changed
• Integration credentials accessed
• Policy modified
• Organization created/deleted
• Platform admin action performed
• Billing plan changed
• Feature flag toggled
• Global policy changed
• Audit log accessed
• Multi-record deletion
```

### **High Events (Logged + Monitored)**

```
🟠 HIGH — 7 Year Retention + Periodic Review
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Time correction requested/approved
• Leave request submitted/approved
• Expense submitted/approved
• Project created/completed
• Department restructured
• Role permissions modified
• Report generated
• Integration connected/disconnected
• API key generated/revoked
• Fine issued/waived
• Payroll posted
• Settings modified
```

### **Medium Events (Logged + Available)**

```
🟡 MEDIUM — 7 Year Retention + On-Demand
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Time logged
• Task created/completed
• Assignment made
• Work item updated
• Profile updated
• Communication sent
• File uploaded
• Report viewed
• Analytics accessed
• Notification sent
```

### **Low Events (Logged + Summary)**

```
🟢 LOW — 3 Year Retention + Aggregated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Login/logout
• Page viewed
• Search performed
• Filter applied
• Preference changed
• Notification dismissed
• UI interaction
```

---

## 6.3 Audit Access Matrix

```
LOG TYPE                   EMPLOYEE    ORG ADMIN    PLATFORM ADMIN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Own Actions                ✅ View     ✅ View      ✅ View
Team Actions               ❌ No       ✅ View      ✅ View
Org-Wide Actions           ❌ No       ✅ View      ✅ View
Approval Actions           ❌ No       ✅ View      ✅ View
Admin Actions              ❌ No       ✅ View      ✅ View
Platform Actions           ❌ No       ❌ No        ✅ View
Cross-Org Actions          ❌ No       ❌ No        ✅ View
Security Events            ❌ No       ✅ Org Only  ✅ All
System Events              ❌ No       ❌ No        ✅ View
Audit Log Access Events    ❌ No       ✅ Own       ✅ All
```

---

# 7. Forbidden Access Zones

## 7.1 EMPLOYEE — Absolute Prohibitions

### **🚫 NEVER ALLOWED**

```
❌ View other employees' data (except public directory info)
❌ View org-wide financial data
❌ View org-wide analytics
❌ View other employees' time logs
❌ View other employees' earnings
❌ View other employees' activity
❌ Approve any request
❌ Delete any committed record
❌ Modify org settings
❌ Access admin panel
❌ View org audit logs
❌ Manage integrations (org-level)
❌ Generate org-wide reports
❌ Access billing information
❌ View team performance metrics
❌ Modify break rules
❌ Issue fines
❌ Post to finance ledger
❌ Access org-level finance data
❌ View salary data (others)
❌ Modify roles/permissions
❌ Delete other users' content
❌ Export org data
❌ Configure security policies
❌ Access API keys (org-level)
❌ View platform settings
```

### **⚠️ RESTRICTED (With Explicit Consent)**

```
⚠️  Screenshot capture (requires explicit consent)
⚠️  Activity monitoring (requires explicit consent)
⚠️  Location tracking (requires explicit consent)
⚠️  Input monitoring (requires explicit consent)
```

---

## 7.2 ORG ADMIN — Absolute Prohibitions

### **🚫 NEVER ALLOWED**

```
❌ Access other organizations' data
❌ Modify platform settings
❌ View platform-level analytics (cross-org)
❌ Create/delete organizations
❌ Manage platform admins
❌ Modify billing plans (create new)
❌ Access global audit logs
❌ Toggle feature flags
❌ Modify global policies
❌ Access platform billing data
❌ View other orgs' financial data
❌ Modify own org's billing plan (can request)
❌ Delete the organization
❌ Access platform API keys
❌ Modify system health settings
❌ View platform admin actions
❌ Bypass audit logging
❌ Modify audit logs
❌ Access deleted/archived org data (without platform)
❌ Restore permanently deleted data
```

### **⚠️ RESTRICTED (With Audit Requirements)**

```
⚠️  Delete employee records (soft delete only, permanent retention)
⚠️  Modify finance ledger (append-only, corrections via new entries)
⚠️  Export sensitive data (logged as critical event)
⚠️  Access raw activity data (privacy-filtered)
⚠️  Bulk delete operations (requires confirmation + audit)
⚠️  Modify locked periods (finance) - NEVER, no exceptions
```

---

## 7.3 PLATFORM ADMIN — Absolute Prohibitions

### **🚫 NEVER ALLOWED**

```
❌ Directly modify org operational data (work, time, tasks)
❌ Approve org-level requests (leave, expenses, etc.)
❌ Post to org finance ledgers
❌ Modify employee data directly
❌ Delete org data without org admin consent
❌ Bypass audit logging (ALL actions logged)
❌ Modify historical audit logs
❌ Access encrypted employee data (without decryption authority)
❌ Impersonate users without explicit authority
❌ Delete production organizations (test only)
❌ Modify committed financial transactions
❌ Bypass compliance policies
❌ Grant self unauthorized permissions
```

### **⚠️ RESTRICTED (With Extreme Audit)**

```
⚠️  Delete organizations (test only, permanent audit trail)
⚠️  Access org-specific sensitive data (privacy officer role only)
⚠️  Modify org subscriptions retroactively
⚠️  Override compliance policies (legal authority required)
⚠️  Access individual employee PII (legal/compliance only)
⚠️  Disable audit logging (NEVER in production)
```

---

# 8. Permission Enforcement Rules

## 8.1 Core Enforcement Principles

### **1. Principle of Least Privilege**
```
Every role has ONLY the minimum permissions required to perform their job.
Default state: DENY
Permissions must be explicitly granted.
```

### **2. Separation of Duties**
```
No single role can:
- Create AND approve the same record
- Modify AND audit their own actions
- Grant permissions AND use those permissions
```

### **3. Defense in Depth**
```
Permissions enforced at:
✅ UI layer (hide/disable controls)
✅ API layer (reject unauthorized requests)
✅ Database layer (row-level security)
✅ Audit layer (log all permission checks)
```

### **4. Immutable Audit Trail**
```
ALL permission checks are logged
ALL denied access attempts are logged
Audit logs CANNOT be modified or deleted
Audit log access is itself audited
```

### **5. Time-Based Restrictions**
```
Locked periods (finance): NO modifications
Archived records: READ-ONLY
Deleted records: SOFT DELETE (permanent retention for audit)
```

---

## 8.2 Permission Check Flow

```
USER ACTION REQUEST
        ↓
   ┌────────────────────────────────────┐
   │  1. AUTHENTICATION                 │
   │     Is user authenticated?         │
   │     ✅ Yes → Continue              │
   │     ❌ No → Reject (401)           │
   └────────────────────────────────────┘
        ↓
   ┌────────────────────────────────────┐
   │  2. ROLE IDENTIFICATION            │
   │     What role is user?             │
   │     • Employee                     │
   │     • Org Admin                    │
   │     • Platform Admin               │
   └────────────────────────────────────┘
        ↓
   ┌────────────────────────────────────┐
   │  3. PERMISSION CHECK               │
   │     Does role have permission?     │
   │     Check: View/Create/Edit/       │
   │            Approve/Delete          │
   │     ✅ Yes → Continue              │
   │     ❌ No → Reject (403)           │
   └────────────────────────────────────┘
        ↓
   ┌────────────────────────────────────┐
   │  4. SCOPE CHECK                    │
   │     Is resource in scope?          │
   │     Employee: Own data only        │
   │     Org Admin: Org data only       │
   │     Platform: All orgs             │
   │     ✅ Yes → Continue              │
   │     ❌ No → Reject (403)           │
   └────────────────────────────────────┘
        ↓
   ┌────────────────────────────────────┐
   │  5. BUSINESS RULES                 │
   │     Special restrictions?          │
   │     • Locked period?               │
   │     • Approval required?           │
   │     • Quota limit?                 │
   │     ✅ Pass → Continue             │
   │     ❌ Fail → Reject (403/409)     │
   └────────────────────────────────────┘
        ↓
   ┌────────────────────────────────────┐
   │  6. AUDIT LOG                      │
   │     Log action attempt             │
   │     • User                         │
   │     • Action                       │
   │     • Resource                     │
   │     • Result                       │
   │     • Timestamp                    │
   └────────────────────────────────────┘
        ↓
   ┌────────────────────────────────────┐
   │  7. EXECUTE ACTION                 │
   │     Perform requested action       │
   │     ✅ Success → Return 200/201    │
   │     ❌ Error → Return 500          │
   └────────────────────────────────────┘
        ↓
   ┌────────────────────────────────────┐
   │  8. AUDIT RESULT                   │
   │     Log action result              │
   │     • Success/failure              │
   │     • Data modified                │
   │     • Error details                │
   └────────────────────────────────────┘
```

---

## 8.3 UI Enforcement Rules

### **Hide vs Disable vs Block**

```
HIDE (🙈)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Control is completely removed from UI
User cannot see it exists
Example: Admin menu hidden from employees

DISABLE (🔒)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Control is visible but grayed out
Shows user that feature exists but requires permission
Example: "Approve" button disabled for pending own request

BLOCK (🚫)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Action is attempted but rejected
Shows error message explaining why
Example: Attempting to view another employee's data
```

### **Permission-Based UI Rendering**

```typescript
// Example: Conditional rendering based on role
if (userRole === 'EMPLOYEE') {
  // Hide admin controls completely
  showAdminPanel = false;
  
  // Only show own data
  dataScope = { userId: currentUser.id };
  
  // Disable approval actions
  canApprove = false;
}

if (userRole === 'ORG_ADMIN') {
  // Show admin controls
  showAdminPanel = true;
  
  // Show org-wide data
  dataScope = { orgId: currentUser.orgId };
  
  // Enable approval actions
  canApprove = true;
  
  // Hide platform controls
  showPlatformPanel = false;
}

if (userRole === 'PLATFORM_ADMIN') {
  // Show platform controls
  showPlatformPanel = true;
  
  // Show all orgs data (read-only)
  dataScope = { platformWide: true };
  
  // Disable org-level operations
  canModifyOrgData = false;
}
```

---

## 8.4 API Enforcement Rules

### **Request Validation**

```javascript
// Every API endpoint MUST validate:

1. Authentication
   - Valid session token?
   - Token not expired?
   - User account active?

2. Authorization
   - User role identified?
   - Permission exists for action?
   - Scope matches (own/org/platform)?

3. Input Validation
   - Required fields present?
   - Data types correct?
   - Values within bounds?

4. Business Rules
   - Resource in valid state?
   - No conflicts?
   - Quota not exceeded?

5. Audit
   - Log request attempt
   - Log validation results
   - Log action outcome
```

### **Response Codes**

```
200 OK                      ✅ Success
201 Created                 ✅ Resource created
204 No Content              ✅ Success (no return data)
400 Bad Request             ❌ Invalid input
401 Unauthorized            ❌ Not authenticated
403 Forbidden               ❌ Not authorized (permission denied)
404 Not Found               ❌ Resource doesn't exist OR out of scope
409 Conflict                ❌ Business rule violation
422 Unprocessable Entity    ❌ Valid input but can't process
429 Too Many Requests       ⏸️  Rate limit exceeded
500 Internal Server Error   ❌ Server error
```

### **Forbidden Action Responses**

```json
// Example: Employee trying to view org finances
{
  "error": "FORBIDDEN",
  "message": "You do not have permission to access org-wide financial data",
  "code": "PERMISSION_DENIED",
  "requiredRole": "ORG_ADMIN",
  "yourRole": "EMPLOYEE",
  "action": "VIEW_ORG_FINANCES",
  "timestamp": "2026-01-07T14:30:00Z",
  "auditId": "aud_xyz789"
}

// Example: Org Admin trying to delete organization
{
  "error": "FORBIDDEN",
  "message": "Organization deletion requires Platform Admin access",
  "code": "PERMISSION_DENIED",
  "requiredRole": "PLATFORM_ADMIN",
  "yourRole": "ORG_ADMIN",
  "action": "DELETE_ORGANIZATION",
  "timestamp": "2026-01-07T14:30:00Z",
  "auditId": "aud_abc123"
}
```

---

## 8.5 Database-Level Enforcement

### **Row-Level Security (RLS)**

```sql
-- Example: Employees can only see their own time logs
CREATE POLICY employee_time_logs_policy ON time_logs
  FOR SELECT
  USING (
    CASE
      WHEN current_user_role() = 'EMPLOYEE'
        THEN user_id = current_user_id()
      WHEN current_user_role() = 'ORG_ADMIN'
        THEN org_id = current_user_org_id()
      WHEN current_user_role() = 'PLATFORM_ADMIN'
        THEN TRUE  -- Can view all (read-only)
      ELSE FALSE
    END
  );

-- Example: Only org admins can insert finance entries
CREATE POLICY org_admin_finance_insert_policy ON finance_entries
  FOR INSERT
  WITH CHECK (
    current_user_role() IN ('ORG_ADMIN', 'FINANCE_MANAGER')
    AND org_id = current_user_org_id()
  );

-- Example: NOBODY can delete from ledger
CREATE POLICY ledger_no_delete_policy ON finance_ledger
  FOR DELETE
  USING (FALSE);  -- Always deny

-- Example: NOBODY can update ledger (append-only)
CREATE POLICY ledger_no_update_policy ON finance_ledger
  FOR UPDATE
  USING (FALSE);  -- Always deny
```

---

# 9. Implementation Checklist

## 9.1 Frontend Implementation

```
✅ Role-based component rendering
✅ Permission-based UI element visibility
✅ Action button enable/disable logic
✅ Route guards for protected pages
✅ Sidebar menu filtering by role
✅ Form field visibility by permission
✅ Error messages for forbidden actions
✅ Permission check before API calls
✅ Loading states during permission checks
✅ Graceful degradation for missing permissions
```

## 9.2 Backend Implementation

```
✅ Authentication middleware
✅ Authorization middleware
✅ Role identification system
✅ Permission registry/database
✅ Scope validation logic
✅ Business rule enforcement
✅ Audit logging system
✅ Rate limiting
✅ Input validation
✅ Output sanitization
✅ Database row-level security
✅ API endpoint protection
✅ Error handling and reporting
✅ Permission caching (with invalidation)
```

## 9.3 Security Implementation

```
✅ Encrypted sessions
✅ Secure token storage
✅ HTTPS enforcement
✅ CORS configuration
✅ SQL injection prevention
✅ XSS prevention
✅ CSRF protection
✅ Rate limiting
✅ IP allowlisting (optional)
✅ 2FA enforcement (optional per org)
✅ Session timeout
✅ Concurrent session limits
✅ Password policy enforcement
✅ Audit log encryption
```

---

# 10. Constitutional Status

## 10.1 Immutability Declaration

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│               🔒 SYSTEM LAW — IMMUTABLE 🔒                 │
│                                                             │
│  This Role Boundary Core document is IMMUTABLE SYSTEM LAW  │
│                                                             │
│  Changes require:                                           │
│  ✅ Constitutional amendment process                       │
│  ✅ Security review and approval                           │
│  ✅ Legal compliance review                                │
│  ✅ Impact assessment                                      │
│  ✅ Migration plan                                         │
│  ✅ Audit trail of change                                  │
│                                                             │
│  No code changes can override these boundaries             │
│  No admin action can bypass these rules                    │
│  No emergency can suspend these protections                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 10.2 Enforcement Priority

```
ENFORCEMENT HIERARCHY (Highest to Lowest)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1️⃣  Constitutional Law (This Document)
    ↓ Overrides everything below
2️⃣  Security Policies
    ↓ Implements constitutional boundaries
3️⃣  Business Rules
    ↓ Operates within security policies
4️⃣  Feature Logic
    ↓ Respects all above
5️⃣  User Preferences
    ↓ Cannot bypass any above
```

## 10.3 Violation Response

```
PERMISSION VIOLATION DETECTED
        ↓
┌──────────────────────────────────────┐
│  1. IMMEDIATE ACTION DENIAL          │
│     ❌ Request blocked                │
│     ⚠️  User shown error              │
└──────────────────────────────────────┘
        ↓
┌──────────────────────────────────────┐
│  2. CRITICAL AUDIT LOG ENTRY         │
│     📝 Who, What, When, Where         │
│     🚨 Flagged as security event      │
└──────────────────────────────────────┘
        ↓
┌──────────────────────────────────────┐
│  3. ALERT ESCALATION                 │
│     🔔 Security team notified         │
│     📧 Email alert sent               │
│     📊 Incident created               │
└──────────────────────────────────────┘
        ↓
┌──────────────────────────────────────┐
│  4. PATTERN DETECTION                │
│     🔍 Check for repeated attempts    │
│     ⚠️  Possible attack?              │
│     🔒 Consider account lock          │
└──────────────────────────────────────┘
        ↓
┌──────────────────────────────────────┐
│  5. INVESTIGATION                    │
│     🕵️  Review user intent            │
│     📋 Check for legitimate need      │
│     ⚖️  Determine response            │
└──────────────────────────────────────┘
```

---

# 11. Summary Tables

## 11.1 Quick Reference: Role Capabilities

```
CAPABILITY                 EMPLOYEE    ORG ADMIN    PLATFORM ADMIN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Data Scope                 Own         Org          All Orgs
Work Management            Own         All          Read-Only
Employee Management        None        All          Metadata
Time Management            Own         All          Analytics
Finance Access             Own         Org          Platform
Approval Authority         None        Org          Platform
Settings Control           Own         Org          Platform
Analytics Access           Own         Org          Cross-Org
Security Config            None        Org          Global
Audit Log Access           Own         Org          Global
Integration Management     Personal    Org          Platform
Billing Access             None        View         Full
Delete Authority           Drafts      Most         Test Only
Export Data                Own         Org          All
API Access                 None        Org          Platform
```

## 11.2 Quick Reference: Domain Access

```
DOMAIN                     EMPLOYEE    ORG ADMIN    PLATFORM ADMIN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Execution OS               Limited     Full         Read
People OS                  Own         Full         Metadata
Time OS                    Own         Full         Analytics
Finance OS                 Own         Full         Platform
Organization OS            View        Full         All
Business OS                None        Full         Platform
Intelligence OS            Own         Full         Cross-Org
Platform OS                None        None         Full
Security & Compliance      Own         Org          Global
Integrations               Personal    Org          Platform
Billing                    None        View         Full
```

---

# 12. Version Control

## Version History

| Version | Date | Changes | Authority |
|---------|------|---------|-----------|
| 1.0.0 | 2026-01-07 | Initial immutable specification | WorkOS Constitution |

---

## 🔒 END OF IMMUTABLE SYSTEM LAW 🔒

**This document defines the permanent permission architecture for WorkOS.**  
**All code must implement and enforce these boundaries.**  
**No exceptions. No bypasses. No compromises.**

---

**Last Updated:** January 7, 2026  
**Authority:** WorkOS Constitution  
**Status:** ACTIVE AND IMMUTABLE  
**Classification:** SYSTEM LAW 🔒
