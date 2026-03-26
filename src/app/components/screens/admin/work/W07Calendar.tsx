import { Calendar, Clock, Users, Video, MapPin, Plus, X, ChevronLeft, ChevronRight, Search, UserPlus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Attendee {
  id: string;
  name: string;
  email: string;
  type: 'internal' | 'external';
  role?: string;
}

interface Meeting {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  organizer: string;
  attendees: Attendee[];
  location?: string;
  type: 'internal' | 'external';
  videoLink?: string;
  description?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

// Mock attendee data
const mockInternalAttendees: Attendee[] = [
  { id: '1', name: 'John Doe', email: 'john@company.com', type: 'internal', role: 'Developer' },
  { id: '2', name: 'Sarah Chen', email: 'sarah@company.com', type: 'internal', role: 'Project Manager' },
  { id: '3', name: 'Mike Johnson', email: 'mike@company.com', type: 'internal', role: 'Designer' },
  { id: '4', name: 'Lisa Wang', email: 'lisa@company.com', type: 'internal', role: 'QA Engineer' },
];

// Mock meeting data
const initialMockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Sprint Planning',
    startTime: '09:00',
    endTime: '10:30',
    date: '2026-01-23',
    organizer: 'You',
    attendees: [
      { id: '1', name: 'John Doe', email: 'john@company.com', type: 'internal', role: 'Developer' },
      { id: '2', name: 'Sarah Chen', email: 'sarah@company.com', type: 'internal', role: 'Project Manager' },
    ],
    location: 'Conference Room A',
    type: 'internal',
    videoLink: 'https://meet.example.com/sprint-planning',
    description: 'Planning for the upcoming sprint',
    status: 'scheduled'
  },
  {
    id: '2',
    title: 'Client Meeting - Acme Corp',
    startTime: '14:00',
    endTime: '15:00',
    date: '2026-01-23',
    organizer: 'You',
    attendees: [
      { id: '2', name: 'Sarah Chen', email: 'sarah@company.com', type: 'internal', role: 'Project Manager' },
      { id: 'c1', name: 'John from Acme Corp', email: 'john@acmecorp.com', type: 'external' },
      { id: 'c2', name: 'Jane from Acme Corp', email: 'jane@acmecorp.com', type: 'external' },
    ],
    type: 'external',
    videoLink: 'https://meet.example.com/acme-client',
    description: 'Quarterly review with Acme Corp',
    status: 'scheduled'
  }
];

type ModalMode = 'create' | 'edit' | null;

