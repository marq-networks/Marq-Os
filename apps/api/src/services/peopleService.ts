import type {
  Department,
  Employee,
  PaginatedResponse,
  QueryParams,
  RoleDefinition,
} from '../../../src/app/services/types';
import { getConfig } from '../config';
import * as peopleRepo from '../db/peopleRepo';
import { getStore } from '../store';
import { paginate, parsePageParams } from '../utils/pagination';

function applyQuery<T extends Record<string, unknown>>(items: T[], params?: QueryParams): T[] {
  const search = params?.search?.toLowerCase();
  if (!search) return items;
  return items.filter((x) => JSON.stringify(x).toLowerCase().includes(search));
}

type ListQuery = Record<string, unknown>;

export async function listEmployeesPaginated(
  organizationId: string,
  query: ListQuery,
): Promise<PaginatedResponse<Employee>> {
  const { page, pageSize, search } = parsePageParams(query);
  const departmentId = typeof query.departmentId === 'string' ? query.departmentId : undefined;

  if (getConfig().useSupabaseDb) {
    const items = await peopleRepo.listEmployees(organizationId, departmentId);
    const filtered = applyQuery(items as unknown as Record<string, unknown>[], { search } as QueryParams);
    return paginate(filtered as Employee[], page, pageSize);
  }

  const { employees } = getStore();
  const base = departmentId ? employees.filter((e) => e.departmentId === departmentId) : employees;
  const filtered = applyQuery(base as unknown as Record<string, unknown>[], { search } as QueryParams);
  return paginate(filtered as Employee[], page, pageSize);
}

export async function getEmployeeById(organizationId: string, id: string): Promise<Employee | null> {
  if (getConfig().useSupabaseDb) {
    return peopleRepo.getEmployee(organizationId, id);
  }
  const { employees } = getStore();
  return employees.find((e) => e.id === id) ?? null;
}

export async function listDepartmentsPaginated(
  organizationId: string,
  query: ListQuery,
): Promise<PaginatedResponse<Department>> {
  const { page, pageSize, search } = parsePageParams(query);

  if (getConfig().useSupabaseDb) {
    const items = await peopleRepo.listDepartments(organizationId);
    const filtered = applyQuery(items as unknown as Record<string, unknown>[], { search } as QueryParams);
    return paginate(filtered as Department[], page, pageSize);
  }

  const { departments } = getStore();
  const filtered = applyQuery(departments as unknown as Record<string, unknown>[], { search } as QueryParams);
  return paginate(filtered as Department[], page, pageSize);
}

export async function getDepartmentById(organizationId: string, id: string): Promise<Department | null> {
  if (getConfig().useSupabaseDb) {
    return peopleRepo.getDepartment(organizationId, id);
  }
  const { departments } = getStore();
  return departments.find((d) => d.id === id) ?? null;
}

export async function createDepartmentForOrg(
  organizationId: string,
  input: Omit<Department, 'id'>,
): Promise<Department> {
  if (getConfig().useSupabaseDb) {
    return peopleRepo.createDepartment(organizationId, input);
  }
  const { departments } = getStore();
  const id = crypto.randomUUID();
  const dept: Department = { id, ...input };
  departments.unshift(dept);
  return dept;
}

export async function listRolesPaginated(
  organizationId: string,
  query: ListQuery,
): Promise<PaginatedResponse<RoleDefinition>> {
  const { page, pageSize, search } = parsePageParams(query);

  if (getConfig().useSupabaseDb) {
    const items = await peopleRepo.listRoles(organizationId);
    const filtered = applyQuery(items as unknown as Record<string, unknown>[], { search } as QueryParams);
    return paginate(filtered as RoleDefinition[], page, pageSize);
  }

  const { roles } = getStore();
  const filtered = applyQuery(roles as Record<string, unknown>[], { search } as QueryParams);
  return paginate(filtered as RoleDefinition[], page, pageSize);
}
