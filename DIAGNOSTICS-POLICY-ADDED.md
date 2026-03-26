# DIAGNOSTICS POLICY — ADDED ✅

## 📜 Task Complete

Successfully added **Diagnostics Output Policy** to prevent diagnostics from generating new routes/pages under Platform/Super Admin.

**Status:** ✅ COMPLETE  
**Location:** `/docs/WORKOS-CONSTITUTION.md` → UX Binding Rule 4  
**Date:** January 7, 2026

---

## 🎯 What Was Done

### 1. **Added Constitutional Rule**
**Location:** `/docs/WORKOS-CONSTITUTION.md`  
**Section:** UX Binding Rules → Rule 4: Diagnostics Output Policy

**Law Established:**
> Diagnostic outputs MUST be written to `/docs/diagnostics/*.md` ONLY.  
> Never create routes or UI screens for diagnostics.

---

### 2. **Created Diagnostics Directory**
**Location:** `/docs/diagnostics/README.md`

**Contains:**
- Policy statement (diagnostics = markdown only)
- Allowed diagnostic outputs (examples)
- Forbidden diagnostic outputs (routes, screens, nav items)
- How to create diagnostic outputs
- Viewing diagnostic outputs
- Verification checklist

---

### 3. **Updated Documentation Index**
**Location:** `/docs/README.md`

**Changes:**
- Added `/docs/diagnostics/` to document structure
- Listed diagnostics directory in file tree
- No new routes or screens created

---

## 📋 Constitutional Rule Added

### **UX Binding Rule 4: Diagnostics Output Policy**

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

---

## ✅ Allowed Diagnostic Outputs

```
✅ /docs/diagnostics/navigation-audit.md
✅ /docs/diagnostics/data-flow-check.md
✅ /docs/diagnostics/route-coverage.md
✅ /docs/diagnostics/domain-boundaries.md
✅ /docs/diagnostics/skeleton-compliance.md
✅ /docs/diagnostics/ux-binding-compliance.md
✅ /docs/diagnostics/phase-*-check.md
```

**Access:** Open files in code editor, terminal, or GitHub.

---

## 🚫 Forbidden Diagnostic Outputs

```
❌ /super/diagnostics (route)
❌ /admin/system-diagnostics (route)
❌ DiagnosticsScreen.tsx (component)
❌ SystemHealthDashboard.tsx (unless documented production feature)
❌ Any diagnostic route in navigation.ts
❌ Any diagnostic item in sidebar navigation
```

**If created:** Immediate refactoring required (constitutional violation).

---

## 🔍 Exception Documented

**Platform Admin MAY have "System Health" screen IF:**

1. It's a **production feature** (not diagnostic dump)
2. It's **documented in Module Registry** (Constitution)
3. It's **intentional** (not auto-generated)
4. It's **user-facing** (monitoring uptime, performance, errors)
5. It has an **approved route** (in skeleton)

**Example of ALLOWED production feature:**
```
✅ /super/system-health
   - Platform Admin production monitoring feature
   - Real-time uptime, performance metrics, error tracking
   - User-facing dashboard (not developer diagnostic)
   - Documented in Constitution Module Registry
```

**Example of FORBIDDEN diagnostic:**
```
❌ /super/navigation-audit
   - Developer diagnostic, not user feature
   - Should be /docs/diagnostics/navigation-audit.md
   - Not in Module Registry
   - Development artifact
```

---

## 📁 Diagnostics Directory Structure

```
/docs/diagnostics/
├── README.md                          ← Policy & rules (NEW)
├── navigation-audit.md                ← Example (future)
├── route-coverage.md                  ← Example (future)
├── data-flow-check.md                 ← Example (future)
├── domain-boundaries.md               ← Example (future)
└── skeleton-compliance.md             ← Example (future)
```

**Format:** Markdown only (`.md`)  
**Access:** File system (code editor, terminal, git)  
**No UI:** Never create routes or screens for diagnostics

---

## 🎯 Why This Rule Matters

### **Problem: Route Proliferation**
Without this rule, diagnostics bloat navigation:

```
❌ Platform Admin Sidebar (BAD):
├─ Organizations
├─ Billing
├─ Navigation Audit        ← Diagnostic, shouldn't be here
├─ Route Coverage Report   ← Diagnostic, shouldn't be here
├─ Data Flow Check         ← Diagnostic, shouldn't be here
├─ System Diagnostics      ← Diagnostic, shouldn't be here
└─ UX Binding Compliance   ← Diagnostic, shouldn't be here

Result: 5 unnecessary routes, bloated sidebar, messy navigation
```

### **Solution: Markdown Files**
Diagnostics as development artifacts:

```
✅ Platform Admin Sidebar (GOOD):
├─ Organizations           ← Production feature
├─ Billing                 ← Production feature
└─ System Health           ← Production monitoring (if needed)

✅ /docs/diagnostics/ (DIAGNOSTIC OUTPUTS):
├─ navigation-audit.md
├─ route-coverage.md
├─ data-flow-check.md
├─ system-diagnostics.md
└─ ux-binding-compliance.md

Result: Clean sidebar, diagnostics separate, no route bloat
```

---

## 📖 How to Create Diagnostics

### **Method 1: Run Script**
```bash
# Generate navigation audit
node scripts/audit-navigation.js > /docs/diagnostics/navigation-audit.md

# Generate data flow check
node scripts/check-data-flow.js > /docs/diagnostics/data-flow-check.md
```

### **Method 2: Manual Markdown**
Create file in `/docs/diagnostics/`:

```markdown
# Navigation Audit

**Date:** 2026-01-07  
**Purpose:** Verify navigation.ts compliance

## Results
- Employee nav: 14 items ✅
- Admin nav: 33 items ✅
- Platform nav: 10 items ✅
- All routes exist: ✅

## Issues
None found.
```

