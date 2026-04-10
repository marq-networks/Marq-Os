import type { Issue, Milestone, Sprint, Task, TaskStatus } from '../../../../src/app/services/types';
import { mockIssues, mockMilestones, mockSprints, mockTasks } from '../../../../src/app/components/screens/work/workMockData';
import { getConfig } from '../config';
import { getSupabaseAdmin } from './supabaseAdmin';
import { listSupabaseProjects } from './workProjectsRepo';

type ProjectRow = {
  id: string;
  name: string;
};

type UserRow = {
  id: string;
  full_name: string;
};

type DbTask = {
  id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assignee_user_id: string | null;
  due_date: string | null;
  created_at: string;
};

type DbSprint = {
  id: string;
  project_id: string;
  name: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  goal: string | null;
  created_at: string;
};

type DbMilestone = {
  id: string;
  project_id: string;
  name: string;
  status: string;
  due_date: string | null;
  created_at: string;
};

type DbIssue = {
  id: string;
  project_id: string | null;
  task_id: string | null;
  title: string;
  description: string | null;
  severity: string | null;
  status: string | null;
  reported_by: string | null;
  assigned_to: string | null;
  created_at: string;
};

const seededOrganizations = new Set<string>();

function normalizeStatus(value: string | null | undefined) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, ' ');
}

function normalizeTaskStatus(value: string | null | undefined): TaskStatus {
  const normalized = normalizeStatus(value);
  if (normalized === 'todo' || normalized === 'open') return 'Open';
  if (normalized === 'in progress' || normalized === 'inprogress') return 'In Progress';
  if (normalized === 'pending review') return 'Pending Review';
  if (normalized === 'to be tested') return 'To Be Tested';
  if (normalized === 'reopen') return 'Reopen';
  if (normalized === 'on hold') return 'On Hold';
  if (normalized === "won't fix" || normalized === 'wont fix') return "Won't Fix";
  if (normalized === 'waiting') return 'Waiting';
  if (normalized === 'overdue') return 'Overdue';
  if (normalized === 'closed' || normalized === 'done' || normalized === 'completed') return 'Closed';
  return 'Open';
}

function normalizePriority(value: string | null | undefined): Task['priority'] {
  const normalized = normalizeStatus(value);
  if (normalized === 'critical') return 'Critical';
  if (normalized === 'high') return 'High';
  if (normalized === 'low') return 'Low';
  if (normalized === 'none') return 'None';
  return 'Medium';
}

function normalizeSprintStatus(value: string | null | undefined): Sprint['status'] {
  const normalized = normalizeStatus(value);
  if (normalized === 'completed') return 'Completed';
  if (normalized === 'cancelled' || normalized === 'canceled') return 'Cancelled';
  if (normalized === 'active') return 'Active';
  return 'Planning';
}

function normalizeMilestoneStatus(value: string | null | undefined): Milestone['status'] {
  const normalized = normalizeStatus(value);
  if (normalized === 'completed') return 'Completed';
  if (normalized === 'in progress') return 'In Progress';
  if (normalized === 'overdue') return 'Overdue';
  return 'Not Started';
}

function normalizeIssueStatus(value: string | null | undefined): Issue['status'] {
  const normalized = normalizeStatus(value);
  if (normalized === 'in progress') return 'In Progress';
  if (normalized === 'resolved') return 'Resolved';
  if (normalized === 'closed') return 'Closed';
  if (normalized === "won't fix" || normalized === 'wont fix') return "Won't Fix";
  return 'Open';
}

function normalizeIssueSeverity(value: string | null | undefined): Issue['severity'] {
  const normalized = normalizeStatus(value);
  if (normalized === 'critical') return 'Critical';
  if (normalized === 'major' || normalized === 'high') return 'Major';
  if (normalized === 'minor' || normalized === 'medium') return 'Minor';
  return 'Trivial';
}

function fallbackColor(id: string) {
  const palette = ['#3b82f6', '#8b5cf6', '#10b981', '#f97316', '#ef4444', '#14b8a6'];
  let hash = 0;
  for (const char of id) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return palette[hash % palette.length];
}

function buildTaskId(id: string) {
  return `TASK-${id.replace(/-/g, '').slice(0, 6).toUpperCase()}`;
}

function buildIssueId(id: string) {
  return `ISS-${id.replace(/-/g, '').slice(0, 6).toUpperCase()}`;
}

