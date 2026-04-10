/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SERVICE HOOKS — Domain-specific React hooks
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * These hooks bridge async service calls to sync React state.
 * They handle loading states, error states, and auto-refresh on mutations.
 *
 * Usage:
 *   const { employees, loading, createEmployee, deleteEmployee } = usePeopleData();
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useServices } from './ServiceProvider';
import type {
  Employee, Department, RoleDefinition,
  TimeSession, TimeCorrection, LeaveRequest, Fine,
  WorkdayRule, BreakRule,
  Channel, Message,
  Notification,
  Payslip, PayrollRun, BillingInvoice, OfflineSyncRecord, ScreenshotRecord,
  FinanceTransaction, FinanceAccount, Reimbursement, LoanLiability,
  FinanceInboxItem, CostCenter, ExpenseReport, FinanceReport,
  PayrollPosting,
} from './types';

// ─────────────────────────────────────────────────────────────────────────────
// FL-007 FIX — Pagination constants
//
// MOCK mode: MOCK_PAGE_SIZE=200 loads all records in one shot (backward-compat).
// API swap:  Lower MOCK_PAGE_SIZE to e.g. 25 and the hooks handle pages correctly
//            because they pass `page` state to every service call and expose
//            goToPage() to consumers.
//
// Each stateful hook now exposes:
//   page        — current 1-based page number
//   totalCount  — total records reported by the service
//   goToPage(n) — sets page, triggers re-fetch via the refresh useEffect
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_PAGE_SIZE = 200; // SWAP: set to 25 (or desired page size) when connecting real API

// ═══════════════════════════════════════════════════════════════════════
// PEOPLE HOOK
// ═══════════════════════════════════════════════════════════════════════

export function usePeopleData() {
  const { people } = useServices();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [empRes, deptRes, roleRes] = await Promise.all([
        people.getEmployees({ page, pageSize: MOCK_PAGE_SIZE }),
        people.getDepartments({ pageSize: MOCK_PAGE_SIZE }),
        people.getRoles({ pageSize: MOCK_PAGE_SIZE }),
      ]);
      setEmployees(empRes.data);
      setDepartments(deptRes.data);
      setRoles(roleRes.data);
      setTotalCount(empRes.total);
    } catch (e: any) {
      setError(e.message || 'Failed to load people data');
    } finally {
      setLoading(false);
    }
  }, [people, page]);

  useEffect(() => { refresh(); }, [refresh]);

  const goToPage = useCallback((p: number) => { setPage(p); }, []);

  // Employee mutations
  const createEmployee = useCallback(async (data: Omit<Employee, 'id'>) => {
    const emp = await people.createEmployee(data);
    setEmployees(prev => [...prev, emp]);
    return emp;
  }, [people]);

  const updateEmployee = useCallback(async (id: string, data: Partial<Employee>) => {
    const emp = await people.updateEmployee(id, data);
    setEmployees(prev => prev.map(e => e.id === id ? emp : e));
    return emp;
  }, [people]);

  const deleteEmployee = useCallback(async (id: string) => {
    await people.deleteEmployee(id);
    setEmployees(prev => prev.filter(e => e.id !== id));
  }, [people]);

  // Department mutations
  const createDepartment = useCallback(async (data: Omit<Department, 'id'>) => {
    const dept = await people.createDepartment(data);
    setDepartments(prev => [...prev, dept]);
    return dept;
  }, [people]);

  const updateDepartment = useCallback(async (id: string, data: Partial<Department>) => {
    const dept = await people.updateDepartment(id, data);
    setDepartments(prev => prev.map(d => d.id === id ? dept : d));
    return dept;
  }, [people]);

  const deleteDepartment = useCallback(async (id: string) => {
    await people.deleteDepartment(id);
    setDepartments(prev => prev.filter(d => d.id !== id));
  }, [people]);

  // Role mutations
  const createRole = useCallback(async (data: Omit<RoleDefinition, 'id'>) => {
    const role = await people.createRole(data);
    setRoles(prev => [...prev, role]);
    return role;
  }, [people]);

  const updateRole = useCallback(async (id: string, data: Partial<RoleDefinition>) => {
    const role = await people.updateRole(id, data);
    setRoles(prev => prev.map(r => r.id === id ? role : r));
    return role;
  }, [people]);

  const deleteRole = useCallback(async (id: string) => {
    await people.deleteRole(id);
    setRoles(prev => prev.filter(r => r.id !== id));
  }, [people]);

  return {
    employees, departments, roles, loading, error, refresh,
    page, totalCount, goToPage,
    createEmployee, updateEmployee, deleteEmployee,
    createDepartment, updateDepartment, deleteDepartment,
    createRole, updateRole, deleteRole,
  };
}

