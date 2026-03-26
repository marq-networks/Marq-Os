import { Router } from 'express';
import { z } from 'zod';
import type { Department, Employee, PaginatedResponse, QueryParams, RoleDefinition } from '../../../src/app/services/types';
import { authRequired } from '../middleware/authRequired';
import { getStore } from '../store';
import { paginate, parsePageParams } from '../utils/pagination';

export const peopleRouter = Router();
peopleRouter.use(authRequired);

function applyQuery<T extends Record<string, any>>(items: T[], params?: QueryParams): T[] {
  const search = params?.search?.toLowerCase();
  if (!search) return items;
  return items.filter((x) => JSON.stringify(x).toLowerCase().includes(search));
}

// Employees
peopleRouter.get('/employees', (req, res) => {
  const { employees } = getStore();
  const { page, pageSize, search } = parsePageParams(req.query);
  const departmentId = typeof req.query.departmentId === 'string' ? req.query.departmentId : undefined;
  const filtered = applyQuery(
    departmentId ? employees.filter((e) => e.departmentId === departmentId) : employees,
    { search } as any,
  );
  return res.json(paginate(filtered, page, pageSize) satisfies PaginatedResponse<Employee>);
});

peopleRouter.get('/employees/:id', (req, res) => {
  const { employees } = getStore();
  const emp = employees.find((e) => e.id === req.params.id);
  if (!emp) return res.status(404).json({ error: 'Employee not found' });
  return res.json(emp);
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
  if (idx === -1) return res.status(404).json({ error: 'Employee not found' });
  employees[idx] = { ...employees[idx], ...(req.body ?? {}) };
  return res.json(employees[idx]);
});

peopleRouter.delete('/employees/:id', (req, res) => {
  const { employees } = getStore();
  const idx = employees.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Employee not found' });
  employees.splice(idx, 1);
  return res.status(204).send();
});

// Departments
peopleRouter.get('/departments', (req, res) => {
  const { departments } = getStore();
  const { page, pageSize, search } = parsePageParams(req.query);
  const filtered = applyQuery(departments, { search } as any);
  return res.json(paginate(filtered, page, pageSize) satisfies PaginatedResponse<Department>);
});

peopleRouter.get('/departments/:id', (req, res) => {
  const { departments } = getStore();
  const dept = departments.find((d) => d.id === req.params.id);
  if (!dept) return res.status(404).json({ error: 'Department not found' });
  return res.json(dept);
});

peopleRouter.post('/departments', (req, res) => {
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
  const { departments } = getStore();
  const id = crypto.randomUUID();
  const dept: Department = { id, ...(parsed.data as any) };
  departments.unshift(dept);
  return res.status(201).json(dept);
});

peopleRouter.patch('/departments/:id', (req, res) => {
  const { departments } = getStore();
  const idx = departments.findIndex((d) => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Department not found' });
  departments[idx] = { ...departments[idx], ...(req.body ?? {}) };
  return res.json(departments[idx]);
});

peopleRouter.delete('/departments/:id', (req, res) => {
  const { departments } = getStore();
  const idx = departments.findIndex((d) => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Department not found' });
  departments.splice(idx, 1);
  return res.status(204).send();
});

// Roles
peopleRouter.get('/roles', (req, res) => {
  const { roles } = getStore();
  const { page, pageSize, search } = parsePageParams(req.query);
  const filtered = applyQuery(roles, { search } as any);
  return res.json(paginate(filtered, page, pageSize) satisfies PaginatedResponse<RoleDefinition>);
});

peopleRouter.get('/roles/:id', (req, res) => {
  const { roles } = getStore();
  const role = roles.find((r: any) => r.id === req.params.id);
  if (!role) return res.status(404).json({ error: 'Role not found' });
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
  if (idx === -1) return res.status(404).json({ error: 'Role not found' });
  roles[idx] = { ...roles[idx], ...(req.body ?? {}) };
  return res.json(roles[idx]);
});

peopleRouter.delete('/roles/:id', (req, res) => {
  const { roles } = getStore();
  const idx = roles.findIndex((r: any) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Role not found' });
  roles.splice(idx, 1);
  return res.status(204).send();
});