function userLookup(rows: UserRow[]) {
  const byId = new Map(rows.map(row => [row.id, row.full_name]));
  const byName = new Map(rows.map(row => [row.full_name.toLowerCase(), row.id]));
  return { byId, byName };
}

async function getProjectRows(organizationId: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('projects')
    .select('id,name')
    .eq('organization_id', organizationId);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ProjectRow[];
}

async function getUserRows() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('users').select('id,full_name');
  if (error) {
    throw new Error(error.message);
  }
  return (data ?? []) as UserRow[];
}

async function ensureDefaultWorkSeed(organizationId: string) {
  if (seededOrganizations.has(organizationId)) {
    return;
  }

  await listSupabaseProjects(organizationId);

  const cfg = getConfig();
  if (organizationId !== cfg.supabaseDefaultOrgId) {
    seededOrganizations.add(organizationId);
    return;
  }

  const supabase = getSupabaseAdmin();
  const [projectRows, userRows, taskCountRes, sprintCountRes, milestoneCountRes, issueCountRes] = await Promise.all([
    getProjectRows(organizationId),
    getUserRows(),
    supabase.from('tasks').select('id', { head: true, count: 'exact' }).eq('organization_id', organizationId),
    supabase.from('sprints').select('id', { head: true, count: 'exact' }).eq('organization_id', organizationId),
    supabase.from('milestones').select('id', { head: true, count: 'exact' }).eq('organization_id', organizationId),
    supabase.from('issues').select('id', { head: true, count: 'exact' }).eq('organization_id', organizationId),
  ]);

  if (taskCountRes.error) throw new Error(taskCountRes.error.message);
  if (sprintCountRes.error) throw new Error(sprintCountRes.error.message);
  if (milestoneCountRes.error) throw new Error(milestoneCountRes.error.message);
  if (issueCountRes.error) throw new Error(issueCountRes.error.message);

  const projectsByName = new Map(projectRows.map(row => [row.name, row.id]));
  const users = userLookup(userRows);

  if ((sprintCountRes.count ?? 0) === 0) {
    const rows = mockSprints
      .map(sprint => ({
        organization_id: organizationId,
        project_id: projectsByName.get(sprint.projectName),
        name: sprint.name,
        status: sprint.status,
        start_date: sprint.startDate || null,
        end_date: sprint.endDate || null,
        goal: sprint.goal ?? null,
      }))
      .filter((row): row is { organization_id: string; project_id: string; name: string; status: string; start_date: string | null; end_date: string | null; goal: string | null } => Boolean(row.project_id));

    if (rows.length > 0) {
      const { error } = await supabase.from('sprints').insert(rows);
      if (error) throw new Error(error.message);
    }
  }

  if ((milestoneCountRes.count ?? 0) === 0) {
    const rows = mockMilestones
      .map(milestone => ({
        organization_id: organizationId,
        project_id: projectsByName.get(milestone.projectName),
        name: milestone.name,
        status: milestone.status,
        due_date: milestone.endDate || null,
      }))
      .filter((row): row is { organization_id: string; project_id: string; name: string; status: string; due_date: string | null } => Boolean(row.project_id));

    if (rows.length > 0) {
      const { error } = await supabase.from('milestones').insert(rows);
      if (error) throw new Error(error.message);
    }
  }

  if ((taskCountRes.count ?? 0) === 0) {
    const rows = mockTasks
      .map(task => ({
        organization_id: organizationId,
        project_id: projectsByName.get(task.projectName),
        title: task.title,
        description: task.description ?? null,
        status: task.status,
        priority: task.priority,
        assignee_user_id: users.byName.get(task.assignee.toLowerCase()) ?? null,
        due_date: task.dueDate || null,
        created_by: null,
      }))
      .filter((row): row is { organization_id: string; project_id: string; title: string; description: string | null; status: string; priority: string; assignee_user_id: string | null; due_date: string | null; created_by: null } => Boolean(row.project_id));

    if (rows.length > 0) {
      const { error } = await supabase.from('tasks').insert(rows);
      if (error) throw new Error(error.message);
    }
  }

  if ((issueCountRes.count ?? 0) === 0) {
    const rows = mockIssues
      .map(issue => ({
        organization_id: organizationId,
        project_id: projectsByName.get(issue.projectName),
        task_id: null,
        title: issue.title,
        description: issue.description ?? null,
        severity: issue.severity,
        status: issue.status,
        reported_by: users.byName.get(issue.reporter.toLowerCase()) ?? null,
        assigned_to: users.byName.get(issue.assignee.toLowerCase()) ?? null,
      }))
      .filter((row): row is { organization_id: string; project_id: string; task_id: null; title: string; description: string | null; severity: string; status: string; reported_by: string | null; assigned_to: string | null } => Boolean(row.project_id));

    if (rows.length > 0) {
      const { error } = await supabase.from('issues').insert(rows);
      if (error) throw new Error(error.message);
    }
  }

  seededOrganizations.add(organizationId);
}

