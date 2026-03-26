import { useState } from 'react';
import { Button } from '../../ui/button';
import {
  Mail, Send, Inbox, Archive, Trash2, Star, Reply, ReplyAll,
  Forward, Plus, Search, RefreshCw, Filter, Paperclip,
  Tag, Clock, ChevronDown, Edit, X, CheckSquare, FolderKanban,
  MoreHorizontal, Link, Calendar, Flag, User, Zap, Settings, Check, AlertCircle
} from 'lucide-react';
import { useExecutionOS } from '../../../contexts/ExecutionOSContext';
import type { EmailThread } from './workTypes';

const MOCK_EMAILS: EmailThread[] = [
  {
    id: 'e1', from: 'Sarah Chen', fromEmail: 'sarah.chen@techcorp.com',
    subject: 'Re: Mobile App Redesign — Sprint 4 UX Review',
    preview: 'Great progress this sprint! I\'ve reviewed the authentication flow designs and have a few feedback points. The biometric auth looks clean but we need to consider the error state for when Face ID fails. Also, the onboarding screens are looking fantastic — please make sure the progress indicator is accessible for screen readers.',
    date: '2026-02-17T09:23:00', unread: true, starred: true,
    tags: ['Sprint Review', 'Design'], replies: 3,
    projectId: 'p1', projectName: 'Mobile App Redesign',
  },
  {
    id: 'e2', from: 'RetailCo PM', fromEmail: 'james.richardson@retailco.com',
    subject: '[URGENT] E-commerce Platform — Stripe Payment Failures in Staging',
    preview: 'We\'re experiencing critical issues with the Stripe integration in staging. Transactions above $500 are consistently failing with error code 402 (payment_intent_authentication_failure). This is completely blocking our UAT session scheduled for tomorrow. Can we get on a call in the next hour? Our finance team is watching this closely as the go-live date is in 2 weeks.',
    date: '2026-02-17T08:45:00', unread: true, starred: false,
    tags: ['Urgent', 'Bug', 'Client'], attachments: 2, replies: 1,
    projectId: 'p2', projectName: 'E-commerce Platform',
  },
  {
    id: 'e3', from: 'Michael Brown', fromEmail: 'michael.brown@internal.com',
    subject: 'Platform API v3 — GraphQL Schema v0.3 Ready for Review',
    preview: 'Attached is the proposed schema design for the GraphQL layer. I\'ve incorporated all the feedback from last week\'s architecture review. Key changes in v0.3: Added cursor-based pagination on all list resolvers, separated mutation inputs from query types, added @deprecated directives on v2 fields, and added field-level authorization directives. Sophie and I will walk through it in tomorrow\'s tech review. Please add comments in the Figma/Notion doc.',
    date: '2026-02-16T16:30:00', unread: false, starred: false,
    tags: ['API', 'Review'], attachments: 1, replies: 2,
    projectId: 'p4', projectName: 'Platform API v3',
  },
  {
    id: 'e4', from: 'StartupXYZ CEO', fromEmail: 'ceo@startupxyz.io',
    subject: 'Website Redesign — Brand Color System Approved ✅',
    preview: 'Love the new brand color system Emma presented during yesterday\'s call. The teal accent (#0D9488) works really well against the primary navy and the warm cream background is much more approachable than the old stark white. We\'re ready to proceed to the full wireframe stage. One request: can you also prepare a dark mode version of the palette? Our users have been asking for it. Please share the Figma link and revised timeline.',
    date: '2026-02-16T14:15:00', unread: false, starred: true,
    tags: ['Approval', 'Client'], replies: 1,
    projectId: 'p3', projectName: 'Website Redesign',
  },
  {
    id: 'e5', from: 'Chris Johnson', fromEmail: 'chris.j@internal.com',
    subject: 'Backend Infra — Kubernetes Cluster Phase 1 Complete 🚀',
    preview: 'Great news! Phase 1 of the Kubernetes migration is complete. All 8 legacy microservices are now running in the new GKE cluster. P99 latency improved by 23% and memory usage is down 31% thanks to proper resource limits. Grafana dashboards are up and showing green across all services. Phase 2 starts next week — migrating the database layer. I\'ll need Maria\'s help with the Postgres operator configuration.',
    date: '2026-02-15T11:00:00', unread: false, starred: false,
    tags: ['Infrastructure', 'Update'], replies: 4,
    projectId: 'p5', projectName: 'Backend Infrastructure',
  },
  {
    id: 'e6', from: 'TechCorp Inc — PM Team', fromEmail: 'pm@techcorp.com',
    subject: 'Weekly Status Report Required — Week 7 (Due Friday)',
    preview: 'Hi team, as per our contract agreement (Clause 8.2), please submit the weekly status report by Friday Feb 20 at 5pm EST. Required sections: (1) Tasks completed this week with hours logged, (2) Tasks planned for next week, (3) Blockers and risks with mitigation, (4) Budget burn rate vs plan. Please use the template in the shared Drive folder. Missing 2 weeks of reports will trigger a contract review clause.',
    date: '2026-02-14T09:00:00', unread: true, starred: false,
    tags: ['Report', 'Client', 'Action Required'],
    projectId: 'p1', projectName: 'Mobile App Redesign',
  },
  {
    id: 'e7', from: 'Emma Wilson', fromEmail: 'emma.wilson@internal.com',
    subject: 'Website Redesign — Component Library Ready for Dev Handoff 🎨',
    preview: 'The complete component library is now live in Figma and ready for developer handoff. 84 components across 12 categories — buttons, forms, navigation, cards, modals, tables, charts, notifications, typography, icons, layout, and utilities. Every component has: responsive variants, hover/focus/active states, accessibility annotations (ARIA labels, roles, contrast ratios), usage guidelines, and do\'s and don\'ts. The Storybook link is in the Figma file description.',
    date: '2026-02-14T15:45:00', unread: false, starred: false,
    tags: ['Design Handoff'], attachments: 1, replies: 3,
    projectId: 'p3', projectName: 'Website Redesign',
  },
  {
    id: 'e8', from: 'James Taylor', fromEmail: 'james.taylor@internal.com',
    subject: 'E-commerce Security Audit — Critical Findings Requiring Immediate Action',
    preview: 'The Phase 1 penetration test is complete. We found 3 critical vulnerabilities that must be patched before go-live: (1) SQL injection in the product search endpoint — a malicious query can dump the entire users table, (2) Payment webhook endpoint accepts events without signature verification allowing replay attacks, (3) Admin panel accessible without MFA. I\'ve linked the findings to tasks ECP-BUG-001 and ECP-BUG-012. Full report is attached.',
    date: '2026-02-16T17:15:00', unread: true, starred: true,
    tags: ['Security', 'Critical', 'Action Required'], attachments: 1, replies: 0,
    projectId: 'p2', projectName: 'E-commerce Platform',
  },
  {
    id: 'e9', from: 'Sophie Anderson', fromEmail: 'sophie.anderson@internal.com',
    subject: 'Platform API v3 — JWT Refresh Token Implementation Complete',
    preview: 'JWT refresh token implementation is done. I\'ve implemented: sliding window refresh with 30-day max lifetime, token rotation on every refresh (old token immediately blacklisted in Redis), family-level revocation for compromised refresh tokens, rate limiting on the refresh endpoint (5 req/min per IP), and audit logging for all auth events. One concern: the token blacklist Redis set will grow unbounded — we need a TTL strategy. Can we discuss in tomorrow\'s standup?',
    date: '2026-02-15T13:45:00', unread: false, starred: false,
    tags: ['Security', 'API', 'Update'], replies: 2,
    projectId: 'p4', projectName: 'Platform API v3',
  },
  {
    id: 'e10', from: 'David Kim', fromEmail: 'david.kim@internal.com',
    subject: 'E-commerce — Elasticsearch Product Search POC Results',
    preview: 'The Elasticsearch proof-of-concept is showing excellent results. On the product catalog (42,000 SKUs): full-text search latency p50=12ms, p99=45ms (vs 280ms with PostgreSQL ILIKE). Faceted filtering on price, category, brand and rating all working. Autocomplete suggestions with typo tolerance are a game-changer for UX. Downside: the ES cluster adds $380/month to infra costs. Do we have budget approval to proceed? Need to decide by Feb 20 to hit the sprint goal.',
    date: '2026-02-17T10:30:00', unread: true, starred: false,
    tags: ['Engineering', 'POC', 'Decision Required'], replies: 0,
    projectId: 'p2', projectName: 'E-commerce Platform',
  },
  {
    id: 'e11', from: 'Lisa Wang', fromEmail: 'lisa.wang@internal.com',
    subject: 'Stripe Webhook Fix — Root Cause Found & PR Ready',
    preview: 'Found the root cause of the duplicate webhook events causing double charges (ECP-BUG-012). The issue: our webhook handler wasn\'t implementing idempotency correctly — we were checking the Stripe event ID against our DB after processing, not before. The fix is a pre-processing idempotency check with a distributed lock (Redis SETNX with 30s TTL). PR #847 is up for review. Also added a webhook event replay endpoint for ops to use when needed. Can someone from the team review ASAP?',
    date: '2026-02-17T14:20:00', unread: true, starred: false,
    tags: ['Bug Fix', 'PR Review', 'Payments'], replies: 0,
    projectId: 'p2', projectName: 'E-commerce Platform',
  },
  {
    id: 'e12', from: 'Mike Johnson', fromEmail: 'mike.johnson@internal.com',
    subject: 'Mobile App — CI/CD Pipeline Complete, Awaiting Approval',
    preview: 'The GitHub Actions CI/CD pipeline for both iOS and Android is fully configured and tested. iOS: Xcode build → Fastlane → TestFlight (automated). Android: Gradle build → Fastlane → Play Store internal track. Both pipelines include: unit test gates (must pass 90%+), lint checks, Sentry source map upload, and Slack notifications. First automated build to TestFlight was successful. Task MAR-012 is submitted for approval — please review. Pipeline docs are in the repo wiki.',
    date: '2026-02-16T11:30:00', unread: false, starred: false,
    tags: ['CI/CD', 'Approval Request'], replies: 1, attachments: 0,
    projectId: 'p1', projectName: 'Mobile App Redesign',
  },
];

