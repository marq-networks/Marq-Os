# WORKOS CONSTITUTION — CROSS-OS DATA SPINE v1

**Status:** `IMMUTABLE CONTRACT`  
**Version:** 1.0.0  
**Last Updated:** 2026-01-07  
**Authority:** Constitutional Foundation Layer

---

## OBJECTIVE

Define the **permanent data relationships** between core OS domains.

**Scope Exclusions:**
- ❌ NO UI changes
- ❌ NO new screens  
- ❌ NO logic implementation
- ❌ NO feature additions

**This document defines:**
- ✅ Schema contracts
- ✅ Data flow rules
- ✅ Cross-domain relationships
- ✅ Forbidden operations

---

## ARCHITECTURAL OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATA SPINE FLOW                          │
└─────────────────────────────────────────────────────────────────┘

     PEOPLE (Source of Truth)
        │
        ├──────→ WORK (Assignment)
        │           │
        │           └──→ FINANCE (Burn/Margin)
        │
        ├──────→ TIME (Sessions)
        │           │
        │           └──→ FINANCE (Cost Entries)
        │
        └──────→ FINANCE (Payroll/Reimbursements)
                    │
                    └──→ PEOPLE (Pay Statements)

     ┌─────────────────────────────────────┐
     │   ANALYTICS (Read-Only Observer)    │
     │   Reads: People, Work, Time, Finance│
     └─────────────────────────────────────┘

     ┌─────────────────────────────────────┐
     │   SECURITY (Global Audit Trail)     │
     │   Captures: All Domain Mutations    │
     └─────────────────────────────────────┘
```

---

## 1. PEOPLE → WORK

### Data Links

```typescript
// Schema Contract
employee.id (UUID)
  → assignedTasks.employeeId (FK)
  → projectMembers.employeeId (FK)
  → managerId (FK, self-referential)
```

### Flow Diagram

```
Employee Record
    │
    ├──→ Task Assignments
    │       • assignedTasks[].employeeId = employee.id
    │       • task.status: pending | in_progress | completed
    │
    ├──→ Project Memberships
    │       • projectMembers[].employeeId = employee.id
    │       • role: member | lead | observer
    │
    └──→ Management Hierarchy
            • employee.managerId → manager.id (also employee)
            • Creates reporting chain
```

### Rules

| Rule | Constraint |
|------|-----------|
| **R1.1** | An employee MAY belong to **many** projects |
| **R1.2** | A task MUST resolve to **exactly one** employee OR manager |
| **R1.3** | Tasks cannot exist without an assigned employee |
| **R1.4** | Manager assignments create hierarchy (no circular refs) |
| **R1.5** | Deleting an employee MUST reassign or archive their tasks |

### Forbidden Operations

- ❌ Creating tasks without an employeeId
- ❌ Assigning tasks to non-existent employees
- ❌ Creating circular manager relationships (A → B → A)
- ❌ Hard-deleting employees with active tasks
- ❌ Modifying employee.id after task assignments exist

---

## 2. PEOPLE → TIME

### Data Links

```typescript
// Schema Contract
employee.id (UUID)
  → timeSessions.employeeId (FK)
  → leaveRequests.employeeId (FK)
  → fines.employeeId (FK)
```

### Flow Diagram

```
Employee Record
    │
    ├──→ Time Sessions
    │       • session.employeeId = employee.id
    │       • session.startTime, endTime, minutes
    │       • session.sessionType: work | break | idle
    │
    ├──→ Leave Requests
    │       • leave.employeeId = employee.id
    │       • leave.type: vacation | sick | personal
    │       • leave.status: pending | approved | rejected
    │
    └──→ Fines
            • fine.employeeId = employee.id
            • fine.reason, amount, status
            • fine.relatedSessionId (optional)