// ═══════════════════════════════════════════════════════════════════════
// TIME HOOK
// ═══════════════════════════════════════════════════════════════════════

export function useTimeData() {
  const { time } = useServices();
  const [sessions, setSessions] = useState<TimeSession[]>([]);
  const [corrections, setCorrections] = useState<TimeCorrection[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [fines, setFines] = useState<Fine[]>([]);
  const [workdayRules, setWorkdayRules] = useState<WorkdayRule[]>([]);
  const [breakRules, setBreakRules] = useState<BreakRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Pagination state (sessions are the highest-volume entity in this domain)
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sessRes, corrRes, leaveRes, fineRes, wdRules, brRules] = await Promise.all([
        time.getSessions({ page, pageSize: MOCK_PAGE_SIZE }),
        time.getCorrections({ pageSize: MOCK_PAGE_SIZE }),
        time.getLeaveRequests({ pageSize: MOCK_PAGE_SIZE }),
        time.getFines({ pageSize: MOCK_PAGE_SIZE }),
        time.getWorkdayRules(),
        time.getBreakRules(),
      ]);
      setSessions(sessRes.data);
      setCorrections(corrRes.data);
      setLeaveRequests(leaveRes.data);
      setFines(fineRes.data);
      setWorkdayRules(wdRules);
      setBreakRules(brRules);
      setTotalCount(sessRes.total);
    } catch (e: any) {
      setError(e.message || 'Failed to load time data');
    } finally {
      setLoading(false);
    }
  }, [time, page]);

  useEffect(() => { refresh(); }, [refresh]);

  const goToPage = useCallback((p: number) => { setPage(p); }, []);
  const upsertSession = useCallback((session: TimeSession) => {
    setSessions(prev => {
      const idx = prev.findIndex(s => s.id === session.id);
      if (idx === -1) return [session, ...prev];
      return prev.map(s => s.id === session.id ? session : s);
    });
  }, []);

  // Session mutations
  const clockIn = useCallback(async (employeeId: string) => {
    const session = await time.clockIn(employeeId);
    upsertSession(session);
    return session;
  }, [time, upsertSession]);

  const clockOut = useCallback(async (sessionId: string) => {
    const session = await time.clockOut(sessionId);
    upsertSession(session);
    return session;
  }, [time, upsertSession]);

  const addSessionCheck = useCallback(async (
    sessionId: string,
    data: { type: NonNullable<TimeSession['workChecks']>[number]['type']; note?: string },
  ) => {
    const session = await time.addSessionCheck(sessionId, data);
    upsertSession(session);
    return session;
  }, [time, upsertSession]);

  // Correction mutations
  const approveCorrection = useCallback(async (id: string, reviewedBy: string) => {
    const corr = await time.approveCorrection(id, reviewedBy);
    setCorrections(prev => prev.map(c => c.id === id ? corr : c));
    return corr;
  }, [time]);

  const rejectCorrection = useCallback(async (id: string, reviewedBy: string, reason: string) => {
    const corr = await time.rejectCorrection(id, reviewedBy, reason);
    setCorrections(prev => prev.map(c => c.id === id ? corr : c));
    return corr;
  }, [time]);

  // Leave mutations
  const submitLeaveRequest = useCallback(async (data: Omit<LeaveRequest, 'id' | 'status' | 'submittedAt'>) => {
    const lr = await time.submitLeaveRequest(data);
    setLeaveRequests(prev => [...prev, lr]);
    return lr;
  }, [time]);

  const approveLeave = useCallback(async (id: string, approvedBy: string) => {
    const lr = await time.approveLeaveRequest(id, approvedBy);
    setLeaveRequests(prev => prev.map(l => l.id === id ? lr : l));
    return lr;
  }, [time]);

  const rejectLeave = useCallback(async (id: string, reason: string) => {
    const lr = await time.rejectLeaveRequest(id, reason);
    setLeaveRequests(prev => prev.map(l => l.id === id ? lr : l));
    return lr;
  }, [time]);

  const cancelLeave = useCallback(async (id: string) => {
    const lr = await time.cancelLeaveRequest(id);
    setLeaveRequests(prev => prev.map(l => l.id === id ? lr : l));
    return lr;
  }, [time]);

  // Fine mutations
  const createFine = useCallback(async (data: Omit<Fine, 'id' | 'issuedAt'>) => {
    const fine = await time.createFine(data);
    setFines(prev => [...prev, fine]);
    return fine;
  }, [time]);

  const waiveFine = useCallback(async (id: string, waivedBy: string, reason: string) => {
    const fine = await time.waiveFine(id, waivedBy, reason);
    setFines(prev => prev.map(f => f.id === id ? fine : f));
    return fine;
  }, [time]);

  return {
    sessions, corrections, leaveRequests, fines, workdayRules, breakRules,
    loading, error, refresh,
    page, totalCount, goToPage,
    clockIn, clockOut, addSessionCheck,
    approveCorrection, rejectCorrection,
    submitLeaveRequest, approveLeave, rejectLeave, cancelLeave,
    createFine, waiveFine,
  };
}

