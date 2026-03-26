# ROLE SWITCHER — DOCUMENTED ✅

## 📜 Task Complete

Successfully documented the **temporary no-auth role switcher** behavior in the WorkOS Constitution.

**Status:** ✅ COMPLETE  
**Location:** `/docs/WORKOS-CONSTITUTION.md` → Section: "TEMPORARY DEVELOPMENT MODE (No-Auth Switcher)"  
**Date:** January 7, 2026

---

## 🎯 What Was Done

### 1. **Verified Current Implementation**
✅ Role switcher already uses canonical labels:
- **Employee** (not "Workspace")
- **Org Admin** (not "Control") 
- **Platform Admin** (not "Platform")

✅ Internal state mapping verified:
```typescript
Employee       → WORKSPACE  → /employee/*
Org Admin      → CONTROL    → /admin/*, /org/*
Platform Admin → PLATFORM   → /super/*
```

✅ Location confirmed: Top-right corner of AppShell header  
✅ Always visible, no authentication required  
✅ Auto-navigation on switch working

---

## 📖 Documentation Added to Constitution

### New Section: "🔧 TEMPORARY DEVELOPMENT MODE (No-Auth Switcher)"

**Contains:**
1. **Role Switcher Behavior** - Location, visibility, labels
2. **Internal State Mapping** - UI labels → internal modes → routes
3. **Canonical Role Consolidation** - Why Org Admin covers Owner/Admin/Manager
4. **Navigation Flow** - Auto-navigation on role switch
5. **Development Rules** - What's allowed vs forbidden
6. **Phase E: Auth Transition** - What happens when auth is implemented
7. **Verification Checklist** - Current state vs Phase E requirements

---

## 🔍 Key Documentation Points

### **Status Declaration**
```
Status: ACTIVE during Phases A-D (until Phase E: Auth Last)
Purpose: Enable rapid development and testing without authentication overhead
```

### **Role Consolidation Explained**
```
"Org Admin View" currently consolidates three constitutional roles:
- Org Owner (ultimate org authority)
- Org Admin (day-to-day admin)
- Manager (team leadership)

Why Consolidated: In development, one switcher position covers all 
organizational administration. In Phase E (Auth), these will be 
differentiated via:
- Permission granularity (Manager has limited access)
- Sub-toggles or permission-based UI filtering
- Role-specific dashboards within the Org Admin view
```

### **Development Rules Stated**
```
✅ ALLOWED (until Phase E):
- Switch roles freely without authentication
- Access all routes across all roles
- Test cross-role workflows instantly
- View all screens without login

❌ FORBIDDEN:
- Implement authentication before Phase E
- Hide the role switcher
- Add login/logout flows prematurely
- Create permission checks (Phase D only)
```

### **Phase E Transition Plan**
```
When authentication is implemented (Phase E):
1. Remove role switcher from UI
2. Add login/logout functionality
3. Implement session management (JWT, cookies)
4. Role assigned by backend (no manual switching)
5. Permission checks enforce role boundaries
6. Differentiate Org Owner/Admin/Manager via permissions

Until then: Role switcher remains visible and functional 
for all development and testing.
```

---

## ✅ Verification Checklist (Current State)

**Role Switcher Implementation:**
- [x] Role switcher visible in top-right corner
- [x] Three canonical roles: Employee, Org Admin, Platform Admin
- [x] Internal mapping: WORKSPACE, CONTROL, PLATFORM
- [x] Clicking each role navigates to correct default route
- [x] No authentication required to switch
- [x] All routes accessible regardless of selected role

**AppShell Integration:**
- [x] Switcher in header (lines 131-163 of AppShell.tsx)
- [x] Labels match canonical names (Employee, Org Admin, Platform Admin)
- [x] State management via currentMode prop
- [x] onModeChange callback triggers navigation

**Navigation Flow:**
- [x] Employee → /employee/dashboard
- [x] Org Admin → /admin/dashboard
- [x] Platform Admin → /super/console

---

## 📂 Files Updated

```
/docs/WORKOS-CONSTITUTION.md
└─ Added section: "TEMPORARY DEVELOPMENT MODE (No-Auth Switcher)"
   ├─ Role Switcher Behavior
   ├─ Internal State Mapping
   ├─ Canonical Role Consolidation
   ├─ Navigation Flow
   ├─ Development Rules
   ├─ Phase E: Auth Transition
   └─ Verification Checklist
```

