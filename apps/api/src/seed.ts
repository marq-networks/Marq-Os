import * as mock from '../../../src/app/services/mockData';
import * as work from '../../../src/app/components/screens/work/workMockData';

export function loadSeed() {
  // Ensure mutations in the API do not mutate frontend mock module state.
  // `structuredClone` is available in modern Node.
  return structuredClone({
    authUsers: mock.mockAuthUsers,
    organizations: mock.mockOrganizations,

    employees: mock.mockEmployees,
    departments: mock.mockDepartments,
    roles: mock.mockRoles,

    timeSessions: mock.mockSessions,
    timeCorrections: mock.mockCorrections,
    leaveRequests: mock.mockLeaveRequests,
    leaveBalances: mock.mockLeaveBalances,
    workdayRules: mock.mockWorkdayRules,
    breakRules: mock.mockBreakRules,
    fines: mock.mockFines,

    channels: mock.mockChannels,
    messages: mock.mockMessages,

    activityLog: mock.mockActivityLog,
    productivityMetrics: mock.mockProductivityMetrics,
    notifications: mock.mockNotifications,

    payrollRuns: mock.mockPayrollRuns,
    payslips: mock.mockPayslips,
    billingInvoices: mock.mockBillingInvoices,
    offlineSync: mock.mockOfflineSyncRecords,
    screenshots: mock.mockScreenshots,

    transactions: mock.mockTransactions,
    accounts: mock.mockFinanceAccounts,
    reimbursements: mock.mockReimbursements,
    loans: mock.mockLoans,
    financeInbox: mock.mockFinanceInbox,
    costCenters: mock.mockCostCenters,
    expenseReports: mock.mockExpenseReports,
    financeReports: mock.mockFinanceReports,
    payrollPostings: mock.mockPayrollPostings,

    // Work / Execution OS
    projects: work.mockProjects,
    tasks: work.mockTasks,
    sprints: work.mockSprints,
    milestones: work.mockMilestones,
    issues: work.mockIssues,
    teamMembers: work.mockTeamMembers,
    timeLogs: work.mockTimeLogs,
    taskDependencies: work.mockDependencies,
    taskLists: work.mockTaskLists,
  });
}

