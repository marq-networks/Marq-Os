import { useState, useMemo } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { useFinanceData } from '../../../services/hooks';
import {
  MonitorPlay, Search, Eye, Flag, CheckCircle2, X, Grid3X3, List, Clock,
} from 'lucide-react';
import type { ScreenshotRecord } from '../../../services/types';

const STATUS_MAP: Record<string, 'success' | 'warning' | 'danger' | 'neutral' | 'info'> = {
  Pending: 'warning', Reviewed: 'success', Flagged: 'danger',
};

const BLUR_COLOR: Record<string, string> = {
  None: 'text-green-600', Low: 'text-yellow-600', Medium: 'text-orange-600', High: 'text-red-600',
};

export function AnalyticsScreenshotReview() {
  const { screenshots, loading, reviewScreenshot, flagScreenshot } = useFinanceData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo(() => {
    return screenshots.filter(s => {
      const matchSearch = !search ||
        s.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        s.activity.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [screenshots, search, statusFilter]);

  const handleReview = async (id: string) => {
    await reviewScreenshot(id, 'Alex Rivera');
  };

  const handleFlag = async (id: string) => {
    const reason = window.prompt('Reason for flagging:');
    if (reason) await flagScreenshot(id, reason);
  };

  const pendingCount = screenshots.filter(s => s.status === 'Pending').length;
  const flaggedCount = screenshots.filter(s => s.status === 'Flagged').length;

  return (
    <PageLayout
      title="Screenshot Review"
      description="Review employee activity screenshots for compliance and quality assurance"
      kpis={[
        { title: 'Total Screenshots', value: screenshots.length, changeType: 'neutral', icon: <MonitorPlay className="h-5 w-5" /> },
        { title: 'Pending Review', value: pendingCount, change: pendingCount > 0 ? 'Needs attention' : 'All clear', changeType: pendingCount > 0 ? 'warning' : 'positive', icon: <Eye className="h-5 w-5" /> },
        { title: 'Flagged', value: flaggedCount, change: 'Requires action', changeType: flaggedCount > 0 ? 'danger' : 'positive', icon: <Flag className="h-5 w-5" /> },
        { title: 'Reviewed', value: screenshots.filter(s => s.status === 'Reviewed').length, changeType: 'positive', icon: <CheckCircle2 className="h-5 w-5" /> },
      ]}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search screenshots..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Flagged">Flagged</option>
        </select>
        {(search || statusFilter !== 'all') && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setStatusFilter('all'); }}>
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
        <div className="ml-auto flex border border-border rounded-md overflow-hidden">
          <button onClick={() => setView('grid')} className={`p-2 ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button onClick={() => setView('list')} className={`p-2 ${view === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />)}
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(ss => (
            <div key={ss.id} className="rounded-lg border border-border bg-card overflow-hidden">
              {/* Screenshot placeholder */}
              <div className="h-36 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative">
                <MonitorPlay className="h-10 w-10 text-muted-foreground/40" />
                <div className="absolute top-2 right-2">
                  <StatusBadge type={STATUS_MAP[ss.status] || 'neutral'}>{ss.status}</StatusBadge>
                </div>
                <div className="absolute bottom-2 left-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded">
                  {new Date(ss.timestamp).toLocaleTimeString()}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary">
                    {ss.employeeName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-sm font-medium">{ss.employeeName}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{ss.activity}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{ss.department}</span>
                  <span className={BLUR_COLOR[ss.blurLevel] || ''}>Blur: {ss.blurLevel}</span>
                </div>
                {ss.flagReason && (
                  <div className="mt-2 text-xs text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                    Flag: {ss.flagReason}
                  </div>
                )}
                {ss.status === 'Pending' && (
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handleReview(ss.id)}>
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleFlag(ss.id)}>
                      <Flag className="h-3 w-3 mr-1" /> Flag
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card divide-y divide-border">
          {filtered.map(ss => (
            <div key={ss.id} className="flex items-center gap-4 p-4 hover:bg-muted/30">
              <div className="h-12 w-16 rounded bg-muted flex items-center justify-center">
                <MonitorPlay className="h-5 w-5 text-muted-foreground/40" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{ss.employeeName}</span>
                  <StatusBadge type={STATUS_MAP[ss.status] || 'neutral'}>{ss.status}</StatusBadge>
                </div>
                <p className="text-xs text-muted-foreground">{ss.activity} • {ss.department}</p>
              </div>
              <div className="text-xs text-muted-foreground text-right">
                <div>{new Date(ss.timestamp).toLocaleString()}</div>
                <div className={BLUR_COLOR[ss.blurLevel]}>Blur: {ss.blurLevel}</div>
              </div>
              {ss.status === 'Pending' && (
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => handleReview(ss.id)}>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleFlag(ss.id)}>
                    <Flag className="h-3.5 w-3.5 text-red-500" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
