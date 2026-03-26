import type { Request, Response, NextFunction } from 'express';
import { getUserFromClaims, verifyToken } from '../auth';

export type AuthedRequest = Request & {
  auth?: {
    userId: string;
    role: string;
    organizationId: string;
  };
};

export function authRequired(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.header('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : '';
  if (!token) return res.status(401).json({ error: 'Missing Authorization Bearer token' });

  try {
    const claims = verifyToken(token);
    const user = getUserFromClaims(claims);
    if (!user) return res.status(401).json({ error: 'Invalid token user' });

    req.auth = {
      userId: user.id,
      role: user.role,
      organizationId: user.organizationId,
    };
    next();
  } catch (e: any) {
    return res.status(401).json({ error: e?.message || 'Invalid token' });
  }
}

