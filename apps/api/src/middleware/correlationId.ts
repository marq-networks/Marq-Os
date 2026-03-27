import { randomUUID } from 'crypto';
import type { Request, Response, NextFunction } from 'express';

export function correlationIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const incoming = req.header('x-correlation-id');
  const id = incoming && incoming.trim() ? incoming.trim() : randomUUID();
  res.setHeader('x-correlation-id', id);
  res.locals.correlationId = id;
  next();
}
