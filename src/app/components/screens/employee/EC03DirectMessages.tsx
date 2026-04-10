import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/form';
import { useToast } from '../../ui/toast';
import type { DirectMessage, Message } from '../communicate/types';
import { MessageBubble } from '../communicate/MessageBubble';
import { MessageInput } from '../communicate/MessageInput';
import { useAuthService, useCommunicationData } from '../../../services';
import { 
  Search, 
  MessageSquare,
  Circle
} from 'lucide-react';

export function EC03DirectMessages() {
  const { showToast } = useToast();
  const authService = useAuthService();
  const { channels, messages: apiMessages, currentChannelId, selectChannel, sendMessage, loading } = useCommunicationData();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUserName, setCurrentUserName] = useState('Current User');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    authService.getCurrentUser().then((user) => setCurrentUserName(user.name)).catch(() => {});
  }, [authService]);

  const directMessages = useMemo<DirectMessage[]>(
    () =>
      channels
        .filter((channel) => channel.type === 'direct')
        .map((channel) => ({
          id: channel.id,
          participants: channel.members,
          lastMessage: channel.lastMessage || '',
          lastMessageTime: channel.lastMessageAt || channel.createdAt,
          unreadCount: channel.unreadCount,
          otherUser: channel.members.find((member) => member !== currentUserName) || channel.name,
          isOnline: true,
        })),
    [channels, currentUserName],
  );

  const activeDMId = currentChannelId || directMessages[0]?.id;
  const activeDM = directMessages.find(dm => dm.id === activeDMId);
  const messages = useMemo<Message[]>(
    () =>
      apiMessages
        .filter((message) => message.channelId === activeDMId)
        .map((message) => ({
          id: message.id,
          channelId: message.channelId,
          type: 'normal',
          sender: message.senderName,
          senderAvatar: message.senderAvatar,
          content: message.content,
          timestamp: message.timestamp,
          edited: message.edited,
          reactions: Object.entries(message.reactions ?? {}).map(([emoji, users]) => ({ emoji, users })),
          attachments: message.attachments?.map((attachment) => ({
            id: attachment.id,
            name: attachment.name,
            type: attachment.type === 'document' ? 'document' : attachment.type,
            url: attachment.url,
            size: attachment.size,
          })),
          mentions: message.mentions,
          replyTo: message.replyTo,
        })),
    [activeDMId, apiMessages],
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!currentChannelId && directMessages[0]?.id) {
      selectChannel(directMessages[0].id);
    }
  }, [currentChannelId, directMessages, selectChannel]);

  const handleSendMessage = (content: string) => {
    if (!activeDMId) return;
    void sendMessage(activeDMId, content);
  };

  const filteredDMs = directMessages.filter(dm =>
    dm.otherUser.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full bg-background">
      {/* Left Panel - DM List */}
      <div className="w-72 flex-shrink-0 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-lg mb-3">Direct Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {filteredDMs.map(dm => (
            <button
              key={dm.id}
              onClick={() => selectChannel(dm.id)}
              className={`w-full p-3 rounded-lg transition-colors mb-1 ${
                activeDMId === dm.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-medium">
                    {dm.otherUser.charAt(0)}
                  </div>
                  {dm.isOnline && (
                    <Circle className="absolute bottom-0 right-0 h-3 w-3 fill-green-500 text-green-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm truncate">{dm.otherUser}</p>
                    <span className="text-xs opacity-70">
                      {new Date(dm.lastMessageTime).toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <p className="text-xs opacity-70 truncate">{dm.lastMessage}</p>
                </div>
                {dm.unreadCount > 0 && (
                  <span className="flex-shrink-0 px-1.5 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full min-w-[20px] text-center">
                    {dm.unreadCount}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Center Panel - Messages */}
      <div className="flex-1 flex flex-col">
        {/* DM Header */}
        {activeDM && (
          <div className="h-14 border-b border-border bg-card px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-sm font-medium">
                  {activeDM.otherUser.charAt(0)}
                </div>
                {activeDM.isOnline && (
                  <Circle className="absolute bottom-0 right-0 h-2.5 w-2.5 fill-green-500 text-green-500" />
                )}
              </div>
              <div>
                <p className="font-semibold">{activeDM.otherUser}</p>
                <p className="text-xs text-muted-foreground">
                  {activeDM.isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => showToast('info', 'Video Call', 'Starting video call...')}
              >
                Video
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => showToast('info', 'Audio Call', 'Starting audio call...')}
              >
                Audio
              </Button>
            </div>
          </div>
        )}

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium mb-1">No messages yet</p>
                <p className="text-sm text-muted-foreground">
                  Start a conversation with {activeDM?.otherUser}
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map(msg => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message Input */}
        {activeDM && (
          <MessageInput
            onSendMessage={handleSendMessage}
            onAttachFile={() => showToast('info', 'Attach File', 'File upload feature')}
            onVoiceNote={() => showToast('info', 'Voice Note', 'Voice recording feature')}
            placeholder={`Message ${activeDM.otherUser}...`}
          />
        )}
      </div>
    </div>
  );
}
