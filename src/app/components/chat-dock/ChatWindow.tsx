import { useState, useRef, useEffect } from 'react';
import { X, Minus, Phone, Video, MoreVertical, Send, Paperclip, Smile } from 'lucide-react';
import { ChatWindow as ChatWindowType } from './types';
import { useChatDock } from './ChatDockContext';

interface ChatWindowProps {
  window: ChatWindowType;
}

export function ChatWindow({ window }: ChatWindowProps) {
  const { closeChat, toggleChatState, sendMessage } = useChatDock();
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.state === 'expanded') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [window.messages, window.state]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessage(window.id, messageInput.trim());
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="flex flex-col bg-card border border-border rounded-t-lg shadow-lg overflow-hidden w-80 transition-all duration-200">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 border-b border-border bg-card cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => toggleChatState(window.id)}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Avatar or Indicator */}
          <div className="relative flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {window.title.charAt(0).toUpperCase()}
              </span>
            </div>
            {window.participants[0]?.status && (
              <div className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card ${getStatusColor(window.participants[0].status)}`}></div>
            )}
          </div>
          
          {/* Title and Status */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold truncate">{window.title}</h3>
              {window.unreadCount > 0 && (
                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {window.unreadCount}
                </span>
              )}
            </div>
            {window.type === 'direct' && window.participants[0]?.status && (
              <p className="text-xs text-muted-foreground capitalize">{window.participants[0].status}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          {window.state === 'expanded' && (
            <>
              <button
                onClick={() => {}}
                className="p-1.5 hover:bg-muted rounded transition-colors"
                title="Start call"
              >
                <Phone className="h-4 w-4" />
              </button>
              <button
                onClick={() => {}}
                className="p-1.5 hover:bg-muted rounded transition-colors"
                title="Start video call"
              >
                <Video className="h-4 w-4" />
              </button>
            </>
          )}
          <button
            onClick={() => toggleChatState(window.id)}
            className="p-1.5 hover:bg-muted rounded transition-colors"
            title={window.state === 'expanded' ? 'Minimize' : 'Expand'}
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            onClick={() => closeChat(window.id)}
            className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded transition-colors"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {window.state === 'expanded' && (
        <>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-background h-96">
            {window.messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] ${message.isCurrentUser ? 'order-2' : 'order-1'}`}>
                  {!message.isCurrentUser && (
                    <p className="text-xs font-medium text-muted-foreground mb-1 px-1">
                      {message.senderName}
                    </p>
                  )}
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      message.isCurrentUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 px-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-3 bg-card">
            <div className="flex items-end gap-2">
              <div className="flex-1 min-w-0">
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  rows={1}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary max-h-24"
                  style={{ minHeight: '38px' }}
                />
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => {}}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  title="Attach file"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {}}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  title="Emoji"
                >
                  <Smile className="h-4 w-4" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="p-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
