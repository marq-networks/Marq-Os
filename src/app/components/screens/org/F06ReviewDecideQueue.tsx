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
import { useState } from 'react';
import { mockReviewQueue, mockCategories } from '../finance/mockData';
import { ReviewQueueItem } from '../finance/types';

export function F06ReviewDecideQueue() {
  const { showToast } = useToast();
  const [queue, setQueue] = useState(mockReviewQueue);
  const [selectedItem, setSelectedItem] = useState<ReviewQueueItem | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<'approve' | 'skip' | null>(null);

  const [reviewForm, setReviewForm] = useState({
    categoryId: '',
    world: 'business' as 'business' | 'personal',
    applyToSimilar: false
  });

  const handleReview = (item: ReviewQueueItem) => {
    setSelectedItem(item);
    setReviewForm({
      categoryId: mockCategories.find(c => c.name === item.suggestedCategory)?.id || '',
      world: item.suggestedWorld || 'business',
      applyToSimilar: false
    });
    setIsReviewOpen(true);
  };

  const handleApprove = async (item: ReviewQueueItem) => {
    if (!item.suggestedCategory) {
      showToast('error', 'Cannot Approve', 'No AI suggestion available');
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 800));
    setQueue(prev => prev.filter(i => i.id !== item.id));
    showToast('success', 'Approved', `Transaction classified as ${item.suggestedCategory}`);
  };

  const handleBulkApprove = async () => {
    if (selectedItems.length === 0) {
      showToast('warning', 'No Selection', 'Please select transactions to approve');
      return;
    }

    const itemsToApprove = queue.filter(i => 
      selectedItems.includes(i.id) && 
      i.suggestedCategory && 
      i.confidenceScore >= 60
    );

    if (itemsToApprove.length === 0) {
      showToast('error', 'Cannot Approve', 'Selected items do not have high-confidence suggestions');
      return;
    }

    setBulkAction('approve');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setQueue(prev => prev.filter(i => !selectedItems.includes(i.id)));
    setSelectedItems([]);
    setBulkAction(null);
    showToast('success', 'Bulk Approved', `${itemsToApprove.length} transactions classified`);
  };

  const handleSkip = (itemId: string) => {
    setQueue(prev => prev.filter(i => i.id !== itemId));
    showToast('info', 'Skipped', 'Transaction moved to manual review');
  };

  const handleSubmitReview = async () => {
    if (!selectedItem) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    setQueue(prev => prev.filter(i => i.id !== selectedItem.id));
    
    if (reviewForm.applyToSimilar && selectedItem.similarTransactions > 0) {
      showToast('success', 'Learning Applied', 
        `Classified this transaction and learned rule for ${selectedItem.similarTransactions} similar transactions`);
    } else {
      showToast('success', 'Transaction Classified', 'Successfully categorized');
    }

    setIsSubmitting(false);
    setIsReviewOpen(false);
  };

  const columns = [
    { 
      key: 'date', 
      header: 'Date',
      cell: (value: any, item: ReviewQueueItem) => (
        <span className="text-sm">
          {new Date(item.date).toLocaleDateString()}
        </span>
      )
    },
    { 
      key: 'narration', 
      header: 'Narration',
      cell: (value: any, item: ReviewQueueItem) => (
        <div>
          <p className="font-medium">{item.narration}</p>
          <p className="text-xs text-muted-foreground">{item.accountName}</p>
        </div>
      )
    },
    { 
      key: 'amount', 
      header: 'Amount',
      cell: (value: any, item: ReviewQueueItem) => (
        <span className="font-semibold">${item.amount.toLocaleString()}</span>
      )
    },
    { 
      key: 'suggestedCategory', 
      header: 'AI Suggestion',
      cell: (value: any, item: ReviewQueueItem) => (
        <div>
          {item.suggestedCategory ? (
            <div className="flex items-center gap-2">
              <span className="text-sm">{item.suggestedCategory}</span>
              <StatusBadge type={
                item.confidenceScore >= 80 ? 'success' :
                item.confidenceScore >= 60 ? 'warning' : 'danger'
              }>
                {item.confidenceScore}%
              </StatusBadge>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">No suggestion</span>
          )}
          <p className="text-xs text-muted-foreground mt-1">{item.reason}</p>
        </div>
      )
    },
    { 
      key: 'similarTransactions', 
      header: 'Similar',
      cell: (value: any, item: ReviewQueueItem) => (
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
      cell: (value: any, item: ReviewQueueItem) => (
        <div className="flex gap-2">
          {item.suggestedCategory && item.confidenceScore >= 60 && (
            <Button 
              size="sm"
              onClick={() => handleApprove(item)}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Approve
            </Button>
          )}
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleReview(item)}
          >
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
        description="AI needs your help classifying these transactions"
        kpis={[
          {
            title: 'Pending Review',
            value: queue.length.toString(),
            change: 'Needs attention',
            changeType: queue.length > 0 ? 'warning' : 'positive',
            icon: <AlertCircle className="h-5 w-5" />
          },
          {
            title: 'High Confidence',
            value: queue.filter(i => i.confidenceScore >= 60).length.toString(),
            change: 'Quick approve available',
            icon: <CheckCircle className="h-5 w-5" />
          },
          {
            title: 'Learning Opportunities',
            value: queue.filter(i => i.similarTransactions > 0).length.toString(),
            change: 'Can train AI',
            icon: <Brain className="h-5 w-5" />
          },
          {
            title: 'Auto-Classification Rate',
            value: '87%',
            change: '+5% this month',
            changeType: 'positive',
            icon: <TrendingUp className="h-5 w-5" />
          },
        ]}
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
            <p className="text-muted-foreground">
              No transactions need review. AI is handling everything smoothly.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-sm">
                💡 <strong>Pro Tip:</strong> When you review transactions, enable "Apply to similar" to teach AI and reduce future reviews.
              </p>
            </div>

            <DataTable columns={columns} data={queue} />
          </>
        )}
      </PageLayout>

      {/* Review Drawer */}
      <FormDrawer
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        title="Review Transaction"
        description="Classify this transaction and optionally train AI"
        onSubmit={handleSubmitReview}
        submitLabel="Classify & Post"
        submitDisabled={isSubmitting || !reviewForm.categoryId}
        submitLoading={isSubmitting}
      >
        {selectedItem && (
          <>
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-1">Transaction</p>
              <p className="font-medium mb-2">{selectedItem.narration}</p>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{selectedItem.accountName}</span>
                <span className="font-semibold">${selectedItem.amount.toLocaleString()}</span>
              </div>
            </div>

            {selectedItem.suggestedCategory && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium mb-2">AI Suggestion</p>
                <div className="flex items-center justify-between">
                  <span>{selectedItem.suggestedCategory}</span>
                  <StatusBadge type="info">{selectedItem.confidenceScore}% confidence</StatusBadge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{selectedItem.reason}</p>
              </div>
            )}

            <FormField label="Category" name="categoryId">
              <Select
                id="categoryId"
                value={reviewForm.categoryId}
                onChange={(e) => setReviewForm({ ...reviewForm, categoryId: e.target.value })}
                options={[
                  { value: '', label: 'Select category...' },
                  ...mockCategories
                    .filter(c => c.world === reviewForm.world)
                    .map(c => ({ value: c.id, label: c.name }))
                ]}
              />
            </FormField>

            <FormField label="World" name="world">
              <Select
                id="world"
                value={reviewForm.world}
                onChange={(e) => setReviewForm({ ...reviewForm, world: e.target.value as any })}
                options={[
                  { value: 'business', label: 'Business' },
                  { value: 'personal', label: 'Personal' }
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
                      Apply to {selectedItem.similarTransactions} similar transactions
                    </p>
                    <p className="text-xs text-muted-foreground">
                      This will teach AI to auto-classify similar transactions in the future
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