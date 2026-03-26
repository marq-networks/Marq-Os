import { ReactNode, useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/form';
import { 
  Search, 
  Plus, 
  Hash, 
  Lock,
  Video,
  Phone,
  Settings,
  X,
  MessageSquare,
  Users,
  Pin,
  Bell,
  BellOff,
  Circle
} from 'lucide-react';
import { Channel, DirectMessage } from './types';

interface CommunicateLayoutProps {
  // Conversations
  channels?: Channel[];
  directMessages?: DirectMessage[];
  activeChannelId?: string;
  activeDMId?: string;
  onChannelSelect?: (channelId: string) => void;
  onDMSelect?: (dmId: string) => void;
  onCreateChannel?: () => void;
  
  // Center Panel (Messages)
  children: ReactNode;
  
  // Right Panel (Context)
  contextPanel?: ReactNode;
  showContextPanel?: boolean;
  onToggleContextPanel?: () => void;
  
  // Header
  channelName?: string;
  channelDescription?: string;
  onStartVideoCall?: () => void;
  onStartAudioCall?: () => void;
  onChannelSettings?: () => void;
}

type ConversationTab = 'dms' | 'groups' | 'channels';

export function CommunicateLayout({
  channels = [],
  directMessages = [],
  activeChannelId,
  activeDMId,
  onChannelSelect,
  onDMSelect,
  onCreateChannel,
  children,
  contextPanel,
  showContextPanel = true,
  onToggleContextPanel,
  channelName,
  channelDescription,
  onStartVideoCall,
  onStartAudioCall,
  onChannelSettings
}: CommunicateLayoutProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<ConversationTab>('channels');

  // Separate conversations by type
  const allDMs = directMessages;
  const groupChats = channels.filter(c => c.type === 'group');
  const allChannels = channels.filter(c => c.type !== 'group' && c.type !== 'dm');

  // Helper to categorize conversations
  const categorizeConversations = <T extends { isPinned?: boolean; isMuted?: boolean }>(items: T[]) => {
    const pinned = items.filter(item => item.isPinned);
    const muted = items.filter(item => item.isMuted && !item.isPinned);
    const active = items.filter(item => !item.isPinned && !item.isMuted);
    return { pinned, active, muted };
  };

  // Filter by search
  const filterBySearch = <T extends { name?: string; otherUser?: string; lastMessage?: string }>(items: T[]) => {
    if (!searchQuery) return items;
    return items.filter(item => {
      const name = item.name || item.otherUser || '';
      const message = item.lastMessage || '';
      return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             message.toLowerCase().includes(searchQuery.toLowerCase());
    });
  };

  // Get active conversations - show all conversations together (no tabs)
  const getActiveConversations = () => {
    // Combine all conversations
    const allConversations = [
      ...filterBySearch(allDMs),
      ...filterBySearch(groupChats),
      ...filterBySearch(allChannels)
    ];
    return categorizeConversations(allConversations);
  };

  const conversations = getActiveConversations();

  // Format timestamp
  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    if (diffInHours < 48) return 'Yesterday';
    if (diffInHours < 168) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // DM Item Component
  const DMItem = ({ dm }: { dm: DirectMessage }) => (
    <button
      onClick={() => onDMSelect?.(dm.id)}
      className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors relative ${
        activeDMId === dm.id
          ? 'bg-primary text-primary-foreground'
          : 'hover:bg-muted text-foreground'
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
          {dm.otherUser.charAt(0)}
        </div>
        {dm.isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between mb-0.5">
          <span className="font-semibold text-sm truncate">{dm.otherUser}</span>
          <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
            {formatTime(dm.lastMessageTime)}
          </span>
        </div>
        <p className={`text-xs truncate ${
          activeDMId === dm.id ? 'text-primary-foreground/80' : 'text-muted-foreground'
        }`}>
          {dm.lastMessage}
        </p>
      </div>

      {/* Indicators */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        {dm.unreadCount > 0 && (
          <span className="px-1.5 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full min-w-[20px] text-center">
            {dm.unreadCount > 99 ? '99+' : dm.unreadCount}
          </span>
        )}
        {dm.isPinned && (
          <Pin className="h-3 w-3 text-muted-foreground" />
        )}
        {dm.isMuted && (
          <BellOff className="h-3 w-3 text-muted-foreground" />
        )}
      </div>
    </button>
  );

  // Channel/Group Item Component
  const ChannelItem = ({ channel }: { channel: Channel }) => (
    <button
      onClick={() => onChannelSelect?.(channel.id)}
      className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors ${
        activeChannelId === channel.id
          ? 'bg-primary text-primary-foreground'
          : 'hover:bg-muted text-foreground'
      }`}
    >
      {/* Icon */}
      <div className="flex-shrink-0 pt-0.5">
        {channel.isPrivate ? (
          <Lock className="h-4 w-4" />
        ) : (
          <Hash className="h-4 w-4" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between mb-0.5">
          <span className="font-semibold text-sm truncate">{channel.name}</span>
          <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
            {formatTime(channel.lastMessageTime)}
          </span>
        </div>
        {channel.lastMessage && (
          <p className={`text-xs truncate ${
            activeChannelId === channel.id ? 'text-primary-foreground/80' : 'text-muted-foreground'
          }`}>
            {channel.lastMessage}
          </p>
        )}
      </div>

      {/* Indicators */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        {channel.unreadCount > 0 && (
          <span className="px-1.5 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full min-w-[20px] text-center">
            {channel.unreadCount > 99 ? '99+' : channel.unreadCount}
          </span>
        )}
        {channel.isPinned && (
          <Pin className="h-3 w-3 text-muted-foreground" />
        )}
        {channel.isMuted && (
          <BellOff className="h-3 w-3 text-muted-foreground" />
        )}
      </div>
    </button>
  );

  // Conversation Section Component
  const ConversationSection = ({ 
    title, 
    items, 
    type 
  }: { 
    title: string; 
    items: (Channel | DirectMessage)[]; 
    type: 'dm' | 'channel' 
  }) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-4">
        <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </div>
        <div className="space-y-0.5">
          {items.map(item => (
            type === 'dm' 
              ? <DMItem key={item.id} dm={item as DirectMessage} />
              : <ChannelItem key={item.id} channel={item as Channel} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full bg-background">
      {/* LEFT PANEL - Conversation Navigation */}
      <div className="w-72 flex-shrink-0 border-r border-border bg-card flex flex-col">
        {/* Search */}
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="pl-9 h-9"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto py-2">
          {conversations.pinned.length > 0 && (
            <ConversationSection 
              title="Pinned" 
              items={conversations.pinned} 
              type="channel"
            />
          )}
          {conversations.active.length > 0 && (
            <ConversationSection 
              title={conversations.pinned.length > 0 ? "All Conversations" : ""} 
              items={conversations.active} 
              type="channel"
            />
          )}
          {conversations.muted.length > 0 && (
            <ConversationSection 
              title="Muted" 
              items={conversations.muted} 
              type="channel"
            />
          )}

          {/* Empty State */}
          {conversations.pinned.length === 0 && 
           conversations.active.length === 0 && 
           conversations.muted.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                {searchQuery 
                  ? 'No conversations found' 
                  : 'No conversations yet'}
              </p>
            </div>
          )}
        </div>

        {/* Create Button */}
        {onCreateChannel && (
          <div className="p-3 border-t border-border">
            <Button 
              onClick={onCreateChannel}
              className="w-full"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Conversation
            </Button>
          </div>
        )}
      </div>

      {/* CENTER PANEL - Messages */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Channel Header */}
        {channelName && (
          <div className="h-14 border-b border-border bg-card px-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <Hash className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <h2 className="font-semibold truncate">{channelName}</h2>
                {channelDescription && (
                  <p className="text-xs text-muted-foreground truncate">{channelDescription}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onStartVideoCall && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={onStartVideoCall}
                >
                  <Video className="h-4 w-4 mr-1" />
                  Video
                </Button>
              )}
              {onStartAudioCall && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={onStartAudioCall}
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Audio
                </Button>
              )}
              {onChannelSettings && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={onChannelSettings}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
              {onToggleContextPanel && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={onToggleContextPanel}
                >
                  {showContextPanel ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Settings className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Message Area */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>

      {/* RIGHT PANEL - Context */}
      {showContextPanel && contextPanel && (
        <div className="w-80 flex-shrink-0 border-l border-border bg-card overflow-y-auto">
          {contextPanel}
        </div>
      )}
    </div>
  );
}