import { useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { BarChartComponent } from '../../shared/Charts';
import {
  Wallet, Building, CreditCard, Plus, TrendingUp, ArrowUpRight, ArrowDownRight,
  Eye, EyeOff,
} from 'lucide-react';

interface Account {
  id: string; name: string; type: 'Bank' | 'Credit Card' | 'Wallet' | 'Savings';
  institution: string; balance: number; currency: string; status: 'Active' | 'Frozen';
  lastTx: string; accountNumber: string;
}

const ACCOUNTS: Account[] = [
  { id: 'a1', name: 'Operating Account', type: 'Bank', institution: 'JPMorgan Chase', balance: 284500, currency: 'USD', status: 'Active', lastTx: '2026-03-04', accountNumber: '****4523' },
  { id: 'a2', name: 'Payroll Account', type: 'Bank', institution: 'Bank of America', balance: 156000, currency: 'USD', status: 'Active', lastTx: '2026-03-01', accountNumber: '****8901' },
  { id: 'a3', name: 'Corporate Card', type: 'Credit Card', institution: 'American Express', balance: -12400, currency: 'USD', status: 'Active', lastTx: '2026-03-04', accountNumber: '****3456' },
  { id: 'a4', name: 'Petty Cash', type: 'Wallet', institution: 'Internal', balance: 2500, currency: 'USD', status: 'Active', lastTx: '2026-03-02', accountNumber: 'PETTY-01' },
  { id: 'a5', name: 'Reserve Fund', type: 'Savings', institution: 'Goldman Sachs', balance: 500000, currency: 'USD', status: 'Active', lastTx: '2026-02-15', accountNumber: '****7890' },
  { id: 'a6', name: 'EUR Account', type: 'Bank', institution: 'Deutsche Bank', balance: 45000, currency: 'EUR', status: 'Active', lastTx: '2026-02-28', accountNumber: '****2345' },
];

const TYPE_ICON: Record<string, typeof Wallet> = { Bank: Building, 'Credit Card': CreditCard, Wallet: Wallet, Savings: TrendingUp };
const TYPE_COLOR: Record<string, string> = { Bank: 'bg-blue-500/10 text-blue-600', 'Credit Card': 'bg-purple-500/10 text-purple-600', Wallet: 'bg-green-500/10 text-green-600', Savings: 'bg-emerald-500/10 text-emerald-600' };

export function FinanceAccountsWallets() {
  const [showBalances, setShowBalances] = useState(true);

  const totalAssets = ACCOUNTS.filter(a => a.balance > 0).reduce((s, a) => s + a.balance, 0);
  const totalLiabilities = Math.abs(ACCOUNTS.filter(a => a.balance < 0).reduce((s, a) => s + a.balance, 0));
  const netWorth = totalAssets - totalLiabilities;

  const chartData = ACCOUNTS.map(a => ({ name: a.name.length > 12 ? a.name.substring(0, 12) + '...' : a.name, balance: Math.abs(a.balance) / 1000 }));

  const fmt = (v: number) => showBalances ? `$${v.toLocaleString()}` : '••••••';

  return (
    <PageLayout
      title="Accounts & Wallets"
      description="Manage bank accounts, credit cards, wallets, and financial holdings"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowBalances(!showBalances)}>
            {showBalances ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
            {showBalances ? 'Hide' : 'Show'}
          </Button>
          <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Account</Button>
        </div>
      }
      kpis={[
        { title: 'Total Assets', value: fmt(totalAssets), changeType: 'positive', icon: <ArrowUpRight className="h-5 w-5" /> },
        { title: 'Liabilities', value: fmt(totalLiabilities), changeType: 'danger', icon: <ArrowDownRight className="h-5 w-5" /> },
        { title: 'Net Position', value: fmt(netWorth), changeType: netWorth > 0 ? 'positive' : 'danger', icon: <TrendingUp className="h-5 w-5" /> },
        { title: 'Accounts', value: ACCOUNTS.length, change: `${ACCOUNTS.filter(a => a.status === 'Active').length} active`, changeType: 'neutral', icon: <Building className="h-5 w-5" /> },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-6">
          <h3 className="font-medium mb-4">Account Balances ($K)</h3>
          <BarChartComponent data={chartData} dataKey="balance" xAxisKey="name" height={260} />
        </div>
        <div className="space-y-4">
          {[
            { label: 'Bank Accounts', count: ACCOUNTS.filter(a => a.type === 'Bank').length, total: ACCOUNTS.filter(a => a.type === 'Bank').reduce((s, a) => s + a.balance, 0) },
            { label: 'Credit Cards', count: ACCOUNTS.filter(a => a.type === 'Credit Card').length, total: ACCOUNTS.filter(a => a.type === 'Credit Card').reduce((s, a) => s + a.balance, 0) },
            { label: 'Wallets', count: ACCOUNTS.filter(a => a.type === 'Wallet').length, total: ACCOUNTS.filter(a => a.type === 'Wallet').reduce((s, a) => s + a.balance, 0) },
            { label: 'Savings', count: ACCOUNTS.filter(a => a.type === 'Savings').length, total: ACCOUNTS.filter(a => a.type === 'Savings').reduce((s, a) => s + a.balance, 0) },
          ].map(item => (
            <div key={item.label} className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-lg font-medium mt-1">{fmt(item.total)}</p>
              <p className="text-xs text-muted-foreground">{item.count} account{item.count > 1 ? 's' : ''}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACCOUNTS.map(account => {
          const Icon = TYPE_ICON[account.type] || Wallet;
          return (
            <div key={account.id} className="rounded-lg border border-border bg-card p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${TYPE_COLOR[account.type]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{account.name}</h4>
                    <p className="text-xs text-muted-foreground">{account.institution}</p>
                  </div>
                </div>
                <StatusBadge type={account.status === 'Active' ? 'success' : 'danger'}>{account.status}</StatusBadge>
              </div>
              <div className="mb-3">
                <p className={`text-2xl font-medium ${account.balance < 0 ? 'text-red-600' : ''}`}>
                  {fmt(account.balance)}
                </p>
                <p className="text-xs text-muted-foreground">{account.currency}</p>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                <span>{account.accountNumber}</span>
                <span>Last tx: {new Date(account.lastTx).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
}
