/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FINANCE API SERVICE — Real HTTP Implementation (Phase 8 + Phase 13 extended)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Concrete implementation of IFinanceService using real HTTP calls.
 * Extends ApiService for fetch wrapping, timeout, and error handling.
 *
 * Covers 13 sub-domains:
 *   1. Payroll Runs
 *   2. Payslips
 *   3. Billing Invoices
 *   4. Offline Sync Records
 *   5. Screenshot Records
 *   6. Transactions / Ledger      (Phase 13)
 *   7. Accounts / Wallets         (Phase 13)
 *   8. Reimbursements             (Phase 13)
 *   9. Loans & Liabilities        (Phase 13)
 *  10. Finance Inbox              (Phase 13)
 *  11. Cost Centers               (Phase 13)
 *  12. Expense Reports            (Phase 13)
 *  13. Finance Reports            (Phase 13)
 *
 * TO ACTIVATE: In ServiceProvider.tsx replace the inline finance mock with:
 *   import { FinanceApiService } from './api';
 *   const financeService = new FinanceApiService();
 *
 * Also set USE_MOCK_SERVICES = false in config.ts.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { ApiService } from '../ApiService';
import type { IFinanceService } from '../contracts';
import type {
  Payslip, PayrollRun, BillingInvoice,
  OfflineSyncRecord, ScreenshotRecord,
  FinanceTransaction, FinanceAccount, Reimbursement, LoanLiability,
  FinanceInboxItem, CostCenter, ExpenseReport, FinanceReport,
  PayrollPosting,
  QueryParams, PaginatedResponse,
} from '../types';
import { ENDPOINTS } from '../config';

export class FinanceApiService extends ApiService implements IFinanceService {
  // ─── Payroll ────────────────────────────────────────────────────────────

  async getPayrollRuns(params?: QueryParams): Promise<PaginatedResponse<PayrollRun>> {
    return this.get<PaginatedResponse<PayrollRun>>(ENDPOINTS.PAYROLL_RUNS, params as any);
  }

  async getPayrollRunById(id: string): Promise<PayrollRun> {
    return this.get<PayrollRun>(`${ENDPOINTS.PAYROLL_RUNS}/${id}`);
  }

  async processPayrollRun(id: string, processedBy: string): Promise<PayrollRun> {
    return this.post<PayrollRun>(`${ENDPOINTS.PAYROLL_RUNS}/${id}/process`, {
      processedBy,
      processedAt: new Date().toISOString(),
    });
  }

  // ─── Payslips ───────────────────────────────────────────────────────────

  async getPayslips(params?: QueryParams): Promise<PaginatedResponse<Payslip>> {
    return this.get<PaginatedResponse<Payslip>>(ENDPOINTS.PAYSLIPS, params as any);
  }

  async getMyPayslips(employeeId: string): Promise<Payslip[]> {
    return this.get<Payslip[]>(`${ENDPOINTS.PAYSLIPS}/my`, { employeeId });
  }

  async getPayslipById(id: string): Promise<Payslip> {
    return this.get<Payslip>(`${ENDPOINTS.PAYSLIPS}/${id}`);
  }

  // ─── Billing ────────────────────────────────────────────────────────────

  async getBillingInvoices(params?: QueryParams): Promise<PaginatedResponse<BillingInvoice>> {
    return this.get<PaginatedResponse<BillingInvoice>>(ENDPOINTS.BILLING_INVOICES, params as any);
  }

  async getBillingInvoiceById(id: string): Promise<BillingInvoice> {
    return this.get<BillingInvoice>(`${ENDPOINTS.BILLING_INVOICES}/${id}`);
  }

  // ─── Offline Sync ────────────────────────────────────────────────────────

  async getOfflineSyncRecords(params?: QueryParams): Promise<PaginatedResponse<OfflineSyncRecord>> {
    return this.get<PaginatedResponse<OfflineSyncRecord>>(ENDPOINTS.OFFLINE_SYNC, params as any);
  }

