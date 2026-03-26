/**
 * PEOPLE → EMPLOYEES CORE LAYER
 * Comprehensive employee data model and mock data
 */

export interface Employee {
  // Core Identity
  id: string;
  employeeId: string; // Employee number (e.g., "EMP-001")
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;

  // Employment Details
  jobTitle: string;
  department: string;
  departmentId: string;
  manager?: string;
  managerId?: string;
  employmentType: 'Full-Time' | 'Part-Time' | 'Contract' | 'Intern';
  workLocation: 'Office' | 'Remote' | 'Hybrid';
  
  // Dates
  hireDate: string;
  startDate: string;
  probationEndDate?: string;
  terminationDate?: string;

  // Compensation
  salary: number;
  currency: string;
  payFrequency: 'Monthly' | 'Bi-Weekly' | 'Weekly';
  payGrade?: string;
  
  // Status & Access
  status: 'Active' | 'On Leave' | 'Probation' | 'Suspended' | 'Terminated';
  accessLevel: 'Employee' | 'Manager' | 'Admin' | 'Super Admin';
  
  // Time & Attendance
  workingHours: number; // per week
  timeZone: string;
  workSchedule?: string;
  
  // Benefits & Leave
  annualLeaveBalance: number;
  sickLeaveBalance: number;
  totalLeaveUsed: number;
  
  // Performance
  lastReviewDate?: string;
  nextReviewDate?: string;
  performanceRating?: number; // 1-5
  
  // Skills & Qualifications
  skills?: string[];
  certifications?: string[];
  education?: string;
  
  // System Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastActive?: string;
  
  // Integration Keys
  financeAccountId?: string; // Link to finance system
  projectIds?: string[]; // Assigned projects
  teamIds?: string[]; // Team memberships
  
  // Flags
  isManager: boolean;
  hasDirectReports: boolean;
  requiresOnboarding: boolean;
  pendingActions?: string[];
}

export interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  onLeave: number;
  onProbation: number;
  newHires30Days: number;
  terminatedEmployees: number;
  averageTenure: number; // in months
  
  // By Department
  byDepartment: Record<string, number>;
  
  // By Employment Type
  fullTime: number;
  partTime: number;
  contract: number;
  intern: number;
  
  // By Location
  office: number;
  remote: number;
  hybrid: number;
  
  // Gender/Diversity (optional)
  genderDistribution?: Record<string, number>;
  
  // Compensation
  totalPayrollCost: number;
  averageSalary: number;
  salaryRanges: {
    min: number;
    max: number;
    median: number;
  };
}

// ============================================================================
// MOCK EMPLOYEE DATA
// ============================================================================