export async function listSupabaseTasks(organizationId: string): Promise<Task[]> {
  await ensureDefaultWorkSeed(organizationId);
  const supabase = getSupabaseAdmin();
  const [projects, users, tasksResult] = await Promise.all([
    getProjectRows(organizationId),
    getUserRows(),
    supabase
      .from('tasks')
      .select('id,project_id,title,description,status,priority,assignee_user_id,due_date,created_at')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false }),
  ]);

  if (tasksResult.error) throw new Error(tasksResult.error.message);

  const projectById = new Map(projects.map(project => [project.id, project.name]));
  const userById = new Map(users.map(user => [user.id, user.full_name]));
  const mockByTitle = new Map(mockTasks.map(task => [task.title, task]));

  return ((tasksResult.data ?? []) as DbTask[]).map(task => {
    const mock = mockByTitle.get(task.title);
    const projectName = task.project_id ? projectById.get(task.project_id) ?? mock?.projectName ?? 'General' : mock?.projectName ?? 'General';
    const assignee = task.assignee_user_id ? userById.get(task.assignee_user_id) ?? mock?.assignee ?? 'Unassigned' : mock?.assignee ?? 'Unassigned';
    const dueDate = task.due_date ?? mock?.dueDate ?? task.created_at.slice(0, 10);

    return {
      id: task.id,
      taskId: mock?.taskId ?? buildTaskId(task.id),
      title: task.title,
      projectId: task.project_id ?? mock?.projectId ?? '',
      projectName,
      projectColor: mock?.projectColor ?? fallbackColor(task.project_id ?? task.id),
      milestoneId: mock?.milestoneId,
      milestoneName: mock?.milestoneName,
      sprintId: mock?.sprintId,
      sprintName: mock?.sprintName,
      taskListId: mock?.taskListId,
      taskListName: mock?.taskListName,
      parentTaskId: mock?.parentTaskId,
      assignee,
      collaborators: mock?.collaborators,
      assigneeDepartment: mock?.assigneeDepartment ?? 'General',
      status: normalizeTaskStatus(task.status || mock?.status),
      priority: normalizePriority(task.priority || mock?.priority),
      startDate: mock?.startDate,
      dueDate,
      completedDate: mock?.completedDate,
      estimate: mock?.estimate ?? '0h',
      estimatedHours: mock?.estimatedHours ?? 0,
      actualTime: mock?.actualTime ?? '0h',
      actualHours: mock?.actualHours ?? 0,
      progress: mock?.progress ?? 0,
      billable: mock?.billable ?? false,
      hasEvidence: mock?.hasEvidence ?? false,
      evidenceCount: mock?.evidenceCount ?? 0,
      tags: mock?.tags,
      description: task.description ?? mock?.description,
      notes: mock?.notes,
      subtasks: mock?.subtasks,
      timeLogs: mock?.timeLogs,
      watchers: mock?.watchers,
      attachments: mock?.attachments ?? 0,
      comments: mock?.comments ?? 0,
      burnAmount: mock?.burnAmount ?? 0,
      profitImpact: mock?.profitImpact ?? 0,
      costImpact: mock?.costImpact ?? 0,
      approvalStatus: mock?.approvalStatus,
      submittedByEmployee: mock?.submittedByEmployee,
      submittedBy: mock?.submittedBy,
      storyPoints: mock?.storyPoints ?? 0,
      client: mock?.client,
    };
  });
}

export async function getSupabaseTask(organizationId: string, id: string): Promise<Task | null> {
  const tasks = await listSupabaseTasks(organizationId);
  return tasks.find(task => task.id === id) ?? null;
}

