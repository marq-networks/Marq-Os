import type { TaskDependency, TaskList, TeamMember, TimeLog } from '../../../../src/app/services/types';
import { mockDependencies, mockMilestones, mockSprints, mockTaskLists, mockTasks, mockTeamMembers, mockTimeLogs } from '../../../../src/app/components/screens/work/workMockData';
import { getConfig } from '../config';
import { getSupabaseAdmin } from './supabaseAdmin';

type ProjectRow = { id: string; name: string };
type UserRow = { id: string; full_name: string };
type EmployeeRow = {
  id: string;
  user_id: string | null;
  job_title: string;
  status: string;
  skills: string[] | null;
  departments: { name: string } | { name: string }[] | null;
  users: { full_name: string } | { full_name: string }[] | null;
};
type TaskRow = {
  id: string;
  title: string;
  project_id: string | null;
  status: string;
  assignee_user_id: string | null;
};
type SprintRow = { id: string; name: string };
type MilestoneRow = { id: string; name: string };
type TimeLogRow = {
  id: string;
  task_id: string | null;
  employee_id: string | null;
  log_date: string;
  minutes: number;
  note: string | null;
  billable: boolean;
};
type DependencyRow = {
  from_task_id: string;
  to_task_id: string;
  type: 'blocks' | 'relates_to' | 'duplicates' | null;
};

const seededOrganizations = new Set<string>();

function isMissingSchemaObject(error: { message?: string } | null | undefined, objectName: string) {
  return Boolean(error?.message?.toLowerCase().includes(objectName.toLowerCase()));
}

function singleRelation<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

function taskStatusClosed(value: string | null | undefined) {
  const normalized = String(value ?? '').trim().toLowerCase();
  return normalized === 'closed' || normalized === 'done' || normalized === 'completed';
}

function parseDuration(hours: number) {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  if (wholeHours > 0 && minutes > 0) return `${wholeHours}h ${minutes}m`;
  if (wholeHours > 0) return `${wholeHours}h`;
  return `${minutes}m`;
}

async function getProjectRows(organizationId: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('projects')
    .select('id,name')
    .eq('organization_id', organizationId);

  if (error) throw new Error(error.message);
  return (data ?? []) as ProjectRow[];
}

async function getTaskRows(organizationId: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('tasks')
    .select('id,title,project_id,status,assignee_user_id')
    .eq('organization_id', organizationId);

  if (error) throw new Error(error.message);
  return (data ?? []) as TaskRow[];
}

async function getUserRows() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('users').select('id,full_name');
  if (error) throw new Error(error.message);
  return (data ?? []) as UserRow[];
}

async function getEmployeeRows(organizationId: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('employees')
    .select('id,user_id,job_title,status,skills,departments:departments!employees_department_id_fkey(name),users:users!employees_user_id_fkey(full_name)')
    .eq('organization_id', organizationId);

  if (error) throw new Error(error.message);
  return (data ?? []) as EmployeeRow[];
}

async function getSprintRows(organizationId: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('sprints').select('id,name').eq('organization_id', organizationId);
  if (error) throw new Error(error.message);
  return (data ?? []) as SprintRow[];
}

async function getMilestoneRows(organizationId: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('milestones').select('id,name').eq('organization_id', organizationId);
  if (error) throw new Error(error.message);
  return (data ?? []) as MilestoneRow[];
}

