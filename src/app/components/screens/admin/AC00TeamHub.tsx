import { useState } from 'react';
import { 
  Users, 
  Search, 
  Video, 
  Phone, 
  MoreVertical,
  UserPlus,
  Settings,
  Plus,
  MessageSquare,
  Clock,
  Pin,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronRight,
  Bell,
  BellOff,
  Coffee,
  Moon,
  Briefcase,
  Home,
  Calendar,
  Utensils,
  LogIn,
  LogOut,
  Activity,
  Camera,
  CameraOff,
  Edit,
  Trash2,
  Shield,
  Crown,
  FolderPlus,
  UserCog,
  Building2
} from 'lucide-react';
import { StatusBadge } from '../../shared/StatusBadge';
import { useToast } from '../../ui/toast';
import { useChatDock } from '../../chat-dock';
import { useRouter } from '../../router';

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  statusMessage?: string;
  department: string;
}

interface Conversation {
  id: string;
  type: 'direct' | 'group' | 'channel';
  name: string;
  avatar?: string;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
  isPinned?: boolean;
  isMuted?: boolean;
}

// Enhanced mock team members with departments
const mockTeamMembers: TeamMember[] = [
  { id: 'tm-1', name: 'Sarah Johnson', role: 'Engineering Lead', status: 'online', department: 'Engineering' },
  { id: 'tm-2', name: 'Michael Chen', role: 'Senior Frontend Developer', status: 'online', department: 'Engineering' },
  { id: 'tm-3', name: 'Emily Martinez', role: 'UX Designer', status: 'away', department: 'Design' },
  { id: 'tm-4', name: 'David Kim', role: 'Backend Developer', status: 'offline', department: 'Engineering' },
  { id: 'tm-5', name: 'James Wilson', role: 'DevOps Engineer', status: 'offline', department: 'Engineering' },
  { id: 'tm-6', name: 'Lisa Anderson', role: 'Product Manager', status: 'online', department: 'Product' },
  { id: 'tm-7', name: 'Robert Taylor', role: 'QA Lead', status: 'busy', department: 'Engineering' },
  { id: 'tm-8', name: 'Maria Garcia', role: 'UI Designer', status: 'away', department: 'Design' },
  { id: 'tm-9', name: 'You', role: 'Founder & CEO', status: 'online', department: 'Executive' },
  { id: 'tm-10', name: 'John Carter', role: 'Marketing Lead', status: 'online', department: 'Marketing' },
  { id: 'tm-11', name: 'Anna Smith', role: 'Sales Director', status: 'busy', department: 'Sales' },
  { id: 'tm-12', name: 'Tom Brown', role: 'HR Manager', status: 'away', department: 'HR' },
  { id: 'tm-13', name: 'Kate Wilson', role: 'Senior Designer', status: 'online', department: 'Design' },
  { id: 'tm-14', name: 'Alex Johnson', role: 'Frontend Developer', status: 'online', department: 'Engineering' },
  { id: 'tm-15', name: 'Sophie Davis', role: 'Product Designer', status: 'away', department: 'Product' },
];

const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    type: 'direct',
    name: 'Sarah Johnson',
    lastMessage: 'Thanks for the update!',
    timestamp: '2m ago',
    unreadCount: 2,
    isPinned: true
  },
  {
    id: 'conv-2',
    type: 'group',
    name: 'Product Team',
    lastMessage: 'Meeting at 3 PM',
    timestamp: '15m ago',
    unreadCount: 5,
    isPinned: true
  },
  {
    id: 'conv-3',
    type: 'channel',
    name: '# general',
    lastMessage: 'Welcome everyone!',
    timestamp: '1h ago',
    unreadCount: 0,
    isPinned: false
  },
  {
    id: 'conv-4',
    type: 'direct',
    name: 'Michael Chen',
    lastMessage: 'Can we schedule a call?',
    timestamp: '2h ago',
    unreadCount: 1,
    isPinned: false
  },
  {
    id: 'conv-5',
    type: 'group',
    name: 'Design Review',
    lastMessage: 'New mockups shared',
    timestamp: '3h ago',
    unreadCount: 0,
    isMuted: true
  },
];