  async triggerSync(id: string): Promise<OfflineSyncRecord> {
    return this.post<OfflineSyncRecord>(`${ENDPOINTS.OFFLINE_SYNC}/${id}/trigger`, {});
  }

  async syncAll(): Promise<OfflineSyncRecord[]> {
    return this.post<OfflineSyncRecord[]>(`${ENDPOINTS.OFFLINE_SYNC}/sync-all`, {});
  }

  // ─── Screenshots ─────────────────────────────────────────────────────────

  async getScreenshots(params?: QueryParams): Promise<PaginatedResponse<ScreenshotRecord>> {
    return this.get<PaginatedResponse<ScreenshotRecord>>(ENDPOINTS.SCREENSHOTS, params as any);
  }

  async reviewScreenshot(id: string, reviewedBy: string): Promise<ScreenshotRecord> {
    return this.patch<ScreenshotRecord>(`${ENDPOINTS.SCREENSHOTS}/${id}/review`, {
      reviewedBy,
      reviewedAt: new Date().toISOString(),
      status: 'Reviewed',
    });
  }

  async flagScreenshot(id: string, reason: string): Promise<ScreenshotRecord> {
    return this.patch<ScreenshotRecord>(`${ENDPOINTS.SCREENSHOTS}/${id}/flag`, {
      flagReason: reason,
      status: 'Flagged',
    });
  }

  // ─── Transactions / Ledger (Phase 13) ────────────────────────────────────

  async getTransactions(params?: QueryParams): Promise<PaginatedResponse<FinanceTransaction>> {
    return this.get<PaginatedResponse<FinanceTransaction>>(ENDPOINTS.FINANCE_TRANSACTIONS, params as any);
  }

  async getTransactionById(id: string): Promise<FinanceTransaction> {
    return this.get<FinanceTransaction>(`${ENDPOINTS.FINANCE_TRANSACTIONS}/${id}`);
  }

  async createTransaction(data: Omit<FinanceTransaction, 'id'>): Promise<FinanceTransaction> {
    return this.post<FinanceTransaction>(ENDPOINTS.FINANCE_TRANSACTIONS, data);
  }

  async updateTransaction(id: string, data: Partial<FinanceTransaction>): Promise<FinanceTransaction> {
    return this.patch<FinanceTransaction>(`${ENDPOINTS.FINANCE_TRANSACTIONS}/${id}`, data);
  }

  async voidTransaction(id: string): Promise<FinanceTransaction> {
    return this.patch<FinanceTransaction>(`${ENDPOINTS.FINANCE_TRANSACTIONS}/${id}/void`, {
      status: 'Voided',
      voidedAt: new Date().toISOString(),
    });
  }

  // ─── Accounts / Wallets (Phase 13) ───────────────────────────────────────

  async getAccounts(params?: QueryParams): Promise<PaginatedResponse<FinanceAccount>> {
    return this.get<PaginatedResponse<FinanceAccount>>(ENDPOINTS.FINANCE_ACCOUNTS, params as any);
  }

  async getAccountById(id: string): Promise<FinanceAccount> {
    return this.get<FinanceAccount>(`${ENDPOINTS.FINANCE_ACCOUNTS}/${id}`);
  }

  async createAccount(data: Omit<FinanceAccount, 'id'>): Promise<FinanceAccount> {
    return this.post<FinanceAccount>(ENDPOINTS.FINANCE_ACCOUNTS, data);
  }

  async updateAccount(id: string, data: Partial<FinanceAccount>): Promise<FinanceAccount> {
    return this.patch<FinanceAccount>(`${ENDPOINTS.FINANCE_ACCOUNTS}/${id}`, data);
  }

  // ─── Reimbursements (Phase 13) ───────────────────────────────────────────

  async getReimbursements(params?: QueryParams): Promise<PaginatedResponse<Reimbursement>> {
    return this.get<PaginatedResponse<Reimbursement>>(ENDPOINTS.REIMBURSEMENTS, params as any);
  }

  async getReimbursementById(id: string): Promise<Reimbursement> {
    return this.get<Reimbursement>(`${ENDPOINTS.REIMBURSEMENTS}/${id}`);
  }

