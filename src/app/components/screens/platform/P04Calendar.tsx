import { Calendar, Clock, Users, Video, MapPin, Plus, Building, ChevronLeft, ChevronRight, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Meeting {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  organizer: string;
  organization: string;
  attendees: number;
  type: 'internal' | 'cross-org' | 'platform';
  status: 'scheduled' | 'in-progress' | 'completed';
  videoLink?: string;
}

const STORAGE_KEY = 'workos_platform_meetings';

// Mock meeting data for platform admin
const INITIAL_MEETINGS: Meeting[] = [
  {
    id: '1',
    title: 'Platform Strategy Review',
    startTime: '09:00',
    endTime: '10:30',
    date: '2026-01-23',
    organizer: 'You',
    organization: 'Platform Team',
    attendees: 8,
    type: 'platform',
    status: 'scheduled',
    videoLink: 'https://meet.example.com/platform-strategy'
  },
  {
    id: '2',
    title: 'Multi-Org Integration Meeting',
    startTime: '14:00',
    endTime: '15:00',
    date: '2026-01-23',
    organizer: 'You',
    organization: 'Acme Corp, TechStart Inc',
    attendees: 12,
    type: 'cross-org',
    status: 'scheduled',
    videoLink: 'https://meet.example.com/multi-org'
  },
  {
    id: '3',
    title: 'Quarterly Business Review - Acme Corp',
    startTime: '11:00',
    endTime: '12:00',
    date: '2026-01-24',
    organizer: 'Platform Team',
    organization: 'Acme Corp',
    attendees: 6,
    type: 'internal',
    status: 'scheduled',
    videoLink: 'https://meet.example.com/acme-qbr'
  }
];

export function P04Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 23));
  const [meetings, setMeetings] = useState<Meeting[]>(INITIAL_MEETINGS);
  const [view, setView] = useState<'month' | 'week' | 'day'>('week');
  const [filterType, setFilterType] = useState<'all' | 'platform' | 'cross-org' | 'internal'>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '2026-01-23',
    startTime: '09:00',
    endTime: '10:00',
    organization: '',
    attendees: '5',
    type: 'platform' as Meeting['type'],
    videoLink: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Load meetings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setMeetings(parsed);
      }
    } catch (error) {
      console.error('Failed to load meetings:', error);
    }
  }, []);

  // Save meetings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
    } catch (error) {
      console.error('Failed to save meetings:', error);
    }
  }, [meetings]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'Meeting title is required';
    } else if (formData.title.trim().length < 5) {
      errors.title = 'Title must be at least 5 characters';
    }

    if (!formData.date) {
      errors.date = 'Meeting date is required';
    }

    if (!formData.startTime) {
      errors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      errors.endTime = 'End time is required';
    } else if (formData.endTime <= formData.startTime) {
      errors.endTime = 'End time must be after start time';
    }

    if (!formData.organization.trim()) {
      errors.organization = 'Organization is required';
    }

    const attendeeCount = parseInt(formData.attendees);
    if (isNaN(attendeeCount) || attendeeCount < 1) {
      errors.attendees = 'At least 1 attendee required';
    } else if (attendeeCount > 1000) {
      errors.attendees = 'Attendees cannot exceed 1000';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateMeeting = () => {
    if (!validateForm()) {
      toast.error('Please fix the form errors', {
        description: 'Check all required fields and correct any validation errors.',
        icon: <AlertCircle className="h-4 w-4" />,
      });
      return;
    }

    const newMeeting: Meeting = {
      id: `meeting-${Date.now()}`,
      title: formData.title,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      organizer: 'You',
      organization: formData.organization,
      attendees: parseInt(formData.attendees),
      type: formData.type,
      status: 'scheduled',
      videoLink: formData.videoLink || `https://meet.example.com/${Date.now()}`,
    };

    setMeetings([newMeeting, ...meetings]);

    toast.success('Platform meeting created successfully!', {
      description: `${formData.title} scheduled for ${formData.date} at ${formData.startTime}.`,
      icon: <CheckCircle className="h-4 w-4" />,
    });

    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setShowCreateDialog(false);
    setFormData({
      title: '',
      date: '2026-01-23',
      startTime: '09:00',
      endTime: '10:00',
      organization: '',
      attendees: '5',
      type: 'platform',
      videoLink: '',
    });
    setFormErrors({});
  };

  const filteredMeetings = filterType === 'all' 
    ? meetings 
    : meetings.filter(m => m.type === filterType);

  // Calculate statistics
  const platformMeetings = meetings.filter(m => m.type === 'platform').length;
  const crossOrgMeetings = meetings.filter(m => m.type === 'cross-org').length;
  const orgSpecificMeetings = meetings.filter(m => m.type === 'internal').length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'platform':
        return 'border-l-blue-500 bg-blue-50';
      case 'cross-org':
        return 'border-l-purple-500 bg-purple-50';
      default:
        return 'border-l-green-500 bg-green-50';
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'platform':
        return 'bg-blue-100 text-blue-700';
      case 'cross-org':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-green-100 text-green-700';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Platform Calendar</h1>
          <p className="text-sm text-gray-500 mt-1">Manage cross-organization and platform meetings</p>
        </div>
        <button 
          onClick={() => setShowCreateDialog(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="size-4" />
          <span>Create Platform Meeting</span>
        </button>
      </div>

      {/* Create Meeting Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleCloseDialog}>
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-6 m-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Create Platform Meeting</h2>
              <button 
                onClick={handleCloseDialog}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Meeting Title */}
              <div>
                <label className="block text-sm font-medium mb-2">Meeting Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Platform Strategy Review"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                />
                {formErrors.title && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.title}
                  </p>
                )}
              </div>

              {/* Meeting Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Meeting Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Meeting['type'] })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="platform">Platform Meeting</option>
                  <option value="cross-org">Cross-Organization Meeting</option>
                  <option value="internal">Organization Specific</option>
                </select>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                  />
                  {formErrors.date && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.date}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Start Time *</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                  />
                  {formErrors.startTime && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.startTime}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Time *</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                  />
                  {formErrors.endTime && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.endTime}
                    </p>
                  )}
                </div>
              </div>

              {/* Organization */}
              <div>
                <label className="block text-sm font-medium mb-2">Organization(s) *</label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="Acme Corp, TechStart Inc"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">For multiple organizations, separate with commas</p>
                {formErrors.organization && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.organization}
                  </p>
                )}
              </div>

              {/* Attendees */}
              <div>
                <label className="block text-sm font-medium mb-2">Number of Attendees *</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={formData.attendees}
                  onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                />
                {formErrors.attendees && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.attendees}
                  </p>
                )}
              </div>

              {/* Video Link */}
              <div>
                <label className="block text-sm font-medium mb-2">Video Conference Link (Optional)</label>
                <input
                  type="url"
                  value={formData.videoLink}
                  onChange={(e) => setFormData({ ...formData, videoLink: e.target.value })}
                  placeholder="https://meet.example.com/your-meeting"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate a meeting link</p>
              </div>
            </div>

            {/* Dialog Actions */}
            <div className="flex gap-3 mt-6 pt-6 border-t">
              <button
                onClick={handleCloseDialog}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateMeeting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Create Meeting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4 border-b px-6 py-3">
        <span className="text-sm font-medium text-gray-700">Filter by type:</span>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${filterType === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            All Meetings ({meetings.length})
          </button>
          <button
            onClick={() => setFilterType('platform')}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${filterType === 'platform' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
          >
            Platform ({platformMeetings})
          </button>
          <button
            onClick={() => setFilterType('cross-org')}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${filterType === 'cross-org' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
          >
            Cross-Organization ({crossOrgMeetings})
          </button>
          <button
            onClick={() => setFilterType('internal')}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${filterType === 'internal' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
          >
            Organization Specific ({orgSpecificMeetings})
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Calendar View */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold text-lg mb-4">Upcoming Meetings ({filteredMeetings.length})</h3>
              {filteredMeetings.length > 0 ? (
                <div className="space-y-3">
                  {filteredMeetings.map(meeting => (
                    <div 
                      key={meeting.id}
                      className={`p-4 rounded-lg border-l-4 ${getTypeColor(meeting.type)} transition-all hover:shadow-md`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{meeting.title}</h4>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${getTypeBadge(meeting.type)}`}>
                              {meeting.type === 'cross-org' ? 'Cross-Org' : meeting.type === 'platform' ? 'Platform' : 'Org Specific'}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="size-4" />
                              <span>{meeting.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="size-4" />
                              <span>{meeting.startTime} - {meeting.endTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="size-4" />
                              <span>{meeting.attendees} attendees</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Building className="size-4" />
                            <span>{meeting.organization}</span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Organized by: {meeting.organizer}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                            <Video className="size-4" />
                            Join
                          </button>
                          <button className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 transition-colors">
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No meetings found</p>
                  <p className="text-sm">Click "Create Platform Meeting" to schedule a new meeting</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold mb-4">Meeting Statistics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{platformMeetings}</div>
                    <div className="text-sm text-gray-600">Platform Meetings</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{crossOrgMeetings}</div>
                    <div className="text-sm text-gray-600">Cross-Org Meetings</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{orgSpecificMeetings}</div>
                    <div className="text-sm text-gray-600">Org-Specific Meetings</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold mb-4">Organizations Active This Week</h3>
              <div className="space-y-2">
                {['Acme Corp', 'TechStart Inc', 'Global Solutions', 'InnovateCo'].map((org, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded transition-colors">
                    <Building className="size-4 text-gray-400" />
                    <span className="text-sm">{org}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini Calendar */}
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold mb-4">January 2026</h3>
              <div className="grid grid-cols-7 gap-1 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} className="text-xs font-medium text-gray-500 py-1">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                  <button
                    key={day}
                    className={`text-sm py-1 rounded transition-colors ${ 
                      day === 23 
                        ? 'bg-blue-600 text-white' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
