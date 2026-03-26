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
import { mockFinanceKPIs, mockAccounts, mockTransactions } from '../finance/mockData';
import { useState } from 'react';

export function F01FinanceHome() {
  const [kpis] = useState(mockFinanceKPIs);
  const [accounts] = useState(mockAccounts.filter(a => a.world === 'business'));

  // Calculate account totals
  const totalCash = accounts.filter(a => a.type === 'cash').reduce((sum, a) => sum + a.balance, 0);
  const totalBank = accounts.filter(a => a.type === 'bank').reduce((sum, a) => sum + a.balance, 0);
  const totalWallet = accounts.filter(a => a.type === 'wallet').reduce((sum, a) => sum + a.balance, 0);

  // Recent transactions (last 5)
  const recentTransactions = [...mockTransactions]
    .filter(t => t.world === 'business')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <PageLayout
      title="ORG – F-01 – Finance Home – 2050 Cockpit"
      description="Your intelligent finance command center"
      kpis={[
        {
          title: 'Net Worth',
          value: `$${(kpis.netWorth / 1000).toFixed(1)}K`,
          change: '+12.4% vs last month',
          changeType: 'positive',
          icon: <DollarSign className="h-5 w-5" />
        },
        {
          title: 'Profit Today',
          value: `$${kpis.profitToday.toLocaleString()}`,
          change: `Month: $${kpis.profitMonth.toLocaleString()}`,
          changeType: 'positive',
          icon: <TrendingUp className="h-5 w-5" />
        },
        {
          title: 'Profit/Hour',
          value: `$${kpis.profitPerHour.toFixed(2)}`,
          change: 'Above target',
          changeType: 'positive',
          icon: <Zap className="h-5 w-5" />
        },
        {
          title: 'Burn Rate',
          value: `$${kpis.burnRate.toLocaleString()}/day`,
          change: `-8% vs last month`,
          changeType: 'positive',
          icon: <Gauge className="h-5 w-5" />
        },
      ]}
    >
      <div className="space-y-6">
        {/* 2050 Cockpit - Spatial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Cash in Hand Card */}
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
              +$450 today from ATM
            </p>
          </div>

          {/* Bank Balances Card */}
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
              {accounts.filter(a => a.type === 'bank').length} accounts synced
            </p>
          </div>

          {/* Digital Wallets Card */}
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
              PayPal, Stripe balances
            </p>
          </div>

          {/* Quote Risk Card */}
          <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-xl p-6 hover:scale-105 transition-transform duration-300 cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-orange-500" />
              </div>
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">Quote Risk</h3>
            <p className="text-3xl font-bold mb-2">{kpis.quoteRisk}%</p>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              3 quotes below break-even
            </p>
          </div>
        </div>

        {/* Secondary Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Overhead Leakage */}
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
                    {kpis.overheadLeakage}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${kpis.overheadLeakage}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Target: Under 5% • Investigate: Utilities +22%, Misc expenses +18%
              </p>
            </div>
          </div>

          {/* Profit Velocity */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Profit Velocity</h3>
              <Zap className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                  ${kpis.profitPerHour.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">/hour</span>
              </div>
              <div className="text-sm space-y-1">
                <p className="text-muted-foreground">
                  Per minute: <span className="font-semibold">${(kpis.profitPerHour / 60).toFixed(2)}</span>
                </p>
                <p className="text-muted-foreground">
                  Per day: <span className="font-semibold">${(kpis.profitPerHour * 8).toFixed(0)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Stream */}
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
                      <p className="font-medium truncate">{txn.narration}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{txn.accountName}</span>
                        {txn.autoClassified && (
                          <span className="text-xs px-1.5 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded">
                            Auto {txn.confidenceScore}%
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

        {/* Quick Insights Banner */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Zap className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">AI Insights</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Your profit per hour increased by 15% this week</li>
                <li>• 3 transactions need review in the Review & Decide queue</li>
                <li>• Office supplies spending is 22% above budget this month</li>
                <li>• Cash runway: 105 days at current burn rate</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