```

### Rules

| Rule | Constraint |
|------|-----------|
| **R2.1** | Time records CANNOT exist without an employee |
| **R2.2** | Leave & fines are **employee-scoped only** (no team/dept level) |
| **R2.3** | Time sessions MUST have valid employeeId at creation |
| **R2.4** | Overlapping time sessions for same employee are forbidden |
| **R2.5** | Leave approval does NOT create time entries (separate domain) |

### Forbidden Operations

- ❌ Creating time sessions without employeeId
- ❌ Creating department-level leave requests
- ❌ Assigning fines to projects or departments
- ❌ Retroactive time deletion without audit trail
- ❌ Modifying session.employeeId after creation

---

## 3. TIME → FINANCE

### Data Links

```typescript
// Schema Contract
timeSessions.minutes (INTEGER)
  × department.costPerMinute (DECIMAL)
  → finance.costEntries (CALCULATED)
```

### Flow Diagram

```
Time Session (Immutable After Close)
    │
    ├─→ Lookup: employee.departmentId
    │       └─→ department.costPerMinute (rate)
    │
    ├─→ Calculate: session.minutes × costPerMinute
    │       └─→ Result: laborCost (decimal)
    │
    └─→ Create: finance.costEntry
            • costEntry.sourceType = "TIME_SESSION"
            • costEntry.sourceId = session.id
            • costEntry.amount = laborCost
            • costEntry.category = "LABOR"
            • costEntry.employeeId = session.employeeId
            • costEntry.timestamp = session.endTime
```

### Rules

| Rule | Constraint |
|------|-----------|
| **R3.1** | Time creates **cost**, NOT revenue |
| **R3.2** | Time edits trigger **cost recompute** (cascade) |
| **R3.3** | Cost entries are immutable once created |
| **R3.4** | Edits create new cost entry + reversal of old entry |
| **R3.5** | Department rate changes do NOT retroactively affect closed sessions |

### Calculation Formula

```
laborCost = (session.minutes ÷ 60) × department.hourlyRate
  OR
laborCost = session.minutes × department.costPerMinute

Where:
  • session.minutes: actual worked time (INTEGER)
  • department.costPerMinute: cost rate (DECIMAL)
  • laborCost: final cost entry amount (DECIMAL)
```

### Forbidden Operations

- ❌ Time creating revenue entries in Finance
- ❌ Direct cost entry modification (use reversals)
- ❌ Recalculating historical costs when rates change
- ❌ Finance editing time session data
- ❌ Creating cost entries without source session reference

---

## 4. WORK → FINANCE

### Data Links

```typescript
// Schema Contract
tasks.estimatedHours (DECIMAL)
tasks.actualHours (DECIMAL)
projects.budget (DECIMAL)
  → finance.burn (CALCULATED)
  → finance.margin (CALCULATED)
```

### Flow Diagram

```
Project Budget
    │
    ├─→ Task Estimates
    │       • SUM(tasks.estimatedHours × hourlyRate) = estimatedCost
    │       • project.budget - estimatedCost = projectedMargin
    │
    ├─→ Actual Time Tracking
    │       • SUM(tasks.actualHours × hourlyRate) = actualCost
    │       • project.budget - actualCost = currentMargin
    │
    └─→ Finance Burn Calculation
            • burn = actualCost
            • margin = project.budget - actualCost - otherCosts
            • marginPercent = (margin ÷ project.budget) × 100
            • burnRate = burn ÷ elapsedDays
```

### Rules

| Rule | Constraint |
|------|-----------|
| **R4.1** | Work produces **cost** (hours × rate) |
| **R4.2** | Finance **owns profit calculation** (Work provides inputs only) |
| **R4.3** | Task hours are tracked separately from time sessions |
| **R4.4** | Project budget is set in Finance, consumed by Work |
| **R4.5** | Margin calculations include ALL costs (labor + expenses) |

### Cost Flow

```
WORK Domain (Source)          FINANCE Domain (Calculator)
─────────────────────        ────────────────────────────
task.actualHours      ──→    costEntry.laborCost
project.budget        ──→    revenueEntry.projectBudget
task.assignedTo       ──→    costEntry.employeeRate

                             ↓
                      Finance Calculates:
                      • Total Burn
                      • Current Margin
                      • Profit Percentage
                      • Burn Rate