### **Method 3: Automated (CI/CD)**
```yaml
# .github/workflows/diagnostics.yml
jobs:
  diagnostics:
    runs-on: ubuntu-latest
    steps:
      - run: npm run diagnostics
      - run: git add docs/diagnostics/*.md
```

---

## 🔍 Verification Checklist

**Before creating ANY diagnostic output:**

- [ ] Is this a diagnostic (development artifact)?
- [ ] Should it be a markdown file in `/docs/diagnostics/`?
- [ ] Am I about to create a route? (STOP! Use markdown instead)
- [ ] Am I about to create a screen component? (STOP! Use markdown instead)
- [ ] Am I about to add to navigation.ts? (STOP! Don't do it)

**If ANY route/screen/nav, write to markdown instead.**

---

## 📊 Files Updated

```
/docs/WORKOS-CONSTITUTION.md
└─ Added UX Binding Rule 4: Diagnostics Output Policy
   ├─ Law statement
   ├─ Requirements (5 rules)
   ├─ Rationale (4 reasons)
   ├─ Allowed outputs (examples)
   ├─ Forbidden outputs (examples)
   ├─ Verification checklist
   └─ Exception clause (production features)

/docs/diagnostics/README.md (NEW)
└─ Complete diagnostics policy guide
   ├─ Critical rule statement
   ├─ Allowed vs forbidden outputs
   ├─ Why this rule exists
   ├─ How to create diagnostics
   ├─ Viewing diagnostics
   ├─ Verification checklist
   └─ Related constitutional rules

/docs/README.md
└─ Updated document structure
   ├─ Added /docs/diagnostics/ to file tree
   └─ Listed diagnostics directory

/DIAGNOSTICS-POLICY-ADDED.md (NEW)
└─ This summary document
```

**Total Files Created:** 2  
**Total Files Updated:** 2  
**Total New Routes:** 0 (policy prevents them!)

---

## ✅ Success Criteria Met

| Criterion | Required | Delivered | Status |
|-----------|----------|-----------|--------|
| No new screens created | Zero | Zero | ✅ |
| Diagnostics to /docs only | Yes | Yes | ✅ |
| Policy in Constitution | Yes | UX Rule 4 | ✅ |
| Diagnostics README created | Yes | Yes | ✅ |
| "Never create routes" rule | Yes | Documented | ✅ |
| "Write to docs only" rule | Yes | Documented | ✅ |
| Verification checklist | Yes | Included | ✅ |

---

## 🎯 Constitutional Authority

**This is now LAW (UX Binding Rule 4):**

> Diagnostic outputs MUST be written to `/docs/diagnostics/*.md` ONLY.  
> Never create routes or UI screens for diagnostics.

**Enforcement:**
- Violations trigger immediate refactoring
- No exceptions (unless documented production feature)
- Constitution supersedes convenience

**Verification:**
```
[ ] No diagnostic routes in App.tsx
[ ] No diagnostic items in navigation.ts
[ ] All diagnostics in /docs/diagnostics/ directory
[ ] Diagnostic files are markdown only
[ ] No DiagnosticScreen components in /src/app/components/
```

---

## 📚 Related Constitutional Sections

**See:**
- `/docs/WORKOS-CONSTITUTION.md` → UX Binding Rule 3: No "Report Pages" Auto-Created
- `/docs/WORKOS-CONSTITUTION.md` → UX Binding Rule 4: Diagnostics Output Policy
- `/docs/WORKOS-CONSTITUTION.md` → Module Registry (diagnostics NOT listed)
- `/docs/diagnostics/README.md` → Complete diagnostics policy

---

## 💡 Key Takeaways

### **1. Diagnostics ≠ User Features**
Diagnostics are **development artifacts**, not user-facing features.  
They belong in `/docs/diagnostics/*.md`, not in routes.

### **2. No Route Bloat**
Prevents Platform/Super Admin from becoming a diagnostic dump.  
Keeps navigation clean and focused on production features.

### **3. Markdown is Sufficient**
Diagnostics don't need UI. Developers can read markdown files in:
- Code editor (VSCode, etc.)
- Terminal (`cat`, `grep`)
- GitHub (rendered markdown)

### **4. Exception for Production Features**
If Platform Admin needs "System Health" monitoring, it MUST be:
- Documented in Module Registry
- Intentional (not auto-generated)
- User-facing (not diagnostic dump)

### **5. Constitutional Law**
This is not a suggestion—it's **enforceable law** (UX Binding Rule 4).  
Violations require immediate refactoring.

---

## 🚀 Next Steps

### **For Developers:**
1. Read `/docs/diagnostics/README.md`
2. Write diagnostics to `/docs/diagnostics/*.md` only
3. Never create diagnostic routes or screens
4. Run verification checklist before creating diagnostics

### **For Architects:**
1. Enforce this rule during code reviews
2. Reject PRs that create diagnostic routes
3. Approve only markdown diagnostic outputs

### **For QA:**
1. Verify no diagnostic routes in navigation
2. Check `/docs/diagnostics/` for outputs
3. Flag any diagnostic screens/components

---

## ✅ TASK COMPLETE

The Diagnostics Output Policy is now:
- ✅ **Documented in Constitution** (UX Binding Rule 4)
- ✅ **Enforced via policy** (`/docs/diagnostics/README.md`)
- ✅ **No new routes created** (zero code changes)
- ✅ **Markdown outputs only** (development artifacts)
- ✅ **Verification checklist** (before creating diagnostics)

**Read the full policy:**
- Constitution: `/docs/WORKOS-CONSTITUTION.md` → UX Binding Rule 4
- Diagnostics Guide: `/docs/diagnostics/README.md`

🎉 **Diagnostics Policy Successfully Added!**
