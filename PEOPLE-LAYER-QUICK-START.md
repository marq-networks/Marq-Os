# PEOPLE LAYER — QUICK START GUIDE

## 🚀 Instant Access

### View Employee Management
```
1. Switch to ADMIN view (top navigation)
2. Click "Users" in sidebar
3. See 10 employees with full management interface
```

---

## 🎯 What You'll See

### Main Dashboard (P01)

```
┌─────────────────────────────────────────────────────────────┐
│  Employee Management                          [Filter] [+]  │
├─────────────────────────────────────────────────────────────┤
│  📊 Total: 10  |  Active: 8  |  Probation: 1  |  Tenure: 28mo│
├─────────────────────────────────────────────────────────────┤
│  🔍 Search...   [Status ▼]  [Department ▼]                  │
├─────────────────────────────────────────────────────────────┤
│  Full-Time: 9    Remote: 2    On Leave: 1    Avg: $92k    │
├─────────────────────────────────────────────────────────────┤
│  Departments: Engineering (4) | Product (1) | Design (1)    │
│               Marketing (2) | HR (1) | Sales (1)             │
├─────────────────────────────────────────────────────────────┤
│  ID       | Employee          | Title       | Dept    | ... │
│  EMP-001  | Sarah Johnson     | Product Mgr | Product | ✅  │
│  EMP-002  | Michael Chen      | Sr Engineer | Eng     | ✅  │
│  EMP-003  | Emily Rodriguez   | UX Designer | Design  | ✅  │
│  ...                                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔍 Key Features

### 1. **Search Everything**
Type in search box:
- "sarah" → Finds Sarah Johnson
- "EMP-002" → Finds Michael Chen
- "engineer" → Finds all engineers
- "@company.com" → Finds all by email

### 2. **Smart Filters**
- **Status:** All, Active, On Leave, Probation, Suspended
- **Department:** Engineering, Product, Design, Marketing, HR, Sales
- **Combine filters:** Active + Engineering = 3 engineers

### 3. **Bulk Operations**
- ☑️ Click checkboxes to select employees
- ☑️ "Select All" checkbox in header
- 📧 Email selected employees
- 📄 Export selected employees

### 4. **Employee Cards**
Each row shows:
- 🆔 Employee ID (EMP-001)
- 👤 Avatar (initials)
- ✉️ Name + Email
- 💼 Job Title
- 🏢 Department (badge)
- 📍 Location (Office/Remote/Hybrid)
- ✅ Status (Active/On Leave/etc)
- 🕐 Last Active

---

## 📊 Sample Employees

### Leadership
```
Robert Taylor (EMP-008)
VP of Engineering
$155k/year | Active | Hybrid
5.0 ⭐ Performance Rating
```

### Engineers
```
Michael Chen (EMP-002)    Maria Garcia (EMP-007)
Sr Engineer               QA Engineer
$120k/year | Remote       $82k/year | Remote

Jennifer Martinez (EMP-009)
Junior Developer
$68k/year | Probation | Office
```

### Other Roles
```
Sarah Johnson (Product Manager) - $95k
Emily Rodriguez (UX Designer) - $78k
David Kim (Marketing Manager) - $88k - ON LEAVE
Lisa Anderson (HR Manager) - $92k
James Wilson (Sales Director) - $105k
Alex Thompson (Marketing Intern) - $35k
```

---

## 🎨 Visual Elements

### Status Badges
- ✅ **Active** (green)
- ⚠️ **On Leave** (yellow)
- ℹ️ **Probation** (blue)
- ❌ **Suspended** (red)

### Employment Type
- Full-Time, Part-Time, Contract, Intern

### Location
- 🏢 Office
- 🏠 Remote
- 🔄 Hybrid

---

## 📈 Analytics at a Glance

```
Total Employees: 10
├─ Active: 8 (80%)
├─ On Leave: 1 (10%)
└─ Probation: 1 (10%)

Employment Type:
├─ Full-Time: 9 (90%)
└─ Intern: 1 (10%)

Work Location:
├─ Hybrid: 6 (60%)
├─ Remote: 2 (20%)
└─ Office: 2 (20%)

Compensation:
├─ Total Payroll: $918k/year
├─ Average Salary: $92k/year
├─ Range: $35k - $155k
└─ Median: $88.5k
```

---

## 🔔 Pending Actions Alert

If any employee has pending actions, you'll see:

```
⚠️ Pending Employee Actions
Jennifer Martinez: Complete security training, Set up dev environment
Alex Thompson: Submit I-9 form, Complete orientation
```

---

## 🎯 Try These Actions

### Action 1: Search for Sarah
```
1. Type "sarah" in search box
2. Table filters to show only Sarah Johnson
3. Clear search to see all employees
```

### Action 2: Filter by Department
```
1. Click "All Departments" dropdown
2. Select "Engineering"
3. See 4 engineers (Michael, Maria, Robert, Jennifer)
```

### Action 3: Find On Leave Employees
```
1. Click "All Status" dropdown
2. Select "On Leave"
3. See David Kim (Marketing Manager)
```

### Action 4: View Probation Employees
```
1. Select "Probation" status
2. See Jennifer Martinez (Junior Developer)
3. Note: Probation ends 2026-05-01
```

### Action 5: Bulk Select
```
1. Check boxes next to 3 employees
2. See "3 selected" message
3. Click "Email" to email selected
```

---

## 🔗 Data Connections

### Finance Module ↔ People
```
Employee.salary → Payroll calculations
Employee.financeAccountId → Expense reimbursements
```

### Work Module ↔ People
```
Employee.projectIds → Project assignments
Employee.teamIds → Team memberships
Employee.managerId → Reporting hierarchy
```

### Time Module ↔ People
```
Employee.annualLeaveBalance → Leave requests
Employee.workingHours → Time tracking
Employee.timeZone → Clock-in/out
```

---

## 📱 Responsive Design

Works perfectly on:
- 🖥️ Desktop (full table view)
- 💻 Laptop (optimized columns)
- 📱 Tablet (readable cards)

---

## ✅ Quick Verification

Visit `/admin/users` and verify:

- [ ] See 10 employees in table
- [ ] Search works (type "sarah")
- [ ] Status filter works (select "Active")
- [ ] Department filter works (select "Engineering")
- [ ] Checkboxes work (select multiple)
- [ ] KPI cards show: 10 total, 8 active, 1 probation, 28mo avg
- [ ] Stats cards show: 9 FT, 2 remote, 1 on leave, $92k avg
- [ ] Department breakdown shows all 6 departments
- [ ] Pending actions alert shows for Jennifer & Alex

---

## 🎉 You're Ready!

**PEOPLE → EMPLOYEES CORE LAYER is fully functional.**

Next steps:
1. ✅ Browse employees
2. ✅ Try search and filters
3. ✅ Select multiple employees
4. 🔜 Add employee detail view routing
5. 🔜 Create add/edit employee modals
6. 🔜 Build org chart visualization

**Navigate to `/admin/users` to start!**
