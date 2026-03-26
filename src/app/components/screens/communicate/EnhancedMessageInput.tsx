import { useState, useRef } from 'react';
import { Button } from '../../ui/button';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { 
  Paperclip, 
  Mic, 
  Send, 
  Smile,
  X,
  Image as ImageIcon,
  File as FileIcon,
  StopCircle
} from 'lucide-react';

interface EnhancedMessageInputProps {
  onSendMessage: (content: string, attachments?: File[], voiceNote?: Blob) => void;
  placeholder?: string;
}

export function EnhancedMessageInput({ 
  onSendMessage, 
  placeholder = 'Type a message...'
}: EnhancedMessageInputProps) {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onSendMessage('Voice note', [], audioBlob);
        setIsRecording(false);
        setRecordingTime(0);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please grant permission and try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const handleSend = () => {
    if (!message.trim() && attachments.length === 0) return;
    
    onSendMessage(message.trim(), attachments);
    setMessage('');
    setAttachments([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative border-t border-border bg-card">
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-full right-4 mb-2 z-50">
          <EmojiPicker 
            onEmojiClick={handleEmojiClick}
            autoFocusSearch={false}
            width={350}
            height={400}
          />
        </div>
      )}

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="p-3 border-b border-border">
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg border border-border"
              >
                {file.type.startsWith('image/') ? (
                  <ImageIcon className="h-4 w-4 text-blue-500" />
                ) : (
                  <FileIcon className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm truncate max-w-[150px]">{file.name}</span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="p-0.5 hover:bg-background rounded transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recording Indicator */}
      {isRecording && (
        <div className="p-3 border-b border-border bg-red-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Recording...</span>
              </div>
              <span className="text-sm text-muted-foreground font-mono">
                {formatTime(recordingTime)}
              </span>
            </div>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={stopRecording}
            >
              <StopCircle className="mr-2 h-4 w-4" />
              Stop & Send
            </Button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4">
        <div className="flex items-end gap-2">
          {/* File Input (Hidden) */}
          <input 
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
          />

          {/* Left Actions */}
          <div className="flex gap-1">
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              title="Attach files"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            
            {!isRecording && (
              <Button 
                size="sm" 
                variant="ghost"
                onClick={startRecording}
                title="Record voice note"
              >
                <Mic className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={placeholder}
              rows={1}
              disabled={isRecording}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent max-h-32"
              style={{ minHeight: '40px', maxHeight: '128px' }}
            />
          </div>

          {/* Right Actions */}
          <div className="flex gap-1">
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              title="Add emoji"
            >
              <Smile className="h-4 w-4" />
            </Button>
            <Button 
              size="sm"
              onClick={handleSend}
              disabled={(!message.trim() && attachments.length === 0) || isRecording}
              title="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
