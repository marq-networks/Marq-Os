import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { useToast } from '../../ui/toast';
import { useRouter } from '../../router';
import { 
  DollarSign, 
  Receipt, 
  Upload, 
  FileText, 
  Check, 
  AlertCircle,
  Wallet,
  CreditCard,
  Banknote,
  Sparkles,
  Briefcase,
  Link2
} from 'lucide-react';
import { useState } from 'react';
import { useCurrentEmployee, useFinanceData } from '../../../services';
import { mockCategories } from '../finance/mockData';
import { propagateExpenseToEngines } from '../finance/financeEngines';

interface ExpenseFormData {
  amount: string;
  narration: string;
  categoryId: string;
  categoryName: string;
  paymentMethod: 'cash' | 'bank' | 'card';
  receiptFile: File | null;
  projectId: string; // NEW: Linked Project
  projectName: string; // NEW: Project name
}

export function M02SubmitExpense() {
  const { showToast } = useToast();
  const { navigate } = useRouter();
  const { employeeId, employeeName, employee } = useCurrentEmployee();
  const { createReimbursement } = useFinanceData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: '',
    narration: '',
    categoryId: '',
    categoryName: '',
    paymentMethod: 'card',
    receiptFile: null,
    projectId: '',
    projectName: ''
  });

  // Get expense categories (filter out income categories)
  const expenseCategories = mockCategories.filter(cat => cat.type === 'expense');

  // Auto-suggest categories based on narration
  const getSuggestedCategories = () => {
    if (!formData.narration) return [];
    
    const narrationLower = formData.narration.toLowerCase();
    const suggestions: typeof expenseCategories = [];

    // Simple keyword matching for suggestions
    expenseCategories.forEach(cat => {
      const keywords: Record<string, string[]> = {
        'cat-5': ['software', 'subscription', 'saas', 'figma', 'adobe', 'slack', 'zoom'],
        'cat-6': ['marketing', 'ads', 'advertising', 'promotion', 'campaign'],
        'cat-7': ['travel', 'flight', 'hotel', 'uber', 'taxi', 'transport', 'train'],
        'cat-8': ['office', 'supplies', 'stationery', 'pen', 'paper', 'desk'],
        'cat-9': ['utilities', 'electricity', 'water', 'internet', 'phone'],
        'cat-3': ['rent', 'lease', 'office space']
      };

      const catKeywords = keywords[cat.id] || [];
      if (catKeywords.some(keyword => narrationLower.includes(keyword))) {
        suggestions.push(cat);
      }
    });

    return suggestions.slice(0, 3); // Top 3 suggestions
  };

  const suggestedCategories = getSuggestedCategories();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showToast('warning', 'File Too Large', 'Please upload a file smaller than 10MB');
        return;
      }

      setFormData({ ...formData, receiptFile: file });
      showToast('success', 'Receipt Uploaded', file.name);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      showToast('warning', 'Amount Required', 'Please enter a valid amount');
      return;
    }

    if (!formData.narration.trim()) {
      showToast('warning', 'Description Required', 'Please describe the expense');
      return;
    }

    if (!formData.categoryId) {
      showToast('warning', 'Category Required', 'Please select a category');
      return;
    }

    if (!employeeId) {
      showToast('error', 'Employee Not Found', 'Unable to resolve your employee profile');
      return;
    }

    setIsSubmitting(true);
    try {
      await createReimbursement({
        employeeId,
        employeeName,
        department: employee?.department || 'General',
        amount: parseFloat(formData.amount),
        currency: 'USD',
        category: formData.categoryName,
        description: formData.narration,
        date: new Date().toISOString().slice(0, 10),
        receiptUrl: formData.receiptFile ? URL.createObjectURL(formData.receiptFile) : undefined,
        status: 'Pending',
      });

      propagateExpenseToEngines({
        id: `${employeeId}-${Date.now()}`,
        amount: parseFloat(formData.amount),
        narration: formData.narration,
        categoryId: formData.categoryId,
        projectId: formData.projectId || undefined,
        status: 'submitted',
      });

      showToast(
        'success',
        'Expense Submitted',
        `$${parseFloat(formData.amount).toLocaleString()} sent for approval`
      );

      setFormData({
        amount: '',
        narration: '',
        categoryId: '',
        categoryName: '',
        paymentMethod: 'card',
        receiptFile: null,
        projectId: '',
        projectName: ''
      });

      setTimeout(() => {
        navigate('/employee/money/finance-submissions');
      }, 1000);
    } catch {
      showToast('error', 'Submit Failed', 'Unable to submit this expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectCategory = (categoryId: string, categoryName: string) => {
    setFormData({ ...formData, categoryId, categoryName });
    setShowCategorySuggestions(false);
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return <Banknote className="h-5 w-5" />;
      case 'bank':
        return <Wallet className="h-5 w-5" />;
      case 'card':
        return <CreditCard className="h-5 w-5" />;
      default:
        return <DollarSign className="h-5 w-5" />;
    }
  };

  return (
    <PageLayout
      title="TEAM – Submit Expense"
      description="Submit expense for approval and reimbursement"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Info Banner */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium mb-1">Quick Submission to Finance</p>
              <p className="text-sm text-muted-foreground">
                Your expense will be routed to Finance Inbox with status "Pending". 
                Attach receipts for faster approval. Track status in My Submissions.
              </p>
            </div>
          </div>
        </div>

        {/* Expense Form */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          <h3 className="font-semibold text-lg mb-4">Expense Details</h3>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <DollarSign className="inline h-4 w-4 mr-1" />
              Amount *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-8 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Narration */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <FileText className="inline h-4 w-4 mr-1" />
              Description / Narration *
            </label>
            <textarea
              value={formData.narration}
              onChange={(e) => {
                setFormData({ ...formData, narration: e.target.value });
                // Show suggestions when user types
                if (e.target.value.length > 3) {
                  setShowCategorySuggestions(true);
                }
              }}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              placeholder="E.g., Client meeting lunch at Marina Bay Sands, Team lunch after project completion, Uber to client site"
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Be specific: include purpose, location, or project name
            </p>
          </div>

          {/* Category with Auto-suggest */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <Sparkles className="inline h-4 w-4 mr-1" />
              Category *
            </label>
            
            {/* Show AI suggestions if available */}
            {suggestedCategories.length > 0 && showCategorySuggestions && !formData.categoryId && (
              <div className="mb-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-xs font-medium text-primary mb-2 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  AI Suggestions based on your description:
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedCategories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => selectCategory(cat.id, cat.name)}
                      className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg text-sm transition-colors"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <select
              value={formData.categoryId}
              onChange={(e) => {
                const selectedCat = expenseCategories.find(c => c.id === e.target.value);
                setFormData({ 
                  ...formData, 
                  categoryId: e.target.value,
                  categoryName: selectedCat?.name || ''
                });
                setShowCategorySuggestions(false);
              }}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Select category...</option>
              {expenseCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            
            {formData.categoryId && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                <Check className="h-3 w-3" />
                Category selected: {formData.categoryName}
              </p>
            )}
          </div>

          {/* Payment Method: Cash / Bank / Card */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Payment Method *
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setFormData({ ...formData, paymentMethod: 'cash' })}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                  formData.paymentMethod === 'cash'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Banknote className={`h-6 w-6 ${
                  formData.paymentMethod === 'cash' ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <span className={`text-sm font-medium ${
                  formData.paymentMethod === 'cash' ? 'text-primary' : ''
                }`}>
                  Cash
                </span>
              </button>

              <button
                onClick={() => setFormData({ ...formData, paymentMethod: 'bank' })}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                  formData.paymentMethod === 'bank'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Wallet className={`h-6 w-6 ${
                  formData.paymentMethod === 'bank' ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <span className={`text-sm font-medium ${
                  formData.paymentMethod === 'bank' ? 'text-primary' : ''
                }`}>
                  Bank
                </span>
              </button>

              <button
                onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                  formData.paymentMethod === 'card'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <CreditCard className={`h-6 w-6 ${
                  formData.paymentMethod === 'card' ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <span className={`text-sm font-medium ${
                  formData.paymentMethod === 'card' ? 'text-primary' : ''
                }`}>
                  Card
                </span>
              </button>
            </div>
          </div>

          {/* Receipt Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <Receipt className="inline h-4 w-4 mr-1" />
              Attach Receipt
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              {formData.receiptFile ? (
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mx-auto">
                    <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="font-medium">{formData.receiptFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(formData.receiptFile.size / 1024).toFixed(1)} KB
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData({ ...formData, receiptFile: null })}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="font-medium mb-1">Upload Receipt</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    PNG, JPG, PDF up to 10MB
                  </p>
                  <label className="cursor-pointer">
                    <span className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                      Choose File
                    </span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <strong>Tip:</strong> Expenses with receipts are approved faster
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>Submitting to Finance...</>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Submit for Approval
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/employee/money/dashboard')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>

        {/* Help Text */}
        <div className="bg-accent/50 border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            <strong>What happens next:</strong> Your expense is routed to Finance Inbox with status "Pending". 
            Finance team will review and either approve or reject with reason. You'll receive a notification 
            and can track all submissions in <strong>My Submissions</strong>.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