// ═══════════════════════════════════════════════════════════════════════
// COMMUNICATION HOOK
// ═══════════════════════════════════════════════════════════════════════

export function useCommunicationData() {
  const { communication } = useServices();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await communication.getChannels({ page, pageSize: MOCK_PAGE_SIZE });
      setChannels(res.data);
      setTotalCount(res.total);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, [communication, page]);

  useEffect(() => { refresh(); }, [refresh]);

  const goToPage = useCallback((p: number) => { setPage(p); }, []);

  const getMessages = useCallback(async (channelId: string) => {
    const res = await communication.getMessages(channelId, { pageSize: MOCK_PAGE_SIZE });
    return res.data;
  }, [communication]);

  const sendMessage = useCallback(async (channelId: string, content: string, senderId: string) => {
    return await communication.sendMessage(channelId, content, senderId);
  }, [communication]);

  const createChannel = useCallback(async (data: Omit<Channel, 'id' | 'createdAt'>) => {
    const ch = await communication.createChannel(data);
    setChannels(prev => [...prev, ch]);
    return ch;
  }, [communication]);

  const archiveChannel = useCallback(async (id: string) => {
    const ch = await communication.archiveChannel(id);
    setChannels(prev => prev.map(c => c.id === id ? ch : c));
    return ch;
  }, [communication]);

  return { channels, loading, refresh, page, totalCount, goToPage, getMessages, sendMessage, createChannel, archiveChannel };
}

// ═══════════════════════════════════════════════════════════════════════
// NOTIFICATIONS HOOK
// ═══════════════════════════════════════════════════════════════════════

