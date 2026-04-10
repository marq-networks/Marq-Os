import type { Project, ProjectStatus } from '../../../../src/app/services/types';
import { mockProjects } from '../../../../src/app/components/screens/work/workMockData';
import { getConfig } from '../config';
import { getSupabaseAdmin } from './supabaseAdmin';

type DbProject = {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  status: string;
  owner_user_id: string | null;
  start_date: string | null;
  target_end_date: string | null;
  created_at: string;
  updated_at: string;
};

type TaskRow = {
  project_id: string | null;
  status: string;
  assignee_user_id: string | null;
};

type MilestoneRow = {
  project_id: string;
};

type SprintRow = {
  project_id: string;
};

type IssueRow = {
  project_id: string | null;
  status: string | null;
};

type UserRow = {
  id: string;
  full_name: string;
};

const seededOrganizations = new Set<string>();

function normalizeStatus(value: string | null | undefined) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, ' ');
}

function toProjectStatus(value: string | null | undefined): ProjectStatus {
  const normalized = normalizeStatus(value);
  if (normalized === 'completed' || normalized === 'complete') return 'Completed';
  if (normalized === 'on hold' || normalized === 'paused') return 'On Hold';
  if (normalized === 'at risk' || normalized === 'risk') return 'At Risk';
  if (normalized === 'cancelled' || normalized === 'canceled') return 'Cancelled';
  return 'Active';
}

function toDbProjectStatus(value: string | null | undefined) {
  const normalized = normalizeStatus(value);
  if (normalized === 'completed' || normalized === 'complete') return 'completed';
  if (normalized === 'on hold' || normalized === 'paused') return 'on_hold';
  if (normalized === 'at risk' || normalized === 'risk') return 'at_risk';
  if (normalized === 'cancelled' || normalized === 'canceled') return 'cancelled';
  return 'active';
}

function toPriority(value: string | null | undefined): Project['priority'] {
  const normalized = normalizeStatus(value);
  if (normalized === 'critical') return 'Critical';
  if (normalized === 'high') return 'High';
  if (normalized === 'low') return 'Low';
  if (normalized === 'none') return 'None';
  return 'Medium';
}

function toProfitRisk(value: string | null | undefined): Project['profitRisk'] {
  const normalized = normalizeStatus(value);
  if (normalized === 'high') return 'High';
  if (normalized === 'medium') return 'Medium';
  if (normalized === 'low') return 'Low';
  return 'None';
}

function numberValue(value: string | number | null | undefined) {
  return Number(value ?? 0);
}

function isClosedTaskStatus(value: string | null | undefined) {
  const normalized = normalizeStatus(value);
  return normalized === 'closed' || normalized === 'completed' || normalized === 'done';
}

function isOpenIssueStatus(value: string | null | undefined) {
  const normalized = normalizeStatus(value);
  return normalized !== 'closed' && normalized !== 'resolved' && normalized !== "won't fix" && normalized !== 'wont fix';
}

function fallbackColor(id: string) {
  const palette = ['#3b82f6', '#8b5cf6', '#10b981', '#f97316', '#ef4444', '#14b8a6'];
  let hash = 0;
  for (const char of id) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return palette[hash % palette.length];
}

function buildProject(
  project: DbProject,
  usersById: Map<string, string>,
  tasks: TaskRow[],
  milestones: MilestoneRow[],
  sprints: SprintRow[],
  issues: IssueRow[],
): Project {
  const projectTasks = tasks.filter(task => task.project_id === project.id);
  const projectMilestones = milestones.filter(milestone => milestone.project_id === project.id);
  const projectSprints = sprints.filter(sprint => sprint.project_id === project.id);
  const projectIssues = issues.filter(issue => issue.project_id === project.id);
  const completedTasks = projectTasks.filter(task => isClosedTaskStatus(task.status)).length;
  const openIssues = projectIssues.filter(issue => isOpenIssueStatus(issue.status)).length;
  const team = [...new Set(
    projectTasks
      .map(task => task.assignee_user_id ? usersById.get(task.assignee_user_id) : null)
      .filter((name): name is string => Boolean(name)),
  )];

  return {
    id: project.id,
    name: project.name,
    code: project.name.slice(0, 3).toUpperCase(),
    client: 'Internal',
    department: 'General',
    status: toProjectStatus(project.status),
    priority: 'Medium',
    startDate: project.start_date ?? project.created_at.slice(0, 10),
    endDate: project.target_end_date ?? '',
    progress: projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0,
    budget: 0,
    spent: 0,
    burnRate: 0,
    profitRisk: 'None',
    team,
    teamLead: project.owner_user_id ? usersById.get(project.owner_user_id) ?? '' : '',
    description: project.description ?? undefined,
    color: fallbackColor(project.id),
    billingModel: 'Fixed',
    currency: 'USD',
    projectedMargin: 0,
    billableHours: 0,
    nonBillableHours: 0,
    taskCount: projectTasks.length,
    openTaskCount: projectTasks.length - completedTasks,
    milestoneCount: projectMilestones.length,
    openIssueCount: openIssues,
    sprintCount: projectSprints.length,
  };
}

