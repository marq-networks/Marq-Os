# TIME → FINES — QUICK TEST GUIDE

## 🚀 Instant Access

### Test Fines Management
```
1. Switch to ADMIN view
2. Click "Fines" in sidebar (under TIME section)
3. See 28 fines with comprehensive management
```

### Test Corrections → Fine Link
```
1. Switch to ADMIN view
2. Click "Corrections" in sidebar
3. See fine suggestions and "Create Fine" buttons
```

---

## 🎯 What You'll See

### Fines Screen (`/admin/fines`)

```
┌─────────────────────────────────────────────────────────────────┐
│  Fines & Penalties Management            [Filter] [Export] [+]  │
├─────────────────────────────────────────────────────────────────┤
│  📊 Total: 28  |  Pending: 5  |  Collected: 12  |  Waived: 9   │
├─────────────────────────────────────────────────────────────────┤
│  🔍 Search...   [Status ▼]  [Dept ▼]  [Violation ▼]            │
├─────────────────────────────────────────────────────────────────┤
│  Avg: $19.30  |  Recurring: 12  |  Disputed: 2  |  Rate: 43%  │
├─────────────────────────────────────────────────────────────────┤
│  Violations by Type:                                             │
│  Late Arrival: 8  |  Extended Break: 7  |  Early Departure: 4  │
├─────────────────────────────────────────────────────────────────┤
│  Top Offenders:                                                  │
│  1. David Kim - $102.50 (3 violations)                          │
│  2. Jennifer Martinez - $92.50 (4 violations)                   │
├─────────────────────────────────────────────────────────────────┤
│  Fine ID  | Employee      | Violation  | Amount  | Status | ... │
│  FINE-001 | Sarah Johnson | Late       | $17.50  | Pending| ... │
│  FINE-002 | Michael Chen  | Missed Out | $12.00  | Waived | ... │
│  ...                                                             │
└─────────────────────────────────────────────────────────────────┘
```

### Corrections Screen (`/admin/corrections`)

```
┌─────────────────────────────────────────────────────────────────┐
│  Corrections & Approvals                    [Reject] [Approve]  │
├─────────────────────────────────────────────────────────────────┤
│  ⚠️ Fine Suggestions Available                                  │
│  2 corrections may warrant fines based on violation rules.      │
│  [View Fine Suggestions]                                         │
├─────────────────────────────────────────────────────────────────┤
│  Employee         | Type            | Status  | Actions         │
│  Emily Rodriguez  | Late Clock In   | Pending | [Create Fine]   │
│                   | 💰 Fine         |         |                 │
│  David Kim        | Break Duration  | Approved| -               │
│                   | 💰 Fine         |         |                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ Quick Tests (5 minutes)

### Test 1: View All Fines ⏱️ 30 seconds
```
✓ Navigate to /admin/fines
✓ See 28 fines in table
✓ See 4 KPI cards at top
✓ See 4 stat cards below
✓ See violations breakdown
✓ See top offenders list
✓ See fine rules at bottom
```

### Test 2: Search Fines ⏱️ 30 seconds
```
✓ Type "sarah" in search box
  → Should show 4 fines for Sarah Johnson
✓ Clear and type "FINE-001"
  → Should show only Fine #001
✓ Clear and type "EMP-009"
  → Should show 4 fines for Jennifer Martinez
```

### Test 3: Filter Fines ⏱️ 1 minute
```
✓ Status: Select "Pending"
  → Should show 5 pending fines
✓ Status: Select "Collected"
  → Should show 12 collected fines
✓ Department: Select "Engineering"
  → Should show 13 engineering fines
✓ Violation: Select "Late Arrival"
  → Should show 8 late arrival fines
✓ Combine: Pending + Engineering
  → Should show filtered results
```

### Test 4: Bulk Operations ⏱️ 1 minute
```
✓ Check 3 pending fines (use checkboxes)
  → Should see "3 selected" message
✓ Click "Mark Collected" button
  → Should see success toast
✓ Click "Waive" button
  → Should see success toast
✓ Click "Select All" checkbox
  → Should select all visible fines
```

### Test 5: Fine Actions ⏱️ 30 seconds
```
✓ Click note icon (💬) on any fine
  → Should see info toast: "Opening note editor..."
✓ Click eye icon (👁️) on any fine
  → Should see info toast: "Opening audit trail..."
```

### Test 6: Corrections Integration ⏱️ 1 minute
```
✓ Navigate to /admin/corrections
✓ See yellow alert banner at top
  → "Fine Suggestions Available"
✓ See "Fine" badge on 2 corrections
✓ See "Create Fine" button on pending corrections
✓ Click "Create Fine" button
  → Should see toast: "Opening fine creation for [Employee] - $XX.XX"
✓ Click "View Fine Suggestions" in alert
  → Should see info toast
