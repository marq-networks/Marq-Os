import { useEffect, useMemo, useRef, useState } from 'react';
import { CommunicateLayout } from '../communicate/CommunicateLayout';
import { MessageBubble } from '../communicate/MessageBubble';
import { MessageInput } from '../communicate/MessageInput';
import { TeamPresencePanel, type TeamMember as PresenceMember } from '../communicate/TeamPresencePanel';
import { useToast } from '../../ui/toast';
import type { Channel, DirectMessage, Message } from '../communicate/types';
import { useAuthService, useCommunicationData, usePeopleData } from '../../../services';
import { Users } from 'lucide-react';

export function EC01CommunicateHome() {
  const { showToast } = useToast();
  const authService = useAuthService();
  const { channels: apiChannels, messages: apiMessages, currentChannelId, selectChannel, sendMessage, loading } = useCommunicationData();
  const { employees } = usePeopleData();
  const [showContextPanel, setShowContextPanel] = useState(true);
  const [currentUserName, setCurrentUserName] = useState('Current User');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    authService.getCurrentUser().then((user) => setCurrentUserName(user.name)).catch(() => {});
  }, [authService]);

  const channels = useMemo<Channel[]>(
    () => apiChannels.map((channel) => ({
      id: channel.id,
      name: channel.name,
      type: channel.type === 'general' ? 'team' : channel.type === 'project' ? 'project' : channel.type === 'direct' ? 'dm' : 'custom',
      description: channel.description,
      isPrivate: channel.type === 'direct',
      members: channel.members,
      unreadCount: channel.unreadCount,
      lastMessage: channel.lastMessage,
      lastMessageTime: channel.lastMessageAt,
      createdBy: channel.createdBy,
      createdAt: channel.createdAt,
      pinnedMessages: [],
      status: channel.archived ? 'Archived' : 'Active',
      isPinned: channel.pinned,
      isMuted: false,
    })),
    [apiChannels],
  );

  const directMessages = useMemo<DirectMessage[]>(
    () =>
      channels
        .filter((channel) => channel.type === 'dm')
        .map((channel) => {
          const otherUser = channel.members.find((member) => member !== currentUserName) || channel.name;
          return {
            id: channel.id,
            participants: channel.members,
            lastMessage: channel.lastMessage || '',
            lastMessageTime: channel.lastMessageTime || channel.createdAt,
            unreadCount: channel.unreadCount,
            otherUser,
            isOnline: true,
          };
        }),
    [channels, currentUserName],
  );

  const messages = useMemo<Message[]>(
    () =>
      apiMessages.map((message) => ({
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
    [apiMessages],
  );

  const presenceMembers = useMemo<PresenceMember[]>(() => {
    return employees.slice(0, 6).map((employee, index) => ({
      id: employee.id,
      name: employee.name,
      role: employee.role,
      status: employee.status === 'Active' ? (index % 3 === 0 ? 'busy' : 'online') : employee.status === 'Away' ? 'away' : 'offline',
      statusMessage: employee.lastSeen,
    }));
  }, [employees]);

  const currentUser = presenceMembers.find((member) => member.name === currentUserName) ?? {
    id: 'user-current',
    name: currentUserName,
    role: 'You',
    status: 'online' as const,
  };

  const teamMembers = presenceMembers.filter((member) => member.id !== currentUser.id);
  const meetings = channels.slice(0, 2).map((channel, index) => ({
    id: channel.id,
    title: `${channel.name} sync`,
    participants: channel.members,
    startTime: new Date(Date.now() + index * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + (index + 1) * 60 * 60 * 1000).toISOString(),
    isOngoing: index === 0,
  }));

  const activeChannelId = currentChannelId || channels[0]?.id;
  const activeChannel = channels.find(c => c.id === activeChannelId);
  const channelMessages = messages.filter(m => m.channelId === activeChannelId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channelMessages]);

  useEffect(() => {
    if (!currentChannelId && channels[0]?.id) {
      selectChannel(channels[0].id);
    }
  }, [channels, currentChannelId, selectChannel]);

  const handleSendMessage = (content: string) => {
    if (!activeChannelId) return;
    void sendMessage(activeChannelId, content);
  };

  const handleReact = () => showToast('info', 'Reactions', 'Reactions are view-only on this screen for now');

  const handleReply = () => {
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
      directMessages={directMessages}
      activeChannelId={activeChannelId}
      onChannelSelect={selectChannel}
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
          {loading ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">Loading conversation...</div>
          ) : channelMessages.length === 0 ? (
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
