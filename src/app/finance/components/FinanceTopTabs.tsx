import { useState, useEffect } from 'react';
import { useRouter } from '../../components/router';
import { useLedger } from '../../stores/ledgerStore';
import { useToast } from '../../components/ui/toast';
import { Brain, LayoutDashboard, BookOpen, Inbox, Plus, X, ArrowDownCircle, ArrowUpCircle, DollarSign } from 'lucide-react';

export function FinanceTopTabs() {
  const { currentPath, navigate } = useRouter();
  const { addTransaction } = useLedger();
  const { showToast } = useToast();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    type: 'expense' as 'expense' | 'income',
    amount: '',
    narration: '',
    category: 'Office Expenses',
    department: 'Admin',
    project: 'None',
    date: new Date().toISOString().split('T')[0],
    billable: false
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      type: 'expense',
      amount: '',
      narration: '',
      category: 'Office Expenses',
      department: 'Admin',
      project: 'None',
      date: new Date().toISOString().split('T')[0],
      billable: false
    });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isQuickAddOpen) return;
      
      if (e.key === 'Escape') {
        setIsQuickAddOpen(false);
      }
      
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isQuickAddOpen, formData]);

  // Handle form submission
  const handleSubmit = async () => {
    // Validation
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }
    if (!formData.narration.trim()) {
      showToast('Please enter a narration', 'error');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    // Add transaction to ledger
    addTransaction({
      date: formData.date,
      narration: formData.narration,
      account: formData.category,
      category: formData.category,
      department: formData.department,
      project: formData.project !== 'None' ? formData.project : undefined,
      amount: parseFloat(formData.amount),
      type: formData.type,
      status: 'posted' as const,
      billable: formData.billable
    });

    setIsSubmitting(false);
    setIsQuickAddOpen(false);
    resetForm();
    
    showToast(
      `Transaction added successfully! ${formData.type === 'expense' ? 'Expense' : 'Income'} of $${parseFloat(formData.amount).toLocaleString()} recorded.`,
      'success'
    );
  };

  // Determine active tab based on current path
  const getActiveTab = () => {
    if (currentPath.includes('/intelligence')) return 'intelligence';
    if (currentPath.includes('/ledger')) return 'ledger';
    if (currentPath.includes('/inbox')) return 'inbox';
    return 'cockpit'; // default
  };

  const activeTab = getActiveTab();

  const tabs = [
    { 
      id: 'cockpit', 
      label: 'Cockpit', 
      icon: LayoutDashboard,
      path: '/org/finance/cockpit',
      description: 'Command center'
    },
    { 
      id: 'ledger', 
      label: 'Ledger', 
      icon: BookOpen,
      path: '/org/finance/ledger-control',
      description: 'Transactions'
    },
    { 
      id: 'intelligence', 
      label: 'Intelligence', 
      icon: Brain,
      path: '/org/finance/intelligence',
      description: 'AI insights'
    },
    { 
      id: 'inbox', 
      label: 'Inbox', 
      icon: Inbox,
      path: '/org/finance/inbox',
      description: 'Approvals',
      badge: 3
    },
  ];

  return (
    <>
      <div className="border-b border-border mb-6 -mx-6 px-6 bg-background">
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => navigate(tab.path)}
                  className={`
                    relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all
                    border-b-2 -mb-[1px]
                    ${isActive 
                      ? 'border-primary text-foreground' 
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Add Button */}
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Quick Add
          </button>
        </div>
      </div>

      {/* Quick Add Modal */}
      {isQuickAddOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-semibold">Quick Add Transaction</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Quickly record a financial transaction
                </p>
              </div>
              <button
                onClick={() => setIsQuickAddOpen(false)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <form className="space-y-4">
                {/* Transaction Type */}
                <div>
                  <label className="text-sm font-medium block mb-2">Transaction Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'income' })}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        formData.type === 'income'
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-border hover:border-green-500/50 hover:bg-accent'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowUpCircle className={`h-5 w-5 ${formData.type === 'income' ? 'text-green-600' : 'text-muted-foreground'}`} />
                        <span className="font-medium text-sm">Income</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Credit transaction</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'expense' })}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        formData.type === 'expense'
                          ? 'border-red-500 bg-red-500/10'
                          : 'border-border hover:border-red-500/50 hover:bg-accent'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowDownCircle className={`h-5 w-5 ${formData.type === 'expense' ? 'text-red-600' : 'text-muted-foreground'}`} />
                        <span className="font-medium text-sm">Expense</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Debit transaction</p>
                    </button>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                </div>

                {/* Narration */}
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Narration <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Brief description of transaction"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.narration}
                    onChange={(e) => setFormData({ ...formData, narration: e.target.value })}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-medium block mb-2">Category</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option>Office Expenses</option>
                    <option>Software</option>
                    <option>Team Activities</option>
                    <option>Professional Services</option>
                    <option>Revenue</option>
                  </select>
                </div>

                {/* Department & Project */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">Department</label>
                    <select className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    >
                      <option>Admin</option>
                      <option>Sales</option>
                      <option>Engineering</option>
                      <option>Design</option>
                      <option>Operations</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-2">Project (Optional)</label>
                    <select className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.project}
                      onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                    >
                      <option>None</option>
                      <option>Project Apollo</option>
                      <option>Project Nova</option>
                      <option>Project Mars</option>
                    </select>
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="text-sm font-medium block mb-2">Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                {/* Billable */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="billable"
                    className="h-4 w-4 rounded border-border"
                    checked={formData.billable}
                    onChange={(e) => setFormData({ ...formData, billable: e.target.checked })}
                  />
                  <label htmlFor="billable" className="text-sm font-medium">
                    Billable to client
                  </label>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Press <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Esc</kbd> to close or{' '}
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl+Enter</kbd> to submit
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsQuickAddOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding...' : 'Add Transaction'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}