```

### Forbidden Operations

- ❌ Work domain calculating profit/margin
- ❌ Finance editing task hours directly
- ❌ Projects creating revenue entries
- ❌ Task-level budget allocation (project-level only)
- ❌ Work domain reading finance transaction details

---

## 5. FINANCE → PEOPLE

### Data Links

```typescript
// Schema Contract
finance.payroll.salary (DECIMAL)
finance.reimbursements (DECIMAL)
finance.fines (DECIMAL)
  → employee.payStatements (READ-ONLY PUBLISHING)
```

### Flow Diagram

```
Finance System (Source of Truth)
    │
    ├─→ Payroll Calculation
    │       • baseSalary (from employee.salary)
    │       • + bonuses
    │       • + reimbursements
    │       • - fines
    │       • - deductions
    │       • = netPay
    │
    ├─→ Reimbursement Processing
    │       • expense.employeeId
    │       • expense.amount (approved)
    │       • status: pending → approved → paid
    │
    ├─→ Fine Processing
    │       • fine.employeeId
    │       • fine.amount
    │       • fine.deductionMonth
    │
    └─→ Publish to Employee
            • payStatement.employeeId
            • payStatement.grossPay
            • payStatement.deductions[]
            • payStatement.netPay
            • payStatement.paymentDate
            • payStatement.status: PUBLISHED (immutable)
```

### Rules

| Rule | Constraint |
|------|-----------|
| **R5.1** | Finance **NEVER** edits employee master data (name, role, dept) |
| **R5.2** | Finance **publishes outcomes only** (read-only for employees) |
| **R5.3** | Pay statements are immutable after publishing |
| **R5.4** | Corrections create new entries, never edit old ones |
| **R5.5** | Employee can read pay statements but cannot modify |

### Data Ownership

```
PEOPLE Domain (Owner)        FINANCE Domain (Consumer)
─────────────────────        ─────────────────────────
employee.id           ──→    payroll.employeeId (FK)
employee.salary       ──→    payroll.baseSalary (copy)
employee.department   ──→    costCalculation.rate

                             ↓
                      Finance Publishes:
                      • payStatement (immutable)
                      • reimbursementStatus
                      • fineDeductions
                             
                             ↓
PEOPLE Domain (Read-Only)
employee.payStatements[] ←── finance.payStatement
```

### Forbidden Operations

- ❌ Finance modifying employee.name, employee.role, employee.department
- ❌ Employees editing their own pay statements
- ❌ Direct mutation of published pay statements
- ❌ Deleting pay statement history
- ❌ Finance creating/deleting employee records

---

## 6. ANALYTICS (READ-ONLY)

### Data Sources

```typescript
// Analytics ONLY reads, NEVER writes
analytics.queries
  ← people.employees (READ)
  ← work.projects (READ)
  ← work.tasks (READ)
  ← time.sessions (READ)
  ← finance.transactions (READ)
```

### Read Permissions

```
Analytics Domain (Observer Only)
    │
    ├─→ People Metrics
    │       • READ: employee count, department distribution
    │       • READ: active vs inactive employees
    │       • FORBIDDEN: employee.write()
    │
    ├─→ Work Metrics
    │       • READ: task completion rates, project progress
    │       • READ: assignment distribution
    │       • FORBIDDEN: task.update(), project.create()
    │
    ├─→ Time Metrics
    │       • READ: session totals, average work time
    │       • READ: leave utilization, fine trends
    │       • FORBIDDEN: session.delete(), fine.approve()
    │
    └─→ Finance Metrics
            • READ: revenue, costs, margins
            • READ: burn rates, profitability
            • FORBIDDEN: transaction.create(), budget.modify()
