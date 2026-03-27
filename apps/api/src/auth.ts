import jwt from 'jsonwebtoken';
import type { AuthUser, UserRole } from '../../../src/app/services/types';
import { getConfig } from './config';
import { getStore } from './store';

export type JwtClaims = {
  sub: string;
  role: UserRole;
  organizationId: string;
};

export function signToken(user: AuthUser): string {
  const claims: JwtClaims = {
    sub: user.id,
    role: user.role,
    organizationId: user.organizationId,
  };
  return jwt.sign(claims, getConfig().apiJwtSecret, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtClaims {
  const decoded = jwt.verify(token, getConfig().apiJwtSecret) as any;
  return {
    sub: decoded.sub,
    role: decoded.role,
    organizationId: decoded.organizationId,
  };
}

export function getUserFromClaims(claims: JwtClaims): AuthUser | null {
  const { authUsers } = getStore();
  return authUsers.find((u) => u.id === claims.sub) ?? null;
}

