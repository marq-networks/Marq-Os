import { useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import {
  Settings, DollarSign, Calendar, Globe, Bell, Save, CreditCard, Receipt,
} from 'lucide-react';

interface FinanceConfig {
  currency: string; fiscalYearStart: string; taxId: string;
  autoReconcile: boolean; expenseApprovalRequired: boolean;
  reimbursementAutoApproveLimit: number; invoicePrefix: string; invoiceNextNumber: number;
  paymentTermsDays: number; lateFeePercent: number;
  emailOnPayment: boolean; emailOnInvoice: boolean; emailOnExpense: boolean;
}

const DEFAULT_CONFIG: FinanceConfig = {
  currency: 'USD', fiscalYearStart: 'January', taxId: 'XX-XXXXXXX',
  autoReconcile: true, expenseApprovalRequired: true,
  reimbursementAutoApproveLimit: 200, invoicePrefix: 'INV-2026-',
  invoiceNextNumber: 313, paymentTermsDays: 30, lateFeePercent: 1.5,
  emailOnPayment: true, emailOnInvoice: true, emailOnExpense: false,
};

export function FinanceSettings() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [hasChanges, setHasChanges] = useState(false);

  const update = <K extends keyof FinanceConfig>(key: K, value: FinanceConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => { setHasChanges(false); alert('Finance settings saved.'); };

  return (
    <PageLayout
      title="Finance Settings"
      description="Configure currency, invoicing, approval workflows, and notification preferences"
      actions={
        <Button onClick={handleSave} disabled={!hasChanges}>
          <Save className="mr-2 h-4 w-4" /> {hasChanges ? 'Save Changes' : 'Saved'}
        </Button>
      }
      kpis={[
        { title: 'Currency', value: config.currency, changeType: 'neutral', icon: <DollarSign className="h-5 w-5" /> },
        { title: 'Fiscal Year', value: config.fiscalYearStart, changeType: 'neutral', icon: <Calendar className="h-5 w-5" /> },
        { title: 'Payment Terms', value: `${config.paymentTermsDays} days`, changeType: 'neutral', icon: <CreditCard className="h-5 w-5" /> },
        { title: 'Next Invoice', value: `${config.invoicePrefix}${config.invoiceNextNumber}`, changeType: 'neutral', icon: <Receipt className="h-5 w-5" /> },
      ]}
    >
      <div className="space-y-6">
        {/* General */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5" /> General
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Default Currency</Label>
              <select value={config.currency} onChange={e => update('currency', e.target.value)} className="w-full h-9 mt-1.5 rounded-md border border-input bg-background px-3 text-sm">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="AED">AED (د.إ)</option>
              </select>
            </div>
            <div>
              <Label>Fiscal Year Start</Label>
              <select value={config.fiscalYearStart} onChange={e => update('fiscalYearStart', e.target.value)} className="w-full h-9 mt-1.5 rounded-md border border-input bg-background px-3 text-sm">
                {['January', 'April', 'July', 'October'].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <Label>Tax ID</Label>
              <Input value={config.taxId} onChange={e => update('taxId', e.target.value)} className="mt-1.5" />
            </div>
          </div>
        </div>

        {/* Invoicing */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Receipt className="h-5 w-5" /> Invoicing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>Invoice Prefix</Label>
              <Input value={config.invoicePrefix} onChange={e => update('invoicePrefix', e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label>Next Number</Label>
              <Input type="number" value={config.invoiceNextNumber} onChange={e => update('invoiceNextNumber', Number(e.target.value))} className="mt-1.5" />
            </div>
            <div>
              <Label>Payment Terms (days)</Label>
              <Input type="number" value={config.paymentTermsDays} onChange={e => update('paymentTermsDays', Number(e.target.value))} className="mt-1.5" />
            </div>
            <div>
              <Label>Late Fee (%)</Label>
              <Input type="number" step="0.5" value={config.lateFeePercent} onChange={e => update('lateFeePercent', Number(e.target.value))} className="mt-1.5" />
            </div>
          </div>
        </div>

        {/* Workflows */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5" /> Workflows
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-Reconciliation</Label>
                <p className="text-xs text-muted-foreground">Automatically match bank transactions to invoices</p>
              </div>
              <Switch checked={config.autoReconcile} onCheckedChange={v => update('autoReconcile', v)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Expense Approval Required</Label>
                <p className="text-xs text-muted-foreground">Require manager approval for all expenses</p>
              </div>
              <Switch checked={config.expenseApprovalRequired} onCheckedChange={v => update('expenseApprovalRequired', v)} />
            </div>
            <div>
              <Label>Reimbursement Auto-Approve Limit ($)</Label>
              <p className="text-xs text-muted-foreground mb-1.5">Claims below this amount are auto-approved</p>
              <Input type="number" value={config.reimbursementAutoApproveLimit} onChange={e => update('reimbursementAutoApproveLimit', Number(e.target.value))} className="max-w-xs" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5" /> Email Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div><Label>Payment Received</Label><p className="text-xs text-muted-foreground">Notify on incoming payments</p></div>
              <Switch checked={config.emailOnPayment} onCheckedChange={v => update('emailOnPayment', v)} />
            </div>
            <div className="flex items-center justify-between">
              <div><Label>Invoice Sent</Label><p className="text-xs text-muted-foreground">Confirm when invoices are sent</p></div>
              <Switch checked={config.emailOnInvoice} onCheckedChange={v => update('emailOnInvoice', v)} />
            </div>
            <div className="flex items-center justify-between">
              <div><Label>Expense Submitted</Label><p className="text-xs text-muted-foreground">Notify on new expense claims</p></div>
              <Switch checked={config.emailOnExpense} onCheckedChange={v => update('emailOnExpense', v)} />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
