import { PageLayout } from '../../shared/PageLayout';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Zap,
  AlertTriangle,
  Target,
  Gauge
} from 'lucide-react';
import { useMemo } from 'react';
import { useFinanceData } from '../../../services';

export function F01FinanceHome() {
  const { accounts, transactions, costCenters, financeInbox, loading } = useFinanceData();

  const totalCash = useMemo(
    () => accounts.filter(a => a.type === 'petty_cash').reduce((sum, a) => sum + a.balance, 0),
    [accounts],
  );
  const totalBank = useMemo(
    () => accounts.filter(a => a.type === 'bank' || a.type === 'savings').reduce((sum, a) => sum + a.balance, 0),
    [accounts],
  );
  const totalWallet = useMemo(
    () => accounts.filter(a => a.type === 'wallet' || a.type === 'credit').reduce((sum, a) => sum + a.balance, 0),
    [accounts],
  );
  const netWorth = useMemo(
    () => accounts.reduce((sum, account) => sum + account.balance, 0),
    [accounts],
  );

  const today = new Date().toISOString().slice(0, 10);
  const currentMonth = new Date().toISOString().slice(0, 7);

  const profitToday = useMemo(
    () => transactions
      .filter(txn => txn.date.startsWith(today))
      .reduce((sum, txn) => sum + (txn.type === 'income' ? txn.amount : -txn.amount), 0),
    [transactions, today],
  );
  const profitMonth = useMemo(
    () => transactions
      .filter(txn => txn.date.startsWith(currentMonth))
      .reduce((sum, txn) => sum + (txn.type === 'income' ? txn.amount : -txn.amount), 0),
    [transactions, currentMonth],
  );
  const profitPerHour = useMemo(() => {
    const activeDays = Math.max(1, new Set(transactions.filter(txn => txn.date.startsWith(currentMonth)).map(txn => txn.date)).size);
    return profitMonth / (activeDays * 8);
  }, [transactions, currentMonth, profitMonth]);
  const burnRate = useMemo(() => {
    const expenseTransactions = transactions.filter(txn => txn.type !== 'income');
    const days = Math.max(1, new Set(expenseTransactions.map(txn => txn.date)).size);
    const totalExpenses = expenseTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    return totalExpenses / days;
  }, [transactions]);
  const quoteRisk = useMemo(() => {
    if (!costCenters.length) return 0;
    return Math.round((costCenters.filter(center => center.status !== 'On Track').length / costCenters.length) * 100);
  }, [costCenters]);
  const overheadLeakage = useMemo(() => {
    const budgets = costCenters.reduce((sum, center) => sum + center.budget, 0);
    const spent = costCenters.reduce((sum, center) => sum + center.spent, 0);
    if (budgets <= 0 || spent <= budgets) return 0;
    return Number((((spent - budgets) / budgets) * 100).toFixed(1));
  }, [costCenters]);
  const recentTransactions = useMemo(
    () => [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5),
    [transactions],
  );
  const reviewCount = financeInbox.filter(item => item.status !== 'actioned').length;
  const cashRunwayDays = burnRate > 0 ? Math.round(netWorth / burnRate) : 0;

  return (
    <PageLayout
      title="ORG – F-01 – Finance Home – 2050 Cockpit"
      description="Your intelligent finance command center"
      kpis={[
        {
          title: 'Net Worth',
          value: loading ? '...' : `$${(netWorth / 1000).toFixed(1)}K`,
          change: `${accounts.length} accounts tracked`,
          changeType: netWorth >= 0 ? 'positive' : 'negative',
          icon: <DollarSign className="h-5 w-5" />
        },
        {
          title: 'Profit Today',
          value: loading ? '...' : `$${profitToday.toLocaleString()}`,
          change: `Month: $${profitMonth.toLocaleString()}`,
          changeType: profitToday >= 0 ? 'positive' : 'negative',
          icon: <TrendingUp className="h-5 w-5" />
        },
        {
          title: 'Profit/Hour',
          value: loading ? '...' : `$${profitPerHour.toFixed(2)}`,
          change: 'Derived from current month activity',
          changeType: profitPerHour >= 0 ? 'positive' : 'negative',
          icon: <Zap className="h-5 w-5" />
        },
        {
          title: 'Burn Rate',
          value: loading ? '...' : `$${Math.round(burnRate).toLocaleString()}/day`,
          change: `${transactions.length} transactions loaded`,
          changeType: 'neutral',
          icon: <Gauge className="h-5 w-5" />
        },
      ]}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6 hover:scale-105 transition-transform duration-300 cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-green-500" />
              </div>
              <span className="text-2xl">💵</span>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">Cash in Hand</h3>
            <p className="text-3xl font-bold mb-2">${totalCash.toLocaleString()}</p>
            <p className="text-xs text-green-600 dark:text-green-400">
              {accounts.filter(a => a.type === 'petty_cash').length} petty cash accounts
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6 hover:scale-105 transition-transform duration-300 cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-500" />
              </div>
              <span className="text-2xl">🏦</span>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">Bank Balances</h3>
            <p className="text-3xl font-bold mb-2">${totalBank.toLocaleString()}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              {accounts.filter(a => a.type === 'bank' || a.type === 'savings').length} accounts synced
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 hover:scale-105 transition-transform duration-300 cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-purple-500" />
              </div>
              <span className="text-2xl">💳</span>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">Digital Wallets</h3>
            <p className="text-3xl font-bold mb-2">${totalWallet.toLocaleString()}</p>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              Wallet and credit balances
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-xl p-6 hover:scale-105 transition-transform duration-300 cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-orange-500" />
              </div>
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">Quote Risk</h3>
            <p className="text-3xl font-bold mb-2">{quoteRisk}%</p>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              {costCenters.filter(center => center.status !== 'On Track').length} cost centers need attention
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Overhead Leakage</h3>
              <Target className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Current Rate</span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">
                    {overheadLeakage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, overheadLeakage))}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Target: Under 5% • Based on current cost center budget variance
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Profit Velocity</h3>
              <Zap className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                  ${profitPerHour.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">/hour</span>
              </div>
              <div className="text-sm space-y-1">
                <p className="text-muted-foreground">
                  Per minute: <span className="font-semibold">${(profitPerHour / 60).toFixed(2)}</span>
                </p>
                <p className="text-muted-foreground">
                  Per day: <span className="font-semibold">${(profitPerHour * 8).toFixed(0)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold">Recent Activity</h3>
          </div>
          <div className="divide-y divide-border">
            {recentTransactions.map(txn => (
              <div key={txn.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      txn.type === 'income'
                        ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                        : 'bg-red-500/20 text-red-600 dark:text-red-400'
                    }`}>
                      {txn.type === 'income' ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : (
                        <TrendingDown className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{txn.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{txn.accountName}</span>
                        {txn.departmentName && (
                          <span className="text-xs px-1.5 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded">
                            {txn.departmentName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      txn.type === 'income'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {txn.type === 'income' ? '+' : '-'}${txn.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(txn.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Zap className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">AI Insights</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Profit per hour is currently ${profitPerHour.toFixed(2)}</li>
                <li>• {reviewCount} finance inbox items still need action</li>
                <li>• {costCenters.filter(center => center.status === 'Over Budget').length} cost centers are over budget</li>
                <li>• Cash runway is approximately {cashRunwayDays} days at the current burn rate</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
