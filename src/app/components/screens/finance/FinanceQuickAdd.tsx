/**
 * ⛔ DEPRECATED — Phase 14 gap closure (FL-001)
 * This file is no longer rendered by any route or nav entry.
 * Use F02QuickAddOperational (screens/org/) for all quick-add functionality.
 * common/FinanceQuickAdd.tsx now re-exports F02QuickAddOperational.
 * This file will be removed in Phase 15.
 */
import { PageLayout } from '../../shared/PageLayout';
import { Card3D } from '../../shared/Card3D';
import { useLedger, EntryType } from '../../../stores/ledgerStore';
import { useRouter } from '../../router';
import { 
  Plus, 
  TrendingDown,
  TrendingUp,
  Users,
  Receipt,
  Edit3,
  CheckCircle,
  BookOpen
} from 'lucide-react';
import { toast } from 'sonner';

type TabType = 'expense' | 'income' | 'salary' | 'reimbursement' | 'adjustment';

interface FormData {
  amount: string;
  date: string;
  category: string;
  projectId: string;
  employeeId: string;
  reference: string;
  description: string;
}

const INITIAL_FORM_DATA: FormData = {
  amount: '',
  date: new Date().toISOString().split('T')[0],
  category: '',
  projectId: '',
  employeeId: '',
  reference: '',
  description: ''
};

// Mock data for dropdowns
const EXPENSE_CATEGORIES = [
  'Infrastructure',
  'Software',
  'Office Expenses',
  'Rent',
  'Marketing',
  'Travel',
  'Equipment',
  'HR & Recruitment',
  'Utilities',
  'Other'
];

const INCOME_CATEGORIES = [
  'Project Revenue',
  'Consulting Revenue',
  'Product Sales',
  'Subscription Revenue',
  'Other Revenue'
];

const PROJECTS = [
  { id: 'proj-001', name: 'Website Redesign' },
  { id: 'proj-002', name: 'Mobile App v2' },
  { id: 'proj-003', name: 'CRM Integration' },
  { id: 'proj-004', name: 'Marketing Campaign' },
  { id: 'proj-005', name: 'Infrastructure Upgrade' }
];

const EMPLOYEES = [
  { id: 'emp-001', name: 'Sarah Chen' },
  { id: 'emp-002', name: 'Marcus Lee' },
  { id: 'emp-003', name: 'Emily Rodriguez' },
  { id: 'emp-004', name: 'David Kim' },
  { id: 'emp-005', name: 'Jessica Wong' },
  { id: 'emp-006', name: 'Tom Harris' },
  { id: 'emp-007', name: 'Lisa Tan' }
];

const DEPARTMENTS = [
  { id: 'dept-001', name: 'Engineering', employees: 12 },
  { id: 'dept-002', name: 'Design', employees: 5 },
  { id: 'dept-003', name: 'Marketing', employees: 4 },
  { id: 'dept-004', name: 'Sales', employees: 6 },
  { id: 'dept-005', name: 'Operations', employees: 3 },
  { id: 'dept-006', name: 'Executive', employees: 2 }
];