// ── IMAP Account Interface ────────────────────────────────
interface ImapAccount {
  id: string;
  email: string;
  displayName: string;
  imapServer: string;
  imapPort: number;
  username: string;
  password: string;
  useSsl: boolean;
  connected: boolean;
  lastSync?: string;
  error?: string;
}

// ── IMAP Settings Modal ───────────────────────────────────
function ImapSettingsModal({ onClose, accounts, onAddAccount, onRemoveAccount, onTestConnection }: {
  onClose: () => void;
  accounts: ImapAccount[];
  onAddAccount: (account: Omit<ImapAccount, 'id' | 'connected' | 'lastSync'>) => void;
  onRemoveAccount: (id: string) => void;
  onTestConnection: (id: string) => void;
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    displayName: '',
    imapServer: '',
    imapPort: 993,
    username: '',
    password: '',
    useSsl: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAccount(formData);
    setFormData({
      email: '',
      displayName: '',
      imapServer: '',
      imapPort: 993,
      username: '',
      password: '',
      useSsl: true,
    });
    setShowAddForm(false);
  };

  const commonProviders = [
    { name: 'Gmail', server: 'imap.gmail.com', port: 993 },
    { name: 'Outlook', server: 'outlook.office365.com', port: 993 },
    { name: 'Yahoo', server: 'imap.mail.yahoo.com', port: 993 },
    { name: 'iCloud', server: 'imap.mail.me.com', port: 993 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 bg-black/40" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-[680px] max-h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="font-semibold flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary" /> IMAP Email Accounts
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Connect your email accounts to manage them from within the system</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded"><X className="w-4 h-4" /></button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-5">
          {/* Connected Accounts List */}
          {accounts.length > 0 && (
            <div className="mb-5">
              <h3 className="text-sm font-semibold mb-3">Connected Accounts ({accounts.length})</h3>
              <div className="space-y-2">
                {accounts.map(account => (
                  <div key={account.id} className="border border-border rounded-xl p-4 bg-muted/20">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{account.displayName || account.email}</span>
                          {account.connected && (
                            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                              <Check className="w-3 h-3" /> Connected
                            </span>
                          )}
                          {account.error && (
                            <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                              <AlertCircle className="w-3 h-3" /> Error
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{account.email}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span>Server: {account.imapServer}:{account.imapPort}</span>
                          <span>•</span>
                          <span>{account.useSsl ? 'SSL/TLS Enabled' : 'No SSL'}</span>
                          {account.lastSync && (
                            <>
                              <span>•</span>
                              <span>Last sync: {new Date(account.lastSync).toLocaleTimeString()}</span>
                            </>
                          )}
                        </div>
                        {account.error && (
                          <p className="text-xs text-red-600 mt-2">{account.error}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 ml-4">
                        <button
                          onClick={() => onTestConnection(account.id)}
                          className="p-1.5 hover:bg-accent rounded text-muted-foreground"
                          title="Test connection"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onRemoveAccount(account.id)}
                          className="p-1.5 hover:bg-red-50 rounded text-muted-foreground"
                          title="Remove account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Account */}
          {!showAddForm ? (
            <div>
              {accounts.length === 0 && (
                <div className="text-center py-8 mb-4">
                  <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-1">No Email Accounts Connected</h3>
                  <p className="text-sm text-muted-foreground mb-4">Connect your IMAP email accounts to manage emails within the system</p>
                </div>
              )}
              <Button onClick={() => setShowAddForm(true)} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Add IMAP Account
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Add New IMAP Account</h3>
                <button type="button" onClick={() => setShowAddForm(false)} className="text-sm text-muted-foreground hover:text-foreground">
                  Cancel
                </button>
              </div>

              {/* Quick Setup - Common Providers */}
              <div>
                <label className="text-xs font-medium block mb-2">Quick Setup</label>
                <div className="grid grid-cols-4 gap-2">
                  {commonProviders.map(provider => (
                    <button
                      key={provider.name}
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        imapServer: provider.server,
                        imapPort: provider.port,
                        useSsl: true,
                      }))}
                      className="text-xs border border-border rounded-lg px-3 py-2 hover:bg-accent transition-colors"
                    >
                      {provider.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium block mb-1.5">Email Address *</label>
                  <input
                    required
                    type="email"
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1.5">Display Name</label>
                  <input
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.displayName}
                    onChange={e => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    placeholder="Work Email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-medium block mb-1.5">IMAP Server *</label>
                  <input
                    required
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.imapServer}
                    onChange={e => setFormData(prev => ({ ...prev, imapServer: e.target.value }))}
                    placeholder="imap.gmail.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1.5">Port *</label>
                  <input
                    required
                    type="number"
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.imapPort}
                    onChange={e => setFormData(prev => ({ ...prev, imapPort: parseInt(e.target.value) }))}
                    placeholder="993"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium block mb-1.5">Username *</label>
                  <input
                    required
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.username}
                    onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="username or email"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1.5">Password *</label>
                  <input
                    required
                    type="password"
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.password}
                    onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="useSsl"
                  checked={formData.useSsl}
                  onChange={e => setFormData(prev => ({ ...prev, useSsl: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="useSsl" className="text-sm cursor-pointer">Use SSL/TLS (Recommended)</label>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-xs text-blue-900 dark:text-blue-100">
                  <strong>Security Note:</strong> In production, credentials should be encrypted and stored securely on a backend server. This demo stores configuration in browser memory only.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1">
                  <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Account
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Compose Panel ─────────────────────────────────────────
function ComposePanel({ onClose }: { onClose: () => void }) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [linkProject, setLinkProject] = useState('');

  return (
    <div className="fixed bottom-6 right-6 w-[520px] bg-card border border-border rounded-2xl shadow-2xl z-50 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30 rounded-t-2xl">
        <span className="text-sm font-semibold">New Message</span>
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-accent rounded"><Edit className="w-3.5 h-3.5 text-muted-foreground" /></button>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded"><X className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <span className="text-xs text-muted-foreground w-8">To</span>
          <input
            className="flex-1 text-sm bg-transparent focus:outline-none"
            placeholder="Recipients..."
            value={to}
            onChange={e => setTo(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <span className="text-xs text-muted-foreground w-8">Re</span>
          <input
            className="flex-1 text-sm bg-transparent focus:outline-none"
            placeholder="Subject"
            value={subject}
            onChange={e => setSubject(e.target.value)}
          />
        </div>

        {/* Project link */}
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <Link className="w-3.5 h-3.5 text-muted-foreground" />
          <select
            className="flex-1 text-sm bg-transparent focus:outline-none text-muted-foreground"
            value={linkProject}
            onChange={e => setLinkProject(e.target.value)}
          >
            <option value="">Link to project (optional)</option>
            <option value="p1">Mobile App Redesign</option>
            <option value="p2">E-commerce Platform</option>
            <option value="p3">Website Redesign</option>
            <option value="p4">Platform API v3</option>
            <option value="p5">Backend Infrastructure</option>
          </select>
        </div>

        <textarea
          className="w-full h-36 text-sm bg-transparent resize-none focus:outline-none"
          placeholder="Write your message..."
          value={body}
          onChange={e => setBody(e.target.value)}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-accent rounded text-muted-foreground">
              <Paperclip className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-accent rounded text-muted-foreground">
              <Tag className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground">Discard</button>
            <Button size="sm">
              <Send className="w-3.5 h-3.5 mr-1.5" /> Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Convert to Task Modal ─────────────────────────────────
function ConvertToTaskModal({ email, onClose }: { email: EmailThread; onClose: () => void }) {
  const [title, setTitle] = useState(email.subject.replace(/^(Re:|Fwd:|FW:)\s*/i, '').trim().slice(0, 80));
  const [priority, setPriority] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [assignee, setAssignee] = useState('Sarah Chen');
  const [projectId, setProjectId] = useState(email.projectId || '');
  const [notes, setNotes] = useState(`From email: "${email.preview.slice(0, 150)}..."`);
  const [done, setDone] = useState(false);

  const TEAM = ['Sarah Chen', 'Mike Johnson', 'Emily Rodriguez', 'David Kim', 'Lisa Wang', 'James Taylor', 'Michael Brown', 'Sophie Anderson', 'Chris Johnson'];
  const PROJECTS = [
    { id: 'p1', name: 'Mobile App Redesign', code: 'MAR' },
    { id: 'p2', name: 'E-commerce Platform', code: 'ECP' },
    { id: 'p3', name: 'Website Redesign', code: 'WRD' },
    { id: 'p4', name: 'Platform API v3', code: 'PAV' },
    { id: 'p5', name: 'Backend Infrastructure', code: 'BIN' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/40" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-[520px] overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-semibold flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-primary" /> Convert Email to Task
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded"><X className="w-4 h-4" /></button>
        </div>

        {done ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckSquare className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Task Created!</h3>
            <p className="text-sm text-muted-foreground mb-1">
              <span className="font-medium">{title}</span> has been added to {PROJECTS.find(p => p.id === projectId)?.name || 'your tasks'}.
            </p>
            {dueDate && (
              <p className="text-xs text-muted-foreground">Due: {new Date(dueDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
            )}
            <div className="flex gap-2 justify-center mt-5">
              <Button onClick={onClose}>Done</Button>
              <Button variant="outline" onClick={() => setDone(false)}>Edit Task</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Source email pill */}
            <div className="flex items-center gap-2 px-3 py-2 bg-muted/40 rounded-xl text-xs text-muted-foreground">
              <Mail className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate flex-1">From: <span className="font-medium text-foreground">{email.from}</span> — {email.subject}</span>
            </div>

            {/* Task title */}
            <div>
              <label className="text-sm font-medium block mb-1.5">Task Title *</label>
              <input
                required
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Task title"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Priority */}
              <div>
                <label className="text-sm font-medium block mb-1.5">Priority</label>
                <select
                  className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background"
                  value={priority}
                  onChange={e => setPriority(e.target.value as any)}
                >
                  <option value="Critical">🔴 Critical</option>
                  <option value="High">🟠 High</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Low">🔵 Low</option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="text-sm font-medium block mb-1.5">Due Date</label>
                <input
                  type="date"
                  className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Assignee */}
              <div>
                <label className="text-sm font-medium block mb-1.5">Assignee</label>
                <select
                  className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background"
                  value={assignee}
                  onChange={e => setAssignee(e.target.value)}
                >
                  {TEAM.map(t => <option key={t} value={t}>{t.split(' ')[0]}</option>)}
                </select>
              </div>

              {/* Project */}
              <div>
                <label className="text-sm font-medium block mb-1.5">Project</label>
                <select
                  className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background"
                  value={projectId}
                  onChange={e => setProjectId(e.target.value)}
                >
                  <option value="">None</option>
                  {PROJECTS.map(p => <option key={p.id} value={p.id}>{p.code} — {p.name.split(' ').slice(0, 2).join(' ')}</option>)}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-medium block mb-1.5">Notes (pre-filled from email)</label>
              <textarea
                className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-1">
              <Button type="submit" className="flex-1">
                <CheckSquare className="w-3.5 h-3.5 mr-1.5" /> Create Task
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Email Detail Panel ────────────────────────────────────
function EmailDetail({ email, onClose, onConvertToTask }: { email: EmailThread; onClose: () => void; onConvertToTask: (email: EmailThread) => void }) {
  return (
    <div className="flex-1 flex flex-col border-l border-border bg-background">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold truncate">{email.subject}</h2>
          <div className="flex items-center gap-2 mt-0.5">
            {email.tags?.map(t => (
              <span key={t} className="text-xs bg-muted px-2 py-0.5 rounded-full">{t}</span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1 ml-4">
          <button className="p-2 hover:bg-accent rounded-lg" title="Reply"><Reply className="w-4 h-4 text-muted-foreground" /></button>
          <button className="p-2 hover:bg-accent rounded-lg" title="Reply All"><ReplyAll className="w-4 h-4 text-muted-foreground" /></button>
          <button className="p-2 hover:bg-accent rounded-lg" title="Forward"><Forward className="w-4 h-4 text-muted-foreground" /></button>
          <button className="p-2 hover:bg-accent rounded-lg"><Star className={`w-4 h-4 ${email.starred ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} /></button>
          <button className="p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-muted-foreground" /></button>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg ml-1"><X className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
            {email.from.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">{email.from}</span>
                <span className="text-sm text-muted-foreground ml-2">&lt;{email.fromEmail}&gt;</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(email.date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">To: me</p>
          </div>
        </div>
      </div>

      {/* Project link badge */}
      {email.projectName && (
        <div className="px-6 py-2 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2 text-xs">
            <FolderKanban className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Linked to:</span>
            <span className="text-primary font-medium">{email.projectName}</span>
            <button className="text-muted-foreground hover:text-primary ml-auto flex items-center gap-1.5 transition-colors" onClick={() => onConvertToTask(email)}>
              <CheckSquare className="w-3.5 h-3.5" /> Create Task from email
            </button>
          </div>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="max-w-2xl">
          <p className="text-sm leading-relaxed text-foreground">
            {email.preview}
          </p>
          <p className="text-sm leading-relaxed text-foreground mt-4">
            Please review and let me know your thoughts. We can discuss in more detail during tomorrow's standup or feel free to leave comments inline.
          </p>

          {/* Attachments */}
          {email.attachments && email.attachments > 0 && (
            <div className="mt-5 pt-4 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground mb-2">{email.attachments} Attachment{email.attachments > 1 ? 's' : ''}</p>
              <div className="flex gap-2">
                {Array.from({ length: email.attachments }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-muted/30 hover:bg-accent/50 cursor-pointer transition-colors">
                    <span className="text-lg">{i === 0 ? '📄' : '📊'}</span>
                    <div>
                      <p className="text-xs font-medium">{i === 0 ? 'attachment_1.pdf' : 'data_export.xlsx'}</p>
                      <p className="text-xs text-muted-foreground">{i === 0 ? '2.4 MB' : '156 KB'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Previous thread */}
          {email.replies && email.replies > 0 && (
            <div className="mt-5 pt-4 border-t border-border">
              <details>
                <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground select-none">
                  Show {email.replies} earlier message{email.replies > 1 ? 's' : ''} in thread
                </summary>
                <div className="mt-3 pl-4 border-l-2 border-border space-y-3">
                  {Array.from({ length: Math.min(email.replies, 2) }).map((_, i) => (
                    <div key={i} className="text-xs text-muted-foreground">
                      <p className="font-medium mb-0.5">
                        {i === 0 ? 'You' : email.from} — {new Date(new Date(email.date).getTime() - (i + 1) * 3600000 * 4).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </p>
                      <p className="leading-relaxed opacity-70">
                        {i === 0 ? 'Thanks for the update. Could you share more details on the timeline and any blockers?' : 'Sure, I\'ll send the full breakdown shortly. Let me know if you need anything else.'}
                      </p>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}

          <p className="text-sm text-foreground mt-5">
            Best regards,<br />
            <strong>{email.from}</strong>
          </p>
        </div>
      </div>

      {/* Reply box */}
      <div className="px-6 py-4 border-t border-border">
        <div className="border border-border rounded-xl p-3">
          <textarea
            className="w-full text-sm bg-transparent resize-none focus:outline-none text-muted-foreground"
            rows={2}
            placeholder="Click to reply..."
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-1">
              <button className="p-1 hover:bg-accent rounded text-muted-foreground"><Paperclip className="w-3.5 h-3.5" /></button>
            </div>
            <Button size="sm">
              <Send className="w-3 h-3 mr-1.5" /> Reply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
export function WorkEmailOS() {
  const { emails, updateEmail, deleteEmail } = useExecutionOS();
  const [selectedEmail, setSelectedEmail] = useState<EmailThread | null>(emails[0] || null);
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [search, setSearch] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [convertEmail, setConvertEmail] = useState<EmailThread | null>(null);
  const [showImapSettings, setShowImapSettings] = useState(false);
  const [imapAccounts, setImapAccounts] = useState<ImapAccount[]>([]);

  const unreadCount = emails.filter(e => e.unread).length;

  // IMAP Account Handlers
  const handleAddAccount = (accountData: Omit<ImapAccount, 'id' | 'connected' | 'lastSync'>) => {
    const newAccount: ImapAccount = {
      ...accountData,
      id: `imap_${Date.now()}`,
      connected: true,
      lastSync: new Date().toISOString(),
    };
    setImapAccounts(prev => [...prev, newAccount]);
  };

  const handleRemoveAccount = (id: string) => {
    setImapAccounts(prev => prev.filter(acc => acc.id !== id));
  };

  const handleTestConnection = (id: string) => {
    // Simulate connection test
    setImapAccounts(prev => prev.map(acc => {
      if (acc.id === id) {
        // Simulate random success/failure for demo
        const success = Math.random() > 0.3;
        return {
          ...acc,
          connected: success,
          lastSync: success ? new Date().toISOString() : acc.lastSync,
          error: success ? undefined : 'Connection failed. Please check your credentials and server settings.',
        };
      }
      return acc;
    }));
  };

  const FOLDERS = [
    { key: 'inbox',    label: 'Inbox',    icon: Inbox,   count: unreadCount },
    { key: 'starred',  label: 'Starred',  icon: Star,    count: emails.filter(e => e.starred).length },
    { key: 'sent',     label: 'Sent',     icon: Send,    count: 0 },
    { key: 'archive',  label: 'Archive',  icon: Archive, count: 0 },
    { key: 'trash',    label: 'Trash',    icon: Trash2,  count: 0 },
  ];

  const filteredEmails = emails.filter(e => {
    if (activeFolder === 'starred') return e.starred;
    const matchSearch = !search || e.subject.toLowerCase().includes(search.toLowerCase()) || e.from.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const markRead = (id: string) => {
    updateEmail(id, { unread: false });
  };

  return (
    <div className="flex h-full">
      {/* Left Sidebar */}
      <div className="w-48 flex-shrink-0 border-r border-border bg-card flex flex-col">
        <div className="p-4">
          <Button className="w-full" size="sm" onClick={() => setShowCompose(true)}>
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Compose
          </Button>
        </div>

        <nav className="px-2 space-y-0.5">
          {FOLDERS.map(folder => {
            const Icon = folder.icon;
            return (
              <button
                key={folder.key}
                onClick={() => setActiveFolder(folder.key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeFolder === folder.key
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">{folder.label}</span>
                {folder.count > 0 && (
                  <span className={`text-xs px-1.5 rounded-full ${activeFolder === folder.key ? 'bg-white/20' : 'bg-primary text-primary-foreground'}`}>
                    {folder.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* IMAP Settings Button */}
        <div className="px-4 py-3 border-t border-border">
          <button
            onClick={() => setShowImapSettings(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-left">IMAP Settings</span>
            {imapAccounts.length > 0 && (
              <span className="text-xs px-1.5 rounded-full bg-green-100 text-green-700">
                {imapAccounts.length}
              </span>
            )}
          </button>
        </div>

        {/* Projects quick filter */}
        <div className="px-4 py-3 border-t border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Projects</p>
          <div className="space-y-1">
            {['MAR', 'ECP', 'WRD', 'PAV', 'BIN'].map((code, i) => {
              const colors = ['#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#f59e0b'];
              return (
                <button key={code} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground w-full px-1 py-0.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i] }} />
                  {code}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Email List */}
      <div className={`flex flex-col border-r border-border ${selectedEmail ? 'w-80' : 'flex-1'}`}>
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-border rounded-lg bg-background focus:outline-none"
              placeholder="Search emails..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="p-1.5 hover:bg-accent rounded-lg text-muted-foreground">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 hover:bg-accent rounded-lg text-muted-foreground">
            <Filter className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="px-4 py-2 text-xs text-muted-foreground border-b border-border">
          {filteredEmails.length} messages {unreadCount > 0 && `· ${unreadCount} unread`}
        </div>

        {/* Email list */}
        <div className="flex-1 overflow-auto">
          {filteredEmails.map(email => (
            <div
              key={email.id}
              onClick={() => { setSelectedEmail(email); markRead(email.id); }}
              className={`px-4 py-3 border-b border-border cursor-pointer hover:bg-accent/40 transition-colors ${
                selectedEmail?.id === email.id ? 'bg-accent' : ''
              } ${email.unread ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''}`}
            >
              <div className="flex items-start gap-2">
                {email.unread && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />}
                {!email.unread && <div className="w-2 h-2 mt-1.5 flex-shrink-0" />}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-sm truncate ${email.unread ? 'font-semibold' : 'font-medium'}`}>
                      {email.from}
                    </span>
                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                      {new Date(email.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <p className={`text-sm truncate ${email.unread ? 'font-medium' : 'text-foreground'}`}>
                    {email.subject}
                  </p>

                  <p className="text-xs text-muted-foreground truncate mt-0.5">{email.preview}</p>

                  <div className="flex items-center gap-1.5 mt-1.5">
                    {email.starred && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
                    {email.attachments && <Paperclip className="w-3 h-3 text-muted-foreground" />}
                    {email.projectName && (
                      <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">
                        {email.projectName.split(' ')[0]}
                      </span>
                    )}
                    {email.tags?.slice(0, 1).map(t => (
                      <span key={t} className="text-xs bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Detail */}
      {selectedEmail && (
        <EmailDetail email={selectedEmail} onClose={() => setSelectedEmail(null)} onConvertToTask={setConvertEmail} />
      )}

      {showCompose && <ComposePanel onClose={() => setShowCompose(false)} />}
      {convertEmail && <ConvertToTaskModal email={convertEmail} onClose={() => setConvertEmail(null)} />}
      {showImapSettings && (
        <ImapSettingsModal
          onClose={() => setShowImapSettings(false)}
          accounts={imapAccounts}
          onAddAccount={handleAddAccount}
          onRemoveAccount={handleRemoveAccount}
          onTestConnection={handleTestConnection}
        />
      )}
    </div>
  );
}