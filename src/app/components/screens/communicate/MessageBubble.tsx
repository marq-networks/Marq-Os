import { Message } from './types';
import { Button } from '../../ui/button';
import { 
  FileText, 
  Download, 
  MoreVertical,
  Reply,
  Smile
} from 'lucide-react';
import { useState } from 'react';

interface MessageBubbleProps {
  message: Message;
  onReact?: (messageId: string, emoji: string) => void;
  onReply?: (messageId: string) => void;
}

export function MessageBubble({ 
  message, 
  onReact, 
  onReply
}: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + 
             date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
  };

  // System Message - De-emphasized and minimal
  if (message.type === 'system') {
    return (
      <div className="flex items-center justify-center py-1 opacity-40">
        <div className="text-[10px] text-muted-foreground/60">
          {message.content}
        </div>
      </div>
    );
  }

  // Normal Message - Human chat bubbles
  return (
    <div 
      className="group py-2 px-4 hover:bg-muted/50 transition-colors"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium">
            {message.sender.charAt(0)}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-medium text-sm">{message.sender}</span>
            <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
            {message.edited && (
              <span className="text-xs text-muted-foreground">(edited)</span>
            )}
          </div>
          {message.replyTo && (
            <div className="mb-2 pl-3 border-l-2 border-muted text-xs text-muted-foreground">
              Replying to previous message
            </div>
          )}
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          
          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map(att => (
                <div key={att.id} className="flex items-center gap-2 p-2 bg-muted rounded border border-border">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm flex-1 truncate">{att.name}</span>
                  {att.size && <span className="text-xs text-muted-foreground">{att.size}</span>}
                  <Button size="sm" variant="ghost">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {message.reactions.map((reaction, idx) => (
                <button 
                  key={idx}
                  className="flex items-center gap-1 px-2 py-1 bg-muted hover:bg-muted/70 rounded-full text-xs transition-colors"
                >
                  <span>{reaction.emoji}</span>
                  <span className="font-medium">{reaction.users.length}</span>
                </button>
              ))}
              <button 
                className="flex items-center gap-1 px-2 py-1 bg-muted hover:bg-muted/70 rounded-full text-xs transition-colors"
                onClick={() => onReact && onReact(message.id, '👍')}
              >
                <Smile className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Action Buttons */}
          {showActions && (
            <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => onReact && onReact(message.id, '👍')}
              >
                <Smile className="h-3 w-3" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => onReply && onReply(message.id)}
              >
                <Reply className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="ghost">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}