async function ensureDefaultProjectsSeed(organizationId: string) {
  if (seededOrganizations.has(organizationId)) {
    return;
  }

  const supabase = getSupabaseAdmin();
  const { count, error: countError } = await supabase
    .from('projects')
    .select('id', { count: 'exact', head: true })
    .eq('organization_id', organizationId);

  if (countError) {
    throw new Error(countError.message);
  }

  if ((count ?? 0) === 0 && organizationId === getConfig().supabaseDefaultOrgId) {
    const rows = mockProjects.map(project => ({
      organization_id: organizationId,
      name: project.name,
      description: project.description ?? null,
      status: toDbProjectStatus(project.status),
      owner_user_id: null,
      start_date: project.startDate || null,
      target_end_date: project.endDate || null,
    }));

    const { error } = await supabase.from('projects').insert(rows);
    if (error) {
      throw new Error(error.message);
    }
  }

  seededOrganizations.add(organizationId);
}

export async function listSupabaseProjects(organizationId: string): Promise<Project[]> {
  await ensureDefaultProjectsSeed(organizationId);
  const supabase = getSupabaseAdmin();

  const [projectsResult, tasksResult, milestonesResult, sprintsResult, issuesResult, usersResult] = await Promise.all([
    supabase
      .from('projects')
      .select('id,organization_id,name,description,status,owner_user_id,start_date,target_end_date,created_at,updated_at')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false }),
    supabase
      .from('tasks')
      .select('project_id,status,assignee_user_id')
      .eq('organization_id', organizationId),
    supabase
      .from('milestones')
      .select('project_id')
      .eq('organization_id', organizationId),
    supabase
      .from('sprints')
      .select('project_id')
      .eq('organization_id', organizationId),
    supabase
      .from('issues')
      .select('project_id,status')
      .eq('organization_id', organizationId),
    supabase
      .from('users')
      .select('id,full_name'),
  ]);

  if (projectsResult.error) throw new Error(projectsResult.error.message);
  if (tasksResult.error) throw new Error(tasksResult.error.message);
  if (milestonesResult.error) throw new Error(milestonesResult.error.message);
  if (sprintsResult.error) throw new Error(sprintsResult.error.message);
  if (issuesResult.error) throw new Error(issuesResult.error.message);
  if (usersResult.error) throw new Error(usersResult.error.message);

  const usersById = new Map((usersResult.data ?? []).map((user: UserRow) => [user.id, user.full_name]));

  return (projectsResult.data as DbProject[]).map(project =>
    buildProject(
      project,
      usersById,
      (tasksResult.data ?? []) as TaskRow[],
      (milestonesResult.data ?? []) as MilestoneRow[],
      (sprintsResult.data ?? []) as SprintRow[],
      (issuesResult.data ?? []) as IssueRow[],
    ),
  );
}

export async function getSupabaseProject(organizationId: string, id: string): Promise<Project | null> {
  const projects = await listSupabaseProjects(organizationId);
  return projects.find(project => project.id === id) ?? null;
}

function toProjectInsert(organizationId: string, input: Omit<Project, 'id'>, ownerUserId?: string) {
  return {
    organization_id: organizationId,
    name: input.name,
    description: input.description ?? null,
    status: toDbProjectStatus(input.status),
    owner_user_id: ownerUserId ?? null,
    start_date: input.startDate || null,
    target_end_date: input.endDate || null,
  };
}

function toProjectPatch(input: Partial<Project>) {
  const patch: Record<string, unknown> = {};
  if (input.name !== undefined) patch.name = input.name;
  if (input.description !== undefined) patch.description = input.description ?? null;
  if (input.status !== undefined) patch.status = toDbProjectStatus(input.status);
  if (input.startDate !== undefined) patch.start_date = input.startDate || null;
  if (input.endDate !== undefined) patch.target_end_date = input.endDate || null;
  return patch;
}

export async function createSupabaseProject(
  organizationId: string,
  input: Omit<Project, 'id'>,
  ownerUserId?: string,
): Promise<Project> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('projects')
    .insert(toProjectInsert(organizationId, input, ownerUserId))
    .select('id')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const project = await getSupabaseProject(organizationId, data.id);
  if (!project) {
    throw new Error('Project was created but could not be loaded');
  }
  return project;
}

export async function updateSupabaseProject(
  organizationId: string,
  id: string,
  input: Partial<Project>,
): Promise<Project | null> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('projects')
    .update(toProjectPatch(input))
    .eq('organization_id', organizationId)
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return getSupabaseProject(organizationId, id);
}

export async function deleteSupabaseProject(organizationId: string, id: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { error, count } = await supabase
    .from('projects')
    .delete({ count: 'exact' })
    .eq('organization_id', organizationId)
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return (count ?? 0) > 0;
}
