// ═══════════════════════════════════════════════════════════════════════════
// ORG-F-ENGINE-03 — OVERHEAD ALLOCATION ROUTER
// ═══════════════════════════════════════════════════════════════════════════
// Auto-distributes overheads using headcount %, revenue %, manual weight, or dept ratio
// Version: 1.0 | Build: ENGINE-03

import {
  OverheadItem,
  OverheadAllocationEntry,
  OverheadAllocationMatrix,
  OverheadAllocationRule,
} from './types';

interface Department {
  id: string;
  name: string;
  employeeCount: number;
  monthlyRevenue?: number;
}

/**
 * Allocate overhead by headcount percentage
 */
function allocateByHeadcount(
  overheadItem: OverheadItem,
  departments: Department[]
): OverheadAllocationEntry[] {
  const totalEmployees = departments.reduce((sum, dept) => sum + dept.employeeCount, 0);
  
  if (totalEmployees === 0) return [];

  return departments.map((dept) => {
    const percentage = (dept.employeeCount / totalEmployees) * 100;
    const allocatedAmount = (overheadItem.monthlyAmount * dept.employeeCount) / totalEmployees;

    return {
      overheadItemId: overheadItem.id,
      overheadItemName: overheadItem.name,
      departmentId: dept.id,
      departmentName: dept.name,
      allocatedAmount,
      allocationPercentage: percentage,
      rule: 'headcount',
      computedAt: new Date().toISOString(),
    };
  });
}

/**
 * Allocate overhead by revenue percentage
 */
function allocateByRevenue(
  overheadItem: OverheadItem,
  departments: Department[]
): OverheadAllocationEntry[] {
  const totalRevenue = departments.reduce((sum, dept) => sum + (dept.monthlyRevenue || 0), 0);
  
  if (totalRevenue === 0) return allocateByHeadcount(overheadItem, departments);

  return departments.map((dept) => {
    const revenue = dept.monthlyRevenue || 0;
    const percentage = (revenue / totalRevenue) * 100;
    const allocatedAmount = (overheadItem.monthlyAmount * revenue) / totalRevenue;

    return {
      overheadItemId: overheadItem.id,
      overheadItemName: overheadItem.name,
      departmentId: dept.id,
      departmentName: dept.name,
      allocatedAmount,
      allocationPercentage: percentage,
      rule: 'revenue',
      computedAt: new Date().toISOString(),
    };
  });
}

/**
 * Allocate overhead by manual weights
 */
function allocateByManualWeights(
  overheadItem: OverheadItem,
  departments: Department[]
): OverheadAllocationEntry[] {
  const weights = overheadItem.manualWeights || {};
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);

  if (totalWeight === 0) return allocateByHeadcount(overheadItem, departments);

  return departments.map((dept) => {
    const weight = weights[dept.id] || 0;
    const percentage = (weight / totalWeight) * 100;
    const allocatedAmount = (overheadItem.monthlyAmount * weight) / totalWeight;

    return {
      overheadItemId: overheadItem.id,
      overheadItemName: overheadItem.name,
      departmentId: dept.id,
      departmentName: dept.name,
      allocatedAmount,
      allocationPercentage: percentage,
      rule: 'manual',
      computedAt: new Date().toISOString(),
    };
  });
}

/**
 * Allocate overhead by equal department ratio
 */
function allocateByDepartmentRatio(
  overheadItem: OverheadItem,
  departments: Department[]
): OverheadAllocationEntry[] {
  const deptCount = departments.length;
  
  if (deptCount === 0) return [];

  const allocatedAmount = overheadItem.monthlyAmount / deptCount;
  const percentage = 100 / deptCount;

  return departments.map((dept) => ({
    overheadItemId: overheadItem.id,
    overheadItemName: overheadItem.name,
    departmentId: dept.id,
    departmentName: dept.name,
    allocatedAmount,
    allocationPercentage: percentage,
    rule: 'department-ratio',
    computedAt: new Date().toISOString(),
  }));
}

/**
 * Allocate single overhead item across departments
 */