export async function createSupabaseTask(organizationId: string, userId: string, input: Omit<Task, 'id'>): Promise<Task> {
  await ensureDefaultWorkSeed(organizationId);
  const supabase = getSupabaseAdmin();
  const users = userLookup(await getUserRows());
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      organization_id: organizationId,
      project_id: input.projectId || null,
      title: input.title,
      description: input.description ?? null,
      status: input.status,
      priority: input.priority,
      assignee_user_id: users.byName.get(input.assignee.toLowerCase()) ?? null,
      due_date: input.dueDate || null,
      created_by: userId,
    })
    .select('id')
    .single();

  if (error) throw new Error(error.message);
  const task = await getSupabaseTask(organizationId, data.id);
  if (!task) throw new Error('Task was created but could not be loaded');
  return task;
}

export async function updateSupabaseTask(organizationId: string, id: string, input: Partial<Task>): Promise<Task | null> {
  const supabase = getSupabaseAdmin();
  const users = userLookup(await getUserRows());
  const patch: Record<string, unknown> = {};
  if (input.projectId !== undefined) patch.project_id = input.projectId || null;
  if (input.title !== undefined) patch.title = input.title;
  if (input.description !== undefined) patch.description = input.description ?? null;
  if (input.status !== undefined) patch.status = input.status;
  if (input.priority !== undefined) patch.priority = input.priority;
  if (input.assignee !== undefined) patch.assignee_user_id = users.byName.get(input.assignee.toLowerCase()) ?? null;
  if (input.dueDate !== undefined) patch.due_date = input.dueDate || null;

  const { error } = await supabase
    .from('tasks')
    .update(patch)
    .eq('organization_id', organizationId)
    .eq('id', id);

  if (error) throw new Error(error.message);
  return getSupabaseTask(organizationId, id);
}

export async function deleteSupabaseTask(organizationId: string, id: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { error, count } = await supabase
    .from('tasks')
    .delete({ count: 'exact' })
    .eq('organization_id', organizationId)
    .eq('id', id);

  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}

export async function listSupabaseSprints(organizationId: string): Promise<Sprint[]> {
  await ensureDefaultWorkSeed(organizationId);
  const supabase = getSupabaseAdmin();
  const [projects, sprintsResult] = await Promise.all([
    getProjectRows(organizationId),
    supabase
      .from('sprints')
      .select('id,project_id,name,status,start_date,end_date,goal,created_at')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false }),
  ]);

  if (sprintsResult.error) throw new Error(sprintsResult.error.message);
  const projectById = new Map(projects.map(project => [project.id, project.name]));
  const mockByName = new Map(mockSprints.map(sprint => [sprint.name, sprint]));

  return ((sprintsResult.data ?? []) as DbSprint[]).map(sprint => {
    const mock = mockByName.get(sprint.name);
    return {
      id: sprint.id,
      name: sprint.name,
      projectId: sprint.project_id,
      projectName: projectById.get(sprint.project_id) ?? mock?.projectName ?? 'General',
      status: normalizeSprintStatus(sprint.status || mock?.status),
      startDate: sprint.start_date ?? mock?.startDate ?? sprint.created_at.slice(0, 10),
      endDate: sprint.end_date ?? mock?.endDate ?? '',
      goal: sprint.goal ?? mock?.goal,
      velocity: mock?.velocity,
      storyPoints: mock?.storyPoints ?? 0,
      completedPoints: mock?.completedPoints ?? 0,
      taskCount: mock?.taskCount ?? 0,
      completedTasks: mock?.completedTasks ?? 0,
    };
  });
}

export async function getSupabaseSprint(organizationId: string, id: string): Promise<Sprint | null> {
  const sprints = await listSupabaseSprints(organizationId);
  return sprints.find(sprint => sprint.id === id) ?? null;
}

export async function createSupabaseSprint(organizationId: string, input: Omit<Sprint, 'id'>): Promise<Sprint> {
  await ensureDefaultWorkSeed(organizationId);
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('sprints')
    .insert({
      organization_id: organizationId,
      project_id: input.projectId,
      name: input.name,
      status: input.status,
      start_date: input.startDate || null,
      end_date: input.endDate || null,
      goal: input.goal ?? null,
    })
    .select('id')
    .single();

  if (error) throw new Error(error.message);
  const sprint = await getSupabaseSprint(organizationId, data.id);
  if (!sprint) throw new Error('Sprint was created but could not be loaded');
  return sprint;
}

