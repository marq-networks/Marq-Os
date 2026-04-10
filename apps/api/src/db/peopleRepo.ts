import type { Department, Employee, RoleDefinition } from '../../../src/app/services/types';
import { getSupabaseAdmin } from './supabaseAdmin';

type DbDepartment = {
  id: string;
  name: string;
  description: string | null;
  lead_user_id: string | null;
  member_count: number;
  budget: string | number;
  parent_department_id: string | null;
  status: 'Active' | 'Archived';
  created_at: string;
};

type DbEmployee = {
  id: string;
  department_id: string;
  job_title: string;
  employment_type: 'Full-time' | 'Part-time' | 'Contract' | 'Intern';
  salary: string | number | null;
  phone: string | null;
  location: string | null;
  join_date: string;
  last_seen_at: string | null;
  status: 'Active' | 'Away' | 'Offline' | 'Suspended' | 'Deactivated';
  skills: string[] | null;
  users?: { full_name: string; email: string; avatar_url: string | null } | null;
  departments?: { name: string } | null;
  manager_employee_id: string | null;
};

type DbRole = {
  id: string;
  name: string;
  description: string;
  is_system: boolean;
  created_at: string;
};

export async function listDepartments(organizationId: string): Promise<Department[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('departments')
    .select('id,name,description,lead_user_id,member_count,budget,parent_department_id,status,created_at')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data as DbDepartment[]).map((d) => ({
    id: d.id,
    name: d.name,
    description: d.description ?? undefined,
    lead: '', // hydrated via UI (or join users later)
    leadId: d.lead_user_id ?? '',
    memberCount: d.member_count,
    budget: Number(d.budget),
    parentDepartmentId: d.parent_department_id ?? undefined,
    createdAt: d.created_at,
    status: d.status,
  }));
}

export async function getDepartment(organizationId: string, id: string): Promise<Department | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('departments')
    .select('id,name,description,lead_user_id,member_count,budget,parent_department_id,status,created_at')
    .eq('organization_id', organizationId)
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const d = data as DbDepartment;
  return {
    id: d.id,
    name: d.name,
    description: d.description ?? undefined,
    lead: '',
    leadId: d.lead_user_id ?? '',
    memberCount: d.member_count,
    budget: Number(d.budget),
    parentDepartmentId: d.parent_department_id ?? undefined,
    createdAt: d.created_at,
    status: d.status,
  };
}

export async function createDepartment(organizationId: string, input: Omit<Department, 'id'>): Promise<Department> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('departments')
    .insert({
      organization_id: organizationId,
      name: input.name,
      description: input.description ?? null,
      lead_user_id: input.leadId || null,
      member_count: input.memberCount ?? 0,
      budget: input.budget ?? 0,
      parent_department_id: input.parentDepartmentId ?? null,
      status: input.status ?? 'Active',
    })
    .select('id,name,description,lead_user_id,member_count,budget,parent_department_id,status,created_at')
    .single();
  if (error) throw new Error(error.message);
  const d = data as DbDepartment;
  return {
    id: d.id,
    name: d.name,
    description: d.description ?? undefined,
    lead: input.lead,
    leadId: d.lead_user_id ?? '',
    memberCount: d.member_count,
    budget: Number(d.budget),
    parentDepartmentId: d.parent_department_id ?? undefined,
    createdAt: d.created_at,
    status: d.status,
  };
}

export async function listEmployees(organizationId: string, departmentId?: string): Promise<Employee[]> {
  const supabase = getSupabaseAdmin();
  let q = supabase
    .from('employees')
    .select(
      'id,department_id,job_title,employment_type,salary,phone,location,join_date,last_seen_at,status,skills,manager_employee_id,departments:departments!employees_department_id_fkey(name),users:users!employees_user_id_fkey(full_name,email,avatar_url)',
    )
    .eq('organization_id', organizationId);
  if (departmentId) q = q.eq('department_id', departmentId);
  const { data, error } = await q.order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data as DbEmployee[]).map((e) => ({
    id: e.id,
    name: e.users?.full_name ?? 'Unknown',
    email: e.users?.email ?? '',
    role: e.job_title,
    department: e.departments?.name ?? '',
    departmentId: e.department_id,
    status: e.status,
    lastSeen: e.last_seen_at ?? '',
    joinDate: e.join_date,
    phone: e.phone ?? undefined,
    location: e.location ?? undefined,
    manager: undefined,
    managerId: e.manager_employee_id ?? undefined,
    skills: e.skills ?? undefined,
    salary: e.salary === null ? undefined : Number(e.salary),
    employmentType: e.employment_type,
    avatar: e.users?.avatar_url ?? undefined,
  }));
}

export async function getEmployee(organizationId: string, id: string): Promise<Employee | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('employees')
    .select(
      'id,department_id,job_title,employment_type,salary,phone,location,join_date,last_seen_at,status,skills,manager_employee_id,departments:departments!employees_department_id_fkey(name),users:users!employees_user_id_fkey(full_name,email,avatar_url)',
    )
    .eq('organization_id', organizationId)
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const e = data as DbEmployee;
  return {
    id: e.id,
    name: e.users?.full_name ?? 'Unknown',
    email: e.users?.email ?? '',
    role: e.job_title,
    department: e.departments?.name ?? '',
    departmentId: e.department_id,
    status: e.status,
    lastSeen: e.last_seen_at ?? '',
    joinDate: e.join_date,
    phone: e.phone ?? undefined,
    location: e.location ?? undefined,
    manager: undefined,
    managerId: e.manager_employee_id ?? undefined,
    skills: e.skills ?? undefined,
    salary: e.salary === null ? undefined : Number(e.salary),
    employmentType: e.employment_type,
    avatar: e.users?.avatar_url ?? undefined,
  };
}

export async function listRoles(organizationId: string): Promise<RoleDefinition[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('roles')
    .select('id,name,description,is_system,created_at')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data as DbRole[]).map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description ?? '',
    permissions: [],
    userCount: 0,
    isSystem: r.is_system,
    createdAt: r.created_at,
  }));
}

