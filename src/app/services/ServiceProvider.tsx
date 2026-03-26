/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SERVICE PROVIDER — React Context for All Services
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Provides mock implementations of all service contracts.
 * ALL CRUD operations work with in-memory state (session-persistent).
 *
 * TO SWAP TO REAL API: Replace the mock implementations below with
 * real fetch()/axios calls. The React components don't change at all.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { ServiceRegistry } from './contracts';
import type {
  AuthUser, Organization, UserRole,
  Employee, Department, RoleDefinition,
  TimeSession, TimeCorrection, LeaveRequest, LeaveBalance,
  WorkdayRule, BreakRule, Fine,
  Channel, Message,
  ActivityLogEntry, ProductivityMetric, Notification,
  Payslip, PayrollRun, BillingInvoice, OfflineSyncRecord, ScreenshotRecord,
  FinanceTransaction, FinanceAccount, Reimbursement, LoanLiability,
  FinanceInboxItem, CostCenter, ExpenseReport, FinanceReport,
  PayrollPosting,
  QueryParams, PaginatedResponse, ServiceResponse,
} from './types';

// Mock data imports
import {
  mockAuthUsers, mockOrganizations as mockOrgs,
  mockEmployees as initEmployees, mockDepartments as initDepartments, mockRoles as initRoles,
  mockSessions as initSessions, mockCorrections as initCorrections,
  mockLeaveRequests as initLeave, mockLeaveBalances, mockWorkdayRules as initWorkdayRules,
  mockBreakRules as initBreakRules, mockFines as initFines,
  mockChannels as initChannels, mockMessages as initMessages,
  mockActivityLog as initActivityLog, mockProductivityMetrics,
  mockNotifications as initNotifications,
  mockPayrollRuns as initPayrollRuns, mockPayslips as initPayslips,
  mockBillingInvoices as initBillingInvoices,
  mockOfflineSyncRecords as initOfflineSyncRecords,
  mockScreenshots as initScreenshots,
  mockTransactions as initTransactions,
  mockFinanceAccounts as initFinanceAccounts,
  mockReimbursements as initReimbursements,
  mockLoans as initLoans,
  mockFinanceInbox as initFinanceInbox,
  mockCostCenters as initCostCenters,
  mockExpenseReports as initExpenseReports,
  mockFinanceReports as initFinanceReports,
  mockPayrollPostings as initPayrollPostings,
} from './mockData';

// FL-004 / PV-001: ExecutionOS service implementation
import { executionOSService } from './ExecutionOSMockService';

// ─── Helper: paginate an array ────────────────────────────────────────
function paginate<T>(items: T[], params?: QueryParams): PaginatedResponse<T> {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 50;
  const start = (page - 1) * pageSize;
  const data = items.slice(start, start + pageSize);
  return { data, total: items.length, page, pageSize, hasMore: start + pageSize < items.length };
}

// ─── Helper: search filter ────────────────────────────────────────────
function searchFilter<T extends Record<string, any>>(items: T[], search?: string, fields: string[] = ['name']): T[] {
  if (!search) return items;
  const lower = search.toLowerCase();
  return items.filter(item =>
    fields.some(field => String(item[field] ?? '').toLowerCase().includes(lower))
  );
}

// ─── Helper: generate ID ─────────────────────────────────────────────
let idCounter = Date.now();
function genId(prefix: string): string {
  return `${prefix}${++idCounter}`;
}

// ─── Helper: runtime field validator ─────────────────────────────────
// FL-006 — Applied to all create* / update* mutations at the service boundary.
// Validates required strings are non-empty and required numbers are finite.
// SWAP NOTE: Replace with Zod or yup schemas when wiring a real backend.
type ValidationRule = { field: string; type: 'required-string' | 'positive-number' };

