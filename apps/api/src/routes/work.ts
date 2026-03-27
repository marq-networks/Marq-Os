import { Router } from 'express';
import { z } from 'zod';
import type {
  Issue,
  Milestone,
  PaginatedResponse,
  Project,
  Sprint,
  Task,
  TaskDependency,
  TaskList,
  TeamMember,
  TimeLog,
} from '../../../src/app/services/types';

/** Aggregated work report row for GET /work/reports (not yet in IExecutionOSService). */
type WorkReportSummary = {
  id: string;
  projectId: string;
  projectName: string;
  period: string;
  totalTasks: number;
  completedTasks: number;
  openIssues: number;
  progress: number;
};
import { authRequired } from '../middleware/authRequired';
import { getStore } from '../store';
import { paginate, parsePageParams } from '../utils/pagination';

export const workRouter = Router();
workRouter.use(authRequired);

// Work reports (config ENDPOINTS.WORK_REPORTS)
workRouter.get('/reports', (req, res) => {
  const { projects, tasks, issues } = getStore();
  const { page, pageSize } = parsePageParams(req.query);
  const period =
    typeof req.query.period === 'string' && req.query.period.length > 0
      ? req.query.period
      : new Date().toISOString().slice(0, 7);
  const rows: WorkReportSummary[] = projects.map((p) => {
    const projectTasks = tasks.filter((t) => t.projectId === p.id);
    const completed = projectTasks.filter((t) => t.status === 'Closed').length;
    const projectIssues = issues.filter((i) => i.projectId === p.id);
    const openIss = projectIssues.filter((i) => i.status !== 'Closed' && i.status !== "Won't Fix").length;
    return {
      id: `wr-${p.id}-${period}`,
      projectId: p.id,
      projectName: p.name,
      period,
      totalTasks: projectTasks.length,
      completedTasks: completed,
      openIssues: openIss,
      progress: p.progress,
    };
  });
  return res.json(paginate(rows, page, pageSize) satisfies PaginatedResponse<WorkReportSummary>);
});

// Task lists (config ENDPOINTS.TASK_LISTS)
workRouter.get('/task-lists', (req, res) => {
  const { taskLists } = getStore();
  const { page, pageSize } = parsePageParams(req.query);
  const projectId = typeof req.query.projectId === 'string' ? req.query.projectId : undefined;
  const filtered = projectId ? taskLists.filter((tl) => tl.projectId === projectId) : taskLists;
  return res.json(paginate(filtered, page, pageSize) satisfies PaginatedResponse<TaskList>);
});

workRouter.get('/task-lists/:id', (req, res) => {
  const { taskLists } = getStore();
  const tl = taskLists.find((t) => t.id === req.params.id);
  if (!tl) return res.status(404).json({ error: 'Task list not found' });
  return res.json(tl);
});

