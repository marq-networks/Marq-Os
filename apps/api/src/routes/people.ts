import { Router } from 'express';
import { z } from 'zod';
import type { Department, Employee, RoleDefinition } from '../../../src/app/services/types';
import { sendJsonError } from '../http/http';
import { authRequired } from '../middleware/authRequired';
import { getStore } from '../store';
import * as peopleService from '../services/peopleService';

export const peopleRouter = Router();
peopleRouter.use(authRequired);

// Employees
peopleRouter.get('/employees', async (req, res) => {
  try {
    const body = await peopleService.listEmployeesPaginated(req.auth!.organizationId, req.query as Record<string, unknown>);
    return res.json(body);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to load employees';
    return sendJsonError(res, 500, msg);
  }
});

peopleRouter.get('/employees/:id', async (req, res) => {
  try {
    const emp = await peopleService.getEmployeeById(req.auth!.organizationId, req.params.id);
    if (!emp) return sendJsonError(res, 404, 'Employee not found');
    return res.json(emp);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to load employee';
    return sendJsonError(res, 500, msg);
  }
});

peopleRouter.post('/employees', (req, res) => {
  const schema = z.object({
    name: z.string().min(1),
    email: z.string().min(1),
    role: z.string().min(1),
    department: z.string().min(1),
    departmentId: z.string().min(1),
    status: z.string().min(1),
    lastSeen: z.string().min(1),
    joinDate: z.string().min(1),
    employmentType: z.string().min(1),
    phone: z.string().optional(),
    location: z.string().optional(),
    manager: z.string().optional(),
    managerId: z.string().optional(),
    skills: z.array(z.string()).optional(),
    salary: z.number().optional(),
    avatar: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { employees } = getStore();
  const id = crypto.randomUUID();
  const emp: Employee = { id, ...(parsed.data as any) };
  employees.unshift(emp);
  return res.status(201).json(emp);
});

peopleRouter.patch('/employees/:id', (req, res) => {
  const { employees } = getStore();
  const idx = employees.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return sendJsonError(res, 404, 'Employee not found');
  employees[idx] = { ...employees[idx], ...(req.body ?? {}) };
  return res.json(employees[idx]);
});

peopleRouter.delete('/employees/:id', (req, res) => {
  const { employees } = getStore();
  const idx = employees.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return sendJsonError(res, 404, 'Employee not found');
  employees.splice(idx, 1);
  return res.status(204).send();
});

// Departments
peopleRouter.get('/departments', async (req, res) => {
  try {
    const body = await peopleService.listDepartmentsPaginated(req.auth!.organizationId, req.query as Record<string, unknown>);
    return res.json(body);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to load departments';
    return sendJsonError(res, 500, msg);
  }
});

peopleRouter.get('/departments/:id', async (req, res) => {
  try {
    const dept = await peopleService.getDepartmentById(req.auth!.organizationId, req.params.id);
    if (!dept) return sendJsonError(res, 404, 'Department not found');
    return res.json(dept);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to load department';
    return sendJsonError(res, 500, msg);
  }
});

peopleRouter.post('/departments', async (req, res) => {
  const schema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    lead: z.string().min(1),
    leadId: z.string().min(1),
    memberCount: z.number(),
    budget: z.number(),
    parentDepartmentId: z.string().optional(),
    createdAt: z.string().min(1),
    status: z.string().min(1),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  try {
    const dept = await peopleService.createDepartmentForOrg(req.auth!.organizationId, parsed.data as any);
    return res.status(201).json(dept);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to create department';
    return sendJsonError(res, 500, msg);
  }
});

peopleRouter.patch('/departments/:id', (req, res) => {
  const { departments } = getStore();
  const idx = departments.findIndex((d) => d.id === req.params.id);
  if (idx === -1) return sendJsonError(res, 404, 'Department not found');
  departments[idx] = { ...departments[idx], ...(req.body ?? {}) };
  return res.json(departments[idx]);
});

peopleRouter.delete('/departments/:id', (req, res) => {
  const { departments } = getStore();
  const idx = departments.findIndex((d) => d.id === req.params.id);
  if (idx === -1) return sendJsonError(res, 404, 'Department not found');
  departments.splice(idx, 1);
  return res.status(204).send();
});

// Roles
peopleRouter.get('/roles', async (req, res) => {
  try {
    const body = await peopleService.listRolesPaginated(req.auth!.organizationId, req.query as Record<string, unknown>);
    return res.json(body);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to load roles';
    return sendJsonError(res, 500, msg);
  }
});

peopleRouter.get('/roles/:id', (req, res) => {
  const { roles } = getStore();
  const role = roles.find((r: any) => r.id === req.params.id);
  if (!role) return sendJsonError(res, 404, 'Role not found');
  return res.json(role);
});

peopleRouter.post('/roles', (req, res) => {
  const schema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    permissions: z.array(z.string()),
    userCount: z.number(),
    isSystem: z.boolean(),
    createdAt: z.string().min(1),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { roles } = getStore();
  const id = crypto.randomUUID();
  const role: RoleDefinition = { id, ...(parsed.data as any) };
  roles.unshift(role);
  return res.status(201).json(role);
});

peopleRouter.patch('/roles/:id', (req, res) => {
  const { roles } = getStore();
  const idx = roles.findIndex((r: any) => r.id === req.params.id);
  if (idx === -1) return sendJsonError(res, 404, 'Role not found');
  roles[idx] = { ...roles[idx], ...(req.body ?? {}) };
  return res.json(roles[idx]);
});

peopleRouter.delete('/roles/:id', (req, res) => {
  const { roles } = getStore();
  const idx = roles.findIndex((r: any) => r.id === req.params.id);
  if (idx === -1) return sendJsonError(res, 404, 'Role not found');
  roles.splice(idx, 1);
  return res.status(204).send();
});
