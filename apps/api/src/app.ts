import express from 'express';
import cors from 'cors';

import { getCorrelationId, HttpError, sendJsonError } from './http/http';
import { correlationIdMiddleware } from './middleware/correlationId';
import { requestLogger } from './middleware/requestLogger';
import { authRouter } from './routes/auth';
import { peopleRouter } from './routes/people';
import { timeRouter } from './routes/time';
import { communicationRouter } from './routes/communication';
import { analyticsRouter } from './routes/analytics';
import { notificationsRouter } from './routes/notifications';
import { financeRouter } from './routes/finance';
import { workRouter } from './routes/work';

export function createApp() {
  const app = express();

  app.use(correlationIdMiddleware);
  app.use(requestLogger);
  app.use(
    cors({
      origin: [/^http:\/\/localhost:\d+$/],
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_req, res) => res.json({ ok: true }));

  const v1 = express.Router();
  v1.use('/auth', authRouter);
  v1.use('/people', peopleRouter);
  v1.use('/time', timeRouter);
  v1.use('/communication', communicationRouter);
  v1.use('/analytics', analyticsRouter);
  v1.use('/notifications', notificationsRouter);
  v1.use('/finance', financeRouter);
  v1.use('/work', workRouter);

  app.use('/v1', v1);

  app.use((req, res) => {
    sendJsonError(res, 404, `Not found: ${req.method} ${req.originalUrl}`);
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (res.headersSent) return;
    const cid = getCorrelationId(res);
    if (err instanceof HttpError) {
      return sendJsonError(res, err.statusCode, err.message);
    }
    const message = err instanceof Error ? err.message : 'Internal server error';
    // eslint-disable-next-line no-console
    console.error(JSON.stringify({ level: 'error', msg: 'unhandled_error', correlationId: cid, message }));
    return sendJsonError(res, 500, message);
  });

  return app;
}