async function ensureDefaultSupportSeed(organizationId: string) {
  if (seededOrganizations.has(organizationId)) {
    return;
  }

  if (organizationId !== getConfig().supabaseDefaultOrgId) {
    seededOrganizations.add(organizationId);
    return;
  }

  const supabase = getSupabaseAdmin();
  const [projects, tasks, users, employees, sprints, milestones] = await Promise.all([
    getProjectRows(organizationId),
    getTaskRows(organizationId),
    getUserRows(),
    getEmployeeRows(organizationId),
    getSprintRows(organizationId),
    getMilestoneRows(organizationId),
  ]);

  const [timeLogCountRes, depCountRes] = await Promise.all([
    supabase.from('time_logs').select('id', { head: true, count: 'exact' }).eq('organization_id', organizationId),
    supabase.from('task_dependencies').select('from_task_id', { head: true, count: 'exact' }).eq('organization_id', organizationId),
  ]);
  if (timeLogCountRes.error) throw new Error(timeLogCountRes.error.message);
  if (depCountRes.error) throw new Error(depCountRes.error.message);

  const mockTaskTitleById = new Map(mockTasks.map(task => [task.id, task.title]));
  const taskIdByTitle = new Map(tasks.map(task => [task.title, task.id]));
  const userIdByName = new Map(users.map(user => [user.full_name.toLowerCase(), user.id]));
  const employeeByUserId = new Map(employees.map(employee => [employee.user_id ?? '', employee.id]));

  if ((timeLogCountRes.count ?? 0) === 0) {
    const rows = mockTimeLogs
      .map(log => {
        const title = mockTaskTitleById.get(log.taskId);
        const taskId = title ? taskIdByTitle.get(title) ?? null : null;
        const userId = userIdByName.get(log.loggedBy.toLowerCase()) ?? null;
        const employeeId = userId ? employeeByUserId.get(userId) ?? null : null;
        return {
          organization_id: organizationId,
          task_id: taskId,
          employee_id: employeeId,
          log_date: log.date,
          minutes: Math.round(log.hours * 60),
          note: log.description,
          billable: log.billable,
        };
      })
      .filter(row => row.task_id || row.employee_id);

    if (rows.length > 0) {
      const { error } = await supabase.from('time_logs').insert(rows);
      if (error) {
        if (!isMissingSchemaObject(error, 'billable')) throw new Error(error.message);
        const legacyRows = rows.map(({ billable, ...rest }) => rest);
        const legacyInsert = await supabase.from('time_logs').insert(legacyRows);
        if (legacyInsert.error) throw new Error(legacyInsert.error.message);
      }
    }
  }

  if ((depCountRes.count ?? 0) === 0) {
    const rows = mockDependencies
      .map(dep => {
        const fromTitle = mockTaskTitleById.get(dep.fromTaskId);
        const toTitle = mockTaskTitleById.get(dep.toTaskId);
        const fromTaskId = fromTitle ? taskIdByTitle.get(fromTitle) ?? null : null;
        const toTaskId = toTitle ? taskIdByTitle.get(toTitle) ?? null : null;
        return fromTaskId && toTaskId
          ? {
              organization_id: organizationId,
              from_task_id: fromTaskId,
              to_task_id: toTaskId,
              type: dep.type,
            }
          : null;
      })
      .filter((row): row is { organization_id: string; from_task_id: string; to_task_id: string; type: 'blocks' | 'relates_to' | 'duplicates' } => Boolean(row));

    if (rows.length > 0) {
      const { error } = await supabase.from('task_dependencies').insert(rows);
      if (error) {
        if (!isMissingSchemaObject(error, 'type')) throw new Error(error.message);
        const legacyRows = rows.map(({ type, ...rest }) => rest);
        const legacyInsert = await supabase.from('task_dependencies').insert(legacyRows);
        if (legacyInsert.error) throw new Error(legacyInsert.error.message);
      }
    }
  }

  seededOrganizations.add(organizationId);
}

export async function listSupabaseTaskLists(organizationId: string): Promise<TaskList[]> {
  await ensureDefaultSupportSeed(organizationId);
  const tasks = await getTaskRows(organizationId);
  const mockByTitle = new Map(mockTasks.map(task => [task.title, task]));
  const grouped = new Map<string, TaskList>();

  tasks.forEach((task, index) => {
    const mock = mockByTitle.get(task.title);
    if (!mock?.taskListId || !mock.taskListName || !task.project_id) return;
    const existing = grouped.get(mock.taskListId);
    if (existing) {
      existing.taskCount += 1;
      if (taskStatusClosed(task.status)) existing.completedTasks += 1;
      existing.status = existing.completedTasks >= existing.taskCount ? 'Completed' : 'Active';
      return;
    }
    grouped.set(mock.taskListId, {
      id: mock.taskListId,
      name: mock.taskListName,
      projectId: task.project_id,
      milestoneId: mock.milestoneId,
      sprintId: mock.sprintId,
      status: taskStatusClosed(task.status) ? 'Completed' : 'Active',
      taskCount: 1,
      completedTasks: taskStatusClosed(task.status) ? 1 : 0,
      order: mockTaskLists.find(list => list.id === mock.taskListId)?.order ?? index,
    });
  });

  return [...grouped.values()].sort((a, b) => a.order - b.order);
}

export async function getSupabaseTaskList(organizationId: string, id: string): Promise<TaskList | null> {
  const lists = await listSupabaseTaskLists(organizationId);
  return lists.find(list => list.id === id) ?? null;
}

export async function createSupabaseTaskList(organizationId: string, input: Omit<TaskList, 'id'>): Promise<TaskList> {
  void organizationId;
  return { id: `task-list-${Date.now()}`, ...input };
}

