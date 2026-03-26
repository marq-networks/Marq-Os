import { useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import {
  Scale, CheckCircle2, XCircle, Clock, DollarSign, Eye, MessageSquare, ThumbsUp, ThumbsDown,
} from 'lucide-react';

interface ReviewItem {
  id: string; title: string; type: 'Expense' | 'Invoice' | 'Budget' | 'Reimbursement' | 'Contract';
  submittedBy: string; amount: number; date: string; department: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  description: string; attachments: number;
}

const REVIEW_ITEMS: ReviewItem[] = [
  { id: 'rv1', title: 'Q2 Marketing Budget Increase', type: 'Budget', submittedBy: 'Emily Rodriguez', amount: 15000, date: '2026-03-04', department: 'Marketing', status: 'Pending', description: 'Requesting additional budget for social media campaign and PPC ads for Q2 product launch.', attachments: 2 },
  { id: 'rv2', title: 'Annual SaaS Subscription Renewal', type: 'Contract', submittedBy: 'Robert Taylor', amount: 24000, date: '2026-03-03', department: 'Engineering', status: 'Pending', description: 'Annual renewal for AWS infrastructure services, includes 20% cost increase.', attachments: 1 },
  { id: 'rv3', title: 'Client Dinner Expense', type: 'Expense', submittedBy: 'James Wilson', amount: 450, date: '2026-03-03', department: 'Sales', status: 'Pending', description: 'Business dinner with DataCo stakeholders to discuss enterprise contract renewal.', attachments: 3 },
  { id: 'rv4', title: 'Conference Sponsorship', type: 'Invoice', submittedBy: 'Lisa Anderson', amount: 5000, date: '2026-03-02', department: 'HR', status: 'Pending', description: 'Gold sponsorship package for TechHR Summit 2026, includes booth and 2 speaker slots.', attachments: 1 },
  { id: 'rv5', title: 'Ergonomic Equipment', type: 'Reimbursement', submittedBy: 'Anna Park', amount: 800, date: '2026-03-01', department: 'Engineering', status: 'Approved', description: 'Standing desk and ergonomic chair for home office setup.', attachments: 2 },
  { id: 'rv6', title: 'Team Building Event', type: 'Budget', submittedBy: 'David Kim', amount: 3500, date: '2026-02-28', department: 'Product', status: 'Rejected', description: 'Offsite team building day - escape rooms, lunch, and activities.', attachments: 0 },
];

const TYPE_COLOR: Record<string, string> = {
  Expense: 'bg-orange-500/10 text-orange-600', Invoice: 'bg-blue-500/10 text-blue-600',
  Budget: 'bg-purple-500/10 text-purple-600', Reimbursement: 'bg-green-500/10 text-green-600',
  Contract: 'bg-red-500/10 text-red-600',
};

export function FinanceReviewDecide() {
  const [items, setItems] = useState(REVIEW_ITEMS);

  const pending = items.filter(i => i.status === 'Pending');
  const pendingAmount = pending.reduce((s, i) => s + i.amount, 0);

  const handleDecision = (id: string, decision: 'Approved' | 'Rejected') => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: decision } : i));
  };

  return (
    <PageLayout
      title="Review & Decide"
      description="Review pending financial items and make approval decisions"
      kpis={[
        { title: 'Pending Review', value: pending.length, change: 'Awaiting decision', changeType: pending.length > 0 ? 'warning' : 'positive', icon: <Scale className="h-5 w-5" /> },
        { title: 'Pending Amount', value: `$${pendingAmount.toLocaleString()}`, changeType: 'neutral', icon: <DollarSign className="h-5 w-5" /> },
        { title: 'Approved', value: items.filter(i => i.status === 'Approved').length, changeType: 'positive', icon: <CheckCircle2 className="h-5 w-5" /> },
        { title: 'Rejected', value: items.filter(i => i.status === 'Rejected').length, changeType: 'neutral', icon: <XCircle className="h-5 w-5" /> },
      ]}
    >
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className={`rounded-lg border bg-card p-5 ${
            item.status === 'Pending' ? 'border-yellow-200 dark:border-yellow-900' : 'border-border'
          }`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${TYPE_COLOR[item.type]}`}>
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{item.title}</h4>
                    <StatusBadge type={item.status === 'Pending' ? 'warning' : item.status === 'Approved' ? 'success' : 'danger'}>
                      {item.status}
                    </StatusBadge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span className={`px-1.5 py-0.5 rounded ${TYPE_COLOR[item.type]}`}>{item.type}</span>
                    <span>by {item.submittedBy}</span>
                    <span>{item.department}</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-medium">${item.amount.toLocaleString()}</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">{item.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {item.attachments > 0 && (
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {item.attachments} attachment{item.attachments > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              {item.status === 'Pending' && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm"><MessageSquare className="h-3.5 w-3.5 mr-1.5" /> Comment</Button>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleDecision(item.id, 'Rejected')}>
                    <ThumbsDown className="h-3.5 w-3.5 mr-1.5" /> Reject
                  </Button>
                  <Button size="sm" onClick={() => handleDecision(item.id, 'Approved')}>
                    <ThumbsUp className="h-3.5 w-3.5 mr-1.5" /> Approve
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
