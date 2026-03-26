# WorkOS Diagnostics Output Directory

**Purpose:** Store all diagnostic outputs as markdown files (development artifacts only).

**Status:** Active  
**Last Updated:** January 7, 2026

---

## 🚨 CRITICAL RULE: NO DIAGNOSTIC ROUTES

**Constitutional Law (UX Binding Rule 4):**

> Diagnostic outputs MUST be written to `/docs/diagnostics/*.md` ONLY.  
> Never create routes or UI screens for diagnostics.

---

## 📋 Diagnostics Output Policy

### **ALLOWED:**
```
✅ Write diagnostic outputs to /docs/diagnostics/*.md
✅ Markdown format only (.md files)
✅ Access via file system (code editor, terminal)
✅ Include in git commits (development artifacts)
✅ Run diagnostic scripts that output to this directory
```

### **FORBIDDEN:**
```
❌ Creating diagnostic routes (/super/diagnostics, /admin/diagnostics, etc.)
❌ Creating diagnostic UI screens/components (DiagnosticsScreen.tsx)
❌ Adding diagnostic items to navigation.ts
❌ Building diagnostic dashboards (unless it's a production Platform Admin feature)
❌ Auto-generating diagnostic pages in Platform/Super Admin views
```

---

## 🎯 Why This Rule Exists

### **Problem: Route Proliferation**
Without this rule, diagnostics can bloat the navigation:
```
❌ Platform Admin Sidebar:
├─ Organizations
├─ Billing
├─ Navigation Audit        ← Diagnostic, shouldn't be here
├─ Route Coverage Report   ← Diagnostic, shouldn't be here
├─ Data Flow Check         ← Diagnostic, shouldn't be here
└─ System Diagnostics      ← Diagnostic, shouldn't be here
```

### **Solution: Markdown Files**
Diagnostics are development artifacts, not user features:
```
✅ /docs/diagnostics/
├─ navigation-audit.md
├─ route-coverage.md
├─ data-flow-check.md
└─ system-diagnostics.md
```

**Access:** Open files in your code editor or terminal.  
**No UI needed:** Diagnostics are for developers, not end-users.

---

## 📁 Allowed Diagnostic Files

### **System Architecture Diagnostics:**
```
✅ /docs/diagnostics/navigation-audit.md
✅ /docs/diagnostics/route-coverage.md
✅ /docs/diagnostics/domain-boundaries.md
✅ /docs/diagnostics/module-registry-check.md
✅ /docs/diagnostics/skeleton-compliance.md
```

### **Data Flow Diagnostics:**
```
✅ /docs/diagnostics/data-flow-check.md
✅ /docs/diagnostics/time-to-finance-flow.md
✅ /docs/diagnostics/people-to-work-anchoring.md
✅ /docs/diagnostics/work-to-finance-costing.md
✅ /docs/diagnostics/analytics-read-only-check.md
```

### **UX Binding Diagnostics:**
```
✅ /docs/diagnostics/ux-binding-compliance.md
✅ /docs/diagnostics/layout-consistency.md
✅ /docs/diagnostics/route-naming-audit.md
✅ /docs/diagnostics/sidebar-structure-check.md
```

### **Build Phase Diagnostics:**
```
✅ /docs/diagnostics/phase-a-skeleton-check.md
✅ /docs/diagnostics/phase-b-stubs-check.md
✅ /docs/diagnostics/phase-c-wiring-check.md
✅ /docs/diagnostics/phase-d-polish-check.md
```

---

## 🚫 Forbidden Diagnostic Outputs

### **DO NOT Create:**
```
❌ /src/app/components/screens/diagnostics/DiagnosticsScreen.tsx
❌ /src/app/components/screens/super/DiagnosticsConsole.tsx
❌ /src/app/components/screens/admin/SystemDiagnostics.tsx
❌ Routes in App.tsx (e.g., <Route path="/super/diagnostics">)
❌ Nav items in navigation.ts (e.g., { label: 'Diagnostics', path: '/super/diagnostics' })
```

