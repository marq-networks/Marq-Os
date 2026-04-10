import { createClient, type User } from '@supabase/supabase-js';
import type { AuthUser, Organization, UserRole } from '../../../src/app/services/types';
import { getConfig } from '../config';
import { getSupabaseAdmin } from './supabaseAdmin';

type ProfileRow = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  status: 'Active' | 'Away' | 'Offline' | 'Suspended' | 'Deactivated';
};

type OrganizationRow = {
  id: string;
  name: string;
  plan: 'Free' | 'Starter' | 'Professional' | 'Enterprise';
  seats: number;
  used_seats: number;
  created_at: string;
  status: 'Active' | 'Suspended' | 'Trial';
};

type MembershipRow = {
  organization_id: string;
  is_default: boolean;
  organizations: OrganizationRow | OrganizationRow[] | null;
  roles: { name: string } | { name: string }[] | null;
};

function isUserRole(value: unknown): value is UserRole {
  return value === 'employee' || value === 'org_admin' || value === 'platform_admin';
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

function singleRelation<T>(value: T | T[] | null | undefined): T | null {
  if (!value) {
    return null;
  }
  return Array.isArray(value) ? value[0] ?? null : value;
}

function toOrganization(row: OrganizationRow): Organization {
  return {
    id: row.id,
    name: row.name,
    plan: row.plan,
    seats: row.seats,
    usedSeats: row.used_seats,
    createdAt: row.created_at,
    status: row.status,
  };
}

function buildAuthUser(profile: ProfileRow, role: UserRole, organizationId: string): AuthUser {
  return {
    id: profile.id,
    name: profile.full_name,
    email: profile.email,
    role,
    avatar: profile.avatar_url ?? undefined,
    organizationId,
  };
}

function resolveRole(authUser: User | null, memberships: MembershipRow[]): UserRole {
  const metadataRole = authUser?.app_metadata?.role;
  if (isUserRole(metadataRole)) {
    return metadataRole;
  }

  const defaultMembership = memberships.find((membership) => membership.is_default) ?? memberships[0];
  const roleName = singleRelation(defaultMembership?.roles)?.name?.toLowerCase() ?? '';
  if (roleName.includes('admin')) {
    return 'org_admin';
  }
  return 'employee';
}

async function getAuthClient() {
  const cfg = getConfig();
  if (!cfg.supabaseUrl || !cfg.supabaseAnonKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  }

  return createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

async function listMemberships(userId: string): Promise<MembershipRow[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('organization_memberships')
    .select('organization_id,is_default,organizations(id,name,plan,seats,used_seats,created_at,status),roles(name)')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as MembershipRow[];
}

async function getProfile(userId: string): Promise<ProfileRow | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('users')
    .select('id,email,full_name,avatar_url,status')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as ProfileRow | null) ?? null;
}

async function getAuthAdminUserById(userId: string): Promise<User | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.admin.getUserById(userId);
  if (error) {
    throw new Error(error.message);
  }
  return data.user ?? null;
}

async function findAuthUserByEmail(email: string): Promise<User | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) {
    throw new Error(error.message);
  }

  return data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase()) ?? null;
}

async function ensureDefaultOrganizationExists(organizationId: string) {
  const supabase = getSupabaseAdmin();
  const { data: existing, error: readError } = await supabase
    .from('organizations')
    .select('id')
    .eq('id', organizationId)
    .maybeSingle();

  if (readError) {
    throw new Error(readError.message);
  }

  if (existing?.id) {
    return;
  }

  const { error } = await supabase
    .from('organizations')
    .insert({
      id: organizationId,
      slug: 'demo-org',
      name: 'Demo Organization',
      plan: 'Starter',
      seats: 25,
      used_seats: 3,
      status: 'Active',
    });

  if (error) {
    throw new Error(error.message);
  }
}

