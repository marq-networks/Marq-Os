import { useMemo } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { useTimeData } from '../../../services/hooks';
import {
  AlertTriangle, DollarSign, CheckCircle2, Scale, MessageSquare,
} from 'lucide-react';
import type { Fine } from '../../../services/types';

const STATUS_MAP: Record<string, 'success' | 'warning' | 'danger' | 'neutral' | 'info'> = {
  Active: 'danger', Paid: 'success', Waived: 'info', Disputed: 'warning',
};

const STATUS_ICON: Record<string, typeof AlertTriangle> = {
  Active: AlertTriangle, Paid: CheckCircle2, Waived: Scale, Disputed: MessageSquare,
};

export function TimeMyFines() {
  const { fines, loading } = useTimeData();

  // Filter to current user (e1 = Sarah Johnson)
  const myFines = useMemo(() => fines.filter(f => f.employeeId === 'e1'), [fines]);

  const activeFines = myFines.filter(f => f.status === 'Active');
  const totalOwed = activeFines.reduce((s, f) => s + f.amount, 0);
  const totalPaid = myFines.filter(f => f.status === 'Paid').reduce((s, f) => s + f.amount, 0);

  const handleDispute = (fineId: string) => {
    const reason = window.prompt('Why are you disputing this fine?');
    if (reason) {
      alert(`Dispute submitted for fine ${fineId}. An admin will review your request.`);
    }
  };

  return (
    <PageLayout
      title="My Fines"
      description="View your fines, payment history, and dispute status"
      kpis={[
        { title: 'Active Fines', value: activeFines.length, change: activeFines.length > 0 ? 'Outstanding' : 'None', changeType: activeFines.length > 0 ? 'danger' : 'positive', icon: <AlertTriangle className="h-5 w-5" /> },
        { title: 'Amount Owed', value: `$${totalOwed}`, change: 'Current balance', changeType: totalOwed > 0 ? 'danger' : 'positive', icon: <DollarSign className="h-5 w-5" /> },
        { title: 'Total Paid', value: `$${totalPaid}`, change: 'Lifetime', changeType: 'neutral', icon: <CheckCircle2 className="h-5 w-5" /> },
        { title: 'Disputed', value: myFines.filter(f => f.status === 'Disputed').length, change: 'Under review', changeType: 'warning', icon: <Scale className="h-5 w-5" /> },
      ]}
    >
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : myFines.length === 0 ? (
        <div className="text-center py-16">
          <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-500 opacity-50" />
          <h3 className="font-medium text-lg mb-2">No Fines</h3>
          <p className="text-muted-foreground">You have no fines on record. Keep up the good work!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myFines.map(fine => {
            const Icon = STATUS_ICON[fine.status] || AlertTriangle;
            return (
              <div
                key={fine.id}
                className={`rounded-lg border bg-card p-5 ${
                  fine.status === 'Active' ? 'border-red-200 dark:border-red-900/50' : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      fine.status === 'Active' ? 'bg-red-500/10 text-red-600' :
                      fine.status === 'Paid' ? 'bg-green-500/10 text-green-600' :
                      fine.status === 'Waived' ? 'bg-blue-500/10 text-blue-600' :
                      'bg-yellow-500/10 text-yellow-600'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">{fine.type}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(fine.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-medium">${fine.amount}</div>
                    <StatusBadge type={STATUS_MAP[fine.status] || 'neutral'}>{fine.status}</StatusBadge>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3">{fine.description}</p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Issued by {fine.issuedBy} on {new Date(fine.issuedAt).toLocaleDateString()}</span>
                  {fine.waivedBy && <span>Waived by {fine.waivedBy}: {fine.waivedReason}</span>}
                  {fine.paidAt && <span>Paid on {new Date(fine.paidAt).toLocaleDateString()}</span>}
                </div>

                {fine.status === 'Active' && (
                  <div className="flex gap-2 mt-4 pt-3 border-t border-border">
                    <Button size="sm">
                      <DollarSign className="mr-1.5 h-3.5 w-3.5" />
                      Pay Now
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDispute(fine.id)}>
                      <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                      Dispute
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}
