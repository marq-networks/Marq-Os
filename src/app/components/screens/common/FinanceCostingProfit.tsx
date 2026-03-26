import { PageLayout } from '../../shared/PageLayout';
import { BarChartComponent, DonutChartComponent } from '../../shared/Charts';
import { useExecutionOS } from '../../../contexts/ExecutionOSContext';
import { useFinanceData } from '../../../services/hooks';
import {
  TrendingUp, DollarSign, BarChart3, Percent, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';

export function FinanceCostingProfit() {
  const { projects } = useExecutionOS();
  const { payrollRuns } = useFinanceData();

  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalSpent = projects.reduce((s, p) => s + p.spent, 0);
  const margin = totalBudget > 0 ? Math.round(((totalBudget - totalSpent) / totalBudget) * 100) : 0;

  const projectProfitData = projects.map(p => ({
    name: p.code,
    budget: p.budget / 1000,
    spent: p.spent / 1000,
    profit: (p.budget - p.spent) / 1000,
  }));

  const riskData = [
    { name: 'Low Risk', value: projects.filter(p => p.profitRisk === 'Low' || p.profitRisk === 'None').length },
    { name: 'Medium Risk', value: projects.filter(p => p.profitRisk === 'Medium').length },
    { name: 'High Risk', value: projects.filter(p => p.profitRisk === 'High').length },
  ];

  const deptCostData = ['Engineering', 'Marketing', 'Design', 'Product', 'Sales'].map(dept => {
    const deptProjects = projects.filter(p => p.department === dept);
    return {
      name: dept.substring(0, 6),
      cost: deptProjects.reduce((s, p) => s + p.spent, 0) / 1000,
      budget: deptProjects.reduce((s, p) => s + p.budget, 0) / 1000,
    };
  }).filter(d => d.budget > 0);

  const latestPayroll = payrollRuns[0]?.totalGross || 0;
  const fmt = (v: number) => `$${(v / 1000).toFixed(0)}K`;

  return (
    <PageLayout
      title="Costing & Profit Analysis"
      description="Project costing breakdown, profit margins, and budget utilization"
      kpis={[
        { title: 'Total Budget', value: fmt(totalBudget), change: `${projects.length} projects`, changeType: 'neutral', icon: <DollarSign className="h-5 w-5" /> },
        { title: 'Total Spent', value: fmt(totalSpent), change: `${Math.round((totalSpent / totalBudget) * 100)}% utilized`, changeType: totalSpent <= totalBudget * 0.8 ? 'positive' : 'warning', icon: <ArrowDownRight className="h-5 w-5" /> },
        { title: 'Gross Margin', value: `${margin}%`, changeType: margin >= 20 ? 'positive' : 'danger', icon: <Percent className="h-5 w-5" /> },
        { title: 'Monthly Payroll', value: fmt(latestPayroll), change: 'Largest cost center', changeType: 'neutral', icon: <TrendingUp className="h-5 w-5" /> },
      ]}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-medium mb-4">Budget vs Spent by Project ($K)</h3>
            <BarChartComponent data={projectProfitData} dataKey="spent" xAxisKey="name" height={280} />
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-medium mb-4">Profit Risk Distribution</h3>
            <DonutChartComponent data={riskData} dataKey="value" nameKey="name" height={280} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-medium mb-4">Cost by Department ($K)</h3>
            <BarChartComponent data={deptCostData} dataKey="cost" xAxisKey="name" height={260} />
          </div>

          {/* Project P&L table */}
          <div className="rounded-lg border border-border bg-card">
            <div className="p-4 border-b border-border">
              <h3 className="font-medium">Project P&L Summary</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-2 text-left text-xs text-muted-foreground">Project</th>
                    <th className="px-4 py-2 text-right text-xs text-muted-foreground">Budget</th>
                    <th className="px-4 py-2 text-right text-xs text-muted-foreground">Spent</th>
                    <th className="px-4 py-2 text-right text-xs text-muted-foreground">Margin</th>
                    <th className="px-4 py-2 text-center text-xs text-muted-foreground">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(p => {
                    const pMargin = p.budget > 0 ? Math.round(((p.budget - p.spent) / p.budget) * 100) : 0;
                    return (
                      <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                        <td className="px-4 py-2.5">
                          <span className="text-xs font-mono text-primary">{p.code}</span>
                          <span className="text-sm ml-2">{p.name}</span>
                        </td>
                        <td className="px-4 py-2.5 text-right text-sm tabular-nums">{fmt(p.budget)}</td>
                        <td className="px-4 py-2.5 text-right text-sm tabular-nums">{fmt(p.spent)}</td>
                        <td className={`px-4 py-2.5 text-right text-sm tabular-nums font-medium ${pMargin >= 20 ? 'text-green-600' : pMargin >= 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {pMargin}%
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${
                            p.profitRisk === 'High' ? 'bg-red-500/10 text-red-700' :
                            p.profitRisk === 'Medium' ? 'bg-yellow-500/10 text-yellow-700' :
                            'bg-green-500/10 text-green-700'
                          }`}>
                            {p.profitRisk}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