async function ensureDefaultDepartmentExists(organizationId: string): Promise<string> {
  const supabase = getSupabaseAdmin();
  const { data: existing, error: readError } = await supabase
    .from('departments')
    .select('id')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (readError) {
    throw new Error(readError.message);
  }

  if (existing?.id) {
    return existing.id;
  }

  const { data, error } = await supabase
    .from('departments')
    .insert({
      organization_id: organizationId,
      name: 'General',
      description: 'Default department',
      member_count: 1,
      budget: 0,
      status: 'Active',
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data.id;
}

async function ensureEmployeeRecord(organizationId: string, userId: string, departmentId: string) {
  const supabase = getSupabaseAdmin();
  const { data: existing, error: readError } = await supabase
    .from('employees')
    .select('id')
    .eq('organization_id', organizationId)
    .eq('user_id', userId)
    .maybeSingle();

  if (readError) {
    throw new Error(readError.message);
  }

  if (existing?.id) {
    return;
  }

  const { error } = await supabase
    .from('employees')
    .insert({
      organization_id: organizationId,
      user_id: userId,
      department_id: departmentId,
      job_title: 'Employee',
      employment_type: 'Full-time',
      salary: 0,
      join_date: new Date().toISOString().slice(0, 10),
      status: 'Active',
      skills: [],
    });

  if (error) {
    throw new Error(error.message);
  }
}

async function ensureOrganizationAdminRole(organizationId: string): Promise<string> {
  const supabase = getSupabaseAdmin();
  await ensureDefaultOrganizationExists(organizationId);
  const { data: existing, error: readError } = await supabase
    .from('roles')
    .select('id')
    .eq('organization_id', organizationId)
    .eq('name', 'Organization Admin')
    .maybeSingle();

  if (readError) {
    throw new Error(readError.message);
  }

  if (existing?.id) {
    return existing.id;
  }

  const { data, error } = await supabase
    .from('roles')
    .insert({
      organization_id: organizationId,
      name: 'Organization Admin',
      description: 'Full administrative access within the organization',
      is_system: true,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data.id;
}

async function upsertPublicUser(user: User, name: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('users')
    .upsert({
      id: user.id,
      email: user.email ?? '',
      full_name: name,
      avatar_url: user.user_metadata?.avatar_url ?? null,
      status: 'Active',
    }, { onConflict: 'id' });

  if (error) {
    throw new Error(error.message);
  }
}

async function ensureMembership(userId: string, organizationId: string, roleId: string | null) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('organization_memberships')
    .upsert({
      user_id: userId,
      organization_id: organizationId,
      role_id: roleId,
      is_default: true,
    }, { onConflict: 'organization_id,user_id' });

  if (error) {
    throw new Error(error.message);
  }
}

async function linkEmployeeAccount(organizationId: string, userId: string, employeeId?: string) {
  const supabase = getSupabaseAdmin();

  if (employeeId) {
    const { error } = await supabase
      .from('employees')
      .update({ user_id: userId })
      .eq('organization_id', organizationId)
      .eq('id', employeeId);

    if (error) {
      throw new Error(error.message);
    }
    return;
  }

  const { data, error } = await supabase
    .from('employees')
    .select('id')
    .eq('organization_id', organizationId)
    .is('user_id', null)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.id) {
    return;
  }

  const { error: updateError } = await supabase
    .from('employees')
    .update({ user_id: userId })
    .eq('id', data.id);

  if (updateError) {
    throw new Error(updateError.message);
  }
}

export async function getSupabaseAuthUserById(userId: string, organizationId?: string): Promise<AuthUser | null> {
  const [profile, authAdminUser, memberships] = await Promise.all([
    getProfile(userId),
    getAuthAdminUserById(userId),
    listMemberships(userId),
  ]);

  if (!profile) {
    return null;
  }

  const role = resolveRole(authAdminUser, memberships);
  const defaultMembership = memberships.find((membership) => membership.is_default) ?? memberships[0];
  const orgId = organizationId ?? defaultMembership?.organization_id ?? getConfig().supabaseDefaultOrgId;

  return buildAuthUser(profile, role, orgId);
}

export async function listSupabaseOrganizationsForUser(userId: string): Promise<Organization[]> {
  const memberships = await listMemberships(userId);
  return memberships
    .map((membership) => singleRelation(membership.organizations))
    .filter((organization): organization is OrganizationRow => Boolean(organization))
    .map(toOrganization);
}

export async function getSupabaseOrganizationForUser(userId: string, organizationId?: string): Promise<Organization | null> {
  const memberships = await listMemberships(userId);
  const match = organizationId
    ? memberships.find((membership) => membership.organization_id === organizationId)
    : memberships.find((membership) => membership.is_default) ?? memberships[0];

  const organization = singleRelation(match?.organizations);
  return organization ? toOrganization(organization) : null;
}

export async function loginWithSupabase(email: string, password: string, requestedRole: UserRole): Promise<AuthUser> {
  const authClient = await getAuthClient();
  const { data, error } = await authClient.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    throw new Error('Invalid credentials');
  }

  const [profile, memberships] = await Promise.all([
    getProfile(data.user.id),
    listMemberships(data.user.id),
  ]);

  if (!profile) {
    throw new Error('Account profile not found');
  }

  const resolvedRole = resolveRole(data.user, memberships);
  if (resolvedRole !== requestedRole) {
    throw new Error('This account does not have access to the selected portal');
  }

  const organizationId =
    (memberships.find((membership) => membership.is_default) ?? memberships[0])?.organization_id
    ?? getConfig().supabaseDefaultOrgId;

  return buildAuthUser(profile, resolvedRole, organizationId);
}

export async function registerSupabaseOrganizationAdmin(
  name: string,
  email: string,
  password: string,
  organizationName: string,
): Promise<AuthUser> {
  const supabase = getSupabaseAdmin();
  const slugBase = slugify(organizationName) || 'organization';
  const slug = `${slugBase}-${Date.now().toString().slice(-6)}`;

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role: 'org_admin' satisfies UserRole },
    user_metadata: { full_name: name },
  });

  if (authError || !authData.user) {
    throw new Error(authError?.message || 'Unable to create account');
  }

  const { data: organization, error: organizationError } = await supabase
    .from('organizations')
    .insert({
      slug,
      name: organizationName,
      plan: 'Starter',
      seats: 25,
      used_seats: 1,
      status: 'Trial',
    })
    .select('id,name,plan,seats,used_seats,created_at,status')
    .single();

  if (organizationError) {
    throw new Error(organizationError.message);
  }

  await upsertPublicUser(authData.user, name);
  const roleId = await ensureOrganizationAdminRole(organization.id);
  await ensureMembership(authData.user.id, organization.id, roleId);

  return buildAuthUser(
    {
      id: authData.user.id,
      email,
      full_name: name,
      avatar_url: null,
      status: 'Active',
    },
    'org_admin',
    organization.id,
  );
}

