/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXECUTION OS MOCK SERVICE — Phase 14 gap closure (FL-004 / PV-001)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * PROBLEM (PV-001):
 *   ServiceRegistry.executionOS was optional and unimplemented.
 *   ExecutionOSContext bypassed the standardized service registry entirely,
 *   meaning `USE_MOCK_SERVICES = false` could never swap the work domain.
 *
 * SOLUTION:
 *   This class implements IExecutionOSService with its own in-memory state
 *   (a class-level copy of workMockData). It is instantiated once in
 *   ServiceProvider and registered as `executionOS` (now required).
 *
 * COEXISTENCE WITH ExecutionOSContext:
 *   ExecutionOSContext.tsx is intentionally kept. It drives React UI state
 *   (optimistic sync updates, activityFeed, emails, skillRatings, burndown —
 *   richer state not needed in the API contract).
 *   This service is the SWAP SURFACE: swap HTTP service ↔ mock class below.
 *
 * API SWAP:
 *   1. Create `ExecutionOSApiService.ts` implementing IExecutionOSService with
 *      real fetch() calls.
 *   2. Replace `executionOSService: new ExecutionOSMockService()` in
 *      ServiceProvider with `executionOSService: new ExecutionOSApiService()`.
 *   3. Update `useExecutionOS()` in ExecutionOSContext to delegate mutations to
 *      the service (so React state stays in sync with the API).
 *   See SWAP_GUIDE.ts Step 5 for the full migration checklist.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type {
  Project, Sprint, Milestone, Task, Issue, TeamMember, TimeLog,
  TaskDependency, TaskStatus, ProjectStatus, SprintStatus, MilestoneStatus,
  QueryParams, PaginatedResponse,
} from './types';

import type { IExecutionOSService } from './contracts';

import {
  mockProjects, mockSprints, mockMilestones, mockTasks,
  mockTeamMembers, mockIssues, mockTimeLogs, mockDependencies,
} from '../components/screens/work/workMockData';

// ─── Shared utilities (duplicated to avoid coupling to ServiceProvider) ───────
function eosPaginate<T>(items: T[], params?: QueryParams): PaginatedResponse<T> {
  const page     = params?.page     ?? 1;
  const pageSize = params?.pageSize ?? 50;
  const start    = (page - 1) * pageSize;
  const data     = items.slice(start, start + pageSize);
  return { data, total: items.length, page, pageSize, hasMore: start + pageSize < items.length };
}

function eosSearch<T extends Record<string, any>>(
  items: T[], search?: string, fields: string[] = ['name']
): T[] {
  if (!search) return items;
  const q = search.toLowerCase();
  return items.filter(item => fields.some(f => String(item[f] ?? '').toLowerCase().includes(q)));
}

let eosCounter = Date.now();
function eosId(prefix: string): string { return `${prefix}${++eosCounter}`; }

// ─────────────────────────────────────────────────────────────────────────────

export class ExecutionOSMockService implements IExecutionOSService {

  // ─── Mutable in-memory stores ───────────────────────────────────────────
  private _projects:    Project[]       = [...mockProjects];
  private _sprints:     Sprint[]        = [...mockSprints];
  private _milestones:  Milestone[]     = [...mockMilestones];
  private _tasks:       Task[]          = [...mockTasks];
  private _issues:      Issue[]         = [...mockIssues];
  private _teamMembers: TeamMember[]    = [...mockTeamMembers];
  private _timeLogs:    TimeLog[]       = [...mockTimeLogs];
  private _deps:        TaskDependency[] = [...mockDependencies];

  // ═══════════════════════════════════════════════════════════════════════
  // PROJECTS
  // ═══════════════════════════════════════════════════════════════════════

  async getProjects(params?: QueryParams): Promise<PaginatedResponse<Project>> {
    const filtered = eosSearch(this._projects, params?.search, ['name', 'client', 'department']);
    return eosPaginate(filtered, params);
  }

