/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COMMUNICATION API SERVICE — Real HTTP Implementation
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Concrete implementation of ICommunicationService using real HTTP calls.
 *
 * Real-time messaging (WebSocket) should be layered on top of this service
 * for live message delivery. This service handles REST endpoints only.
 *
 * TO ACTIVATE: In ServiceProvider.tsx replace mock communicationService with:
 *   const communicationService = new CommunicationApiService();
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { ApiService } from '../ApiService';
import type { ICommunicationService } from '../contracts';
import type {
  Channel, Message,
  QueryParams, PaginatedResponse,
} from '../types';
import { ENDPOINTS } from '../config';

export class CommunicationApiService extends ApiService implements ICommunicationService {
  // ─── Channels ────────────────────────────────────────────────────────────

  async getChannels(params?: QueryParams): Promise<PaginatedResponse<Channel>> {
    return this.get<PaginatedResponse<Channel>>(ENDPOINTS.CHANNELS, params as any);
  }

  async getChannelById(id: string): Promise<Channel> {
    return this.get<Channel>(`${ENDPOINTS.CHANNELS}/${id}`);
  }

  async createChannel(data: Omit<Channel, 'id' | 'createdAt'>): Promise<Channel> {
    return this.post<Channel>(ENDPOINTS.CHANNELS, data);
  }

  async updateChannel(id: string, data: Partial<Channel>): Promise<Channel> {
    return this.patch<Channel>(`${ENDPOINTS.CHANNELS}/${id}`, data);
  }

  async deleteChannel(id: string): Promise<void> {
    return this.delete(`${ENDPOINTS.CHANNELS}/${id}`);
  }

  async archiveChannel(id: string): Promise<Channel> {
    return this.patch<Channel>(`${ENDPOINTS.CHANNELS}/${id}/archive`);
  }

  async joinChannel(channelId: string, userId: string): Promise<void> {
    await this.post<void>(`${ENDPOINTS.CHANNELS}/${channelId}/join`, { userId });
  }

  async leaveChannel(channelId: string, userId: string): Promise<void> {
    await this.post<void>(`${ENDPOINTS.CHANNELS}/${channelId}/leave`, { userId });
  }

  // ─── Messages ────────────────────────────────────────────────────────────

  async getMessages(
    channelId: string,
    params?: QueryParams,
  ): Promise<PaginatedResponse<Message>> {
    return this.get<PaginatedResponse<Message>>(
      `${ENDPOINTS.CHANNELS}/${channelId}/messages`,
      params as any,
    );
  }

  async sendMessage(
    channelId: string,
    content: string,
    senderId: string,
  ): Promise<Message> {
    return this.post<Message>(`${ENDPOINTS.CHANNELS}/${channelId}/messages`, {
      content,
      senderId,
    });
  }

  async editMessage(messageId: string, content: string): Promise<Message> {
    return this.patch<Message>(`${ENDPOINTS.MESSAGES}/${messageId}`, { content });
  }

  async deleteMessage(messageId: string): Promise<void> {
    return this.delete(`${ENDPOINTS.MESSAGES}/${messageId}`);
  }

  async addReaction(messageId: string, emoji: string, userId: string): Promise<void> {
    await this.post<void>(`${ENDPOINTS.MESSAGES}/${messageId}/reactions`, {
      emoji,
      userId,
    });
  }

  async removeReaction(messageId: string, emoji: string, userId: string): Promise<void> {
    await this.post<void>(`${ENDPOINTS.MESSAGES}/${messageId}/reactions/remove`, {
      emoji,
      userId,
    });
  }

  async pinMessage(messageId: string): Promise<void> {
    await this.patch<void>(`${ENDPOINTS.MESSAGES}/${messageId}/pin`);
  }

  async unpinMessage(messageId: string): Promise<void> {
    await this.patch<void>(`${ENDPOINTS.MESSAGES}/${messageId}/unpin`);
  }
}
