export type ChatWindowType = 'direct' | 'group' | 'channel';

export type ChatWindowState = 'expanded' | 'minimized';

export interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
  status?: 'online' | 'away' | 'busy' | 'offline';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isCurrentUser?: boolean;
}

export interface ChatWindow {
  id: string;
  type: ChatWindowType;
  title: string;
  participants: ChatParticipant[];
  messages: ChatMessage[];
  state: ChatWindowState;
  unreadCount: number;
  lastActivity: string;
}
