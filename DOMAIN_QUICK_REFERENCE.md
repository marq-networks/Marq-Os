# 🗺️ DOMAIN QUICK REFERENCE CARD

**Version:** Master Skeleton v1.0  
**Date:** January 2, 2026

---

## 🎯 9 TOP-LEVEL DOMAINS

| # | Domain | Icon | Key Screens | Total |
|---|--------|------|-------------|-------|
| 1️⃣ | **WORK** | 💼 | Projects, Tasks, Milestones | 7 |
| 2️⃣ | **PEOPLE** | 👥 | Users, Members, Departments | 6 |
| 3️⃣ | **TIME** | ⏰ | Sessions, Leave, Attendance | 10 |
| 4️⃣ | **FINANCE** | 💰 | Cockpit, Ledger, Payroll | 25 |
| 5️⃣ | **COMMUNICATION** | 💬 | Messages, Channels | 2 |
| 6️⃣ | **ANALYTICS** | 📊 | Reports, Insights, Data | 10 |
| 7️⃣ | **SECURITY & COMPLIANCE** | 🔒 | Audit, Privacy, Policies | 6 |
| 8️⃣ | **PLATFORM** | ⚙️ | Console, Organizations | 7 |
| 9️⃣ | **INTEGRATIONS** | 🔌 | APIs, Connections | 3 |

**TOTAL: 9 DOMAINS | 72+ PAGES**

---

## 📊 DOMAIN SIZES

```
FINANCE ████████████████████████████████████ 25 (34.7%)
TIME    ████████████████ 10 (13.9%)
ANALYTICS ████████████ 10 (13.9%)
WORK    ███████ 7 (9.7%)
PLATFORM ███████ 7 (9.7%)
PEOPLE  ██████ 6 (8.3%)
SECURITY ██████ 6 (8.3%)
INTEGRATIONS ███ 3 (4.2%)
COMMUNICATION ██ 2 (2.8%)
```

---

## 👤 EMPLOYEE DOMAINS (13 screens)

| Domain | Screens | Key Features |
|--------|---------|--------------|
| **Work** | 1 | My Work |
| **Communication** | 1 | Communicate |
| **Finance** | 2 | My Money, Earnings |
| **Time** | 3 | My Day, Time Logs, Leave |
| **Analytics** | 3 | Activity, Overview, Analytics |
| **Personal** | 3 | Dashboard, Notifications, Profile |

---

## 👨‍💼 ADMIN DOMAINS (49 screens)

| Domain | Screens | Key Sections |
|--------|---------|--------------|
| **Work** | 6 | Overview, Execution, Analytics |
| **People** | 6 | Team, Payroll |
| **Time** | 7 | Tracking, Rules, Leave |
| **Finance** | 20 | Core, Accounts, Operations, Reports, Settings |
| **Communication** | 1 | Communicate |
| **Analytics** | 7 | Activity, Reports |
| **Security** | 4 | Privacy, Audit |
| **Integrations** | 3 | APIs, Sync |
| **Platform** | 3 | Dashboard, Settings |

---

## 🔐 SUPER ADMIN DOMAINS (10 screens)

| Domain | Screens | Key Features |
|--------|---------|--------------|
| **Platform** | 4 | Console, Organizations, Health, Admins |
| **Finance** | 3 | Platform Finance, Billing, Seats |
| **Security** | 2 | Policies, Audit |

---

## 🔧 HELPER FUNCTIONS

```typescript
// Get all items as flat list
flattenDomainNav(employeeDomainNav)
// Returns: NavItem[] (13 items)

// Find item by path
findNavItemByPath(adminDomainNav, '/admin/projects')
// Returns: NavItem { label: 'Projects', ... }

// Get domain metadata
getDomainById(adminDomainNav, 'finance')
// Returns: NavDomain { label: 'Finance', sections: [...] }

// Count items
countNavItems(superAdminDomainNav)
// Returns: 10
```

---

## 📁 FILES

| File | Purpose |
|------|---------|
| `/src/app/data/navigationMasterSkeleton.ts` | Domain structure |
| `/src/app/data/navigation.ts` | Old structure (hidden) |
| `/NAVIGATION_DOMAIN_MAPPING.md` | Complete mapping |
| `/UX_NAVIGATION_MASTER_SKELETON_CONFIRMED.md` | Confirmation |
| `/DOMAIN_QUICK_REFERENCE.md` | This quick ref |

---

## ✅ KEY GUARANTEES

✅ **All routes preserved** - No breaking changes  
✅ **Finance frozen** - ORG-F-01 to F-13 + PF-F-01  
✅ **Complete mapping** - All 72 pages mapped  
✅ **Backward compatible** - Old structure preserved  

---

**Status:** ✅ COMPLETE | Ready for UI Implementation
