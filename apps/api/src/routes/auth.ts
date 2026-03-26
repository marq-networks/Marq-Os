import { Router } from 'express';
import { z } from 'zod';
import type { AuthUser, Organization, ServiceResponse, UserRole } from '../../../src/app/services/types';
import { signToken } from '../auth';
import { authRequired, type AuthedRequest } from '../middleware/authRequired';
import { getStore } from '../store';

export const authRouter = Router();

authRouter.post('/login', (req, res) => {
  const bodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
    role: z.enum(['employee', 'org_admin', 'platform_admin']),
  });

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { email, role } = parsed.data as { email: string; password: string; role: UserRole };
  const { authUsers } = getStore();

  // Demo auth: accept any password; match on email+role when possible.
  const user =
    authUsers.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.role === role) ??
    authUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) ??
    authUsers.find((u) => u.role === role) ??
    authUsers[0];

  if (!user) {
    const resp: ServiceResponse<AuthUser> = { success: false, error: 'Invalid credentials' };
    return res.status(401).json(resp);
  }

  const token = signToken(user);
  return res.json({ ...user, token } satisfies AuthUser & { token: string });
});

authRouter.post('/logout', (_req, res) => {
  // Stateless JWT logout (client deletes token). Kept for endpoint parity.
  return res.status(204).send();
});

authRouter.get('/me', authRequired, (req: AuthedRequest, res) => {
  const { authUsers } = getStore();
  const user = authUsers.find((u) => u.id === req.auth!.userId);
  if (!user) return res.status(401).json({ error: 'Unauthenticated' });
  return res.json(user);
});

authRouter.post('/switch-org', authRequired, (req: AuthedRequest, res) => {
  const bodySchema = z.object({ orgId: z.string().min(1) });
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { organizations } = getStore();
  const org = organizations.find((o) => o.id === parsed.data.orgId);
  const resp: ServiceResponse<Organization> = org
    ? { success: true, data: org }
    : { success: false, error: 'Organization not found' };
  return res.status(org ? 200 : 404).json(resp);
});

authRouter.get('/organizations', authRequired, (_req, res) => {
  const { organizations } = getStore();
  return res.json(organizations);
});

authRouter.get('/organizations/current', authRequired, (req: AuthedRequest, res) => {
  const { organizations } = getStore();
  const org = organizations.find((o) => o.id === req.auth!.organizationId) ?? organizations[0];
  if (!org) return res.status(404).json({ error: 'Organization not found' });
  return res.json(org);
});

