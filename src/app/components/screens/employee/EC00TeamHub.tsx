import { useState } from 'react';
import { 
  Users, 
  Search, 
  Video, 
  Phone, 
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Bell,
  BellOff,
  Coffee,
  Moon,
  Calendar,
  Utensils,
  LogIn,
  LogOut,
  Camera,
  CameraOff
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

// Mock team members
const mockTeamMembers: TeamMember[] = [
  { id: 'tm-1', name: 'Sarah Johnson', role: 'Engineering Lead', status: 'online', department: 'Engineering' },
  { id: 'tm-2', name: 'Michael Chen', role: 'Senior Frontend Developer', status: 'online', department: 'Engineering' },
  { id: 'tm-3', name: 'Emily Martinez', role: 'UX Designer', status: 'away', department: 'Design' },
  { id: 'tm-4', name: 'David Kim', role: 'Backend Developer', status: 'offline', department: 'Engineering' },
  { id: 'tm-5', name: 'James Wilson', role: 'DevOps Engineer', status: 'offline', department: 'Engineering' },
  { id: 'tm-6', name: 'Lisa Anderson', role: 'Product Manager', status: 'online', department: 'Product' },
  { id: 'tm-7', name: 'Robert Taylor', role: 'QA Lead', status: 'busy', department: 'Engineering' },
  { id: 'tm-8', name: 'Maria Garcia', role: 'UI Designer', status: 'away', department: 'Design' },
  { id: 'tm-9', name: 'You', role: 'Senior Developer', status: 'online', department: 'Engineering' },
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
    timestamp: '1h ago'
  },
  {
    id: 'conv-4',
    type: 'direct',
    name: 'Michael Chen',
    lastMessage: 'Let me check that',
    timestamp: '30m ago',
    unreadCount: 1
  },
];

