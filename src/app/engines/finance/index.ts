// ═══════════════════════════════════════════════════════════════════════════
// FINANCIAL INTELLIGENCE ENGINE - UNIFIED CONTROLLER
// ═══════════════════════════════════════════════════════════════════════════
// Central export and orchestration for all 11 finance engines
// Version: 1.0 | Build: ENGINE-MASTER

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export * from './types';

// ═══════════════════════════════════════════════════════════════════════════
// ENGINE-01: Department Cost Matrix
// ═══════════════════════════════════════════════════════════════════════════

export {
  computeDepartmentCostMatrix,
  getDepartmentCostPerHour,
  getDepartmentCostPerMinute,
  detectMatrixChanges,
  calculateProjectBurn,
  calculateQuoteCost,
} from './departmentCostEngine';

// ═══════════════════════════════════════════════════════════════════════════
// ENGINE-02: Payroll Propagation
// ═══════════════════════════════════════════════════════════════════════════

export {
  propagatePayrollToLedger,
  calculateDepartmentCostImpact,
  validatePayrollForPropagation,
  getPayrollSummary,
} from './payrollPropagation';

// ═══════════════════════════════════════════════════════════════════════════
// ENGINE-03: Overhead Allocator
// ═══════════════════════════════════════════════════════════════════════════

export {
  allocateOverheadItem,
  createOverheadAllocationMatrix,
  getDepartmentOverheadShare,
  getDepartmentOverheadBreakdown,
  validateOverheadAllocation,
  suggestAllocationRule,
  recalculateAllocationOnChange,
} from './overheadAllocator';

// ═══════════════════════════════════════════════════════════════════════════
// ENGINE-04: Project Burn Engine
// ═══════════════════════════════════════════════════════════════════════════

export {
  calculateTimeCostInjection,
  calculateExpenseAllocation,
  calculateBurnRiskScore,
  calculateMarginDrift,
  getMarginDriftWarning,
  computeProjectBurnData,
  generateBurnRiskAlerts,
  getBurnHealthStatus,
  calculateProjectProfit,
  estimateCompletionCost,
} from './projectBurnEngine';

// ═══════════════════════════════════════════════════════════════════════════
// ENGINE-05: Client Profitability
// ═══════════════════════════════════════════════════════════════════════════

export {
  computeClientProfitability,
  rankClientsByProfitability,
  identifyAtRiskClients,
  calculateClientLTV,
  getClientHealthSummary,
  compareClients,
} from './clientProfitability';

// ═══════════════════════════════════════════════════════════════════════════
// ENGINE-06: Quote Simulator
// ═══════════════════════════════════════════════════════════════════════════

export {
  runQuoteSimulation,
  calculateMinimumViableQuote,
  compareQuoteScenarios,
  suggestQuoteAdjustments,
  analyzeQuoteRiskFactors,
  generateQuoteRecommendation,
} from './quoteSimulator';

// ═══════════════════════════════════════════════════════════════════════════
// ENGINE-07: What-If Sandbox
// ═══════════════════════════════════════════════════════════════════════════

export {
  createOrganizationSnapshot,
  runWhatIfSimulation,
  compareWhatIfScenarios,
  calculateBreakEven,
  validateScenarioInputs,
} from './whatIfEngine';

// ═══════════════════════════════════════════════════════════════════════════
// ENGINE-08: Profit Velocity
// ═══════════════════════════════════════════════════════════════════════════

export {
  calculateProfitVelocity,
  detectVelocityAnomalies,
  projectFutureVelocity,
  getVelocityHealthStatus,
  calculateRunway,
} from './profitVelocity';

// ═══════════════════════════════════════════════════════════════════════════
// ENGINE-09: Work Wiring
// ═══════════════════════════════════════════════════════════════════════════

export {
  parseTimeToHours,
  wireTaskToFinance,
  wireProjectToFinance,
  batchWireTasksToFinance,
  calculateWorkCostImpact,
  trackCostChanges,
  identifyHighCostTasks,
  calculateDepartmentUtilization,
  generateWiringSummary,
} from './workWiring';

// ═══════════════════════════════════════════════════════════════════════════
// ENGINE-10: Chat Wiring
// ═══════════════════════════════════════════════════════════════════════════

export {
  executeChatFinanceCommand,
  parseChatMessageForFinanceCommand,
  generateChatResponseForCommand,
  getAvailableFinanceCommands,
  validateChatFinanceCommand,
} from './chatWiring';

// ═══════════════════════════════════════════════════════════════════════════
// ENGINE-11: AI Learning
// ═══════════════════════════════════════════════════════════════════════════

export {
  processAILearning,
  updateAILearningMetrics,
  generateClassificationSuggestion,
  identifyPatterns,
  getLearningRecommendations,
  calculateOptimalConfidenceThreshold,
  generateLearningReport,
} from './aiLearning';

// ═══════════════════════════════════════════════════════════════════════════
// ENGINE ORCHESTRATION
// ═══════════════════════════════════════════════════════════════════════════

import { FinanceEngineState } from './types';

/**
 * Initialize Finance Engine State
 */
export function initializeFinanceEngineState(): FinanceEngineState {
  return {
    engineVersion: '1.0.0',
    engineStatus: 'idle',
    lastFullComputation: new Date().toISOString(),
    projectBurnData: {},
    clientProfitability: {},
    burnRiskAlerts: [],
    workWiringActive: false,
    chatWiringActive: false,
  };
}

/**
 * Get engine health status
 */
export function getEngineHealthStatus(state: FinanceEngineState): {
  status: 'healthy' | 'degraded' | 'critical';
  issues: string[];
  uptime: number;
} {
  const issues: string[] = [];

  if (!state.departmentCostMatrix) {
    issues.push('Department Cost Matrix not initialized');
  }

  if (!state.overheadAllocation) {
    issues.push('Overhead Allocation not initialized');
  }

  if (!state.profitVelocity) {
    issues.push('Profit Velocity not initialized');
  }

  if (state.burnRiskAlerts.length > 10) {
    issues.push(`High number of burn risk alerts: ${state.burnRiskAlerts.length}`);
  }

  const status = issues.length === 0 ? 'healthy' : issues.length < 3 ? 'degraded' : 'critical';

  const lastComputation = new Date(state.lastFullComputation);
  const uptime = Date.now() - lastComputation.getTime();

  return {
    status,
    issues,
    uptime: Math.floor(uptime / 1000), // seconds
  };
}

/**
 * Validate engine dependencies
 */
export function validateEngineDependencies(): {
  valid: boolean;
  missingDependencies: string[];
} {
  const missingDependencies: string[] = [];

  // All engines are self-contained, no external dependencies required
  
  return {
    valid: missingDependencies.length === 0,
    missingDependencies,
  };
}
