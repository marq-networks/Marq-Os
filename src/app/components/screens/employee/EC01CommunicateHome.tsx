import { useState, useRef, useEffect } from 'react';
import { CommunicateLayout } from '../communicate/CommunicateLayout';
import { MessageBubble } from '../communicate/MessageBubble';
import { MessageInput } from '../communicate/MessageInput';
import { TeamPresencePanel } from '../communicate/TeamPresencePanel';
import { useToast } from '../../ui/toast';
import { mockChannels, mockMessages, mockDirectMessages, mockCurrentUser, mockTeamMembers, mockMeetings } from '../communicate/mockData';
import { Message, Channel } from '../communicate/types';
import { StatusBadge } from '../../shared/StatusBadge';
import { 
  Users, 
  Pin, 
  FileText, 
  Image as ImageIcon
} from 'lucide-react';
import communicationScreenshot from 'figma:asset/5e1c89bf8092875682f6b5971d3766116f2b4270.png';

export function EC01CommunicateHome() {
  const { showToast } = useToast();
  const [channels] = useState(mockChannels);
  const [activeChannelId, setActiveChannelId] = useState(mockChannels[0]?.id);
  const [messages, setMessages] = useState(mockMessages);
  const [showContextPanel, setShowContextPanel] = useState(true);
  const [currentUser, setCurrentUser] = useState(mockCurrentUser);
  const [teamMembers, setTeamMembers] = useState(mockTeamMembers);
  const [meetings, setMeetings] = useState(mockMeetings);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChannel = channels.find(c => c.id === activeChannelId);
  const channelMessages = messages.filter(m => m.channelId === activeChannelId);

  // Simulate random team member status changes (optional dynamic feature)
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update a team member's status
      setTeamMembers(prev => {
        const randomIndex = Math.floor(Math.random() * (prev.length - 1)); // Exclude current user
        const newMembers = [...prev];
        const statuses: ('online' | 'away' | 'busy' | 'offline')[] = ['online', 'away', 'busy', 'offline'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        if (newMembers[randomIndex].id !== 'user-current') {
          newMembers[randomIndex] = {
            ...newMembers[randomIndex],
            status: randomStatus
          };
        }
        
        return newMembers;
      });
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channelMessages]);

  const handleSendMessage = (content: string) => {
    if (!activeChannelId) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      channelId: activeChannelId,
      type: 'normal',
      sender: 'Current User',
      content: content,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const handleReact = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions?.find(r => r.emoji === emoji);
        if (existingReaction) {
          // Add user to existing reaction
          if (!existingReaction.users.includes('Current User')) {
            existingReaction.users.push('Current User');
          }
        } else {
          // Create new reaction
          const newReactions = msg.reactions || [];
          newReactions.push({ emoji, users: ['Current User'] });
          return { ...msg, reactions: newReactions };
        }
      }
      return msg;
    }));
  };

  const handleReply = (messageId: string) => {
    showToast('info', 'Reply', 'Reply feature activated');
  };

  const handleStartVideoCall = () => {
    showToast('info', 'Video Call', 'Starting video call...');
  };

  const handleStartAudioCall = () => {
    showToast('info', 'Audio Call', 'Starting audio call...');
  };

  const handleChannelSettings = () => {
    showToast('info', 'Settings', 'Channel settings (Feature placeholder)');
  };

  // Team Presence Panel Handlers
  const handleStatusChange = (status: any, duration?: string) => {
    showToast('success', 'Status Updated', `Status changed to ${status}`);
  };

  const handleCheckIn = () => {
    showToast('success', 'Checked In', 'You are now checked in');
  };

  const handleMeetNow = () => {
    showToast('info', 'Meet Now', 'Starting instant meeting...');
  };

  const handleScheduleMeeting = () => {
    showToast('info', 'Schedule Meeting', 'Opening meeting scheduler...');
  };

  const handleViewMeetingHistory = () => {
    showToast('info', 'Meeting History', 'Viewing past meetings...');
  };

  // Context Panel Content - Team Presence
  const contextPanel = (
    <TeamPresencePanel
      currentUser={currentUser}
      teamMembers={teamMembers}
      meetings={meetings}
      onStatusChange={handleStatusChange}
      onCheckIn={handleCheckIn}
      onMeetNow={handleMeetNow}
      onScheduleMeeting={handleScheduleMeeting}
      onViewMeetingHistory={handleViewMeetingHistory}
    />
  );

  return (
    <CommunicateLayout
      channels={channels}
      directMessages={mockDirectMessages}
      activeChannelId={activeChannelId}
      onChannelSelect={setActiveChannelId}
      channelName={activeChannel?.name}
      channelDescription={activeChannel?.description}
      showContextPanel={showContextPanel}
      onToggleContextPanel={() => setShowContextPanel(!showContextPanel)}
      onStartVideoCall={handleStartVideoCall}
      onStartAudioCall={handleStartAudioCall}
      onChannelSettings={handleChannelSettings}
      contextPanel={contextPanel}
    >
      {/* Message Feed */}
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          {channelMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium mb-1">No messages yet</p>
                <p className="text-sm text-muted-foreground">
                  Be the first to send a message in #{activeChannel?.name}
                </p>
              </div>
            </div>
          ) : (
            <>
              {channelMessages.map(msg => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  onReact={handleReact}
                  onReply={handleReply}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message Input */}
        <MessageInput
          onSendMessage={handleSendMessage}
          onAttachFile={() => showToast('info', 'Attach File', 'File upload (Feature placeholder)')}
          onVoiceNote={() => showToast('info', 'Voice Note', 'Voice recording (Feature placeholder)')}
          placeholder={`Message #${activeChannel?.name || 'channel'}`}
        />
      </div>
    </CommunicateLayout>
  );
}