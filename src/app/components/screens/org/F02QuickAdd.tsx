import { useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { FormField, Input, Select, TextArea } from '../../ui/form';
import { Button } from '../../ui/button';
import { StatusBadge } from '../../shared/StatusBadge';
import { useToast } from '../../ui/toast';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { mockAccounts, mockCategories, mockFinanceKPIs } from '../finance/mockData';
import { Transaction } from '../finance/types';

export function F02QuickAdd() {
  const { showToast } = useToast();
  const [step, setStep] = useState<'input' | 'classify' | 'outcome'>('input');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [form, setForm] = useState({
    amount: '',
    narration: '',
    accountId: mockAccounts.filter(a => a.world === 'business')[0]?.id || '',
    world: 'business' as 'business' | 'personal',
    type: 'expense' as 'income' | 'expense'
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

  // Restore draft on mount
  useState(() => {
    const draft = localStorage.getItem('finance_quick_add_draft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.narration || parsed.amount) {
          showToast('info', 'Draft Restored', 'Your previous transaction was restored');
          setForm(parsed);
        }
      } catch (e) {
        // Ignore invalid drafts
      }
    }
  });

  // Clear draft
  const clearDraft = () => {
    localStorage.removeItem('finance_quick_add_draft');
  };

  // Simulate AI classification
  const classifyNarration = (narration: string) => {
    const lower = narration.toLowerCase();
    
    // High confidence matches
    if (lower.includes('rent')) {
      return {
        category: 'Office Rent',
        confidence: 100,
        needsQuestion: false
      };
    }
    if (lower.includes('google') || lower.includes('workspace')) {
      return {
        category: 'Software Subscriptions',
        confidence: 99,
        needsQuestion: false
      };
    }
    if (lower.includes('salary') || lower.includes('payroll')) {
      return {
        category: 'Salaries',
        confidence: 98,
        needsQuestion: false
      };
    }
    if (lower.includes('client') || lower.includes('payment')) {
      return {
        category: 'Client Payments',
        confidence: 95,
        needsQuestion: false
      };
    }
    
    // Medium confidence - needs clarification
    if (lower.includes('coffee') || lower.includes('lunch')) {
      return {
        category: 'Unknown',
        confidence: 45,
        needsQuestion: true,
        question: 'Was this a client meeting or personal expense?',
        options: ['Client Meeting (Marketing)', 'Team Lunch (Employee Benefits)', 'Personal']
      };
    }
    if (lower.includes('uber') || lower.includes('taxi')) {
      return {
        category: 'Travel',
        confidence: 65,
        needsQuestion: true,
        question: 'Was this for business travel?',
        options: ['Yes - Business Travel', 'No - Personal']
      };
    }
    
    // Low confidence
    return {
      category: 'Unknown',
      confidence: 20,
      needsQuestion: true,
      question: 'I need more details. What category best describes this?',
      options: ['Office Supplies', 'Marketing', 'Software', 'Travel', 'Other']
    };
  };

  const handleAnalyze = () => {
    setHasError(false);
    setErrorMessage('');

    // Validation: Narration
    if (!form.narration.trim()) {
      setHasError(true);
      setErrorMessage('Please describe what happened');
      showToast('warning', 'Narration Required', 'Please describe the transaction');
      return;
    }

    // Validation: Narration too short
    if (form.narration.trim().length < 3) {
      setHasError(true);
      setErrorMessage('Please add more detail (at least 3 characters)');
      showToast('warning', 'Too Short', 'Please add more detail about the transaction');
      return;
    }

    // Validation: Amount
    if (!form.amount || parseFloat(form.amount) <= 0) {
      setHasError(true);
      setErrorMessage('Please enter a valid amount greater than 0');
      showToast('warning', 'Amount Required', 'Please enter a valid amount');
      return;
    }

    // Validation: Amount too large (sanity check)
    if (parseFloat(form.amount) > 10000000) {
      setHasError(true);
      setErrorMessage('Amount seems unusually large. Please verify.');
      showToast('warning', 'Large Amount', 'Please confirm this amount is correct');
      return;
    }

    // Validation: Account selected
    if (!form.accountId) {
      setHasError(true);
      setErrorMessage('Please select an account');
      showToast('warning', 'Account Required', 'Please select which account to use');
      return;
    }

    // Check if account has sufficient balance for expense
    const selectedAccount = mockAccounts.find(a => a.id === form.accountId);
    if (form.type === 'expense' && selectedAccount && selectedAccount.balance < parseFloat(form.amount)) {
      showToast('warning', 'Insufficient Balance', `${selectedAccount.name} only has $${selectedAccount.balance.toLocaleString()} available`);
      // Don't block, just warn
    }

    // Save draft before proceeding
    saveDraft();

    const classification = classifyNarration(form.narration);
    setAiClassification(classification);
    setStep('classify');
  };

  const handleSubmit = async (selectedCategory?: string) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const finalCategory = selectedCategory || aiClassification?.category || 'Uncategorized';
    const confidence = selectedCategory ? 100 : (aiClassification?.confidence || 0);
    const selectedAccount = mockAccounts.find(a => a.id === form.accountId);
    
    const newBalance = selectedAccount 
      ? (form.type === 'income' ? selectedAccount.balance + parseFloat(form.amount) : selectedAccount.balance - parseFloat(form.amount))
      : 0;

    setOutcome({
      transactionId: `TXN-${Date.now()}`,
      updatedBalance: newBalance,
      category: finalCategory,
      confidenceScore: confidence
    });

    setIsSubmitting(false);
    setStep('outcome');
  };

  const handleReset = () => {
    setForm({
      amount: '',
      narration: '',
      accountId: mockAccounts.filter(a => a.world === 'business')[0]?.id || '',
      world: 'business',
      type: 'expense'
    });
    setAiClassification(null);
    setOutcome(null);
    setStep('input');
    clearDraft();
  };

  return (
    <PageLayout
      title="ORG – F-02 – Quick Add Transaction"
      description="Narration-first, AI-assisted transaction entry"
      kpis={[
        {
          title: 'Cash Available',
          value: `$${mockFinanceKPIs.cashInHand.toLocaleString()}`,
          icon: <DollarSign className="h-5 w-5" />
        },
        {
          title: 'Bank Balance',
          value: `$${mockFinanceKPIs.bankBalances.toLocaleString()}`,
          icon: <TrendingUp className="h-5 w-5" />
        },
      ]}
    >
      <div className="max-w-3xl mx-auto">
        {/* Step Indicator */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className={`flex items-center gap-2 ${step === 'input' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'input' ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              1
            </div>
            <span className="text-sm font-medium">Narration</span>
          </div>
          <div className="w-12 h-px bg-border" />
          <div className={`flex items-center gap-2 ${step === 'classify' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'classify' ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              2
            </div>
            <span className="text-sm font-medium">Classify</span>
          </div>
          <div className="w-12 h-px bg-border" />
          <div className={`flex items-center gap-2 ${step === 'outcome' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'outcome' ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              3
            </div>
            <span className="text-sm font-medium">Outcome</span>
          </div>
        </div>

        {/* Step 1: Input */}
        {step === 'input' && (
          <div className="bg-card border border-border rounded-lg p-8 space-y-6">
            <div className="text-center mb-6">
              <Sparkles className="h-12 w-12 text-primary mx-auto mb-3" />
              <h2 className="text-2xl font-semibold mb-2">What happened?</h2>
              <p className="text-sm text-muted-foreground">
                Just describe the transaction in your own words
              </p>
            </div>

            {/* Transaction Type Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setForm({ ...form, type: 'income' })}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                  form.type === 'income'
                    ? 'border-green-500 bg-green-500/10 text-green-600 dark:text-green-400'
                    : 'border-border hover:border-muted-foreground'
                }`}
              >
                <TrendingUp className="h-5 w-5 mx-auto mb-1" />
                <span className="text-sm font-medium">Income</span>
              </button>
              <button
                onClick={() => setForm({ ...form, type: 'expense' })}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                  form.type === 'expense'
                    ? 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400'
                    : 'border-border hover:border-muted-foreground'
                }`}
              >
                <TrendingDown className="h-5 w-5 mx-auto mb-1" />
                <span className="text-sm font-medium">Expense</span>
              </button>
            </div>

            <FormField label="Narration" name="narration">
              <TextArea
                id="narration"
                value={form.narration}
                onChange={(e) => {
                  setForm({ ...form, narration: e.target.value });
                  setHasError(false);
                  saveDraft();
                }}
                onBlur={saveDraft}
                placeholder="e.g., Paid office rent for January, Client payment for design project, Coffee with potential client..."
                rows={3}
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground mt-2">
                💡 Tip: Be specific. AI learns from your descriptions.
              </p>
            </FormField>

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
              {form.amount && parseFloat(form.amount) > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  In words: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(form.amount))}
                </p>
              )}
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

            {hasError && errorMessage && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
              </div>
            )}

            <Button 
              onClick={handleAnalyze}
              className="w-full h-12 text-lg"
              disabled={!form.narration.trim() || !form.amount}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Analyze & Continue
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              💾 Your progress is auto-saved
            </p>
          </div>
        )}

        {/* Step 2: Classification */}
        {step === 'classify' && aiClassification && (
          <div className="bg-card border border-border rounded-lg p-8 space-y-6">
            {/* High Confidence - Auto Classification */}
            {!aiClassification.needsQuestion && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">Got it!</h2>
                  <p className="text-sm text-muted-foreground">
                    I'm {aiClassification.confidence}% confident about this
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Classified as:</span>
                    <StatusBadge type="success">
                      {aiClassification.confidence}% Confidence
                    </StatusBadge>
                  </div>
                  <p className="text-2xl font-semibold mb-2">{aiClassification.category}</p>
                  <p className="text-sm text-muted-foreground">{form.narration}</p>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={() => handleSubmit()}
                    className="flex-1 h-12"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Looks Good - Save'}
                  </Button>
                  <Button 
                    onClick={() => setStep('input')}
                    variant="outline"
                    className="h-12"
                  >
                    Back
                  </Button>
                </div>
              </>
            )}

            {/* Low/Medium Confidence - Need Clarification */}
            {aiClassification.needsQuestion && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">Quick question</h2>
                  <p className="text-sm text-muted-foreground">
                    {aiClassification.question}
                  </p>
                </div>

                <div className="space-y-2">
                  {aiClassification.options?.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSubmit(option)}
                      disabled={isSubmitting}
                      className="w-full p-4 bg-muted hover:bg-muted/70 border border-border rounded-lg text-left transition-colors disabled:opacity-50"
                    >
                      <span className="font-medium">{option}</span>
                    </button>
                  ))}
                </div>

                <Button 
                  onClick={() => setStep('input')}
                  variant="outline"
                  className="w-full"
                >
                  Back to Edit
                </Button>
              </>
            )}
          </div>
        )}

        {/* Step 3: Outcome */}
        {step === 'outcome' && outcome && (
          <div className="bg-card border border-border rounded-lg p-8 space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Transaction Saved!</h2>
              <p className="text-sm text-muted-foreground">
                Your books are updated in real-time
              </p>
            </div>

            {/* Outcome Summary */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Transaction ID</p>
                  <p className="font-mono font-semibold">{outcome.transactionId}</p>
                </div>
                <StatusBadge type="success">Posted</StatusBadge>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-green-500/20">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Amount</p>
                  <p className="text-xl font-semibold">
                    {form.type === 'income' ? '+' : '-'}${parseFloat(form.amount).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Category</p>
                  <p className="text-xl font-semibold">{outcome.category}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-green-500/20">
                <p className="text-sm text-muted-foreground mb-1">Updated Balance</p>
                <p className="text-2xl font-bold">${outcome.updatedBalance.toLocaleString()}</p>
              </div>
            </div>

            {/* What's Updated */}
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm font-medium mb-3">What's been updated:</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  Ledger entry posted (immutable)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  Account balance updated
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  P&L statement recalculated
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  AI learned from this transaction
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleReset}
                className="flex-1 h-12"
              >
                Add Another Transaction
              </Button>
              <Button 
                onClick={() => window.location.href = '#'}
                variant="outline"
                className="h-12"
              >
                View Ledger
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}