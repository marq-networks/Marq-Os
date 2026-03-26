/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SERVICE LAYER — Mock Data Store
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Rich mock data for all service domains. This data initializes the
 * in-memory store. All dates relative to TODAY = 2026-03-04.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type {
  AuthUser, Organization,
  Employee, Department, RoleDefinition,
  TimeSession, TimeCorrection, LeaveRequest, LeaveBalance,
  WorkdayRule, BreakRule, Fine,
  Channel, Message,
  ActivityLogEntry, ProductivityMetric, Notification,
  Payslip, PayrollRun, BillingInvoice, OfflineSyncRecord, ScreenshotRecord,
  FinanceTransaction, FinanceAccount, Reimbursement, LoanLiability,
  FinanceInboxItem, CostCenter, ExpenseReport, FinanceReport,
  PayrollPosting,
} from './types';

// ═══════════════════════════════════════════════════════════════════════
// AUTH & ORGANIZATIONS
// ═══════════════════════════════════════════════════════════════════════

export const mockAuthUsers: AuthUser[] = [
  { id: 'u1', name: 'Sarah Johnson', email: 'sarah.johnson@company.com', role: 'employee', organizationId: 'org1' },
  { id: 'u2', name: 'Alex Rivera', email: 'admin@company.com', role: 'org_admin', organizationId: 'org1' },
  { id: 'u3', name: 'Jordan Mitchell', email: 'platform@workos.io', role: 'platform_admin', organizationId: 'org1' },
];

export const mockOrganizations: Organization[] = [
  { id: 'org1', name: 'Acme Corp', plan: 'Professional', seats: 100, usedSeats: 67, createdAt: '2024-06-15', status: 'Active' },
  { id: 'org2', name: 'TechStart Inc', plan: 'Starter', seats: 25, usedSeats: 18, createdAt: '2025-01-10', status: 'Active' },
  { id: 'org3', name: 'Global Enterprises', plan: 'Enterprise', seats: 500, usedSeats: 342, createdAt: '2023-03-01', status: 'Active' },
];

// ═══════════════════════════════════════════════════════════════════════
// PEOPLE
// ═══════════════════════════════════════════════════════════════════════

export const mockEmployees: Employee[] = [
  { id: 'e1', name: 'Sarah Johnson', email: 'sarah.j@company.com', role: 'Product Manager', department: 'Product', departmentId: 'd2', status: 'Active', lastSeen: '5 min ago', joinDate: '2023-03-15', employmentType: 'Full-time', location: 'New York', manager: 'Michael Chen', managerId: 'e2', skills: ['Product Strategy', 'Agile', 'UX Research'] },
  { id: 'e2', name: 'Michael Chen', email: 'michael.c@company.com', role: 'VP Engineering', department: 'Engineering', departmentId: 'd1', status: 'Active', lastSeen: '2 min ago', joinDate: '2022-01-10', employmentType: 'Full-time', location: 'San Francisco', skills: ['System Design', 'Leadership', 'Go', 'Kubernetes'] },
  { id: 'e3', name: 'Emily Rodriguez', email: 'emily.r@company.com', role: 'UX Designer', department: 'Design', departmentId: 'd3', status: 'Active', lastSeen: '10 min ago', joinDate: '2023-07-22', employmentType: 'Full-time', location: 'Remote', manager: 'Sarah Johnson', managerId: 'e1', skills: ['Figma', 'User Research', 'Prototyping'] },
  { id: 'e4', name: 'David Kim', email: 'david.k@company.com', role: 'Marketing Lead', department: 'Marketing', departmentId: 'd4', status: 'Away', lastSeen: '1 hour ago', joinDate: '2024-02-01', employmentType: 'Full-time', location: 'Los Angeles', skills: ['SEO', 'Content Strategy', 'Analytics'] },
  { id: 'e5', name: 'Lisa Anderson', email: 'lisa.a@company.com', role: 'HR Manager', department: 'HR', departmentId: 'd6', status: 'Active', lastSeen: 'Just now', joinDate: '2022-09-05', employmentType: 'Full-time', location: 'New York', skills: ['Recruitment', 'Compensation', 'Employee Relations'] },
  { id: 'e6', name: 'James Wilson', email: 'james.w@company.com', role: 'Sales Director', department: 'Sales', departmentId: 'd5', status: 'Active', lastSeen: '30 min ago', joinDate: '2023-01-15', employmentType: 'Full-time', location: 'Chicago', skills: ['B2B Sales', 'CRM', 'Negotiation'] },
  { id: 'e7', name: 'Maria Garcia', email: 'maria.g@company.com', role: 'QA Engineer', department: 'Engineering', departmentId: 'd1', status: 'Offline', lastSeen: '2 hours ago', joinDate: '2024-04-01', employmentType: 'Full-time', location: 'Remote', skills: ['Selenium', 'Cypress', 'API Testing'] },
  { id: 'e8', name: 'Robert Taylor', email: 'robert.t@company.com', role: 'DevOps Lead', department: 'Engineering', departmentId: 'd1', status: 'Active', lastSeen: '15 min ago', joinDate: '2022-11-20', employmentType: 'Full-time', location: 'San Francisco', skills: ['AWS', 'Docker', 'Terraform', 'CI/CD'] },
  { id: 'e9', name: 'Anna Park', email: 'anna.p@company.com', role: 'Junior Developer', department: 'Engineering', departmentId: 'd1', status: 'Active', lastSeen: '8 min ago', joinDate: '2025-09-01', employmentType: 'Full-time', location: 'New York', skills: ['React', 'TypeScript', 'Node.js'] },
  { id: 'e10', name: 'Tom Bradley', email: 'tom.b@company.com', role: 'Finance Analyst', department: 'Finance', departmentId: 'd7', status: 'Active', lastSeen: '20 min ago', joinDate: '2024-06-15', employmentType: 'Full-time', location: 'Chicago', skills: ['Financial Modeling', 'Excel', 'Forecasting'] },
];

export const mockDepartments: Department[] = [
  { id: 'd1', name: 'Engineering', description: 'Software development and infrastructure', lead: 'Michael Chen', leadId: 'e2', memberCount: 45, budget: 2400000, createdAt: '2022-01-01', status: 'Active' },
  { id: 'd2', name: 'Product', description: 'Product strategy and management', lead: 'Sarah Johnson', leadId: 'e1', memberCount: 12, budget: 800000, createdAt: '2022-01-01', status: 'Active' },
  { id: 'd3', name: 'Design', description: 'UX/UI design and research', lead: 'Emily Rodriguez', leadId: 'e3', memberCount: 8, budget: 500000, createdAt: '2022-06-01', status: 'Active' },
  { id: 'd4', name: 'Marketing', description: 'Marketing and growth', lead: 'David Kim', leadId: 'e4', memberCount: 15, budget: 1200000, createdAt: '2022-01-01', status: 'Active' },
  { id: 'd5', name: 'Sales', description: 'Sales and business development', lead: 'James Wilson', leadId: 'e6', memberCount: 22, budget: 1800000, createdAt: '2022-01-01', status: 'Active' },
  { id: 'd6', name: 'HR', description: 'Human resources and people ops', lead: 'Lisa Anderson', leadId: 'e5', memberCount: 6, budget: 400000, createdAt: '2022-01-01', status: 'Active' },
  { id: 'd7', name: 'Finance', description: 'Financial operations and accounting', lead: 'Tom Bradley', leadId: 'e10', memberCount: 8, budget: 600000, createdAt: '2022-01-01', status: 'Active' },
];

export const mockRoles: RoleDefinition[] = [
  { id: 'r1', name: 'Employee', description: 'Standard employee access', permissions: ['view_own_data', 'submit_time', 'submit_leave', 'view_tasks'], userCount: 52, isSystem: true, createdAt: '2022-01-01' },
  { id: 'r2', name: 'Team Lead', description: 'Team management capabilities', permissions: ['view_own_data', 'submit_time', 'submit_leave', 'view_tasks', 'approve_leave', 'view_team_data', 'manage_tasks'], userCount: 8, isSystem: true, createdAt: '2022-01-01' },
  { id: 'r3', name: 'Department Head', description: 'Department-wide management', permissions: ['view_own_data', 'submit_time', 'submit_leave', 'view_tasks', 'approve_leave', 'view_team_data', 'manage_tasks', 'manage_department', 'view_reports'], userCount: 7, isSystem: true, createdAt: '2022-01-01' },
  { id: 'r4', name: 'HR Manager', description: 'HR and people operations', permissions: ['view_all_employees', 'manage_employees', 'manage_leave_policies', 'view_payroll', 'manage_fines'], userCount: 3, isSystem: true, createdAt: '2022-01-01' },
  { id: 'r5', name: 'Finance', description: 'Financial operations access', permissions: ['view_finance', 'manage_transactions', 'approve_expenses', 'view_payroll', 'manage_billing'], userCount: 4, isSystem: false, createdAt: '2023-06-01' },
];

// ═══════════════════════════════════════════════════════════════════════
// TIME
// ═══════════════════════════════════════════════════════════════════════

