import { useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { useTimeData } from '../../../services/hooks';
import {
  Clock, CheckCircle2, XCircle, AlertTriangle, ArrowRight,
} from 'lucide-react';
import type { TimeCorrection } from '../../../services/types';

const STATUS_MAP: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  Pending: 'warning', Approved: 'success', Rejected: 'danger',
};

export function TimeCorrections() {
  const { corrections, loading, approveCorrection, rejectCorrection } = useTimeData();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const pending = corrections.filter(c => c.status === 'Pending');
  const resolved = corrections.filter(c => c.status !== 'Pending');

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    await approveCorrection(id, 'Alex Rivera');
    setProcessingId(null);
  };

  const handleReject = async (id: string) => {
    const reason = window.prompt('Rejection reason:');
    if (!reason) return;
    setProcessingId(id);
    await rejectCorrection(id, 'Alex Rivera', reason);
    setProcessingId(null);
  };

  const renderCorrectionCard = (corr: TimeCorrection) => (
    <div key={corr.id} className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm text-primary">
            {corr.employeeName.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h4 className="font-medium">{corr.employeeName}</h4>
            <p className="text-sm text-muted-foreground">
              {new Date(corr.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
        <StatusBadge type={STATUS_MAP[corr.status] || 'neutral'}>{corr.status}</StatusBadge>
      </div>

      {/* Time change visualization */}
      <div className="rounded-lg bg-muted/30 p-4 mb-4">
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Original</p>
            <p className="text-sm">{corr.originalCheckIn} — {corr.originalCheckOut}</p>
          </div>
          <div className="flex justify-center">
            <ArrowRight className="h-5 w-5 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Corrected</p>
            <p className="text-sm font-medium text-primary">{corr.correctedCheckIn} — {corr.correctedCheckOut}</p>
          </div>
        </div>
      </div>

      {/* Reason */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-1">Reason</p>
        <p className="text-sm">{corr.reason}</p>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Submitted {new Date(corr.submittedAt).toLocaleDateString()}</span>
        {corr.reviewedBy && (
          <span>Reviewed by {corr.reviewedBy}</span>
        )}
      </div>

      {/* Actions for pending */}
      {corr.status === 'Pending' && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-border">
          <Button
            size="sm"
            onClick={() => handleApprove(corr.id)}
            disabled={processingId === corr.id}
          >
            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleReject(corr.id)}
            disabled={processingId === corr.id}
          >
            <XCircle className="mr-1.5 h-3.5 w-3.5" />
            Reject
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <PageLayout
      title="Time Corrections"
      description="Review and approve employee time correction requests"
      kpis={[
        { title: 'Pending', value: pending.length, change: 'Awaiting review', changeType: pending.length > 0 ? 'warning' : 'positive', icon: <AlertTriangle className="h-5 w-5" /> },
        { title: 'Approved', value: corrections.filter(c => c.status === 'Approved').length, change: 'Total approved', changeType: 'positive', icon: <CheckCircle2 className="h-5 w-5" /> },
        { title: 'Rejected', value: corrections.filter(c => c.status === 'Rejected').length, change: 'Total rejected', changeType: 'danger', icon: <XCircle className="h-5 w-5" /> },
        { title: 'Total Requests', value: corrections.length, change: 'All time', changeType: 'neutral', icon: <Clock className="h-5 w-5" /> },
      ]}
    >
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Pending Section */}
          {pending.length > 0 && (
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                Pending Review ({pending.length})
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pending.map(renderCorrectionCard)}
              </div>
            </div>
          )}

          {/* Resolved Section */}
          {resolved.length > 0 && (
            <div>
              <h3 className="font-medium mb-4 text-muted-foreground">
                Resolved ({resolved.length})
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {resolved.map(renderCorrectionCard)}
              </div>
            </div>
          )}

          {corrections.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="font-medium text-lg mb-2">No correction requests</h3>
              <p className="text-sm">All time records are accurate</p>
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
}