**Total Lines Added:** ~120 lines of documentation

---

## 🎨 Current Implementation (No Changes Made)

### AppShell.tsx (Lines 131-163)
```typescript
{/* Operating Mode Switcher */}
{onModeChange && (
  <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
    <button
      onClick={() => onModeChange('WORKSPACE')}
      className={...}
    >
      Employee
    </button>
    <button
      onClick={() => onModeChange('CONTROL')}
      className={...}
    >
      Org Admin
    </button>
    <button
      onClick={() => onModeChange('PLATFORM')}
      className={...}
    >
      Platform Admin
    </button>
  </div>
)}
```

**Already Perfect:** Labels match canonical names!

---

## 🎯 Why This Matters

### **For Developers:**
- Clear understanding that switcher is temporary (until Phase E)
- No confusion about why there's no authentication
- Explicit permission to switch roles freely during development

### **For QA/Testers:**
- Know that switcher is intentional, not a bug
- Can test all roles without login
- Understand Phase E will remove switcher

### **For Product/Managers:**
- Phase E milestone clearly defined (auth implementation)
- Role consolidation strategy documented
- Transition plan from dev mode to production

### **For Future Developers:**
- Constitutional reference for "why no auth?"
- Clear roadmap for auth implementation
- No guesswork about temporary vs permanent features

---

## 🚀 Phase E: What Changes

**When authentication is implemented:**

### Remove:
- ❌ Role switcher component (AppShell lines 131-163)
- ❌ Manual mode selection
- ❌ Open access to all routes

### Add:
- ✅ Login screen
- ✅ Session management (JWT/cookies)
- ✅ Role assignment via backend
- ✅ Permission-based route protection
- ✅ Org Owner/Admin/Manager differentiation

### Keep:
- ✅ Three primary role views (Employee, Org Admin, Platform Admin)
- ✅ Route structure (/employee/*, /admin/*, /super/*)
- ✅ Navigation architecture

---

## 📊 Constitution Section Stats

```
Section: TEMPORARY DEVELOPMENT MODE
Lines Added: ~120
Subsections: 7
  1. Role Switcher Behavior
  2. Internal State Mapping
  3. Canonical Role Consolidation
  4. Navigation Flow
  5. Development Rules
  6. Phase E: Auth Transition
  7. Verification Checklist

Code Examples: 3
Rules Defined: 8 (4 allowed, 4 forbidden)
Checklists: 2 (current state + Phase E)
```

---

## ✅ Success Criteria Met

| Criterion | Required | Delivered | Status |
|-----------|----------|-----------|--------|
| Keep switcher visible | Yes | Yes | ✅ |
| Keep switcher working | Yes | Yes | ✅ |
| No authentication added | None | None | ✅ |
| Canonical labels verified | Employee, Org Admin, Platform Admin | Verified | ✅ |
| Internal naming consistent | WORKSPACE, CONTROL, PLATFORM | Verified | ✅ |
| No new pages created | Zero | Zero | ✅ |
| Documentation added to Constitution | Yes | Yes | ✅ |
| Behavior explained | Yes | Comprehensive | ✅ |

---

## 📖 Where to Read

**Main Document:**
- [`/docs/WORKOS-CONSTITUTION.md`](./docs/WORKOS-CONSTITUTION.md)
- Section: **"TEMPORARY DEVELOPMENT MODE (No-Auth Switcher)"**
- Located after: **"ROLE LAYERS (Canonical Names)"**
- Before: **"DOMAIN MODEL (Canonical Domains)"**

**Quick Reference:**
- [`/docs/QUICK-REFERENCE.md`](./docs/QUICK-REFERENCE.md)
- Shows role switcher is temporary feature

---

## 💡 Key Takeaway

**The role switcher is a deliberate development feature, not a bug.**

It's documented in the Constitution with:
- Why it exists (rapid dev/testing)
- How it works (internal mapping)
- When it goes away (Phase E: Auth)
- What replaces it (real authentication)

**No code changes needed. Implementation is already correct.**

---

## ✅ TASK COMPLETE

The role switcher is:
- ✅ Visible and working
- ✅ Using canonical labels
- ✅ Properly documented in Constitution
- ✅ Explained as temporary (until Phase E)
- ✅ No authentication required (as intended)

**Next action:** Continue development with switcher visible until Phase E (Auth Last).

🎉 **Documentation Complete!**
