import { Router } from 'express';
import { z } from 'zod';
import type {
  BreakRule,
  Fine,
  LeaveBalance,
  LeaveRequest,
  PaginatedResponse,
  TimeCorrection,
  TimeSession,
  WorkdayRule,
} from '../../../src/app/services/types';
import { authRequired } from '../middleware/authRequired';
import { getStore } from '../store';
import { paginate, parsePageParams } from '../utils/pagination';

export const timeRouter = Router();
timeRouter.use(authRequired);

// Sessions
timeRouter.get('/sessions', (req, res) => {
  const { timeSessions } = getStore();
  const { page, pageSize } = parsePageParams(req.query);
  const employeeId = typeof req.query.employeeId === 'string' ? req.query.employeeId : undefined;
  const filtered = employeeId ? timeSessions.filter((s) => s.employeeId === employeeId) : timeSessions;
  return res.json(paginate(filtered, page, pageSize) satisfies PaginatedResponse<TimeSession>);
});

timeRouter.get('/sessions/active', (req, res) => {
  const { timeSessions } = getStore();
  const employeeId = typeof req.query.employeeId === 'string' ? req.query.employeeId : '';
  const active =
    timeSessions.find((s) => s.employeeId === employeeId && s.status === 'Active') ?? null;
  if (!active) return res.status(404).json({ error: 'No active session' });
  return res.json(active);
});