export function useNotificationData() {
  const { notifications: notifService } = useServices();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [res, count] = await Promise.all([
        notifService.getNotifications({ page, pageSize: MOCK_PAGE_SIZE }),
        notifService.getUnreadCount(),
      ]);
      setNotifications(res.data);
      setUnreadCount(count);
      setTotalCount(res.total);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, [notifService, page]);

  useEffect(() => { refresh(); }, [refresh]);

  const goToPage = useCallback((p: number) => { setPage(p); }, []);

  const markAsRead = useCallback(async (id: string) => {
    await notifService.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, [notifService]);

  const markAllAsRead = useCallback(async () => {
    await notifService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, [notifService]);

  const deleteNotification = useCallback(async (id: string) => {
    const notif = notifications.find(n => n.id === id);
    await notifService.deleteNotification(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (notif && !notif.read) setUnreadCount(prev => Math.max(0, prev - 1));
  }, [notifService, notifications]);

  return { notifications, unreadCount, loading, refresh, page, totalCount, goToPage, markAsRead, markAllAsRead, deleteNotification };
}

// ═════════════════════════��═════════════════════════════════════════════
// ANALYTICS HOOK
// ═══════════════════════════════════════════════════════════════════════

export function useAnalyticsData() {
  const { analytics } = useServices();
  const [loading, setLoading] = useState(false);

  const getActivityLog = useCallback(async (search?: string) => {
    setLoading(true);
    try {
      const res = await analytics.getActivityLog({ search, pageSize: 200 });
      return res.data;
    } finally { setLoading(false); }
  }, [analytics]);

  const getLiveActivity = useCallback(async () => {
    return await analytics.getLiveActivity();
  }, [analytics]);

  const getProductivityMetrics = useCallback(async (from: string, to: string, deptId?: string) => {
    return await analytics.getProductivityMetrics(from, to, deptId);
  }, [analytics]);

  const getAppUsageReports = useCallback(async (from: string, to: string) => {
    return await analytics.getAppUsageReports(from, to);
  }, [analytics]);

  return { loading, getActivityLog, getLiveActivity, getProductivityMetrics, getAppUsageReports };
}

// ═══════════════════════════════════════════════════════════════════════
// FINANCE HOOK (Phase 8 + Phase 13 extended)
// ═══════════════════════════════════════════════════════════════════════

export function useFinanceData() {
  const { finance } = useServices();
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([]);
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [billingInvoices, setBillingInvoices] = useState<BillingInvoice[]>([]);
  const [offlineSyncRecords, setOfflineSyncRecords] = useState<OfflineSyncRecord[]>([]);
  const [screenshots, setScreenshots] = useState<ScreenshotRecord[]>([]);
  // Phase 13 extended state
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [accounts, setAccounts] = useState<FinanceAccount[]>([]);
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [loans, setLoans] = useState<LoanLiability[]>([]);
  const [financeInbox, setFinanceInbox] = useState<FinanceInboxItem[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [expenseReports, setExpenseReports] = useState<ExpenseReport[]>([]);
  const [financeReports, setFinanceReports] = useState<FinanceReport[]>([]);
  const [payrollPostings, setPayrollPostings] = useState<PayrollPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Pagination state (transactions are the highest-volume entity in finance)
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        runsRes, payslipsRes, billingRes, syncRes, screenshotsRes,
        txnRes, accRes, rmbRes, loanRes, inboxRes, ccRes, erRes, frRes, ppRes,
      ] = await Promise.all([
        finance.getPayrollRuns({ pageSize: 50 }),
        finance.getPayslips({ pageSize: MOCK_PAGE_SIZE }),
        finance.getBillingInvoices({ pageSize: 50 }),
        finance.getOfflineSyncRecords({ pageSize: MOCK_PAGE_SIZE }),
        finance.getScreenshots({ pageSize: MOCK_PAGE_SIZE }),
        finance.getTransactions({ page, pageSize: MOCK_PAGE_SIZE }),
        finance.getAccounts({ pageSize: 50 }),
        finance.getReimbursements({ pageSize: MOCK_PAGE_SIZE }),
        finance.getLoans({ pageSize: 50 }),
        finance.getFinanceInbox({ pageSize: 100 }),
        finance.getCostCenters({ pageSize: 50 }),
        finance.getExpenseReports({ pageSize: MOCK_PAGE_SIZE }),
        finance.getFinanceReports({ pageSize: 50 }),
        finance.getPayrollPostings({ pageSize: 50 }),
      ]);
      setPayrollRuns(runsRes.data);
      setPayslips(payslipsRes.data);
      setBillingInvoices(billingRes.data);
      setOfflineSyncRecords(syncRes.data);
      setScreenshots(screenshotsRes.data);
      setTransactions(txnRes.data);
      setAccounts(accRes.data);
      setReimbursements(rmbRes.data);
      setLoans(loanRes.data);
      setFinanceInbox(inboxRes.data);
      setCostCenters(ccRes.data);
      setExpenseReports(erRes.data);
      setFinanceReports(frRes.data);
      setPayrollPostings(ppRes.data);
      setTotalCount(txnRes.total);
    } catch (e: any) {
      setError(e.message || 'Failed to load finance data');
    } finally {
      setLoading(false);
    }
  }, [finance, page]);

  useEffect(() => { refresh(); }, [refresh]);

  const goToPage = useCallback((p: number) => { setPage(p); }, []);

  // ─── Payroll mutations ─────────────────────────────────────
  const processPayrollRun = useCallback(async (id: string, processedBy: string) => {
    const run = await finance.processPayrollRun(id, processedBy);
    setPayrollRuns(prev => prev.map(r => r.id === id ? run : r));
    return run;
  }, [finance]);

  // ─── Screenshot mutations ──────────────────────────────────
  const reviewScreenshot = useCallback(async (id: string, reviewedBy: string) => {
    const ss = await finance.reviewScreenshot(id, reviewedBy);
    setScreenshots(prev => prev.map(s => s.id === id ? ss : s));
    return ss;
  }, [finance]);

  const flagScreenshot = useCallback(async (id: string, reason: string) => {
    const ss = await finance.flagScreenshot(id, reason);
    setScreenshots(prev => prev.map(s => s.id === id ? ss : s));
    return ss;
  }, [finance]);

  // ─── Sync mutations ────────────────────────────────────────
  const triggerSync = useCallback(async (id: string) => {
    const rec = await finance.triggerSync(id);
    setOfflineSyncRecords(prev => prev.map(r => r.id === id ? rec : r));
    return rec;
  }, [finance]);

  const syncAll = useCallback(async () => {
    const records = await finance.syncAll();
    setOfflineSyncRecords(records);
    return records;
  }, [finance]);

  // ─── Payslip helpers ──────────────────────────────────────
  const getMyPayslips = useCallback(async (employeeId: string) => {
    return await finance.getMyPayslips(employeeId);
  }, [finance]);

  // ─── Transaction mutations (Phase 13) ─────────────────────
  const createTransaction = useCallback(async (data: Omit<FinanceTransaction, 'id'>) => {
    const tx = await finance.createTransaction(data);
    setTransactions(prev => [tx, ...prev]);
    return tx;
  }, [finance]);

  const voidTransaction = useCallback(async (id: string) => {
    const tx = await finance.voidTransaction(id);
    setTransactions(prev => prev.map(t => t.id === id ? tx : t));
    return tx;
  }, [finance]);

  // ─── Reimbursement mutations (Phase 13) ───────────────────
  const createReimbursement = useCallback(async (data: Omit<Reimbursement, 'id' | 'submittedAt'>) => {
    const rm = await finance.createReimbursement(data);
    setReimbursements(prev => [rm, ...prev]);
    return rm;
  }, [finance]);

  const approveReimbursement = useCallback(async (id: string, reviewedBy: string) => {
    const rm = await finance.approveReimbursement(id, reviewedBy);
    setReimbursements(prev => prev.map(r => r.id === id ? rm : r));
    return rm;
  }, [finance]);

  const rejectReimbursement = useCallback(async (id: string, reviewedBy: string, reason: string) => {
    const rm = await finance.rejectReimbursement(id, reviewedBy, reason);
    setReimbursements(prev => prev.map(r => r.id === id ? rm : r));
    return rm;
  }, [finance]);

  const markReimbursementPaid = useCallback(async (id: string) => {
    const rm = await finance.markReimbursementPaid(id);
    setReimbursements(prev => prev.map(r => r.id === id ? rm : r));
    return rm;
  }, [finance]);

  const getMyReimbursements = useCallback(async (employeeId: string) => {
    return await finance.getMyReimbursements(employeeId);
  }, [finance]);

  // ─── Finance Inbox mutations (Phase 13) ───────────────────
  const markInboxItemRead = useCallback(async (id: string) => {
    const item = await finance.markInboxItemRead(id);
    setFinanceInbox(prev => prev.map(i => i.id === id ? item : i));
    return item;
  }, [finance]);

  const actionInboxItem = useCallback(async (id: string) => {
    const item = await finance.actionInboxItem(id);
    setFinanceInbox(prev => prev.map(i => i.id === id ? item : i));
    return item;
  }, [finance]);

  const getUnreadInboxCount = useCallback(async () => {
    return await finance.getUnreadInboxCount();
  }, [finance]);

  // ─── Cost Center mutations (Phase 13) ─────────────────────
  const updateCostCenter = useCallback(async (id: string, data: Partial<CostCenter>) => {
    const cc = await finance.updateCostCenter(id, data);
    setCostCenters(prev => prev.map(c => c.id === id ? cc : c));
    return cc;
  }, [finance]);

  // ─── Expense Report mutations (Phase 13) ──────────────────
  const createExpenseReport = useCallback(async (data: Omit<ExpenseReport, 'id'>) => {
    const er = await finance.createExpenseReport(data);
    setExpenseReports(prev => [er, ...prev]);
    return er;
  }, [finance]);

  const submitExpenseReport = useCallback(async (id: string) => {
    const er = await finance.submitExpenseReport(id);
    setExpenseReports(prev => prev.map(e => e.id === id ? er : e));
    return er;
  }, [finance]);

  const approveExpenseReport = useCallback(async (id: string, approvedBy: string) => {
    const er = await finance.approveExpenseReport(id, approvedBy);
    setExpenseReports(prev => prev.map(e => e.id === id ? er : e));
    return er;
  }, [finance]);

  const rejectExpenseReport = useCallback(async (id: string, reason: string) => {
    const er = await finance.rejectExpenseReport(id, reason);
    setExpenseReports(prev => prev.map(e => e.id === id ? er : e));
    return er;
  }, [finance]);

  const getMyExpenseReports = useCallback(async (employeeId: string) => {
    return await finance.getMyExpenseReports(employeeId);
  }, [finance]);

  // ─── Finance Report generation (Phase 13) ─────────────────
  const generateReport = useCallback(async (type: FinanceReport['type'], period: string) => {
    const fr = await finance.generateReport(type, period);
    setFinanceReports(prev => [fr, ...prev]);
    return fr;
  }, [finance]);

  // ─── Payroll Posting mutations (Phase 14) ─────────────────
  const createPayrollPosting = useCallback(async (data: Omit<PayrollPosting, 'id' | 'createdAt'>) => {
    const pp = await finance.createPayrollPosting(data);
    setPayrollPostings(prev => [pp, ...prev]);
    return pp;
  }, [finance]);

  const postPayrollPosting = useCallback(async (id: string, postedBy: string) => {
    const pp = await finance.postPayrollPosting(id, postedBy);
    setPayrollPostings(prev => prev.map(p => p.id === id ? pp : p));
    return pp;
  }, [finance]);

  const reversePayrollPosting = useCallback(async (id: string, reversedBy: string, reason: string) => {
    const pp = await finance.reversePayrollPosting(id, reversedBy, reason);
    setPayrollPostings(prev => prev.map(p => p.id === id ? pp : p));
    return pp;
  }, [finance]);

  // ─── RC-008: derived unread count (auto-updates when inbox mutates) ─
  const financeInboxUnreadCount = useMemo(
    () => financeInbox.filter(i => i.status === 'unread').length,
    [financeInbox]
  );

  return {
    // Phase 8 data
    payrollRuns, payslips, billingInvoices, offlineSyncRecords, screenshots,
    // Phase 13 data
    transactions, accounts, reimbursements, loans, financeInbox,
    costCenters, expenseReports, financeReports,
    // Phase 14 data
    payrollPostings,
    // Derived state
    financeInboxUnreadCount,
    // Pagination
    page, totalCount, goToPage,
    // Meta
    loading, error, refresh,
    // Phase 8 mutations
    processPayrollRun,
    reviewScreenshot, flagScreenshot,
    triggerSync, syncAll,
    getMyPayslips,
    // Phase 13 mutations
    createTransaction, voidTransaction,
    createReimbursement, approveReimbursement, rejectReimbursement,
    markReimbursementPaid, getMyReimbursements,
    markInboxItemRead, actionInboxItem, getUnreadInboxCount,
    updateCostCenter,
    createExpenseReport, submitExpenseReport, approveExpenseReport,
    rejectExpenseReport, getMyExpenseReports,
    generateReport,
    // Phase 14 mutations
    createPayrollPosting, postPayrollPosting, reversePayrollPosting,
  };
}