### **Exception: Production Features**
If Platform Admin needs a "System Health" screen as a **production monitoring feature** (not a diagnostic dump):

1. **It must be in the Module Registry** (documented in Constitution)
2. **It must be intentional** (not auto-generated)
3. **It must be user-facing** (not developer-facing)
4. **It must have a route** (approved in skeleton)

Example of ALLOWED production feature:
```
✅ /super/system-health
   - Platform Admin production feature
   - Monitors uptime, performance, errors
   - User-facing dashboard (not diagnostic dump)
   - Documented in Module Registry
```

---

## 📝 How to Create Diagnostic Outputs

### **1. Run Diagnostic Script**
```bash
# Example: Generate navigation audit
node scripts/audit-navigation.js > /docs/diagnostics/navigation-audit.md
```

### **2. Manual Diagnostic**
Create a markdown file in `/docs/diagnostics/`:

```markdown
# Navigation Audit

**Date:** 2026-01-07  
**Purpose:** Verify navigation.ts compliance with Constitution

## Results

### Employee Nav Items
- Total: 14
- All routes exist: ✅
- All paths valid: ✅

### Admin Nav Items
- Total: 33
- All routes exist: ✅
- All paths valid: ✅

### Platform Nav Items
- Total: 10
- All routes exist: ✅
- All paths valid: ✅

## Issues Found
None.

## Recommendations
- Continue monitoring after new route additions
- Run this audit before major releases
```

### **3. Automated Diagnostics (CI/CD)**
Add diagnostic checks to your CI pipeline:

```yaml
# .github/workflows/diagnostics.yml
name: Architecture Diagnostics

on: [push, pull_request]

jobs:
  diagnostics:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm run diagnostics
      - run: git add docs/diagnostics/*.md
      - run: git commit -m "Update diagnostics" || true
```

---

## 🔍 Viewing Diagnostic Outputs

### **In Code Editor:**
```
1. Open VSCode (or your editor)
2. Navigate to /docs/diagnostics/
3. Click on any .md file
4. Read the diagnostic output
```

### **In Terminal:**
```bash
# View all diagnostics
ls -la docs/diagnostics/

# Read specific diagnostic
cat docs/diagnostics/navigation-audit.md

# Search diagnostics
grep -r "error" docs/diagnostics/
```

### **In Browser (via GitHub):**
```
https://github.com/your-repo/tree/main/docs/diagnostics
```

---

## ✅ Verification Checklist

**Before creating ANY diagnostic output, verify:**

- [ ] Is this a diagnostic (development artifact)?
- [ ] Should it be a markdown file in `/docs/diagnostics/`?
- [ ] Am I about to create a route? (STOP! Use markdown instead)
- [ ] Am I about to create a screen component? (STOP! Use markdown instead)
- [ ] Am I about to add to navigation.ts? (STOP! Don't do it)

**If ANY of these are "yes" to route/screen/nav, write to markdown instead.**

---

## 📚 Related Constitutional Rules

**See:**
- `/docs/WORKOS-CONSTITUTION.md` → UX Binding Rule 4: Diagnostics Output Policy
- `/docs/WORKOS-CONSTITUTION.md` → UX Binding Rule 3: No "Report Pages" Auto-Created
- `/docs/WORKOS-CONSTITUTION.md` → Module Registry (no diagnostics listed)

---

## 🎯 Summary

**Diagnostics = Markdown files in `/docs/diagnostics/`**

**NOT routes, NOT screens, NOT navigation items.**

**When in doubt:**
1. Is this for developers? → Markdown file
2. Is this for end-users? → Consider if it's a real feature
3. Is it a diagnostic? → Markdown file in `/docs/diagnostics/`

**No exceptions** (unless it's a documented production feature in the Module Registry).

---

**Last Updated:** January 7, 2026  
**Authority:** WorkOS Constitution (UX Binding Rule 4)  
**Enforcement:** Immediate refactoring if violated
