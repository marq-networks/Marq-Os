import { Router } from 'express';
import type {
  ActivityLogEntry,
  AppUsageReport,
  LiveActivitySnapshot,
  PaginatedResponse,
  ProductivityMetric,
} from '../../../src/app/services/types';
import { authRequired } from '../middleware/authRequired';
import { getStore } from '../store';
import { paginate, parsePageParams } from '../utils/pagination';

export const analyticsRouter = Router();
analyticsRouter.use(authRequired);

analyticsRouter.get('/activity-log', (req, res) => {
  const { activityLog } = getStore();
  const { page, pageSize } = parsePageParams(req.query);
  return res.json(paginate(activityLog, page, pageSize) satisfies PaginatedResponse<ActivityLogEntry>);
});

analyticsRouter.get('/productivity', (req, res) => {
  const { productivityMetrics } = getStore();
  const dateFrom = typeof req.query.dateFrom === 'string' ? req.query.dateFrom : undefined;
  const dateTo = typeof req.query.dateTo === 'string' ? req.query.dateTo : undefined;
  const departmentId = typeof req.query.departmentId === 'string' ? req.query.departmentId : undefined;

  let filtered = productivityMetrics;
  if (dateFrom) filtered = filtered.filter((m) => m.date >= dateFrom);
  if (dateTo) filtered = filtered.filter((m) => m.date <= dateTo);
  if (departmentId) filtered = filtered.filter((m) => (m as any).departmentId === departmentId || m.department === departmentId);

  return res.json(filtered satisfies ProductivityMetric[]);
});

analyticsRouter.get('/app-usage', (_req, res) => {
  // The UI currently expects the endpoint to exist; mock dataset doesn't ship
  // a standalone app usage table yet.
  return res.json([] satisfies AppUsageReport[]);
});

analyticsRouter.get('/live', (_req, res) => {
  const { employees, activityLog } = getStore();
  const totalUsers = employees.length;
  const activeUsers = Math.max(1, Math.floor(totalUsers * 0.35));
  const byDepartment: Record<string, number> = {};
  for (const e of employees) byDepartment[e.department] = (byDepartment[e.department] ?? 0) + 1;

  const snapshot: LiveActivitySnapshot = {
    activeUsers,
    totalUsers,
    byDepartment,
    recentActions: activityLog.slice(0, 10),
  };
  return res.json(snapshot);
});