export const mockEmployees: Employee[] = [
  {
    id: 'emp-001',
    employeeId: 'EMP-001',
    firstName: 'Sarah',
    lastName: 'Johnson',
    fullName: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    phone: '+1-555-0101',
    jobTitle: 'Product Manager',
    department: 'Product',
    departmentId: 'dept-product',
    manager: 'Robert Taylor',
    managerId: 'emp-008',
    employmentType: 'Full-Time',
    workLocation: 'Hybrid',
    hireDate: '2023-03-15',
    startDate: '2023-03-15',
    salary: 95000,
    currency: 'USD',
    payFrequency: 'Monthly',
    payGrade: 'M2',
    status: 'Active',
    accessLevel: 'Manager',
    workingHours: 40,
    timeZone: 'America/New_York',
    annualLeaveBalance: 15,
    sickLeaveBalance: 10,
    totalLeaveUsed: 5,
    performanceRating: 4.5,
    skills: ['Product Strategy', 'Agile', 'User Research'],
    createdAt: '2023-03-01T10:00:00Z',
    updatedAt: '2026-01-06T08:30:00Z',
    createdBy: 'system',
    lastActive: '5 min ago',
    isManager: true,
    hasDirectReports: true,
    requiresOnboarding: false,
    projectIds: ['proj-001', 'proj-003'],
    teamIds: ['team-product']
  },
  {
    id: 'emp-002',
    employeeId: 'EMP-002',
    firstName: 'Michael',
    lastName: 'Chen',
    fullName: 'Michael Chen',
    email: 'michael.c@company.com',
    phone: '+1-555-0102',
    jobTitle: 'Senior Software Engineer',
    department: 'Engineering',
    departmentId: 'dept-engineering',
    manager: 'Robert Taylor',
    managerId: 'emp-008',
    employmentType: 'Full-Time',
    workLocation: 'Remote',
    hireDate: '2022-01-10',
    startDate: '2022-01-10',
    salary: 120000,
    currency: 'USD',
    payFrequency: 'Monthly',
    payGrade: 'E4',
    status: 'Active',
    accessLevel: 'Employee',
    workingHours: 40,
    timeZone: 'America/Los_Angeles',
    annualLeaveBalance: 18,
    sickLeaveBalance: 12,
    totalLeaveUsed: 7,
    lastReviewDate: '2025-12-15',
    nextReviewDate: '2026-12-15',
    performanceRating: 5,
    skills: ['React', 'TypeScript', 'Node.js', 'System Design'],
    certifications: ['AWS Solutions Architect'],
    createdAt: '2022-01-05T10:00:00Z',
    updatedAt: '2026-01-06T08:15:00Z',
    createdBy: 'system',
    lastActive: '2 min ago',
    isManager: false,
    hasDirectReports: false,
    requiresOnboarding: false,
    projectIds: ['proj-001', 'proj-002'],
    teamIds: ['team-engineering']
  },
  {
    id: 'emp-003',
    employeeId: 'EMP-003',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    fullName: 'Emily Rodriguez',
    email: 'emily.r@company.com',
    phone: '+1-555-0103',
    jobTitle: 'UX Designer',
    department: 'Design',
    departmentId: 'dept-design',
    manager: 'Sarah Johnson',
    managerId: 'emp-001',
    employmentType: 'Full-Time',
    workLocation: 'Office',
    hireDate: '2023-06-01',
    startDate: '2023-06-01',
    salary: 78000,
    currency: 'USD',
    payFrequency: 'Monthly',
    payGrade: 'D2',
    status: 'Active',
    accessLevel: 'Employee',
    workingHours: 40,
    timeZone: 'America/New_York',
    annualLeaveBalance: 14,
    sickLeaveBalance: 10,
    totalLeaveUsed: 3,
    performanceRating: 4,
    skills: ['Figma', 'User Research', 'Prototyping', 'UI Design'],
    createdAt: '2023-05-15T10:00:00Z',
    updatedAt: '2026-01-06T07:45:00Z',
    createdBy: 'system',
    lastActive: '10 min ago',
    isManager: false,
    hasDirectReports: false,
    requiresOnboarding: false,
    projectIds: ['proj-001'],
    teamIds: ['team-design']
  },
  {
    id: 'emp-004',
    employeeId: 'EMP-004',
    firstName: 'David',
    lastName: 'Kim',
    fullName: 'David Kim',
    email: 'david.k@company.com',
    phone: '+1-555-0104',
    jobTitle: 'Marketing Manager',
    department: 'Marketing',
    departmentId: 'dept-marketing',
    employmentType: 'Full-Time',
    workLocation: 'Hybrid',
    hireDate: '2021-09-20',
    startDate: '2021-09-20',
    salary: 88000,
    currency: 'USD',
    payFrequency: 'Monthly',
    payGrade: 'M1',
    status: 'On Leave',
    accessLevel: 'Manager',
    workingHours: 40,
    timeZone: 'America/Chicago',
    annualLeaveBalance: 5,
    sickLeaveBalance: 8,
    totalLeaveUsed: 15,
    performanceRating: 4.2,
    skills: ['Digital Marketing', 'SEO', 'Content Strategy'],
    createdAt: '2021-09-10T10:00:00Z',
    updatedAt: '2026-01-05T16:00:00Z',
    createdBy: 'system',
    lastActive: '1 day ago',
    isManager: true,
    hasDirectReports: true,
    requiresOnboarding: false,
    pendingActions: ['Submit timesheet', 'Complete training'],
    teamIds: ['team-marketing']
  },
  {
    id: 'emp-005',
    employeeId: 'EMP-005',
    firstName: 'Lisa',
    lastName: 'Anderson',
    fullName: 'Lisa Anderson',
    email: 'lisa.a@company.com',
    phone: '+1-555-0105',
    jobTitle: 'HR Manager',
    department: 'HR',
    departmentId: 'dept-hr',
    employmentType: 'Full-Time',
    workLocation: 'Office',
    hireDate: '2020-04-01',
    startDate: '2020-04-01',
    salary: 92000,
    currency: 'USD',
    payFrequency: 'Monthly',
    payGrade: 'M2',
    status: 'Active',
    accessLevel: 'Admin',
    workingHours: 40,
    timeZone: 'America/New_York',
    annualLeaveBalance: 20,
    sickLeaveBalance: 12,
    totalLeaveUsed: 8,
    performanceRating: 4.8,
    skills: ['Talent Acquisition', 'Employee Relations', 'HRIS'],
    certifications: ['SHRM-CP', 'PHR'],
    createdAt: '2020-03-15T10:00:00Z',
    updatedAt: '2026-01-06T09:00:00Z',
    createdBy: 'system',
    lastActive: 'Just now',
    isManager: true,
    hasDirectReports: true,
    requiresOnboarding: false,
    teamIds: ['team-hr']
  },
  {
    id: 'emp-006',
    employeeId: 'EMP-006',
    firstName: 'James',
    lastName: 'Wilson',
    fullName: 'James Wilson',
    email: 'james.w@company.com',
    phone: '+1-555-0106',
    jobTitle: 'Sales Director',
    department: 'Sales',
    departmentId: 'dept-sales',
    employmentType: 'Full-Time',
    workLocation: 'Hybrid',
    hireDate: '2019-11-15',
    startDate: '2019-11-15',
    salary: 105000,
    currency: 'USD',
    payFrequency: 'Monthly',
    payGrade: 'M3',
    status: 'Active',
    accessLevel: 'Manager',
    workingHours: 40,
    timeZone: 'America/Denver',
    annualLeaveBalance: 22,
    sickLeaveBalance: 10,
    totalLeaveUsed: 10,
    performanceRating: 4.6,
    skills: ['Enterprise Sales', 'Negotiation', 'CRM'],
    createdAt: '2019-11-01T10:00:00Z',
    updatedAt: '2026-01-06T08:00:00Z',
    createdBy: 'system',
    lastActive: '30 min ago',
    isManager: true,
    hasDirectReports: true,
    requiresOnboarding: false,
    teamIds: ['team-sales']
  },
  {
    id: 'emp-007',
    employeeId: 'EMP-007',
    firstName: 'Maria',
    lastName: 'Garcia',
    fullName: 'Maria Garcia',
    email: 'maria.g@company.com',
    phone: '+1-555-0107',
    jobTitle: 'QA Engineer',
    department: 'Engineering',
    departmentId: 'dept-engineering',
    manager: 'Robert Taylor',
    managerId: 'emp-008',
    employmentType: 'Full-Time',
    workLocation: 'Remote',
    hireDate: '2023-08-01',
    startDate: '2023-08-01',
    salary: 82000,
    currency: 'USD',
    payFrequency: 'Monthly',
    payGrade: 'E2',
    status: 'Active',
    accessLevel: 'Employee',
    workingHours: 40,
    timeZone: 'America/Phoenix',
    annualLeaveBalance: 12,
    sickLeaveBalance: 10,
    totalLeaveUsed: 4,
    performanceRating: 4.3,
    skills: ['Test Automation', 'Selenium', 'API Testing'],
    createdAt: '2023-07-15T10:00:00Z',
    updatedAt: '2026-01-05T17:30:00Z',
    createdBy: 'system',
    lastActive: '2 hours ago',
    isManager: false,
    hasDirectReports: false,
    requiresOnboarding: false,
    projectIds: ['proj-002'],
    teamIds: ['team-engineering']
  },
  {
    id: 'emp-008',
    employeeId: 'EMP-008',
    firstName: 'Robert',
    lastName: 'Taylor',
    fullName: 'Robert Taylor',
    email: 'robert.t@company.com',
    phone: '+1-555-0108',
    jobTitle: 'VP of Engineering',
    department: 'Engineering',
    departmentId: 'dept-engineering',
    employmentType: 'Full-Time',
    workLocation: 'Hybrid',
    hireDate: '2018-02-01',
    startDate: '2018-02-01',
    salary: 155000,
    currency: 'USD',
    payFrequency: 'Monthly',
    payGrade: 'E6',
    status: 'Active',
    accessLevel: 'Admin',
    workingHours: 40,
    timeZone: 'America/New_York',
    annualLeaveBalance: 25,
    sickLeaveBalance: 15,
    totalLeaveUsed: 12,
    lastReviewDate: '2025-11-01',
    nextReviewDate: '2026-11-01',
    performanceRating: 4.9,
    skills: ['Leadership', 'System Architecture', 'Team Building'],
    certifications: ['PMP', 'AWS Solutions Architect Professional'],
    education: 'MS Computer Science - MIT',
    createdAt: '2018-01-15T10:00:00Z',
    updatedAt: '2026-01-06T08:45:00Z',
    createdBy: 'system',
    lastActive: '15 min ago',
    isManager: true,
    hasDirectReports: true,
    requiresOnboarding: false,
    teamIds: ['team-engineering', 'team-leadership']
  },
  {
    id: 'emp-009',
    employeeId: 'EMP-009',
    firstName: 'Jennifer',
    lastName: 'Martinez',
    fullName: 'Jennifer Martinez',
    email: 'jennifer.m@company.com',
    phone: '+1-555-0109',
    jobTitle: 'Junior Developer',
    department: 'Engineering',
    departmentId: 'dept-engineering',
    manager: 'Michael Chen',
    managerId: 'emp-002',
    employmentType: 'Full-Time',
    workLocation: 'Office',
    hireDate: '2025-11-01',
    startDate: '2025-11-01',
    probationEndDate: '2026-05-01',
    salary: 68000,
    currency: 'USD',
    payFrequency: 'Monthly',
    payGrade: 'E1',
    status: 'Probation',
    accessLevel: 'Employee',
    workingHours: 40,
    timeZone: 'America/New_York',
    annualLeaveBalance: 10,
    sickLeaveBalance: 5,
    totalLeaveUsed: 0,
    skills: ['JavaScript', 'React', 'Git'],
    education: 'BS Computer Science - UCLA',
    createdAt: '2025-10-15T10:00:00Z',
    updatedAt: '2026-01-06T09:15:00Z',
    createdBy: 'emp-005',
    lastActive: '1 hour ago',
    isManager: false,
    hasDirectReports: false,
    requiresOnboarding: true,
    pendingActions: ['Complete security training', 'Set up development environment'],
    projectIds: ['proj-002'],
    teamIds: ['team-engineering']
  },
  {
    id: 'emp-010',
    employeeId: 'EMP-010',
    firstName: 'Alex',
    lastName: 'Thompson',
    fullName: 'Alex Thompson',
    email: 'alex.t@company.com',
    phone: '+1-555-0110',
    jobTitle: 'Marketing Intern',
    department: 'Marketing',
    departmentId: 'dept-marketing',
    manager: 'David Kim',
    managerId: 'emp-004',
    employmentType: 'Intern',
    workLocation: 'Hybrid',
    hireDate: '2025-12-01',
    startDate: '2025-12-01',
    salary: 35000,
    currency: 'USD',
    payFrequency: 'Monthly',
    payGrade: 'I1',
    status: 'Active',
    accessLevel: 'Employee',
    workingHours: 20,
    timeZone: 'America/New_York',
    annualLeaveBalance: 5,
    sickLeaveBalance: 3,
    totalLeaveUsed: 0,
    skills: ['Social Media', 'Content Writing'],
    education: 'BA Marketing - NYU (In Progress)',
    createdAt: '2025-11-15T10:00:00Z',
    updatedAt: '2026-01-06T08:20:00Z',
    createdBy: 'emp-005',
    lastActive: '3 hours ago',
    isManager: false,
    hasDirectReports: false,
    requiresOnboarding: true,
    pendingActions: ['Submit I-9 form', 'Complete orientation'],
    teamIds: ['team-marketing']
  }
];

export const mockEmployeeStats: EmployeeStats = {
  totalEmployees: 10,
  activeEmployees: 8,
  onLeave: 1,
  onProbation: 1,
  newHires30Days: 2,
  terminatedEmployees: 0,
  averageTenure: 28,
  
  byDepartment: {
    'Engineering': 4,
    'Product': 1,
    'Design': 1,
    'Marketing': 2,
    'HR': 1,
    'Sales': 1
  },
  
  fullTime: 9,
  partTime: 0,
  contract: 0,
  intern: 1,
  
  office: 2,
  remote: 2,
  hybrid: 6,
  
  totalPayrollCost: 918000,
  averageSalary: 91800,
  salaryRanges: {
    min: 35000,
    max: 155000,
    median: 88500
  }
};
