// ═══════════════════════════════════════════════════════════════════════════
// ORG-F-ENGINE-05 — CLIENT PROFITABILITY INDEX
// ═══════════════════════════════════════════════════════════════════════════
// Creates rolling profit index per client with revenue, cost, profit/hour, risk score
// Version: 1.0 | Build: ENGINE-05

import { ClientProfitabilityData } from './types';

interface ClientTransaction {
  clientId: string;
  date: string;
  type: 'revenue' | 'cost';
  amount: number;
  hours?: number;
}

interface ClientMetrics {
  revenue: number;
  cost: number;
  hours: number;
  transactionCount: number;
}

/**
 * Calculate client metrics for a specific time period
 */
function calculateClientMetrics(
  clientId: string,
  transactions: ClientTransaction[],
  daysBack: number
): ClientMetrics {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);

  const relevantTransactions = transactions.filter((txn) => {
    const txnDate = new Date(txn.date);
    return txn.clientId === clientId && txnDate >= cutoffDate;
  });

  const revenue = relevantTransactions
    .filter((txn) => txn.type === 'revenue')
    .reduce((sum, txn) => sum + txn.amount, 0);

  const cost = relevantTransactions
    .filter((txn) => txn.type === 'cost')
    .reduce((sum, txn) => sum + txn.amount, 0);

  const hours = relevantTransactions
    .reduce((sum, txn) => sum + (txn.hours || 0), 0);

  return {
    revenue,
    cost,
    hours,
    transactionCount: relevantTransactions.length,
  };
}

/**
 * Calculate risk score for client profitability
 * Based on margin trends, cost volatility, and payment patterns
 */
function calculateClientRiskScore(
  metrics30d: ClientMetrics,
  metrics60d: ClientMetrics,
  metrics90d: ClientMetrics
): { score: number; level: 'low' | 'medium' | 'high' } {
  let riskScore = 0;

  // Factor 1: Margin trend (40% weight)
  const margin30d = metrics30d.revenue > 0 ? ((metrics30d.revenue - metrics30d.cost) / metrics30d.revenue) * 100 : 0;
  const margin60d = metrics60d.revenue > 0 ? ((metrics60d.revenue - metrics60d.cost) / metrics60d.revenue) * 100 : 0;
  const margin90d = metrics90d.revenue > 0 ? ((metrics90d.revenue - metrics90d.cost) / metrics90d.revenue) * 100 : 0;

  const marginTrend = margin30d - margin90d;
  if (marginTrend < -10) riskScore += 40;
  else if (marginTrend < -5) riskScore += 30;
  else if (marginTrend < 0) riskScore += 20;
  else if (marginTrend < 5) riskScore += 10;

  // Factor 2: Profitability level (30% weight)
  if (margin30d < 0) riskScore += 30;
  else if (margin30d < 10) riskScore += 20;
  else if (margin30d < 20) riskScore += 10;

  // Factor 3: Revenue volatility (20% weight)
  const revenueVolatility = Math.abs(metrics30d.revenue - metrics60d.revenue) / (metrics60d.revenue || 1);
  if (revenueVolatility > 0.5) riskScore += 20;
  else if (revenueVolatility > 0.3) riskScore += 15;
  else if (revenueVolatility > 0.1) riskScore += 10;

  // Factor 4: Activity level (10% weight)
  if (metrics30d.transactionCount === 0) riskScore += 10;
  else if (metrics30d.transactionCount < 5) riskScore += 5;

  const level = riskScore < 30 ? 'low' : riskScore < 60 ? 'medium' : 'high';

  return { score: riskScore, level };
}

/**
 * Compute client profitability data with rolling metrics
 */
export function computeClientProfitability(
  clientId: string,
  clientName: string,
  transactions: ClientTransaction[]
): ClientProfitabilityData {
  // Calculate metrics for different time periods
  const metrics30d = calculateClientMetrics(clientId, transactions, 30);
  const metrics60d = calculateClientMetrics(clientId, transactions, 60);
  const metrics90d = calculateClientMetrics(clientId, transactions, 90);

  // Calculate profit for each period
  const profit30d = metrics30d.revenue - metrics30d.cost;
  const profit60d = metrics60d.revenue - metrics60d.cost;
  const profit90d = metrics90d.revenue - metrics90d.cost;

  // Calculate profit per hour
  const profitPerHour30d = metrics30d.hours > 0 ? profit30d / metrics30d.hours : 0;
  const profitPerHour60d = metrics60d.hours > 0 ? profit60d / metrics60d.hours : 0;
  const profitPerHour90d = metrics90d.hours > 0 ? profit90d / metrics90d.hours : 0;

  // Calculate risk
  const { score: riskScore, level: riskLevel } = calculateClientRiskScore(
    metrics30d,
    metrics60d,
    metrics90d
  );

  return {
    clientId,
    clientName,
    revenue30d: metrics30d.revenue,
    revenue60d: metrics60d.revenue,
    revenue90d: metrics90d.revenue,
    cost30d: metrics30d.cost,
    cost60d: metrics60d.cost,
    cost90d: metrics90d.cost,
    profit30d,
    profit60d,
    profit90d,
    profitPerHour30d,
    profitPerHour60d,
    profitPerHour90d,
    riskScore,
    riskLevel,
    feedsReports: true,
    feedsQuoteChecker: true,
    feedsLeakDetection: riskLevel === 'high',
    lastComputed: new Date().toISOString(),
  };
}