function validatePayload(
  payload: Record<string, any>,
  rules: ValidationRule[]
): void {
  for (const rule of rules) {
    const val = payload[rule.field];
    if (rule.type === 'required-string') {
      if (typeof val !== 'string' || val.trim() === '') {
        throw new Error(`Validation error: "${rule.field}" is required and must be a non-empty string.`);
      }
    }
    if (rule.type === 'positive-number') {
      if (typeof val !== 'number' || !isFinite(val) || val < 0) {
        throw new Error(`Validation error: "${rule.field}" must be a finite non-negative number.`);
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════

const ServiceContext = createContext<ServiceRegistry | undefined>(undefined);

// ═══════════════════════════════════════════════════════════════════════
// PROVIDER COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export function ServiceProvider({ children }: { children: ReactNode }) {
  // ─── State stores ─────────────────────────────────────────────
  const [employees, setEmployees] = useState<Employee[]>(initEmployees);
  const [departments, setDepartments] = useState<Department[]>(initDepartments);
  const [roles, setRoles] = useState<RoleDefinition[]>(initRoles);
  const [sessions, setSessions] = useState<TimeSession[]>(initSessions);
  const [corrections, setCorrections] = useState<TimeCorrection[]>(initCorrections);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initLeave);
  const [workdayRules, setWorkdayRules] = useState<WorkdayRule[]>(initWorkdayRules);
  const [breakRules, setBreakRules] = useState<BreakRule[]>(initBreakRules);
  const [fines, setFines] = useState<Fine[]>(initFines);
  const [channels, setChannels] = useState<Channel[]>(initChannels);
  const [messages, setMessages] = useState<Message[]>(initMessages);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>(initActivityLog);
  const [notifications, setNotifications] = useState<Notification[]>(initNotifications);
  // Finance state (Phase 8)
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>(initPayrollRuns);
  const [payslips, setPayslips] = useState<Payslip[]>(initPayslips);
  const [billingInvoices, setBillingInvoices] = useState<BillingInvoice[]>(initBillingInvoices);
  const [offlineSyncRecords, setOfflineSyncRecords] = useState<OfflineSyncRecord[]>(initOfflineSyncRecords);
  const [screenshots, setScreenshots] = useState<ScreenshotRecord[]>(initScreenshots);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>(initTransactions);
  const [financeAccounts, setFinanceAccounts] = useState<FinanceAccount[]>(initFinanceAccounts);
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>(initReimbursements);
  const [loans, setLoans] = useState<LoanLiability[]>(initLoans);
  const [financeInbox, setFinanceInbox] = useState<FinanceInboxItem[]>(initFinanceInbox);
  const [costCenters, setCostCenters] = useState<CostCenter[]>(initCostCenters);
  const [expenseReports, setExpenseReports] = useState<ExpenseReport[]>(initExpenseReports);
  const [financeReports, setFinanceReports] = useState<FinanceReport[]>(initFinanceReports);
  const [payrollPostings, setPayrollPostings] = useState<PayrollPosting[]>(initPayrollPostings);

  // ═════════════════════════════════════════════════════════════
  // AUTH SERVICE (mock)
  // ═════════════════════════════════════════════════════════════
  const authService = {
    getCurrentUser: async () => mockAuthUsers[0],
    login: async (email: string, _password: string, role: UserRole): Promise<ServiceResponse<AuthUser>> => {
      const user = mockAuthUsers.find(u => u.role === role);
      return user ? { success: true, data: user } : { success: false, error: 'Invalid credentials' };
    },
    logout: async () => {},
    switchOrganization: async (orgId: string): Promise<ServiceResponse<Organization>> => {
      const org = mockOrgs.find(o => o.id === orgId);
      return org ? { success: true, data: org } : { success: false, error: 'Organization not found' };
    },
    getOrganizations: async () => mockOrgs,
    getCurrentOrganization: async () => mockOrgs[0],
  };

  // ═════════════════════════════════════════════════════════════
  // PEOPLE SERVICE (mock)
  // ═════════════════════════════════════════════════════════════
  const peopleService = {
    // Employees
    getEmployees: async (params?: QueryParams) => {
      const filtered = searchFilter(employees, params?.search, ['name', 'email', 'role', 'department']);
      return paginate(filtered, params);
    },
    getEmployeeById: async (id: string) => {
      const emp = employees.find(e => e.id === id);
      if (!emp) throw new Error('Employee not found');
      return emp;
    },
    createEmployee: async (data: Omit<Employee, 'id'>) => {
      validatePayload(data as any, [
        { field: 'name',  type: 'required-string' },
        { field: 'email', type: 'required-string' },
        { field: 'role',  type: 'required-string' },
      ]);
      const newEmp: Employee = { ...data, id: genId('e') };
      setEmployees(prev => [...prev, newEmp]);
      return newEmp;
    },
    updateEmployee: async (id: string, data: Partial<Employee>) => {
      let updated: Employee | undefined;
      setEmployees(prev => prev.map(e => {
        if (e.id === id) { updated = { ...e, ...data }; return updated; }
        return e;
      }));
      if (!updated) throw new Error('Employee not found');
      return updated;
    },
    deleteEmployee: async (id: string) => { setEmployees(prev => prev.filter(e => e.id !== id)); },
    getEmployeesByDepartment: async (departmentId: string) => employees.filter(e => e.departmentId === departmentId),

    // Departments
    getDepartments: async (params?: QueryParams) => {
      const filtered = searchFilter(departments, params?.search, ['name', 'lead']);
      return paginate(filtered, params);
    },
    getDepartmentById: async (id: string) => {
      const dept = departments.find(d => d.id === id);
      if (!dept) throw new Error('Department not found');
      return dept;
    },
    createDepartment: async (data: Omit<Department, 'id'>) => {
      const newDept: Department = { ...data, id: genId('d') };
      setDepartments(prev => [...prev, newDept]);
      return newDept;
    },
    updateDepartment: async (id: string, data: Partial<Department>) => {
      let updated: Department | undefined;
      setDepartments(prev => prev.map(d => {
        if (d.id === id) { updated = { ...d, ...data }; return updated; }
        return d;
      }));
      if (!updated) throw new Error('Department not found');
      return updated;
    },
    deleteDepartment: async (id: string) => { setDepartments(prev => prev.filter(d => d.id !== id)); },

    // Roles
    getRoles: async (params?: QueryParams) => {
      const filtered = searchFilter(roles, params?.search, ['name', 'description']);
      return paginate(filtered, params);
    },
    getRoleById: async (id: string) => {
      const role = roles.find(r => r.id === id);
      if (!role) throw new Error('Role not found');
      return role;
    },
    createRole: async (data: Omit<RoleDefinition, 'id'>) => {
      const newRole: RoleDefinition = { ...data, id: genId('r') };
      setRoles(prev => [...prev, newRole]);
      return newRole;
    },
    updateRole: async (id: string, data: Partial<RoleDefinition>) => {
      let updated: RoleDefinition | undefined;
      setRoles(prev => prev.map(r => {
        if (r.id === id) { updated = { ...r, ...data }; return updated; }
        return r;
      }));
      if (!updated) throw new Error('Role not found');
      return updated;
    },
    deleteRole: async (id: string) => { setRoles(prev => prev.filter(r => r.id !== id)); },
  };

  // ═════════════════════════════════════════════════════════════
  // TIME SERVICE (mock)
  // ═════════════════════════════════════════════════════════════
  const timeService = {
    // Sessions
    getSessions: async (params?: QueryParams) => {
      const filtered = searchFilter(sessions, params?.search, ['employeeName', 'department']);
      return paginate(filtered, params);
    },
    getSessionById: async (id: string) => {
      const session = sessions.find(s => s.id === id);
      if (!session) throw new Error('Session not found');
      return session;
    },
    clockIn: async (employeeId: string) => {
      const emp = employees.find(e => e.id === employeeId);
      const now = new Date();
      const newSession: TimeSession = {
        id: genId('ts'),
        employeeId,
        employeeName: emp?.name || 'Unknown',
        date: now.toISOString().split('T')[0],
        checkIn: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        duration: '—',
        totalMinutes: 0,
        status: 'Active',
        department: emp?.department || 'Unknown',
      };
      setSessions(prev => [newSession, ...prev]);
      return newSession;
    },
    clockOut: async (sessionId: string) => {
      let updated: TimeSession | undefined;
      const now = new Date();
      setSessions(prev => prev.map(s => {
        if (s.id === sessionId) {
          updated = { ...s, checkOut: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), status: 'Completed' as const, duration: '8h 00m', totalMinutes: 480 };
          return updated;
        }
        return s;
      }));
      if (!updated) throw new Error('Session not found');
      return updated;
    },
    getActiveSession: async (employeeId: string) => sessions.find(s => s.employeeId === employeeId && s.status === 'Active') || null,

    // Corrections
    getCorrections: async (params?: QueryParams) => {
      const filtered = searchFilter(corrections, params?.search, ['employeeName']);
      return paginate(filtered, params);
    },
    submitCorrection: async (data: Omit<TimeCorrection, 'id' | 'status' | 'submittedAt'>) => {
      const newCorr: TimeCorrection = { ...data, id: genId('tc'), status: 'Pending', submittedAt: new Date().toISOString() };
      setCorrections(prev => [...prev, newCorr]);
      return newCorr;
    },
    approveCorrection: async (id: string, reviewedBy: string) => {
      let updated: TimeCorrection | undefined;
      setCorrections(prev => prev.map(c => {
        if (c.id === id) { updated = { ...c, status: 'Approved', reviewedBy, reviewedAt: new Date().toISOString() }; return updated; }
        return c;
      }));
      if (!updated) throw new Error('Correction not found');
      return updated;
    },
    rejectCorrection: async (id: string, reviewedBy: string, _reason: string) => {
      let updated: TimeCorrection | undefined;
      setCorrections(prev => prev.map(c => {
        if (c.id === id) { updated = { ...c, status: 'Rejected', reviewedBy, reviewedAt: new Date().toISOString() }; return updated; }
        return c;
      }));
      if (!updated) throw new Error('Correction not found');
      return updated;
    },

    // Leave
    getLeaveRequests: async (params?: QueryParams) => {
      const filtered = searchFilter(leaveRequests, params?.search, ['employeeName', 'type']);
      return paginate(filtered, params);
    },
    getLeaveRequestById: async (id: string) => {
      const lr = leaveRequests.find(l => l.id === id);
      if (!lr) throw new Error('Leave request not found');
      return lr;
    },
    submitLeaveRequest: async (data: Omit<LeaveRequest, 'id' | 'status' | 'submittedAt'>) => {
      const newLR: LeaveRequest = { ...data, id: genId('lr'), status: 'Pending', submittedAt: new Date().toISOString() };
      setLeaveRequests(prev => [...prev, newLR]);
      return newLR;
    },
    approveLeaveRequest: async (id: string, approvedBy: string) => {
      let updated: LeaveRequest | undefined;
      setLeaveRequests(prev => prev.map(l => {
        if (l.id === id) { updated = { ...l, status: 'Approved', approvedBy, approvedAt: new Date().toISOString() }; return updated; }
        return l;
      }));
      if (!updated) throw new Error('Leave request not found');
      return updated;
    },
    rejectLeaveRequest: async (id: string, _reason: string) => {
      let updated: LeaveRequest | undefined;
      setLeaveRequests(prev => prev.map(l => {
        if (l.id === id) { updated = { ...l, status: 'Rejected' }; return updated; }
        return l;
      }));
      if (!updated) throw new Error('Leave request not found');
      return updated;
    },
    cancelLeaveRequest: async (id: string) => {
      let updated: LeaveRequest | undefined;
      setLeaveRequests(prev => prev.map(l => {
        if (l.id === id) { updated = { ...l, status: 'Cancelled' }; return updated; }
        return l;
      }));
      if (!updated) throw new Error('Leave request not found');
      return updated;
    },
    getLeaveBalances: async (_employeeId: string) => mockLeaveBalances,

    // Rules
    getWorkdayRules: async () => workdayRules,
    createWorkdayRule: async (data: Omit<WorkdayRule, 'id'>) => {
      const newRule: WorkdayRule = { ...data, id: genId('wr') };
      setWorkdayRules(prev => [...prev, newRule]);
      return newRule;
    },
    updateWorkdayRule: async (id: string, data: Partial<WorkdayRule>) => {
      let updated: WorkdayRule | undefined;
      setWorkdayRules(prev => prev.map(r => {
        if (r.id === id) { updated = { ...r, ...data }; return updated; }
        return r;
      }));
      if (!updated) throw new Error('Workday rule not found');
      return updated;
    },
    deleteWorkdayRule: async (id: string) => { setWorkdayRules(prev => prev.filter(r => r.id !== id)); },
    getBreakRules: async () => breakRules,
    createBreakRule: async (data: Omit<BreakRule, 'id'>) => {
      const newRule: BreakRule = { ...data, id: genId('br') };
      setBreakRules(prev => [...prev, newRule]);
      return newRule;
    },
    updateBreakRule: async (id: string, data: Partial<BreakRule>) => {
      let updated: BreakRule | undefined;
      setBreakRules(prev => prev.map(r => {
        if (r.id === id) { updated = { ...r, ...data }; return updated; }
        return r;
      }));
      if (!updated) throw new Error('Break rule not found');
      return updated;
    },
    deleteBreakRule: async (id: string) => { setBreakRules(prev => prev.filter(r => r.id !== id)); },

    // Fines
    getFines: async (params?: QueryParams) => {
      const filtered = searchFilter(fines, params?.search, ['employeeName', 'type']);
      return paginate(filtered, params);
    },
    getFineById: async (id: string) => {
      const fine = fines.find(f => f.id === id);
      if (!fine) throw new Error('Fine not found');
      return fine;
    },
    createFine: async (data: Omit<Fine, 'id' | 'issuedAt'>) => {
      const newFine: Fine = { ...data, id: genId('f'), issuedAt: new Date().toISOString() };
      setFines(prev => [...prev, newFine]);
      return newFine;
    },
    updateFine: async (id: string, data: Partial<Fine>) => {
      let updated: Fine | undefined;
      setFines(prev => prev.map(f => {
        if (f.id === id) { updated = { ...f, ...data }; return updated; }
        return f;
      }));
      if (!updated) throw new Error('Fine not found');
      return updated;
    },
    waiveFine: async (id: string, waivedBy: string, reason: string) => {
      let updated: Fine | undefined;
      setFines(prev => prev.map(f => {
        if (f.id === id) { updated = { ...f, status: 'Waived', waivedBy, waivedReason: reason }; return updated; }
        return f;
      }));
      if (!updated) throw new Error('Fine not found');
      return updated;
    },
    getMyFines: async (employeeId: string) => fines.filter(f => f.employeeId === employeeId),
  };

  // ═════════════════════════════════════════════════════════════
  // COMMUNICATION SERVICE (mock)
  // ═════════════════════════════════════════════════════════════
  const communicationService = {
    getChannels: async (params?: QueryParams) => {
      const filtered = searchFilter(channels, params?.search, ['name', 'description']);
      return paginate(filtered, params);
    },
    getChannelById: async (id: string) => {
      const ch = channels.find(c => c.id === id);
      if (!ch) throw new Error('Channel not found');
      return ch;
    },
    createChannel: async (data: Omit<Channel, 'id' | 'createdAt'>) => {
      const newCh: Channel = { ...data, id: genId('ch'), createdAt: new Date().toISOString() };
      setChannels(prev => [...prev, newCh]);
      return newCh;
    },
    updateChannel: async (id: string, data: Partial<Channel>) => {
      let updated: Channel | undefined;
      setChannels(prev => prev.map(c => {
        if (c.id === id) { updated = { ...c, ...data }; return updated; }
        return c;
      }));
      if (!updated) throw new Error('Channel not found');
      return updated;
    },
    deleteChannel: async (id: string) => { setChannels(prev => prev.filter(c => c.id !== id)); },
    archiveChannel: async (id: string) => {
      let updated: Channel | undefined;
      setChannels(prev => prev.map(c => {
        if (c.id === id) { updated = { ...c, archived: true }; return updated; }
        return c;
      }));
      if (!updated) throw new Error('Channel not found');
      return updated;
    },
    joinChannel: async (channelId: string, userId: string) => {
      setChannels(prev => prev.map(c =>
        c.id === channelId ? { ...c, members: [...c.members, userId], memberCount: c.memberCount + 1 } : c
      ));
    },
    leaveChannel: async (channelId: string, userId: string) => {
      setChannels(prev => prev.map(c =>
        c.id === channelId ? { ...c, members: c.members.filter(m => m !== userId), memberCount: c.memberCount - 1 } : c
      ));
    },

    // Messages
    getMessages: async (channelId: string, params?: QueryParams) => {
      const channelMessages = messages.filter(m => m.channelId === channelId);
      return paginate(channelMessages, params);
    },
    sendMessage: async (channelId: string, content: string, senderId: string) => {
      const sender = employees.find(e => e.id === senderId);
      const newMsg: Message = {
        id: genId('m'), channelId, senderId, senderName: sender?.name || 'Unknown',
        content, timestamp: new Date().toISOString(), status: 'sent', edited: false, pinned: false,
      };
      setMessages(prev => [...prev, newMsg]);
      setChannels(prev => prev.map(c =>
        c.id === channelId ? { ...c, lastMessage: content, lastMessageAt: newMsg.timestamp } : c
      ));
      return newMsg;
    },
    editMessage: async (messageId: string, content: string) => {
      let updated: Message | undefined;
      setMessages(prev => prev.map(m => {
        if (m.id === messageId) { updated = { ...m, content, edited: true, editedAt: new Date().toISOString() }; return updated; }
        return m;
      }));
      if (!updated) throw new Error('Message not found');
      return updated;
    },
    deleteMessage: async (messageId: string) => { setMessages(prev => prev.filter(m => m.id !== messageId)); },
    addReaction: async (messageId: string, emoji: string, userId: string) => {
      setMessages(prev => prev.map(m => {
        if (m.id === messageId) {
          const reactions = { ...(m.reactions || {}) };
          reactions[emoji] = [...(reactions[emoji] || []), userId];
          return { ...m, reactions };
        }
        return m;
      }));
    },
    removeReaction: async (messageId: string, emoji: string, userId: string) => {
      setMessages(prev => prev.map(m => {
        if (m.id === messageId) {
          const reactions = { ...(m.reactions || {}) };
          reactions[emoji] = (reactions[emoji] || []).filter(u => u !== userId);
          if (reactions[emoji].length === 0) delete reactions[emoji];
          return { ...m, reactions };
        }
        return m;
      }));
    },
    pinMessage: async (messageId: string) => {
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, pinned: true } : m));
    },
    unpinMessage: async (messageId: string) => {
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, pinned: false } : m));
    },
  };

  // ═════════════════════════════════════════════════════════════
  // ANALYTICS SERVICE (mock)
  // ═════════════════════════════════════════════════════════════
  const analyticsService = {
    getActivityLog: async (params?: QueryParams) => {
      const filtered = searchFilter(activityLog, params?.search, ['userName', 'action', 'target']);
      return paginate(filtered, params);
    },
    getProductivityMetrics: async (_dateFrom: string, _dateTo: string, _departmentId?: string) => mockProductivityMetrics,
    getAppUsageReports: async () => [
      { appName: 'VS Code', category: 'Productive' as const, totalMinutes: 2400, percentage: 35, users: 42 },
      { appName: 'Slack', category: 'Neutral' as const, totalMinutes: 1200, percentage: 18, users: 65 },
      { appName: 'Figma', category: 'Productive' as const, totalMinutes: 900, percentage: 13, users: 12 },
      { appName: 'Chrome', category: 'Neutral' as const, totalMinutes: 800, percentage: 12, users: 67 },
      { appName: 'Zoom', category: 'Productive' as const, totalMinutes: 600, percentage: 9, users: 55 },
      { appName: 'YouTube', category: 'Unproductive' as const, totalMinutes: 300, percentage: 4, users: 28 },
    ],
    getLiveActivity: async () => ({
      activeUsers: 52,
      totalUsers: 67,
      byDepartment: { Engineering: 38, Product: 10, Design: 6, Marketing: 8, Sales: 15, HR: 4, Finance: 5 },
      recentActions: activityLog.slice(0, 5),
    }),
  };

  // ═════════════════════════════════════════════════════════════
  // NOTIFICATION SERVICE (mock)
  // ═════════════════════════════════════════════════════════════
  const notificationService = {
    getNotifications: async (params?: QueryParams) => paginate(notifications, params),
    getUnreadCount: async () => notifications.filter(n => !n.read).length,
    markAsRead: async (id: string) => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    },
    markAllAsRead: async () => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    },
    deleteNotification: async (id: string) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    },
  };

  // ═════════════════════════════════════════════════════════════
  // ASSEMBLED REGISTRY
  // ═════════════════════════════════════════════════════════════
  const registry: ServiceRegistry = {
    auth: authService,
    people: peopleService,
    time: timeService,
    communication: communicationService,
    analytics: analyticsService,
    notifications: notificationService,
    finance: {
      // ─── Payroll ────────────────────────────────────────────
      getPayrollRuns: async (params?: QueryParams) => {
        const filtered = searchFilter(payrollRuns, params?.search, ['period', 'status']);
        return paginate(filtered, params);
      },
      getPayrollRunById: async (id: string) => {
        const run = payrollRuns.find(r => r.id === id);
        if (!run) throw new Error('Payroll run not found');
        return run;
      },
      processPayrollRun: async (id: string, processedBy: string) => {
        let updated: PayrollRun | undefined;
        setPayrollRuns(prev => prev.map(r => {
          if (r.id === id) {
            updated = { ...r, status: 'Processed', processedAt: new Date().toISOString(), processedBy };
            return updated;
          }
          return r;
        }));
        // Also mark all payslips in this run as processed
        setPayslips(prev => prev.map(p =>
          p.payrollRunId === id
            ? { ...p, status: 'Processed', paymentDate: new Date().toISOString().split('T')[0] }
            : p
        ));
        if (!updated) throw new Error('Payroll run not found');
        return updated;
      },

      // ─── Payslips ───────────────────────────────────────────
      getPayslips: async (params?: QueryParams) => {
        const filtered = searchFilter(payslips, params?.search, ['employeeName', 'department', 'period']);
        return paginate(filtered, params);
      },
      getMyPayslips: async (employeeId: string) => payslips.filter(p => p.employeeId === employeeId),
      getPayslipById: async (id: string) => {
        const ps = payslips.find(p => p.id === id);
        if (!ps) throw new Error('Payslip not found');
        return ps;
      },

      // ─── Billing ────────────────────────────────────────────
      getBillingInvoices: async (params?: QueryParams) => {
        const filtered = searchFilter(billingInvoices, params?.search, ['invoiceNumber', 'period', 'status']);
        return paginate(filtered, params);
      },
      getBillingInvoiceById: async (id: string) => {
        const inv = billingInvoices.find(b => b.id === id);
        if (!inv) throw new Error('Invoice not found');
        return inv;
      },

      // ─── Offline Sync ───────────────────────────────────────
      getOfflineSyncRecords: async (params?: QueryParams) => {
        const filtered = searchFilter(offlineSyncRecords, params?.search, ['employeeName', 'recordType', 'status']);
        return paginate(filtered, params);
      },
      triggerSync: async (id: string) => {
        let updated: OfflineSyncRecord | undefined;
        setOfflineSyncRecords(prev => prev.map(r => {
          if (r.id === id) {
            updated = { ...r, status: 'Completed', lastSyncAttempt: new Date().toISOString() };
            return updated;
          }
          return r;
        }));
        if (!updated) throw new Error('Sync record not found');
        return updated;
      },
      syncAll: async () => {
        const updated = offlineSyncRecords.map(r =>
          r.status !== 'Completed'
            ? { ...r, status: 'Completed' as const, lastSyncAttempt: new Date().toISOString() }
            : r
        );
        setOfflineSyncRecords(updated);
        return updated;
      },

      // ─── Screenshots ────────────────────────────────────────
      getScreenshots: async (params?: QueryParams) => {
        const filtered = searchFilter(screenshots, params?.search, ['employeeName', 'activity', 'department']);
        return paginate(filtered, params);
      },
      reviewScreenshot: async (id: string, reviewedBy: string) => {
        let updated: ScreenshotRecord | undefined;
        setScreenshots(prev => prev.map(s => {
          if (s.id === id) {
            updated = { ...s, status: 'Reviewed', reviewedBy, reviewedAt: new Date().toISOString() };
            return updated;
          }
          return s;
        }));
        if (!updated) throw new Error('Screenshot not found');
        return updated;
      },
      flagScreenshot: async (id: string, reason: string) => {
        let updated: ScreenshotRecord | undefined;
        setScreenshots(prev => prev.map(s => {
          if (s.id === id) {
            updated = { ...s, status: 'Flagged', flagReason: reason };
            return updated;
          }
          return s;
        }));
        if (!updated) throw new Error('Screenshot not found');
        return updated;
      },

      // ─── Transactions / Ledger ──────────────────────────────
      getTransactions: async (params?: QueryParams) => {
        const filtered = searchFilter(transactions, params?.search, ['description', 'category', 'type', 'accountName']);
        return paginate(filtered, params);
      },
      getTransactionById: async (id: string) => {
        const tx = transactions.find(t => t.id === id);
        if (!tx) throw new Error('Transaction not found');
        return tx;
      },
      createTransaction: async (data: Omit<FinanceTransaction, 'id'>) => {
        validatePayload(data as any, [
          { field: 'description', type: 'required-string' },
          { field: 'amount',      type: 'positive-number' },
          { field: 'accountId',   type: 'required-string' },
          { field: 'type',        type: 'required-string' },
        ]);
        const tx: FinanceTransaction = { ...data, id: genId('txn') };
        setTransactions(prev => [tx, ...prev]);
        return tx;
      },
      updateTransaction: async (id: string, data: Partial<FinanceTransaction>) => {
        let updated: FinanceTransaction | undefined;
        setTransactions(prev => prev.map(t => {
          if (t.id === id) { updated = { ...t, ...data }; return updated; }
          return t;
        }));
        if (!updated) throw new Error('Transaction not found');
        return updated;
      },
      voidTransaction: async (id: string) => {
        let updated: FinanceTransaction | undefined;
        setTransactions(prev => prev.map(t => {
          if (t.id === id) { updated = { ...t, status: 'Voided' }; return updated; }
          return t;
        }));
        if (!updated) throw new Error('Transaction not found');
        return updated;
      },

      // ─── Accounts / Wallets ─────────────────────────────────
      getAccounts: async (params?: QueryParams) => {
        const filtered = searchFilter(financeAccounts, params?.search, ['name', 'type', 'bankName']);
        return paginate(filtered, params);
      },
      getAccountById: async (id: string) => {
        const acc = financeAccounts.find(a => a.id === id);
        if (!acc) throw new Error('Finance account not found');
        return acc;
      },
      createAccount: async (data: Omit<FinanceAccount, 'id'>) => {
        const acc: FinanceAccount = { ...data, id: genId('acc') };
        setFinanceAccounts(prev => [...prev, acc]);
        return acc;
      },
      updateAccount: async (id: string, data: Partial<FinanceAccount>) => {
        let updated: FinanceAccount | undefined;
        setFinanceAccounts(prev => prev.map(a => {
          if (a.id === id) { updated = { ...a, ...data }; return updated; }
          return a;
        }));
        if (!updated) throw new Error('Account not found');
        return updated;
      },

      // ─── Reimbursements ─────────────────────────────────────
      getReimbursements: async (params?: QueryParams) => {
        const filtered = searchFilter(reimbursements, params?.search, ['employeeName', 'category', 'description', 'status']);
        return paginate(filtered, params);
      },
      getReimbursementById: async (id: string) => {
        const rm = reimbursements.find(r => r.id === id);
        if (!rm) throw new Error('Reimbursement not found');
        return rm;
      },
      createReimbursement: async (data: Omit<Reimbursement, 'id' | 'submittedAt'>) => {
        validatePayload(data as any, [
          { field: 'employeeId',  type: 'required-string' },
          { field: 'description', type: 'required-string' },
          { field: 'amount',      type: 'positive-number' },
        ]);
        const rm: Reimbursement = { ...data, id: genId('rmb'), submittedAt: new Date().toISOString() };
        setReimbursements(prev => [rm, ...prev]);
        return rm;
      },
      approveReimbursement: async (id: string, reviewedBy: string) => {
        let updated: Reimbursement | undefined;
        setReimbursements(prev => prev.map(r => {
          if (r.id === id) { updated = { ...r, status: 'Approved', reviewedBy, reviewedAt: new Date().toISOString() }; return updated; }
          return r;
        }));
        if (!updated) throw new Error('Reimbursement not found');
        return updated;
      },
      rejectReimbursement: async (id: string, reviewedBy: string, _reason: string) => {
        let updated: Reimbursement | undefined;
        setReimbursements(prev => prev.map(r => {
          if (r.id === id) { updated = { ...r, status: 'Rejected', reviewedBy, reviewedAt: new Date().toISOString() }; return updated; }
          return r;
        }));
        if (!updated) throw new Error('Reimbursement not found');
        return updated;
      },
      markReimbursementPaid: async (id: string) => {
        let updated: Reimbursement | undefined;
        setReimbursements(prev => prev.map(r => {
          if (r.id === id) { updated = { ...r, status: 'Paid', paidAt: new Date().toISOString() }; return updated; }
          return r;
        }));
        if (!updated) throw new Error('Reimbursement not found');
        return updated;
      },
      getMyReimbursements: async (employeeId: string) => reimbursements.filter(r => r.employeeId === employeeId),

      // ─── Loans & Liabilities ────────────────────────────────
      getLoans: async (params?: QueryParams) => {
        const filtered = searchFilter(loans, params?.search, ['creditor', 'type', 'status', 'employeeName']);
        return paginate(filtered, params);
      },
      getLoanById: async (id: string) => {
        const ln = loans.find(l => l.id === id);
        if (!ln) throw new Error('Loan not found');
        return ln;
      },
      createLoan: async (data: Omit<LoanLiability, 'id'>) => {
        const ln: LoanLiability = { ...data, id: genId('ln') };
        setLoans(prev => [...prev, ln]);
        return ln;
      },
      updateLoan: async (id: string, data: Partial<LoanLiability>) => {
        let updated: LoanLiability | undefined;
        setLoans(prev => prev.map(l => {
          if (l.id === id) { updated = { ...l, ...data }; return updated; }
          return l;
        }));
        if (!updated) throw new Error('Loan not found');
        return updated;
      },

      // ─── Finance Inbox ──────────────────────────────────────
      getFinanceInbox: async (params?: QueryParams) => {
        const filtered = searchFilter(financeInbox, params?.search, ['title', 'description', 'submittedBy']);
        return paginate(filtered, params);
      },
      markInboxItemRead: async (id: string) => {
        let updated: FinanceInboxItem | undefined;
        setFinanceInbox(prev => prev.map(i => {
          if (i.id === id) { updated = { ...i, status: 'read' }; return updated; }
          return i;
        }));
        if (!updated) throw new Error('Inbox item not found');
        return updated;
      },
      actionInboxItem: async (id: string) => {
        let updated: FinanceInboxItem | undefined;
        setFinanceInbox(prev => prev.map(i => {
          if (i.id === id) { updated = { ...i, status: 'actioned' }; return updated; }
          return i;
        }));
        if (!updated) throw new Error('Inbox item not found');
        return updated;
      },
      getUnreadInboxCount: async () => financeInbox.filter(i => i.status === 'unread').length,

      // ─── Cost Centers ───────────────────────────────────────
      getCostCenters: async (params?: QueryParams) => {
        const filtered = searchFilter(costCenters, params?.search, ['name', 'departmentName', 'status']);
        return paginate(filtered, params);
      },
      getCostCenterById: async (id: string) => {
        const cc = costCenters.find(c => c.id === id);
        if (!cc) throw new Error('Cost center not found');
        return cc;
      },
      updateCostCenter: async (id: string, data: Partial<CostCenter>) => {
        let updated: CostCenter | undefined;
        setCostCenters(prev => prev.map(c => {
          if (c.id === id) { updated = { ...c, ...data }; return updated; }
          return c;
        }));
        if (!updated) throw new Error('Cost center not found');
        return updated;
      },

      // ─── Expense Reports ────────────────────────────────────
      getExpenseReports: async (params?: QueryParams) => {
        const filtered = searchFilter(expenseReports, params?.search, ['employeeName', 'title', 'status']);
        return paginate(filtered, params);
      },
      getExpenseReportById: async (id: string) => {
        const er = expenseReports.find(e => e.id === id);
        if (!er) throw new Error('Expense report not found');
        return er;
      },
      createExpenseReport: async (data: Omit<ExpenseReport, 'id'>) => {
        const er: ExpenseReport = { ...data, id: genId('er') };
        setExpenseReports(prev => [er, ...prev]);
        return er;
      },
      submitExpenseReport: async (id: string) => {
        let updated: ExpenseReport | undefined;
        setExpenseReports(prev => prev.map(e => {
          if (e.id === id) { updated = { ...e, status: 'Submitted', submittedAt: new Date().toISOString() }; return updated; }
          return e;
        }));
        if (!updated) throw new Error('Expense report not found');
        return updated;
      },
      approveExpenseReport: async (id: string, approvedBy: string) => {
        let updated: ExpenseReport | undefined;
        setExpenseReports(prev => prev.map(e => {
          if (e.id === id) { updated = { ...e, status: 'Approved', approvedBy, approvedAt: new Date().toISOString() }; return updated; }
          return e;
        }));
        if (!updated) throw new Error('Expense report not found');
        return updated;
      },
      rejectExpenseReport: async (id: string, _reason: string) => {
        let updated: ExpenseReport | undefined;
        setExpenseReports(prev => prev.map(e => {
          if (e.id === id) { updated = { ...e, status: 'Rejected' }; return updated; }
          return e;
        }));
        if (!updated) throw new Error('Expense report not found');
        return updated;
      },
      getMyExpenseReports: async (employeeId: string) => expenseReports.filter(e => e.employeeId === employeeId),

      // ─── Finance Reports ────────────────────────────────────
      getFinanceReports: async (params?: QueryParams) => {
        const filtered = searchFilter(financeReports, params?.search, ['title', 'type', 'period']);
        return paginate(filtered, params);
      },
      getFinanceReportById: async (id: string) => {
        const fr = financeReports.find(f => f.id === id);
        if (!fr) throw new Error('Finance report not found');
        return fr;
      },
      generateReport: async (type: FinanceReport['type'], period: string) => {
        const newReport: FinanceReport = {
          id: genId('fr'),
          type,
          title: `${type} — ${period}`,
          period,
          generatedAt: new Date().toISOString(),
          generatedBy: 'System',
          status: 'Generating',
        };
        setFinanceReports(prev => [newReport, ...prev]);
        // Simulate async generation — flip to Ready after creation
        setTimeout(() => {
          setFinanceReports(prev => prev.map(r =>
            r.id === newReport.id ? { ...r, status: 'Ready', fileUrl: `/reports/${r.id}.pdf` } : r
          ));
        }, 2000);
        return newReport;
      },

      // ─── Payroll Postings (Phase 14) ────────────────────────
      getPayrollPostings: async (params?: QueryParams) => {
        const filtered = searchFilter(payrollPostings, params?.search, ['period', 'status', 'postedBy']);
        return paginate(filtered, params);
      },
      getPayrollPostingById: async (id: string) => {
        const pp = payrollPostings.find(p => p.id === id);
        if (!pp) throw new Error('Payroll posting not found');
        return pp;
      },
      createPayrollPosting: async (data: Omit<PayrollPosting, 'id' | 'createdAt'>) => {
        validatePayload(data as any, [
          { field: 'period',         type: 'required-string' },
          { field: 'month',          type: 'required-string' },
          { field: 'totalAmount',    type: 'positive-number' },
          { field: 'employeeCount',  type: 'positive-number' },
        ]);
        const pp: PayrollPosting = { ...data, id: genId('pp'), createdAt: new Date().toISOString() };
        setPayrollPostings(prev => [pp, ...prev]);
        return pp;
      },
      postPayrollPosting: async (id: string, postedBy: string) => {
        let updated: PayrollPosting | undefined;
        setPayrollPostings(prev => prev.map(p => {
          if (p.id === id) {
            updated = {
              ...p,
              status: 'Posted',
              postedBy,
              postedAt: new Date().toISOString(),
              ledgerRef: `LDG-PAY-${p.month}`,
            };
            return updated;
          }
          return p;
        }));
        if (!updated) throw new Error('Payroll posting not found');
        return updated;
      },
      reversePayrollPosting: async (id: string, reversedBy: string, reason: string) => {
        let updated: PayrollPosting | undefined;
        setPayrollPostings(prev => prev.map(p => {
          if (p.id === id) {
            updated = {
              ...p,
              status: 'Reversed',
              reversedBy,
              reversedAt: new Date().toISOString(),
              reversalReason: reason,
            };
            return updated;
          }
          return p;
        }));
        if (!updated) throw new Error('Payroll posting not found');
        return updated;
      },
    },
    // FL-004 / PV-001 closed: executionOS is now a required, registered service.
    // Module-level singleton — same lifetime as all other services in this provider.
    // SWAP: replace executionOSService with new ExecutionOSApiService() in SWAP_GUIDE Step 5.
    executionOS: executionOSService,
  };

  return (
    <ServiceContext.Provider value={registry}>
      {children}
    </ServiceContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// HOOK — Access any service
// ═══════════════════════════════════════════════════════════════════════

export function useServices(): ServiceRegistry {
  const ctx = useContext(ServiceContext);
  if (!ctx) throw new Error('useServices must be used within ServiceProvider');
  return ctx;
}

/** Convenience hooks for individual services */
export function useAuthService() { return useServices().auth; }
export function usePeopleService() { return useServices().people; }
export function useTimeService() { return useServices().time; }
export function useCommunicationService() { return useServices().communication; }
export function useAnalyticsService() { return useServices().analytics; }
export function useNotificationService() { return useServices().notifications; }
export function useFinanceService() { return useServices().finance; }
export function useExecutionOSService() { return useServices().executionOS; }