workRouter.post('/task-lists', (req, res) => {
  const schema = z.object({
    name: z.string().min(1),
    projectId: z.string().min(1),
    milestoneId: z.string().optional(),
    sprintId: z.string().optional(),
    status: z.enum(['Active', 'Completed']).optional(),
    taskCount: z.number().optional(),
    completedTasks: z.number().optional(),
    order: z.number().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { taskLists } = getStore();
  const tl: TaskList = {
    id: crypto.randomUUID(),
    name: parsed.data.name,
    projectId: parsed.data.projectId,
    milestoneId: parsed.data.milestoneId,
    sprintId: parsed.data.sprintId,
    status: parsed.data.status ?? 'Active',
    taskCount: parsed.data.taskCount ?? 0,
    completedTasks: parsed.data.completedTasks ?? 0,
    order: parsed.data.order ?? taskLists.length,
  };
  taskLists.unshift(tl);
  return res.status(201).json(tl);
});

workRouter.patch('/task-lists/:id', (req, res) => {
  const { taskLists } = getStore();
  const idx = taskLists.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Task list not found' });
  taskLists[idx] = { ...taskLists[idx], ...(req.body ?? {}) };
  return res.json(taskLists[idx]);
});

workRouter.delete('/task-lists/:id', (req, res) => {
  const { taskLists } = getStore();
  const idx = taskLists.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Task list not found' });
  taskLists.splice(idx, 1);
  return res.status(204).send();
});

// Projects
workRouter.get('/projects', (req, res) => {
  const { projects } = getStore();
  const { page, pageSize, search } = parsePageParams(req.query);
  const filtered = search
    ? projects.filter((p) => JSON.stringify(p).toLowerCase().includes(search.toLowerCase()))
    : projects;
  return res.json(paginate(filtered, page, pageSize) satisfies PaginatedResponse<Project>);
});

workRouter.get('/projects/:id', (req, res) => {
  const { projects } = getStore();
  const project = projects.find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  return res.json(project);
});

workRouter.post('/projects', (req, res) => {
  const schema = z.record(z.any());
  const parsed = schema.safeParse(req.body ?? {});
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { projects } = getStore();
  const project: Project = { id: crypto.randomUUID(), ...(parsed.data as any) };
  projects.unshift(project);
  return res.status(201).json(project);
});

workRouter.patch('/projects/:id', (req, res) => {
  const { projects } = getStore();
  const idx = projects.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Project not found' });
  projects[idx] = { ...projects[idx], ...(req.body ?? {}) };
  return res.json(projects[idx]);
});

workRouter.delete('/projects/:id', (req, res) => {
  const { projects } = getStore();
  const idx = projects.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Project not found' });
  projects.splice(idx, 1);
  return res.status(204).send();
});

// Tasks
workRouter.get('/tasks', (req, res) => {
  const { tasks } = getStore();
  const { page, pageSize, search } = parsePageParams(req.query);
  const filtered = search
    ? tasks.filter((t) => JSON.stringify(t).toLowerCase().includes(search.toLowerCase()))
    : tasks;
  return res.json(paginate(filtered, page, pageSize) satisfies PaginatedResponse<Task>);
});

workRouter.get('/tasks/:id', (req, res) => {
  const { tasks } = getStore();
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  return res.json(task);
});

workRouter.post('/tasks', (req, res) => {
  const schema = z.record(z.any());
  const parsed = schema.safeParse(req.body ?? {});
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { tasks } = getStore();
  const task: Task = { id: crypto.randomUUID(), ...(parsed.data as any) };
  tasks.unshift(task);
  return res.status(201).json(task);
});

workRouter.patch('/tasks/:id', (req, res) => {
  const { tasks } = getStore();
  const idx = tasks.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });
  tasks[idx] = { ...tasks[idx], ...(req.body ?? {}) };
  return res.json(tasks[idx]);
});

workRouter.delete('/tasks/:id', (req, res) => {
  const { tasks } = getStore();
  const idx = tasks.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });
  tasks.splice(idx, 1);
  return res.status(204).send();
});

workRouter.patch('/tasks/:id/status', (req, res) => {
  const schema = z.object({ status: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { tasks } = getStore();
  const idx = tasks.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });
  tasks[idx] = { ...tasks[idx], status: parsed.data.status as any };
  return res.json(tasks[idx]);
});

// Sprints
workRouter.get('/sprints', (req, res) => {
  const { sprints } = getStore();
  const { page, pageSize, search } = parsePageParams(req.query);
  const filtered = search
    ? sprints.filter((s) => JSON.stringify(s).toLowerCase().includes(search.toLowerCase()))
    : sprints;
  return res.json(paginate(filtered, page, pageSize) satisfies PaginatedResponse<Sprint>);
});

workRouter.get('/sprints/:id', (req, res) => {
  const { sprints } = getStore();
  const sprint = sprints.find((s) => s.id === req.params.id);
  if (!sprint) return res.status(404).json({ error: 'Sprint not found' });
  return res.json(sprint);
});

workRouter.post('/sprints', (req, res) => {
  const schema = z.record(z.any());
  const parsed = schema.safeParse(req.body ?? {});
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { sprints } = getStore();
  const sprint: Sprint = { id: crypto.randomUUID(), ...(parsed.data as any) };
  sprints.unshift(sprint);
  return res.status(201).json(sprint);
});

workRouter.patch('/sprints/:id', (req, res) => {
  const { sprints } = getStore();
  const idx = sprints.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Sprint not found' });
  sprints[idx] = { ...sprints[idx], ...(req.body ?? {}) };
  return res.json(sprints[idx]);
});

// Milestones
workRouter.get('/milestones', (req, res) => {
  const { milestones } = getStore();
  const { page, pageSize, search } = parsePageParams(req.query);
  const filtered = search
    ? milestones.filter((m) => JSON.stringify(m).toLowerCase().includes(search.toLowerCase()))
    : milestones;
  return res.json(paginate(filtered, page, pageSize) satisfies PaginatedResponse<Milestone>);
});

workRouter.get('/milestones/:id', (req, res) => {
  const { milestones } = getStore();
  const ms = milestones.find((m) => m.id === req.params.id);
  if (!ms) return res.status(404).json({ error: 'Milestone not found' });
  return res.json(ms);
});