export async function updateSupabaseSprint(organizationId: string, id: string, input: Partial<Sprint>): Promise<Sprint | null> {
  const supabase = getSupabaseAdmin();
  const patch: Record<string, unknown> = {};
  if (input.projectId !== undefined) patch.project_id = input.projectId;
  if (input.name !== undefined) patch.name = input.name;
  if (input.status !== undefined) patch.status = input.status;
  if (input.startDate !== undefined) patch.start_date = input.startDate || null;
  if (input.endDate !== undefined) patch.end_date = input.endDate || null;
  if (input.goal !== undefined) patch.goal = input.goal ?? null;

  const { error } = await supabase
    .from('sprints')
    .update(patch)
    .eq('organization_id', organizationId)
    .eq('id', id);

  if (error) throw new Error(error.message);
  return getSupabaseSprint(organizationId, id);
}

export async function listSupabaseMilestones(organizationId: string): Promise<Milestone[]> {
  await ensureDefaultWorkSeed(organizationId);
  const supabase = getSupabaseAdmin();
  const [projects, milestonesResult] = await Promise.all([
    getProjectRows(organizationId),
    supabase
      .from('milestones')
      .select('id,project_id,name,status,due_date,created_at')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false }),
  ]);

  if (milestonesResult.error) throw new Error(milestonesResult.error.message);
  const projectById = new Map(projects.map(project => [project.id, project.name]));
  const mockByName = new Map(mockMilestones.map(milestone => [milestone.name, milestone]));

  return ((milestonesResult.data ?? []) as DbMilestone[]).map(milestone => {
    const mock = mockByName.get(milestone.name);
    return {
      id: milestone.id,
      projectId: milestone.project_id,
      projectName: projectById.get(milestone.project_id) ?? mock?.projectName ?? 'General',
      name: milestone.name,
      owner: mock?.owner ?? '',
      startDate: mock?.startDate ?? milestone.created_at.slice(0, 10),
      endDate: milestone.due_date ?? mock?.endDate ?? '',
      progress: mock?.progress ?? 0,
      status: normalizeMilestoneStatus(milestone.status || mock?.status),
      taskCount: mock?.taskCount ?? 0,
      completedTasks: mock?.completedTasks ?? 0,
      isInternal: mock?.isInternal,
      notes: mock?.notes,
      budget: mock?.budget,
      spent: mock?.spent,
    };
  });
}

export async function getSupabaseMilestone(organizationId: string, id: string): Promise<Milestone | null> {
  const milestones = await listSupabaseMilestones(organizationId);
  return milestones.find(milestone => milestone.id === id) ?? null;
}

export async function createSupabaseMilestone(organizationId: string, input: Omit<Milestone, 'id'>): Promise<Milestone> {
  await ensureDefaultWorkSeed(organizationId);
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('milestones')
    .insert({
      organization_id: organizationId,
      project_id: input.projectId,
      name: input.name,
      status: input.status,
      due_date: input.endDate || null,
    })
    .select('id')
    .single();

  if (error) throw new Error(error.message);
  const milestone = await getSupabaseMilestone(organizationId, data.id);
  if (!milestone) throw new Error('Milestone was created but could not be loaded');
  return milestone;
}

export async function updateSupabaseMilestone(organizationId: string, id: string, input: Partial<Milestone>): Promise<Milestone | null> {
  const supabase = getSupabaseAdmin();
  const patch: Record<string, unknown> = {};
  if (input.projectId !== undefined) patch.project_id = input.projectId;
  if (input.name !== undefined) patch.name = input.name;
  if (input.status !== undefined) patch.status = input.status;
  if (input.endDate !== undefined) patch.due_date = input.endDate || null;

  const { error } = await supabase
    .from('milestones')
    .update(patch)
    .eq('organization_id', organizationId)
    .eq('id', id);

  if (error) throw new Error(error.message);
  return getSupabaseMilestone(organizationId, id);
}

export async function deleteSupabaseMilestone(organizationId: string, id: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { error, count } = await supabase
    .from('milestones')
    .delete({ count: 'exact' })
    .eq('organization_id', organizationId)
    .eq('id', id);

  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}