  async createReimbursement(data: Omit<Reimbursement, 'id' | 'submittedAt'>): Promise<Reimbursement> {
    return this.post<Reimbursement>(ENDPOINTS.REIMBURSEMENTS, data);
  }

  async approveReimbursement(id: string, reviewedBy: string): Promise<Reimbursement> {
    return this.patch<Reimbursement>(`${ENDPOINTS.REIMBURSEMENTS}/${id}/approve`, {
      reviewedBy,
      reviewedAt: new Date().toISOString(),
      status: 'Approved',
    });
  }

  async rejectReimbursement(id: string, reviewedBy: string, reason: string): Promise<Reimbursement> {
    return this.patch<Reimbursement>(`${ENDPOINTS.REIMBURSEMENTS}/${id}/reject`, {
      reviewedBy,
      reviewedAt: new Date().toISOString(),
      status: 'Rejected',
      notes: reason,
    });
  }

  async markReimbursementPaid(id: string): Promise<Reimbursement> {
    return this.patch<Reimbursement>(`${ENDPOINTS.REIMBURSEMENTS}/${id}/pay`, {
      status: 'Paid',
      paidAt: new Date().toISOString(),
    });
  }

  async getMyReimbursements(employeeId: string): Promise<Reimbursement[]> {
    return this.get<Reimbursement[]>(`${ENDPOINTS.REIMBURSEMENTS}/my`, { employeeId });
  }

  // ─── Loans & Liabilities (Phase 13) ──────────────────────────────────────

  async getLoans(params?: QueryParams): Promise<PaginatedResponse<LoanLiability>> {
    return this.get<PaginatedResponse<LoanLiability>>(ENDPOINTS.LOANS, params as any);
  }

  async getLoanById(id: string): Promise<LoanLiability> {
    return this.get<LoanLiability>(`${ENDPOINTS.LOANS}/${id}`);
  }

  async createLoan(data: Omit<LoanLiability, 'id'>): Promise<LoanLiability> {
    return this.post<LoanLiability>(ENDPOINTS.LOANS, data);
  }

  async updateLoan(id: string, data: Partial<LoanLiability>): Promise<LoanLiability> {
    return this.patch<LoanLiability>(`${ENDPOINTS.LOANS}/${id}`, data);
  }

  // ─── Finance Inbox (Phase 13) ─────────────────────────────────────────────

  async getFinanceInbox(params?: QueryParams): Promise<PaginatedResponse<FinanceInboxItem>> {
    return this.get<PaginatedResponse<FinanceInboxItem>>(ENDPOINTS.FINANCE_INBOX, params as any);
  }

  async markInboxItemRead(id: string): Promise<FinanceInboxItem> {
    return this.patch<FinanceInboxItem>(`${ENDPOINTS.FINANCE_INBOX}/${id}/read`, { status: 'read' });
  }

  async actionInboxItem(id: string): Promise<FinanceInboxItem> {
    return this.patch<FinanceInboxItem>(`${ENDPOINTS.FINANCE_INBOX}/${id}/action`, { status: 'actioned' });
  }

  async getUnreadInboxCount(): Promise<number> {
    return this.get<number>(`${ENDPOINTS.FINANCE_INBOX}/unread-count`);
  }

  // ─── Cost Centers (Phase 13) ──────────────────────────────────────────────

  async getCostCenters(params?: QueryParams): Promise<PaginatedResponse<CostCenter>> {
    return this.get<PaginatedResponse<CostCenter>>(ENDPOINTS.COST_CENTERS, params as any);
  }

  async getCostCenterById(id: string): Promise<CostCenter> {
    return this.get<CostCenter>(`${ENDPOINTS.COST_CENTERS}/${id}`);
  }

  async updateCostCenter(id: string, data: Partial<CostCenter>): Promise<CostCenter> {
    return this.patch<CostCenter>(`${ENDPOINTS.COST_CENTERS}/${id}`, data);
  }

  // ─── Expense Reports (Phase 13) ───────────────────────────────────────────