export async function ensureSupabaseLoginAccounts() {
  const cfg = getConfig();
  const defaults = [
    {
      email: 'sarah.johnson@company.com',
      password: 'Employee@123',
      name: 'Sarah Johnson',
      role: 'employee' as const,
      linkEmployee: true,
    },
    {
      email: 'admin@company.com',
      password: 'OrgAdmin@123',
      name: 'Alex Rivera',
      role: 'org_admin' as const,
      linkEmployee: false,
    },
    {
      email: 'platform@workos.io',
      password: 'Platform@123',
      name: 'Jordan Mitchell',
      role: 'platform_admin' as const,
      linkEmployee: false,
    },
  ];

  const supabase = getSupabaseAdmin();
  await ensureDefaultOrganizationExists(cfg.supabaseDefaultOrgId);
  const defaultDepartmentId = await ensureDefaultDepartmentExists(cfg.supabaseDefaultOrgId);
  const orgAdminRoleId = await ensureOrganizationAdminRole(cfg.supabaseDefaultOrgId);

  for (const account of defaults) {
    const existingUser = await findAuthUserByEmail(account.email);
    const user = existingUser
      ? (await supabase.auth.admin.updateUserById(existingUser.id, {
          password: account.password,
          email_confirm: true,
          app_metadata: { ...(existingUser.app_metadata ?? {}), role: account.role },
          user_metadata: { ...(existingUser.user_metadata ?? {}), full_name: account.name },
        })).data.user
      : (await supabase.auth.admin.createUser({
          email: account.email,
          password: account.password,
          email_confirm: true,
          app_metadata: { role: account.role },
          user_metadata: { full_name: account.name },
        })).data.user;

    if (!user) {
      throw new Error(`Unable to create or update Supabase account for ${account.email}`);
    }

    await upsertPublicUser(user, account.name);
    await ensureMembership(
      user.id,
      cfg.supabaseDefaultOrgId,
      account.role === 'org_admin' ? orgAdminRoleId : null,
    );

    if (account.linkEmployee) {
      await linkEmployeeAccount(cfg.supabaseDefaultOrgId, user.id);
      await ensureEmployeeRecord(cfg.supabaseDefaultOrgId, user.id, defaultDepartmentId);
    }
  }
}