export function AC00TeamHub() {
  const { showToast } = useToast();
  const { openChat } = useChatDock();
  const { currentPath } = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [teamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [selectedTab, setSelectedTab] = useState<'direct' | 'group' | 'channel'>('direct');
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(
    new Set(['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'HR', 'Executive'])
  );
  const [currentUserStatus, setCurrentUserStatus] = useState<'online' | 'away' | 'busy' | 'offline'>('online');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [doNotDisturb, setDoNotDisturb] = useState(false);
  const [inOffice, setInOffice] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [onCoffeeBreak, setOnCoffeeBreak] = useState(false);
  const [onLunchBreak, setOnLunchBreak] = useState(false);
  const [liveVideoFeedEnabled, setLiveVideoFeedEnabled] = useState(false);
  const [membersWithCamera, setMembersWithCamera] = useState<Set<string>>(new Set());

  // Check if currently on conversation page
  const isOnConversationPage = currentPath === '/communication/conversations' || 
                                currentPath === '/admin/communicate' ||
                                currentPath === '/communication/team-hub';

  // Filter team members by search
  const filteredTeamMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Group team members by status
  const atWorkMembers = filteredTeamMembers.filter(m => m.status === 'online' || m.status === 'away' || m.status === 'offline');
  const inMeetingsMembers = filteredTeamMembers.filter(m => m.status === 'busy');

  // Group by department for middle box
  const membersByDepartment = filteredTeamMembers.reduce((acc, member) => {
    if (!acc[member.department]) {
      acc[member.department] = [];
    }
    acc[member.department].push(member);
    return acc;
  }, {} as Record<string, TeamMember[]>);

  // Filter conversations
  const pinnedConversations = conversations.filter(c => c.isPinned);
  const activeConversations = conversations.filter(c => !c.isPinned && !c.isMuted && (c.unreadCount || 0) > 0);
  const mutedConversations = conversations.filter(c => c.isMuted);

  // Filter conversations by selected tab
  const getFilteredConversations = () => {
    let filtered = conversations;
    
    switch (selectedTab) {
      case 'direct':
        filtered = conversations.filter(c => c.type === 'direct');
        break;
      case 'group':
        filtered = conversations.filter(c => c.type === 'group');
        break;
      case 'channel':
        filtered = conversations.filter(c => c.type === 'channel');
        break;
    }
    
    return {
      pinned: filtered.filter(c => c.isPinned),
      active: filtered.filter(c => !c.isPinned && !c.isMuted && (c.unreadCount || 0) > 0),
      muted: filtered.filter(c => c.isMuted)
    };
  };

  const filteredConversations = getFilteredConversations();

  const toggleDepartment = (department: string) => {
    const newExpanded = new Set(expandedDepartments);
    if (newExpanded.has(department)) {
      newExpanded.delete(department);
    } else {
      newExpanded.add(department);
    }
    setExpandedDepartments(newExpanded);
  };

  const handleMemberClick = (member: TeamMember) => {
    // Open chat in dock
    openChat({
      id: member.id,
      type: 'direct',
      title: member.name,
      participants: [
        { 
          id: member.id, 
          name: member.name,
          status: member.status
        }
      ]
    });

    // Show notification only if not on conversation page
    if (!isOnConversationPage) {
      showToast('success', 'Chat Opened', `Started conversation with ${member.name}`);
    }
  };

  const handleConversationClick = (conv: Conversation) => {
    openChat({
      id: conv.id,
      type: conv.type,
      title: conv.name,
      participants: [{ 
        id: conv.id, 
        name: conv.name,
        status: 'online'
      }]
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  // For "At Work" box - assign different colors to differentiate people
  const getAtWorkColor = (index: number) => {
    const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-teal-500'];
    return colors[index % colors.length];
  };

  const TeamMemberCard = ({ member, colorOverride }: { member: TeamMember; colorOverride?: string }) => {
    const hasCameraEnabled = membersWithCamera.has(member.id);
    
    const toggleCamera = (e: React.MouseEvent) => {
      e.stopPropagation();
      const newMembers = new Set(membersWithCamera);
      if (newMembers.has(member.id)) {
        newMembers.delete(member.id);
        showToast('info', 'Camera Disabled', `${member.name}'s camera feed stopped`);
      } else {
        newMembers.add(member.id);
        showToast('success', 'Camera Enabled', `Monitoring ${member.name}'s workspace`);
      }
      setMembersWithCamera(newMembers);
    };
    
    return (
      <div
        onClick={() => handleMemberClick(member)}
        className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer group"
      >
        {/* Avatar with status OR Camera Feed */}
        <div className="relative flex-shrink-0">
          {liveVideoFeedEnabled && hasCameraEnabled ? (
            // Live Camera Feed Simulation
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-green-500 relative">
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                <Camera className="h-5 w-5 text-white opacity-70" />
              </div>
              {/* Live indicator */}
              <div className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></div>
            </div>
          ) : (
            // Regular Avatar
            <>
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                {getInitials(member.name)}
              </div>
              <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card ${colorOverride || getStatusColor(member.status)}`}></div>
            </>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium truncate">{member.name}</h4>
            {liveVideoFeedEnabled && hasCameraEnabled && (
              <span className="text-[10px] px-1.5 py-0.5 bg-red-500/10 text-red-600 rounded font-medium">LIVE</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">{member.role}</p>
        </div>

        {/* Quick actions - show on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Camera Toggle (show if video feed enabled) */}
          {liveVideoFeedEnabled && (
            <button
              onClick={toggleCamera}
              className={`p-1.5 rounded transition-colors ${
                hasCameraEnabled
                  ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
                  : 'hover:bg-background text-muted-foreground'
              }`}
              title={hasCameraEnabled ? 'Disable camera' : 'Enable camera'}
            >
              {hasCameraEnabled ? <Camera className="h-3.5 w-3.5" /> : <CameraOff className="h-3.5 w-3.5" />}
            </button>
          )}
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              showToast('info', 'Starting Call', `Calling ${member.name}...`);
            }}
            className="p-1.5 hover:bg-background rounded transition-colors"
            title="Call"
          >
            <Phone className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              showToast('info', 'Starting Video', `Starting video call with ${member.name}...`);
            }}
            className="p-1.5 hover:bg-background rounded transition-colors"
            title="Video"
          >
            <Video className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full bg-background">
      {/* Left Sidebar - Conversations */}
      <div className="w-80 border-r border-border flex flex-col bg-card">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Chats</h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() => showToast('info', 'Filter', 'Opening filter options...')}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title="Filter"
              >
                <Settings className="h-4 w-4" />
              </button>
              <button
                onClick={() => showToast('success', 'New Chat', 'Starting new conversation...')}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title="New chat"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-3">
            {[
              { key: 'direct' as const, label: 'Direct' },
              { key: 'group' as const, label: 'Groups' },
              { key: 'channel' as const, label: 'Channels' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  selectedTab === tab.key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background hover:bg-muted'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {/* Pinned */}
          {filteredConversations.pinned.length > 0 && (
            <div className="p-2">
              <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground">
                <Pin className="h-3 w-3" />
                <span>Pinned</span>
              </div>
              {filteredConversations.pinned.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => handleConversationClick(conv)}
                  className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-primary">
                      {conv.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium truncate">{conv.name}</h4>
                      <span className="text-xs text-muted-foreground">{conv.timestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                  {(conv.unreadCount || 0) > 0 && (
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Active */}
          {filteredConversations.active.length > 0 && (
            <div className="p-2">
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Active
              </div>
              {filteredConversations.active.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => handleConversationClick(conv)}
                  className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-primary">
                      {conv.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium truncate">{conv.name}</h4>
                      <span className="text-xs text-muted-foreground">{conv.timestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                  {(conv.unreadCount || 0) > 0 && (
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Muted */}
          {filteredConversations.muted.length > 0 && (
            <div className="p-2">
              <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground">
                <VolumeX className="h-3 w-3" />
                <span>Muted</span>
              </div>
              {filteredConversations.muted.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => handleConversationClick(conv)}
                  className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg cursor-pointer transition-colors opacity-60"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-primary">
                      {conv.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium truncate">{conv.name}</h4>
                      <span className="text-xs text-muted-foreground">{conv.timestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Team Presence */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Zoho-Style Status Header Bar */}
        <div className="px-6 py-3 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            {/* Left: User Profile with Dropdown */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-xs font-semibold text-primary-foreground">
                  RJ
                </div>
                <div className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card ${getStatusColor(currentUserStatus)}`}></div>
              </div>
              <button 
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => showToast('info', 'Profile', 'Opening profile menu...')}
              >
                <span>Ramses Javed</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Center: Status Selector + Quick Actions */}
            <div className="flex items-center gap-4">
              {/* Status Label + Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                <div className="relative">
                  <button
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-md transition-colors text-sm"
                  >
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(currentUserStatus)}`}></div>
                    <span className="capitalize">{currentUserStatus === 'online' ? 'Available' : currentUserStatus === 'away' ? 'Away' : currentUserStatus === 'busy' ? 'In Meeting' : 'Offline'}</span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>

                  {/* Status Dropdown */}
                  {showStatusDropdown && (
                    <div className="absolute top-full mt-1 left-0 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                      {[
                        { status: 'online' as const, label: 'Available' },
                        { status: 'away' as const, label: 'Away' },
                        { status: 'busy' as const, label: 'In Meeting' },
                        { status: 'offline' as const, label: 'Offline' },
                      ].map((item) => (
                        <button
                          key={item.status}
                          onClick={() => {
                            setCurrentUserStatus(item.status);
                            setShowStatusDropdown(false);
                            showToast('success', 'Status Updated', `Your status is now ${item.label}`);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted transition-colors text-sm first:rounded-t-lg last:rounded-b-lg"
                        >
                          <div className={`h-2 w-2 rounded-full ${getStatusColor(item.status)}`}></div>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="h-5 w-px bg-border"></div>

              {/* Quick Status Icons */}
              <div className="flex items-center gap-2">
                {/* Clock In/Out */}
                <button
                  onClick={() => {
                    setIsClockedIn(!isClockedIn);
                    showToast(
                      'success',
                      isClockedIn ? 'Clocked Out' : 'Clocked In',
                      isClockedIn ? 'You have clocked out' : 'You have clocked in for work'
                    );
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors text-xs font-medium ${
                    isClockedIn 
                      ? 'bg-green-500/10 text-green-600 border border-green-500/20' 
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground border border-transparent'
                  }`}
                  title={isClockedIn ? 'Click to Clock Out' : 'Click to Clock In'}
                >
                  <Clock className="h-4 w-4" />
                  <span>{isClockedIn ? 'Clock Out' : 'Clock In'}</span>
                </button>

                {/* Coffee Break (15 min) */}
                <button
                  onClick={() => {
                    setOnCoffeeBreak(!onCoffeeBreak);
                    if (!onCoffeeBreak) {
                      setOnLunchBreak(false);
                    }
                    showToast(
                      onCoffeeBreak ? 'success' : 'info',
                      onCoffeeBreak ? 'Back from Coffee Break' : 'Coffee Break Started',
                      onCoffeeBreak ? 'Welcome back!' : 'Enjoy your 15 minute break'
                    );
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors text-xs font-medium ${
                    onCoffeeBreak 
                      ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' 
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground border border-transparent'
                  }`}
                  title="Coffee Break (15 minutes)"
                >
                  <Coffee className="h-4 w-4" />
                  <span>Coffee</span>
                  <span className="text-[10px] opacity-75">15 min</span>
                </button>

                {/* Lunch Break (60 min) */}
                <button
                  onClick={() => {
                    setOnLunchBreak(!onLunchBreak);
                    if (!onLunchBreak) {
                      setOnCoffeeBreak(false);
                    }
                    showToast(
                      onLunchBreak ? 'success' : 'info',
                      onLunchBreak ? 'Back from Lunch' : 'Lunch Break Started',
                      onLunchBreak ? 'Welcome back!' : 'Enjoy your 60 minute break'
                    );
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors text-xs font-medium ${
                    onLunchBreak 
                      ? 'bg-orange-500/10 text-orange-600 border border-orange-500/20' 
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground border border-transparent'
                  }`}
                  title="Lunch Break (60 minutes)"
                >
                  <Utensils className="h-4 w-4" />
                  <span>Lunch</span>
                  <span className="text-[10px] opacity-75">60 min</span>
                </button>

                {/* Do Not Disturb */}
                <button
                  onClick={() => {
                    setDoNotDisturb(!doNotDisturb);
                    showToast(
                      doNotDisturb ? 'success' : 'info',
                      doNotDisturb ? 'DND Off' : 'DND On',
                      doNotDisturb ? 'Notifications enabled' : 'Do Not Disturb mode enabled'
                    );
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors text-xs font-medium ${
                    doNotDisturb 
                      ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground border border-transparent'
                  }`}
                  title="Do Not Disturb Mode"
                >
                  {doNotDisturb ? (
                    <>
                      <Moon className="h-4 w-4" />
                      <span>DND</span>
                    </>
                  ) : (
                    <>
                      <Bell className="h-4 w-4" />
                      <span>Notifications</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right: Meeting Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => showToast('info', 'Start Meeting', 'Starting video meeting...')}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                <Video className="h-4 w-4" />
                <span>Start Meeting</span>
              </button>

              <button
                onClick={() => showToast('info', 'Schedule Meeting', 'Opening meeting scheduler...')}
                className="flex items-center gap-2 px-4 py-2 border border-input bg-background hover:bg-muted rounded-md transition-colors text-sm font-medium"
              >
                <Calendar className="h-4 w-4" />
                <span>Schedule Meeting</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-3 border-b border-border bg-background">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-card border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* ADMIN CONTROLS - Add Member, Add Department */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => showToast('info', 'Add Member', 'Opening member invitation form...')}
                className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium whitespace-nowrap"
                title="Add Team Member"
              >
                <UserPlus className="h-4 w-4" />
                <span>Add Member</span>
              </button>

              <button
                onClick={() => showToast('info', 'Add Department', 'Opening department creation form...')}
                className="flex items-center gap-2 px-3 py-2 bg-card border border-input rounded-lg hover:bg-muted transition-colors text-sm font-medium whitespace-nowrap"
                title="Create Department"
              >
                <FolderPlus className="h-4 w-4" />
                <span>Add Department</span>
              </button>

              <button
                onClick={() => showToast('info', 'Team Settings', 'Opening team management settings...')}
                className="flex items-center gap-2 px-3 py-2 bg-card border border-input rounded-lg hover:bg-muted transition-colors text-sm font-medium"
                title="Team Settings"
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>

            {/* Live Video Feed Toggle */}
            <button
              onClick={() => {
                setLiveVideoFeedEnabled(!liveVideoFeedEnabled);
                showToast(
                  liveVideoFeedEnabled ? 'info' : 'success',
                  liveVideoFeedEnabled ? 'Video Feed Disabled' : 'Video Feed Enabled',
                  liveVideoFeedEnabled ? 'Camera feeds hidden' : 'Live camera monitoring active'
                );
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium whitespace-nowrap ${
                liveVideoFeedEnabled
                  ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                  : 'bg-card border border-input hover:bg-muted'
              }`}
              title="Toggle live video feed"
            >
              <span className="text-sm">Live video feed:</span>
              <Video className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Team Grid - 3 Columns */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Box 1: At Work (with different colors) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">At Work</h3>
                <span className="text-sm text-muted-foreground">{atWorkMembers.length}</span>
              </div>
              <div className="space-y-1 bg-card rounded-lg border border-border p-3">
                {atWorkMembers.map((member, index) => (
                  <TeamMemberCard 
                    key={member.id} 
                    member={member} 
                    colorOverride={getAtWorkColor(index)}
                  />
                ))}
                {atWorkMembers.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No members at work</p>
                )}
              </div>
            </div>

            {/* Box 2: By Department (NEW) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">By Department</h3>
                <span className="text-sm text-muted-foreground">{Object.keys(membersByDepartment).length} depts</span>
              </div>
              <div className="bg-card rounded-lg border border-border">
                <div className="divide-y divide-border max-h-[calc(100vh-280px)] overflow-y-auto">
                  {Object.entries(membersByDepartment)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([department, members]) => (
                      <div key={department}>
                        {/* Department Header */}
                        <div
                          onClick={() => toggleDepartment(department)}
                          className="w-full flex items-center justify-between p-3 hover:bg-muted transition-colors group cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            {expandedDepartments.has(department) ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                            <Building2 className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">{department}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{members.length}</span>
                            
                            {/* ADMIN CONTROLS - Edit/Delete Department */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  showToast('info', 'Edit Department', `Editing ${department}...`);
                                }}
                                className="p-1 hover:bg-primary/10 rounded transition-colors"
                                title="Edit Department"
                              >
                                <Edit className="h-3 w-3 text-muted-foreground hover:text-primary" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  showToast('warning', 'Delete Department', `Are you sure you want to delete ${department}?`);
                                }}
                                className="p-1 hover:bg-destructive/10 rounded transition-colors"
                                title="Delete Department"
                              >
                                <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Department Members */}
                        {expandedDepartments.has(department) && (
                          <div className="px-2 pb-2">
                            {members
                              .sort((a, b) => {
                                const statusOrder = { online: 0, away: 1, busy: 2, offline: 3 };
                                return statusOrder[a.status] - statusOrder[b.status];
                              })
                              .map(member => (
                                <TeamMemberCard key={member.id} member={member} />
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Box 3: In Meetings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <h3 className="text-sm font-semibold">In Meetings</h3>
                </div>
                <span className="text-sm text-muted-foreground">{inMeetingsMembers.length}</span>
              </div>
              <div className="space-y-1 bg-card rounded-lg border border-border p-3">
                {inMeetingsMembers.map(member => (
                  <TeamMemberCard key={member.id} member={member} />
                ))}
                {inMeetingsMembers.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No members in meetings</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}