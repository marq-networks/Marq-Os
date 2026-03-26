import { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/form';
import { 
  Search,
  Video,
  Clock,
  Coffee,
  Calendar,
  CheckCircle,
  ChevronDown,
  Circle,
  VideoOff
} from 'lucide-react';

export type UserStatus = 'online' | 'away' | 'busy' | 'offline' | 'in-meeting';
export type AvailabilityDuration = '15min' | '30min' | '60min' | 'today' | 'custom';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: UserStatus;
  statusMessage?: string;
  statusDuration?: string;
  isInMeeting?: boolean;
  meetingTitle?: string;
  meetingEndTime?: string;
}

interface Meeting {
  id: string;
  title: string;
  participants: string[];
  startTime: string;
  endTime: string;
  isOngoing: boolean;
}

interface TeamPresencePanelProps {
  currentUser: TeamMember;
  teamMembers: TeamMember[];
  meetings: Meeting[];
  onStatusChange?: (status: UserStatus, duration?: string) => void;
  onCheckIn?: () => void;
  onMeetNow?: () => void;
  onScheduleMeeting?: () => void;
  onViewMeetingHistory?: () => void;
}

export function TeamPresencePanel({
  currentUser,
  teamMembers,
  meetings,
  onStatusChange,
  onCheckIn,
  onMeetNow,
  onScheduleMeeting,
  onViewMeetingHistory
}: TeamPresencePanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>(currentUser.id);
  const [videoFeedEnabled, setVideoFeedEnabled] = useState(false);

  // Filter team members
  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Categorize members
  const atWork = filteredMembers.filter(m => m.status === 'online' && !m.isInMeeting);
  const away = filteredMembers.filter(m => m.status === 'away' || m.status === 'busy' || m.status === 'offline');
  const inMeetings = filteredMembers.filter(m => m.isInMeeting);

  // Ongoing meetings
  const ongoingMeetings = meetings.filter(m => m.isOngoing);

  // Get status color
  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'in-meeting': return 'bg-purple-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  // Get status icon
  const getStatusIcon = (status: UserStatus) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-3 w-3" />;
      case 'away': return <Clock className="h-3 w-3" />;
      case 'busy': return <Circle className="h-3 w-3" />;
      case 'in-meeting': return <Video className="h-3 w-3" />;
      default: return <Circle className="h-3 w-3" />;
    }
  };

  // Member Card Component
  const MemberCard = ({ member }: { member: TeamMember }) => (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
          {member.name.charAt(0)}
        </div>
        <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(member.status)} rounded-full border-2 border-card`}></div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{member.name}</div>
        <div className="text-xs text-muted-foreground truncate">{member.role}</div>
        {member.statusMessage && (
          <div className="text-xs text-muted-foreground truncate italic">{member.statusMessage}</div>
        )}
      </div>
    </div>
  );

  // Meeting Card Component
  const MeetingCard = ({ meeting }: { meeting: Meeting }) => (
    <div className="p-3 rounded-lg bg-muted/50 border border-border">
      <div className="flex items-start gap-2 mb-2">
        <Video className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{meeting.title}</div>
          <div className="text-xs text-muted-foreground">
            {meeting.participants.length} participants
          </div>
        </div>
      </div>
      <div className="text-xs text-muted-foreground">
        Ends at {new Date(meeting.endTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border space-y-3">
        {/* Top Controls */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={videoFeedEnabled ? "default" : "outline"}
              onClick={() => setVideoFeedEnabled(!videoFeedEnabled)}
              className="h-8"
            >
              {videoFeedEnabled ? <Video className="h-3.5 w-3.5" /> : <VideoOff className="h-3.5 w-3.5" />}
            </Button>
            <span className="text-xs text-muted-foreground">
              {videoFeedEnabled ? 'Live video feed' : 'Video off'}
            </span>
          </div>
          {onCheckIn && (
            <Button size="sm" variant="outline" onClick={onCheckIn} className="h-8 text-xs">
              Check in
            </Button>
          )}
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-muted text-xs">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(currentUser.status)}`}></div>
            <span className="font-medium">Status:</span>
            <span className="text-muted-foreground">{currentUser.status}</span>
          </div>
          {currentUser.statusDuration && (
            <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-muted/50 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{currentUser.statusDuration}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {onMeetNow && (
            <Button size="sm" onClick={onMeetNow} className="flex-1 h-8 text-xs">
              <Video className="h-3.5 w-3.5 mr-1.5" />
              Meet Now
            </Button>
          )}
          {onScheduleMeeting && (
            <Button size="sm" variant="outline" onClick={onScheduleMeeting} className="flex-1 h-8 text-xs">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              Schedule
            </Button>
          )}
        </div>
      </div>

      {/* User Selector */}
      <div className="p-4 border-b border-border">
        <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-semibold text-xs">
              {currentUser.name.charAt(0)}
            </div>
            <span className="text-sm font-medium">{currentUser.name}</span>
            <span className="text-xs text-muted-foreground">({teamMembers.length})</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for department members"
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      {/* Availability Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 gap-px bg-border">
          {/* At Work */}
          <div className="bg-card p-3">
            <div className="text-xs font-semibold text-muted-foreground mb-3">
              At Work <span className="text-foreground">({atWork.length})</span>
            </div>
            <div className="space-y-1">
              {atWork.length === 0 ? (
                <div className="text-center py-8 px-2">
                  <Coffee className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">
                    Currently, all of them are offline.
                  </p>
                </div>
              ) : (
                atWork.map(member => (
                  <MemberCard key={member.id} member={member} />
                ))
              )}
            </div>
          </div>

          {/* Away */}
          <div className="bg-card p-3">
            <div className="text-xs font-semibold text-muted-foreground mb-3">
              Away <span className="text-foreground">({away.length})</span>
            </div>
            <div className="space-y-1">
              {away.length === 0 ? (
                <div className="text-center py-8 px-2">
                  <CheckCircle className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">
                    Everyone is available.
                  </p>
                </div>
              ) : (
                away.map(member => (
                  <MemberCard key={member.id} member={member} />
                ))
              )}
            </div>
          </div>

          {/* Meetings */}
          <div className="bg-card p-3">
            <div className="text-xs font-semibold text-muted-foreground mb-3">
              Meetings <span className="text-foreground">({ongoingMeetings.length})</span>
            </div>
            <div className="space-y-2">
              {ongoingMeetings.length === 0 ? (
                <div className="text-center py-8 px-2">
                  <Calendar className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">
                    No ongoing or scheduled meetings.
                  </p>
                </div>
              ) : (
                ongoingMeetings.map(meeting => (
                  <MeetingCard key={meeting.id} meeting={meeting} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View Meeting History */}
      {onViewMeetingHistory && (
        <div className="p-3 border-t border-border bg-muted/30">
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewMeetingHistory}
            className="w-full h-9 text-xs font-medium"
          >
            View meeting history
          </Button>
        </div>
      )}
    </div>
  );
}
