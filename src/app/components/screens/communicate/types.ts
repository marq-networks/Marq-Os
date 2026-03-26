// Clean Communication Types - Conversation-First

export type ChannelType = 'team' | 'project' | 'announcement' | 'dm' | 'group' | 'custom';
export type MessageType = 'normal' | 'system';
export type ChannelStatus = 'Active' | 'Archived';

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  description?: string;
  isPrivate: boolean;
  members: string[];
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
  createdBy: string;
  createdAt: string;
  pinnedMessages: string[];
  status: ChannelStatus;
  isPinned?: boolean;
  isMuted?: boolean;
}

export interface Message {
  id: string;
  channelId: string;
  type: MessageType;
  sender: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  edited?: boolean;
  reactions?: { emoji: string; users: string[]; }[];
  attachments?: Attachment[];
  mentions?: string[];
  isBot?: boolean;
  replyTo?: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'link';
  url: string;
  size?: string;
  thumbnail?: string;
}

export interface DirectMessage {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  otherUser: string;
  otherUserAvatar?: string;
  isOnline?: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
}