import { Channel, Message, DirectMessage } from './types';
import { TeamMember, Meeting } from './TeamPresencePanel';

// Mock Channels
export const mockChannels: Channel[] = [
  {
    id: 'ch-1',
    name: 'team-engineering',
    type: 'team',
    description: 'Engineering team discussions',
    isPrivate: false,
    members: ['Sarah Johnson', 'Michael Chen', 'David Kim', 'Emily Martinez', 'James Wilson', 'Lisa Anderson'],
    unreadCount: 3,
    lastMessage: 'The new deployment is ready for review',
    lastMessageTime: '2025-01-02T14:30:00Z',
    createdBy: 'Sarah Johnson',
    createdAt: '2024-11-01T10:00:00Z',
    pinnedMessages: ['msg-5'],
    status: 'Active',
    isPinned: true
  },
  {
    id: 'ch-2',
    name: 'project-mobile-redesign',
    type: 'project',
    description: 'Mobile app redesign project coordination',
    isPrivate: false,
    members: ['Sarah Johnson', 'Michael Chen', 'Emily Martinez', 'Lisa Anderson'],
    unreadCount: 7,
    lastMessage: 'Great progress everyone! Phase 1 looking good.',
    lastMessageTime: '2025-01-02T16:15:00Z',
    createdBy: 'Sarah Johnson',
    createdAt: '2024-12-01T09:00:00Z',
    pinnedMessages: ['msg-12'],
    status: 'Active'
  },
  {
    id: 'ch-3',
    name: 'design-system',
    type: 'group',
    description: 'Design system discussions and updates',
    isPrivate: false,
    members: ['Sarah Johnson', 'Michael Chen', 'Emily Martinez'],
    unreadCount: 2,
    lastMessage: 'New component library is ready for testing',
    lastMessageTime: '2025-01-02T11:45:00Z',
    createdBy: 'Sarah Johnson',
    createdAt: '2024-12-15T14:00:00Z',
    pinnedMessages: [],
    status: 'Active',
    isPinned: true
  },
  {
    id: 'ch-4',
    name: 'announcements',
    type: 'announcement',
    description: 'Company-wide announcements',
    isPrivate: false,
    members: ['Sarah Johnson', 'Michael Chen', 'David Kim', 'Emily Martinez', 'James Wilson', 'Lisa Anderson', 'John Smith'],
    unreadCount: 1,
    lastMessage: 'New company policy on remote work effective Jan 15',
    lastMessageTime: '2025-01-01T09:00:00Z',
    createdBy: 'John Smith',
    createdAt: '2024-01-01T08:00:00Z',
    pinnedMessages: ['msg-20', 'msg-21'],
    status: 'Active'
  },
  {
    id: 'ch-5',
    name: 'team-design',
    type: 'team',
    description: 'Design team collaboration',
    isPrivate: false,
    members: ['Emily Martinez', 'Lisa Anderson', 'Sarah Johnson'],
    unreadCount: 0,
    lastMessage: 'Latest design system updates are live',
    lastMessageTime: '2025-01-01T16:30:00Z',
    createdBy: 'Emily Martinez',
    createdAt: '2024-10-15T10:00:00Z',
    pinnedMessages: [],
    status: 'Active'
  },
  {
    id: 'ch-6',
    name: 'project-ecommerce',
    type: 'project',
    description: 'E-commerce platform development',
    isPrivate: false,
    members: ['Michael Chen', 'David Kim', 'James Wilson', 'Sarah Johnson'],
    unreadCount: 5,
    lastMessage: 'Sprint planning meeting tomorrow at 10am',
    lastMessageTime: '2025-01-02T17:00:00Z',
    createdBy: 'Michael Chen',
    createdAt: '2024-11-15T08:00:00Z',
    pinnedMessages: [],
    status: 'Active'
  },
  {
    id: 'ch-7',
    name: 'random',
    type: 'custom',
    description: 'Water cooler chat and casual conversations',
    isPrivate: false,
    members: ['Sarah Johnson', 'Michael Chen', 'David Kim', 'Emily Martinez', 'James Wilson', 'Lisa Anderson'],
    unreadCount: 0,
    lastMessage: 'Anyone up for lunch today?',
    lastMessageTime: '2025-01-02T12:30:00Z',
    createdBy: 'David Kim',
    createdAt: '2024-09-01T08:00:00Z',
    pinnedMessages: [],
    status: 'Active'
  },
  {
    id: 'ch-8',
    name: 'frontend-crew',
    type: 'group',
    description: 'Frontend developers coordination',
    isPrivate: false,
    members: ['Sarah Johnson', 'Emily Martinez', 'Lisa Anderson'],
    unreadCount: 0,
    lastMessage: 'Let\'s review the new component library tomorrow',
    lastMessageTime: '2025-01-02T10:15:00Z',
    createdBy: 'Emily Martinez',
    createdAt: '2024-12-20T09:00:00Z',
    pinnedMessages: [],
    status: 'Active'
  },
];

