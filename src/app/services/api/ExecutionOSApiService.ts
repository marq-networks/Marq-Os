/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXECUTION OS API SERVICE — Real HTTP Implementation (Phase 12)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Concrete implementation of IExecutionOSService using real HTTP calls.
 * Covers the Work domain: Projects, Tasks, Sprints, Milestones, Issues,
 * Team Members, Time Logs, and Dependencies.
 *
 * TO ACTIVATE:
 *   1. In ExecutionOSContext.tsx, import this service
 *   2. Replace useState + mockData with API calls
 *   3. Or add to ServiceRegistry and create a useExecutionOSData() hook
 *
 * See SWAP_GUIDE.ts Step 4 for detailed instructions.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { ApiService } from '../ApiService';
import type { IExecutionOSService } from '../contracts';
import type {
  Project, Task, Sprint, Milestone, Issue, TeamMember, TimeLog,
  TaskDependency, TaskStatus,
  QueryParams, PaginatedResponse,
} from '../types';
import { ENDPOINTS } from '../config';

export class ExecutionOSApiService extends ApiService implements IExecutionOSService {
  // ─── Projects ──────────────────────────────────────────────────────────

  async getProjects(params?: QueryParams): Promise<PaginatedResponse<Project>> {
    return this.get<PaginatedResponse<Project>>(ENDPOINTS.PROJECTS, params as any);
  }

  async getProjectById(id: string): Promise<Project> {
    return this.get<Project>(`${ENDPOINTS.PROJECTS}/${id}`);
  }

  async createProject(data: Omit<Project, 'id'>): Promise<Project> {
    return this.post<Project>(ENDPOINTS.PROJECTS, data);
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    return this.patch<Project>(`${ENDPOINTS.PROJECTS}/${id}`, data);
  }

  async deleteProject(id: string): Promise<void> {
    return this.delete(`${ENDPOINTS.PROJECTS}/${id}`);
  }

  // ─── Tasks ─────────────────────────────────────────────────────────────

  async getTasks(params?: QueryParams): Promise<PaginatedResponse<Task>> {
    return this.get<PaginatedResponse<Task>>(ENDPOINTS.TASKS, params as any);
  }

  async getTaskById(id: string): Promise<Task> {
    return this.get<Task>(`${ENDPOINTS.TASKS}/${id}`);
  }

  async createTask(data: Omit<Task, 'id'>): Promise<Task> {
    return this.post<Task>(ENDPOINTS.TASKS, data);
  }

  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    return this.patch<Task>(`${ENDPOINTS.TASKS}/${id}`, data);
  }

  async deleteTask(id: string): Promise<void> {
    return this.delete(`${ENDPOINTS.TASKS}/${id}`);
  }

  async changeTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    return this.patch<Task>(`${ENDPOINTS.TASKS}/${id}/status`, { status });
  }

  // ─── Sprints ───────────────────────────────────────────────────────────

  async getSprints(params?: QueryParams): Promise<PaginatedResponse<Sprint>> {
    return this.get<PaginatedResponse<Sprint>>(ENDPOINTS.SPRINTS, params as any);
  }

  async getSprintById(id: string): Promise<Sprint> {
    return this.get<Sprint>(`${ENDPOINTS.SPRINTS}/${id}`);
  }

  async createSprint(data: Omit<Sprint, 'id'>): Promise<Sprint> {
    return this.post<Sprint>(ENDPOINTS.SPRINTS, data);
  }

  async updateSprint(id: string, data: Partial<Sprint>): Promise<Sprint> {
    return this.patch<Sprint>(`${ENDPOINTS.SPRINTS}/${id}`, data);
  }

  // ─── Milestones ────────────────────────────────────────────────────────

  async getMilestones(params?: QueryParams): Promise<PaginatedResponse<Milestone>> {
    return this.get<PaginatedResponse<Milestone>>(ENDPOINTS.MILESTONES, params as any);
  }

  async getMilestoneById(id: string): Promise<Milestone> {
    return this.get<Milestone>(`${ENDPOINTS.MILESTONES}/${id}`);
  }

  async createMilestone(data: Omit<Milestone, 'id'>): Promise<Milestone> {
    return this.post<Milestone>(ENDPOINTS.MILESTONES, data);
  }

  async updateMilestone(id: string, data: Partial<Milestone>): Promise<Milestone> {
    return this.patch<Milestone>(`${ENDPOINTS.MILESTONES}/${id}`, data);
  }

  async deleteMilestone(id: string): Promise<void> {
    return this.delete(`${ENDPOINTS.MILESTONES}/${id}`);
  }

  // ─── Issues ────────────────────────────────────────────────────────────

  async getIssues(params?: QueryParams): Promise<PaginatedResponse<Issue>> {
    return this.get<PaginatedResponse<Issue>>(ENDPOINTS.ISSUES, params as any);
  }

  async getIssueById(id: string): Promise<Issue> {
    return this.get<Issue>(`${ENDPOINTS.ISSUES}/${id}`);
  }

  async createIssue(data: Omit<Issue, 'id'>): Promise<Issue> {
    return this.post<Issue>(ENDPOINTS.ISSUES, data);
  }

  async updateIssue(id: string, data: Partial<Issue>): Promise<Issue> {
    return this.patch<Issue>(`${ENDPOINTS.ISSUES}/${id}`, data);
  }

  // ─── Team & Time Logs ─────────────────────────────────────────────────

  async getTeamMembers(params?: QueryParams): Promise<PaginatedResponse<TeamMember>> {
    return this.get<PaginatedResponse<TeamMember>>(ENDPOINTS.TEAM_MEMBERS, params as any);
  }

  async getTimeLogs(params?: QueryParams): Promise<PaginatedResponse<TimeLog>> {
    return this.get<PaginatedResponse<TimeLog>>(ENDPOINTS.TIME_LOGS, params as any);
  }

  async createTimeLog(data: Omit<TimeLog, 'id'>): Promise<TimeLog> {
    return this.post<TimeLog>(ENDPOINTS.TIME_LOGS, data);
  }

  // ─── Dependencies ──────────────────────────────────────────────────────

  async getDependencies(taskId: string): Promise<TaskDependency[]> {
    return this.get<TaskDependency[]>(`${ENDPOINTS.TASKS}/${taskId}/dependencies`);
  }

  async addDependency(data: TaskDependency): Promise<TaskDependency> {
    return this.post<TaskDependency>(`${ENDPOINTS.TASKS}/${data.fromTaskId}/dependencies`, data);
  }

  async removeDependency(fromId: string, toId: string): Promise<void> {
    return this.delete(`${ENDPOINTS.TASKS}/${fromId}/dependencies/${toId}`);
  }
}