export async function listSupabaseIssues(organizationId: string): Promise<Issue[]> {
  await ensureDefaultWorkSeed(organizationId);
  const supabase = getSupabaseAdmin();
  const [projects, users, issuesResult] = await Promise.all([
    getProjectRows(organizationId),
    getUserRows(),
    supabase
      .from('issues')
      .select('id,project_id,task_id,title,description,severity,status,reported_by,assigned_to,created_at')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false }),
  ]);

  if (issuesResult.error) throw new Error(issuesResult.error.message);

  const projectById = new Map(projects.map(project => [project.id, project.name]));
  const userById = new Map(users.map(user => [user.id, user.full_name]));
  const mockByTitle = new Map(mockIssues.map(issue => [issue.title, issue]));

  return ((issuesResult.data ?? []) as DbIssue[]).map(issue => {
    const mock = mockByTitle.get(issue.title);
    return {
      id: issue.id,
      issueId: mock?.issueId ?? buildIssueId(issue.id),
      title: issue.title,
      projectId: issue.project_id ?? mock?.projectId ?? '',
      projectName: issue.project_id ? projectById.get(issue.project_id) ?? mock?.projectName ?? 'General' : mock?.projectName ?? 'General',
      status: normalizeIssueStatus(issue.status || mock?.status),
      severity: normalizeIssueSeverity(issue.severity || mock?.severity),
      assignee: issue.assigned_to ? userById.get(issue.assigned_to) ?? mock?.assignee ?? 'Unassigned' : mock?.assignee ?? 'Unassigned',
      reporter: issue.reported_by ? userById.get(issue.reported_by) ?? mock?.reporter ?? 'Unknown' : mock?.reporter ?? 'Unknown',
      dueDate: mock?.dueDate ?? issue.created_at.slice(0, 10),
      createdAt: issue.created_at,
      description: issue.description ?? mock?.description,
      linkedTaskId: mock?.linkedTaskId ?? issue.task_id ?? undefined,
      module: mock?.module,
      reproducible: mock?.reproducible,
      comments: mock?.comments ?? 0,
    };
  });
}

export async function getSupabaseIssue(organizationId: string, id: string): Promise<Issue | null> {
  const issues = await listSupabaseIssues(organizationId);
  return issues.find(issue => issue.id === id) ?? null;
}

export async function createSupabaseIssue(organizationId: string, input: Omit<Issue, 'id'>): Promise<Issue> {
  await ensureDefaultWorkSeed(organizationId);
  const supabase = getSupabaseAdmin();
  const users = userLookup(await getUserRows());
  const { data, error } = await supabase
    .from('issues')
    .insert({
      organization_id: organizationId,
      project_id: input.projectId || null,
      task_id: input.linkedTaskId || null,
      title: input.title,
      description: input.description ?? null,
      severity: input.severity,
      status: input.status,
      reported_by: users.byName.get(input.reporter.toLowerCase()) ?? null,
      assigned_to: users.byName.get(input.assignee.toLowerCase()) ?? null,
    })
    .select('id')
    .single();

  if (error) throw new Error(error.message);
  const issue = await getSupabaseIssue(organizationId, data.id);
  if (!issue) throw new Error('Issue was created but could not be loaded');
  return issue;
}

export async function updateSupabaseIssue(organizationId: string, id: string, input: Partial<Issue>): Promise<Issue | null> {
  const supabase = getSupabaseAdmin();
  const users = userLookup(await getUserRows());
  const patch: Record<string, unknown> = {};
  if (input.projectId !== undefined) patch.project_id = input.projectId || null;
  if (input.linkedTaskId !== undefined) patch.task_id = input.linkedTaskId || null;
  if (input.title !== undefined) patch.title = input.title;
  if (input.description !== undefined) patch.description = input.description ?? null;
  if (input.severity !== undefined) patch.severity = input.severity;
  if (input.status !== undefined) patch.status = input.status;
  if (input.reporter !== undefined) patch.reported_by = users.byName.get(input.reporter.toLowerCase()) ?? null;
  if (input.assignee !== undefined) patch.assigned_to = users.byName.get(input.assignee.toLowerCase()) ?? null;

  const { error } = await supabase
    .from('issues')
    .update(patch)
    .eq('organization_id', organizationId)
    .eq('id', id);

  if (error) throw new Error(error.message);
  return getSupabaseIssue(organizationId, id);
}