export function allocateOverheadItem(
  overheadItem: OverheadItem,
  departments: Department[]
): OverheadAllocationEntry[] {
  if (!overheadItem.isActive) return [];

  switch (overheadItem.allocationRule) {
    case 'headcount':
      return allocateByHeadcount(overheadItem, departments);
    case 'revenue':
      return allocateByRevenue(overheadItem, departments);
    case 'manual':
      return allocateByManualWeights(overheadItem, departments);
    case 'department-ratio':
      return allocateByDepartmentRatio(overheadItem, departments);
    default:
      return allocateByHeadcount(overheadItem, departments);
  }
}

/**
 * Allocate all overhead items and create matrix
 */
export function createOverheadAllocationMatrix(
  overheadItems: OverheadItem[],
  departments: Department[]
): OverheadAllocationMatrix {
  const allAllocations: OverheadAllocationEntry[] = [];

  overheadItems.forEach((item) => {
    const allocations = allocateOverheadItem(item, departments);
    allAllocations.push(...allocations);
  });

  const totalMonthlyOverhead = overheadItems
    .filter((item) => item.isActive)
    .reduce((sum, item) => sum + item.monthlyAmount, 0);

  return {
    items: overheadItems,
    allocations: allAllocations,
    totalMonthlyOverhead,
    feedsInto: {
      costPerMinute: true,
      projectBurn: true,
      profitVelocity: true,
    },
    lastAllocated: new Date().toISOString(),
  };
}

/**
 * Get total overhead allocation for a specific department
 */
export function getDepartmentOverheadShare(
  matrix: OverheadAllocationMatrix,
  departmentId: string
): number {
  return matrix.allocations
    .filter((alloc) => alloc.departmentId === departmentId)
    .reduce((sum, alloc) => sum + alloc.allocatedAmount, 0);
}

/**
 * Get overhead breakdown by category for a department
 */
export function getDepartmentOverheadBreakdown(
  matrix: OverheadAllocationMatrix,
  departmentId: string
): Record<string, number> {
  const breakdown: Record<string, number> = {};

  matrix.allocations
    .filter((alloc) => alloc.departmentId === departmentId)
    .forEach((alloc) => {
      const item = matrix.items.find((i) => i.id === alloc.overheadItemId);
      const category = item?.category || 'other';
      
      if (!breakdown[category]) {
        breakdown[category] = 0;
      }
      breakdown[category] += alloc.allocatedAmount;
    });

  return breakdown;
}

/**
 * Validate overhead allocation
 */
export function validateOverheadAllocation(
  matrix: OverheadAllocationMatrix
): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if total allocated matches total overhead
  const totalAllocated = matrix.allocations.reduce((sum, alloc) => sum + alloc.allocatedAmount, 0);
  const difference = Math.abs(totalAllocated - matrix.totalMonthlyOverhead);
  
  if (difference > 0.01) {
    errors.push(
      `Total allocated (${totalAllocated.toFixed(2)}) doesn't match total overhead (${matrix.totalMonthlyOverhead.toFixed(2)})`
    );
  }

  // Check for items with manual allocation but missing weights
  matrix.items.forEach((item) => {
    if (item.allocationRule === 'manual' && (!item.manualWeights || Object.keys(item.manualWeights).length === 0)) {
      warnings.push(`Item "${item.name}" uses manual allocation but has no weights defined`);
    }
  });

  // Check for negative allocations
  matrix.allocations.forEach((alloc) => {
    if (alloc.allocatedAmount < 0) {
      errors.push(`Negative allocation for ${alloc.departmentName}: ${alloc.allocatedAmount}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Suggest optimal allocation rule based on overhead type
 */
export function suggestAllocationRule(category: OverheadItem['category']): OverheadAllocationRule {
  const suggestions: Record<typeof category, OverheadAllocationRule> = {
    tools: 'headcount',
    hosting: 'revenue',
    rent: 'headcount',
    saas: 'headcount',
    utilities: 'headcount',
    other: 'department-ratio',
  };

  return suggestions[category];
}

/**
 * Recalculate allocation when department data changes
 */
export function recalculateAllocationOnChange(
  matrix: OverheadAllocationMatrix,
  departments: Department[]
): OverheadAllocationMatrix {
  return createOverheadAllocationMatrix(matrix.items, departments);
}
