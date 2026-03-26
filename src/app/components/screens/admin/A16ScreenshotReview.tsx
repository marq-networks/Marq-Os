import { useState, useEffect } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { Camera, Eye, Flag, Filter, RefreshCw, Search, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { useFinanceData } from '../../../services';
import type { ScreenshotRecord } from '../../../services/types';
import { toast } from 'sonner';

const STATUS_CONFIG = {
  Pending:  { color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400', icon: Clock },
  Reviewed: { color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400', icon: CheckCircle },
  Flagged:  { color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400', icon: AlertTriangle },
};

const BLUR_COLORS = {
  None:   'text-green-600',
  Low:    'text-blue-600',
  Medium: 'text-yellow-600',
  High:   'text-red-600',
};

const ACTIVITY_PATTERNS = [
  'M 0,20 Q 25,5 50,20 Q 75,35 100,20',
  'M 0,15 Q 30,30 60,10 Q 80,5 100,25',
  'M 0,25 L 20,10 L 40,25 L 60,8 L 80,20 L 100,15',
  'M 0,20 C 20,5 40,35 60,15 C 80,0 95,25 100,20',
];

function ScreenshotThumbnail({ screenshot }: { screenshot: ScreenshotRecord }) {
  const pattern = ACTIVITY_PATTERNS[parseInt(screenshot.id.replace(/\D/g, '')) % ACTIVITY_PATTERNS.length];
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];
  const color = colors[parseInt(screenshot.id.replace(/\D/g, '')) % colors.length];

  return (
    <div className={`aspect-video relative rounded overflow-hidden bg-muted flex items-center justify-center ${
      screenshot.blurLevel !== 'None' ? 'blur-sm' : ''
    }`}>
      <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
        <rect width="100" height="40" fill="#1e1e2e" />
        <rect x="5" y="5" width="60" height="6" rx="1" fill="#313244" />
        <rect x="5" y="13" width="45" height="4" rx="1" fill="#45475a" />
        <rect x="5" y="19" width="55" height="4" rx="1" fill="#45475a" />
        <rect x="5" y="25" width="38" height="4" rx="1" fill="#313244" />
        <path d={pattern} fill="none" stroke={color} strokeWidth="2" opacity="0.7" />
      </svg>
      {screenshot.blurLevel !== 'None' && (
        <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center">
          <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">
            {screenshot.blurLevel} blur
          </span>
        </div>
      )}
    </div>
  );
}

export function A16ScreenshotReview() {
  const { screenshots, loading, reviewScreenshot, flagScreenshot, refresh } = useFinanceData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [flagReason, setFlagReason] = useState('');
  const [showFlagModal, setShowFlagModal] = useState<string | null>(null);

  const filtered = screenshots.filter(ss => {
    const matchSearch = !search ||
      ss.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      ss.activity.toLowerCase().includes(search.toLowerCase()) ||
      ss.department.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || ss.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pendingCount = screenshots.filter(s => s.status === 'Pending').length;
  const reviewedCount = screenshots.filter(s => s.status === 'Reviewed').length;
  const flaggedCount = screenshots.filter(s => s.status === 'Flagged').length;

  const handleReview = async (id: string) => {
    await reviewScreenshot(id, 'Alex Rivera');
    toast.success('Screenshot marked as reviewed');
  };

  const handleFlag = async () => {
    if (!showFlagModal || !flagReason.trim()) return;
    await flagScreenshot(showFlagModal, flagReason);
    toast.warning('Screenshot flagged for review');
    setShowFlagModal(null);
    setFlagReason('');
  };

  const formatTime = (ts: string) => {
    try {
      return new Date(ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return ts; }
  };

  return (
    <PageLayout
      title="ADMIN – A-16 – Screenshot Review"
      description="Review captured employee screenshots — wired to useFinanceData()"
      actions={
        <>
          <Button variant="outline" size="sm" onClick={refresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Bulk Review
          </Button>
        </>
      }
      kpis={[
        {
          title: 'Total Screenshots',
          value: String(screenshots.length),
          change: 'This session',
          changeType: 'neutral',
          icon: <Camera className="h-5 w-5" />,
        },
        {
          title: 'Pending Review',
          value: String(pendingCount),
          change: 'Awaiting review',
          changeType: pendingCount > 0 ? 'warning' : 'positive',
          icon: <Clock className="h-5 w-5" />,
        },
        {
          title: 'Reviewed',
          value: String(reviewedCount),
          change: `${screenshots.length > 0 ? Math.round((reviewedCount / screenshots.length) * 100) : 0}% complete`,
          changeType: 'positive',
          icon: <Eye className="h-5 w-5" />,
        },
        {
          title: 'Flagged',
          value: String(flaggedCount),
          change: flaggedCount > 0 ? 'Require attention' : 'All clear',
          changeType: flaggedCount > 0 ? 'warning' : 'positive',
          icon: <Flag className="h-5 w-5" />,
        },
      ]}
    >
      {/* Search & Filter */}
      <div className="mb-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by employee, activity, or department..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-1">
          {(['all', 'Pending', 'Reviewed', 'Flagged'] as const).map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                statusFilter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/70 text-muted-foreground'
              }`}
            >
              {f === 'all' ? `All (${screenshots.length})` : f}
            </button>
          ))}
        </div>
      </div>

      {/* Screenshot Grid */}
      {loading && screenshots.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          Loading screenshots…
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          No screenshots match your filters
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map(ss => {
            const statusCfg = STATUS_CONFIG[ss.status];
            const StatusIcon = statusCfg.icon;
            return (
              <div
                key={ss.id}
                className={`rounded-lg border bg-card overflow-hidden transition-all hover:shadow-md cursor-pointer ${
                  selectedId === ss.id ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                } ${ss.status === 'Flagged' ? 'border-red-300 dark:border-red-800' : ''}`}
                onClick={() => setSelectedId(selectedId === ss.id ? null : ss.id)}
              >
                <ScreenshotThumbnail screenshot={ss} />
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <p className="text-sm font-semibold truncate">{ss.employeeName}</p>
                      <p className="text-xs text-muted-foreground truncate">{ss.department}</p>
                    </div>
                    <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${statusCfg.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      {ss.status}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground truncate mb-1">{ss.activity}</p>
                  <p className="text-xs text-muted-foreground mb-2">{formatTime(ss.timestamp)}</p>

                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium ${BLUR_COLORS[ss.blurLevel]}`}>
                      Blur: {ss.blurLevel}
                    </span>
                    <div className="flex gap-1">
                      {ss.status === 'Pending' && (
                        <>
                          <button
                            onClick={e => { e.stopPropagation(); handleReview(ss.id); }}
                            className="text-xs px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); setShowFlagModal(ss.id); }}
                            className="text-xs px-2 py-1 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                          >
                            <Flag className="h-3 w-3" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {ss.status === 'Flagged' && ss.flagReason && (
                    <div className="mt-2 p-2 rounded bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                      <p className="text-xs text-red-700 dark:text-red-400">{ss.flagReason}</p>
                    </div>
                  )}

                  {ss.reviewedBy && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Reviewed by: {ss.reviewedBy}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Flag Modal */}
      {showFlagModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card rounded-xl border border-border shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="mb-4 flex items-center gap-2">
              <Flag className="h-4 w-4 text-red-500" />
              Flag Screenshot
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Provide a reason for flagging this screenshot. It will be escalated for further review.
            </p>
            <textarea
              value={flagReason}
              onChange={e => setFlagReason(e.target.value)}
              placeholder="E.g. Non-work content, inappropriate material..."
              className="w-full h-24 p-3 text-sm rounded-lg border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring mb-4"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => { setShowFlagModal(null); setFlagReason(''); }}>
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleFlag}
                disabled={!flagReason.trim()}
              >
                Flag Screenshot
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border">
        <p className="text-xs text-muted-foreground">
          <strong>Service Layer ✓</strong> — Screenshots sourced from <code className="font-mono">useFinanceData().screenshots</code> via Finance service.
          Review and Flag actions write back to the service layer (in-memory CRUD).
        </p>
      </div>
    </PageLayout>
  );
}