  async getExpenseReports(params?: QueryParams): Promise<PaginatedResponse<ExpenseReport>> {
    return this.get<PaginatedResponse<ExpenseReport>>(ENDPOINTS.EXPENSE_REPORTS, params as any);
  }

  async getExpenseReportById(id: string): Promise<ExpenseReport> {
    return this.get<ExpenseReport>(`${ENDPOINTS.EXPENSE_REPORTS}/${id}`);
  }

  async createExpenseReport(data: Omit<ExpenseReport, 'id'>): Promise<ExpenseReport> {
    return this.post<ExpenseReport>(ENDPOINTS.EXPENSE_REPORTS, data);
  }

  async submitExpenseReport(id: string): Promise<ExpenseReport> {
    return this.patch<ExpenseReport>(`${ENDPOINTS.EXPENSE_REPORTS}/${id}/submit`, {
      status: 'Submitted',
      submittedAt: new Date().toISOString(),
    });
  }

  async approveExpenseReport(id: string, approvedBy: string): Promise<ExpenseReport> {
    return this.patch<ExpenseReport>(`${ENDPOINTS.EXPENSE_REPORTS}/${id}/approve`, {
      approvedBy,
      approvedAt: new Date().toISOString(),
      status: 'Approved',
    });
  }

  async rejectExpenseReport(id: string, reason: string): Promise<ExpenseReport> {
    return this.patch<ExpenseReport>(`${ENDPOINTS.EXPENSE_REPORTS}/${id}/reject`, {
      status: 'Rejected',
      rejectionReason: reason,
    });
  }

  async getMyExpenseReports(employeeId: string): Promise<ExpenseReport[]> {
    return this.get<ExpenseReport[]>(`${ENDPOINTS.EXPENSE_REPORTS}/my`, { employeeId });
  }

  // ─── Finance Reports (Phase 13) ───────────────────────────────────────────

  async getFinanceReports(params?: QueryParams): Promise<PaginatedResponse<FinanceReport>> {
    return this.get<PaginatedResponse<FinanceReport>>(ENDPOINTS.FINANCE_REPORTS, params as any);
  }

  async getFinanceReportById(id: string): Promise<FinanceReport> {
    return this.get<FinanceReport>(`${ENDPOINTS.FINANCE_REPORTS}/${id}`);
  }

  async generateReport(type: FinanceReport['type'], period: string): Promise<FinanceReport> {
    return this.post<FinanceReport>(`${ENDPOINTS.FINANCE_REPORTS}/generate`, { type, period });
  }

  // ─── Payroll Postings (Phase 14 — gap closure) ───────────────────────────

  async getPayrollPostings(params?: QueryParams): Promise<PaginatedResponse<PayrollPosting>> {
    return this.get<PaginatedResponse<PayrollPosting>>(ENDPOINTS.PAYROLL_POSTINGS, params as any);
  }

  async getPayrollPostingById(id: string): Promise<PayrollPosting> {
    return this.get<PayrollPosting>(`${ENDPOINTS.PAYROLL_POSTINGS}/${id}`);
  }

  async createPayrollPosting(data: Omit<PayrollPosting, 'id' | 'createdAt'>): Promise<PayrollPosting> {
    return this.post<PayrollPosting>(ENDPOINTS.PAYROLL_POSTINGS, data);
  }

  async postPayrollPosting(id: string, postedBy: string): Promise<PayrollPosting> {
    return this.patch<PayrollPosting>(`${ENDPOINTS.PAYROLL_POSTINGS}/${id}/post`, {
      postedBy,
      postedAt: new Date().toISOString(),
      status: 'Posted',
    });
  }

  async reversePayrollPosting(id: string, reversedBy: string, reason: string): Promise<PayrollPosting> {
    return this.patch<PayrollPosting>(`${ENDPOINTS.PAYROLL_POSTINGS}/${id}/reverse`, {
      reversedBy,
      reversedAt: new Date().toISOString(),
      reversalReason: reason,
      status: 'Reversed',
    });
  }
}