export function W07Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 23));
  const [view, setView] = useState<'month' | 'week' | 'day'>('week');
  const [meetings, setMeetings] = useState<Meeting[]>(initialMockMeetings);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState<string | null>(null);
  
  // Create meeting form state
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    date: '2026-01-24',
    startTime: '10:00',
    endTime: '11:00',
    location: '',
    videoLink: '',
    description: '',
    attendees: [] as Attendee[],
  });
  
  const [searchAttendee, setSearchAttendee] = useState('');
  const [externalAttendee, setExternalAttendee] = useState({ name: '', email: '' });

  const handleCreateMeeting = () => {
    const meeting: Meeting = {
      id: String(Date.now()), // Use timestamp for unique ID
      ...meetingForm,
      organizer: 'You',
      type: meetingForm.attendees.some(a => a.type === 'external') ? 'external' : 'internal',
      status: 'scheduled',
    };
    setMeetings([...meetings, meeting]);
    closeModal();
  };

  const handleUpdateMeeting = () => {
    if (editingMeeting) {
      setMeetings(meetings.map(m => 
        m.id === editingMeeting.id 
          ? {
              ...m,
              ...meetingForm,
              type: meetingForm.attendees.some(a => a.type === 'external') ? 'external' : 'internal',
            }
          : m
      ));
      closeModal();
    }
  };

  const handleCancelMeeting = (meetingId: string) => {
    setMeetings(meetings.map(m => 
      m.id === meetingId ? { ...m, status: 'cancelled' as const } : m
    ));
    setShowCancelConfirm(null);
  };

  const handleStartMeeting = (videoLink: string) => {
    window.open(videoLink, '_blank');
  };

  const openCreateModal = () => {
    setModalMode('create');
    setMeetingForm({
      title: '',
      date: currentDate.toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '11:00',
      location: '',
      videoLink: '',
      description: '',
      attendees: [],
    });
  };

  const openEditModal = (meeting: Meeting) => {
    setModalMode('edit');
    setEditingMeeting(meeting);
    setMeetingForm({
      title: meeting.title,
      date: meeting.date,
      startTime: meeting.startTime,
      endTime: meeting.endTime,
      location: meeting.location || '',
      videoLink: meeting.videoLink || '',
      description: meeting.description || '',
      attendees: meeting.attendees,
    });
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingMeeting(null);
    setSearchAttendee('');
    setExternalAttendee({ name: '', email: '' });
  };

  const handleAddInternalAttendee = (attendee: Attendee) => {
    if (!meetingForm.attendees.find(a => a.id === attendee.id)) {
      setMeetingForm({
        ...meetingForm,
        attendees: [...meetingForm.attendees, attendee]
      });
    }
    setSearchAttendee('');
  };

  const handleAddExternalAttendee = () => {
    if (externalAttendee.name && externalAttendee.email) {
      const attendee: Attendee = {
        id: `ext-${Date.now()}`,
        ...externalAttendee,
        type: 'external'
      };
      setMeetingForm({
        ...meetingForm,
        attendees: [...meetingForm.attendees, attendee]
      });
      setExternalAttendee({ name: '', email: '' });
    }
  };

  const handleRemoveAttendee = (attendeeId: string) => {
    setMeetingForm({
      ...meetingForm,
      attendees: meetingForm.attendees.filter(a => a.id !== attendeeId)
    });
  };

  // Date navigation
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') newDate.setDate(newDate.getDate() - 1);
    else if (view === 'week') newDate.setDate(newDate.getDate() - 7);
    else newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') newDate.setDate(newDate.getDate() + 1);
    else if (view === 'week') newDate.setDate(newDate.getDate() + 7);
    else newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date(2026, 0, 23));
  };

  const getDateDisplay = () => {
    if (view === 'day') {
      return currentDate.toLocaleDateString('en-US', { 
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
      });
    } else if (view === 'week') {
      const weekStart = new Date(currentDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Get meetings for view
  const getMeetingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return meetings.filter(m => m.date === dateStr && m.status !== 'cancelled');
  };

  const getMeetingsForView = () => {
    if (view === 'day') {
      return getMeetingsForDate(currentDate);
    } else if (view === 'week') {
      const weekMeetings: Meeting[] = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - currentDate.getDay() + i);
        weekMeetings.push(...getMeetingsForDate(date));
      }
      return weekMeetings;
    } else {
      const monthMeetings: Meeting[] = [];
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        monthMeetings.push(...getMeetingsForDate(date));
      }
      return monthMeetings;
    }
  };

  // Render month calendar
  const renderMonthCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date(2026, 0, 23);
    const days = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-24 border p-2 bg-gray-50" />);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const dayMeetings = meetings.filter(m => m.date === dateStr && m.status !== 'cancelled');
      const isToday = date.toDateString() === today.toDateString();
      
      days.push(
        <div 
          key={day} 
          className={`min-h-24 border p-2 hover:bg-gray-50 ${isToday ? 'bg-blue-50' : 'bg-white'}`}
        >
          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayMeetings.slice(0, 2).map(meeting => (
              <button
                key={meeting.id}
                onClick={() => openEditModal(meeting)}
                className={`w-full text-left px-2 py-1 rounded text-xs ${
                  meeting.type === 'external' 
                    ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                <div className="font-medium truncate">{meeting.startTime} {meeting.title}</div>
              </button>
            ))}
            {dayMeetings.length > 2 && (
              <div className="text-xs text-gray-500 pl-2">+{dayMeetings.length - 2} more</div>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };

  // Render week view
  const renderWeekView = () => {
    const weekStart = new Date(currentDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const hours = Array.from({ length: 13 }, (_, i) => i + 8);
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      return date;
    });
    
    return (
      <div className="flex flex-col">
        <div className="grid grid-cols-8 border-b sticky top-0 bg-white z-10">
          <div className="p-2 border-r" />
          {days.map((day, i) => {
            const isToday = day.toDateString() === new Date(2026, 0, 23).toDateString();
            return (
              <div key={i} className={`p-2 border-r text-center ${isToday ? 'bg-blue-50' : ''}`}>
                <div className="text-xs text-gray-500">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className={`text-lg font-semibold ${isToday ? 'text-blue-600' : ''}`}>{day.getDate()}</div>
              </div>
            );
          })}
        </div>
        
        <div className="overflow-auto">
          {hours.map(hour => (
            <div key={hour} className="grid grid-cols-8 border-b" style={{ minHeight: '60px' }}>
              <div className="p-2 border-r text-xs text-gray-500 text-right">
                {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
              </div>
              {days.map((day, dayIndex) => {
                const dateStr = day.toISOString().split('T')[0];
                const dayMeetings = meetings.filter(m => {
                  if (m.date !== dateStr || m.status === 'cancelled') return false;
                  const meetingHour = parseInt(m.startTime.split(':')[0]);
                  return meetingHour === hour;
                });
                
                return (
                  <div key={dayIndex} className="border-r p-1 relative">
                    {dayMeetings.map(meeting => (
                      <button
                        key={meeting.id}
                        onClick={() => openEditModal(meeting)}
                        className={`w-full text-left px-2 py-1 rounded text-xs mb-1 ${
                          meeting.type === 'external' 
                            ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        <div className="font-medium">{meeting.startTime}</div>
                        <div className="truncate">{meeting.title}</div>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const viewMeetings = getMeetingsForView();
  const filteredInternalAttendees = mockInternalAttendees.filter(a => 
    a.name.toLowerCase().includes(searchAttendee.toLowerCase()) ||
    a.email.toLowerCase().includes(searchAttendee.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Calendar & Meetings</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage team meetings</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="size-4" />
          <span>Create Meeting</span>
        </button>
      </div>

      {/* View Controls */}
      <div className="flex items-center justify-between border-b px-6 py-3">
        <div className="flex items-center gap-2">
          <button onClick={goToPrevious} className="p-2 hover:bg-gray-100 rounded">
            <ChevronLeft className="size-5" />
          </button>
          <button onClick={goToNext} className="p-2 hover:bg-gray-100 rounded">
            <ChevronRight className="size-5" />
          </button>
          <button onClick={goToToday} className="ml-2 px-3 py-1.5 text-sm border rounded hover:bg-gray-50">
            Today
          </button>
          <span className="ml-4 font-medium">{getDateDisplay()}</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setView('day')}
            className={`px-3 py-1.5 text-sm rounded ${view === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            Day
          </button>
          <button 
            onClick={() => setView('week')}
            className={`px-3 py-1.5 text-sm rounded ${view === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            Week
          </button>
          <button 
            onClick={() => setView('month')}
            className={`px-3 py-1.5 text-sm rounded ${view === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {view === 'month' && (
          <div className="p-6">
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="grid grid-cols-7">
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                  <div key={day} className="border-b p-2 text-center font-medium text-sm text-gray-700 bg-gray-50">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {renderMonthCalendar()}
              </div>
            </div>
          </div>
        )}

        {view === 'week' && (
          <div className="h-full">
            <div className="bg-white border-t">
              {renderWeekView()}
            </div>
          </div>
        )}

        {view === 'day' && (
          <div className="p-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold text-lg mb-4">
                Schedule for {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h3>
              {viewMeetings.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="size-12 mx-auto mb-3 text-gray-300" />
                  <p>No meetings scheduled for this day</p>
                  <button 
                    onClick={openCreateModal}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Meeting
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {viewMeetings.map(meeting => (
                    <div 
                      key={meeting.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        meeting.type === 'external' 
                          ? 'border-l-purple-500 bg-purple-50' 
                          : 'border-l-blue-500 bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{meeting.title}</h4>
                            {meeting.type === 'external' && (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700">
                                External
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Clock className="size-4" />
                              <span>{meeting.startTime} - {meeting.endTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="size-4" />
                              <span>{meeting.attendees.length} attendees</span>
                            </div>
                            {meeting.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="size-4" />
                                <span>{meeting.location}</span>
                              </div>
                            )}
                          </div>
                          {meeting.description && (
                            <p className="text-sm text-gray-600">{meeting.description}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          {meeting.videoLink && (
                            <button 
                              onClick={() => handleStartMeeting(meeting.videoLink!)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                            >
                              <Video className="size-4" />
                              Start
                            </button>
                          )}
                          <button 
                            onClick={() => openEditModal(meeting)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded hover:bg-gray-50"
                          >
                            <Edit className="size-4" />
                            Edit
                          </button>
                          <button 
                            onClick={() => setShowCancelConfirm(meeting.id)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50"
                          >
                            <Trash2 className="size-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Meeting Modal */}
      {modalMode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {modalMode === 'create' ? 'Create New Meeting' : 'Edit Meeting'}
                </h2>
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded">
                  <X className="size-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Title *</label>
                <input
                  type="text"
                  value={meetingForm.title}
                  onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., Sprint Planning"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={meetingForm.date}
                    onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                  <input
                    type="time"
                    value={meetingForm.startTime}
                    onChange={(e) => setMeetingForm({ ...meetingForm, startTime: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                  <input
                    type="time"
                    value={meetingForm.endTime}
                    onChange={(e) => setMeetingForm({ ...meetingForm, endTime: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={meetingForm.location}
                    onChange={(e) => setMeetingForm({ ...meetingForm, location: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Conference Room A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Video Link</label>
                  <input
                    type="text"
                    value={meetingForm.videoLink}
                    onChange={(e) => setMeetingForm({ ...meetingForm, videoLink: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="https://meet.example.com/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={meetingForm.description}
                  onChange={(e) => setMeetingForm({ ...meetingForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                  placeholder="Meeting agenda and details..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Attendees (Optional)</label>

                <div className="mb-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchAttendee}
                      onChange={(e) => setSearchAttendee(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border rounded-lg"
                      placeholder="Search team members..."
                    />
                  </div>
                  {searchAttendee && filteredInternalAttendees.length > 0 && (
                    <div className="mt-2 border rounded-lg max-h-40 overflow-auto">
                      {filteredInternalAttendees.map(attendee => (
                        <button
                          key={attendee.id}
                          onClick={() => handleAddInternalAttendee(attendee)}
                          disabled={!!meetingForm.attendees.find(a => a.id === attendee.id)}
                          className="w-full px-3 py-2 hover:bg-gray-50 text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div>
                            <div className="font-medium text-sm">{attendee.name}</div>
                            <div className="text-xs text-gray-500">{attendee.email} • {attendee.role}</div>
                          </div>
                          {!meetingForm.attendees.find(a => a.id === attendee.id) ? (
                            <Plus className="size-4 text-gray-400" />
                          ) : (
                            <span className="text-xs text-green-600">Added</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border rounded-lg p-3 mb-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">Add External Attendee</div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={externalAttendee.name}
                      onChange={(e) => setExternalAttendee({ ...externalAttendee, name: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-sm"
                      placeholder="Name"
                    />
                    <input
                      type="email"
                      value={externalAttendee.email}
                      onChange={(e) => setExternalAttendee({ ...externalAttendee, email: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-sm"
                      placeholder="Email"
                    />
                  </div>
                  <button 
                    onClick={handleAddExternalAttendee}
                    disabled={!externalAttendee.name || !externalAttendee.email}
                    className="mt-2 flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <UserPlus className="size-4" />
                    Add External Attendee
                  </button>
                </div>

                {meetingForm.attendees.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Selected Attendees ({meetingForm.attendees.length})</div>
                    <div className="flex flex-wrap gap-2">
                      {meetingForm.attendees.map(attendee => (
                        <div 
                          key={attendee.id}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                            attendee.type === 'external'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          <span className="text-sm">{attendee.name}</span>
                          <button 
                            onClick={() => handleRemoveAttendee(attendee.id)}
                            className="hover:bg-black/10 rounded p-0.5"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {meetingForm.attendees.length === 0 && (
                  <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                    No attendees added yet. You can create the meeting and add attendees later.
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 border rounded-lg hover:bg-gray-100">
                Cancel
              </button>
              <button 
                onClick={modalMode === 'create' ? handleCreateMeeting : handleUpdateMeeting}
                disabled={!meetingForm.title}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {modalMode === 'create' ? 'Create Meeting' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-2">Cancel Meeting?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this meeting? All attendees will be notified.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowCancelConfirm(null)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Keep Meeting
              </button>
              <button 
                onClick={() => handleCancelMeeting(showCancelConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Yes, Cancel Meeting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}