// Mock Direct Messages
export const mockDirectMessages: DirectMessage[] = [
  {
    id: 'dm-1',
    participants: ['Current User', 'Sarah Johnson'],
    lastMessage: 'Can you review the PR when you get a chance?',
    lastMessageTime: '2025-01-02T15:20:00Z',
    unreadCount: 2,
    otherUser: 'Sarah Johnson',
    isOnline: true,
    isPinned: true
  },
  {
    id: 'dm-2',
    participants: ['Current User', 'Michael Chen'],
    lastMessage: 'Thanks for the update!',
    lastMessageTime: '2025-01-02T12:10:00Z',
    unreadCount: 0,
    otherUser: 'Michael Chen',
    isOnline: false
  },
  {
    id: 'dm-3',
    participants: ['Current User', 'Emily Martinez'],
    lastMessage: 'Meeting notes attached',
    lastMessageTime: '2025-01-01T18:45:00Z',
    unreadCount: 1,
    otherUser: 'Emily Martinez',
    isOnline: true
  },
  {
    id: 'dm-4',
    participants: ['Current User', 'David Kim'],
    lastMessage: 'See you at the standup!',
    lastMessageTime: '2025-01-01T09:15:00Z',
    unreadCount: 0,
    otherUser: 'David Kim',
    isOnline: true,
    isMuted: true
  },
];