export function FinanceQuickAdd() {
  const { appendEntry } = useLedger();
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('expense');
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tabs = [
    { id: 'expense', label: 'Add Expense', icon: TrendingDown, color: 'text-red-600' },
    { id: 'income', label: 'Add Income', icon: TrendingUp, color: 'text-green-600' },
    { id: 'salary', label: 'Add Salary Payment', icon: Users, color: 'text-blue-600' },
    { id: 'reimbursement', label: 'Add Reimbursement', icon: Receipt, color: 'text-orange-600' },
    { id: 'adjustment', label: 'Manual Adjustment', icon: Edit3, color: 'text-purple-600' }
  ] as const;

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      ...INITIAL_FORM_DATA,
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!formData.reference) {
      toast.error('Please enter a reference');
      return;
    }
    if (!formData.description) {
      toast.error('Please enter a description');
      return;
    }

    setIsSubmitting(true);

    try {
      const amount = parseFloat(formData.amount);
      
      // Determine debit/credit based on entry type
      let debit = 0;
      let credit = 0;
      
      if (activeTab === 'income') {
        credit = amount; // Money in
      } else {
        debit = amount; // Money out (expense, salary, reimbursement)
      }

      // For adjustment, check if it's positive or negative
      if (activeTab === 'adjustment') {
        if (amount >= 0) {
          credit = amount;
          debit = 0;
        } else {
          credit = 0;
          debit = Math.abs(amount);
        }
      }

      // Create ledger entry
      appendEntry({
        date: formData.date,
        entryType: activeTab as EntryType,
        reference: formData.reference,
        description: formData.description,
        debit,
        credit,
        category: formData.category || undefined,
        projectId: formData.projectId || undefined,
        employeeId: formData.employeeId || undefined
      });

      toast.success(`${tabs.find(t => t.id === activeTab)?.label} recorded successfully!`);
      resetForm();

      // Wait a bit then navigate to ledger
      setTimeout(() => {
        navigate('/finance/ledger');
      }, 1000);

    } catch (error) {
      toast.error('Failed to record entry');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout
      title="Quick Add Transaction"
      description="Universal transaction injector for the finance ledger"
    >
      <div className="space-y-6">
        {/* Tab Navigation */}
        <Card3D>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                      : 'bg-card border-border hover:bg-accent hover:scale-102'
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm font-medium hidden sm:inline">{tab.label}</span>
                  <span className="text-sm font-medium sm:hidden">{tab.label.split(' ')[1]}</span>
                </button>
              );
            })}
          </div>
        </Card3D>

        {/* Form Card */}
        <Card3D>
          <div className="mb-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              {tabs.find(t => t.id === activeTab)?.icon && (
                <div className={tabs.find(t => t.id === activeTab)?.color}>
                  {(() => {
                    const Icon = tabs.find(t => t.id === activeTab)!.icon;
                    return <Icon className="h-5 w-5" />;
                  })()}
                </div>
              )}
              {tabs.find(t => t.id === activeTab)?.label}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Fill in the details and submit to append to the ledger
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-border bg-background"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background"
                  required
                />
              </div>

              {/* Reference */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Reference <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) => handleInputChange('reference', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background"
                  placeholder={
                    activeTab === 'salary' ? 'Department name' :
                    activeTab === 'reimbursement' ? 'Employee name' :
                    activeTab === 'income' ? 'Client/Company name' :
                    'Vendor/Company name'
                  }
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background"
                >
                  <option value="">Select category...</option>
                  {(activeTab === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Project (Optional) */}
              {(activeTab === 'expense' || activeTab === 'income') && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Project (Optional)
                  </label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => handleInputChange('projectId', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background"
                  >
                    <option value="">No project</option>
                    {PROJECTS.map(proj => (
                      <option key={proj.id} value={proj.id}>{proj.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Employee (Optional for reimbursement) */}
              {activeTab === 'reimbursement' && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Employee
                  </label>
                  <select
                    value={formData.employeeId}
                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background"
                  >
                    <option value="">Select employee...</option>
                    {EMPLOYEES.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Department helper for salary */}
              {activeTab === 'salary' && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Department (Helper)
                  </label>
                  <select
                    onChange={(e) => {
                      const dept = DEPARTMENTS.find(d => d.id === e.target.value);
                      if (dept) {
                        handleInputChange('reference', dept.name + ' Department');
                        handleInputChange('description', `Payroll - ${dept.name} team (${dept.employees} employees)`);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background"
                  >
                    <option value="">Quick select department...</option>
                    {DEPARTMENTS.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} ({dept.employees} employees)
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background"
                rows={3}
                placeholder="Enter a detailed description of this transaction..."
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => navigate('/finance/ledger')}
                className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Submit to Ledger</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </Card3D>

        {/* Info Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Append-Only Notice */}
          <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Plus className="h-4 w-4 text-orange-600" />
              Append-Only Ledger
            </h4>
            <p className="text-xs text-muted-foreground">
              All transactions are immediately appended to the ledger and cannot be edited or deleted. 
              For corrections, use Manual Adjustment entries with clear descriptions.
            </p>
          </div>

          {/* Quick Tip */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
              Auto-Balancing
            </h4>
            <p className="text-xs text-muted-foreground">
              The ledger automatically computes the running balance after each entry. 
              Credits increase balance (income), debits decrease balance (expenses, salaries, reimbursements).
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}