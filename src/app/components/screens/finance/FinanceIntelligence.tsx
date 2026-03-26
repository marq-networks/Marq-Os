/**
 * ⛔ DEPRECATED — Phase 14 gap closure (FL-001)
 * This file is no longer rendered by any route or nav entry.
 * Use FC10FinanceIntelligence (screens/org/) for all finance intelligence functionality.
 * common/FinanceIntelligence.tsx now re-exports FC10FinanceIntelligence.
 * This file will be removed in Phase 15.
 */
import { PageLayout } from '../../shared/PageLayout';
import { Card3D } from '../../shared/Card3D';
import { StatusBadge } from '../../shared/StatusBadge';
import { Breadcrumb } from '../../shared/Breadcrumb';
import { useLedger } from '../../../stores/ledgerStore';
import { useRouter } from '../../router';
import { FinanceTopTabs } from '../../../finance/components/FinanceTopTabs';
import { 
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Activity,
  Target,
  Zap,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Wallet,
  Users,
  ArrowRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';
import {
  calculateCashflowHealth,
  detectRiskSignals,
  generateAIAlerts,
  calculateProjections
} from '../../../utils/financialIntelligence';

export function FinanceIntelligence() {
  const { entries } = useLedger();
  const { navigate } = useRouter();

  // Calculate all intelligence metrics (auto-updates when ledger changes)
  const intelligence = useMemo(() => {
    const cashflowHealth = calculateCashflowHealth(entries);
    const riskSignals = detectRiskSignals(entries);
    const aiAlerts = generateAIAlerts(entries, cashflowHealth, riskSignals);
    const { projections30, projections60, projections90, exhaustion } = calculateProjections(entries);

    return {
      cashflowHealth,
      riskSignals,
      aiAlerts,
      projections30,
      projections60,
      projections90,
      exhaustion
    };
  }, [entries]);

  const formatCurrency = (value: number) => {
    return `$${Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getSeverityConfig = (severity: 'critical' | 'high' | 'medium' | 'low') => {
    const configs = {
      critical: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-500/10', border: 'border-red-500/30', badge: 'error' as const },
      high: { icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-500/10', border: 'border-orange-500/30', badge: 'warning' as const },
      medium: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', badge: 'warning' as const },
      low: { icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-500/10', border: 'border-blue-500/30', badge: 'info' as const }
    };
    return configs[severity];
  };

  // Prepare projection chart data
  const projectionChartData = [
    {
      period: 'Today',
      best: intelligence.cashflowHealth.currentBalance,
      worst: intelligence.cashflowHealth.currentBalance,
      likely: intelligence.cashflowHealth.currentBalance
    },
    {
      period: '30d',
      best: intelligence.projections30.bestCase.endingBalance,
      worst: intelligence.projections30.worstCase.endingBalance,
      likely: intelligence.projections30.mostLikely.endingBalance
    },
    {
      period: '60d',
      best: intelligence.projections60.bestCase.endingBalance,
      worst: intelligence.projections60.worstCase.endingBalance,
      likely: intelligence.projections60.mostLikely.endingBalance
    },
    {
      period: '90d',
      best: intelligence.projections90.bestCase.endingBalance,
      worst: intelligence.projections90.worstCase.endingBalance,
      likely: intelligence.projections90.mostLikely.endingBalance
    }
  ];

  return (
    <PageLayout
      title="Financial Intelligence"
      description="AI-powered financial analysis, risk detection, and smart projections"
    >
      <Breadcrumb items={[
        { label: 'Finance', path: '/finance/cockpit' },
        { label: 'Intelligence' }
      ]} />
      <FinanceTopTabs />
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card3D>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">AI Alerts</p>
                <p className="text-2xl font-bold">{intelligence.aiAlerts.length}</p>
                <p className="text-xs text-orange-600 mt-2">
                  {intelligence.aiAlerts.filter(a => a.severity === 'critical' || a.severity === 'high').length} high priority
                </p>
              </div>
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </Card3D>

          <Card3D>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Risk Signals</p>
                <p className="text-2xl font-bold">{intelligence.riskSignals.length}</p>
                <p className="text-xs text-muted-foreground mt-2">Active detections</p>
              </div>
              <div className="p-2 rounded-lg bg-red-500/10">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </Card3D>

          <Card3D>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Cash Runway</p>
                <p className="text-2xl font-bold">
                  {intelligence.cashflowHealth.runwayMonths === Infinity 
                    ? '∞' 
                    : intelligence.cashflowHealth.runwayMonths.toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">Months remaining</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </Card3D>

          <Card3D>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Ledger Entries</p>
                <p className="text-2xl font-bold">{entries.length}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  <button onClick={() => navigate('/finance/ledger')} className="text-primary hover:underline">
                    View Ledger →
                  </button>
                </p>
              </div>
              <div className="p-2 rounded-lg bg-green-500/10">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </Card3D>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* 1. CASHFLOW HEALTH */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <Card3D>
          <div className="mb-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Cashflow Health
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Real-time metrics computed from ledger entries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Burn Rate */}
            <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <p className="text-xs font-semibold text-muted-foreground">Monthly Burn Rate</p>
              </div>
              <p className="text-2xl font-bold text-red-600">
                {intelligence.cashflowHealth.monthlyBurnRate > 0 ? '-' : '+'}{formatCurrency(intelligence.cashflowHealth.monthlyBurnRate)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Expenses - Revenue</p>
            </div>

            {/* Runway */}
            <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <p className="text-xs font-semibold text-muted-foreground">Cash Runway</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {intelligence.cashflowHealth.runwayMonths === Infinity 
                  ? '∞' 
                  : intelligence.cashflowHealth.runwayMonths.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Months remaining</p>
            </div>

            {/* Revenue Velocity */}
            <div className={`p-4 rounded-lg border ${
              intelligence.cashflowHealth.revenueVelocity >= 0 
                ? 'bg-green-500/5 border-green-500/20' 
                : 'bg-red-500/5 border-red-500/20'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {intelligence.cashflowHealth.revenueVelocity >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <p className="text-xs font-semibold text-muted-foreground">Revenue Velocity</p>
              </div>
              <p className={`text-2xl font-bold ${
                intelligence.cashflowHealth.revenueVelocity >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {intelligence.cashflowHealth.revenueVelocity > 0 ? '+' : ''}{formatPercent(intelligence.cashflowHealth.revenueVelocity)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Month-over-month</p>
            </div>

            {/* Expense Growth */}
            <div className={`p-4 rounded-lg border ${
              intelligence.cashflowHealth.expenseGrowth <= 10 
                ? 'bg-green-500/5 border-green-500/20' 
                : 'bg-orange-500/5 border-orange-500/20'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                <p className="text-xs font-semibold text-muted-foreground">Expense Growth</p>
              </div>
              <p className={`text-2xl font-bold ${
                intelligence.cashflowHealth.expenseGrowth <= 10 ? 'text-green-600' : 'text-orange-600'
              }`}>
                +{formatPercent(intelligence.cashflowHealth.expenseGrowth)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Month-over-month</p>
            </div>

            {/* Payroll % of Revenue */}
            <div className={`p-4 rounded-lg border ${
              intelligence.cashflowHealth.payrollPercentOfRevenue <= 60 
                ? 'bg-green-500/5 border-green-500/20' 
                : 'bg-red-500/5 border-red-500/20'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-purple-600" />
                <p className="text-xs font-semibold text-muted-foreground">Payroll % Revenue</p>
              </div>
              <p className={`text-2xl font-bold ${
                intelligence.cashflowHealth.payrollPercentOfRevenue <= 60 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatPercent(intelligence.cashflowHealth.payrollPercentOfRevenue)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Healthy: 40-60%</p>
            </div>
          </div>
        </Card3D>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* 2. RISK RADAR */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <Card3D className="border-orange-500/30">
          <div className="mb-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-600" />
              Risk Radar
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Auto-detected financial risk signals from ledger analysis
            </p>
          </div>

          {intelligence.riskSignals.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <p className="text-lg font-semibold text-green-600">All Clear</p>
              <p className="text-sm text-muted-foreground mt-1">No active risk signals detected</p>
            </div>
          ) : (
            <div className="space-y-3">
              {intelligence.riskSignals.map(risk => {
                const config = getSeverityConfig(risk.severity);
                const Icon = config.icon;

                return (
                  <div 
                    key={risk.id}
                    className={`p-4 rounded-lg border ${config.bg} ${config.border}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${config.bg} flex-shrink-0`}>
                        <Icon className={`h-5 w-5 ${config.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-sm">{risk.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{risk.description}</p>
                          </div>
                          <StatusBadge type={config.badge} className="ml-3">
                            {risk.severity.toUpperCase()}
                          </StatusBadge>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Type: {risk.type.replace(/_/g, ' ')}</span>
                          <span>•</span>
                          <span>Detected: {new Date(risk.detectedAt).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card3D>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* 3. AI FINANCIAL ALERTS */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <Card3D className="border-purple-500/30">
          <div className="mb-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              AI Financial Alerts
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Intelligent warnings with cause, impact, and suggested actions
            </p>
          </div>

          {intelligence.aiAlerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <p className="text-lg font-semibold text-green-600">Financial Health Optimal</p>
              <p className="text-sm text-muted-foreground mt-1">No AI alerts at this time</p>
            </div>
          ) : (
            <div className="space-y-4">
              {intelligence.aiAlerts.map(alert => {
                const config = getSeverityConfig(alert.severity);
                const Icon = config.icon;

                return (
                  <div 
                    key={alert.id}
                    className={`p-5 rounded-lg border ${config.bg} ${config.border}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${config.bg} flex-shrink-0`}>
                        <Icon className={`h-6 w-6 ${config.color}`} />
                      </div>
                      <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-bold text-base">{alert.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <StatusBadge type={config.badge}>
                                {alert.severity.toUpperCase()}
                              </StatusBadge>
                              <span className="text-xs text-muted-foreground">
                                {alert.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Cause, Impact, Action */}
                        <div className="space-y-3">
                          <div className="bg-background/50 rounded-lg p-3">
                            <p className="text-xs font-semibold text-muted-foreground mb-1">🔍 CAUSE</p>
                            <p className="text-sm">{alert.cause}</p>
                          </div>
                          <div className="bg-background/50 rounded-lg p-3">
                            <p className="text-xs font-semibold text-muted-foreground mb-1">⚠️ IMPACT</p>
                            <p className="text-sm">{alert.impact}</p>
                          </div>
                          <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                            <p className="text-xs font-semibold text-primary mb-1">💡 SUGGESTED ACTION</p>
                            <p className="text-sm font-medium">{alert.suggestedAction}</p>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                          <button className="text-xs text-primary hover:underline font-medium">
                            Take Action →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card3D>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* 4. SMART PROJECTIONS */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Projection Chart */}
          <Card3D>
            <div className="mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Smart Projections
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                30 / 60 / 90 day forecasts based on historical trends
              </p>
            </div>

            <div className="h-[300px] mb-4">
              <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
                <LineChart data={projectionChartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="best" stroke="#10b981" strokeWidth={2} name="Best Case" />
                  <Line type="monotone" dataKey="likely" stroke="#3b82f6" strokeWidth={3} name="Most Likely" />
                  <Line type="monotone" dataKey="worst" stroke="#ef4444" strokeWidth={2} name="Worst Case" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded bg-green-500/5 border border-green-500/20">
                <p className="text-muted-foreground">Best Case</p>
                <p className="font-semibold text-green-600">Revenue +20%, Expenses -10%</p>
              </div>
              <div className="p-2 rounded bg-blue-500/5 border border-blue-500/20">
                <p className="text-muted-foreground">Most Likely</p>
                <p className="font-semibold text-blue-600">Current trends continue</p>
              </div>
              <div className="p-2 rounded bg-red-500/5 border border-red-500/20">
                <p className="text-muted-foreground">Worst Case</p>
                <p className="font-semibold text-red-600">Revenue -20%, Expenses +10%</p>
              </div>
            </div>
          </Card3D>

          {/* Projection Details */}
          <Card3D>
            <div className="mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Projection Details
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Detailed forecasts for each scenario
              </p>
            </div>

            <div className="space-y-4">
              {/* 30 Day */}
              <div className="p-4 rounded-lg bg-accent/30 border border-border">
                <p className="font-semibold mb-3 flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  30-Day Forecast
                </p>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground mb-1">Best</p>
                    <p className="font-bold text-green-600">{formatCurrency(intelligence.projections30.bestCase.endingBalance)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Likely</p>
                    <p className="font-bold text-blue-600">{formatCurrency(intelligence.projections30.mostLikely.endingBalance)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Worst</p>
                    <p className="font-bold text-red-600">{formatCurrency(intelligence.projections30.worstCase.endingBalance)}</p>
                  </div>
                </div>
              </div>

              {/* 60 Day */}
              <div className="p-4 rounded-lg bg-accent/30 border border-border">
                <p className="font-semibold mb-3 flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  60-Day Forecast
                </p>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground mb-1">Best</p>
                    <p className="font-bold text-green-600">{formatCurrency(intelligence.projections60.bestCase.endingBalance)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Likely</p>
                    <p className="font-bold text-blue-600">{formatCurrency(intelligence.projections60.mostLikely.endingBalance)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Worst</p>
                    <p className="font-bold text-red-600">{formatCurrency(intelligence.projections60.worstCase.endingBalance)}</p>
                  </div>
                </div>
              </div>

              {/* 90 Day */}
              <div className="p-4 rounded-lg bg-accent/30 border border-border">
                <p className="font-semibold mb-3 flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  90-Day Forecast
                </p>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground mb-1">Best</p>
                    <p className="font-bold text-green-600">{formatCurrency(intelligence.projections90.bestCase.endingBalance)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Likely</p>
                    <p className="font-bold text-blue-600">{formatCurrency(intelligence.projections90.mostLikely.endingBalance)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Worst</p>
                    <p className="font-bold text-red-600">{formatCurrency(intelligence.projections90.worstCase.endingBalance)}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card3D>
        </div>

        {/* Cash Exhaustion Warning */}
        {intelligence.exhaustion.willExhaust && (
          <Card3D className="border-red-500/50 bg-red-500/5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-red-500/20">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg text-red-600 mb-2">⚠️ Cash Exhaustion Alert</h4>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Cash Exhaustion Date:</strong> {' '}
                    {intelligence.exhaustion.exhaustionDate 
                      ? new Date(intelligence.exhaustion.exhaustionDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      : 'N/A'}
                  </p>
                  <p className="text-sm">
                    <strong>Days Until Exhaustion:</strong> {intelligence.exhaustion.daysUntilExhaustion} days
                  </p>
                  <p className="text-sm">
                    <strong>Average Daily Burn:</strong> {formatCurrency(intelligence.exhaustion.averageDailyBurn)}/day
                  </p>
                  <div className="mt-4 p-3 bg-background rounded-lg">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">💡 IMMEDIATE ACTION REQUIRED</p>
                    <p className="text-sm font-medium">
                      Secure additional funding, reduce burn rate immediately, or accelerate revenue generation to avoid cash depletion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card3D>
        )}

        {/* System Notice */}
        <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Brain className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-purple-600 mb-1">AI Intelligence Layer</p>
              <p className="text-xs text-muted-foreground">
                All metrics, alerts, and projections are computed in real-time from the ledger. 
                This layer is <strong>read-only</strong> and never modifies financial data. 
                Intelligence automatically updates when ledger entries change. 
                Projections use historical trends from the last 60 days of ledger activity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}