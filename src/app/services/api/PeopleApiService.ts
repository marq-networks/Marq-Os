/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PEOPLE API SERVICE — Real HTTP Implementation
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Concrete implementation of IPeopleService using real HTTP calls.
 *
 * TO ACTIVATE: In ServiceProvider.tsx replace mock peopleService with:
 *   const peopleService = new PeopleApiService();
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { ApiService } from '../ApiService';
import type { IPeopleService } from '../contracts';
import type {
  Employee, Department, RoleDefinition,
  QueryParams, PaginatedResponse,
} from '../types';
import { ENDPOINTS } from '../config';

export class PeopleApiService extends ApiService implements IPeopleService {
  // ─── Employees ─────────────────────────────────────────────────────────

  async getEmployees(params?: QueryParams): Promise<PaginatedResponse<Employee>> {
    return this.get<PaginatedResponse<Employee>>(ENDPOINTS.EMPLOYEES, params as any);
  }

  async getEmployeeById(id: string): Promise<Employee> {
    return this.get<Employee>(`${ENDPOINTS.EMPLOYEES}/${id}`);
  }

  async createEmployee(data: Omit<Employee, 'id'>): Promise<Employee> {
    return this.post<Employee>(ENDPOINTS.EMPLOYEES, data);
  }

  async updateEmployee(id: string, data: Partial<Employee>): Promise<Employee> {
    return this.patch<Employee>(`${ENDPOINTS.EMPLOYEES}/${id}`, data);
  }

  async deleteEmployee(id: string): Promise<void> {
    return this.delete(`${ENDPOINTS.EMPLOYEES}/${id}`);
  }

  async getEmployeesByDepartment(departmentId: string): Promise<Employee[]> {
    return this.get<Employee[]>(ENDPOINTS.EMPLOYEES, {
      departmentId,
      pageSize: 500,
    } as any);
  }

  // ─── Departments ────────────────────────────────────────────────────────

  async getDepartments(params?: QueryParams): Promise<PaginatedResponse<Department>> {
    return this.get<PaginatedResponse<Department>>(ENDPOINTS.DEPARTMENTS, params as any);
  }

  async getDepartmentById(id: string): Promise<Department> {
    return this.get<Department>(`${ENDPOINTS.DEPARTMENTS}/${id}`);
  }

  async createDepartment(data: Omit<Department, 'id'>): Promise<Department> {
    return this.post<Department>(ENDPOINTS.DEPARTMENTS, data);
  }

  async updateDepartment(id: string, data: Partial<Department>): Promise<Department> {
    return this.patch<Department>(`${ENDPOINTS.DEPARTMENTS}/${id}`, data);
  }

  async deleteDepartment(id: string): Promise<void> {
    return this.delete(`${ENDPOINTS.DEPARTMENTS}/${id}`);
  }

  // ─── Roles ──────────────────────────────────────────────────────────────

  async getRoles(params?: QueryParams): Promise<PaginatedResponse<RoleDefinition>> {
    return this.get<PaginatedResponse<RoleDefinition>>(ENDPOINTS.ROLES, params as any);
  }

  async getRoleById(id: string): Promise<RoleDefinition> {
    return this.get<RoleDefinition>(`${ENDPOINTS.ROLES}/${id}`);
  }

  async createRole(data: Omit<RoleDefinition, 'id'>): Promise<RoleDefinition> {
    return this.post<RoleDefinition>(ENDPOINTS.ROLES, data);
  }

  async updateRole(id: string, data: Partial<RoleDefinition>): Promise<RoleDefinition> {
    return this.patch<RoleDefinition>(`${ENDPOINTS.ROLES}/${id}`, data);
  }

  async deleteRole(id: string): Promise<void> {
    return this.delete(`${ENDPOINTS.ROLES}/${id}`);
  }
}
