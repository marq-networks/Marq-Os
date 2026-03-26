import { useState, useRef } from 'react';
import { Button } from '../../ui/button';
import { 
  Paperclip, 
  Mic, 
  Send, 
  Smile,
  AtSign
} from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onAttachFile?: () => void;
  onVoiceNote?: () => void;
  placeholder?: string;
}

export function MessageInput({ 
  onSendMessage, 
  onAttachFile,
  onVoiceNote,
  placeholder = 'Type a message...'
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage('');
  };

  const insertMention = () => {
    setMessage(prev => prev + '@');
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      {/* Input Bar */}
      <div className="border-t border-border bg-card p-4">
        <div className="flex items-end gap-2">
          {/* Left Actions */}
          <div className="flex gap-1">
            {onAttachFile && (
              <Button 
                size="sm" 
                variant="ghost"
                onClick={onAttachFile}
                type="button"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            )}
            {onVoiceNote && (
              <Button 
                size="sm" 
                variant="ghost"
                onClick={onVoiceNote}
                type="button"
              >
                <Mic className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={1}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent max-h-32"
              style={{ minHeight: '40px', maxHeight: '128px' }}
            />
            {message.length === 0 && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <button
                  onClick={insertMention}
                  className="p-1 hover:bg-background rounded transition-colors"
                  type="button"
                  title="Mention someone"
                >
                  <AtSign className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex gap-1">
            <Button 
              size="sm" 
              variant="ghost"
              type="button"
              title="Add emoji"
            >
              <Smile className="h-4 w-4" />
            </Button>
            <Button 
              size="sm"
              onClick={handleSend}
              disabled={!message.trim()}
              type="button"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
