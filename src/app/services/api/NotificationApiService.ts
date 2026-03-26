/**
 * ═══════════════════════════════════════════════════════════════════════════
 * NOTIFICATION API SERVICE — Real HTTP Implementation
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Concrete implementation of INotificationService using real HTTP calls.
 *
 * For real-time push notifications, layer a WebSocket or SSE connection
 * on top of this service (e.g., listen on /notifications/stream).
 *
 * TO ACTIVATE: In ServiceProvider.tsx replace mock notificationService with:
 *   const notificationService = new NotificationApiService();
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { ApiService } from '../ApiService';
import type { INotificationService } from '../contracts';
import type { Notification, QueryParams, PaginatedResponse } from '../types';
import { ENDPOINTS } from '../config';

export class NotificationApiService extends ApiService implements INotificationService {
  async getNotifications(
    params?: QueryParams,
  ): Promise<PaginatedResponse<Notification>> {
    return this.get<PaginatedResponse<Notification>>(
      ENDPOINTS.NOTIFICATIONS,
      params as any,
    );
  }

  async getUnreadCount(): Promise<number> {
    const result = await this.get<{ count: number }>(
      `${ENDPOINTS.NOTIFICATIONS}/unread-count`,
    );
    return result.count;
  }

  async markAsRead(id: string): Promise<void> {
    await this.patch<void>(`${ENDPOINTS.NOTIFICATIONS}/${id}/read`);
  }

  async markAllAsRead(): Promise<void> {
    await this.patch<void>(`${ENDPOINTS.NOTIFICATIONS}/read-all`);
  }

  async deleteNotification(id: string): Promise<void> {
    return this.delete(`${ENDPOINTS.NOTIFICATIONS}/${id}`);
  }
}
