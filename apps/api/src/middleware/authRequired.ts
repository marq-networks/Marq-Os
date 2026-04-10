import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../auth';
import { sendJsonError } from '../http/http';

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
  if (!token) return sendJsonError(res, 401, 'Missing Authorization Bearer token');

  try {
    const claims = verifyToken(token);
    req.auth = {
      userId: claims.sub,
      role: claims.role,
      organizationId: claims.organizationId,
    };
    next();
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Invalid token';
    return sendJsonError(res, 401, msg);
  }
}

