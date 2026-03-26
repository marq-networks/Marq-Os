import { Router } from 'express';
import type { Notification, PaginatedResponse } from '../../../src/app/services/types';
import { authRequired, type AuthedRequest } from '../middleware/authRequired';
import { getStore } from '../store';
import { paginate, parsePageParams } from '../utils/pagination';

export const notificationsRouter = Router();
notificationsRouter.use(authRequired);

notificationsRouter.get('/', (req: AuthedRequest, res) => {
  const { notifications } = getStore();
  const { page, pageSize } = parsePageParams(req.query);
  const mine = notifications.filter((n) => n.userId === req.auth!.userId);
  return res.json(paginate(mine, page, pageSize) satisfies PaginatedResponse<Notification>);
});

notificationsRouter.get('/unread-count', (req: AuthedRequest, res) => {
  const { notifications } = getStore();
  const count = notifications.filter((n) => n.userId === req.auth!.userId && !n.read).length;
  return res.json({ count });
});

notificationsRouter.patch('/:id/read', (req: AuthedRequest, res) => {
  const { notifications } = getStore();
  const idx = notifications.findIndex((n) => n.id === req.params.id && n.userId === req.auth!.userId);
  if (idx === -1) return res.status(404).json({ error: 'Notification not found' });
  notifications[idx] = { ...notifications[idx], read: true };
  return res.status(204).send();
});

notificationsRouter.patch('/read-all', (req: AuthedRequest, res) => {
  const { notifications } = getStore();
  for (let i = 0; i < notifications.length; i++) {
    if (notifications[i].userId === req.auth!.userId) notifications[i] = { ...notifications[i], read: true };
  }
  return res.status(204).send();
});

notificationsRouter.delete('/:id', (req: AuthedRequest, res) => {
  const { notifications } = getStore();
  const idx = notifications.findIndex((n) => n.id === req.params.id && n.userId === req.auth!.userId);
  if (idx === -1) return res.status(404).json({ error: 'Notification not found' });
  notifications.splice(idx, 1);
  return res.status(204).send();
});