export async function updateSupabaseTaskList(organizationId: string, id: string, input: Partial<TaskList>): Promise<TaskList | null> {
  const current = await getSupabaseTaskList(organizationId, id);
  if (!current) return null;
  return { ...current, ...input };
}

export async function deleteSupabaseTaskList(organizationId: string, id: string): Promise<boolean> {
  const current = await getSupabaseTaskList(organizationId, id);
  return Boolean(current);
}

export async function listSupabaseTeamMembers(organizationId: string): Promise<TeamMember[]> {
  await ensureDefaultSupportSeed(organizationId);
  const [employees, tasks] = await Promise.all([
    getEmployeeRows(organizationId),
    getTaskRows(organizationId),
  ]);

  const mockByName = new Map(mockTeamMembers.map(member => [member.name, member]));

  return employees.map(employee => {
    const user = singleRelation(employee.users);
    const department = singleRelation(employee.departments);
    const name = user?.full_name ?? mockTeamMembers[0]?.name ?? 'Unknown';
    const memberTasks = tasks.filter(task => task.assignee_user_id === employee.user_id);
    const completedTasks = memberTasks.filter(task => taskStatusClosed(task.status)).length;
    const mock = mockByName.get(name);
    const assignedTasks = memberTasks.length;
    const availability = Math.max(0, 40 - assignedTasks * 4);
    const currentLoad = Math.min(100, Math.round((assignedTasks * 4 / 40) * 100));

    return {
      id: employee.id,
      name,
      department: department?.name ?? mock?.department ?? 'General',
      role: employee.job_title || mock?.role || 'Team Member',
      currentLoad: mock?.currentLoad ?? currentLoad,
      capacity: mock?.capacity ?? 40,
      assignedTasks,
      completedTasks,
      skills: employee.skills ?? mock?.skills ?? [],
      availability: mock?.availability ?? availability,
    };
  });
}

export async function listSupabaseTimeLogs(organizationId: string): Promise<TimeLog[]> {
  await ensureDefaultSupportSeed(organizationId);
  const supabase = getSupabaseAdmin();
  const [tasks, employees, logsResult] = await Promise.all([
    getTaskRows(organizationId),
    getEmployeeRows(organizationId),
    supabase
      .from('time_logs')
      .select('id,task_id,employee_id,log_date,minutes,note,billable')
      .eq('organization_id', organizationId)
      .order('log_date', { ascending: false }),
  ]);

  const taskTitleById = new Map(tasks.map(task => [task.id, task.title]));
  const employeeNameById = new Map(
    employees.map(employee => [employee.id, singleRelation(employee.users)?.full_name ?? 'Unknown']),
  );
  const mockByDescription = new Map(mockTimeLogs.map(log => [log.description, log]));

  if (logsResult.error) {
    if (!isMissingSchemaObject(logsResult.error, 'billable')) {
      throw new Error(logsResult.error.message);
    }

    const legacyLogs = await supabase
      .from('time_logs')
      .select('id,task_id,employee_id,log_date,minutes,note')
      .eq('organization_id', organizationId)
      .order('log_date', { ascending: false });

    if (legacyLogs.error) throw new Error(legacyLogs.error.message);
    return ((legacyLogs.data ?? []) as Array<Omit<TimeLogRow, 'billable'> & { billable?: boolean }>).map(log => {
      const mock = new Map(mockTimeLogs.map(item => [item.description, item])).get(log.note ?? '');
      const hours = Number((log.minutes / 60).toFixed(2));
      return {
        id: log.id,
        taskId: log.task_id ?? mock?.taskId ?? '',
        date: log.log_date,
        duration: mock?.duration ?? parseDuration(hours),
        hours,
        description: log.note ?? '',
        loggedBy: log.employee_id ? employeeNameById.get(log.employee_id) ?? mock?.loggedBy ?? 'Unknown' : mock?.loggedBy ?? 'Unknown',
        billable: mock?.billable ?? false,
      };
    });
  }

  return ((logsResult.data ?? []) as TimeLogRow[]).map(log => {
    const mock = mockByDescription.get(log.note ?? '');
    const hours = Number((log.minutes / 60).toFixed(2));
    const taskTitle = log.task_id ? taskTitleById.get(log.task_id) ?? null : null;
    const mockTask = mock && mockTasks.find(task => task.id === mock.taskId);
    const actualTask = tasks.find(task => task.id === log.task_id);

    return {
      id: log.id,
      taskId: log.task_id ?? mock?.taskId ?? '',
      date: log.log_date,
      duration: mock?.duration ?? parseDuration(hours),
      hours,
      description: log.note ?? '',
      loggedBy: log.employee_id ? employeeNameById.get(log.employee_id) ?? mock?.loggedBy ?? 'Unknown' : mock?.loggedBy ?? 'Unknown',
      billable: log.billable,
    };
  });
}