```

### Rules

| Rule | Constraint |
|------|-----------|
| **R6.1** | Analytics CANNOT write to ANY domain |
| **R6.2** | Analytics CANNOT approve/reject workflows |
| **R6.3** | Analytics reads via READ-ONLY replicas (eventual consistency OK) |
| **R6.4** | Analytics queries MUST NOT block operational writes |
| **R6.5** | Analytics can aggregate but NOT modify source data |

### Forbidden Operations

- ❌ `analytics.approveLeave()`
- ❌ `analytics.createEmployee()`
- ❌ `analytics.updateFinanceEntry()`
- ❌ `analytics.deleteTask()`
- ❌ Any mutation operation in Analytics domain
- ❌ Analytics triggering workflow state changes

---

## 7. SECURITY & AUDIT (GLOBAL)

### Audit Trail Contract

```typescript
// Every mutation emits this event
interface AuditEvent {
  actorRole: 'employee' | 'org_admin' | 'platform_admin';
  actorId: UUID;
  timestamp: ISO8601;
  domain: 'PEOPLE' | 'WORK' | 'TIME' | 'FINANCE' | 'COMMUNICATION';
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT';
  objectType: string;  // e.g., 'Employee', 'Task', 'TimeSession'
  objectId: UUID;
  changes?: Record<string, { old: any; new: any }>;
  ipAddress?: string;
  userAgent?: string;
}
```

### Global Capture Points

```
Every Domain Mutation
    │
    ├─→ Before Execution
    │       • Capture: actorId, actorRole, timestamp
    │       • Validate: permissions, role boundaries
    │
    ├─→ During Execution
    │       • Capture: domain, action, objectType, objectId
    │       • Record: old values (for UPDATE/DELETE)
    │
    └─→ After Execution
            • Capture: new values, success/failure
            • Emit: auditEvent → audit.log
            • Store: immutable audit entry
