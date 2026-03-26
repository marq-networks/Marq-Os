import { useState, useEffect, useRef } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { MessageBubble } from '../communicate/MessageBubble';
import { EnhancedMessageInput } from '../communicate/EnhancedMessageInput';
import { Message, Attachment } from '../communicate/types';
import { MessageSquare, Users, Hash, Archive } from 'lucide-react';
import { Button } from '../../ui/button';

const STORAGE_KEY = 'workos_chat_messages';

// Default channels
const DEFAULT_CHANNELS = [
  { id: '1', name: 'General', icon: '💬' },
  { id: '2', name: 'Team Updates', icon: '📢' },
  { id: '3', name: 'Project Discussion', icon: '🎯' },
  { id: '4', name: 'Random', icon: '🎲' },
];

export function CommunicateCommunicate() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChannel, setActiveChannel] = useState('1');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setMessages(parsed);
      } else {
        // Add welcome message
        const welcomeMessage: Message = {
          id: 'welcome-1',
          channelId: '1',
          type: 'system',
          sender: 'System',
          content: 'Welcome to WorkOS Communication! Start chatting with your team.',
          timestamp: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (content: string, attachments?: File[], voiceNote?: Blob) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      channelId: activeChannel,
      type: 'normal',
      sender: 'You', // In real app, would be current user's name
      content: content || 'Voice note',
      timestamp: new Date().toISOString(),
      attachments: attachments && attachments.length > 0 ? attachments.map((file, idx) => ({
        id: `att-${Date.now()}-${idx}`,
        name: file.name,
        type: file.type.startsWith('image') ? 'image' :
              file.type.startsWith('video') ? 'video' :
              file.type.startsWith('audio') ? 'audio' : 'document',
        url: URL.createObjectURL(file),
        size: formatFileSize(file.size),
      } as Attachment)) : undefined,
    };

    // If voice note, add special attachment
    if (voiceNote) {
      newMessage.attachments = [{
        id: `voice-${Date.now()}`,
        name: 'Voice Note.webm',
        type: 'audio',
        url: URL.createObjectURL(voiceNote),
        size: formatFileSize(voiceNote.size),
      }];
    }

    setMessages(prev => [...prev, newMessage]);
  };

  const handleReact = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions?.find(r => r.emoji === emoji);
        
        if (existingReaction) {
          // Toggle reaction
          if (existingReaction.users.includes('You')) {
            return {
              ...msg,
              reactions: msg.reactions?.map(r => 
                r.emoji === emoji 
                  ? { ...r, users: r.users.filter(u => u !== 'You') }
                  : r
              ).filter(r => r.users.length > 0)
            };
          } else {
            return {
              ...msg,
              reactions: msg.reactions?.map(r => 
                r.emoji === emoji 
                  ? { ...r, users: [...r.users, 'You'] }
                  : r
              )
            };
          }
        } else {
          // Add new reaction
          return {
            ...msg,
            reactions: [...(msg.reactions || []), { emoji, users: ['You'] }]
          };
        }
      }
      return msg;
    }));
  };

  const handleReply = (messageId: string) => {
    console.log('Reply to message:', messageId);
    // In a real app, would set reply context
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const clearAllMessages = () => {
    if (window.confirm('Are you sure you want to clear all messages? This cannot be undone.')) {
      setMessages([]);
      localStorage.removeItem(STORAGE_KEY);
      alert('All messages cleared successfully!');
    }
  };

  // Filter messages by active channel
  const channelMessages = messages.filter(msg => msg.channelId === activeChannel);
  const totalMessages = messages.length;
  const channelCount = DEFAULT_CHANNELS.length;

  return (
    <PageLayout
      title="COMMUNICATION – Communicate – v2.0"
      description="Team communication and messaging with full chat functionality"
      actions={
        <Button 
          variant="outline" 
          size="sm"
          onClick={clearAllMessages}
        >
          <Archive className="mr-2 h-4 w-4" />
          Clear All Messages
        </Button>
      }
      kpis={[
        {
          title: 'Total Messages',
          value: totalMessages.toString(),
          change: `${channelMessages.length} in this channel`,
          changeType: 'neutral',
          icon: <MessageSquare className="h-5 w-5" />
        },
        {
          title: 'Active Channels',
          value: channelCount.toString(),
          change: 'Available',
          changeType: 'neutral',
          icon: <Hash className="h-5 w-5" />
        },
        {
          title: 'Current Channel',
          value: DEFAULT_CHANNELS.find(c => c.id === activeChannel)?.name || 'General',
          change: DEFAULT_CHANNELS.find(c => c.id === activeChannel)?.icon || '💬',
          changeType: 'neutral',
          icon: <Users className="h-5 w-5" />
        },
        {
          title: 'Status',
          value: 'Online',
          change: 'Connected',
          changeType: 'positive',
          icon: <MessageSquare className="h-5 w-5" />
        },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-280px)]">
        {/* Channels Sidebar */}
        <div className="lg:col-span-1 rounded-lg border border-border bg-card p-4 overflow-y-auto">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Channels
          </h3>
          <div className="space-y-2">
            {DEFAULT_CHANNELS.map(channel => (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  activeChannel === channel.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
              >
                <span>{channel.icon}</span>
                <span className="flex-1">{channel.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeChannel === channel.id 
                    ? 'bg-primary-foreground/20' 
                    : 'bg-muted'
                }`}>
                  {messages.filter(m => m.channelId === channel.id).length}
                </span>
              </button>
            ))}
          </div>

          {/* Info Section */}
          <div className="mt-6 p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground mb-2">
              <strong>💡 Features:</strong>
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>✅ Send text messages</li>
              <li>✅ Upload files & images</li>
              <li>✅ Record voice notes</li>
              <li>✅ Add emoji reactions</li>
              <li>✅ Message persistence</li>
            </ul>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3 rounded-lg border border-border bg-card flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl">
                {DEFAULT_CHANNELS.find(c => c.id === activeChannel)?.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">
                  {DEFAULT_CHANNELS.find(c => c.id === activeChannel)?.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {channelMessages.length} {channelMessages.length === 1 ? 'message' : 'messages'}
                </p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {channelMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <MessageSquare className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Start a conversation by typing a message below. You can also upload files, record voice notes, and add emojis!
                </p>
              </div>
            ) : (
              <>
                {channelMessages.map(message => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    onReact={handleReact}
                    onReply={handleReply}
                  />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Message Input */}
          <EnhancedMessageInput 
            onSendMessage={handleSendMessage}
            placeholder={`Message #${DEFAULT_CHANNELS.find(c => c.id === activeChannel)?.name.toLowerCase()}`}
          />
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-6 p-4 rounded-md bg-muted/50 border border-border">
        <p className="text-xs text-muted-foreground">
          <strong>🎯 How to use:</strong> Type your message and press Enter to send. Click 📎 to attach files, 🎤 to record voice notes, and 😊 to add emojis. All messages are automatically saved to localStorage and persist across page refreshes. Switch channels using the sidebar to organize conversations by topic.
        </p>
      </div>
    </PageLayout>
  );
}