  async getProjectById(id: string): Promise<Project> {
    const p = this._projects.find(p => p.id === id);
    if (!p) throw new Error(`Project '${id}' not found`);
    return { ...p };
  }

  async createProject(data: Omit<Project, 'id'>): Promise<Project> {
    const p: Project = { ...data, id: eosId('proj') };
    this._projects = [...this._projects, p];
    return { ...p };
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const idx = this._projects.findIndex(p => p.id === id);
    if (idx === -1) throw new Error(`Project '${id}' not found`);
    const updated = { ...this._projects[idx], ...data };
    this._projects = this._projects.map(p => p.id === id ? updated : p);
    return { ...updated };
  }

  async deleteProject(id: string): Promise<void> {
    this._projects = this._projects.filter(p => p.id !== id);
  }

  async changeProjectStatus(id: string, status: ProjectStatus): Promise<Project> {
    return this.updateProject(id, { status });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // TASKS
  // ═══════════════════════════════════════════════════════════════════════

  async getTasks(params?: QueryParams): Promise<PaginatedResponse<Task>> {
    const filtered = eosSearch(this._tasks, params?.search, ['title', 'assignee', 'projectName']);
    return eosPaginate(filtered, params);
  }

  async getTaskById(id: string): Promise<Task> {
    const t = this._tasks.find(t => t.id === id);
    if (!t) throw new Error(`Task '${id}' not found`);
    return { ...t };
  }

  async createTask(data: Omit<Task, 'id'>): Promise<Task> {
    const t: Task = { ...data, id: eosId('task') };
    this._tasks = [t, ...this._tasks];
    return { ...t };
  }

  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    const idx = this._tasks.findIndex(t => t.id === id);
    if (idx === -1) throw new Error(`Task '${id}' not found`);
    const updated = { ...this._tasks[idx], ...data };
    this._tasks = this._tasks.map(t => t.id === id ? updated : t);
    return { ...updated };
  }

  async deleteTask(id: string): Promise<void> {
    this._tasks = this._tasks.filter(t => t.id !== id);
  }

  async changeTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    return this.updateTask(id, { status });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SPRINTS
  // ═══════════════════════════════════════════════════════════════════════

  async getSprints(params?: QueryParams): Promise<PaginatedResponse<Sprint>> {
    const filtered = eosSearch(this._sprints, params?.search, ['name', 'projectName']);
    return eosPaginate(filtered, params);
  }

  async getSprintById(id: string): Promise<Sprint> {
    const s = this._sprints.find(s => s.id === id);
    if (!s) throw new Error(`Sprint '${id}' not found`);
    return { ...s };
  }

  async createSprint(data: Omit<Sprint, 'id'>): Promise<Sprint> {
    const s: Sprint = { ...data, id: eosId('spr') };
    this._sprints = [...this._sprints, s];
    return { ...s };
  }

  async updateSprint(id: string, data: Partial<Sprint>): Promise<Sprint> {
    const idx = this._sprints.findIndex(s => s.id === id);
    if (idx === -1) throw new Error(`Sprint '${id}' not found`);
    const updated = { ...this._sprints[idx], ...data };
    this._sprints = this._sprints.map(s => s.id === id ? updated : s);
    return { ...updated };
  }

