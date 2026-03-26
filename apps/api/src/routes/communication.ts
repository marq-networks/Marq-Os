import { Router } from 'express';
import { z } from 'zod';
import type { Channel, Message, PaginatedResponse } from '../../../src/app/services/types';
import { authRequired } from '../middleware/authRequired';
import { getStore } from '../store';
import { paginate, parsePageParams } from '../utils/pagination';

export const communicationRouter = Router();
communicationRouter.use(authRequired);

// Channels
communicationRouter.get('/channels', (req, res) => {
  const { channels } = getStore();
  const { page, pageSize, search } = parsePageParams(req.query);
  const filtered = search
    ? channels.filter((c) => JSON.stringify(c).toLowerCase().includes(search.toLowerCase()))
    : channels;
  return res.json(paginate(filtered, page, pageSize) satisfies PaginatedResponse<Channel>);
});

communicationRouter.get('/channels/:id', (req, res) => {
  const { channels } = getStore();
  const channel = channels.find((c) => c.id === req.params.id);
  if (!channel) return res.status(404).json({ error: 'Channel not found' });
  return res.json(channel);
});

communicationRouter.post('/channels', (req, res) => {
  const schema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    type: z.enum(['public', 'private', 'direct']),
    createdBy: z.string().min(1),
    memberCount: z.number().optional(),
    members: z.array(z.string()).optional(),
    lastMessage: z.string().optional(),
    lastMessageAt: z.string().optional(),
    unreadCount: z.number().optional(),
    pinned: z.boolean().optional(),
    archived: z.boolean().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { channels } = getStore();
  const now = new Date().toISOString();
  const channel: Channel = {
    id: crypto.randomUUID(),
    createdAt: now,
    memberCount: parsed.data.memberCount ?? (parsed.data.members?.length ?? 0),
    members: parsed.data.members ?? [],
    unreadCount: parsed.data.unreadCount ?? 0,
    pinned: parsed.data.pinned ?? false,
    archived: parsed.data.archived ?? false,
    ...(parsed.data as any),
  };
  channels.unshift(channel);
  return res.status(201).json(channel);
});

communicationRouter.patch('/channels/:id', (req, res) => {
  const { channels } = getStore();
  const idx = channels.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Channel not found' });
  channels[idx] = { ...channels[idx], ...(req.body ?? {}) };
  return res.json(channels[idx]);
});

communicationRouter.delete('/channels/:id', (req, res) => {
  const { channels } = getStore();
  const idx = channels.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Channel not found' });
  channels.splice(idx, 1);
  return res.status(204).send();
});

communicationRouter.patch('/channels/:id/archive', (req, res) => {
  const { channels } = getStore();
  const idx = channels.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Channel not found' });
  channels[idx] = { ...channels[idx], archived: true };
  return res.json(channels[idx]);
});

communicationRouter.post('/channels/:id/join', (req, res) => {
  const schema = z.object({ userId: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { channels } = getStore();
  const idx = channels.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Channel not found' });
  const members = new Set(channels[idx].members);
  members.add(parsed.data.userId);
  channels[idx] = { ...channels[idx], members: [...members], memberCount: members.size };
  return res.status(204).send();
});

communicationRouter.post('/channels/:id/leave', (req, res) => {
  const schema = z.object({ userId: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { channels } = getStore();
  const idx = channels.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Channel not found' });
  const members = new Set(channels[idx].members);
  members.delete(parsed.data.userId);
  channels[idx] = { ...channels[idx], members: [...members], memberCount: members.size };
  return res.status(204).send();
});

// Messages
communicationRouter.get('/channels/:id/messages', (req, res) => {
  const { messages } = getStore();
  const { page, pageSize } = parsePageParams(req.query);
  const channelId = req.params.id;
  const filtered = messages.filter((m) => m.channelId === channelId);
  return res.json(paginate(filtered, page, pageSize) satisfies PaginatedResponse<Message>);
});

communicationRouter.post('/channels/:id/messages', (req, res) => {
  const schema = z.object({ content: z.string().min(1), senderId: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { messages, employees, channels } = getStore();
  const sender = employees.find((e) => e.id === parsed.data.senderId);
  const message: Message = {
    id: crypto.randomUUID(),
    channelId: req.params.id,
    senderId: parsed.data.senderId,
    senderName: sender?.name ?? 'Unknown',
    content: parsed.data.content,
    timestamp: new Date().toISOString(),
    status: 'sent',
    edited: false,
    pinned: false,
  } as any;
  messages.unshift(message);

  const chIdx = channels.findIndex((c) => c.id === req.params.id);
  if (chIdx !== -1) {
    channels[chIdx] = {
      ...channels[chIdx],
      lastMessage: message.content,
      lastMessageAt: message.timestamp,
    };
  }

  return res.status(201).json(message);
});

communicationRouter.patch('/messages/:id', (req, res) => {
  const schema = z.object({ content: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { messages } = getStore();
  const idx = messages.findIndex((m) => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Message not found' });
  messages[idx] = { ...messages[idx], content: parsed.data.content, edited: true, editedAt: new Date().toISOString() };
  return res.json(messages[idx]);
});

communicationRouter.delete('/messages/:id', (req, res) => {
  const { messages } = getStore();
  const idx = messages.findIndex((m) => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Message not found' });
  messages.splice(idx, 1);
  return res.status(204).send();
});

communicationRouter.post('/messages/:id/reactions', (req, res) => {
  const schema = z.object({ emoji: z.string().min(1), userId: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { messages } = getStore();
  const idx = messages.findIndex((m) => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Message not found' });
  const reactions = { ...(messages[idx].reactions ?? {}) } as Record<string, string[]>;
  reactions[parsed.data.emoji] = Array.from(new Set([...(reactions[parsed.data.emoji] ?? []), parsed.data.userId]));
  messages[idx] = { ...messages[idx], reactions };
  return res.status(204).send();
});

communicationRouter.post('/messages/:id/reactions/remove', (req, res) => {
  const schema = z.object({ emoji: z.string().min(1), userId: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { messages } = getStore();
  const idx = messages.findIndex((m) => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Message not found' });
  const reactions = { ...(messages[idx].reactions ?? {}) } as Record<string, string[]>;
  reactions[parsed.data.emoji] = (reactions[parsed.data.emoji] ?? []).filter((id) => id !== parsed.data.userId);
  messages[idx] = { ...messages[idx], reactions };
  return res.status(204).send();
});

communicationRouter.patch('/messages/:id/pin', (req, res) => {
  const { messages } = getStore();
  const idx = messages.findIndex((m) => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Message not found' });
  messages[idx] = { ...messages[idx], pinned: true };
  return res.status(204).send();
});

communicationRouter.patch('/messages/:id/unpin', (req, res) => {
  const { messages } = getStore();
  const idx = messages.findIndex((m) => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Message not found' });
  messages[idx] = { ...messages[idx], pinned: false };
  return res.status(204).send();
});