export const mockSessions: TimeSession[] = [
  { id: 'ts1', employeeId: 'e1', employeeName: 'Sarah Johnson', date: '2026-03-04', checkIn: '09:02 AM', checkOut: undefined, duration: '—', totalMinutes: 0, status: 'Active', department: 'Product', notes: 'Working from home' },
  { id: 'ts2', employeeId: 'e2', employeeName: 'Michael Chen', date: '2026-03-04', checkIn: '08:45 AM', checkOut: undefined, duration: '—', totalMinutes: 0, status: 'Active', department: 'Engineering' },
  { id: 'ts3', employeeId: 'e1', employeeName: 'Sarah Johnson', date: '2026-03-03', checkIn: '09:00 AM', checkOut: '05:30 PM', duration: '8h 30m', totalMinutes: 510, status: 'Completed', department: 'Product' },
  { id: 'ts4', employeeId: 'e2', employeeName: 'Michael Chen', date: '2026-03-03', checkIn: '08:30 AM', checkOut: '06:15 PM', duration: '9h 45m', totalMinutes: 585, status: 'Completed', department: 'Engineering' },
  { id: 'ts5', employeeId: 'e3', employeeName: 'Emily Rodriguez', date: '2026-03-03', checkIn: '09:15 AM', checkOut: '05:00 PM', duration: '7h 45m', totalMinutes: 465, status: 'Completed', department: 'Design' },
  { id: 'ts6', employeeId: 'e1', employeeName: 'Sarah Johnson', date: '2026-03-02', checkIn: '09:05 AM', checkOut: '05:35 PM', duration: '8h 30m', totalMinutes: 510, status: 'Completed', department: 'Product' },
  { id: 'ts7', employeeId: 'e4', employeeName: 'David Kim', date: '2026-03-03', checkIn: '09:30 AM', checkOut: '05:45 PM', duration: '8h 15m', totalMinutes: 495, status: 'Completed', department: 'Marketing' },
  { id: 'ts8', employeeId: 'e7', employeeName: 'Maria Garcia', date: '2026-03-03', checkIn: '08:55 AM', checkOut: '05:10 PM', duration: '8h 15m', totalMinutes: 495, status: 'Completed', department: 'Engineering' },
];

export const mockCorrections: TimeCorrection[] = [
  { id: 'tc1', employeeId: 'e3', employeeName: 'Emily Rodriguez', sessionId: 'ts5', date: '2026-03-03', originalCheckIn: '09:15 AM', originalCheckOut: '05:00 PM', correctedCheckIn: '08:55 AM', correctedCheckOut: '05:00 PM', reason: 'Badge scanner was broken, arrived at 8:55', status: 'Pending', submittedAt: '2026-03-03T17:30:00Z' },
  { id: 'tc2', employeeId: 'e4', employeeName: 'David Kim', sessionId: 'ts7', date: '2026-03-03', originalCheckIn: '09:30 AM', originalCheckOut: '05:45 PM', correctedCheckIn: '09:00 AM', correctedCheckOut: '05:45 PM', reason: 'Was in a client meeting, forgot to clock in', status: 'Pending', submittedAt: '2026-03-03T18:00:00Z' },
  { id: 'tc3', employeeId: 'e8', employeeName: 'Robert Taylor', sessionId: 'ts8', date: '2026-02-28', originalCheckIn: '09:00 AM', originalCheckOut: '04:00 PM', correctedCheckIn: '09:00 AM', correctedCheckOut: '06:30 PM', reason: 'System logged me out early due to VPN disconnect', status: 'Approved', reviewedBy: 'Michael Chen', reviewedAt: '2026-03-01T09:00:00Z', submittedAt: '2026-02-28T18:00:00Z' },
];

export const mockLeaveRequests: LeaveRequest[] = [
  { id: 'lr1', employeeId: 'e1', employeeName: 'Sarah Johnson', department: 'Product', type: 'Vacation', startDate: '2026-03-15', endDate: '2026-03-19', days: 5, reason: 'Family vacation', status: 'Approved', approvedBy: 'Michael Chen', approvedAt: '2026-02-20T10:00:00Z', submittedAt: '2026-02-18T09:00:00Z' },
  { id: 'lr2', employeeId: 'e3', employeeName: 'Emily Rodriguez', department: 'Design', type: 'Sick Leave', startDate: '2026-03-10', endDate: '2026-03-10', days: 1, reason: 'Doctor appointment', status: 'Approved', approvedBy: 'Sarah Johnson', approvedAt: '2026-03-05T14:00:00Z', submittedAt: '2026-03-05T08:00:00Z' },
  { id: 'lr3', employeeId: 'e4', employeeName: 'David Kim', department: 'Marketing', type: 'Personal', startDate: '2026-03-20', endDate: '2026-03-21', days: 2, reason: 'Personal matters', status: 'Pending', submittedAt: '2026-03-02T11:00:00Z' },
  { id: 'lr4', employeeId: 'e7', employeeName: 'Maria Garcia', department: 'Engineering', type: 'Vacation', startDate: '2026-04-01', endDate: '2026-04-10', days: 8, reason: 'Spring break travel', status: 'Pending', submittedAt: '2026-03-01T10:00:00Z' },
  { id: 'lr5', employeeId: 'e9', employeeName: 'Anna Park', department: 'Engineering', type: 'Sick Leave', startDate: '2026-02-25', endDate: '2026-02-26', days: 2, reason: 'Flu recovery', status: 'Approved', approvedBy: 'Michael Chen', approvedAt: '2026-02-25T08:30:00Z', submittedAt: '2026-02-25T07:00:00Z' },
];

export const mockLeaveBalances: LeaveBalance[] = [
  { employeeId: 'e1', type: 'Vacation', total: 20, used: 7, pending: 5, remaining: 8 },
  { employeeId: 'e1', type: 'Sick Leave', total: 10, used: 2, pending: 0, remaining: 8 },
  { employeeId: 'e1', type: 'Personal', total: 5, used: 1, pending: 0, remaining: 4 },
];

export const mockWorkdayRules: WorkdayRule[] = [
  { id: 'wr1', name: 'Standard Office Hours', startTime: '09:00', endTime: '17:00', gracePeriodMinutes: 15, workingDays: [1, 2, 3, 4, 5], timezone: 'America/New_York', appliesTo: ['all'], isDefault: true },
  { id: 'wr2', name: 'Engineering Flex', startTime: '08:00', endTime: '18:00', gracePeriodMinutes: 30, workingDays: [1, 2, 3, 4, 5], timezone: 'America/New_York', appliesTo: ['d1'], isDefault: false },
];

export const mockBreakRules: BreakRule[] = [
  { id: 'br1', name: 'Standard Breaks', maxBreaks: 3, maxBreakDuration: 30, maxTotalBreakTime: 60, paidBreak: true, appliesTo: ['all'], isDefault: true },
  { id: 'br2', name: 'Extended Lunch', maxBreaks: 2, maxBreakDuration: 60, maxTotalBreakTime: 75, paidBreak: false, appliesTo: ['d5'], isDefault: false },
];

export const mockFines: Fine[] = [
  { id: 'f1', employeeId: 'e4', employeeName: 'David Kim', department: 'Marketing', type: 'Late Arrival', amount: 25, currency: 'USD', date: '2026-03-03', description: 'Arrived 30 minutes late without prior notice', status: 'Active', issuedBy: 'System', issuedAt: '2026-03-03T09:30:00Z' },
  { id: 'f2', employeeId: 'e7', employeeName: 'Maria Garcia', department: 'Engineering', type: 'Early Departure', amount: 15, currency: 'USD', date: '2026-02-28', description: 'Left 45 minutes early without approval', status: 'Paid', issuedBy: 'System', issuedAt: '2026-02-28T16:15:00Z', paidAt: '2026-03-01T10:00:00Z' },
  { id: 'f3', employeeId: 'e9', employeeName: 'Anna Park', department: 'Engineering', type: 'Break Violation', amount: 10, currency: 'USD', date: '2026-03-01', description: 'Exceeded maximum break duration by 20 minutes', status: 'Disputed', issuedBy: 'System', issuedAt: '2026-03-01T14:00:00Z' },
  { id: 'f4', employeeId: 'e1', employeeName: 'Sarah Johnson', department: 'Product', type: 'Late Arrival', amount: 25, currency: 'USD', date: '2026-02-15', description: 'Arrived 20 minutes late', status: 'Waived', issuedBy: 'System', issuedAt: '2026-02-15T09:20:00Z', waivedBy: 'Michael Chen', waivedReason: 'Train delay - valid excuse provided' },
];

// ══════════════════════════════════════════════════════════════════════
// COMMUNICATION
// ═══════════════════════════════════════════════════════════════════════