  async changeSprintStatus(id: string, status: SprintStatus): Promise<Sprint> {
    return this.updateSprint(id, { status });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MILESTONES
  // ═══════════════════════════════════════════════════════════════════════

  async getMilestones(params?: QueryParams): Promise<PaginatedResponse<Milestone>> {
    const filtered = eosSearch(this._milestones, params?.search, ['title', 'projectName']);
    return eosPaginate(filtered, params);
  }

  async getMilestoneById(id: string): Promise<Milestone> {
    const m = this._milestones.find(m => m.id === id);
    if (!m) throw new Error(`Milestone '${id}' not found`);
    return { ...m };
  }

  async createMilestone(data: Omit<Milestone, 'id'>): Promise<Milestone> {
    const m: Milestone = { ...data, id: eosId('ms') };
    this._milestones = [...this._milestones, m];
    return { ...m };
  }

  async updateMilestone(id: string, data: Partial<Milestone>): Promise<Milestone> {
    const idx = this._milestones.findIndex(m => m.id === id);
    if (idx === -1) throw new Error(`Milestone '${id}' not found`);
    const updated = { ...this._milestones[idx], ...data };
    this._milestones = this._milestones.map(m => m.id === id ? updated : m);
    return { ...updated };
  }

  async deleteMilestone(id: string): Promise<void> {
    this._milestones = this._milestones.filter(m => m.id !== id);
  }

  async changeMilestoneStatus(id: string, status: MilestoneStatus): Promise<Milestone> {
    return this.updateMilestone(id, { status });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // ISSUES
  // ═══════════════════════════════════════════════════════════════════════

  async getIssues(params?: QueryParams): Promise<PaginatedResponse<Issue>> {
    const filtered = eosSearch(this._issues, params?.search, ['title', 'reportedBy', 'assignee']);
    return eosPaginate(filtered, params);
  }

  async getIssueById(id: string): Promise<Issue> {
    const i = this._issues.find(i => i.id === id);
    if (!i) throw new Error(`Issue '${id}' not found`);
    return { ...i };
  }

  async createIssue(data: Omit<Issue, 'id'>): Promise<Issue> {
    const i: Issue = { ...data, id: eosId('iss') };
    this._issues = [i, ...this._issues];
    return { ...i };
  }

  async updateIssue(id: string, data: Partial<Issue>): Promise<Issue> {
    const idx = this._issues.findIndex(i => i.id === id);
    if (idx === -1) throw new Error(`Issue '${id}' not found`);
    const updated = { ...this._issues[idx], ...data };
    this._issues = this._issues.map(i => i.id === id ? updated : i);
    return { ...updated };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // TEAM MEMBERS & TIME LOGS
  // ═══════════════════════════════════════════════════════════════════════

  async getTeamMembers(params?: QueryParams): Promise<PaginatedResponse<TeamMember>> {
    const filtered = eosSearch(this._teamMembers, params?.search, ['name', 'role', 'department']);
    return eosPaginate(filtered, params);
  }

  async getTimeLogs(params?: QueryParams): Promise<PaginatedResponse<TimeLog>> {
    const filtered = eosSearch(this._timeLogs, params?.search, ['taskTitle', 'member']);
    return eosPaginate(filtered, params);
  }

  async createTimeLog(data: Omit<TimeLog, 'id'>): Promise<TimeLog> {
    const tl: TimeLog = { ...data, id: eosId('tl') };
    this._timeLogs = [tl, ...this._timeLogs];
    return { ...tl };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // TASK DEPENDENCIES
  // ═══════════════════════════════════════════════════════════════════════

  async getDependencies(taskId: string): Promise<TaskDependency[]> {
    return this._deps.filter(d => d.fromTaskId === taskId || d.toTaskId === taskId);
  }

  async addDependency(data: TaskDependency): Promise<TaskDependency> {
    const existing = this._deps.find(
      d => d.fromTaskId === data.fromTaskId && d.toTaskId === data.toTaskId
    );
    if (existing) return { ...existing };
    const dep: TaskDependency = { ...data, id: eosId('dep') };
    this._deps = [...this._deps, dep];
    return { ...dep };
  }

  async removeDependency(fromId: string, toId: string): Promise<void> {
    this._deps = this._deps.filter(
      d => !(d.fromTaskId === fromId && d.toTaskId === toId)
    );
  }
}

/**
 * Module-level singleton — created once when ServiceProvider mounts.
 * The instance lives as long as the React app does (same lifetime as
 * all other service instances in ServiceProvider).
 *
 * SWAP NOTE: When wiring a real API, replace this export with:
 *   export const executionOSService = new ExecutionOSApiService(API_BASE_URL);
 */
export const executionOSService = new ExecutionOSMockService();