export async function createSupabaseTimeLog(organizationId: string, input: Omit<TimeLog, 'id'>): Promise<TimeLog> {
  const supabase = getSupabaseAdmin();
  const users = await getUserRows();
  const employees = await getEmployeeRows(organizationId);
  const userId = users.find(user => user.full_name.toLowerCase() === input.loggedBy.toLowerCase())?.id;
  const employeeId = employees.find(employee => employee.user_id === userId)?.id ?? null;

  const { data, error } = await supabase
    .from('time_logs')
    .insert({
      organization_id: organizationId,
      task_id: input.taskId || null,
      employee_id: employeeId,
      log_date: input.date,
      minutes: Math.round(input.hours * 60),
      note: input.description,
      billable: input.billable,
    })
    .select('id')
    .single();

  if (error) {
    if (!isMissingSchemaObject(error, 'billable')) throw new Error(error.message);
    const legacy = await supabase
      .from('time_logs')
      .insert({
        organization_id: organizationId,
        task_id: input.taskId || null,
        employee_id: employeeId,
        log_date: input.date,
        minutes: Math.round(input.hours * 60),
        note: input.description,
      })
      .select('id')
      .single();
    if (legacy.error) throw new Error(legacy.error.message);
    const logs = await listSupabaseTimeLogs(organizationId);
    const created = logs.find(log => log.id === legacy.data.id);
    if (!created) throw new Error('Time log was created but could not be loaded');
    return created;
  }
  const logs = await listSupabaseTimeLogs(organizationId);
  const created = logs.find(log => log.id === data.id);
  if (!created) throw new Error('Time log was created but could not be loaded');
  return created;
}

export async function listSupabaseDependencies(organizationId: string, taskId: string): Promise<TaskDependency[]> {
  await ensureDefaultSupportSeed(organizationId);
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('task_dependencies')
    .select('from_task_id,to_task_id,type')
    .eq('organization_id', organizationId)
    .or(`from_task_id.eq.${taskId},to_task_id.eq.${taskId}`);

  if (error) {
    if (!isMissingSchemaObject(error, 'type')) throw new Error(error.message);
    const legacy = await supabase
      .from('task_dependencies')
      .select('from_task_id,to_task_id')
      .eq('organization_id', organizationId)
      .or(`from_task_id.eq.${taskId},to_task_id.eq.${taskId}`);
    if (legacy.error) throw new Error(legacy.error.message);
    return ((legacy.data ?? []) as Array<Omit<DependencyRow, 'type'>>).map(row => ({
      id: `${row.from_task_id}:${row.to_task_id}`,
      fromTaskId: row.from_task_id,
      toTaskId: row.to_task_id,
      type: 'blocks',
    }));
  }

  return ((data ?? []) as DependencyRow[]).map(row => ({
    id: `${row.from_task_id}:${row.to_task_id}`,
    fromTaskId: row.from_task_id,
    toTaskId: row.to_task_id,
    type: row.type ?? 'blocks',
  }));
}

export async function addSupabaseDependency(organizationId: string, input: TaskDependency): Promise<TaskDependency> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('task_dependencies').upsert({
    organization_id: organizationId,
    from_task_id: input.fromTaskId,
    to_task_id: input.toTaskId,
    type: input.type,
  });

  if (error) {
    if (!isMissingSchemaObject(error, 'type')) throw new Error(error.message);
    const legacy = await supabase.from('task_dependencies').upsert({
      organization_id: organizationId,
      from_task_id: input.fromTaskId,
      to_task_id: input.toTaskId,
    });
    if (legacy.error) throw new Error(legacy.error.message);
  }
  return {
    id: input.id || `${input.fromTaskId}:${input.toTaskId}`,
    fromTaskId: input.fromTaskId,
    toTaskId: input.toTaskId,
    type: input.type,
  };
}

export async function removeSupabaseDependency(organizationId: string, fromId: string, toId: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { error, count } = await supabase
    .from('task_dependencies')
    .delete({ count: 'exact' })
    .eq('organization_id', organizationId)
    .eq('from_task_id', fromId)
    .eq('to_task_id', toId);

  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}