workRouter.post('/milestones', (req, res) => {
  const schema = z.record(z.any());
  const parsed = schema.safeParse(req.body ?? {});
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { milestones } = getStore();
  const ms: Milestone = { id: crypto.randomUUID(), ...(parsed.data as any) };
  milestones.unshift(ms);
  return res.status(201).json(ms);
});

workRouter.patch('/milestones/:id', (req, res) => {
  const { milestones } = getStore();
  const idx = milestones.findIndex((m) => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Milestone not found' });
  milestones[idx] = { ...milestones[idx], ...(req.body ?? {}) };
  return res.json(milestones[idx]);
});

workRouter.delete('/milestones/:id', (req, res) => {
  const { milestones } = getStore();
  const idx = milestones.findIndex((m) => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Milestone not found' });
  milestones.splice(idx, 1);
  return res.status(204).send();
});

// Issues
workRouter.get('/issues', (req, res) => {
  const { issues } = getStore();
  const { page, pageSize, search } = parsePageParams(req.query);
  const filtered = search
    ? issues.filter((i) => JSON.stringify(i).toLowerCase().includes(search.toLowerCase()))
    : issues;
  return res.json(paginate(filtered, page, pageSize) satisfies PaginatedResponse<Issue>);
});

workRouter.get('/issues/:id', (req, res) => {
  const { issues } = getStore();
  const issue = issues.find((i) => i.id === req.params.id);
  if (!issue) return res.status(404).json({ error: 'Issue not found' });
  return res.json(issue);
});

workRouter.post('/issues', (req, res) => {
  const schema = z.record(z.any());
  const parsed = schema.safeParse(req.body ?? {});
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { issues } = getStore();
  const issue: Issue = { id: crypto.randomUUID(), ...(parsed.data as any) };
  issues.unshift(issue);
  return res.status(201).json(issue);
});

workRouter.patch('/issues/:id', (req, res) => {
  const { issues } = getStore();
  const idx = issues.findIndex((i) => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Issue not found' });
  issues[idx] = { ...issues[idx], ...(req.body ?? {}) };
  return res.json(issues[idx]);
});

// Team members + time logs
workRouter.get('/team-members', (req, res) => {
  const { teamMembers } = getStore();
  const { page, pageSize, search } = parsePageParams(req.query);
  const filtered = search
    ? teamMembers.filter((m) => JSON.stringify(m).toLowerCase().includes(search.toLowerCase()))
    : teamMembers;
  return res.json(paginate(filtered, page, pageSize) satisfies PaginatedResponse<TeamMember>);
});

workRouter.get('/time-logs', (req, res) => {
  const { timeLogs } = getStore();
  const { page, pageSize, search } = parsePageParams(req.query);
  const filtered = search
    ? timeLogs.filter((t) => JSON.stringify(t).toLowerCase().includes(search.toLowerCase()))
    : timeLogs;
  return res.json(paginate(filtered, page, pageSize) satisfies PaginatedResponse<TimeLog>);
});

workRouter.post('/time-logs', (req, res) => {
  const schema = z.record(z.any());
  const parsed = schema.safeParse(req.body ?? {});
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { timeLogs } = getStore();
  const tl: TimeLog = { id: crypto.randomUUID(), ...(parsed.data as any) };
  timeLogs.unshift(tl);
  return res.status(201).json(tl);
});

// Dependencies
workRouter.get('/tasks/:taskId/dependencies', (req, res) => {
  const { taskDependencies } = getStore();
  const taskId = req.params.taskId;
  return res.json(taskDependencies.filter((d) => d.fromTaskId === taskId || d.toTaskId === taskId) satisfies TaskDependency[]);
});

workRouter.post('/tasks/:taskId/dependencies', (req, res) => {
  const schema = z.object({
    id: z.string().optional(),
    fromTaskId: z.string().min(1),
    toTaskId: z.string().min(1),
    type: z.string().min(1),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { taskDependencies } = getStore();
  const dep: TaskDependency = { id: parsed.data.id ?? crypto.randomUUID(), ...(parsed.data as any) };
  taskDependencies.unshift(dep);
  return res.status(201).json(dep);
});

workRouter.delete('/tasks/:fromId/dependencies/:toId', (req, res) => {
  const { taskDependencies } = getStore();
  const before = taskDependencies.length;
  const filtered = taskDependencies.filter((d) => !(d.fromTaskId === req.params.fromId && d.toTaskId === req.params.toId));
  taskDependencies.splice(0, taskDependencies.length, ...filtered);
  if (before === filtered.length) return res.status(404).json({ error: 'Dependency not found' });
  return res.status(204).send();
});

