import { Router } from 'express';
import { z } from 'zod';
import type {
  BillingInvoice,
  CostCenter,
  ExpenseReport,
  FinanceAccount,
  FinanceInboxItem,
  FinanceReport,
  FinanceTransaction,
  LoanLiability,
  OfflineSyncRecord,
  PaginatedResponse,
  PayrollPosting,
  PayrollRun,
  Payslip,
  Reimbursement,
  ScreenshotRecord,
} from '../../../src/app/services/types';
import { authRequired } from '../middleware/authRequired';
import { getStore } from '../store';
import { paginate, parsePageParams } from '../utils/pagination';

export const financeRouter = Router();
financeRouter.use(authRequired);

// Payroll runs
financeRouter.get('/payroll-runs', (req, res) => {
  const { payrollRuns } = getStore();
  const { page, pageSize } = parsePageParams(req.query);
  return res.json(paginate(payrollRuns, page, pageSize) satisfies PaginatedResponse<PayrollRun>);
});

financeRouter.get('/payroll-runs/:id', (req, res) => {
  const { payrollRuns } = getStore();
  const run = payrollRuns.find((r) => r.id === req.params.id);
  if (!run) return res.status(404).json({ error: 'Payroll run not found' });
  return res.json(run);
});

financeRouter.post('/payroll-runs/:id/process', (req, res) => {
  const schema = z.object({ processedBy: z.string().min(1), processedAt: z.string().optional() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { payrollRuns } = getStore();
  const idx = payrollRuns.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Payroll run not found' });
  payrollRuns[idx] = {
    ...payrollRuns[idx],
    status: 'Processed',
    processedBy: parsed.data.processedBy,
    processedAt: parsed.data.processedAt ?? new Date().toISOString(),
  };
  return res.json(payrollRuns[idx]);
});

// Payslips
financeRouter.get('/payslips', (req, res) => {
  const { payslips } = getStore();
  const { page, pageSize } = parsePageParams(req.query);
  return res.json(paginate(payslips, page, pageSize) satisfies PaginatedResponse<Payslip>);
});

financeRouter.get('/payslips/my', (req, res) => {
  const { payslips } = getStore();
  const employeeId = typeof req.query.employeeId === 'string' ? req.query.employeeId : '';
  return res.json(payslips.filter((p) => p.employeeId === employeeId) satisfies Payslip[]);
});

financeRouter.get('/payslips/:id', (req, res) => {
  const { payslips } = getStore();
  const ps = payslips.find((p) => p.id === req.params.id);
  if (!ps) return res.status(404).json({ error: 'Payslip not found' });
  return res.json(ps);
});

// Billing invoices
financeRouter.get('/billing-invoices', (req, res) => {
  const { billingInvoices } = getStore();
  const { page, pageSize } = parsePageParams(req.query);
  return res.json(paginate(billingInvoices, page, pageSize) satisfies PaginatedResponse<BillingInvoice>);
});

financeRouter.get('/billing-invoices/:id', (req, res) => {
  const { billingInvoices } = getStore();
  const inv = billingInvoices.find((i) => i.id === req.params.id);
  if (!inv) return res.status(404).json({ error: 'Invoice not found' });
  return res.json(inv);
});

// Offline sync
financeRouter.get('/offline-sync', (req, res) => {
  const { offlineSync } = getStore();
  const { page, pageSize } = parsePageParams(req.query);
  return res.json(paginate(offlineSync, page, pageSize) satisfies PaginatedResponse<OfflineSyncRecord>);
});

financeRouter.post('/offline-sync/:id/trigger', (req, res) => {
  const { offlineSync } = getStore();
  const idx = offlineSync.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Sync record not found' });
  offlineSync[idx] = { ...offlineSync[idx], status: 'In Progress', lastSyncAttempt: new Date().toISOString() } as any;
  return res.json(offlineSync[idx]);
});

financeRouter.post('/offline-sync/sync-all', (_req, res) => {
  const { offlineSync } = getStore();
  const updated = offlineSync.map((r) => ({ ...r, status: 'In Progress', lastSyncAttempt: new Date().toISOString() })) as any;
  offlineSync.splice(0, offlineSync.length, ...updated);
  return res.json(offlineSync);
});

// Screenshots
financeRouter.get('/screenshots', (req, res) => {
  const { screenshots } = getStore();
  const { page, pageSize } = parsePageParams(req.query);
  return res.json(paginate(screenshots, page, pageSize) satisfies PaginatedResponse<ScreenshotRecord>);
});

financeRouter.patch('/screenshots/:id/review', (req, res) => {
  const schema = z.object({ reviewedBy: z.string().min(1), reviewedAt: z.string().optional(), status: z.string().optional() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { screenshots } = getStore();
  const idx = screenshots.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Screenshot not found' });
  screenshots[idx] = { ...screenshots[idx], ...parsed.data } as any;
  return res.json(screenshots[idx]);
});

financeRouter.patch('/screenshots/:id/flag', (req, res) => {
  const schema = z.object({ flagReason: z.string().min(1), status: z.string().optional() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { screenshots } = getStore();
  const idx = screenshots.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Screenshot not found' });
  screenshots[idx] = { ...screenshots[idx], ...parsed.data } as any;
  return res.json(screenshots[idx]);
});

// Transactions
financeRouter.get('/transactions', (req, res) => {
  const { transactions } = getStore();
  const { page, pageSize } = parsePageParams(req.query);
  return res.json(paginate(transactions, page, pageSize) satisfies PaginatedResponse<FinanceTransaction>);
});

financeRouter.get('/transactions/:id', (req, res) => {
  const { transactions } = getStore();
  const txn = transactions.find((t) => t.id === req.params.id);
  if (!txn) return res.status(404).json({ error: 'Transaction not found' });
  return res.json(txn);
});

financeRouter.post('/transactions', (req, res) => {
  const schema = z.object({
    type: z.string().min(1),
    category: z.string().min(1),
    description: z.string().min(1),
    amount: z.number(),
    currency: z.string().min(1),
    date: z.string().min(1),
    accountId: z.string().min(1),
    accountName: z.string().min(1),
    reference: z.string().optional(),
    status: z.string().min(1),
    createdBy: z.string().min(1),
    departmentId: z.string().optional(),
    departmentName: z.string().optional(),
    projectId: z.string().optional(),
    tags: z.array(z.string()).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { transactions } = getStore();
  const txn: FinanceTransaction = { id: crypto.randomUUID(), ...(parsed.data as any) };
  transactions.unshift(txn);
  return res.status(201).json(txn);
});

financeRouter.patch('/transactions/:id', (req, res) => {
  const { transactions } = getStore();
  const idx = transactions.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Transaction not found' });
  transactions[idx] = { ...transactions[idx], ...(req.body ?? {}) };
  return res.json(transactions[idx]);
});

financeRouter.patch('/transactions/:id/void', (req, res) => {
  const { transactions } = getStore();
  const idx = transactions.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Transaction not found' });
  transactions[idx] = { ...transactions[idx], status: 'Voided' } as any;
  return res.json(transactions[idx]);
});

// Accounts
financeRouter.get('/accounts', (req, res) => {
  const { accounts } = getStore();
  const { page, pageSize } = parsePageParams(req.query);
  return res.json(paginate(accounts, page, pageSize) satisfies PaginatedResponse<FinanceAccount>);
});

financeRouter.get('/accounts/:id', (req, res) => {
  const { accounts } = getStore();
  const acc = accounts.find((a) => a.id === req.params.id);
  if (!acc) return res.status(404).json({ error: 'Account not found' });
  return res.json(acc);
});

financeRouter.post('/accounts', (req, res) => {
  const schema = z.object({
    name: z.string().min(1),
    type: z.string().min(1),
    balance: z.number(),
    currency: z.string().min(1),
    status: z.string().min(1),
    lastTransactionAt: z.string().optional(),
    accountNumber: z.string().optional(),
    bankName: z.string().optional(),
    notes: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { accounts } = getStore();
  const acc: FinanceAccount = { id: crypto.randomUUID(), ...(parsed.data as any) };
  accounts.unshift(acc);
  return res.status(201).json(acc);
});

financeRouter.patch('/accounts/:id', (req, res) => {
  const { accounts } = getStore();
  const idx = accounts.findIndex((a) => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Account not found' });
  accounts[idx] = { ...accounts[idx], ...(req.body ?? {}) };
  return res.json(accounts[idx]);
});

// Reimbursements
financeRouter.get('/reimbursements', (req, res) => {
  const { reimbursements } = getStore();
  const { page, pageSize } = parsePageParams(req.query);
  return res.json(paginate(reimbursements, page, pageSize) satisfies PaginatedResponse<Reimbursement>);
});

financeRouter.get('/reimbursements/my', (req, res) => {
  const { reimbursements } = getStore();
  const employeeId = typeof req.query.employeeId === 'string' ? req.query.employeeId : '';
  return res.json(reimbursements.filter((r) => r.employeeId === employeeId) satisfies Reimbursement[]);
});

financeRouter.get('/reimbursements/:id', (req, res) => {
  const { reimbursements } = getStore();
  const rmb = reimbursements.find((r) => r.id === req.params.id);
  if (!rmb) return res.status(404).json({ error: 'Reimbursement not found' });
  return res.json(rmb);
});

financeRouter.post('/reimbursements', (req, res) => {
  const schema = z.object({
    employeeId: z.string().min(1),
    employeeName: z.string().min(1),
    department: z.string().min(1),
    amount: z.number(),
    currency: z.string().min(1),
    category: z.string().min(1),
    description: z.string().min(1),
    date: z.string().min(1),
    receiptUrl: z.string().optional(),
    notes: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { reimbursements } = getStore();
  const rmb: Reimbursement = {
    id: crypto.randomUUID(),
    ...(parsed.data as any),
    status: 'Pending',
    submittedAt: new Date().toISOString(),
  } as any;
  reimbursements.unshift(rmb);
  return res.status(201).json(rmb);
});

financeRouter.patch('/reimbursements/:id/approve', (req, res) => {
  const schema = z.object({ reviewedBy: z.string().min(1), reviewedAt: z.string().optional(), status: z.string().optional() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { reimbursements } = getStore();
  const idx = reimbursements.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Reimbursement not found' });
  reimbursements[idx] = { ...reimbursements[idx], ...parsed.data, status: 'Approved' } as any;
  return res.json(reimbursements[idx]);
});

financeRouter.patch('/reimbursements/:id/reject', (req, res) => {
  const schema = z.object({ reviewedBy: z.string().min(1), reviewedAt: z.string().optional(), reason: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { reimbursements } = getStore();
  const idx = reimbursements.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Reimbursement not found' });
  reimbursements[idx] = { ...reimbursements[idx], reviewedBy: parsed.data.reviewedBy, reviewedAt: parsed.data.reviewedAt ?? new Date().toISOString(), status: 'Rejected', notes: parsed.data.reason } as any;
  return res.json(reimbursements[idx]);
});

financeRouter.patch('/reimbursements/:id/pay', (req, res) => {
  const { reimbursements } = getStore();
  const idx = reimbursements.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Reimbursement not found' });
  reimbursements[idx] = { ...reimbursements[idx], status: 'Paid', paidAt: new Date().toISOString() } as any;
  return res.json(reimbursements[idx]);
});

// Loans
financeRouter.get('/loans', (req, res) => {
  const { loans } = getStore();
  const { page, pageSize } = parsePageParams(req.query);
  return res.json(paginate(loans, page, pageSize) satisfies PaginatedResponse<LoanLiability>);
});

financeRouter.get('/loans/:id', (req, res) => {
  const { loans } = getStore();
  const ln = loans.find((l) => l.id === req.params.id);
  if (!ln) return res.status(404).json({ error: 'Loan not found' });
  return res.json(ln);
});

financeRouter.post('/loans', (req, res) => {
  const schema = z.object({
    type: z.string().min(1),
    employeeId: z.string().optional(),
    employeeName: z.string().optional(),
    creditor: z.string().min(1),
    principalAmount: z.number(),
    outstandingBalance: z.number(),
    currency: z.string().min(1),
    interestRate: z.number(),
    startDate: z.string().min(1),
    dueDate: z.string().min(1),
    status: z.string().min(1),
    monthlyPayment: z.number(),
    notes: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { loans } = getStore();
  const loan: LoanLiability = { id: crypto.randomUUID(), ...(parsed.data as any) };
  loans.unshift(loan);
  return res.status(201).json(loan);
});

financeRouter.patch('/loans/:id', (req, res) => {
  const { loans } = getStore();
  const idx = loans.findIndex((l) => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Loan not found' });
  loans[idx] = { ...loans[idx], ...(req.body ?? {}) };
  return res.json(loans[idx]);
});

// Finance inbox
financeRouter.get('/inbox', (req, res) => {
  const { financeInbox } = getStore();
  const { page, pageSize } = parsePageParams(req.query);
  return res.json(paginate(financeInbox, page, pageSize) satisfies PaginatedResponse<FinanceInboxItem>);
});

financeRouter.get('/inbox/unread-count', (_req, res) => {
  const { financeInbox } = getStore();
  return res.json(financeInbox.filter((i) => i.status === 'unread').length);
});

financeRouter.patch('/inbox/:id/read', (req, res) => {
  const { financeInbox } = getStore();
  const idx = financeInbox.findIndex((i) => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Inbox item not found' });
  financeInbox[idx] = { ...financeInbox[idx], status: 'read' };
  return res.json(financeInbox[idx]);
});

financeRouter.patch('/inbox/:id/action', (req, res) => {
  const { financeInbox } = getStore();
  const idx = financeInbox.findIndex((i) => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Inbox item not found' });
  financeInbox[idx] = { ...financeInbox[idx], status: 'actioned' };
  return res.json(financeInbox[idx]);
});

// Cost centers
financeRouter.get('/cost-centers', (req, res) => {
  const { costCenters } = getStore();
  const { page, pageSize } = parsePageParams(req.query);
  return res.json(paginate(costCenters, page, pageSize) satisfies PaginatedResponse<CostCenter>);
});

financeRouter.get('/cost-centers/:id', (req, res) => {
  const { costCenters } = getStore();
  const cc = costCenters.find((c) => c.id === req.params.id);
  if (!cc) return res.status(404).json({ error: 'Cost center not found' });
  return res.json(cc);
});

financeRouter.patch('/cost-centers/:id', (req, res) => {
  const { costCenters } = getStore();
  const idx = costCenters.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Cost center not found' });
  costCenters[idx] = { ...costCenters[idx], ...(req.body ?? {}) };
  return res.json(costCenters[idx]);
});

// Expense reports
financeRouter.get('/expense-reports', (req, res) => {
  const { expenseReports } = getStore();
  const { page, pageSize } = parsePageParams(req.query);
  return res.json(paginate(expenseReports, page, pageSize) satisfies PaginatedResponse<ExpenseReport>);
});

financeRouter.get('/expense-reports/my', (req, res) => {
  const { expenseReports } = getStore();
  const employeeId = typeof req.query.employeeId === 'string' ? req.query.employeeId : '';
  return res.json(expenseReports.filter((r) => r.employeeId === employeeId) satisfies ExpenseReport[]);
});

financeRouter.get('/expense-reports/:id', (req, res) => {
  const { expenseReports } = getStore();
  const er = expenseReports.find((e) => e.id === req.params.id);
  if (!er) return res.status(404).json({ error: 'Expense report not found' });
  return res.json(er);
});

financeRouter.post('/expense-reports', (req, res) => {
  const schema = z.object({
    employeeId: z.string().min(1),
    employeeName: z.string().min(1),
    department: z.string().min(1),
    title: z.string().min(1),
    totalAmount: z.number(),
    currency: z.string().min(1),
    period: z.string().min(1),
    status: z.string().min(1),
    submittedAt: z.string().optional(),
    approvedBy: z.string().optional(),
    approvedAt: z.string().optional(),
    lineItems: z.array(
      z.object({
        id: z.string().min(1),
        category: z.string().min(1),
        description: z.string().min(1),
        amount: z.number(),
        date: z.string().min(1),
        receiptUrl: z.string().optional(),
      }),
    ),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { expenseReports } = getStore();
  const report: ExpenseReport = { id: crypto.randomUUID(), ...(parsed.data as any) };
  expenseReports.unshift(report);
  return res.status(201).json(report);
});

financeRouter.patch('/expense-reports/:id/submit', (req, res) => {
  const { expenseReports } = getStore();
  const idx = expenseReports.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Expense report not found' });
  expenseReports[idx] = { ...expenseReports[idx], status: 'Submitted', submittedAt: new Date().toISOString() } as any;
  return res.json(expenseReports[idx]);
});

financeRouter.patch('/expense-reports/:id/approve', (req, res) => {
  const schema = z.object({ approvedBy: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { expenseReports } = getStore();
  const idx = expenseReports.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Expense report not found' });
  expenseReports[idx] = { ...expenseReports[idx], status: 'Approved', approvedBy: parsed.data.approvedBy, approvedAt: new Date().toISOString() } as any;
  return res.json(expenseReports[idx]);
});

financeRouter.patch('/expense-reports/:id/reject', (req, res) => {
  const schema = z.object({ rejectionReason: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { expenseReports } = getStore();
  const idx = expenseReports.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Expense report not found' });
  expenseReports[idx] = { ...expenseReports[idx], status: 'Rejected', ...(parsed.data as any) } as any;
  return res.json(expenseReports[idx]);
});

// Finance reports
financeRouter.get('/reports', (req, res) => {
  const { financeReports } = getStore();
  const { page, pageSize } = parsePageParams(req.query);
  return res.json(paginate(financeReports, page, pageSize) satisfies PaginatedResponse<FinanceReport>);
});

financeRouter.get('/reports/:id', (req, res) => {
  const { financeReports } = getStore();
  const report = financeReports.find((r) => r.id === req.params.id);
  if (!report) return res.status(404).json({ error: 'Report not found' });
  return res.json(report);
});

financeRouter.post('/reports/generate', (req, res) => {
  const schema = z.object({ type: z.string().min(1), period: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { financeReports } = getStore();
  const report: FinanceReport = {
    id: crypto.randomUUID(),
    type: parsed.data.type as any,
    title: `${parsed.data.type} — ${parsed.data.period}`,
    period: parsed.data.period,
    generatedAt: new Date().toISOString(),
    generatedBy: 'System',
    status: 'Generating',
    summary: {},
  };
  financeReports.unshift(report);
  return res.status(201).json(report);
});

// Payroll postings (Phase 14)
financeRouter.get('/payroll-postings', (req, res) => {
  const { payrollPostings } = getStore();
  const { page, pageSize } = parsePageParams(req.query);
  return res.json(paginate(payrollPostings, page, pageSize) satisfies PaginatedResponse<PayrollPosting>);
});

financeRouter.get('/payroll-postings/:id', (req, res) => {
  const { payrollPostings } = getStore();
  const posting = payrollPostings.find((p) => p.id === req.params.id);
  if (!posting) return res.status(404).json({ error: 'Payroll posting not found' });
  return res.json(posting);
});

financeRouter.post('/payroll-postings', (req, res) => {
  const schema = z.object({
    payrollRunId: z.string().optional(),
    period: z.string().min(1),
    month: z.string().min(1),
    totalAmount: z.number(),
    currency: z.string().min(1),
    employeeCount: z.number(),
    departmentBreakdown: z.array(z.object({
      departmentId: z.string().min(1),
      departmentName: z.string().min(1),
      employeeCount: z.number(),
      amount: z.number(),
    })),
    status: z.string().min(1),
    ledgerRef: z.string().optional(),
    postedAt: z.string().optional(),
    postedBy: z.string().optional(),
    reversedAt: z.string().optional(),
    reversedBy: z.string().optional(),
    reversalReason: z.string().optional(),
    notes: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { payrollPostings } = getStore();
  const posting: PayrollPosting = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...(parsed.data as any),
  };
  payrollPostings.unshift(posting);
  return res.status(201).json(posting);
});

financeRouter.patch('/payroll-postings/:id/post', (req, res) => {
  const schema = z.object({ postedBy: z.string().min(1), postedAt: z.string().optional(), status: z.string().optional() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { payrollPostings } = getStore();
  const idx = payrollPostings.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Payroll posting not found' });
  payrollPostings[idx] = { ...payrollPostings[idx], status: 'Posted', postedBy: parsed.data.postedBy, postedAt: parsed.data.postedAt ?? new Date().toISOString() } as any;
  return res.json(payrollPostings[idx]);
});

financeRouter.patch('/payroll-postings/:id/reverse', (req, res) => {
  const schema = z.object({ reversedBy: z.string().min(1), reason: z.string().min(1), reversedAt: z.string().optional(), status: z.string().optional() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { payrollPostings } = getStore();
  const idx = payrollPostings.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Payroll posting not found' });
  payrollPostings[idx] = { ...payrollPostings[idx], status: 'Reversed', reversedBy: parsed.data.reversedBy, reversedAt: parsed.data.reversedAt ?? new Date().toISOString(), reversalReason: parsed.data.reason } as any;
  return res.json(payrollPostings[idx]);
});

// Intelligence placeholder (config ENDPOINTS.FINANCE_INTELLIGENCE — UI still uses local insights for v1)
financeRouter.get('/intelligence', (_req, res) => {
  return res.json({
    generatedAt: new Date().toISOString(),
    summary:
      'Demo response for FINANCE_INTELLIGENCE. Replace with a real analytics or LLM backend when ready.',
    risks: [] as string[],
    opportunities: [] as string[],
    metrics: { cashRunwayMonths: null as number | null, burnRateTrend: 'flat' as const },
  });
});

// Import job acceptor (config ENDPOINTS.FINANCE_IMPORT — no contract method yet)
financeRouter.post('/import', (req, res) => {
  const schema = z
    .object({
      format: z.enum(['csv', 'xlsx', 'json']).optional(),
      entity: z.string().min(1).optional(),
    })
    .passthrough();
  const parsed = schema.safeParse(req.body ?? {});
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  return res.status(202).json({
    jobId: crypto.randomUUID(),
    status: 'queued',
    message: 'Import accepted; ledger ingestion is not implemented in the demo API.',
  });
});