```

### Rules

| Rule | Constraint |
|------|-----------|
| **R7.1** | ALL mutations MUST emit audit events |
| **R7.2** | Audit logs are **IMMUTABLE** (append-only) |
| **R7.3** | Failed operations MUST also be logged |
| **R7.4** | Audit events CANNOT be deleted (retention policy only) |
| **R7.5** | Actor identity MUST be authenticated, not self-reported |

### Audit Coverage Matrix

| Domain | CREATE | UPDATE | DELETE | APPROVE | REJECT |
|--------|--------|--------|--------|---------|--------|
| **PEOPLE** | ✅ | ✅ | ✅ | N/A | N/A |
| **WORK** | ✅ | ✅ | ✅ | N/A | N/A |
| **TIME** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **FINANCE** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **COMMUNICATION** | ✅ | ✅ | ✅ | N/A | N/A |

### Forbidden Operations

- ❌ Mutating audit logs after creation
- ❌ Deleting audit entries (even by platform admin)
- ❌ Operations without audit trail
- ❌ Self-reported actor identity (must be system-verified)
- ❌ Batch operations that skip individual audit events

---

## DATA OWNERSHIP MATRIX

| Domain | Owns | Reads From | Publishes To | Cannot Touch |
|--------|------|------------|--------------|--------------|
| **PEOPLE** | Employee data, Departments | — | WORK, TIME, FINANCE | Finance transactions |
| **WORK** | Tasks, Projects, Assignments | PEOPLE (employees) | FINANCE (burn data) | Time sessions, Pay statements |
| **TIME** | Sessions, Leave, Fines | PEOPLE (employees) | FINANCE (cost data) | Project budgets, Pay statements |
| **FINANCE** | Transactions, Budgets, Payroll | PEOPLE, WORK, TIME | PEOPLE (pay statements) | Employee master data, Task hours |
| **ANALYTICS** | Reports, Dashboards | ALL (read-only) | — (read-only) | Everything (no writes) |
| **SECURITY** | Audit logs, Permissions | ALL (metadata) | — (immutable logs) | Business domain data |

---

## CROSS-DOMAIN CALCULATION RULES

### Labor Cost Calculation
```
Source: TIME domain
Formula: session.minutes × department.costPerMinute
Output: FINANCE.costEntry (type: LABOR)
Trigger: session.status = 'CLOSED'
```

### Project Burn Calculation
```
Source: WORK domain (task hours) + FINANCE domain (other costs)
Formula: SUM(task.actualHours × rate) + SUM(expenses)
Output: FINANCE.projectBurn
Trigger: Real-time on task.actualHours update
```

### Margin Calculation
```
Source: FINANCE domain only
Formula: project.budget - project.totalCosts
Output: FINANCE.projectMargin
Owner: FINANCE (exclusive)
```

### Payroll Calculation
```
Source: FINANCE domain
Formula: baseSalary + reimbursements - fines - deductions
Output: PEOPLE.payStatement (read-only)
Trigger: Payroll run (scheduled)
```

---

## FORBIDDEN OPERATIONS (GLOBAL)

### Cross-Domain Violations

| Forbidden Action | Why |
|------------------|-----|
| WORK editing TIME sessions | Domain boundary violation |
| TIME creating FINANCE transactions directly | Finance owns transaction logic |
| FINANCE modifying PEOPLE.employee.role | People owns employee master data |
| ANALYTICS approving leave requests | Analytics is read-only |
| Any domain deleting AUDIT logs | Audit is immutable |
| PEOPLE setting project budgets | Finance owns budgets |
| Direct cross-domain writes | Must use published events/APIs |

### Data Integrity Violations

| Forbidden Action | Why |
|------------------|-----|
| Orphan records (FK without parent) | Referential integrity |
| Circular references in hierarchies | Prevents infinite loops |
| Retroactive mutation without audit | Compliance requirement |
| Hard deletes with active references | Data consistency |
| Mutations without actor identity | Security requirement |

---

## VERSIONING & IMMUTABILITY

### This Document is IMMUTABLE

- **Version:** 1.0.0
- **Status:** CONSTITUTIONAL FOUNDATION
- **Changes:** Require full system review + version bump
- **Scope:** All domains MUST comply

### Amendment Process

1. Proposal must demonstrate system-wide impact analysis
2. Requires review across ALL affected domains
3. Must maintain backward compatibility OR provide migration path
4. New version number (e.g., v2.0.0)
5. All implementations must update within 30 days

---

## COMPLIANCE CHECKLIST

Every new feature MUST answer:

- [ ] Which domain owns this data?
- [ ] What cross-domain reads are required?
- [ ] What events/publications are needed?
- [ ] What audit events will be emitted?
- [ ] What forbidden operations must be prevented?
- [ ] Does this violate any read-only constraints?
- [ ] Are all FK relationships defined?
- [ ] Is there a data ownership conflict?

---

## SUMMARY

### Core Principles

1. **Single Ownership:** Each data entity has ONE domain owner
2. **Read-Many, Write-One:** Other domains read, only owner writes
3. **Event Publishing:** Cross-domain updates via events, not direct writes
4. **Immutable Audit:** All mutations logged, logs never modified
5. **Referential Integrity:** No orphans, no dangling references
6. **Domain Boundaries:** Respect ownership, no cross-domain mutations

### Enforcement

- Schema validation at database level (FK constraints)
- API layer permission checks (role + domain boundaries)
- Audit logging at mutation layer (automatic, not optional)
- Code review checkpoints (compliance verification)
- Automated testing (forbidden operations should fail)

---

**END OF CROSS-OS DATA SPINE v1**

*This contract is the permanent foundation of WorkOS data architecture.*  
*All implementations must comply. No exceptions.*
