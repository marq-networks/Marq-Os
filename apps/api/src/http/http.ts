import type { Response } from 'express';

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export type JsonErrorBody = {
  error: string;
  correlationId?: string;
};

export function getCorrelationId(res: Response): string | undefined {
  return res.locals.correlationId as string | undefined;
}

export function sendJsonError(res: Response, status: number, message: string): Response {
  const body: JsonErrorBody = { error: message };
  const cid = getCorrelationId(res);
  if (cid) body.correlationId = cid;
  return res.status(status).json(body);
}
