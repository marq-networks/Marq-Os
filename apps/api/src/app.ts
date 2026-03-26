import express from 'express';
import cors from 'cors';

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

  app.use(cors({
    origin: [/^http:\/\/localhost:\d+$/],
    credentials: true,
  }));
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
    res.status(404).json({ error: `Not found: ${req.method} ${req.path}` });
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(500).json({ error: err?.message || 'Internal server error' });
  });

  return app;
}

