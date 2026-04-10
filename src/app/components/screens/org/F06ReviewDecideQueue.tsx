import { PageLayout } from '../../shared/PageLayout';
import { DataTable } from '../../shared/DataTable';
import { StatusBadge } from '../../shared/StatusBadge';
import { Breadcrumb } from '../../shared/Breadcrumb';
import { FinanceTopTabs } from '../../../finance/components/FinanceTopTabs';
import { Button } from '../../ui/button';
import { FormDrawer } from '../../shared/FormDrawer';
import { FormField, Select } from '../../ui/form';
import { useToast } from '../../ui/toast';
import {
  AlertCircle,
  CheckCircle,
  Brain,
  TrendingUp
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useFinanceData, type FinanceInboxItem } from '../../../services';

type ReviewItem = FinanceInboxItem & {
  suggestedAction: string;
  similarTransactions: number;
  confidenceScore: number;
};

export function F06ReviewDecideQueue() {
  const { showToast } = useToast();
  const { financeInbox, transactions, markInboxItemRead, actionInboxItem, loading } = useFinanceData();
  const [selectedItem, setSelectedItem] = useState<ReviewItem | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [reviewForm, setReviewForm] = useState({
    decision: 'action' as 'action' | 'read',
    applyToSimilar: false,
  });

  const queue = useMemo<ReviewItem[]>(() => {
    return financeInbox
      .filter((item) => item.status !== 'actioned')
      .map((item) => ({
        ...item,
        suggestedAction: item.type === 'payment_due' || item.type === 'approval_request' ? 'Take action' : 'Mark as reviewed',
        similarTransactions: transactions.filter((transaction) => transaction.departmentName === item.submittedBy).length,
        confidenceScore: item.priority === 'urgent' ? 95 : item.priority === 'high' ? 82 : item.priority === 'medium' ? 68 : 55,
      }));
  }, [financeInbox, transactions]);

  const handleReview = (item: ReviewItem) => {
    setSelectedItem(item);
    setReviewForm({
      decision: item.priority === 'low' ? 'read' : 'action',
      applyToSimilar: false,
    });
    setIsReviewOpen(true);
  };

  const handleApprove = async (item: ReviewItem) => {
    try {
      await actionInboxItem(item.id);
      showToast('success', 'Item Actioned', `${item.title} has been actioned`);
    } catch {
      showToast('error', 'Action Failed', 'Unable to action this queue item');
    }
  };

  const handleBulkApprove = async () => {
    if (selectedItems.length === 0) {
      showToast('warning', 'No Selection', 'Please select queue items to process');
      return;
    }

    const itemsToApprove = queue.filter((item) => selectedItems.includes(item.id));
    if (itemsToApprove.length === 0) {
      showToast('error', 'Cannot Process', 'Selected items are no longer available');
      return;
    }

    try {
      await Promise.all(itemsToApprove.map((item) => actionInboxItem(item.id)));
      setSelectedItems([]);
      showToast('success', 'Bulk Actioned', `${itemsToApprove.length} items were actioned`);
    } catch {
      showToast('error', 'Bulk Action Failed', 'Unable to process selected items');
    }
  };

  const handleSkip = async (itemId: string) => {
    try {
      await markInboxItemRead(itemId);
      showToast('info', 'Marked Read', 'Queue item moved out of active review');
    } catch {
      showToast('error', 'Update Failed', 'Unable to update this queue item');
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedItem) return;
    setIsSubmitting(true);
    try {
      if (reviewForm.decision === 'action') {
        await actionInboxItem(selectedItem.id);
      } else {
        await markInboxItemRead(selectedItem.id);
      }

      showToast(
        'success',
        reviewForm.decision === 'action' ? 'Decision Applied' : 'Marked Read',
        reviewForm.applyToSimilar
          ? `Decision saved with ${selectedItem.similarTransactions} similar references noted`
          : 'Queue item updated successfully',
      );
      setIsReviewOpen(false);
      setSelectedItem(null);
    } catch {
      showToast('error', 'Submission Failed', 'Unable to update this queue item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'submittedAt',
      header: 'Date',
      cell: (_value: unknown, item: ReviewItem) => (
        <span className="text-sm">{new Date(item.submittedAt).toLocaleDateString()}</span>
      )
    },
    {
      key: 'title',
      header: 'Queue Item',
      cell: (_value: unknown, item: ReviewItem) => (
        <div>
          <p className="font-medium">{item.title}</p>
          <p className="text-xs text-muted-foreground">{item.description}</p>
        </div>
      )
    },
    {
      key: 'amount',
      header: 'Amount',
      cell: (_value: unknown, item: ReviewItem) => (
        <span className="font-semibold">{item.amount !== undefined ? `$${item.amount.toLocaleString()}` : '—'}</span>
      )
    },
    {
      key: 'suggestedAction',
      header: 'Suggested Action',
      cell: (_value: unknown, item: ReviewItem) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm">{item.suggestedAction}</span>
            <StatusBadge type={item.confidenceScore >= 80 ? 'success' : item.confidenceScore >= 60 ? 'warning' : 'neutral'}>
              {item.confidenceScore}%
            </StatusBadge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{item.type.replace(/_/g, ' ')}</p>
        </div>
      )
    },
    {
      key: 'similarTransactions',
      header: 'Related',
      cell: (_value: unknown, item: ReviewItem) => (
        item.similarTransactions > 0 ? (
          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
            <Brain className="h-3 w-3" />
            <span className="text-sm">{item.similarTransactions}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        )
      )
    },
    {
      key: 'id',
      header: 'Actions',
      cell: (_value: unknown, item: ReviewItem) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => handleApprove(item)}>
            <CheckCircle className="h-3 w-3 mr-1" />
            Action
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleReview(item)}>
            Review
          </Button>
        </div>
      )
    },
  ];

  return (
    <>
      <PageLayout
        title="ORG – F-06 – Review & Decide Queue"
        description="Finance inbox items that still need a human decision"
        kpis={[
          {
            title: 'Pending Review',
            value: loading ? '...' : queue.length.toString(),
            change: 'Needs attention',
            changeType: queue.length > 0 ? 'warning' : 'positive',
            icon: <AlertCircle className="h-5 w-5" />
          },
          {
            title: 'High Confidence',
            value: loading ? '...' : queue.filter((item) => item.confidenceScore >= 60).length.toString(),
            change: 'Quick action available',
            icon: <CheckCircle className="h-5 w-5" />
          },
          {
            title: 'Related Signals',
            value: loading ? '...' : queue.filter((item) => item.similarTransactions > 0).length.toString(),
            change: 'Cross-check context',
            icon: <Brain className="h-5 w-5" />
          },
          {
            title: 'Auto-Resolution Rate',
            value: loading ? '...' : `${Math.round(((financeInbox.filter((item) => item.status === 'actioned').length) / Math.max(1, financeInbox.length)) * 100)}%`,
            change: 'Based on inbox actions',
            changeType: 'positive',
            icon: <TrendingUp className="h-5 w-5" />
          },
        ]}
        actions={
          <Button onClick={handleBulkApprove} disabled={selectedItems.length === 0}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Action Selected
          </Button>
        }
      >
        <Breadcrumb items={[
          { label: 'Finance', path: '/org/finance/cockpit' },
          { label: 'Review & Decide' }
        ]} />
        <FinanceTopTabs />
        {queue.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
            <p className="text-muted-foreground">No finance inbox items currently need review.</p>
          </div>
        ) : (
          <>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-sm">
                Review decisions are now driven by live finance inbox data instead of local mock review queues.
              </p>
            </div>

            <DataTable
              columns={columns}
              data={queue}
              selectable
              selectedRows={selectedItems}
              onRowSelect={(id) => {
                setSelectedItems((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
              }}
              onSelectAll={() => {
                setSelectedItems(selectedItems.length === queue.length ? [] : queue.map((item) => item.id));
              }}
            />
          </>
        )}
      </PageLayout>

      <FormDrawer
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        title="Review Queue Item"
        description="Apply a decision to this finance inbox record"
        onSubmit={handleSubmitReview}
        submitLabel="Save Decision"
        submitDisabled={isSubmitting}
        submitLoading={isSubmitting}
      >
        {selectedItem && (
          <>
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-1">Queue Item</p>
              <p className="font-medium mb-2">{selectedItem.title}</p>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{selectedItem.submittedBy || 'System'}</span>
                <span className="font-semibold">{selectedItem.amount !== undefined ? `$${selectedItem.amount.toLocaleString()}` : selectedItem.priority}</span>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium mb-2">Suggested Action</p>
              <div className="flex items-center justify-between">
                <span>{selectedItem.suggestedAction}</span>
                <StatusBadge type="info">{selectedItem.confidenceScore}% confidence</StatusBadge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{selectedItem.description}</p>
            </div>

            <FormField label="Decision" name="decision">
              <Select
                id="decision"
                value={reviewForm.decision}
                onChange={(e) => setReviewForm({ ...reviewForm, decision: e.target.value as 'action' | 'read' })}
                options={[
                  { value: 'action', label: 'Action item' },
                  { value: 'read', label: 'Mark as read' },
                ]}
              />
            </FormField>

            {selectedItem.similarTransactions > 0 && (
              <FormField label="Learning" name="applyToSimilar">
                <label className="flex items-start gap-3 cursor-pointer p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <input
                    type="checkbox"
                    checked={reviewForm.applyToSimilar}
                    onChange={(e) => setReviewForm({ ...reviewForm, applyToSimilar: e.target.checked })}
                    className="w-4 h-4 rounded border-border mt-0.5"
                  />
                  <div>
                    <p className="font-medium text-sm mb-1">
                      Note {selectedItem.similarTransactions} related finance signals
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Useful for future automation and operations review
                    </p>
                  </div>
                </label>
              </FormField>
            )}
          </>
        )}
      </FormDrawer>
    </>
  );
}