export const mockChannels: Channel[] = [
  { id: 'ch1', name: 'general', description: 'General company announcements', type: 'public', createdBy: 'e2', memberCount: 67, members: ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'e10'], lastMessage: 'Welcome to the new quarter!', lastMessageAt: '2026-03-04T08:00:00Z', unreadCount: 3, pinned: true, archived: false, createdAt: '2022-01-01' },
  { id: 'ch2', name: 'engineering', description: 'Engineering team discussions', type: 'public', createdBy: 'e2', memberCount: 45, members: ['e2', 'e7', 'e8', 'e9'], lastMessage: 'Sprint review at 3pm', lastMessageAt: '2026-03-04T10:30:00Z', unreadCount: 7, pinned: true, archived: false, createdAt: '2022-01-01' },
  { id: 'ch3', name: 'design', description: 'Design team channel', type: 'public', createdBy: 'e3', memberCount: 8, members: ['e1', 'e3'], lastMessage: 'New mockups uploaded', lastMessageAt: '2026-03-03T16:00:00Z', unreadCount: 0, pinned: false, archived: false, createdAt: '2022-06-01' },
  { id: 'ch4', name: 'random', description: 'Off-topic conversations', type: 'public', createdBy: 'e2', memberCount: 67, members: ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'e10'], lastMessage: 'Anyone tried the new coffee machine?', lastMessageAt: '2026-03-04T09:15:00Z', unreadCount: 12, pinned: false, archived: false, createdAt: '2022-01-01' },
  { id: 'ch5', name: 'leadership', description: 'Leadership team private channel', type: 'private', createdBy: 'e2', memberCount: 5, members: ['e1', 'e2', 'e5', 'e6', 'e10'], lastMessage: 'Q1 budget review tomorrow', lastMessageAt: '2026-03-03T17:00:00Z', unreadCount: 2, pinned: true, archived: false, createdAt: '2022-03-01' },
];

export const mockMessages: Message[] = [
  { id: 'm1', channelId: 'ch1', senderId: 'e2', senderName: 'Michael Chen', content: 'Welcome to the new quarter! Let\'s make Q1 2026 amazing.', timestamp: '2026-03-04T08:00:00Z', status: 'read', edited: false, pinned: true, reactions: { '🎉': ['e1', 'e3', 'e5'], '💪': ['e4', 'e6'] } },
  { id: 'm2', channelId: 'ch1', senderId: 'e1', senderName: 'Sarah Johnson', content: 'Excited for the new product roadmap!', timestamp: '2026-03-04T08:05:00Z', status: 'read', edited: false, pinned: false, reactions: { '🙌': ['e2'] } },
  { id: 'm3', channelId: 'ch2', senderId: 'e8', senderName: 'Robert Taylor', content: 'Sprint review at 3pm today. Please prepare your demos.', timestamp: '2026-03-04T10:30:00Z', status: 'delivered', edited: false, pinned: false, mentions: ['e7', 'e9'] },
  { id: 'm4', channelId: 'ch2', senderId: 'e9', senderName: 'Anna Park', content: 'Will do! My PR for the auth module is ready.', timestamp: '2026-03-04T10:35:00Z', status: 'sent', edited: false, pinned: false },
  { id: 'm5', channelId: 'ch4', senderId: 'e4', senderName: 'David Kim', content: 'Anyone tried the new coffee machine? It\'s incredible!', timestamp: '2026-03-04T09:15:00Z', status: 'read', edited: false, pinned: false, reactions: { '☕': ['e1', 'e3', 'e5', 'e7'] } },
];

// ═══════════════════════════════════════════════════════════════════════
// ANALYTICS
// ═══════════════════════════════════════════════════════════════════════

export const mockActivityLog: ActivityLogEntry[] = [
  { id: 'al1', userId: 'e1', userName: 'Sarah Johnson', action: 'Completed task', target: 'Design review for homepage', targetType: 'task', timestamp: '2026-03-04T10:30:00Z' },
  { id: 'al2', userId: 'e2', userName: 'Michael Chen', action: 'Approved leave request', target: 'Sarah Johnson - Vacation', targetType: 'leave', timestamp: '2026-03-04T10:15:00Z' },
  { id: 'al3', userId: 'e8', userName: 'Robert Taylor', action: 'Deployed to production', target: 'v2.4.1 hotfix', targetType: 'system', timestamp: '2026-03-04T09:45:00Z' },
  { id: 'al4', userId: 'e3', userName: 'Emily Rodriguez', action: 'Updated project', target: 'Website Redesign', targetType: 'project', timestamp: '2026-03-04T09:30:00Z' },
  { id: 'al5', userId: 'e10', userName: 'Tom Bradley', action: 'Created invoice', target: 'INV-2026-0312', targetType: 'finance', timestamp: '2026-03-04T09:00:00Z' },
  { id: 'al6', userId: 'e5', userName: 'Lisa Anderson', action: 'Onboarded new employee', target: 'Chris Lee', targetType: 'employee', timestamp: '2026-03-03T16:00:00Z' },
  { id: 'al7', userId: 'e6', userName: 'James Wilson', action: 'Closed deal', target: 'Enterprise contract - DataCo', targetType: 'finance', timestamp: '2026-03-03T15:30:00Z' },
  { id: 'al8', userId: 'e9', userName: 'Anna Park', action: 'Created pull request', target: 'Auth module refactor', targetType: 'task', timestamp: '2026-03-03T14:00:00Z' },
];

export const mockProductivityMetrics: ProductivityMetric[] = [
  { employeeId: 'e1', employeeName: 'Sarah Johnson', department: 'Product', date: '2026-03-03', activeHours: 7.5, idleMinutes: 35, tasksCompleted: 4, screenshotsCount: 12, productivityScore: 88 },
  { employeeId: 'e2', employeeName: 'Michael Chen', department: 'Engineering', date: '2026-03-03', activeHours: 8.2, idleMinutes: 20, tasksCompleted: 6, screenshotsCount: 15, productivityScore: 94 },
  { employeeId: 'e3', employeeName: 'Emily Rodriguez', department: 'Design', date: '2026-03-03', activeHours: 7.0, idleMinutes: 45, tasksCompleted: 3, screenshotsCount: 10, productivityScore: 82 },
  { employeeId: 'e4', employeeName: 'David Kim', department: 'Marketing', date: '2026-03-03', activeHours: 6.5, idleMinutes: 60, tasksCompleted: 5, screenshotsCount: 8, productivityScore: 75 },
  { employeeId: 'e8', employeeName: 'Robert Taylor', department: 'Engineering', date: '2026-03-03', activeHours: 8.5, idleMinutes: 15, tasksCompleted: 8, screenshotsCount: 18, productivityScore: 96 },
  { employeeId: 'e9', employeeName: 'Anna Park', department: 'Engineering', date: '2026-03-03', activeHours: 7.8, idleMinutes: 25, tasksCompleted: 5, screenshotsCount: 14, productivityScore: 90 },
];

// ═══════════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════

export const mockNotifications: Notification[] = [
  { id: 'n1', userId: 'e1', type: 'action_required', title: 'Leave Request Approved', message: 'Your vacation request for Mar 15-19 has been approved.', read: false, actionUrl: '/employee/leave', createdAt: '2026-03-04T10:00:00Z' },
  { id: 'n2', userId: 'e1', type: 'info', title: 'New Task Assigned', message: 'You have been assigned "Design review for homepage"', read: false, actionUrl: '/work/tasks', createdAt: '2026-03-04T09:00:00Z' },
  { id: 'n3', userId: 'e1', type: 'warning', title: 'Sprint Ending Soon', message: 'Sprint 4 ends in 2 days. 3 tasks remaining.', read: false, actionUrl: '/work/my-work', createdAt: '2026-03-03T17:00:00Z' },
  { id: 'n4', userId: 'e1', type: 'success', title: 'Task Completed', message: '"API integration testing" has been marked complete.', read: true, actionUrl: '/work/tasks', createdAt: '2026-03-03T14:00:00Z' },
  { id: 'n5', userId: 'e1', type: 'info', title: 'Team Meeting', message: 'Daily standup in 15 minutes.', read: true, createdAt: '2026-03-03T09:45:00Z' },
];

// ═══════════════════════════════════════════════════════════════════════
// FINANCE — PAYROLL RUNS & PAYSLIPS (Phase 8)
// ═══════════════════════════════════════════════════════════════════════

export const mockPayrollRuns: PayrollRun[] = [
  {
    id: 'pr1', month: '2026-03', period: 'March 2026',
    employeeCount: 67, totalGross: 548200, totalDeductions: 126086, totalNet: 422114,
    currency: 'USD', status: 'Draft', payslipIds: ['ps1', 'ps2', 'ps3', 'ps4', 'ps5'],
  },
  {
    id: 'pr2', month: '2026-02', period: 'February 2026',
    employeeCount: 65, totalGross: 531800, totalDeductions: 122314, totalNet: 409486,
    currency: 'USD', status: 'Processed',
    processedAt: '2026-02-28T18:00:00Z', processedBy: 'Alex Rivera',
    payslipIds: ['ps6', 'ps7', 'ps8', 'ps9', 'ps10'],
  },
  {
    id: 'pr3', month: '2026-01', period: 'January 2026',
    employeeCount: 64, totalGross: 524600, totalDeductions: 120658, totalNet: 403942,
    currency: 'USD', status: 'Processed',
    processedAt: '2026-01-31T17:30:00Z', processedBy: 'Alex Rivera',
    payslipIds: ['ps11', 'ps12'],
  },
  {
    id: 'pr4', month: '2025-12', period: 'December 2025',
    employeeCount: 63, totalGross: 538000, totalDeductions: 123740, totalNet: 414260,
    currency: 'USD', status: 'Processed',
    processedAt: '2025-12-31T17:00:00Z', processedBy: 'Alex Rivera',
    payslipIds: [],
  },
];