// Mock Messages - Clean conversation data
export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    channelId: 'ch-1',
    type: 'normal',
    sender: 'Sarah Johnson',
    content: 'Good morning team! Ready for today\'s standup?',
    timestamp: '2025-01-02T09:00:00Z',
    reactions: [
      { emoji: '👍', users: ['Michael Chen', 'David Kim'] },
      { emoji: '🔥', users: ['Emily Martinez'] }
    ]
  },
  {
    id: 'msg-2',
    channelId: 'ch-1',
    type: 'normal',
    sender: 'Michael Chen',
    content: 'Yes! I have some updates on the API integration work.',
    timestamp: '2025-01-02T09:02:00Z',
    replyTo: 'msg-1'
  },
  {
    id: 'msg-3',
    channelId: 'ch-1',
    type: 'normal',
    sender: 'David Kim',
    content: 'I finished the API documentation. Here it is:',
    timestamp: '2025-01-02T11:30:00Z',
    attachments: [
      {
        id: 'att-1',
        name: 'api_documentation_v2.pdf',
        type: 'document',
        url: '#',
        size: '2.4 MB'
      }
    ]
  },
  {
    id: 'msg-4',
    channelId: 'ch-1',
    type: 'normal',
    sender: 'Emily Martinez',
    content: 'Nice work David! 🎉',
    timestamp: '2025-01-02T11:32:00Z',
    reactions: [
      { emoji: '🎉', users: ['Michael Chen', 'Sarah Johnson'] }
    ]
  },
  {
    id: 'msg-5',
    channelId: 'ch-1',
    type: 'normal',
    sender: 'Sarah Johnson',
    content: '📌 REMINDER: Code freeze starts Friday 5pm for the release',
    timestamp: '2025-01-02T12:00:00Z',
    reactions: [
      { emoji: '📌', users: ['Michael Chen', 'David Kim', 'Emily Martinez', 'James Wilson'] }
    ]
  },
  {
    id: 'msg-6',
    channelId: 'ch-1',
    type: 'normal',
    sender: 'James Wilson',
    content: 'The new deployment is ready for review',
    timestamp: '2025-01-02T14:30:00Z'
  },
  {
    id: 'msg-7',
    channelId: 'ch-1',
    type: 'system',
    sender: 'System',
    content: 'Lisa Anderson joined the channel',
    timestamp: '2025-01-02T15:00:00Z',
    isBot: true
  },
  {
    id: 'msg-8',
    channelId: 'ch-2',
    type: 'normal',
    sender: 'Sarah Johnson',
    content: 'Great progress everyone! Let\'s push to complete Phase 1 this week.',
    timestamp: '2025-01-02T16:20:00Z',
    mentions: ['@Michael Chen', '@Emily Martinez']
  },
  {
    id: 'msg-9',
    channelId: 'ch-2',
    type: 'normal',
    sender: 'Michael Chen',
    content: 'I\'m on track to finish the mobile components by Wednesday.',
    timestamp: '2025-01-02T16:25:00Z',
    reactions: [
      { emoji: '💪', users: ['Sarah Johnson', 'Emily Martinez'] }
    ]
  },
  {
    id: 'msg-10',
    channelId: 'ch-3',
    type: 'normal',
    sender: 'Emily Martinez',
    content: 'I\'ve updated the design system with the new components. Check it out:',
    timestamp: '2025-01-02T11:45:00Z',
    attachments: [
      {
        id: 'att-2',
        name: 'design_system_v3.fig',
        type: 'link',
        url: '#'
      }
    ]
  },
  {
    id: 'msg-11',
    channelId: 'ch-3',
    type: 'normal',
    sender: 'Sarah Johnson',
    content: 'Looks fantastic! The new color palette is much better.',
    timestamp: '2025-01-02T11:50:00Z',
    reactions: [
      { emoji: '🎨', users: ['Emily Martinez', 'Michael Chen'] }
    ]
  },
  {
    id: 'msg-12',
    channelId: 'ch-2',
    type: 'normal',
    sender: 'Lisa Anderson',
    content: 'Quick reminder: Design review meeting at 3pm today',
    timestamp: '2025-01-02T14:00:00Z',
    reactions: [
      { emoji: '👍', users: ['Sarah Johnson', 'Michael Chen', 'Emily Martinez'] }
    ]
  },
  {
    id: 'msg-13',
    channelId: 'ch-4',
    type: 'system',
    sender: 'System',
    content: 'New announcement posted by John Smith',
    timestamp: '2025-01-01T09:00:00Z',
    isBot: true
  },
  {
    id: 'msg-14',
    channelId: 'ch-7',
    type: 'normal',
    sender: 'David Kim',
    content: 'Anyone up for lunch today?',
    timestamp: '2025-01-02T12:30:00Z',
    reactions: [
      { emoji: '🍕', users: ['Michael Chen', 'James Wilson'] }
    ]
  },
];

// Mock Team Presence Data
export const mockCurrentUser: TeamMember = {
  id: 'user-current',
  name: 'You',
  role: 'Founder & CEO',
  status: 'away',
  statusMessage: 'Out for lunch',
  statusDuration: 'for 30 mins'
};

export const mockTeamMembers: TeamMember[] = [
  {
    id: 'user-1',
    name: 'Sarah Johnson',
    role: 'Engineering Lead',
    status: 'offline',
    statusMessage: 'Be back soon'
  },
  {
    id: 'user-2',
    name: 'Michael Chen',
    role: 'Senior Frontend Developer',
    status: 'offline'
  },
  {
    id: 'user-3',
    name: 'Emily Martinez',
    role: 'UX Designer',
    status: 'away',
    statusMessage: 'In a meeting'
  },
  {
    id: 'user-4',
    name: 'David Kim',
    role: 'Backend Developer',
    status: 'offline'
  },
  {
    id: 'user-5',
    name: 'James Wilson',
    role: 'DevOps Engineer',
    status: 'offline'
  },
  {
    id: 'user-6',
    name: 'Lisa Anderson',
    role: 'Product Designer',
    status: 'busy',
    statusMessage: 'Do not disturb',
    statusDuration: 'for 2 hours'
  },
  mockCurrentUser
];

export const mockMeetings: Meeting[] = [
  // No ongoing meetings currently
];