timeRouter.get('/sessions/:id', (req, res) => {
  const { timeSessions } = getStore();
  const session = timeSessions.find((s) => s.id === req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  return res.json(session);
});

timeRouter.post('/sessions/clock-in', (req, res) => {
  const schema = z.object({ employeeId: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { timeSessions, employees } = getStore();
  const emp = employees.find((e) => e.id === parsed.data.employeeId);
  if (!emp) return res.status(404).json({ error: 'Employee not found' });

  const existing = timeSessions.find((s) => s.employeeId === emp.id && s.status === 'Active');
  if (existing) return res.json(existing);

  const now = new Date();
  const session: TimeSession = {
    id: crypto.randomUUID(),
    employeeId: emp.id,
    employeeName: emp.name,
    department: emp.department,
    date: now.toISOString().slice(0, 10),
    checkIn: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    checkOut: undefined,
    duration: '—',
    totalMinutes: 0,
    status: 'Active',
    breaks: [],
    notes: '',
  };
  timeSessions.unshift(session);
  return res.status(201).json(session);
});

timeRouter.patch('/sessions/:id/clock-out', (req, res) => {
  const { timeSessions } = getStore();
  const idx = timeSessions.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Session not found' });
  const now = new Date();
  const session = timeSessions[idx];
  const updated: TimeSession = {
    ...session,
    checkOut: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    status: 'Completed',
  };
  timeSessions[idx] = updated;
  return res.json(updated);
});

// Corrections
timeRouter.get('/corrections', (req, res) => {
  const { timeCorrections } = getStore();
  const { page, pageSize } = parsePageParams(req.query);
  return res.json(paginate(timeCorrections, page, pageSize) satisfies PaginatedResponse<TimeCorrection>);
});

timeRouter.post('/corrections', (req, res) => {
  const schema = z.object({
    employeeId: z.string().min(1),
    employeeName: z.string().min(1),
    sessionId: z.string().min(1),
    date: z.string().min(1),
    originalCheckIn: z.string().min(1),
    originalCheckOut: z.string().min(1),
    correctedCheckIn: z.string().min(1),
    correctedCheckOut: z.string().min(1),
    reason: z.string().min(1),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { timeCorrections } = getStore();
  const correction: TimeCorrection = {
    id: crypto.randomUUID(),
    ...(parsed.data as any),
    status: 'Pending',
    submittedAt: new Date().toISOString(),
  };
  timeCorrections.unshift(correction);
  return res.status(201).json(correction);
});

timeRouter.patch('/corrections/:id/approve', (req, res) => {
  const schema = z.object({ reviewedBy: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { timeCorrections } = getStore();
  const idx = timeCorrections.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Correction not found' });
  timeCorrections[idx] = {
    ...timeCorrections[idx],
    status: 'Approved',
    reviewedBy: parsed.data.reviewedBy,
    reviewedAt: new Date().toISOString(),
  };
  return res.json(timeCorrections[idx]);
});

timeRouter.patch('/corrections/:id/reject', (req, res) => {
  const schema = z.object({ reviewedBy: z.string().min(1), reason: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { timeCorrections } = getStore();
  const idx = timeCorrections.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Correction not found' });
  timeCorrections[idx] = {
    ...timeCorrections[idx],
    status: 'Rejected',
    reviewedBy: parsed.data.reviewedBy,
    reviewedAt: new Date().toISOString(),
    reason: parsed.data.reason,
  };
  return res.json(timeCorrections[idx]);
});

// Leave
timeRouter.get('/leave', (req, res) => {
  const { leaveRequests } = getStore();
  const { page, pageSize } = parsePageParams(req.query);
  return res.json(paginate(leaveRequests, page, pageSize) satisfies PaginatedResponse<LeaveRequest>);
});

timeRouter.get('/leave/:id', (req, res) => {
  const { leaveRequests } = getStore();
  const leave = leaveRequests.find((l) => l.id === req.params.id);
  if (!leave) return res.status(404).json({ error: 'Leave request not found' });
  return res.json(leave);
});

timeRouter.post('/leave', (req, res) => {
  const schema = z.object({
    employeeId: z.string().min(1),
    employeeName: z.string().min(1),
    department: z.string().min(1),
    type: z.string().min(1),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    days: z.number(),
    reason: z.string().min(1),
    notes: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { leaveRequests } = getStore();
  const leave: LeaveRequest = {
    id: crypto.randomUUID(),
    ...(parsed.data as any),
    status: 'Pending',
    submittedAt: new Date().toISOString(),
  };
  leaveRequests.unshift(leave);
  return res.status(201).json(leave);
});

timeRouter.patch('/leave/:id/approve', (req, res) => {
  const schema = z.object({ approvedBy: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { leaveRequests } = getStore();
  const idx = leaveRequests.findIndex((l) => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Leave request not found' });
  leaveRequests[idx] = {
    ...leaveRequests[idx],
    status: 'Approved',
    approvedBy: parsed.data.approvedBy,
    approvedAt: new Date().toISOString(),
  };
  return res.json(leaveRequests[idx]);
});

timeRouter.patch('/leave/:id/reject', (req, res) => {
  const schema = z.object({ reason: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { leaveRequests } = getStore();
  const idx = leaveRequests.findIndex((l) => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Leave request not found' });
  leaveRequests[idx] = { ...leaveRequests[idx], status: 'Rejected' };
  return res.json(leaveRequests[idx]);
});

timeRouter.patch('/leave/:id/cancel', (req, res) => {
  const { leaveRequests } = getStore();
  const idx = leaveRequests.findIndex((l) => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Leave request not found' });
  leaveRequests[idx] = { ...leaveRequests[idx], status: 'Cancelled' };
  return res.json(leaveRequests[idx]);
});

timeRouter.get('/leave-balances', (req, res) => {
  const { leaveBalances } = getStore();
  const employeeId = typeof req.query.employeeId === 'string' ? req.query.employeeId : undefined;
  const filtered = employeeId ? leaveBalances.filter((b) => b.employeeId === employeeId) : leaveBalances;
  return res.json(filtered satisfies LeaveBalance[]);
});

// Rules
timeRouter.get('/workday-rules', (_req, res) => {
  const { workdayRules } = getStore();
  return res.json(workdayRules satisfies WorkdayRule[]);
});

timeRouter.post('/workday-rules', (req, res) => {
  const schema = z.object({
    name: z.string().min(1),
    startTime: z.string().min(1),
    endTime: z.string().min(1),
    gracePeriodMinutes: z.number(),
    workingDays: z.array(z.number()),
    timezone: z.string().min(1),
    appliesTo: z.array(z.string()),
    isDefault: z.boolean(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { workdayRules } = getStore();
  const rule: WorkdayRule = { id: crypto.randomUUID(), ...(parsed.data as any) };
  workdayRules.unshift(rule);
  return res.status(201).json(rule);
});

timeRouter.patch('/workday-rules/:id', (req, res) => {
  const { workdayRules } = getStore();
  const idx = workdayRules.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Rule not found' });
  workdayRules[idx] = { ...workdayRules[idx], ...(req.body ?? {}) };
  return res.json(workdayRules[idx]);
});

timeRouter.delete('/workday-rules/:id', (req, res) => {
  const { workdayRules } = getStore();
  const idx = workdayRules.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Rule not found' });
  workdayRules.splice(idx, 1);
  return res.status(204).send();
});

timeRouter.get('/break-rules', (_req, res) => {
  const { breakRules } = getStore();
  return res.json(breakRules satisfies BreakRule[]);
});

timeRouter.post('/break-rules', (req, res) => {
  const schema = z.object({
    name: z.string().min(1),
    maxBreaks: z.number(),
    maxBreakDuration: z.number(),
    maxTotalBreakTime: z.number(),
    paidBreak: z.boolean(),
    appliesTo: z.array(z.string()),
    isDefault: z.boolean(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { breakRules } = getStore();
  const rule: BreakRule = { id: crypto.randomUUID(), ...(parsed.data as any) };
  breakRules.unshift(rule);
  return res.status(201).json(rule);
});

timeRouter.patch('/break-rules/:id', (req, res) => {
  const { breakRules } = getStore();
  const idx = breakRules.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Rule not found' });
  breakRules[idx] = { ...breakRules[idx], ...(req.body ?? {}) };
  return res.json(breakRules[idx]);
});

timeRouter.delete('/break-rules/:id', (req, res) => {
  const { breakRules } = getStore();
  const idx = breakRules.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Rule not found' });
  breakRules.splice(idx, 1);
  return res.status(204).send();
});

// Fines
timeRouter.get('/fines', (req, res) => {
  const { fines } = getStore();
  const { page, pageSize } = parsePageParams(req.query);
  const employeeId = typeof req.query.employeeId === 'string' ? req.query.employeeId : undefined;
  const filtered = employeeId ? fines.filter((f) => f.employeeId === employeeId) : fines;
  return res.json(paginate(filtered, page, pageSize) satisfies PaginatedResponse<Fine>);
});

timeRouter.get('/fines/:id', (req, res) => {
  const { fines } = getStore();
  const fine = fines.find((f) => f.id === req.params.id);
  if (!fine) return res.status(404).json({ error: 'Fine not found' });
  return res.json(fine);
});

timeRouter.post('/fines', (req, res) => {
  const schema = z.object({
    employeeId: z.string().min(1),
    employeeName: z.string().min(1),
    department: z.string().min(1),
    type: z.string().min(1),
    amount: z.number(),
    currency: z.string().min(1),
    date: z.string().min(1),
    description: z.string().min(1),
    status: z.string().min(1),
    sessionId: z.string().optional(),
    issuedBy: z.string().min(1),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { fines } = getStore();
  const fine: Fine = { id: crypto.randomUUID(), ...(parsed.data as any), issuedAt: new Date().toISOString() };
  fines.unshift(fine);
  return res.status(201).json(fine);
});

timeRouter.patch('/fines/:id', (req, res) => {
  const { fines } = getStore();
  const idx = fines.findIndex((f) => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Fine not found' });
  fines[idx] = { ...fines[idx], ...(req.body ?? {}) };
  return res.json(fines[idx]);
});

timeRouter.patch('/fines/:id/waive', (req, res) => {
  const schema = z.object({ waivedBy: z.string().min(1), reason: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { fines } = getStore();
  const idx = fines.findIndex((f) => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Fine not found' });
  fines[idx] = { ...fines[idx], status: 'Waived', waivedBy: parsed.data.waivedBy, waivedReason: parsed.data.reason };
  return res.json(fines[idx]);
});

