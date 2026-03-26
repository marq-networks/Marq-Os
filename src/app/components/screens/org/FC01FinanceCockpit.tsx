import { PageLayout } from '../../shared/PageLayout';
import { Card3D } from '../../shared/Card3D';
import { StatusBadge } from '../../shared/StatusBadge';
import { Breadcrumb } from '../../shared/Breadcrumb';
import { useRouter } from '../../router';
import { useLedger } from '../../../stores/ledgerStore';
import { FinanceTopTabs } from '../../../finance/components/FinanceTopTabs';
import { 
  Wallet, 
  DollarSign, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Users,
  Receipt,
  Zap,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  mockCashAccounts,
  mockPLSummary,
  currentMonthPL,
  mockProjectBurn,
  totalBurnPerDay,
  averageRiskScore,
  mockPayrollByDepartment,
  totalMonthlyPayroll,
  pendingReimbursements,
  paidReimbursements,
  totalPendingAmount,
  totalPaidAmount,
  mockAIAlerts,
  activeAlerts,
  highSeverityAlerts
} from '../../../data/mockFinanceData';

export function FC01FinanceCockpit() {
  const { navigate } = useRouter();
  const { currentBalance } = useLedger();

  // Calculate totals
  const totalCash = currentBalance; // Read from ledger instead of mock accounts
  const totalBankBalance = mockCashAccounts
    .filter(acc => acc.type === 'bank')
    .reduce((sum, acc) => sum + acc.balance, 0);
  const totalWalletBalance = mockCashAccounts
    .filter(acc => acc.type === 'wallet' || acc.type === 'cash')
    .reduce((sum, acc) => sum + acc.balance, 0);

  // High risk projects
  const highRiskProjects = mockProjectBurn.filter(p => p.riskScore >= 70);

  // Chart colors
  const COLORS = {
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    purple: '#8b5cf6',
    teal: '#14b8a6'
  };

  // Pie chart colors for departments
  const DEPT_COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ec4899', '#6366f1'];

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <PageLayout
      title="Finance Cockpit"
      description="Live command center for financial operations and intelligence"
    >
      <Breadcrumb items={[
        { label: 'Finance', path: '/org/finance/cockpit' },
        { label: 'Cockpit' }
      ]} />
      <FinanceTopTabs />
      <div className="space-y-6">
        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TOP ROW: KEY METRICS */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Cash Position */}
          <Card3D>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Total Cash Position</p>
                <p className="text-2xl font-bold">{formatCurrency(totalCash)}</p>
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +5.2% from last month
                </p>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/10">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </Card3D>

          {/* Monthly Profit */}
          <Card3D>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Net Profit (Jan)</p>
                <p className="text-2xl font-bold">{formatCurrency(currentMonthPL.netProfit)}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Margin: <span className="text-green-600 font-semibold">{formatPercent(currentMonthPL.marginPercent)}</span>
                </p>
              </div>
              <div className="p-2 rounded-lg bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </Card3D>

          {/* Burn Rate */}
          <Card3D className="border-orange-500/30">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Daily Burn Rate</p>
                <p className="text-2xl font-bold">{formatCurrency(totalBurnPerDay)}</p>
                <p className="text-xs text-orange-600 mt-2">
                  Risk Score: {averageRiskScore}/100
                </p>
              </div>
              <div className="p-2 rounded-lg bg-orange-500/10">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </Card3D>

          {/* Alerts */}
          <Card3D className="border-red-500/30">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Active Alerts</p>
                <p className="text-2xl font-bold">{activeAlerts.length}</p>
                <p className="text-xs text-red-600 mt-2">
                  {highSeverityAlerts.length} high severity
                </p>
              </div>
              <div className="p-2 rounded-lg bg-red-500/10">
                <Zap className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </Card3D>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* WIDGET 1: CASH POSITION */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card3D>
            <div className="mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Cash Position
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Real-time balance from ledger • <button onClick={() => navigate('/org/finance/ledger-control')} className="text-primary hover:underline">View Full Ledger →</button>
              </p>
            </div>

            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                  <p className="text-xs text-muted-foreground">Bank Accounts</p>
                  <p className="text-xl font-bold mt-1">{formatCurrency(totalBankBalance)}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                  <p className="text-xs text-muted-foreground">Wallets & Cash</p>
                  <p className="text-xl font-bold mt-1">{formatCurrency(totalWalletBalance)}</p>
                </div>
              </div>

              {/* Account Breakdown */}
              <div className="space-y-2">
                {mockCashAccounts.map(account => (
                  <div key={account.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        account.type === 'bank' ? 'bg-blue-500/10' :
                        account.type === 'wallet' ? 'bg-purple-500/10' :
                        'bg-green-500/10'
                      }`}>
                        {account.type === 'bank' ? <DollarSign className="h-4 w-4 text-blue-600" /> :
                         account.type === 'wallet' ? <Wallet className="h-4 w-4 text-purple-600" /> :
                         <Wallet className="h-4 w-4 text-green-600" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{account.name}</p>
                        <p className="text-xs text-muted-foreground">{account.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatCurrency(account.balance)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card3D>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* WIDGET 2: PROFIT & LOSS SUMMARY */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <Card3D>
            <div className="mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Profit & Loss Trend
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                6-month revenue, cost, and profit trajectory
              </p>
            </div>

            <div className="space-y-4">
              {/* Current Month Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(currentMonthPL.revenue)}</p>
                </div>
                <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                  <p className="text-xs text-muted-foreground">Cost</p>
                  <p className="text-lg font-bold text-red-600">{formatCurrency(currentMonthPL.cost)}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                  <p className="text-xs text-muted-foreground">Profit</p>
                  <p className="text-lg font-bold text-blue-600">{formatCurrency(currentMonthPL.netProfit)}</p>
                </div>
              </div>

              {/* Chart */}
              <div className="h-[200px] min-h-[200px]">
                <ResponsiveContainer width="100%" height={200} minWidth={200} minHeight={200}>
                  <AreaChart data={mockPLSummary}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={COLORS.success} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.danger} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={COLORS.danger} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis 
                      dataKey="period" 
                      tick={{ fontSize: 11 }}
                      tickFormatter={(value) => {
                        const [year, month] = value.split('-');
                        return `${month}/${year.slice(2)}`;
                      }}
                    />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(value) => `$${value/1000}k`} />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ fontSize: 12 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="revenue" stroke={COLORS.success} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                    <Area type="monotone" dataKey="cost" stroke={COLORS.danger} fillOpacity={1} fill="url(#colorCost)" name="Cost" />
                    <Area type="monotone" dataKey="netProfit" stroke={COLORS.primary} fillOpacity={1} fill="url(#colorProfit)" name="Net Profit" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card3D>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* WIDGET 3: BURN & RISK */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <Card3D className="border-orange-500/30">
          <div className="mb-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Burn & Risk Analysis
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Project burn rates and risk scoring
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Burn Rate Chart */}
            <div className="min-h-[240px]">
              <p className="text-sm font-medium mb-3">Daily Burn by Project</p>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height={240} minWidth={200} minHeight={240}>
                  <BarChart data={mockProjectBurn}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis 
                      dataKey="projectName" 
                      tick={{ fontSize: 10 }}
                      angle={-20}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(value) => `$${value}`} />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ fontSize: 12 }}
                    />
                    <Bar dataKey="burnPerDay" fill={COLORS.warning} name="Burn/Day" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Risk Score List */}
            <div>
              <p className="text-sm font-medium mb-3">Risk Scores (0-100)</p>
              <div className="space-y-2">
                {mockProjectBurn
                  .sort((a, b) => b.riskScore - a.riskScore)
                  .map(project => {
                    const riskLevel = project.riskScore >= 70 ? 'high' : project.riskScore >= 40 ? 'medium' : 'low';
                    const riskColor = riskLevel === 'high' ? 'text-red-600 bg-red-500/10' :
                                     riskLevel === 'medium' ? 'text-orange-600 bg-orange-500/10' :
                                     'text-green-600 bg-green-500/10';
                    
                    return (
                      <div key={project.projectId} className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{project.projectName}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-xs text-muted-foreground">
                              Burn: {formatCurrency(project.totalBurn)} / {formatCurrency(project.budget)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {project.daysRemaining}d left
                            </p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full ${riskColor} font-semibold text-sm`}>
                          {project.riskScore}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </Card3D>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* WIDGET 4: PAYROLL LOAD + WIDGET 5: REIMBURSEMENTS */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* WIDGET 4: Payroll Load */}
          <Card3D>
            <div className="mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Payroll Load
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Monthly payroll distribution by department
              </p>
            </div>

            <div className="space-y-4">
              {/* Total */}
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-xs text-muted-foreground">Total Monthly Payroll</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(totalMonthlyPayroll)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Across {mockPayrollByDepartment.reduce((sum, d) => sum + d.employeeCount, 0)} employees
                </p>
              </div>

              {/* Pie Chart */}
              <div className="flex items-center gap-4 min-h-[180px]">
                <div className="h-[180px] w-[180px] flex-shrink-0">
                  <PieChart width={180} height={180}>
                    <Pie
                      data={mockPayrollByDepartment}
                      dataKey="monthlySalary"
                      nameKey="departmentName"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {mockPayrollByDepartment.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={DEPT_COLORS[index % DEPT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ fontSize: 12 }}
                    />
                  </PieChart>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-2">
                  {mockPayrollByDepartment.map((dept, index) => (
                    <div key={dept.departmentId} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-sm flex-shrink-0" 
                          style={{ backgroundColor: DEPT_COLORS[index % DEPT_COLORS.length] }}
                        />
                        <span>{dept.departmentName}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">{formatCurrency(dept.monthlySalary)}</span>
                        <span className="text-muted-foreground ml-2">({dept.employeeCount})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card3D>

          {/* WIDGET 5: Reimbursements */}
          <Card3D>
            <div className="mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Reimbursements
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Pending and paid employee reimbursements
              </p>
            </div>

            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20">
                  <p className="text-xs text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">{pendingReimbursements.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatCurrency(totalPendingAmount)}</p>
                </div>
                <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                  <p className="text-xs text-muted-foreground">Paid (This Month)</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{paidReimbursements.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatCurrency(totalPaidAmount)}</p>
                </div>
              </div>

              {/* Pending List */}
              <div>
                <p className="text-sm font-medium mb-2">Recent Pending</p>
                <div className="space-y-2">
                  {pendingReimbursements.slice(0, 4).map(reimb => (
                    <div key={reimb.id} className="flex items-center justify-between p-2 rounded-lg bg-accent/50">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{reimb.employeeName}</p>
                        <p className="text-xs text-muted-foreground">{reimb.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{formatCurrency(reimb.amount)}</p>
                        <StatusBadge type="warning" className="text-xs mt-1">
                          {reimb.status}
                        </StatusBadge>
                      </div>
                    </div>
                  ))}
                </div>
                {pendingReimbursements.length > 4 && (
                  <button 
                    onClick={() => navigate('/org/finance/reimbursements')}
                    className="text-xs text-primary hover:underline mt-2"
                  >
                    View all {pendingReimbursements.length} pending →
                  </button>
                )}
              </div>
            </div>
          </Card3D>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* WIDGET 6: AI ALERTS */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <Card3D className="border-yellow-500/30">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                AI Financial Alerts
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Intelligent warnings and margin monitoring
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge type="error">{highSeverityAlerts.length} High</StatusBadge>
              <StatusBadge type="warning">{activeAlerts.length - highSeverityAlerts.length} Medium</StatusBadge>
            </div>
          </div>

          <div className="space-y-3">
            {activeAlerts.map(alert => {
              const severityConfig = {
                high: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-500/10', border: 'border-red-500/30' },
                medium: { icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
                low: { icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-500/10', border: 'border-blue-500/30' }
              };
              
              const config = severityConfig[alert.severity];
              const Icon = config.icon;

              return (
                <div 
                  key={alert.id} 
                  className={`p-4 rounded-lg border ${config.bg} ${config.border}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${config.bg} flex-shrink-0`}>
                      <Icon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-sm">{alert.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                        </div>
                        <StatusBadge 
                          type={alert.severity === 'high' ? 'error' : alert.severity === 'medium' ? 'warning' : 'neutral'}
                          className="ml-3"
                        >
                          {alert.severity.toUpperCase()}
                        </StatusBadge>
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(alert.timestamp).toLocaleString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                        <button className="text-xs text-primary hover:underline">
                          View Details
                        </button>
                        <button className="text-xs text-muted-foreground hover:text-foreground">
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card3D>

        {/* System Notice */}
        <div className="bg-accent/50 border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Real-Time Intelligence:</strong> This cockpit displays live financial metrics from all connected systems. 
            All data is read-only in this view. Use Quick Actions above or navigate to specific modules to make changes. 
            AI alerts refresh every 15 minutes.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}