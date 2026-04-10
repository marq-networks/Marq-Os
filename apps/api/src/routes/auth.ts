import { Router } from 'express';
import { z } from 'zod';
import type { AuthUser, Organization, ServiceResponse, UserRole } from '../../../src/app/services/types';
import { signToken } from '../auth';
import { getConfig } from '../config';
import {
  getSupabaseAuthUserById,
  getSupabaseOrganizationForUser,
  listSupabaseOrganizationsForUser,
  loginWithSupabase,
  registerSupabaseOrganizationAdmin,
} from '../db/authRepo';
import { authRequired, type AuthedRequest } from '../middleware/authRequired';
import { getStore } from '../store';

export const authRouter = Router();

authRouter.post('/register', async (req, res) => {
  const bodySchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    organizationName: z.string().min(2),
  });

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { name, email, password, organizationName } = parsed.data;
  const cfg = getConfig();

  if (cfg.useSupabaseDb) {
    try {
      const user = await registerSupabaseOrganizationAdmin(name, email, password, organizationName);
      const token = signToken(user);
      return res.status(201).json({ ...user, token } satisfies AuthUser & { token: string });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      const resp: ServiceResponse<AuthUser> = { success: false, error: message };
      return res.status(message.toLowerCase().includes('already') ? 409 : 400).json(resp);
    }
  }

  const { authUsers, authAccounts, organizations } = getStore();

  const existingAccount = authAccounts.find((account) => account.email.toLowerCase() === email.toLowerCase());
  if (existingAccount) {
    const resp: ServiceResponse<AuthUser> = { success: false, error: 'Email already registered' };
    return res.status(409).json(resp);
  }

  const orgId = crypto.randomUUID();
  const userId = crypto.randomUUID();

  const organization: Organization = {
    id: orgId,
    name: organizationName,
    plan: 'Starter',
    seats: 25,
    usedSeats: 1,
    createdAt: new Date().toISOString(),
    status: 'Trial',
  };

  const user: AuthUser = {
    id: userId,
    name,
    email,
    role: 'org_admin',
    organizationId: orgId,
    lastLogin: new Date().toISOString(),
  };

  organizations.push(organization);
  authUsers.push(user);
  authAccounts.push({
    userId,
    email,
    password,
    role: 'org_admin',
  });

  const token = signToken(user);
  return res.status(201).json({ ...user, token } satisfies AuthUser & { token: string });
});

authRouter.post('/login', async (req, res) => {
  const bodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
    role: z.enum(['employee', 'org_admin', 'platform_admin']),
  });

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { email, password, role } = parsed.data as { email: string; password: string; role: UserRole };
  const cfg = getConfig();

  if (cfg.useSupabaseDb) {
    try {
      const user = await loginWithSupabase(email, password, role);
      const token = signToken(user);
      return res.json({ ...user, token } satisfies AuthUser & { token: string });
    } catch (error) {
      const resp: ServiceResponse<AuthUser> = {
        success: false,
        error: error instanceof Error ? error.message : 'Invalid credentials',
      };
      return res.status(401).json(resp);
    }
  }

  const { authUsers, authAccounts } = getStore();

  const account = authAccounts.find(
    (entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.role === role,
  );

  if (!account || account.password !== password) {
    const resp: ServiceResponse<AuthUser> = { success: false, error: 'Invalid credentials' };
    return res.status(401).json(resp);
  }

  const user = authUsers.find((entry) => entry.id === account.userId);
  if (!user) {
    const resp: ServiceResponse<AuthUser> = { success: false, error: 'Account is not linked to a user' };
    return res.status(401).json(resp);
  }

  const token = signToken(user);
  return res.json({ ...user, token } satisfies AuthUser & { token: string });
});

authRouter.post('/logout', (_req, res) => {
  // Stateless JWT logout (client deletes token). Kept for endpoint parity.
  return res.status(204).send();
});

authRouter.get('/me', authRequired, async (req: AuthedRequest, res) => {
  if (getConfig().useSupabaseDb) {
    const user = await getSupabaseAuthUserById(req.auth!.userId, req.auth!.organizationId);
    if (!user) return res.status(401).json({ error: 'Unauthenticated' });
    return res.json(user);
  }

  const { authUsers } = getStore();
  const user = authUsers.find((u) => u.id === req.auth!.userId);
  if (!user) return res.status(401).json({ error: 'Unauthenticated' });
  return res.json(user);
});

authRouter.post('/switch-org', authRequired, async (req: AuthedRequest, res) => {
  const bodySchema = z.object({ orgId: z.string().min(1) });
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  if (getConfig().useSupabaseDb) {
    const org = await getSupabaseOrganizationForUser(req.auth!.userId, parsed.data.orgId);
    const resp: ServiceResponse<Organization> = org
      ? { success: true, data: org }
      : { success: false, error: 'Organization not found' };
    return res.status(org ? 200 : 404).json(resp);
  }

  const { organizations } = getStore();
  const org = organizations.find((o) => o.id === parsed.data.orgId);
  const resp: ServiceResponse<Organization> = org
    ? { success: true, data: org }
    : { success: false, error: 'Organization not found' };
  return res.status(org ? 200 : 404).json(resp);
});

authRouter.get('/organizations', authRequired, async (req: AuthedRequest, res) => {
  if (getConfig().useSupabaseDb) {
    const organizations = await listSupabaseOrganizationsForUser(req.auth!.userId);
    return res.json(organizations);
  }

  const { organizations } = getStore();
  return res.json(organizations);
});

authRouter.get('/organizations/current', authRequired, async (req: AuthedRequest, res) => {
  if (getConfig().useSupabaseDb) {
    const org = await getSupabaseOrganizationForUser(req.auth!.userId, req.auth!.organizationId);
    if (!org) return res.status(404).json({ error: 'Organization not found' });
    return res.json(org);
  }

  const { organizations } = getStore();
  const org = organizations.find((o) => o.id === req.auth!.organizationId) ?? organizations[0];
  if (!org) return res.status(404).json({ error: 'Organization not found' });
  return res.json(org);
});

