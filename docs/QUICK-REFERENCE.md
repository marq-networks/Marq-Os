# WorkOS Quick Reference Card

**One-page cheat sheet for developers**

---

## 🎭 5 Role Layers

```
Platform Admin → Manages entire SaaS platform (all orgs)
Org Owner      → Owns organization, final decisions
Org Admin      → Day-to-day admin (HR, IT, policies)
Manager        → Team lead, approvals, oversight
Employee       → Individual contributor
```

---

## 🏛️ 9 Domains

```
WORK           → Projects, tasks, assignments
PEOPLE         → Employees, departments, roles
TIME           → Time tracking, leave, fines
FINANCE        → Ledger, expenses, payroll
COMMUNICATION  → Chat, channels, notifications
ANALYTICS      → Reports, dashboards (read-only)
SECURITY       → Auth, audit, compliance
PLATFORM       → Org lifecycle, subscriptions
INTEGRATIONS   → Third-party apps, APIs
```

---

## ⚖️ 7 Data Flow Laws

```
1. TIME → triggers → FINANCE
   (Time logs create billable hours, fines create receivables)

2. PEOPLE → anchors → WORK
   (Projects reference employee IDs, can't create employees)

3. WORK → produces → FINANCE
   (Projects create budgets, milestones trigger payments)

4. FINANCE → pays → PEOPLE
   (Payroll, reimbursements flow through Finance)

5. ANALYTICS → reads all
   (Read-only, no source data creation)

6. SECURITY → gates all
   (All access checked, owns no business data)

7. PLATFORM → bills all
   (Subscriptions, no direct org data access)
```

---

## 🚫 Common Violations

```
❌ Finance creating time logs (use TIME domain)
❌ Work storing employee data (reference PEOPLE)
❌ Analytics modifying data (read-only)
❌ Platform accessing org business data directly
❌ Bypassing Security for "admin convenience"
❌ Creating reports in Platform Admin (use Org Admin)
```

---

## 📁 Route Patterns

```
/employee/*         → Employee view
/admin/*            → Org Admin view
/org/{domain}/*     → Org Owner view (Finance)
/super/*            → Platform Admin view
```

---

## 🎨 UX Rules

```
✅ ONE navigation.ts (single source)
✅ ONE AppShell (no duplicate layouts)
✅ PageLayout for all screens
✅ View switcher visible (until Phase E)
✅ Semantic 5-layer sidebar structure
✅ Diagnostics to /docs/diagnostics/*.md ONLY

❌ NO hardcoded nav items
❌ NO custom shells per domain
❌ NO report pages in Platform Admin
❌ NO diagnostic routes/screens
❌ NO auth until Phase E
```

---

## 🗺️ Build Phases

```
Phase A: Skeleton     → Nav + routes + stubs
Phase B: Stubs + Data → UI + mock data
Phase C: Wiring       → Data flows, integrations
Phase D: Polish       → Permissions, modals, validation
Phase E: Auth Last    → Login, sessions, production
```

---

## 📊 Current State

```
Phase:    B/C (Stubs exist, wiring in progress)
Routes:   57+ defined
Domains:  9/9 implemented
Modules:  
  ✅ WORK (5 screens)
  ✅ FINANCE (13 screens)
  ✅ COMMUNICATION (7 screens)
  ✅ PEOPLE (2 screens)
  ✅ TIME (8 screens + Fines)
  🔄 ANALYTICS (partial)
  🔄 SECURITY (partial)
```

---

## 🔍 Quick Checks

**Before Adding a Feature:**
```
1. Which domain owns it? (Check Domain Model)
2. Any data flow dependencies? (Check Data Flow Law)
3. Is it in Module Registry? (Check Constitution)
4. Follow route pattern? (/employee/* or /admin/*)
```

**Before Committing:**
```
1. No new routes outside skeleton? ✅
2. Navigation.ts updated? ✅
3. Follows UX rules? ✅
4. No data flow violations? ✅
```

---

## 📖 Full Docs

**Read:** [WorkOS Constitution](./WORKOS-CONSTITUTION.md) for complete details.