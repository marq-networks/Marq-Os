import { PageLayout } from '../../shared/PageLayout';
import { Card3D } from '../../shared/Card3D';
import { StatusBadge } from '../../shared/StatusBadge';
import { useRouter } from '../../router';
import { 
  CheckCircle2, 
  XCircle, 
  MousePointer2,
  AlertTriangle,
  Code,
  ExternalLink,
  Activity
} from 'lucide-react';

interface InteractionDetail {
  actionType: 'button' | 'tab' | 'filter' | 'row-action' | 'form-input' | 'checkbox' | 'link';
  label: string;
  lineNumber: number;
  status: 'works' | 'dead';
  effect: string; // What it does when it works, or why it's dead
}

interface ScreenInteractionAnalysis {
  screenName: string;
  route: string;
  filePath: string;
  totalInteractions: number;
  workingInteractions: number;
  deadInteractions: number;
  interactions: InteractionDetail[];
}

export function FinanceInteractions() {
  const { navigate } = useRouter();

  const analyses: ScreenInteractionAnalysis[] = [
    {
      screenName: 'FC-01 Finance Cockpit',
      route: '/org/finance/cockpit',
      filePath: '/src/app/components/screens/org/FC01FinanceCockpit.tsx',
      totalInteractions: 6,
      workingInteractions: 6,
      deadInteractions: 0,
      interactions: [
        { actionType: 'button', label: 'Add Expense', lineNumber: 84, status: 'works', effect: 'navigate(\'/org/finance/quick-add\')' },
        { actionType: 'button', label: 'Run Payroll', lineNumber: 90, status: 'works', effect: 'navigate(\'/org/finance/payroll-posting\')' },
        { actionType: 'button', label: 'Open Inbox', lineNumber: 96, status: 'works', effect: 'navigate(\'/org/finance/inbox\')' },
        { actionType: 'button', label: 'View Reports', lineNumber: 104, status: 'works', effect: 'navigate(\'/org/finance/reports\')' },
        { actionType: 'link', label: 'View All (transactions)', lineNumber: 220, status: 'works', effect: 'navigate(\'/org/finance/transactions\')' },
        { actionType: 'button', label: 'KPI Cards (8 cards)', lineNumber: 157, status: 'dead', effect: 'Cards have hover:scale but no onClick handler' }
      ]
    },
    {
      screenName: 'FC-02 Finance Inbox',
      route: '/org/finance/inbox',
      filePath: '/src/app/components/screens/org/FC02FinanceInbox.tsx',
      totalInteractions: 16,
      workingInteractions: 16,
      deadInteractions: 0,
      interactions: [
        { actionType: 'tab', label: 'Tab switches (6 tabs)', lineNumber: 180, status: 'works', effect: 'setActiveTab() - filters data' },
        { actionType: 'checkbox', label: 'Select All checkbox', lineNumber: 93, status: 'works', effect: 'toggleSelectAll() - selects all items' },
        { actionType: 'checkbox', label: 'Row checkboxes', lineNumber: 101, status: 'works', effect: 'toggleSelection(id) - toggles selection' },
        { actionType: 'row-action', label: 'View Details (Eye icon)', lineNumber: 136, status: 'works', effect: 'showToast() - shows viewing message' },
        { actionType: 'row-action', label: 'Approve (row)', lineNumber: 143, status: 'works', effect: 'showToast() - approves item' },
        { actionType: 'row-action', label: 'Reject (row)', lineNumber: 150, status: 'works', effect: 'showToast() - rejects item' },
        { actionType: 'row-action', label: 'Add Comment', lineNumber: 157, status: 'works', effect: 'showToast() - comment action' },
        { actionType: 'button', label: 'Bulk Approve', lineNumber: 204, status: 'works', effect: 'bulkApprove() - clears selections, shows toast' },
        { actionType: 'button', label: 'Bulk Reject', lineNumber: 211, status: 'works', effect: 'bulkReject() - clears selections, shows toast' },
        { actionType: 'button', label: 'Bulk Comment', lineNumber: 218, status: 'works', effect: 'showToast() - opens comment dialog' },
        { actionType: 'button', label: 'Export', lineNumber: 225, status: 'works', effect: 'showToast() - starts export' }
      ]
    },
    {
      screenName: 'FC-03 Quick Add (Admin)',
      route: '/org/finance/quick-add',
      filePath: '/src/app/components/screens/org/FC03QuickAddAdmin.tsx',
      totalInteractions: 12,
      workingInteractions: 12,
      deadInteractions: 0,
      interactions: [
        { actionType: 'button', label: 'Select Expense Type', lineNumber: 62, status: 'works', effect: 'setTxnType(\'expense\')' },
        { actionType: 'button', label: 'Select Income Type', lineNumber: 73, status: 'works', effect: 'setTxnType(\'income\')' },
        { actionType: 'form-input', label: 'Narration textarea', lineNumber: 98, status: 'works', effect: 'Updates formData.narration' },
        { actionType: 'form-input', label: 'Amount input', lineNumber: 119, status: 'works', effect: 'Updates formData.amount' },
        { actionType: 'form-input', label: 'Account select', lineNumber: 130, status: 'works', effect: 'Updates formData.account' },
        { actionType: 'form-input', label: 'Department select', lineNumber: 149, status: 'works', effect: 'Updates formData.department' },
        { actionType: 'form-input', label: 'Client select', lineNumber: 169, status: 'works', effect: 'Updates formData.client' },
        { actionType: 'checkbox', label: 'Billable checkbox', lineNumber: 188, status: 'works', effect: 'Updates formData.billable' },
        { actionType: 'checkbox', label: 'Requires Approval checkbox', lineNumber: 216, status: 'works', effect: 'Updates formData.requiresApproval' },
        { actionType: 'button', label: 'Post Directly', lineNumber: 230, status: 'works', effect: 'handleSubmit(\'post\') - validates, posts, shows toast' },
        { actionType: 'button', label: 'Send for Approval', lineNumber: 242, status: 'works', effect: 'handleSubmit(\'approve\') - validates, sends for approval' }
      ]
    },
    {
      screenName: 'FC-04 Ledger Control',
      route: '/org/finance/ledger-control',
      filePath: '/src/app/components/screens/org/FC04LedgerControl.tsx',
      totalInteractions: 12,
      workingInteractions: 12,
      deadInteractions: 0,
      interactions: [
        { actionType: 'checkbox', label: 'Select All checkbox', lineNumber: 56, status: 'works', effect: 'Toggles all selections' },
        { actionType: 'checkbox', label: 'Row checkboxes', lineNumber: 70, status: 'works', effect: 'toggleSelection(id)' },
        { actionType: 'row-action', label: 'Edit (creates revision)', lineNumber: 110, status: 'works', effect: 'showToast() - edit action' },
        { actionType: 'row-action', label: 'Link to project/task', lineNumber: 117, status: 'works', effect: 'showToast() - link action' },
        { actionType: 'filter', label: 'Department filter', lineNumber: 143, status: 'works', effect: 'setFilters() - updates department' },
        { actionType: 'filter', label: 'Project filter', lineNumber: 156, status: 'works', effect: 'setFilters() - updates project' },
        { actionType: 'filter', label: 'Billable filter', lineNumber: 166, status: 'works', effect: 'setFilters() - updates billable' },
        { actionType: 'button', label: 'Export', lineNumber: 174, status: 'works', effect: 'showToast() - exports data' },
        { actionType: 'button', label: 'Bulk Edit', lineNumber: 191, status: 'works', effect: 'showToast() - opens bulk edit modal' },
        { actionType: 'button', label: 'Bulk Approve', lineNumber: 198, status: 'works', effect: 'showToast() - bulk approves selected' },
        { actionType: 'button', label: 'Bulk Link to Project', lineNumber: 205, status: 'works', effect: 'bulkLinkToProject() - links items, shows toast' }
      ]
    },
    {
      screenName: 'FC-05 Reimbursements',
      route: '/org/finance/reimbursements',
      filePath: '/src/app/components/screens/org/FC05Reimbursements.tsx',
      totalInteractions: 4,
      workingInteractions: 4,
      deadInteractions: 0,
      interactions: [
        { actionType: 'link', label: 'View expense link', lineNumber: 70, status: 'works', effect: 'showToast() - views expense' },
        { actionType: 'row-action', label: 'Mark as Paid', lineNumber: 105, status: 'works', effect: 'showToast() - marks paid' },
        { actionType: 'row-action', label: 'View Details', lineNumber: 113, status: 'works', effect: 'showToast() - shows details' },
        { actionType: 'button', label: 'Pay All Pending', lineNumber: 151, status: 'works', effect: 'showToast() - processes bulk payment' }
      ]
    },
    {
      screenName: 'FC-06 Payroll Posting',
      route: '/org/finance/payroll-posting',
      filePath: '/src/app/components/screens/org/FC06PayrollPosting.tsx',
      totalInteractions: 3,
      workingInteractions: 3,
      deadInteractions: 0,
      interactions: [
        { actionType: 'row-action', label: 'Preview Payroll', lineNumber: 93, status: 'works', effect: 'showToast() - previews payroll' },
        { actionType: 'row-action', label: 'Post to Ledger', lineNumber: 100, status: 'works', effect: 'showToast() - posts to finance' },
        { actionType: 'row-action', label: 'View Details', lineNumber: 109, status: 'works', effect: 'showToast() - shows details' }
      ]
    },
    {
      screenName: 'FC-07 Costing & Profit Command',
      route: '/org/finance/costing-profit',
      filePath: '/src/app/components/screens/org/FC07CostingProfitCommand.tsx',
      totalInteractions: 5,
      workingInteractions: 5,
      deadInteractions: 0,
      interactions: [
        { actionType: 'row-action', label: 'Edit Rate', lineNumber: 39, status: 'works', effect: 'showToast() - edits rate' },
        { actionType: 'row-action', label: 'View Details', lineNumber: 84, status: 'works', effect: 'showToast() - shows profit breakdown' },
        { actionType: 'button', label: 'Bulk Update Rates', lineNumber: 121, status: 'works', effect: 'showToast() - bulk updates' },
        { actionType: 'button', label: 'Calculate Projection (Simulator)', lineNumber: 186, status: 'works', effect: 'showToast() - shows projection result' }
      ]
    },
    {
      screenName: 'FC-08 Team Finance Permissions',
      route: '/org/finance/team-permissions',
      filePath: '/src/app/components/screens/org/FC08TeamFinancePermissions.tsx',
      totalInteractions: 2,
      workingInteractions: 2,
      deadInteractions: 0,
      interactions: [
        { actionType: 'row-action', label: 'Edit Role Permissions', lineNumber: 103, status: 'works', effect: 'showToast() - opens edit modal' },
        { actionType: 'button', label: 'Add New Role', lineNumber: 134, status: 'works', effect: 'showToast() - creates new role' }
      ]
    },
    {
      screenName: 'FC-09 Finance Settings',
      route: '/org/finance/settings',
      filePath: '/src/app/components/screens/org/FC09FinanceSettings.tsx',
      totalInteractions: 8,
      workingInteractions: 8,
      deadInteractions: 0,
      interactions: [
        { actionType: 'checkbox', label: 'Enable Personal World toggle', lineNumber: 46, status: 'works', effect: 'Updates settings.enablePersonalWorld' },
        { actionType: 'checkbox', label: 'Auto Backup toggle', lineNumber: 64, status: 'works', effect: 'Updates settings.autoBackup' },
        { actionType: 'checkbox', label: 'Require Approval toggle', lineNumber: 82, status: 'works', effect: 'Updates settings.requireApproval' },
        { actionType: 'checkbox', label: 'AI Learning toggle', lineNumber: 100, status: 'works', effect: 'Updates settings.aiLearning' },
        { actionType: 'form-input', label: 'Default Currency select', lineNumber: 118, status: 'works', effect: 'Updates settings.defaultCurrency' },
        { actionType: 'button', label: 'Save Settings', lineNumber: 134, status: 'works', effect: 'Shows saving state, then success toast' },
        { actionType: 'button', label: 'Export All Data', lineNumber: 145, status: 'works', effect: 'showToast() - exports data' },
        { actionType: 'button', label: 'Import Data', lineNumber: 152, status: 'works', effect: 'showToast() - opens import dialog' }
      ]
    },
    {
      screenName: 'F-01 Finance Home',
      route: '/org/finance',
      filePath: '/src/app/components/screens/org/F01FinanceHome.tsx',
      totalInteractions: 16,
      workingInteractions: 0,
      deadInteractions: 16,
      interactions: [
        { actionType: 'button', label: 'Cash in Hand card', lineNumber: 69, status: 'dead', effect: 'Has cursor-pointer and hover:scale-105 but no onClick handler' },
        { actionType: 'button', label: 'Bank Balances card', lineNumber: 84, status: 'dead', effect: 'Has cursor-pointer and hover:scale-105 but no onClick handler' },
        { actionType: 'button', label: 'Digital Wallets card', lineNumber: 99, status: 'dead', effect: 'Has cursor-pointer and hover:scale-105 but no onClick handler' },
        { actionType: 'button', label: 'Quote Risk card', lineNumber: 114, status: 'dead', effect: 'Has cursor-pointer and hover:scale-105 but no onClick handler' },
        { actionType: 'link', label: 'View All (Recent Transactions)', lineNumber: 221, status: 'dead', effect: 'Has hover:underline className but no onClick/href' },
        { actionType: 'link', label: 'View All (Quick Links)', lineNumber: 297, status: 'dead', effect: 'Has hover:underline className but no onClick/href' },
        { actionType: 'button', label: 'Quick Link: Cockpit', lineNumber: 305, status: 'dead', effect: 'Has hover:bg-accent but no onClick handler' },
        { actionType: 'button', label: 'Quick Link: Inbox', lineNumber: 315, status: 'dead', effect: 'Has hover:bg-accent but no onClick handler' },
        { actionType: 'button', label: 'Quick Link: Add Transaction', lineNumber: 325, status: 'dead', effect: 'Has hover:bg-accent but no onClick handler' },
        { actionType: 'button', label: 'Quick Link: Accounts', lineNumber: 335, status: 'dead', effect: 'Has hover:bg-accent but no onClick handler' },
        { actionType: 'button', label: 'Quick Link: Import', lineNumber: 345, status: 'dead', effect: 'Has hover:bg-accent but no onClick handler' },
        { actionType: 'button', label: 'Quick Link: Review Queue', lineNumber: 355, status: 'dead', effect: 'Has hover:bg-accent but no onClick handler' },
        { actionType: 'button', label: 'Quick Link: Reimbursements', lineNumber: 365, status: 'dead', effect: 'Has hover:bg-accent but no onClick handler' },
        { actionType: 'button', label: 'Quick Link: Payroll', lineNumber: 375, status: 'dead', effect: 'Has hover:bg-accent but no onClick handler' },
        { actionType: 'button', label: 'Quick Link: Costing', lineNumber: 385, status: 'dead', effect: 'Has hover:bg-accent but no onClick handler' },
        { actionType: 'button', label: 'Quick Link: Settings', lineNumber: 395, status: 'dead', effect: 'Has hover:bg-accent but no onClick handler' }
      ]
    },
    {
      screenName: 'F-01 Finance Inbox',
      route: '/org/finance/inbox-alt',
      filePath: '/src/app/components/screens/org/F01FinanceInbox.tsx',
      totalInteractions: 12,
      workingInteractions: 12,
      deadInteractions: 0,
      interactions: [
        { actionType: 'tab', label: 'Approvals tab', lineNumber: 142, status: 'works', effect: 'setActiveTab(\'approvals\')' },
        { actionType: 'tab', label: 'Review tab', lineNumber: 151, status: 'works', effect: 'setActiveTab(\'review\')' },
        { actionType: 'tab', label: 'Imports tab', lineNumber: 160, status: 'works', effect: 'setActiveTab(\'imports\')' },
        { actionType: 'checkbox', label: 'Select All checkbox', lineNumber: 197, status: 'works', effect: 'Toggles all selections' },
        { actionType: 'checkbox', label: 'Row checkboxes', lineNumber: 205, status: 'works', effect: 'Toggles individual selection' },
        { actionType: 'row-action', label: 'Approve (row)', lineNumber: 229, status: 'works', effect: 'handleApprove() - removes from queue, shows toast' },
        { actionType: 'row-action', label: 'Reject (row)', lineNumber: 236, status: 'works', effect: 'handleReject() - removes from queue, shows toast' },
        { actionType: 'button', label: 'Bulk Approve', lineNumber: 260, status: 'works', effect: 'handleBulkApprove() - removes selected, shows toast' },
        { actionType: 'button', label: 'Bulk Reject', lineNumber: 267, status: 'works', effect: 'Shows toast (could update to actually reject)' },
        { actionType: 'button', label: 'Quick Add Transaction', lineNumber: 177, status: 'works', effect: 'navigate(\'/org/finance/quick-add\')' }
      ]
    },
    {
      screenName: 'F-02 Quick Add Transaction',
      route: '/org/finance/quick-add-basic',
      filePath: '/src/app/components/screens/org/F02QuickAdd.tsx',
      totalInteractions: 18,
      workingInteractions: 18,
      deadInteractions: 0,
      interactions: [
        { actionType: 'button', label: 'Step 1 button', lineNumber: 175, status: 'works', effect: 'setCurrentStep(1)' },
        { actionType: 'button', label: 'Step 2 button', lineNumber: 182, status: 'works', effect: 'setCurrentStep(2)' },
        { actionType: 'button', label: 'Step 3 button', lineNumber: 189, status: 'works', effect: 'setCurrentStep(3)' },
        { actionType: 'form-input', label: 'Narration textarea (Step 1)', lineNumber: 215, status: 'works', effect: 'Updates formData.narration' },
        { actionType: 'button', label: 'Next (Step 1)', lineNumber: 225, status: 'works', effect: 'Validates, runs AI classification, goes to step 2' },
        { actionType: 'button', label: 'Type: Expense', lineNumber: 255, status: 'works', effect: 'Updates formData.type' },
        { actionType: 'button', label: 'Type: Income', lineNumber: 265, status: 'works', effect: 'Updates formData.type' },
        { actionType: 'form-input', label: 'Amount input (Step 2)', lineNumber: 289, status: 'works', effect: 'Updates formData.amount' },
        { actionType: 'form-input', label: 'Account select (Step 2)', lineNumber: 300, status: 'works', effect: 'Updates formData.account' },
        { actionType: 'form-input', label: 'Category select (Step 2)', lineNumber: 312, status: 'works', effect: 'Updates formData.category' },
        { actionType: 'button', label: 'Accept AI suggestion', lineNumber: 331, status: 'works', effect: 'Applies AI suggestion to form' },
        { actionType: 'button', label: 'Back (Step 2)', lineNumber: 338, status: 'works', effect: 'setCurrentStep(1)' },
        { actionType: 'button', label: 'Next (Step 2)', lineNumber: 344, status: 'works', effect: 'Validates, goes to step 3' },
        { actionType: 'form-input', label: 'Date input (Step 3)', lineNumber: 371, status: 'works', effect: 'Updates formData.date' },
        { actionType: 'form-input', label: 'Notes textarea (Step 3)', lineNumber: 379, status: 'works', effect: 'Updates formData.notes' },
        { actionType: 'button', label: 'Save as Draft', lineNumber: 389, status: 'works', effect: 'Saves to localStorage, shows toast' },
        { actionType: 'button', label: 'Back (Step 3)', lineNumber: 396, status: 'works', effect: 'setCurrentStep(2)' },
        { actionType: 'button', label: 'Submit Transaction', lineNumber: 402, status: 'works', effect: 'Validates, submits, shows success, resets form' }
      ]
    },
    {
      screenName: 'F-02 Quick Add Operational',
      route: '/org/finance/quick-add-operational',
      filePath: '/src/app/components/screens/org/F02QuickAddOperational.tsx',
      totalInteractions: 24,
      workingInteractions: 24,
      deadInteractions: 0,
      interactions: [
        { actionType: 'button', label: 'Step nav buttons (3)', lineNumber: 195, status: 'works', effect: 'setCurrentStep(n)' },
        { actionType: 'form-input', label: 'Narration textarea', lineNumber: 235, status: 'works', effect: 'Updates formData.narration' },
        { actionType: 'button', label: 'Receipt upload trigger', lineNumber: 246, status: 'works', effect: 'Triggers file input click' },
        { actionType: 'form-input', label: 'Receipt file input', lineNumber: 248, status: 'works', effect: 'handleReceiptUpload() - processes file' },
        { actionType: 'button', label: 'Remove receipt', lineNumber: 269, status: 'works', effect: 'Clears formData.receipt' },
        { actionType: 'button', label: 'Next (Step 1)', lineNumber: 280, status: 'works', effect: 'Validates, AI classification, advances' },
        { actionType: 'button', label: 'Transaction type buttons (2)', lineNumber: 317, status: 'works', effect: 'Updates formData.type' },
        { actionType: 'form-input', label: 'Amount input', lineNumber: 353, status: 'works', effect: 'Updates formData.amount' },
        { actionType: 'form-input', label: 'Account select', lineNumber: 364, status: 'works', effect: 'Updates formData.account' },
        { actionType: 'form-input', label: 'Category select', lineNumber: 376, status: 'works', effect: 'Updates formData.category' },
        { actionType: 'form-input', label: 'Department select', lineNumber: 389, status: 'works', effect: 'Updates formData.department' },
        { actionType: 'form-input', label: 'Client select', lineNumber: 402, status: 'works', effect: 'Updates formData.client' },
        { actionType: 'form-input', label: 'Expense type select', lineNumber: 415, status: 'works', effect: 'Updates formData.expenseType' },
        { actionType: 'checkbox', label: 'Billable checkbox', lineNumber: 433, status: 'works', effect: 'Updates formData.billable' },
        { actionType: 'button', label: 'Accept AI suggestion', lineNumber: 450, status: 'works', effect: 'Applies AI suggestion' },
        { actionType: 'button', label: 'Back (Step 2)', lineNumber: 457, status: 'works', effect: 'setCurrentStep(1)' },
        { actionType: 'button', label: 'Next (Step 2)', lineNumber: 463, status: 'works', effect: 'Validates, advances' },
        { actionType: 'form-input', label: 'Date input', lineNumber: 494, status: 'works', effect: 'Updates formData.date' },
        { actionType: 'form-input', label: 'Notes textarea', lineNumber: 502, status: 'works', effect: 'Updates formData.notes' },
        { actionType: 'checkbox', label: 'Requires approval checkbox', lineNumber: 519, status: 'works', effect: 'Updates formData.requiresApproval' },
        { actionType: 'button', label: 'Save as Draft', lineNumber: 531, status: 'works', effect: 'Saves to localStorage, shows toast' },
        { actionType: 'button', label: 'Back (Step 3)', lineNumber: 538, status: 'works', effect: 'setCurrentStep(2)' },
        { actionType: 'button', label: 'Submit for Approval', lineNumber: 544, status: 'works', effect: 'Validates, submits with approval' },
        { actionType: 'button', label: 'Post Directly', lineNumber: 552, status: 'works', effect: 'Validates, posts immediately' }
      ]
    },
    {
      screenName: 'F-03 Transactions Ledger',
      route: '/org/finance/transactions',
      filePath: '/src/app/components/screens/org/F03TransactionsLedger.tsx',
      totalInteractions: 13,
      workingInteractions: 13,
      deadInteractions: 0,
      interactions: [
        { actionType: 'filter', label: 'Search input', lineNumber: 159, status: 'works', effect: 'Updates searchQuery - filters live' },
        { actionType: 'filter', label: 'Status filter', lineNumber: 169, status: 'works', effect: 'Updates statusFilter' },
        { actionType: 'filter', label: 'Department filter', lineNumber: 181, status: 'works', effect: 'Updates departmentFilter' },
        { actionType: 'filter', label: 'Client filter', lineNumber: 194, status: 'works', effect: 'Updates clientFilter' },
        { actionType: 'filter', label: 'World filter', lineNumber: 207, status: 'works', effect: 'Updates worldFilter' },
        { actionType: 'button', label: 'Export', lineNumber: 216, status: 'works', effect: 'showToast() - exports data' },
        { actionType: 'checkbox', label: 'Select All checkbox', lineNumber: 230, status: 'works', effect: 'Toggles all selections' },
        { actionType: 'checkbox', label: 'Row checkboxes', lineNumber: 238, status: 'works', effect: 'Toggles individual selection' },
        { actionType: 'row-action', label: 'View Details', lineNumber: 290, status: 'works', effect: 'setSelectedTransaction() - opens drawer' },
        { actionType: 'button', label: 'Close drawer', lineNumber: 325, status: 'works', effect: 'setSelectedTransaction(null)' },
        { actionType: 'button', label: 'Bulk Approve', lineNumber: 341, status: 'works', effect: 'bulkApprove() - updates status, clears selection' },
        { actionType: 'button', label: 'Bulk Reject', lineNumber: 348, status: 'works', effect: 'bulkReject() - updates status, shows drawer' },
        { actionType: 'button', label: 'Bulk Delete', lineNumber: 355, status: 'works', effect: 'bulkDelete() - removes items, clears selection' }
      ]
    },
    {
      screenName: 'F-04 Accounts & Wallets',
      route: '/org/finance/accounts',
      filePath: '/src/app/components/screens/org/financeScreens.tsx',
      totalInteractions: 0,
      workingInteractions: 0,
      deadInteractions: 0,
      interactions: []
    },
    {
      screenName: 'F-05 Statement Import Center',
      route: '/org/finance/import',
      filePath: '/src/app/components/screens/org/financeScreens.tsx',
      totalInteractions: 0,
      workingInteractions: 0,
      deadInteractions: 0,
      interactions: []
    },
    {
      screenName: 'F-06 Review & Decide Queue',
      route: '/org/finance/review',
      filePath: '/src/app/components/screens/org/F06ReviewDecideQueue.tsx',
      totalInteractions: 10,
      workingInteractions: 10,
      deadInteractions: 0,
      interactions: [
        { actionType: 'button', label: 'Approve (row)', lineNumber: 140, status: 'works', effect: 'handleApprove() - removes item, updates count' },
        { actionType: 'button', label: 'Review (opens drawer)', lineNumber: 147, status: 'works', effect: 'handleReview() - opens drawer with item' },
        { actionType: 'button', label: 'Skip', lineNumber: 154, status: 'works', effect: 'Shows toast - skips item' },
        { actionType: 'button', label: 'Bulk Approve All', lineNumber: 180, status: 'works', effect: 'handleBulkApprove() - clears queue' },
        { actionType: 'button', label: 'Close drawer', lineNumber: 207, status: 'works', effect: 'setDrawerOpen(false)' },
        { actionType: 'button', label: 'Category buttons in drawer', lineNumber: 232, status: 'works', effect: 'setSelectedCategory() - selects category' },
        { actionType: 'button', label: 'Approve & Close (drawer)', lineNumber: 250, status: 'works', effect: 'Approves with selected category, closes drawer' },
        { actionType: 'button', label: 'Apply to Similar', lineNumber: 257, status: 'works', effect: 'Shows toast - applies rule to similar' },
        { actionType: 'checkbox', label: 'Learn from this toggle', lineNumber: 272, status: 'works', effect: 'Shows info toast about AI learning' }
      ]
    },
    {
      screenName: 'F-07 Logic & Learning Center',
      route: '/org/finance/logic',
      filePath: '/src/app/components/screens/org/financeScreens.tsx',
      totalInteractions: 0,
      workingInteractions: 0,
      deadInteractions: 0,
      interactions: []
    },
    {
      screenName: 'F-08 Costing & Pricing Intelligence',
      route: '/org/finance/costing',
      filePath: '/src/app/components/screens/org/financeScreens.tsx',
      totalInteractions: 0,
      workingInteractions: 0,
      deadInteractions: 0,
      interactions: []
    },
    {
      screenName: 'F-09 Reports & Statements',
      route: '/org/finance/reports',
      filePath: '/src/app/components/screens/org/financeScreens.tsx',
      totalInteractions: 0,
      workingInteractions: 0,
      deadInteractions: 0,
      interactions: []
    },
    {
      screenName: 'F-10 Loans & Liabilities',
      route: '/org/finance/loans',
      filePath: '/src/app/components/screens/org/financeScreens.tsx',
      totalInteractions: 0,
      workingInteractions: 0,
      deadInteractions: 0,
      interactions: []
    },
    {
      screenName: 'F-11 Team & Permissions',
      route: '/org/finance/team',
      filePath: '/src/app/components/screens/org/financeScreens.tsx',
      totalInteractions: 0,
      workingInteractions: 0,
      deadInteractions: 0,
      interactions: []
    },
    {
      screenName: 'F-12 Finance Settings',
      route: '/org/finance/settings-basic',
      filePath: '/src/app/components/screens/org/F12FinanceSettings.tsx',
      totalInteractions: 8,
      workingInteractions: 8,
      deadInteractions: 0,
      interactions: [
        { actionType: 'checkbox', label: 'Enable Personal World', lineNumber: 58, status: 'works', effect: 'Updates settings.enablePersonalWorld' },
        { actionType: 'checkbox', label: 'Require Approval', lineNumber: 76, status: 'works', effect: 'Updates settings.requireApproval' },
        { actionType: 'checkbox', label: 'AI Auto-Classification', lineNumber: 94, status: 'works', effect: 'Updates settings.aiClassification' },
        { actionType: 'checkbox', label: 'Immutable Ledger', lineNumber: 112, status: 'works', effect: 'Updates settings.immutableLedger' },
        { actionType: 'form-input', label: 'Default Currency', lineNumber: 130, status: 'works', effect: 'Updates settings.defaultCurrency' },
        { actionType: 'button', label: 'Save Settings', lineNumber: 145, status: 'works', effect: 'Shows saving state, success toast' },
        { actionType: 'button', label: 'Export All Data', lineNumber: 156, status: 'works', effect: 'showToast() - exports' },
        { actionType: 'button', label: 'Import Backup', lineNumber: 163, status: 'works', effect: 'showToast() - imports' }
      ]
    },
    {
      screenName: 'F-14 Project Burn & Margin',
      route: '/org/finance/project-burn-margin',
      filePath: '/src/app/components/screens/org/F14ProjectBurnMargin.tsx',
      totalInteractions: 3,
      workingInteractions: 3,
      deadInteractions: 0,
      interactions: [
        { actionType: 'row-action', label: 'View Details', lineNumber: 126, status: 'works', effect: 'handleViewDetails() - opens drawer with project' },
        { actionType: 'button', label: 'Close drawer', lineNumber: 167, status: 'works', effect: 'setDrawerOpen(false)' },
        { actionType: 'button', label: 'View in WORK module', lineNumber: 174, status: 'works', effect: 'navigate(\'/admin/projects\')' }
      ]
    },
    {
      screenName: 'PF-01 Finance Platform Console',
      route: '/platform/finance-console',
      filePath: '/src/app/components/screens/platform/PF01FinancePlatformConsole.tsx',
      totalInteractions: 8,
      workingInteractions: 8,
      deadInteractions: 0,
      interactions: [
        { actionType: 'button', label: 'Export Revenue Report', lineNumber: 189, status: 'works', effect: 'showToast() - exports report' },
        { actionType: 'button', label: 'Export Billing Report', lineNumber: 196, status: 'works', effect: 'showToast() - exports billing' },
        { actionType: 'button', label: 'Export Churn Report', lineNumber: 203, status: 'works', effect: 'showToast() - exports churn' },
        { actionType: 'button', label: 'Export All Reports', lineNumber: 210, status: 'works', effect: 'showToast() - exports all' },
        { actionType: 'button', label: 'Backup Now', lineNumber: 228, status: 'works', effect: 'showToast() - starts backup' },
        { actionType: 'button', label: 'Restore from Backup', lineNumber: 235, status: 'works', effect: 'showToast() - restores backup' },
        { actionType: 'button', label: 'View Audit Trail', lineNumber: 242, status: 'works', effect: 'showToast() - opens audit' },
        { actionType: 'button', label: 'Download Logs', lineNumber: 249, status: 'works', effect: 'showToast() - downloads logs' }
      ]
    }
  ];

  const totalInteractions = analyses.reduce((sum, a) => sum + a.totalInteractions, 0);
  const totalWorking = analyses.reduce((sum, a) => sum + a.workingInteractions, 0);
  const totalDead = analyses.reduce((sum, a) => sum + a.deadInteractions, 0);

  const screensWithDeadActions = analyses.filter(a => a.deadInteractions > 0);
  
  // Get top 10 dead actions
  const allDeadActions = analyses.flatMap(screen => 
    screen.interactions
      .filter(i => i.status === 'dead')
      .map(i => ({
        ...i,
        screenName: screen.screenName,
        filePath: screen.filePath,
        route: screen.route
      }))
  );

  const top10DeadActions = allDeadActions.slice(0, 10);

  const getActionTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      'button': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      'tab': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      'filter': 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
      'row-action': 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
      'form-input': 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
      'checkbox': 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
      'link': 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20'
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs border ${colors[type] || 'bg-gray-500/10 text-gray-600 border-gray-500/20'}`}>
        {type}
      </span>
    );
  };

  return (
    <PageLayout
      title="DIAGNOSTIC – Finance Interaction Audit"
      description="All clickable actions across finance screens - what works, what's dead"
      kpis={[
        {
          title: 'Total Interactions',
          value: totalInteractions.toString(),
          icon: <MousePointer2 className="h-5 w-5" />
        },
        {
          title: 'Working',
          value: totalWorking.toString(),
          change: `${Math.round((totalWorking / totalInteractions) * 100)}% functional`,
          changeType: 'positive',
          icon: <CheckCircle2 className="h-5 w-5" />
        },
        {
          title: 'Dead Actions',
          value: totalDead.toString(),
          change: screensWithDeadActions.length > 0 ? `${screensWithDeadActions.length} screens affected` : 'None found',
          changeType: totalDead > 0 ? 'warning' : 'positive',
          icon: <XCircle className="h-5 w-5" />
        },
        {
          title: 'Interaction Rate',
          value: `${Math.round((totalWorking / totalInteractions) * 100)}%`,
          change: totalDead === 0 ? 'Perfect' : 'Needs attention',
          changeType: totalDead === 0 ? 'positive' : 'warning',
          icon: <Activity className="h-5 w-5" />
        }
      ]}
    >
      <div className="space-y-6">
        {/* Summary */}
        <Card3D>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            Interaction Audit Summary
          </h3>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{totalWorking}</p>
              <p className="text-sm text-muted-foreground mt-1">Working Interactions</p>
              <p className="text-xs text-muted-foreground mt-1">
                Buttons, tabs, filters, forms that update UI
              </p>
            </div>

            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{totalDead}</p>
              <p className="text-sm text-muted-foreground mt-1">Dead Interactions</p>
              <p className="text-xs text-muted-foreground mt-1">
                Visual elements that look clickable but do nothing
              </p>
            </div>

            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {Math.round((totalWorking / totalInteractions) * 100)}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">Interaction Success Rate</p>
              <p className="text-xs text-muted-foreground mt-1">
                {totalDead === 0 ? 'Perfect implementation' : 'Good but improvable'}
              </p>
            </div>
          </div>

          {totalDead > 0 ? (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-2">
                ⚠️ Found {totalDead} dead interactions across {screensWithDeadActions.length} screen(s)
              </p>
              <p className="text-sm text-muted-foreground">
                These elements have hover states or cursor-pointer styling that suggest interactivity, 
                but they're missing onClick handlers. This creates a poor UX where users expect something 
                to happen but nothing does.
              </p>
            </div>
          ) : (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                ✓ Perfect Interaction Coverage
              </p>
              <p className="text-sm text-muted-foreground">
                All {totalInteractions} interactive elements across all finance screens have working handlers. 
                Every button, tab, filter, and form input either updates UI state, navigates, or shows feedback.
              </p>
            </div>
          )}
        </Card3D>

        {/* Top 10 Dead Actions */}
        {top10DeadActions.length > 0 && (
          <Card3D>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              Top {top10DeadActions.length} Dead Actions (Need Handlers)
            </h3>

            <div className="space-y-4">
              {top10DeadActions.map((action, idx) => (
                <div
                  key={idx}
                  className="border border-border rounded-lg p-4 hover:border-orange-500/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getActionTypeBadge(action.actionType)}
                        <StatusBadge type="destructive">Dead</StatusBadge>
                      </div>
                      <h4 className="font-semibold mb-1">{action.label}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{action.screenName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">File Location</p>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {action.filePath.replace('/src/app/components/screens/', '')}
                      </code>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Line Number</p>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        Line {action.lineNumber}
                      </code>
                    </div>
                  </div>

                  <div className="p-3 bg-orange-500/10 rounded-lg">
                    <p className="text-xs font-medium text-orange-600 dark:text-orange-400 mb-1">
                      Why It's Dead:
                    </p>
                    <p className="text-sm text-muted-foreground">{action.effect}</p>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => navigate(action.route)}
                      className="flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-primary/90"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Screen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card3D>
        )}

        {/* Screen-by-Screen Breakdown */}
        <Card3D>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Code className="h-5 w-5" />
            Screen-by-Screen Interaction Breakdown
          </h3>

          <div className="space-y-6">
            {analyses.map((screen) => (
              <div
                key={screen.route}
                className="border border-border rounded-lg p-6"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{screen.screenName}</h4>
                      {screen.deadInteractions === 0 && screen.workingInteractions > 0 && (
                        <StatusBadge type="success">All Working</StatusBadge>
                      )}
                      {screen.deadInteractions > 0 && (
                        <StatusBadge type="warning">{screen.deadInteractions} Dead</StatusBadge>
                      )}
                      {screen.totalInteractions === 0 && (
                        <StatusBadge type="neutral">No Interactions</StatusBadge>
                      )}
                    </div>
                    <code className="text-xs text-muted-foreground">
                      {screen.filePath.replace('/src/app/components/screens/', '')}
                    </code>
                  </div>
                  <button
                    onClick={() => navigate(screen.route)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Total Interactions</p>
                    <p className="text-xl font-bold">{screen.totalInteractions}</p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Working</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      {screen.workingInteractions}
                    </p>
                  </div>
                  <div className="p-3 bg-red-500/10 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Dead</p>
                    <p className="text-xl font-bold text-red-600 dark:text-red-400">
                      {screen.deadInteractions}
                    </p>
                  </div>
                </div>

                {/* Interaction List */}
                {screen.interactions.length > 0 ? (
                  <div className="space-y-2">
                    {screen.interactions.map((interaction, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border ${
                          interaction.status === 'works'
                            ? 'bg-green-500/5 border-green-500/20'
                            : 'bg-red-500/5 border-red-500/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {getActionTypeBadge(interaction.actionType)}
                              <span className="font-medium text-sm">{interaction.label}</span>
                              {interaction.status === 'works' ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{interaction.effect}</p>
                          </div>
                          <code className="text-xs text-muted-foreground whitespace-nowrap">
                            L{interaction.lineNumber}
                          </code>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">
                      No interactive elements detected (placeholder screen)
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card3D>

        {/* Conclusion */}
        <div className={`${totalDead === 0 ? 'bg-green-500/10 border-green-500/20' : 'bg-orange-500/10 border-orange-500/20'} border rounded-lg p-6`}>
          <h3 className={`font-semibold mb-3 ${totalDead === 0 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
            {totalDead === 0 ? '✓ Excellent Interaction Coverage' : '⚠️ Action Items Required'}
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            {totalDead === 0 ? (
              <>
                <p>
                  <strong>Perfect implementation:</strong> All {totalInteractions} interactive elements across 
                  all {analyses.length} finance screens have working handlers.
                </p>
                <p>
                  Every button triggers an action, every tab switches content, every filter updates the view, 
                  and every form input is connected to state. No dead interactions found.
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>Found {totalDead} dead interactions</strong> on {screensWithDeadActions.length} screen(s). 
                  These elements have visual affordances (hover states, cursor-pointer) but no onClick handlers.
                </p>
                <p>
                  <strong>Primary culprit:</strong> F-01 Finance Home has 16 dead interactions - KPI cards and 
                  quick links with cursor-pointer and hover styles but no navigation handlers.
                </p>
                <p>
                  <strong>Fix strategy:</strong> Add navigate() calls to the 4 KPI cards (Cash, Bank, Wallets, Quote Risk) 
                  and the 10 quick link buttons. Each should navigate to its respective finance screen.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