export function EC00TeamHub() {
  const { showToast } = useToast();
  const { openChat } = useChatDock();
  const { currentPath } = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [teamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [selectedTab, setSelectedTab] = useState<'direct' | 'group' | 'channel'>('direct');
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(
    new Set(['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'HR'])
  );
  const [currentUserStatus, setCurrentUserStatus] = useState<'online' | 'away' | 'busy' | 'offline'>('online');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [doNotDisturb, setDoNotDisturb] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [onCoffeeBreak, setOnCoffeeBreak] = useState(false);
  const [onLunchBreak, setOnLunchBreak] = useState(false);
  const [liveVideoFeedEnabled, setLiveVideoFeedEnabled] = useState(false);
  const [membersWithCamera, setMembersWithCamera] = useState<Set<string>>(new Set());

  const isOnConversationPage = currentPath === '/employee/communicate' || 
                                currentPath === '/employee/team-hub';

  // Filter team members by search
  const filteredTeamMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Group team members by status
  const atWorkMembers = filteredTeamMembers.filter(m => m.status === 'online' || m.status === 'away' || m.status === 'offline');
  const inMeetingsMembers = filteredTeamMembers.filter(m => m.status === 'busy');

  // Group by department
  const membersByDepartment = filteredTeamMembers.reduce((acc, member) => {
    if (!acc[member.department]) {
      acc[member.department] = [];
    }
    acc[member.department].push(member);
    return acc;
  }, {} as Record<string, TeamMember[]>);

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
          {/* Camera Toggle (show if video feed enabled) - EMPLOYEE CAN ONLY CONTROL THEIR OWN */}
          {liveVideoFeedEnabled && member.id === 'tm-9' && (
            <button
              onClick={toggleCamera}
              className={`p-1.5 rounded transition-colors ${
                hasCameraEnabled
                  ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
                  : 'hover:bg-background text-muted-foreground'
              }`}
              title={hasCameraEnabled ? 'Disable my camera' : 'Enable my camera'}
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

  const ConversationItem = ({ conv }: { conv: Conversation }) => {
    return (
      <div
        onClick={() => handleConversationClick(conv)}
        className="flex items-center gap-3 p-2.5 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer group"
      >
        <div className="relative flex-shrink-0">
          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
            {conv.type === 'channel' ? '#' : getInitials(conv.name)}
          </div>
          {conv.unreadCount && conv.unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-medium">
              {conv.unreadCount}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-medium truncate">{conv.name}</h4>
            {conv.isMuted && <VolumeX className="h-3 w-3 text-muted-foreground flex-shrink-0" />}
          </div>
          {conv.lastMessage && (
            <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
          )}
        </div>
        {conv.timestamp && (
          <span className="text-[10px] text-muted-foreground flex-shrink-0">{conv.timestamp}</span>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Zoho Cliq Style Status Header */}
      <div className="px-6 py-3 border-b border-border bg-card flex items-center justify-between">
        {/* Left: User Profile */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
              YO
            </div>
            <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card ${getStatusColor(currentUserStatus)}`}></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">You</h3>
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <StatusBadge status={currentUserStatus} size="sm" />
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Senior Developer</p>
          </div>
          
          {/* Status Dropdown */}
          {showStatusDropdown && (
            <div className="absolute top-16 left-6 z-50 bg-card border border-border rounded-lg shadow-lg p-2 min-w-[160px]">
              {(['online', 'away', 'busy', 'offline'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setCurrentUserStatus(status);
                    setShowStatusDropdown(false);
                    showToast('success', 'Status Updated', `You are now ${status}`);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted rounded transition-colors text-sm"
                >
                  <div className={`h-2 w-2 rounded-full ${getStatusColor(status)}`}></div>
                  <span className="capitalize">{status}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center: Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Clock In/Out */}
          <button
            onClick={() => {
              setIsClockedIn(!isClockedIn);
              showToast(
                isClockedIn ? 'info' : 'success',
                isClockedIn ? 'Clocked Out' : 'Clocked In',
                isClockedIn ? 'Work session ended' : 'Work session started'
              );
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium ${
              isClockedIn
                ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                : 'bg-card border border-input hover:bg-muted'
            }`}
            title={isClockedIn ? 'Clock Out' : 'Clock In'}
          >
            {isClockedIn ? <LogOut className="h-3.5 w-3.5" /> : <LogIn className="h-3.5 w-3.5" />}
            <span>{isClockedIn ? 'Clock Out' : 'Clock In'}</span>
          </button>

          {/* Coffee Break */}
          <button
            onClick={() => {
              setOnCoffeeBreak(!onCoffeeBreak);
              showToast(
                onCoffeeBreak ? 'info' : 'success',
                onCoffeeBreak ? 'Break Ended' : 'Coffee Break',
                onCoffeeBreak ? 'Back to work' : '15 minute break started'
              );
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium ${
              onCoffeeBreak
                ? 'bg-orange-500/10 text-orange-600 border border-orange-500/20'
                : 'bg-card border border-input hover:bg-muted'
            }`}
            title="Coffee Break (15 min)"
          >
            <Coffee className="h-3.5 w-3.5" />
            <span>Coffee Break</span>
          </button>

          {/* Lunch Break */}
          <button
            onClick={() => {
              setOnLunchBreak(!onLunchBreak);
              showToast(
                onLunchBreak ? 'info' : 'success',
                onLunchBreak ? 'Break Ended' : 'Lunch Break',
                onLunchBreak ? 'Back to work' : '60 minute break started'
              );
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium ${
              onLunchBreak
                ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                : 'bg-card border border-input hover:bg-muted'
            }`}
            title="Lunch Break (60 min)"
          >
            <Utensils className="h-3.5 w-3.5" />
            <span>Lunch Break</span>
          </button>

          {/* DND / Notifications Toggle */}
          <button
            onClick={() => {
              setDoNotDisturb(!doNotDisturb);
              setNotificationsEnabled(doNotDisturb); // Toggle opposite
              showToast(
                doNotDisturb ? 'success' : 'info',
                doNotDisturb ? 'Notifications On' : 'Do Not Disturb',
                doNotDisturb ? 'You will receive notifications' : 'Notifications muted'
              );
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium ${
              doNotDisturb
                ? 'bg-purple-500/10 text-purple-600 border border-purple-500/20'
                : 'bg-card border border-input hover:bg-muted'
            }`}
            title={doNotDisturb ? 'Enable Notifications' : 'Do Not Disturb'}
          >
            {doNotDisturb ? <Moon className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}
            <span>{doNotDisturb ? 'DND' : 'Notifications'}</span>
          </button>
        </div>

        {/* Right: Meeting Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast('info', 'Meeting', 'Starting instant meeting...')}
            className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Start Meeting
          </button>
          <button
            onClick={() => showToast('info', 'Schedule', 'Opening meeting scheduler...')}
            className="px-4 py-1.5 bg-card border border-input rounded-lg hover:bg-muted transition-colors text-sm font-medium"
          >
            Schedule Meeting
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
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

            {/* Live Video Feed Toggle - EMPLOYEE VIEW */}
            <button
              onClick={() => {
                setLiveVideoFeedEnabled(!liveVideoFeedEnabled);
                showToast(
                  liveVideoFeedEnabled ? 'info' : 'success',
                  liveVideoFeedEnabled ? 'Video Feed Disabled' : 'Video Feed Enabled',
                  liveVideoFeedEnabled ? 'Camera feed hidden' : 'Enable your camera to be visible'
                );
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium whitespace-nowrap ${
                liveVideoFeedEnabled
                  ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                  : 'bg-card border border-input hover:bg-muted'
              }`}
              title="Toggle my video feed"
            >
              <span className="text-sm">My video feed:</span>
              <Video className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Three Column Grid */}
        <div className="grid grid-cols-3 gap-4 p-6 h-full overflow-hidden">
          {/* Left Box: At Work */}
          <div className="flex flex-col bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                At Work
                <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {atWorkMembers.length}
                </span>
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {atWorkMembers.map((member, index) => (
                <TeamMemberCard 
                  key={member.id} 
                  member={member} 
                  colorOverride={getAtWorkColor(index)}
                />
              ))}
            </div>
          </div>

          {/* Middle Box: By Department */}
          <div className="flex flex-col bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                By Department
                <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {Object.keys(membersByDepartment).length}
                </span>
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {Object.entries(membersByDepartment).map(([dept, members]) => (
                <div key={dept} className="border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleDepartment(dept)}
                    className="w-full flex items-center justify-between p-3 bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <span className="font-medium text-sm">{dept}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-background px-2 py-0.5 rounded-full">
                        {members.length}
                      </span>
                      {expandedDepartments.has(dept) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  </button>
                  {expandedDepartments.has(dept) && (
                    <div className="bg-card p-2 space-y-1">
                      {members.map(member => (
                        <TeamMemberCard key={member.id} member={member} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Box: Conversations */}
          <div className="flex flex-col bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30">
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <MessageSquare className="h-4 w-4" />
                Conversations
              </h3>
              {/* Tabs */}
              <div className="flex gap-1 bg-muted rounded-lg p-1">
                {(['direct', 'group', 'channel'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      selectedTab === tab
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab === 'direct' ? 'Direct' : tab === 'group' ? 'Groups' : 'Channels'}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {/* Pinned */}
              {filteredConversations.pinned.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 mb-2">Pinned</h4>
                  <div className="space-y-1">
                    {filteredConversations.pinned.map(conv => (
                      <ConversationItem key={conv.id} conv={conv} />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Active */}
              {filteredConversations.active.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 mb-2">Active</h4>
                  <div className="space-y-1">
                    {filteredConversations.active.map(conv => (
                      <ConversationItem key={conv.id} conv={conv} />
                    ))}
                  </div>
                </div>
              )}

              {/* Muted */}
              {filteredConversations.muted.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 mb-2">Muted</h4>
                  <div className="space-y-1">
                    {filteredConversations.muted.map(conv => (
                      <ConversationItem key={conv.id} conv={conv} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