/**
 * Get client profitability ranking
 */
export function rankClientsByProfitability(
  clientsData: ClientProfitabilityData[],
  metric: 'profit30d' | 'profitPerHour30d' | 'revenue30d' = 'profit30d'
): ClientProfitabilityData[] {
  return [...clientsData].sort((a, b) => b[metric] - a[metric]);
}

/**
 * Identify at-risk clients
 */
export function identifyAtRiskClients(
  clientsData: ClientProfitabilityData[]
): ClientProfitabilityData[] {
  return clientsData.filter((client) => client.riskLevel === 'high' || client.profit30d < 0);
}

/**
 * Calculate client lifetime value (LTV)
 */
export function calculateClientLTV(
  clientData: ClientProfitabilityData,
  estimatedLifetimeMonths: number = 12
): {
  ltv: number;
  monthlyValue: number;
  estimatedLifetimeMonths: number;
} {
  // Use 30-day profit as monthly value
  const monthlyValue = clientData.profit30d;
  const ltv = monthlyValue * estimatedLifetimeMonths;

  return {
    ltv,
    monthlyValue,
    estimatedLifetimeMonths,
  };
}

/**
 * Get client health summary
 */
export function getClientHealthSummary(
  clientData: ClientProfitabilityData
): {
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  color: string;
  label: string;
  insights: string[];
} {
  const insights: string[] = [];
  let status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical' = 'good';
  let color = 'green';
  let label = 'Good';

  // Analyze profit trend
  if (clientData.profit30d < 0) {
    status = 'critical';
    color = 'red';
    label = 'Critical';
    insights.push('Client is unprofitable this month');
  } else if (clientData.profit30d < clientData.profit60d * 0.5) {
    status = 'poor';
    color = 'orange';
    label = 'Poor';
    insights.push('Profit declining significantly');
  } else if (clientData.profit30d > clientData.profit60d * 1.5) {
    status = 'excellent';
    color = 'green';
    label = 'Excellent';
    insights.push('Profit growing rapidly');
  }

  // Analyze risk level
  if (clientData.riskLevel === 'high') {
    if (status === 'good' || status === 'fair') {
      status = 'fair';
      color = 'yellow';
      label = 'Fair';
    }
    insights.push('High risk score detected');
  }

  // Analyze profit per hour
  if (clientData.profitPerHour30d < 10) {
    insights.push('Low profit per hour - consider rate increase');
  } else if (clientData.profitPerHour30d > 100) {
    insights.push('Excellent profit per hour');
  }

  // Analyze revenue stability
  const revenueVolatility = Math.abs(clientData.revenue30d - clientData.revenue60d) / (clientData.revenue60d || 1);
  if (revenueVolatility > 0.5) {
    insights.push('Revenue is highly volatile');
  }

  return {
    status,
    color,
    label,
    insights,
  };
}

/**
 * Compare two clients
 */
export function compareClients(
  client1: ClientProfitabilityData,
  client2: ClientProfitabilityData
): {
  profitDifference: number;
  profitPerHourDifference: number;
  riskDifference: number;
  betterClient: string;
  reason: string;
} {
  const profitDifference = client1.profit30d - client2.profit30d;
  const profitPerHourDifference = client1.profitPerHour30d - client2.profitPerHour30d;
  const riskDifference = client1.riskScore - client2.riskScore;

  let betterClient = '';
  let reason = '';

  if (profitDifference > 0 && profitPerHourDifference > 0 && riskDifference < 0) {
    betterClient = client1.clientName;
    reason = 'Higher profit, better profit/hour, and lower risk';
  } else if (profitDifference < 0 && profitPerHourDifference < 0 && riskDifference > 0) {
    betterClient = client2.clientName;
    reason = 'Higher profit, better profit/hour, and lower risk';
  } else if (profitPerHourDifference > 10) {
    betterClient = client1.clientName;
    reason = 'Significantly better profit per hour';
  } else if (profitPerHourDifference < -10) {
    betterClient = client2.clientName;
    reason = 'Significantly better profit per hour';
  } else {
    betterClient = 'Similar';
    reason = 'Clients have similar profitability profiles';
  }

  return {
    profitDifference,
    profitPerHourDifference,
    riskDifference,
    betterClient,
    reason,
  };
}
