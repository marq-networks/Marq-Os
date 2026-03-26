import { Mail, Plus, Check, X, Settings, Users, Globe, Key, RefreshCw, AlertCircle, CheckCircle, Search, Inbox, Send, Archive, Star, Trash2, Reply, Forward, Paperclip, Image, ArrowLeft, Edit3, Download } from 'lucide-react';
import { useState } from 'react';

interface Email {
  id: string;
  from: string;
  fromName: string;
  to: string;
  toName?: string;
  subject: string;
  body: string;
  preview: string;
  date: string;
  time: string;
  read: boolean;
  starred: boolean;
  folder: 'inbox' | 'sent' | 'archive' | 'trash';
  attachments?: Attachment[];
  hasAttachments?: boolean;
}

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

interface ComposeEmail {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
  attachments: Attachment[];
}

// Mock email data
const initialMockEmails: Email[] = [
  {
    id: '1',
    from: 'john.client@acmecorp.com',
    fromName: 'John Smith',
    to: 'you@company.com',
    toName: 'You',
    subject: 'Q1 Budget Review Meeting Follow-up',
    body: 'Hi,\n\nThank you for the productive meeting yesterday. I wanted to follow up on the budget allocation discussion.\n\nAs discussed, we need to finalize the Q1 budget by next Friday. Could you please send over the updated spreadsheet with the revised numbers?\n\nAlso, I noticed that the marketing budget line item needs clarification. Let\'s schedule a quick call to discuss this.\n\nBest regards,\nJohn Smith',
    preview: 'Thank you for the productive meeting yesterday. I wanted to follow up on the budget allocation discussion...',
    date: '2026-01-23',
    time: '09:30 AM',
    read: false,
    starred: true,
    folder: 'inbox',
    hasAttachments: false
  },
  {
    id: '2',
    from: 'sarah@company.com',
    fromName: 'Sarah Chen',
    to: 'you@company.com',
    toName: 'You',
    subject: 'Team Performance Report - January',
    body: 'Hi Team,\n\nAttached is the January performance report. Overall, we\'ve exceeded our targets by 15%.\n\nKey highlights:\n- Sales increased by 22%\n- Customer satisfaction score: 94%\n- On-time delivery: 98%\n\nGreat work everyone!\n\nSarah',
    preview: 'Attached is the January performance report. Overall, we\'ve exceeded our targets by 15%...',
    date: '2026-01-23',
    time: '08:15 AM',
    read: false,
    starred: false,
    folder: 'inbox',
    hasAttachments: true,
    attachments: [
      {
        id: 'att-1',
        name: 'January_Performance_Report.pdf',
        size: 245000,
        type: 'application/pdf'
      }
    ]
  },
  {
    id: '3',
    from: 'notifications@platform.com',
    fromName: 'Platform Notifications',
    to: 'you@company.com',
    toName: 'You',
    subject: 'Your invoice is ready',
    body: 'Your monthly invoice for January 2026 is now available.\n\nAmount: $2,450.00\nDue Date: February 1, 2026\n\nView and download your invoice from the billing portal.',
    preview: 'Your monthly invoice for January 2026 is now available. Amount: $2,450.00...',
    date: '2026-01-22',
    time: '06:00 PM',
    read: true,
    starred: false,
    folder: 'inbox',
    hasAttachments: false
  },
  {
    id: '4',
    from: 'you@company.com',
    fromName: 'You',
    to: 'client@example.com',
    toName: 'Client Name',
    subject: 'Re: Project Timeline Update',
    body: 'Hi,\n\nThank you for your inquiry about the project timeline.\n\nWe\'re on track to deliver Phase 1 by February 15th as planned. Phase 2 will commence immediately after and is expected to complete by March 30th.\n\nI\'ve attached the updated project plan with detailed milestones.\n\nPlease let me know if you have any questions.\n\nBest regards',
    preview: 'Thank you for your inquiry about the project timeline. We\'re on track to deliver Phase 1...',
    date: '2026-01-22',
    time: '02:30 PM',
    read: true,
    starred: false,
    folder: 'sent',
    hasAttachments: true,
    attachments: [
      {
        id: 'att-2',
        name: 'Project_Plan.pdf',
        size: 350000,
        type: 'application/pdf'
      }
    ]
  },
  {
    id: '5',
    from: 'you@company.com',
    fromName: 'You',
    to: 'team@company.com',
    toName: 'Team',
    subject: 'Weekly Team Sync - Agenda',
    body: 'Hi Team,\n\nAgenda for tomorrow\'s weekly sync:\n\n1. Project status updates\n2. Upcoming deadlines\n3. Resource allocation\n4. Q&A\n\nSee you all at 10 AM!\n\nBest',
    preview: 'Agenda for tomorrow\'s weekly sync: Project status updates, Upcoming deadlines...',
    date: '2026-01-21',
    time: '04:45 PM',
    read: true,
    starred: false,
    folder: 'sent',
    hasAttachments: false
  },
  {
    id: '6',
    from: 'hr@company.com',
    fromName: 'HR Department',
    to: 'you@company.com',
    toName: 'You',
    subject: 'Benefits Enrollment Reminder',
    body: 'This is a reminder that the benefits enrollment period ends on January 31st.\n\nPlease review and select your benefits in the employee portal.\n\nHR Team',
    preview: 'This is a reminder that the benefits enrollment period ends on January 31st...',
    date: '2026-01-20',
    time: '10:00 AM',
    read: true,
    starred: false,
    folder: 'archive',
    hasAttachments: false
  }
];

