import { PageLayout } from '../../shared/PageLayout';
import { Card3D } from '../../shared/Card3D';
import { Breadcrumb } from '../../shared/Breadcrumb';
import { FinanceTopTabs } from '../../../finance/components/FinanceTopTabs';
import { useToast } from '../../ui/toast';
import { useState } from 'react';
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Upload,
  Building,
  User,
  DollarSign,
  Calendar
} from 'lucide-react';

export function FC03QuickAddAdmin() {
  const { showToast } = useToast();
  const [txnType, setTxnType] = useState<'expense' | 'income'>('expense');
  const [formData, setFormData] = useState({
    narration: '',
    amount: '',
    account: 'cash',
    department: '',
    client: '',
    billable: false,
    requiresApproval: false
  });

  const handleSubmit = (action: 'post' | 'approve') => {
    if (!formData.narration || !formData.amount) {
      showToast('Please fill in narration and amount', 'warning');
      return;
    }

    if (action === 'post') {
      showToast('Transaction posted to ledger successfully', 'success');
    } else {
      showToast('Transaction sent for approval', 'info');
    }

    // Reset form
    setFormData({
      narration: '',
      amount: '',
      account: 'cash',
      department: '',
      client: '',
      billable: false,
      requiresApproval: false
    });
  };

  return (
    <PageLayout
      title="ORG – FC-03 – Quick Add (Admin)"
      description="Quickly add expenses or income with admin privileges"
    >
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Finance', href: '/finance' },
          { label: 'Quick Add (Admin)', href: '/finance/quick-add-admin' }
        ]}
      />
      <FinanceTopTabs />
      <div className="max-w-3xl space-y-6">
        {/* Type Toggle */}
        <Card3D>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTxnType('expense')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-lg border-2 transition-colors ${
                txnType === 'expense'
                  ? 'border-red-500 bg-red-500/10 text-red-600'
                  : 'border-border hover:bg-accent'
              }`}
            >
              <ArrowDownCircle className="h-6 w-6" />
              <span className="font-semibold">Expense</span>
            </button>
            <button
              onClick={() => setTxnType('income')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-lg border-2 transition-colors ${
                txnType === 'income'
                  ? 'border-green-500 bg-green-500/10 text-green-600'
                  : 'border-border hover:bg-accent'
              }`}
            >
              <ArrowUpCircle className="h-6 w-6" />
              <span className="font-semibold">Income</span>
            </button>
          </div>
        </Card3D>

        {/* Form */}
        <Card3D>
          <h3 className="font-semibold mb-4">Transaction Details</h3>
          <div className="space-y-4">
            {/* Narration */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Narration <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.narration}
                onChange={(e) => setFormData({ ...formData, narration: e.target.value })}
                placeholder="Describe the transaction..."
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                AI will auto-classify based on narration
              </p>
            </div>

            {/* Amount & Account */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Amount <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Account / Cash</label>
                <select
                  value={formData.account}
                  onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="cash">Cash in Hand</option>
                  <option value="bank-main">Bank - Main Account</option>
                  <option value="bank-savings">Bank - Savings</option>
                  <option value="credit-card">Credit Card</option>
                </select>
              </div>
            </div>

            {/* Department & Client */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Department</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Department</option>
                    <option value="sales">Sales</option>
                    <option value="marketing">Marketing</option>
                    <option value="design">Design</option>
                    <option value="engineering">Engineering</option>
                    <option value="operations">Operations</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Client</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Client</option>
                    <option value="acme">Acme Corp</option>
                    <option value="techstart">TechStart Inc</option>
                    <option value="global">Global Enterprises</option>
                    <option value="internal">Internal</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Billable Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="billable"
                checked={formData.billable}
                onChange={(e) => setFormData({ ...formData, billable: e.target.checked })}
                className="h-4 w-4 rounded border-border"
              />
              <label htmlFor="billable" className="text-sm font-medium cursor-pointer">
                Billable to Client
              </label>
            </div>

            {/* Receipt Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Attach Receipt</label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-accent/50 cursor-pointer transition-colors">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drop files here or click to upload
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, PDF up to 10MB
                </p>
              </div>
            </div>

            {/* Approval Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="requiresApproval"
                checked={formData.requiresApproval}
                onChange={(e) => setFormData({ ...formData, requiresApproval: e.target.checked })}
                className="h-4 w-4 rounded border-border"
              />
              <label htmlFor="requiresApproval" className="text-sm font-medium cursor-pointer">
                Send for Approval (instead of posting directly)
              </label>
            </div>
          </div>
        </Card3D>

        {/* Action Buttons */}
        <Card3D>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSubmit('post')}
              disabled={formData.requiresApproval}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                formData.requiresApproval
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              <Calendar className="h-5 w-5" />
              Post to Ledger
            </button>
            <button
              onClick={() => handleSubmit('approve')}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium border border-border hover:bg-accent transition-colors"
            >
              <ArrowUpCircle className="h-5 w-5" />
              Send for Approval
            </button>
          </div>
        </Card3D>

        {/* Info Notice */}
        <div className="bg-accent/50 border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Admin Privileges:</strong> As an admin, you can post directly to the ledger or send for approval. 
            All transactions are immutable once posted. AI auto-classification with 95%+ confidence.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}