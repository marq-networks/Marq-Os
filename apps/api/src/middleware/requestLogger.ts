import type { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const cid = res.locals.correlationId as string | undefined;

  res.on('finish', () => {
    const ms = Date.now() - start;
    // eslint-disable-next-line no-console
    console.log(
      JSON.stringify({
        level: 'info',
        msg: 'http_request',
        method: req.method,
        path: req.originalUrl.split('?')[0],
        status: res.statusCode,
        ms,
        correlationId: cid,
      }),
    );
  });

  next();
}