export function W08Email() {
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'archive' | 'trash'>('inbox');
  const [emails, setEmails] = useState<Email[]>(initialMockEmails);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [composeForm, setComposeForm] = useState<ComposeEmail>({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
    attachments: []
  });

  // Email actions
  const handleStarEmail = (emailId: string) => {
    setEmails(prevEmails => prevEmails.map(email => 
      email.id === emailId ? { ...email, starred: !email.starred } : email
    ));
    if (selectedEmail?.id === emailId) {
      setSelectedEmail(prev => prev ? { ...prev, starred: !prev.starred } : null);
    }
  };

  const handleMarkAsRead = (emailId: string, read: boolean) => {
    setEmails(prevEmails => prevEmails.map(email => 
      email.id === emailId ? { ...email, read } : email
    ));
    if (selectedEmail?.id === emailId) {
      setSelectedEmail(prev => prev ? { ...prev, read } : null);
    }
  };

  const handleArchiveEmail = (emailId: string) => {
    setEmails(prevEmails => prevEmails.map(email => 
      email.id === emailId ? { ...email, folder: 'archive' as const } : email
    ));
    setSelectedEmail(null);
    setActiveTab('archive');
  };

  const handleDeleteEmail = (emailId: string) => {
    setEmails(prevEmails => prevEmails.map(email => 
      email.id === emailId ? { ...email, folder: 'trash' as const } : email
    ));
    setSelectedEmail(null);
    setActiveTab('trash');
  };

  const handleRestoreEmail = (emailId: string) => {
    setEmails(prevEmails => prevEmails.map(email => 
      email.id === emailId ? { ...email, folder: 'inbox' as const } : email
    ));
    setActiveTab('inbox');
  };

  const handleSendEmail = () => {
    // Generate preview from body
    let emailPreview = '';
    if (composeForm.body.trim()) {
      emailPreview = composeForm.body.trim().substring(0, 100);
      if (composeForm.body.length > 100) {
        emailPreview += '...';
      }
    } else {
      emailPreview = '(No content)';
    }

    // Extract recipient name from email
    const recipientName = composeForm.to.includes('@') 
      ? composeForm.to.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      : composeForm.to;

    const now = new Date();
    const newEmail: Email = {
      id: `email-${now.getTime()}`,
      from: 'you@company.com',
      fromName: 'You',
      to: composeForm.to.trim(),
      toName: recipientName,
      subject: composeForm.subject.trim() || '(No subject)',
      body: composeForm.body.trim() || '',
      preview: emailPreview,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      read: true,
      starred: false,
      folder: 'sent', // IMPORTANT: Setting folder to 'sent'
      hasAttachments: composeForm.attachments.length > 0,
      attachments: composeForm.attachments.length > 0 ? [...composeForm.attachments] : undefined
    };
    
    console.log('Sending email:', newEmail); // Debug log
    
    // Add to emails list
    setEmails(prevEmails => [newEmail, ...prevEmails]);
    
    // Close compose and reset form
    setShowCompose(false);
    setComposeForm({
      to: '',
      cc: '',
      bcc: '',
      subject: '',
      body: '',
      attachments: []
    });
    
    // Switch to sent tab to show the sent email
    setTimeout(() => {
      setActiveTab('sent');
    }, 100);
  };

  // File attachment handlers
  const handleFileAttach = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: Attachment[] = Array.from(files).map(file => ({
      id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      url: URL.createObjectURL(file)
    }));

    setComposeForm(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }));

    // Reset input
    event.target.value = '';
  };

  const handleImageAttach = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: Attachment[] = Array.from(files).map(file => ({
      id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type || 'image/jpeg',
      url: URL.createObjectURL(file)
    }));

    setComposeForm(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }));

    // Reset input
    event.target.value = '';
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    setComposeForm(prev => ({
      ...prev,
      attachments: prev.attachments.filter(a => a.id !== attachmentId)
    }));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleReply = (email: Email) => {
    setComposeForm({
      to: email.from,
      cc: '',
      bcc: '',
      subject: email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`,
      body: `\n\n---\nOn ${email.date} at ${email.time}, ${email.fromName} wrote:\n${email.body}`,
      attachments: []
    });
    setShowCompose(true);
    setSelectedEmail(null);
  };

  const handleOpenCompose = () => {
    setComposeForm({
      to: '',
      cc: '',
      bcc: '',
      subject: '',
      body: '',
      attachments: []
    });
    setShowCompose(true);
    setSelectedEmail(null);
  };

  const handleCloseCompose = () => {
    setShowCompose(false);
    setComposeForm({
      to: '',
      cc: '',
      bcc: '',
      subject: '',
      body: '',
      attachments: []
    });
  };

  // Filter emails based on active tab
  const filteredEmails = emails.filter(email => {
    const matchesFolder = email.folder === activeTab;
    const matchesSearch = searchQuery === '' || 
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.fromName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (email.toName && email.toName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFolder && matchesSearch;
  });

  // Count emails in each folder
  const unreadCount = emails.filter(e => e.folder === 'inbox' && !e.read).length;
  const sentCount = emails.filter(e => e.folder === 'sent').length;
  const archiveCount = emails.filter(e => e.folder === 'archive').length;
  const trashCount = emails.filter(e => e.folder === 'trash').length;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Email</h1>
          <p className="text-sm text-gray-500 mt-1">Unified inbox for all your work emails</p>
        </div>
        <button 
          onClick={handleOpenCompose}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Edit3 className="size-4" />
          <span>Compose</span>
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r flex flex-col">
          <div className="p-4 space-y-1">
            <button
              onClick={() => {
                setActiveTab('inbox');
                setSelectedEmail(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg ${
                activeTab === 'inbox' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Inbox className="size-5" />
                <span className="font-medium">Inbox</span>
              </div>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('sent');
                setSelectedEmail(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg ${
                activeTab === 'sent' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Send className="size-5" />
                <span className="font-medium">Sent</span>
              </div>
              {sentCount > 0 && (
                <span className="text-xs text-gray-500">{sentCount}</span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('archive');
                setSelectedEmail(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg ${
                activeTab === 'archive' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Archive className="size-5" />
                <span className="font-medium">Archive</span>
              </div>
              {archiveCount > 0 && (
                <span className="text-xs text-gray-500">{archiveCount}</span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('trash');
                setSelectedEmail(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg ${
                activeTab === 'trash' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Trash2 className="size-5" />
                <span className="font-medium">Trash</span>
              </div>
              {trashCount > 0 && (
                <span className="text-xs text-gray-500">{trashCount}</span>
              )}
            </button>
          </div>

          {/* Debug Info */}
          <div className="mt-auto p-4 border-t bg-gray-50 text-xs text-gray-600">
            <div>Total: {emails.length} emails</div>
            <div>Sent: {sentCount} emails</div>
            <div>Current Tab: {activeTab}</div>
          </div>
        </div>

        {/* Email List */}
        {!selectedEmail && !showCompose && (
          <div className="flex-1 flex flex-col">
            {/* Search Bar */}
            <div className="border-b p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search emails..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Email List */}
            <div className="flex-1 overflow-auto">
              {filteredEmails.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Mail className="size-12 mb-3 text-gray-300" />
                  <p className="text-lg font-medium">No emails</p>
                  <p className="text-sm">
                    {activeTab === 'inbox' && 'Your inbox is empty'}
                    {activeTab === 'sent' && 'No sent emails'}
                    {activeTab === 'archive' && 'No archived emails'}
                    {activeTab === 'trash' && 'Trash is empty'}
                  </p>
                  {activeTab === 'sent' && (
                    <button
                      onClick={handleOpenCompose}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Send your first email
                    </button>
                  )}
                </div>
              ) : (
                <div className="divide-y">
                  {filteredEmails.map(email => (
                    <div
                      key={email.id}
                      onClick={() => {
                        setSelectedEmail(email);
                        if (!email.read && activeTab === 'inbox') {
                          handleMarkAsRead(email.id, true);
                        }
                      }}
                      className={`w-full px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !email.read ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStarEmail(email.id);
                          }}
                          className="mt-1"
                        >
                          <Star
                            className={`size-5 ${
                              email.starred
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 hover:text-yellow-400'
                            }`}
                          />
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`font-medium truncate ${!email.read ? 'text-gray-900' : 'text-gray-600'}`}>
                              {activeTab === 'sent' ? `To: ${email.toName || email.to}` : email.fromName}
                            </span>
                            <div className="flex items-center gap-2 ml-2">
                              {email.hasAttachments && (
                                <Paperclip className="size-4 text-gray-400" />
                              )}
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                {email.time}
                              </span>
                            </div>
                          </div>
                          <div className={`text-sm mb-1 truncate ${!email.read ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                            {email.subject}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {email.preview}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Email Detail View */}
        {selectedEmail && !showCompose && (
          <div className="flex-1 flex flex-col">
            {/* Email Header */}
            <div className="border-b p-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="size-5" />
                  <span>Back</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStarEmail(selectedEmail.id)}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <Star
                      className={`size-5 ${
                        selectedEmail.starred
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                  {activeTab !== 'trash' && (
                    <>
                      <button
                        onClick={() => handleArchiveEmail(selectedEmail.id)}
                        className="p-2 hover:bg-gray-100 rounded"
                        title="Archive"
                      >
                        <Archive className="size-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteEmail(selectedEmail.id)}
                        className="p-2 hover:bg-gray-100 rounded"
                        title="Delete"
                      >
                        <Trash2 className="size-5 text-gray-600" />
                      </button>
                    </>
                  )}
                  {activeTab === 'trash' && (
                    <button
                      onClick={() => handleRestoreEmail(selectedEmail.id)}
                      className="p-2 hover:bg-gray-100 rounded"
                      title="Restore"
                    >
                      <RefreshCw className="size-5 text-gray-600" />
                    </button>
                  )}
                </div>
              </div>

              <h2 className="text-2xl font-semibold mb-4">{selectedEmail.subject}</h2>

              <div className="flex items-start gap-3">
                <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                  {selectedEmail.fromName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{selectedEmail.fromName}</div>
                      <div className="text-sm text-gray-500">{selectedEmail.from}</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {selectedEmail.date} at {selectedEmail.time}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    To: {selectedEmail.toName || selectedEmail.to}
                  </div>
                </div>
              </div>
            </div>

            {/* Email Body */}
            <div className="flex-1 overflow-auto p-6">
              <div className="max-w-3xl mx-auto">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {selectedEmail.body || '(No content)'}
                </div>

                {selectedEmail.hasAttachments && selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <div className="text-sm font-medium text-gray-700 mb-3">
                      Attachments ({selectedEmail.attachments.length})
                    </div>
                    <div className="space-y-2">
                      {selectedEmail.attachments.map(attachment => (
                        <div key={attachment.id} className="flex items-center gap-3 px-4 py-3 border rounded-lg hover:bg-gray-50">
                          {attachment.type.startsWith('image/') ? (
                            <Image className="size-5 text-gray-400" />
                          ) : (
                            <Paperclip className="size-5 text-gray-400" />
                          )}
                          <div className="flex-1">
                            <div className="text-sm font-medium">{attachment.name}</div>
                            <div className="text-xs text-gray-500">{formatFileSize(attachment.size)}</div>
                          </div>
                          <button className="p-2 hover:bg-gray-100 rounded" title="Download">
                            <Download className="size-4 text-gray-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reply Actions */}
            {activeTab !== 'sent' && activeTab !== 'trash' && (
              <div className="border-t p-4 flex gap-3">
                <button
                  onClick={() => handleReply(selectedEmail)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Reply className="size-4" />
                  <span>Reply</span>
                </button>
                <button
                  onClick={() => {
                    setComposeForm({
                      to: '',
                      cc: '',
                      bcc: '',
                      subject: selectedEmail.subject.startsWith('Fwd:') ? selectedEmail.subject : `Fwd: ${selectedEmail.subject}`,
                      body: `\n\n---\nForwarded message:\nFrom: ${selectedEmail.fromName}\nDate: ${selectedEmail.date} at ${selectedEmail.time}\nSubject: ${selectedEmail.subject}\n\n${selectedEmail.body}`,
                      attachments: selectedEmail.attachments ? [...selectedEmail.attachments] : []
                    });
                    setShowCompose(true);
                    setSelectedEmail(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  <Forward className="size-4" />
                  <span>Forward</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Compose Email */}
        {showCompose && (
          <div className="flex-1 flex flex-col">
            {/* Compose Header */}
            <div className="border-b p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">New Message</h2>
              <button
                onClick={handleCloseCompose}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Compose Form */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-4 space-y-3 border-b">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700 w-16">To:</label>
                  <input
                    type="email"
                    value={composeForm.to}
                    onChange={(e) => setComposeForm({ ...composeForm, to: e.target.value })}
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="recipient@example.com"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700 w-16">Subject:</label>
                  <input
                    type="text"
                    value={composeForm.subject}
                    onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter subject"
                  />
                </div>
              </div>

              <div className="flex-1 p-4 flex flex-col overflow-hidden">
                <textarea
                  value={composeForm.body}
                  onChange={(e) => setComposeForm({ ...composeForm, body: e.target.value })}
                  className="w-full flex-1 px-3 py-2 border rounded-lg resize-none mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your message..."
                />
                
                {/* Attachments Display */}
                {composeForm.attachments.length > 0 && (
                  <div className="border rounded-lg p-3 max-h-40 overflow-auto">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Attachments ({composeForm.attachments.length})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {composeForm.attachments.map(attachment => (
                        <div
                          key={attachment.id}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-50 border rounded-lg group"
                        >
                          {attachment.type.startsWith('image/') ? (
                            <Image className="size-4 text-gray-400" />
                          ) : (
                            <Paperclip className="size-4 text-gray-400" />
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm font-medium truncate max-w-[200px]">
                              {attachment.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatFileSize(attachment.size)}
                            </span>
                          </div>
                          <button
                            onClick={() => handleRemoveAttachment(attachment.id)}
                            className="ml-2 p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="size-3 text-gray-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t p-4 flex items-center justify-between">
                <div className="flex gap-2">
                  <input
                    type="file"
                    id="file-attach"
                    multiple
                    onChange={handleFileAttach}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-attach"
                    className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                    title="Attach file"
                  >
                    <Paperclip className="size-5 text-gray-600" />
                  </label>
                  
                  <input
                    type="file"
                    id="image-attach"
                    multiple
                    accept="image/*"
                    onChange={handleImageAttach}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-attach"
                    className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                    title="Insert image"
                  >
                    <Image className="size-5 text-gray-600" />
                  </label>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCloseCompose}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleSendEmail}
                    disabled={!composeForm.to.trim() || !composeForm.subject.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="size-4" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