const STANDARD_BREAKDOWN = [
  { label: 'Base Salary', amount: 0, type: 'addition' as const },
  { label: 'Performance Bonus', amount: 0, type: 'addition' as const },
  { label: 'Federal Tax (22%)', amount: 0, type: 'deduction' as const },
  { label: 'State Tax (5%)', amount: 0, type: 'deduction' as const },
  { label: 'Health Insurance', amount: 420, type: 'deduction' as const },
  { label: '401(k) Contribution', amount: 0, type: 'deduction' as const },
  { label: 'Social Security (6.2%)', amount: 0, type: 'deduction' as const },
];

export const mockPayslips: Payslip[] = [
  {
    id: 'ps1', employeeId: 'e1', employeeName: 'Sarah Johnson', department: 'Product',
    period: 'March 2026', month: '2026-03', payrollRunId: 'pr1',
    grossSalary: 9166.67, baseSalary: 8666.67, bonus: 500,
    deductions: 2108.33, netPay: 7058.34, currency: 'USD', status: 'Pending',
    breakdown: [
      { label: 'Base Salary', amount: 8666.67, type: 'addition' },
      { label: 'Performance Bonus', amount: 500, type: 'addition' },
      { label: 'Federal Tax (22%)', amount: 2016.67, type: 'deduction' },
      { label: 'Health Insurance', amount: 420, type: 'deduction' },
      { label: '401(k) 5%', amount: 458.33, type: 'deduction' },
      { label: 'State Tax (5%)', amount: 433.33, type: 'deduction' },
    ],
  },
  {
    id: 'ps2', employeeId: 'e2', employeeName: 'Michael Chen', department: 'Engineering',
    period: 'March 2026', month: '2026-03', payrollRunId: 'pr1',
    grossSalary: 15833.33, baseSalary: 14833.33, bonus: 1000,
    deductions: 3641.67, netPay: 12191.66, currency: 'USD', status: 'Pending',
    breakdown: [
      { label: 'Base Salary', amount: 14833.33, type: 'addition' },
      { label: 'Performance Bonus', amount: 1000, type: 'addition' },
      { label: 'Federal Tax (22%)', amount: 3483.33, type: 'deduction' },
      { label: 'Health Insurance', amount: 420, type: 'deduction' },
      { label: '401(k) 5%', amount: 791.67, type: 'deduction' },
      { label: 'State Tax (5%)', amount: 791.67, type: 'deduction' },
    ],
  },
  {
    id: 'ps3', employeeId: 'e3', employeeName: 'Emily Rodriguez', department: 'Design',
    period: 'March 2026', month: '2026-03', payrollRunId: 'pr1',
    grossSalary: 7916.67, baseSalary: 7416.67, bonus: 500,
    deductions: 1820.83, netPay: 6095.84, currency: 'USD', status: 'Pending',
    breakdown: [
      { label: 'Base Salary', amount: 7416.67, type: 'addition' },
      { label: 'Performance Bonus', amount: 500, type: 'addition' },
      { label: 'Federal Tax (22%)', amount: 1741.67, type: 'deduction' },
      { label: 'Health Insurance', amount: 420, type: 'deduction' },
      { label: '401(k) 5%', amount: 395.83, type: 'deduction' },
      { label: 'State Tax (5%)', amount: 395.83, type: 'deduction' },
    ],
  },
  {
    id: 'ps4', employeeId: 'e4', employeeName: 'David Kim', department: 'Marketing',
    period: 'March 2026', month: '2026-03', payrollRunId: 'pr1',
    grossSalary: 8750, baseSalary: 8250, bonus: 500,
    deductions: 2012.5, netPay: 6737.5, currency: 'USD', status: 'Pending',
    breakdown: [
      { label: 'Base Salary', amount: 8250, type: 'addition' },
      { label: 'Performance Bonus', amount: 500, type: 'addition' },
      { label: 'Federal Tax (22%)', amount: 1925, type: 'deduction' },
      { label: 'Health Insurance', amount: 420, type: 'deduction' },
      { label: '401(k) 5%', amount: 437.5, type: 'deduction' },
      { label: 'State Tax (5%)', amount: 437.5, type: 'deduction' },
    ],
  },
  {
    id: 'ps5', employeeId: 'e5', employeeName: 'Lisa Anderson', department: 'HR',
    period: 'March 2026', month: '2026-03', payrollRunId: 'pr1',
    grossSalary: 8333.33, baseSalary: 8333.33, bonus: 0,
    deductions: 1916.67, netPay: 6416.66, currency: 'USD', status: 'Pending',
    breakdown: [
      { label: 'Base Salary', amount: 8333.33, type: 'addition' },
      { label: 'Federal Tax (22%)', amount: 1833.33, type: 'deduction' },
      { label: 'Health Insurance', amount: 420, type: 'deduction' },
      { label: '401(k) 5%', amount: 416.67, type: 'deduction' },
      { label: 'State Tax (5%)', amount: 416.67, type: 'deduction' },
    ],
  },
  // February payslips (already processed)
  {
    id: 'ps6', employeeId: 'e1', employeeName: 'Sarah Johnson', department: 'Product',
    period: 'February 2026', month: '2026-02', payrollRunId: 'pr2',
    grossSalary: 8666.67, baseSalary: 8666.67, bonus: 0,
    deductions: 1993.33, netPay: 6673.34, currency: 'USD', status: 'Processed',
    paymentDate: '2026-02-28', pdfUrl: '/payslips/ps6.pdf',
    breakdown: [
      { label: 'Base Salary', amount: 8666.67, type: 'addition' },
      { label: 'Federal Tax (22%)', amount: 1906.67, type: 'deduction' },
      { label: 'Health Insurance', amount: 420, type: 'deduction' },
      { label: '401(k) 5%', amount: 433.33, type: 'deduction' },
      { label: 'State Tax (5%)', amount: 433.33, type: 'deduction' },
    ],
  },
  {
    id: 'ps7', employeeId: 'e2', employeeName: 'Michael Chen', department: 'Engineering',
    period: 'February 2026', month: '2026-02', payrollRunId: 'pr2',
    grossSalary: 14833.33, baseSalary: 14833.33, bonus: 0,
    deductions: 3391.67, netPay: 11441.66, currency: 'USD', status: 'Processed',
    paymentDate: '2026-02-28', pdfUrl: '/payslips/ps7.pdf',
    breakdown: [
      { label: 'Base Salary', amount: 14833.33, type: 'addition' },
      { label: 'Federal Tax (22%)', amount: 3263.33, type: 'deduction' },
      { label: 'Health Insurance', amount: 420, type: 'deduction' },
      { label: '401(k) 5%', amount: 741.67, type: 'deduction' },
      { label: 'State Tax (5%)', amount: 741.67, type: 'deduction' },
    ],
  },
  {
    id: 'ps8', employeeId: 'e3', employeeName: 'Emily Rodriguez', department: 'Design',
    period: 'February 2026', month: '2026-02', payrollRunId: 'pr2',
    grossSalary: 7416.67, baseSalary: 7416.67, bonus: 0,
    deductions: 1703.83, netPay: 5712.84, currency: 'USD', status: 'Processed',
    paymentDate: '2026-02-28', pdfUrl: '/payslips/ps8.pdf',
    breakdown: [
      { label: 'Base Salary', amount: 7416.67, type: 'addition' },
      { label: 'Federal Tax (22%)', amount: 1631.67, type: 'deduction' },
      { label: 'Health Insurance', amount: 420, type: 'deduction' },
      { label: '401(k) 5%', amount: 370.83, type: 'deduction' },
      { label: 'State Tax (5%)', amount: 370.83, type: 'deduction' },
    ],
  },
  {
    id: 'ps9', employeeId: 'e1', employeeName: 'Sarah Johnson', department: 'Product',
    period: 'January 2026', month: '2026-01', payrollRunId: 'pr3',
    grossSalary: 8666.67, baseSalary: 8666.67, bonus: 0,
    deductions: 1993.33, netPay: 6673.34, currency: 'USD', status: 'Processed',
    paymentDate: '2026-01-31', pdfUrl: '/payslips/ps9.pdf',
    breakdown: [
      { label: 'Base Salary', amount: 8666.67, type: 'addition' },
      { label: 'Federal Tax (22%)', amount: 1906.67, type: 'deduction' },
      { label: 'Health Insurance', amount: 420, type: 'deduction' },
      { label: '401(k) 5%', amount: 433.33, type: 'deduction' },
      { label: 'State Tax (5%)', amount: 433.33, type: 'deduction' },
    ],
  },
  {
    id: 'ps10', employeeId: 'e1', employeeName: 'Sarah Johnson', department: 'Product',
    period: 'December 2025', month: '2025-12', payrollRunId: 'pr4',
    grossSalary: 10166.67, baseSalary: 8666.67, bonus: 1500,
    deductions: 2338.33, netPay: 7828.34, currency: 'USD', status: 'Processed',
    paymentDate: '2025-12-31', pdfUrl: '/payslips/ps10.pdf',
    breakdown: [
      { label: 'Base Salary', amount: 8666.67, type: 'addition' },
      { label: 'Year-End Bonus', amount: 1500, type: 'addition' },
      { label: 'Federal Tax (22%)', amount: 2236.67, type: 'deduction' },
      { label: 'Health Insurance', amount: 420, type: 'deduction' },
      { label: '401(k) 5%', amount: 508.33, type: 'deduction' },
      { label: 'State Tax (5%)', amount: 508.33, type: 'deduction' },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════
// FINANCE — BILLING INVOICES (Phase 8)
// ═══════════════════════════════════════════════════════════════════════

export const mockBillingInvoices: BillingInvoice[] = [
  {
    id: 'bi1', invoiceNumber: 'INV-2026-03', organizationId: 'org1', clientName: 'TechCorp Solutions',
    period: 'March 2026', date: '2026-03-01', issueDate: '2026-03-01', dueDate: '2026-03-31',
    seats: 67, pricePerSeat: 35, subtotal: 2345, tax: 187.60, total: 2532.60, amount: 2532.60,
    currency: 'USD', status: 'Pending', plan: 'Professional',
  },
  {
    id: 'bi2', invoiceNumber: 'INV-2026-02', organizationId: 'org1', clientName: 'TechCorp Solutions',
    period: 'February 2026', date: '2026-02-01', issueDate: '2026-02-01', dueDate: '2026-02-28',
    seats: 65, pricePerSeat: 35, subtotal: 2275, tax: 182, total: 2457, amount: 2457,
    currency: 'USD', status: 'Paid', plan: 'Professional',
    paidAt: '2026-02-10T14:00:00Z', downloadUrl: '/invoices/bi2.pdf',
  },
  {
    id: 'bi3', invoiceNumber: 'INV-2026-01', organizationId: 'org1', clientName: 'TechCorp Solutions',
    period: 'January 2026', date: '2026-01-01', issueDate: '2026-01-01', dueDate: '2026-01-31',
    seats: 64, pricePerSeat: 35, subtotal: 2240, tax: 179.20, total: 2419.20, amount: 2419.20,
    currency: 'USD', status: 'Paid', plan: 'Professional',
    paidAt: '2026-01-08T11:00:00Z', downloadUrl: '/invoices/bi3.pdf',
  },
  {
    id: 'bi4', invoiceNumber: 'INV-2025-12', organizationId: 'org1', clientName: 'TechCorp Solutions',
    period: 'December 2025', date: '2025-12-01', issueDate: '2025-12-01', dueDate: '2025-12-31',
    seats: 63, pricePerSeat: 35, subtotal: 2205, tax: 176.40, total: 2381.40, amount: 2381.40,
    currency: 'USD', status: 'Paid', plan: 'Professional',
    paidAt: '2025-12-07T10:00:00Z', downloadUrl: '/invoices/bi4.pdf',
  },
  {
    id: 'bi5', invoiceNumber: 'INV-2025-11', organizationId: 'org1', clientName: 'TechCorp Solutions',
    period: 'November 2025', date: '2025-11-01', issueDate: '2025-11-01', dueDate: '2025-11-30',
    seats: 60, pricePerSeat: 35, subtotal: 2100, tax: 168, total: 2268, amount: 2268,
    currency: 'USD', status: 'Paid', plan: 'Professional',
    paidAt: '2025-11-05T09:00:00Z', downloadUrl: '/invoices/bi5.pdf',
  },
  {
    id: 'bi6', invoiceNumber: 'INV-2025-10', organizationId: 'org1', clientName: 'TechCorp Solutions',
    period: 'October 2025', date: '2025-10-01', issueDate: '2025-10-01', dueDate: '2025-10-31',
    seats: 58, pricePerSeat: 35, subtotal: 2030, tax: 162.40, total: 2192.40, amount: 2192.40,
    currency: 'USD', status: 'Paid', plan: 'Professional',
    paidAt: '2025-10-06T08:00:00Z', downloadUrl: '/invoices/bi6.pdf',
  },
];

// ═══════════════════════════════════════════════════════════════════════
// FINANCE — OFFLINE SYNC RECORDS (Phase 8)
// ═══════════════════════════════════════════════════════════════════════

export const mockOfflineSyncRecords: OfflineSyncRecord[] = [
  {
    id: 'osr1', employeeId: 'e4', employeeName: 'David Kim', department: 'Marketing',
    recordType: 'Time Log', recordCount: 3, lastSyncAttempt: '2026-03-04T08:30:00Z',
    status: 'Pending', deviceId: 'dev-001', deviceName: 'MacBook Pro (David)',
  },
  {
    id: 'osr2', employeeId: 'e9', employeeName: 'Anna Park', department: 'Engineering',
    recordType: 'Activity Data', recordCount: 12, lastSyncAttempt: '2026-03-04T09:15:00Z',
    status: 'In Progress', deviceId: 'dev-009', deviceName: 'ThinkPad (Anna)',
  },
  {
    id: 'osr3', employeeId: 'e7', employeeName: 'Maria Garcia', department: 'Engineering',
    recordType: 'Screenshots', recordCount: 8, lastSyncAttempt: '2026-03-03T17:45:00Z',
    status: 'Completed', deviceId: 'dev-007', deviceName: 'iMac (Maria)',
  },
  {
    id: 'osr4', employeeId: 'e3', employeeName: 'Emily Rodriguez', department: 'Design',
    recordType: 'Time Log', recordCount: 2, lastSyncAttempt: '2026-03-03T18:00:00Z',
    status: 'Completed', deviceId: 'dev-003', deviceName: 'MacBook Air (Emily)',
  },
  {
    id: 'osr5', employeeId: 'e6', employeeName: 'James Wilson', department: 'Sales',
    recordType: 'Task Updates', recordCount: 15, lastSyncAttempt: '2026-03-04T07:00:00Z',
    status: 'Failed', deviceId: 'dev-006', deviceName: 'Surface (James)',
    errorMessage: 'Network timeout — retrying automatically',
  },
  {
    id: 'osr6', employeeId: 'e8', employeeName: 'Robert Taylor', department: 'Engineering',
    recordType: 'Activity Data', recordCount: 6, lastSyncAttempt: '2026-03-04T10:00:00Z',
    status: 'Pending', deviceId: 'dev-008', deviceName: 'MacBook Pro (Robert)',
  },
];

// ═══════════════════════════════════════════════════════════════════════
// ANALYTICS — SCREENSHOT RECORDS (Phase 8)
// ═══════════════════════════════════════════════════════════════════════

export const mockScreenshots: ScreenshotRecord[] = [
  {
    id: 'ss1', employeeId: 'e1', employeeName: 'Sarah Johnson', department: 'Product',
    timestamp: '2026-03-04T14:30:00Z', activity: 'Figma — Product Roadmap',
    blurLevel: 'None', status: 'Reviewed', sessionId: 'ts1', reviewedBy: 'Alex Rivera',
    reviewedAt: '2026-03-04T15:00:00Z',
  },
  {
    id: 'ss2', employeeId: 'e2', employeeName: 'Michael Chen', department: 'Engineering',
    timestamp: '2026-03-04T14:15:00Z', activity: 'VS Code — auth-module.ts',
    blurLevel: 'Low', status: 'Pending', sessionId: 'ts2',
  },
  {
    id: 'ss3', employeeId: 'e3', employeeName: 'Emily Rodriguez', department: 'Design',
    timestamp: '2026-03-04T14:00:00Z', activity: 'Figma — UI Components',
    blurLevel: 'None', status: 'Reviewed', sessionId: 'ts5', reviewedBy: 'Alex Rivera',
    reviewedAt: '2026-03-04T14:45:00Z',
  },
  {
    id: 'ss4', employeeId: 'e4', employeeName: 'David Kim', department: 'Marketing',
    timestamp: '2026-03-04T13:45:00Z', activity: 'YouTube — Marketing Conference',
    blurLevel: 'Low', status: 'Flagged', sessionId: 'ts7',
    flagReason: 'Non-work content detected — YouTube during work hours',
  },
  {
    id: 'ss5', employeeId: 'e8', employeeName: 'Robert Taylor', department: 'Engineering',
    timestamp: '2026-03-04T13:30:00Z', activity: 'AWS Console — EC2 Dashboard',
    blurLevel: 'Medium', status: 'Pending',
  },
  {
    id: 'ss6', employeeId: 'e9', employeeName: 'Anna Park', department: 'Engineering',
    timestamp: '2026-03-04T13:15:00Z', activity: 'GitHub — Pull Request Review',
    blurLevel: 'None', status: 'Reviewed', reviewedBy: 'Alex Rivera',
    reviewedAt: '2026-03-04T14:00:00Z',
  },
  {
    id: 'ss7', employeeId: 'e5', employeeName: 'Lisa Anderson', department: 'HR',
    timestamp: '2026-03-04T13:00:00Z', activity: 'WorkOS Admin — Employee Records',
    blurLevel: 'High', status: 'Pending',
  },
  {
    id: 'ss8', employeeId: 'e7', employeeName: 'Maria Garcia', department: 'Engineering',
    timestamp: '2026-03-04T12:45:00Z', activity: 'Chrome — Cypress Documentation',
    blurLevel: 'Low', status: 'Reviewed', reviewedBy: 'Alex Rivera',
    reviewedAt: '2026-03-04T13:30:00Z',
  },
];

// ═══════════════════════════════════════════════════════════════════════
// FINANCE EXTENDED — TRANSACTIONS (Phase 13)
// ═══════════════════════════════════════════════════════════════════════

export const mockTransactions: FinanceTransaction[] = [
  {
    id: 'txn1', type: 'income', category: 'Client Revenue', description: 'Acme Corp — Q1 Contract Payment',
    amount: 48500, currency: 'USD', date: '2026-03-01', accountId: 'acc1', accountName: 'Main Operating',
    reference: 'INV-2026-031', status: 'Posted', createdBy: 'Tom Bradley', departmentId: 'd7', departmentName: 'Finance',
    tags: ['client', 'q1'],
  },
  {
    id: 'txn2', type: 'expense', category: 'Salaries', description: 'February 2026 Payroll Disbursement',
    amount: 312450, currency: 'USD', date: '2026-02-28', accountId: 'acc1', accountName: 'Main Operating',
    reference: 'PAY-2026-02', status: 'Posted', createdBy: 'Tom Bradley', departmentId: 'd7', departmentName: 'Finance',
    tags: ['payroll', 'recurring'],
  },
  {
    id: 'txn3', type: 'expense', category: 'Cloud Infrastructure', description: 'AWS — February Usage Invoice',
    amount: 8240, currency: 'USD', date: '2026-02-28', accountId: 'acc1', accountName: 'Main Operating',
    reference: 'AWS-FEB-2026', status: 'Posted', createdBy: 'Robert Taylor', departmentId: 'd1', departmentName: 'Engineering',
    tags: ['aws', 'infrastructure'],
  },
  {
    id: 'txn4', type: 'income', category: 'Client Revenue', description: 'TechStart Inc — Monthly SaaS Subscription',
    amount: 12600, currency: 'USD', date: '2026-03-01', accountId: 'acc1', accountName: 'Main Operating',
    reference: 'SUB-TS-MAR-26', status: 'Posted', createdBy: 'Tom Bradley', departmentId: 'd5', departmentName: 'Sales',
    tags: ['subscription', 'saas'],
  },
  {
    id: 'txn5', type: 'expense', category: 'Marketing', description: 'LinkedIn Ads — Q1 Campaign',
    amount: 3200, currency: 'USD', date: '2026-03-02', accountId: 'acc2', accountName: 'Marketing Wallet',
    reference: 'MKT-Q1-001', status: 'Posted', createdBy: 'David Kim', departmentId: 'd4', departmentName: 'Marketing',
    tags: ['ads', 'linkedin'],
  },
  {
    id: 'txn6', type: 'transfer', category: 'Internal Transfer', description: 'Petty Cash Replenishment — Office',
    amount: 1500, currency: 'USD', date: '2026-03-03', accountId: 'acc1', accountName: 'Main Operating',
    reference: 'TRF-PC-001', status: 'Posted', createdBy: 'Tom Bradley',
    tags: ['internal'],
  },
  {
    id: 'txn7', type: 'expense', category: 'Software Licenses', description: 'Figma Enterprise — Annual Renewal',
    amount: 4800, currency: 'USD', date: '2026-03-04', accountId: 'acc1', accountName: 'Main Operating',
    reference: 'LIC-FIGMA-2026', status: 'Pending', createdBy: 'Emily Rodriguez', departmentId: 'd3', departmentName: 'Design',
    tags: ['saas', 'design'],
  },
  {
    id: 'txn8', type: 'reimbursement', category: 'Travel', description: 'Sales Team — NYC Client Visit Expenses',
    amount: 2140, currency: 'USD', date: '2026-03-04', accountId: 'acc1', accountName: 'Main Operating',
    reference: 'RMB-NYC-001', status: 'Processing', createdBy: 'James Wilson', departmentId: 'd5', departmentName: 'Sales',
    tags: ['travel', 'reimbursement'],
  },
  {
    id: 'txn9', type: 'income', category: 'Interest Income', description: 'Savings Account — Monthly Interest',
    amount: 425, currency: 'USD', date: '2026-03-01', accountId: 'acc3', accountName: 'Business Savings',
    reference: 'INT-MAR-2026', status: 'Posted', createdBy: 'Tom Bradley',
    tags: ['interest', 'passive'],
  },
  {
    id: 'txn10', type: 'adjustment', category: 'Correction', description: 'Q4 Audit Adjustment — Depreciation',
    amount: 1200, currency: 'USD', date: '2026-03-02', accountId: 'acc1', accountName: 'Main Operating',
    reference: 'ADJ-Q4-2025', status: 'Posted', createdBy: 'Tom Bradley', departmentId: 'd7', departmentName: 'Finance',
    tags: ['audit', 'adjustment'],
  },
];

// ═══════════════════════════════════════════════════════════════════════
// FINANCE EXTENDED — ACCOUNTS / WALLETS (Phase 13)
// ═══════════════════════════════════════════════════════════════════════

export const mockFinanceAccounts: FinanceAccount[] = [
  {
    id: 'acc1', name: 'Main Operating Account', type: 'bank', balance: 842600, currency: 'USD',
    status: 'Active', lastTransactionAt: '2026-03-04T09:00:00Z',
    accountNumber: '****4782', bankName: 'Chase Business',
    notes: 'Primary operating account — all payroll and major vendor payments',
  },
  {
    id: 'acc2', name: 'Marketing Wallet', type: 'wallet', balance: 18400, currency: 'USD',
    status: 'Active', lastTransactionAt: '2026-03-02T14:30:00Z',
    accountNumber: 'MKT-WALLET-001', notes: 'Dedicated wallet for marketing spend — ads, events',
  },
  {
    id: 'acc3', name: 'Business Savings', type: 'savings', balance: 320000, currency: 'USD',
    status: 'Active', lastTransactionAt: '2026-03-01T09:00:00Z',
    accountNumber: '****9201', bankName: 'Chase Business',
    notes: 'Emergency fund — 3 month operating runway maintained',
  },
  {
    id: 'acc4', name: 'Corporate Card (Amex)', type: 'credit', balance: -14200, currency: 'USD',
    status: 'Active', lastTransactionAt: '2026-03-04T11:15:00Z',
    accountNumber: '****7730', bankName: 'American Express',
    notes: 'Executive team corporate cards — monthly statement due March 25',
  },
  {
    id: 'acc5', name: 'Petty Cash — HQ', type: 'petty_cash', balance: 1200, currency: 'USD',
    status: 'Active', lastTransactionAt: '2026-03-03T16:00:00Z',
    notes: 'Office petty cash — managed by Office Manager',
  },
];

// ═══════════════════════════════════════════════════════════════════════
// FINANCE EXTENDED — REIMBURSEMENTS (Phase 13)
// ═══════════════════════════════════════════════════════════════════════

export const mockReimbursements: Reimbursement[] = [
  {
    id: 'rmb1', employeeId: 'e6', employeeName: 'James Wilson', department: 'Sales',
    amount: 840, currency: 'USD', category: 'Travel', description: 'NYC Client Visit — flights + hotel',
    date: '2026-02-28', status: 'Approved', submittedAt: '2026-03-01T09:00:00Z',
    reviewedBy: 'Alex Rivera', reviewedAt: '2026-03-02T10:00:00Z',
    notes: 'Q1 enterprise prospect meeting',
  },
  {
    id: 'rmb2', employeeId: 'e1', employeeName: 'Sarah Johnson', department: 'Product',
    amount: 290, currency: 'USD', category: 'Conference', description: 'ProductCon 2026 — registration fee',
    date: '2026-03-01', status: 'Pending', submittedAt: '2026-03-02T14:00:00Z',
    notes: 'Annual product conference — pre-approved by manager',
  },
  {
    id: 'rmb3', employeeId: 'e3', employeeName: 'Emily Rodriguez', department: 'Design',
    amount: 150, currency: 'USD', category: 'Equipment', description: 'Wacom stylus pen — design work',
    date: '2026-02-25', status: 'Paid', submittedAt: '2026-02-26T11:00:00Z',
    reviewedBy: 'Alex Rivera', reviewedAt: '2026-02-27T09:00:00Z',
    paidAt: '2026-03-01T12:00:00Z',
  },
  {
    id: 'rmb4', employeeId: 'e4', employeeName: 'David Kim', department: 'Marketing',
    amount: 480, currency: 'USD', category: 'Marketing Events', description: 'SaaStr Annual — conference booth materials',
    date: '2026-02-20', status: 'Rejected', submittedAt: '2026-02-21T10:00:00Z',
    reviewedBy: 'Alex Rivera', reviewedAt: '2026-02-22T09:00:00Z',
    notes: 'Exceeds department budget cap for Q1 events — resubmit in Q2',
  },
  {
    id: 'rmb5', employeeId: 'e8', employeeName: 'Robert Taylor', department: 'Engineering',
    amount: 120, currency: 'USD', category: 'Training', description: 'AWS Certified Solutions Architect exam fee',
    date: '2026-03-03', status: 'Pending', submittedAt: '2026-03-04T08:30:00Z',
    notes: 'Part of Q1 engineering certification program',
  },
  {
    id: 'rmb6', employeeId: 'e2', employeeName: 'Michael Chen', department: 'Engineering',
    amount: 2300, currency: 'USD', category: 'Travel', description: 'San Francisco → NYC — Engineering offsite',
    date: '2026-02-15', status: 'Paid', submittedAt: '2026-02-16T09:00:00Z',
    reviewedBy: 'Alex Rivera', reviewedAt: '2026-02-17T11:00:00Z',
    paidAt: '2026-02-20T12:00:00Z',
  },
];

// ═══════════════════════════════════════════════════════════════════════
// FINANCE EXTENDED — LOANS & LIABILITIES (Phase 13)
// ═══════════════════════════════════════════════════════════════════════

export const mockLoans: LoanLiability[] = [
  {
    id: 'ln1', type: 'loan', creditor: 'Chase Business Banking',
    principalAmount: 500000, outstandingBalance: 312500, currency: 'USD',
    interestRate: 4.5, startDate: '2024-01-15', dueDate: '2029-01-15',
    status: 'Active', monthlyPayment: 9316,
    notes: 'Equipment financing — office infrastructure and servers',
  },
  {
    id: 'ln2', type: 'liability', creditor: 'Office Lease — 350 5th Ave',
    principalAmount: 180000, outstandingBalance: 135000, currency: 'USD',
    interestRate: 0, startDate: '2024-06-01', dueDate: '2027-05-31',
    status: 'Active', monthlyPayment: 15000,
    notes: '3-year commercial lease — 3 floors, HQ',
  },
  {
    id: 'ln3', type: 'advance', employeeId: 'e6', employeeName: 'James Wilson', creditor: 'Employee Advance',
    principalAmount: 5000, outstandingBalance: 2500, currency: 'USD',
    interestRate: 0, startDate: '2026-01-01', dueDate: '2026-06-30',
    status: 'Active', monthlyPayment: 500,
    notes: 'Personal advance — repayment via payroll deductions',
  },
  {
    id: 'ln4', type: 'loan', creditor: 'Silicon Valley Bank',
    principalAmount: 1200000, outstandingBalance: 0, currency: 'USD',
    interestRate: 6.2, startDate: '2022-03-01', dueDate: '2025-03-01',
    status: 'Paid', monthlyPayment: 0,
    notes: 'Series A bridge loan — fully repaid March 2025',
  },
];

// ═══════════════════════════════════════════════════════════════════════
// FINANCE EXTENDED — FINANCE INBOX (Phase 13)
// ═══════════════════════════════════════════════════════════════════════

export const mockFinanceInbox: FinanceInboxItem[] = [
  {
    id: 'fi1', type: 'approval_request', title: 'Payroll Run Approval — March 2026',
    description: 'March payroll run ready for final approval. 67 employees, total net: $312,450.',
    amount: 312450, currency: 'USD', submittedBy: 'Tom Bradley', submittedById: 'e10',
    submittedAt: '2026-03-04T09:00:00Z', priority: 'urgent', status: 'unread',
    actionUrl: '/finance/payroll', referenceId: 'pr1',
  },
  {
    id: 'fi2', type: 'expense_submission', title: 'Expense Report — Sarah Johnson',
    description: 'ProductCon 2026 conference registration ($290) awaiting approval.',
    amount: 290, currency: 'USD', submittedBy: 'Sarah Johnson', submittedById: 'e1',
    submittedAt: '2026-03-02T14:00:00Z', priority: 'medium', status: 'unread',
    referenceId: 'rmb2',
  },
  {
    id: 'fi3', type: 'payment_due', title: 'Invoice Due in 3 Days — Salesforce',
    description: 'Annual Salesforce CRM renewal invoice of $28,500 due March 7.',
    amount: 28500, currency: 'USD', submittedBy: 'System',
    submittedAt: '2026-03-04T08:00:00Z', priority: 'high', status: 'read',
  },
  {
    id: 'fi4', type: 'reimbursement_request', title: 'Reimbursement Request — Robert Taylor',
    description: 'AWS exam fee reimbursement ($120) pending your review.',
    amount: 120, currency: 'USD', submittedBy: 'Robert Taylor', submittedById: 'e8',
    submittedAt: '2026-03-04T08:30:00Z', priority: 'low', status: 'unread',
    referenceId: 'rmb5',
  },
  {
    id: 'fi5', type: 'alert', title: 'Marketing Budget at 85% Utilization',
    description: 'Marketing dept has spent $1.02M of the $1.2M annual budget. Q2 forecast shows overrun risk.',
    submittedBy: 'Finance Intelligence',
    submittedAt: '2026-03-03T16:00:00Z', priority: 'high', status: 'read',
  },
  {
    id: 'fi6', type: 'approval_request', title: 'New Vendor Contract — Vercel Pro',
    description: 'Engineering team requesting Vercel Pro plan ($2,400/yr). Requires finance approval.',
    amount: 2400, currency: 'USD', submittedBy: 'Robert Taylor', submittedById: 'e8',
    submittedAt: '2026-03-03T11:00:00Z', priority: 'medium', status: 'actioned',
    referenceId: 'txn7',
  },
  {
    id: 'fi7', type: 'payment_due', title: 'Monthly Loan Payment — Chase',
    description: 'Equipment loan monthly installment of $9,316 due March 15.',
    amount: 9316, currency: 'USD', submittedBy: 'System',
    submittedAt: '2026-03-04T07:00:00Z', priority: 'high', status: 'unread',
    referenceId: 'ln1',
  },
  {
    id: 'fi8', type: 'alert', title: 'Engineering Cost Center Approaching Limit',
    description: 'Engineering cost center has committed 92% of Q1 budget. New approvals paused.',
    submittedBy: 'Finance Intelligence',
    submittedAt: '2026-03-04T10:00:00Z', priority: 'urgent', status: 'unread',
  },
];

// ═══════════════════════════════════════════════════════════════════════
// FINANCE EXTENDED — COST CENTERS (Phase 13)
// ═══════════════════════════════════════════════════════════════════════

export const mockCostCenters: CostCenter[] = [
  {
    id: 'cc1', name: 'Engineering Q1 2026', departmentId: 'd1', departmentName: 'Engineering',
    budget: 620000, spent: 488000, committed: 82000, currency: 'USD',
    period: 'Q1 2026', status: 'At Risk', managerId: 'e2', managerName: 'Michael Chen',
  },
  {
    id: 'cc2', name: 'Product Q1 2026', departmentId: 'd2', departmentName: 'Product',
    budget: 200000, spent: 142000, committed: 28000, currency: 'USD',
    period: 'Q1 2026', status: 'On Track', managerId: 'e1', managerName: 'Sarah Johnson',
  },
  {
    id: 'cc3', name: 'Marketing Q1 2026', departmentId: 'd4', departmentName: 'Marketing',
    budget: 300000, spent: 264000, committed: 24000, currency: 'USD',
    period: 'Q1 2026', status: 'Over Budget', managerId: 'e4', managerName: 'David Kim',
  },
  {
    id: 'cc4', name: 'Sales Q1 2026', departmentId: 'd5', departmentName: 'Sales',
    budget: 450000, spent: 298000, committed: 52000, currency: 'USD',
    period: 'Q1 2026', status: 'On Track', managerId: 'e6', managerName: 'James Wilson',
  },
  {
    id: 'cc5', name: 'Design Q1 2026', departmentId: 'd3', departmentName: 'Design',
    budget: 125000, spent: 78000, committed: 18000, currency: 'USD',
    period: 'Q1 2026', status: 'On Track', managerId: 'e3', managerName: 'Emily Rodriguez',
  },
];

// ═══════════════════════════════════════════════════════════════════════
// FINANCE EXTENDED — EXPENSE REPORTS (Phase 13)
// ═══════════════════════════════════════════════════════════════════════

export const mockExpenseReports: ExpenseReport[] = [
  {
    id: 'er1', employeeId: 'e6', employeeName: 'James Wilson', department: 'Sales',
    title: 'Q1 Enterprise Sales Trip — NYC', totalAmount: 2840, currency: 'USD',
    period: 'February 2026', status: 'Approved',
    submittedAt: '2026-03-01T09:00:00Z', approvedBy: 'Alex Rivera', approvedAt: '2026-03-02T10:00:00Z',
    lineItems: [
      { id: 'eli1', category: 'Flights', description: 'SFO → JFK round trip', amount: 480, date: '2026-02-26' },
      { id: 'eli2', category: 'Hotel', description: 'Marriott Times Square — 3 nights', amount: 960, date: '2026-02-27' },
      { id: 'eli3', category: 'Client Dinner', description: 'Client dinner — 4 guests', amount: 840, date: '2026-02-28' },
      { id: 'eli4', category: 'Ground Transport', description: 'Uber / taxi NYC', amount: 280, date: '2026-02-28' },
      { id: 'eli5', category: 'Meals', description: 'Per diem meals', amount: 280, date: '2026-02-27' },
    ],
  },
  {
    id: 'er2', employeeId: 'e1', employeeName: 'Sarah Johnson', department: 'Product',
    title: 'ProductCon 2026 — San Francisco', totalAmount: 680, currency: 'USD',
    period: 'March 2026', status: 'Submitted', submittedAt: '2026-03-02T14:00:00Z',
    lineItems: [
      { id: 'eli6', category: 'Conference', description: 'ProductCon 2026 registration', amount: 290, date: '2026-03-01' },
      { id: 'eli7', category: 'Hotel', description: 'Hotel Nikko SF — 2 nights', amount: 390, date: '2026-03-10' },
    ],
  },
  {
    id: 'er3', employeeId: 'e2', employeeName: 'Michael Chen', department: 'Engineering',
    title: 'Engineering Offsite — Q1 2026', totalAmount: 4800, currency: 'USD',
    period: 'February 2026', status: 'Paid',
    submittedAt: '2026-02-16T09:00:00Z', approvedBy: 'Alex Rivera', approvedAt: '2026-02-17T11:00:00Z',
    lineItems: [
      { id: 'eli8', category: 'Flights', description: 'Team flights — 8 engineers SFO→NYC', amount: 3840, date: '2026-02-14' },
      { id: 'eli9', category: 'Team Dinner', description: 'Team dinner — offsite kickoff', amount: 960, date: '2026-02-15' },
    ],
  },
  {
    id: 'er4', employeeId: 'e4', employeeName: 'David Kim', department: 'Marketing',
    title: 'SaaStr Annual 2026', totalAmount: 1200, currency: 'USD',
    period: 'February 2026', status: 'Draft',
    lineItems: [
      { id: 'eli10', category: 'Conference', description: 'SaaStr Annual ticket', amount: 450, date: '2026-02-20' },
      { id: 'eli11', category: 'Booth Materials', description: 'Printed collateral and banners', amount: 480, date: '2026-02-19' },
      { id: 'eli12', category: 'Shipping', description: 'Materials shipping to venue', amount: 270, date: '2026-02-20' },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════
// FINANCE EXTENDED — FINANCE REPORTS (Phase 13)
// ═══════════════════════════════════════════════════════════════════════

export const mockFinanceReports: FinanceReport[] = [
  {
    id: 'fr1', type: 'P&L', title: 'Profit & Loss — February 2026',
    period: 'February 2026', generatedAt: '2026-03-01T08:00:00Z',
    generatedBy: 'Tom Bradley', fileUrl: '/reports/pl-feb-2026.pdf', status: 'Ready',
    summary: { revenue: 482000, expenses: 356000, grossProfit: 126000, netIncome: 94200 },
  },
  {
    id: 'fr2', type: 'Cash Flow', title: 'Cash Flow Statement — February 2026',
    period: 'February 2026', generatedAt: '2026-03-01T09:00:00Z',
    generatedBy: 'Tom Bradley', fileUrl: '/reports/cashflow-feb-2026.pdf', status: 'Ready',
    summary: { operatingCashFlow: 108000, investingCashFlow: -24000, financingCashFlow: -9316, netCashFlow: 74684 },
  },
  {
    id: 'fr3', type: 'Expense Summary', title: 'Expense Summary — Q1 2026',
    period: 'Q1 2026', generatedAt: '2026-03-04T10:00:00Z',
    generatedBy: 'Tom Bradley', fileUrl: '/reports/expense-q1-2026.pdf', status: 'Ready',
    summary: { totalExpenses: 1048000, payroll: 624900, infrastructure: 24720, marketing: 96000, travel: 18400 },
  },
  {
    id: 'fr4', type: 'Payroll Summary', title: 'Payroll Summary — March 2026',
    period: 'March 2026', generatedAt: '2026-03-04T09:30:00Z',
    generatedBy: 'Tom Bradley', status: 'Generating',
    summary: { totalGross: 348000, totalDeductions: 35550, totalNet: 312450, employeeCount: 67 },
  },
  {
    id: 'fr5', type: 'Balance Sheet', title: 'Balance Sheet — Q1 2026',
    period: 'Q1 2026', generatedAt: '2026-02-28T12:00:00Z',
    generatedBy: 'Tom Bradley', fileUrl: '/reports/balance-q1-2026.pdf', status: 'Ready',
    summary: { totalAssets: 1483200, totalLiabilities: 450000, shareholderEquity: 1033200 },
  },
];

// ═══════════════════════════════════════════════════════════════════════
// FINANCE — PAYROLL POSTINGS (Phase 14 — gap closure)
// ═══════════════════════════════════════════════════════════════════════

const DEPT_BREAKDOWN_DEC: PayrollPosting['departmentBreakdown'] = [
  { departmentId: 'd1', departmentName: 'Engineering', employeeCount: 4, amount: 22000 },
  { departmentId: 'd5', departmentName: 'Sales',       employeeCount: 3, amount: 12600 },
  { departmentId: 'd3', departmentName: 'Design',      employeeCount: 2, amount: 7800  },
  { departmentId: 'd4', departmentName: 'Marketing',   employeeCount: 2, amount: 4200  },
  { departmentId: 'd6', departmentName: 'HR / Admin',  employeeCount: 1, amount: 1600  },
];

export const mockPayrollPostings: PayrollPosting[] = [
  {
    id: 'pp1',
    payrollRunId: 'pr3',
    period: 'December 2025',
    month: '2025-12',
    totalAmount: 48200,
    currency: 'USD',
    employeeCount: 12,
    departmentBreakdown: DEPT_BREAKDOWN_DEC,
    status: 'Posted',
    ledgerRef: 'LDG-PAY-2025-12',
    postedAt: '2025-12-30T10:00:00Z',
    postedBy: 'Alex Rivera',
    notes: 'Standard monthly payroll — December cycle',
    createdAt: '2025-12-29T09:00:00Z',
  },
  {
    id: 'pp2',
    payrollRunId: 'pr2',
    period: 'November 2025',
    month: '2025-11',
    totalAmount: 48200,
    currency: 'USD',
    employeeCount: 12,
    departmentBreakdown: DEPT_BREAKDOWN_DEC,
    status: 'Posted',
    ledgerRef: 'LDG-PAY-2025-11',
    postedAt: '2025-11-30T10:00:00Z',
    postedBy: 'Alex Rivera',
    notes: 'Standard monthly payroll — November cycle',
    createdAt: '2025-11-28T09:00:00Z',
  },
  {
    id: 'pp3',
    payrollRunId: 'pr1',
    period: 'January 2026',
    month: '2026-01',
    totalAmount: 49800,
    currency: 'USD',
    employeeCount: 13,
    departmentBreakdown: [
      { departmentId: 'd1', departmentName: 'Engineering', employeeCount: 5, amount: 23400 },
      { departmentId: 'd5', departmentName: 'Sales',       employeeCount: 3, amount: 12600 },
      { departmentId: 'd3', departmentName: 'Design',      employeeCount: 2, amount: 7800  },
      { departmentId: 'd4', departmentName: 'Marketing',   employeeCount: 2, amount: 4200  },
      { departmentId: 'd6', departmentName: 'HR / Admin',  employeeCount: 1, amount: 1800  },
    ],
    status: 'Posted',
    ledgerRef: 'LDG-PAY-2026-01',
    postedAt: '2026-01-31T10:00:00Z',
    postedBy: 'Alex Rivera',
    notes: 'January 2026 — includes new Engineering hire salary from Jan 15',
    createdAt: '2026-01-30T09:00:00Z',
  },
  {
    id: 'pp4',
    payrollRunId: undefined,
    period: 'February 2026',
    month: '2026-02',
    totalAmount: 49800,
    currency: 'USD',
    employeeCount: 13,
    departmentBreakdown: [
      { departmentId: 'd1', departmentName: 'Engineering', employeeCount: 5, amount: 23400 },
      { departmentId: 'd5', departmentName: 'Sales',       employeeCount: 3, amount: 12600 },
      { departmentId: 'd3', departmentName: 'Design',      employeeCount: 2, amount: 7800  },
      { departmentId: 'd4', departmentName: 'Marketing',   employeeCount: 2, amount: 4200  },
      { departmentId: 'd6', departmentName: 'HR / Admin',  employeeCount: 1, amount: 1800  },
    ],
    status: 'Posted',
    ledgerRef: 'LDG-PAY-2026-02',
    postedAt: '2026-02-28T10:00:00Z',
    postedBy: 'Tom Bradley',
    notes: 'February 2026 — processed early for month-end close',
    createdAt: '2026-02-27T09:00:00Z',
  },
  {
    id: 'pp5',
    payrollRunId: undefined,
    period: 'March 2026',
    month: '2026-03',
    totalAmount: 51200,
    currency: 'USD',
    employeeCount: 14,
    departmentBreakdown: [
      { departmentId: 'd1', departmentName: 'Engineering', employeeCount: 5, amount: 23400 },
      { departmentId: 'd5', departmentName: 'Sales',       employeeCount: 3, amount: 12600 },
      { departmentId: 'd3', departmentName: 'Design',      employeeCount: 2, amount: 7800  },
      { departmentId: 'd4', departmentName: 'Marketing',   employeeCount: 2, amount: 4200  },
      { departmentId: 'd2', departmentName: 'Product',     employeeCount: 1, amount: 2200  },
      { departmentId: 'd6', departmentName: 'HR / Admin',  employeeCount: 1, amount: 1000  },
    ],
    status: 'Draft',
    notes: 'March 2026 — pending final headcount confirmation for Product hire',
    createdAt: '2026-03-06T09:00:00Z',
  },
];