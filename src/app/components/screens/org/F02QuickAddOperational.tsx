import { useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { FormField, Input, Select, TextArea } from '../../ui/form';
import { Button } from '../../ui/button';
import { useToast } from '../../ui/toast';
import { 
  DollarSign, 
  Sparkles,
  CheckCircle,
  AlertCircle,
  Upload,
  Save,
  Send,
  Receipt,
  X
} from 'lucide-react';
import { mockAccounts, mockCategories, mockFinanceKPIs, mockDepartments, mockClients, mockExpenseTypes } from '../finance/mockData';
import { FinanceSubNav } from './FinanceSubNav';

export function F02QuickAddOperational() {
  const { showToast } = useToast();
  const [step, setStep] = useState<'input' | 'classify' | 'outcome'>('input');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadedReceipts, setUploadedReceipts] = useState<string[]>([]);

  const [form, setForm] = useState({
    amount: '',
    narration: '',
    accountId: mockAccounts.filter(a => a.world === 'business')[0]?.id || '',
    world: 'business' as 'business' | 'personal',
    type: 'expense' as 'income' | 'expense',
    // Operational fields
    expenseTypeId: '',
    departmentId: '',
    clientId: '',
    isBillable: false,
    paymentMode: 'card' as 'cash' | 'bank' | 'wallet' | 'card',
    markForApproval: false
  });

  const [aiClassification, setAiClassification] = useState<{
    category: string;
    confidence: number;
    needsQuestion: boolean;
    question?: string;
    options?: string[];
  } | null>(null);

  const [outcome, setOutcome] = useState<{
    transactionId: string;
    status: 'draft' | 'pending-approval' | 'posted';
    updatedBalance: number;
    category: string;
    confidenceScore: number;
  } | null>(null);

  // Auto-save draft to localStorage
  const saveDraft = () => {
    if (form.narration || form.amount) {
      localStorage.setItem('finance_quick_add_draft', JSON.stringify(form));
    }
  };

  // Clear draft
  const clearDraft = () => {
    localStorage.removeItem('finance_quick_add_draft');
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newReceipts = Array.from(files).map(f => URL.createObjectURL(f));
      setUploadedReceipts(prev => [...prev, ...newReceipts]);
      showToast('success', 'Receipt Uploaded', `${files.length} file(s) attached`);
    }
  };

  // Remove receipt
  const removeReceipt = (index: number) => {
    setUploadedReceipts(prev => prev.filter((_, i) => i !== index));
    showToast('info', 'Receipt Removed', 'File removed from transaction');
  };

  // Simulate AI classification
  const classifyNarration = (narration: string) => {
    const lower = narration.toLowerCase();
    
    if (lower.includes('rent')) {
      return { category: 'Office Rent', confidence: 100, needsQuestion: false };
    }
    if (lower.includes('software') || lower.includes('subscription')) {
      return { category: 'Software Subscriptions', confidence: 95, needsQuestion: false };
    }
    if (lower.includes('travel') || lower.includes('flight') || lower.includes('hotel')) {
      return { category: 'Travel', confidence: 90, needsQuestion: false };
    }
    if (lower.includes('lunch') || lower.includes('dinner') || lower.includes('meeting')) {
      return {
        category: 'Travel',
        confidence: 65,
        needsQuestion: true,
        question: 'Was this a client meeting or team meal?',
        options: ['Client Meeting', 'Team Meal', 'Other']
      };
    }

    return {
      category: 'Office Supplies',
      confidence: 40,
      needsQuestion: true,
      question: 'What type of expense is this?',
      options: ['Office Supplies', 'Marketing', 'Travel', 'Other']
    };
  };

  const handleAnalyze = () => {
    setHasError(false);
    setErrorMessage('');

    // Validation
    if (!form.narration.trim()) {
      setHasError(true);
      setErrorMessage('Please describe what happened');
      showToast('warning', 'Narration Required', 'Please describe the transaction');
      return;
    }

    if (form.narration.trim().length < 3) {
      setHasError(true);
      setErrorMessage('Please add more detail (at least 3 characters)');
      showToast('warning', 'Too Short', 'Please add more detail');
      return;
    }

    if (!form.amount || parseFloat(form.amount) <= 0) {
      setHasError(true);
      setErrorMessage('Please enter a valid amount greater than 0');
      showToast('warning', 'Amount Required', 'Please enter a valid amount');
      return;
    }

    if (parseFloat(form.amount) > 10000000) {
      setHasError(true);
      setErrorMessage('Amount seems unusually large. Please verify.');
      showToast('warning', 'Large Amount', 'Please confirm this amount');
      return;
    }

    if (!form.accountId) {
      setHasError(true);
      setErrorMessage('Please select an account');
      showToast('warning', 'Account Required', 'Please select an account');
      return;
    }

    // Operational validations
    if (!form.expenseTypeId) {
      setHasError(true);
      setErrorMessage('Please select an expense type');
      showToast('warning', 'Expense Type Required', 'Please select expense type');
      return;
    }

    if (!form.departmentId) {
      setHasError(true);
      setErrorMessage('Please select a department');
      showToast('warning', 'Department Required', 'Please select department');
      return;
    }

    // Check if receipt is required
    const selectedExpenseType = mockExpenseTypes.find(e => e.id === form.expenseTypeId);
    if (selectedExpenseType?.requiresReceipt && uploadedReceipts.length === 0) {
      setHasError(true);
      setErrorMessage('Receipt required for this expense type');
      showToast('warning', 'Receipt Required', 'Please attach a receipt');
      return;
    }

    saveDraft();

    const classification = classifyNarration(form.narration);
    setAiClassification(classification);
    setStep('classify');
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    saveDraft();
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSavingDraft(false);
    showToast('success', 'Draft Saved', 'You can come back and complete this later');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const selectedAccount = mockAccounts.find(a => a.id === form.accountId);
    const transactionId = `TXN-${Date.now()}`;
    
    // Determine status based on approval settings
    const selectedExpenseType = mockExpenseTypes.find(e => e.id === form.expenseTypeId);
    let status: 'draft' | 'pending-approval' | 'posted' = 'posted';
    
    if (form.markForApproval || selectedExpenseType?.requiresApproval) {
      status = 'pending-approval';
    }

    setOutcome({
      transactionId,
      status,
      updatedBalance: (selectedAccount?.balance || 0) - parseFloat(form.amount),
      category: aiClassification?.category || 'Uncategorized',
      confidenceScore: aiClassification?.confidence || 50
    });

    clearDraft();
    setStep('outcome');
    setIsSubmitting(false);

    if (status === 'pending-approval') {
      showToast('success', 'Submitted for Approval', 'Admin will review your expense');
    } else {
      showToast('success', 'Transaction Posted', 'Ledger updated successfully');
    }
  };

  const handleAddAnother = () => {
    setForm({
      amount: '',
      narration: '',
      accountId: mockAccounts.filter(a => a.world === 'business')[0]?.id || '',
      world: 'business',
      type: 'expense',
      expenseTypeId: '',
      departmentId: '',
      clientId: '',
      isBillable: false,
      paymentMode: 'card',
      markForApproval: false
    });
    setAiClassification(null);
    setOutcome(null);
    setUploadedReceipts([]);
    setStep('input');
  };

  return (
    <PageLayout
      title="ORG – F-02 – Quick Add (Operational)"
      description="Add expenses with department, client, and approval workflow"
      subNav={<FinanceSubNav />}
      kpis={[
        {
          title: 'Cash Available',
          value: `$${mockFinanceKPIs.cashInHand.toLocaleString()}`,
          change: 'In hand',
          icon: <DollarSign className="h-5 w-5" />
        },
        {
          title: 'Profit Today',
          value: `$${mockFinanceKPIs.profitToday.toLocaleString()}`,
          change: '+$179/hour',
          icon: <DollarSign className="h-5 w-5" />
        },
      ]}
    >
      <div className="max-w-2xl mx-auto">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'input' ? 'bg-primary text-primary-foreground' : 'bg-green-600 text-white'
            }`}>
              {step !== 'input' ? <CheckCircle className="h-5 w-5" /> : '1'}
            </div>
            <span className="text-sm font-medium">Input</span>
          </div>
          <div className="flex-1 h-px bg-border mx-4" />
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'classify' ? 'bg-primary text-primary-foreground' : 
              step === 'outcome' ? 'bg-green-600 text-white' : 'bg-muted text-muted-foreground'
            }`}>
              {step === 'outcome' ? <CheckCircle className="h-5 w-5" /> : '2'}
            </div>
            <span className="text-sm font-medium">Classify</span>
          </div>
          <div className="flex-1 h-px bg-border mx-4" />
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'outcome' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              3
            </div>
            <span className="text-sm font-medium">Done</span>
          </div>
        </div>

        {/* Step 1: Input */}
        {step === 'input' && (
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Tell me what happened</h2>
              <p className="text-sm text-muted-foreground">
                Describe the transaction naturally. AI will handle the rest.
              </p>
            </div>

            <FormField label="What happened?" name="narration">
              <TextArea
                id="narration"
                value={form.narration}
                onChange={(e) => {
                  setForm({ ...form, narration: e.target.value });
                  setHasError(false);
                  saveDraft();
                }}
                onBlur={saveDraft}
                placeholder="e.g., Paid for Figma subscription for design team, Flight to SF for client meeting, Team lunch after project completion..."
                rows={3}
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground mt-2">
                💡 Tip: Be specific. Mention client names, project details, or purpose.
              </p>
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Amount" name="amount">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    value={form.amount}
                    onChange={(e) => {
                      setForm({ ...form, amount: e.target.value });
                      setHasError(false);
                      saveDraft();
                    }}
                    onBlur={saveDraft}
                    placeholder="0.00"
                    className="pl-7 text-2xl h-14"
                    step="0.01"
                  />
                </div>
              </FormField>

              <FormField label="Paid via" name="accountId">
                <Select
                  id="accountId"
                  value={form.accountId}
                  onChange={(e) => {
                    setForm({ ...form, accountId: e.target.value });
                    saveDraft();
                  }}
                  options={mockAccounts
                    .filter(a => a.world === form.world && a.isActive)
                    .map(a => ({ 
                      value: a.id, 
                      label: `${a.icon} ${a.name} ($${a.balance.toLocaleString()})` 
                    }))}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Expense Type" name="expenseTypeId">
                <Select
                  id="expenseTypeId"
                  value={form.expenseTypeId}
                  onChange={(e) => {
                    setForm({ ...form, expenseTypeId: e.target.value });
                    saveDraft();
                  }}
                  options={[
                    { value: '', label: 'Select type...' },
                    ...mockExpenseTypes.map(e => ({
                      value: e.id,
                      label: `${e.name} ${e.requiresReceipt ? '📎' : ''}`
                    }))
                  ]}
                />
              </FormField>

              <FormField label="Department" name="departmentId">
                <Select
                  id="departmentId"
                  value={form.departmentId}
                  onChange={(e) => {
                    setForm({ ...form, departmentId: e.target.value });
                    saveDraft();
                  }}
                  options={[
                    { value: '', label: 'Select department...' },
                    ...mockDepartments.filter(d => d.isActive).map(d => ({
                      value: d.id,
                      label: `${d.code} - ${d.name}`
                    }))
                  ]}
                />
              </FormField>
            </div>

            <FormField label="Client (Optional)" name="clientId">
              <Select
                id="clientId"
                value={form.clientId}
                onChange={(e) => {
                  setForm({ ...form, clientId: e.target.value });
                  if (e.target.value) {
                    setForm(prev => ({ ...prev, isBillable: true }));
                  }
                  saveDraft();
                }}
                options={[
                  { value: '', label: 'None (Internal expense)' },
                  ...mockClients.filter(c => c.isActive).map(c => ({
                    value: c.id,
                    label: `${c.code} - ${c.name}`
                  }))
                ]}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Payment Mode" name="paymentMode">
                <Select
                  id="paymentMode"
                  value={form.paymentMode}
                  onChange={(e) => {
                    setForm({ ...form, paymentMode: e.target.value as any });
                    saveDraft();
                  }}
                  options={[
                    { value: 'card', label: '💳 Card' },
                    { value: 'cash', label: '💵 Cash' },
                    { value: 'bank', label: '🏦 Bank Transfer' },
                    { value: 'wallet', label: '📱 Digital Wallet' }
                  ]}
                />
              </FormField>

              <FormField label="Billable?" name="isBillable">
                <label className="flex items-center gap-3 cursor-pointer h-10">
                  <input
                    type="checkbox"
                    checked={form.isBillable}
                    onChange={(e) => {
                      setForm({ ...form, isBillable: e.target.checked });
                      saveDraft();
                    }}
                    className="w-5 h-5 rounded border-border"
                    disabled={!form.clientId}
                  />
                  <span className="text-sm font-medium">
                    {form.isBillable ? 'Yes, billable to client' : 'No, internal expense'}
                  </span>
                </label>
              </FormField>
            </div>

            {/* Receipt Upload */}
            <FormField label="Attach Receipt" name="receipt">
              <div className="space-y-3">
                <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Upload receipt (PDF, JPG, PNG)
                  </span>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept="image/*,.pdf"
                    multiple
                    className="hidden"
                  />
                </label>

                {uploadedReceipts.length > 0 && (
                  <div className="space-y-2">
                    {uploadedReceipts.map((receipt, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg"
                      >
                        <Receipt className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm flex-1">Receipt {idx + 1}</span>
                        <button
                          onClick={() => removeReceipt(idx)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FormField>

            <FormField label="Approval" name="markForApproval">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.markForApproval}
                  onChange={(e) => {
                    setForm({ ...form, markForApproval: e.target.checked });
                    saveDraft();
                  }}
                  className="w-4 h-4 rounded border-border mt-0.5"
                />
                <div>
                  <p className="font-medium text-sm">Requires approval</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Check this if expense needs admin approval before posting
                  </p>
                </div>
              </label>
            </FormField>

            {hasError && errorMessage && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button 
                onClick={handleAnalyze}
                className="flex-1 h-12 text-lg"
                disabled={!form.narration.trim() || !form.amount}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Analyze & Continue
              </Button>
              
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isSavingDraft}
                className="h-12"
              >
                <Save className="mr-2 h-5 w-5" />
                {isSavingDraft ? 'Saving...' : 'Save Draft'}
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              💾 Your progress is auto-saved
            </p>
          </div>
        )}

        {/* Step 2: Classify */}
        {step === 'classify' && aiClassification && (
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">AI Classification</h2>
              <p className="text-sm text-muted-foreground">
                {aiClassification.confidence >= 80
                  ? 'High confidence match found. Please confirm.'
                  : 'AI needs your help to classify this transaction.'}
              </p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Suggested Category</span>
                <span className={`text-sm font-medium px-2 py-1 rounded ${
                  aiClassification.confidence >= 80
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                    : aiClassification.confidence >= 60
                    ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                    : 'bg-red-500/10 text-red-600 dark:text-red-400'
                }`}>
                  {aiClassification.confidence}% Confidence
                </span>
              </div>
              <p className="text-lg font-semibold">{aiClassification.category}</p>
            </div>

            {aiClassification.needsQuestion && aiClassification.question && (
              <div className="space-y-3">
                <p className="font-medium">{aiClassification.question}</p>
                <div className="space-y-2">
                  {aiClassification.options?.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setAiClassification(prev => prev ? { ...prev, category: option, confidence: 95 } : null);
                      }}
                      className="w-full p-3 text-left border border-border rounded-lg hover:border-primary/50 transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={() => setStep('input')}
                className="flex-1"
              >
                ← Back
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1"
              >
                <Send className="mr-2 h-5 w-5" />
                {isSubmitting ? 'Submitting...' : 'Submit Expense'}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Outcome */}
        {step === 'outcome' && outcome && (
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                outcome.status === 'posted'
                  ? 'bg-green-500/10'
                  : 'bg-yellow-500/10'
              }`}>
                <CheckCircle className={`h-8 w-8 ${
                  outcome.status === 'posted'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-yellow-600 dark:text-yellow-400'
                }`} />
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                {outcome.status === 'posted' ? 'Transaction Posted!' : 'Submitted for Approval'}
              </h2>
              <p className="text-muted-foreground">
                {outcome.status === 'posted'
                  ? 'Ledger has been updated successfully'
                  : 'Admin will review and approve your expense'}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between p-4 bg-muted/50 rounded-lg">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-medium font-mono">{outcome.transactionId}</span>
              </div>
              <div className="flex justify-between p-4 bg-muted/50 rounded-lg">
                <span className="text-muted-foreground">Status</span>
                <span className={`font-medium ${
                  outcome.status === 'posted'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-yellow-600 dark:text-yellow-400'
                }`}>
                  {outcome.status === 'posted' ? 'Posted' : 'Pending Approval'}
                </span>
              </div>
              <div className="flex justify-between p-4 bg-muted/50 rounded-lg">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{outcome.category}</span>
              </div>
              <div className="flex justify-between p-4 bg-muted/50 rounded-lg">
                <span className="text-muted-foreground">Updated Balance</span>
                <span className="font-medium">${outcome.updatedBalance.toLocaleString()}</span>
              </div>
            </div>

            {outcome.status === 'posted' && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm font-medium mb-2">✓ What's been updated</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Ledger entry posted (immutable)</li>
                  <li>• Account balance updated</li>
                  <li>• P&L recalculated</li>
                  <li>• AI learned from this transaction</li>
                </ul>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button onClick={handleAddAnother} className="flex-1">
                Add Another Expense
              </Button>
              <Button variant="outline" className="flex-1">
                View My Submissions
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}