```

---

## 📊 Sample Data Quick Reference

### Employees with Most Fines:
```
David Kim (EMP-004): 3 fines - $102.50 total
Jennifer Martinez (EMP-009): 4 fines - $92.50 total
Maria Garcia (EMP-007): 5 fines - $80.00 total
Emily Rodriguez (EMP-003): 5 fines - $62.00 total
Sarah Johnson (EMP-001): 4 fines - $53.50 total
```

### Violation Types:
```
Late Arrival: 8 fines
Extended Break: 7 fines
Early Departure: 4 fines
Missed Clock Out: 3 fines
Missed Clock In: 2 fines
Break Violation: 2 fines
Unauthorized Absence: 1 fine
Schedule Violation: 1 fine
```

### Status Breakdown:
```
Collected: 12 fines ($234.50)
Waived: 9 fines ($145.50)
Pending: 5 fines ($95.50)
Disputed: 2 fines ($65.00)
```

---

## 🔍 Search Examples

### By Employee Name:
```
"sarah" → 4 results (Sarah Johnson)
"michael" → 4 results (Michael Chen)
"jennifer" → 4 results (Jennifer Martinez)
"maria" → 5 results (Maria Garcia)
```

### By Fine ID:
```
"FINE-001" → 1 result (Sarah's late arrival)
"FINE-002" → 1 result (Michael's missed clock out)
"FINE-014" → 1 result (David's early departure)
```

### By Employee Number:
```
"EMP-001" → 4 results (Sarah Johnson)
"EMP-009" → 4 results (Jennifer Martinez)
"EMP-007" → 5 results (Maria Garcia)
```

---

## 🎯 Filter Combinations

### Find Pending Engineering Fines:
```
Status: "Pending"
Department: "Engineering"
Result: Pending fines from Engineering dept
```

### Find Collected Late Arrivals:
```
Status: "Collected"
Violation: "Late Arrival"
Result: All collected late arrival fines
```

### Find Marketing Violations:
```
Department: "Marketing"
Result: All fines from Marketing dept (6 fines)
```

---

## 💰 Fine Amounts Quick Reference

### Sample Fine Calculations:

**Late Arrival (35 min):**
```
Grace Period: 15 min (free)
Violation: 35 - 15 = 20 min
Rate: $0.50/min
Fine: 20 × $0.50 = $10.00
```

**Extended Break (18 min over):**
```
Over Limit: 18 min
Rate: $0.50/min
Fine: 18 × $0.50 = $9.00
```

**Missed Clock Out:**
```
Fixed Penalty: $12.00
```

**Unauthorized Absence:**
```
Fixed Penalty: $50.00 (highest)
```

---

## 🔔 Expected Toasts

### When you click actions, expect these toasts:

**Mark Collected:**
```
✓ Success: "Marked 3 fine(s) as collected"
```

**Waive:**
```
✓ Success: "Waived 3 fine(s)"
```

**Add Note (💬 icon):**
```
ℹ️ Info: "Opening note editor for FINE-001"
```

**View Audit (👁️ icon):**
```
ℹ️ Info: "Opening audit trail for FINE-001"
```

**Create Fine (from Corrections):**
```
✓ Success: "Opening fine creation for Emily Rodriguez - $15.00"
```

---

## 📈 Analytics to Verify

### KPI Cards (Top Row):
```
Card 1: Total This Month = 28 ($540.50 total)
Card 2: Pending Review = 5 ($95.50 pending)
Card 3: Collected = 12 ($234.50 collected)
Card 4: Waived = 9 (32.1% waive rate)
```

### Stat Cards (Second Row):
```
Card 1: Avg Fine Amount = $19.30
Card 2: Recurring = 12 violations
Card 3: Disputed = 2 fines
Card 4: Collection Rate = 43%
```

---

## ✅ Verification Checklist

### Fines Screen (`/admin/fines`)
- [ ] Loads successfully
- [ ] Shows 28 fines
- [ ] KPIs show: 28, 5, 12, 9
- [ ] Stats show: $19.30, 12, 2, 43%
- [ ] Search box works
- [ ] All 3 filters work
- [ ] Checkboxes selectable
- [ ] Bulk actions show toasts
- [ ] Action buttons show toasts
- [ ] Violations breakdown visible
- [ ] Top offenders list shows 5
- [ ] Fine rules show 6 cards
- [ ] Each rule shows violation count

### Corrections Screen (`/admin/corrections`)
- [ ] Loads successfully
- [ ] Yellow alert banner visible
- [ ] Shows "2 corrections may warrant fines"
- [ ] 2 corrections have "Fine" badge
- [ ] "Create Fine" buttons visible
- [ ] Clicking "Create Fine" shows toast
- [ ] Toast shows employee name + amount
- [ ] Help text visible at bottom

---

## 🎉 Success Criteria

If all these work, installation is ✅ COMPLETE:

1. ✅ Fines screen loads with 28 records
2. ✅ Search filters fines instantly
3. ✅ Status/Dept/Violation filters work
4. ✅ Bulk selection and actions work
5. ✅ All action buttons show toasts
6. ✅ Statistics are accurate
7. ✅ Corrections show fine suggestions
8. ✅ "Create Fine" button works
9. ✅ All badges and formatting correct
10. ✅ No console errors

---

## 🚀 Quick Navigation

**To test everything in 3 minutes:**

1. **Go to `/admin/fines`** (1 min)
   - Verify 28 fines visible
   - Try search: "sarah"
   - Try filter: "Pending"
   - Select 2 fines
   - Click "Mark Collected"
   - See toast ✓

2. **Go to `/admin/corrections`** (1 min)
   - See alert banner
   - See "Fine" badges
   - Click "Create Fine"
   - See toast ✓

3. **Return to `/admin/fines`** (1 min)
   - Click note icon
   - See toast ✓
   - Click eye icon
   - See toast ✓

**Done! All features working!** 🎉
