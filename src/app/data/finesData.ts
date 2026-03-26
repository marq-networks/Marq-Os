/**
 * TIME → FINES DATA MODEL
 * Comprehensive fines and penalties system linked to employees
 */

import { mockEmployees } from './employeeData';

export interface Fine {
  // Core Identity
  id: string;
  fineId: string; // Fine number (e.g., "FINE-001")
  
  // Employee Link
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  department: string;
  
  // Fine Details
  violationType: 
    | 'Late Arrival'
    | 'Early Departure'
    | 'Extended Break'
    | 'Missed Clock In'
    | 'Missed Clock Out'
    | 'Unauthorized Absence'
    | 'Break Violation'
    | 'Schedule Violation';
  
  ruleTrigger: string; // Which rule was violated
  reason: string;
  notes?: string;
  
  // Timing
  incidentDate: string;
  incidentTime: string;
  duration?: string; // How long the violation lasted
  
  // Financial
  amount: number;
  currency: string;
  calculationMethod: string; // e.g., "$0.50/min after grace period"
  
  // Status & Lifecycle
  status: 'Pending' | 'Collected' | 'Waived' | 'Disputed' | 'Cancelled';
  collectionDate?: string;
  waivedDate?: string;
  waivedBy?: string;
  waivedReason?: string;
  
  // Links
  correctionId?: string; // Link to correction that triggered this fine
  timesheetId?: string;
  
  // Audit Trail
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  
  // Dispute
  isDisputed: boolean;
  disputeReason?: string;
  disputeDate?: string;
  disputeResolution?: string;
  
  // Additional
  severity: 'Low' | 'Medium' | 'High';
  isRecurring: boolean; // Has this employee had this violation before?
  occurrenceCount?: number; // How many times this month
}

export interface FineStats {
  // Current Month
  totalFines: number;
  pendingFines: number;
  collectedFines: number;
  waivedFines: number;
  disputedFines: number;
  
  // Financial
  totalAmount: number;
  collectedAmount: number;
  waivedAmount: number;
  pendingAmount: number;
  
  // By Violation Type
  byViolationType: Record<string, number>;
  
  // By Department
  byDepartment: Record<string, number>;
  
  // By Employee (top offenders)
  byEmployee: Array<{
    employeeId: string;
    employeeName: string;
    count: number;
    totalAmount: number;
  }>;
  
  // Trends
  avgFineAmount: number;
  recurringViolations: number;
  waiveRate: number; // Percentage of fines waived
}

// ============================================================================
// MOCK FINES DATA (25+ records linked to employees from employeeData.ts)
// ============================================================================

export const mockFines: Fine[] = [
  // Sarah Johnson (EMP-001) - Product Manager
  {
    id: 'fine-001',
    fineId: 'FINE-001',
    employeeId: 'emp-001',
    employeeName: 'Sarah Johnson',
    employeeNumber: 'EMP-001',
    department: 'Product',
    violationType: 'Late Arrival',
    ruleTrigger: 'Late Clock In > 15 min',
    reason: 'Traffic delay, exceeded grace period',
    incidentDate: '2026-01-02',
    incidentTime: '09:35 AM',
    duration: '35 min',
    amount: 17.50,
    currency: 'USD',
    calculationMethod: '$0.50 per minute after 15 min grace',
    status: 'Pending',
    createdAt: '2026-01-02T09:40:00Z',
    createdBy: 'system',
    updatedAt: '2026-01-02T09:40:00Z',
    severity: 'Low',
    isRecurring: false,
    isDisputed: false
  },
  
  // Michael Chen (EMP-002) - Senior Engineer
  {
    id: 'fine-002',
    fineId: 'FINE-002',
    employeeId: 'emp-002',
    employeeName: 'Michael Chen',
    employeeNumber: 'EMP-002',
    department: 'Engineering',
    violationType: 'Missed Clock Out',
    ruleTrigger: 'No Clock Out Recorded',
    reason: 'Forgot to clock out after late night deployment',
    incidentDate: '2026-01-01',
    incidentTime: '06:00 PM',
    amount: 12.00,
    currency: 'USD',
    calculationMethod: 'Fixed penalty for missed clock out',
    status: 'Waived',
    waivedDate: '2026-01-02',
    waivedBy: 'Lisa Anderson',
    waivedReason: 'Working on critical production deployment',
    createdAt: '2026-01-02T08:00:00Z',
    createdBy: 'system',
    updatedAt: '2026-01-02T10:30:00Z',
    severity: 'Low',
    isRecurring: false,
    isDisputed: false
  },
  
  // Emily Rodriguez (EMP-003) - UX Designer
  {
    id: 'fine-003',
    fineId: 'FINE-003',
    employeeId: 'emp-003',
    employeeName: 'Emily Rodriguez',
    employeeNumber: 'EMP-003',
    department: 'Design',
    violationType: 'Extended Break',
    ruleTrigger: 'Lunch Break > 60 min',
    reason: 'Break extended by 18 minutes',
    incidentDate: '2025-12-31',
    incidentTime: '12:00 PM',
    duration: '18 min',
    amount: 9.00,
    currency: 'USD',
    calculationMethod: '$0.50 per minute over limit',
    status: 'Collected',
    collectionDate: '2026-01-05',
    createdAt: '2025-12-31T13:20:00Z',
    createdBy: 'system',
    updatedAt: '2026-01-05T09:00:00Z',
    severity: 'Low',
    isRecurring: false,
    isDisputed: false
  },
  
  // David Kim (EMP-004) - Marketing Manager (On Leave)
  {
    id: 'fine-004',
    fineId: 'FINE-004',
    employeeId: 'emp-004',
    employeeName: 'David Kim',
    employeeNumber: 'EMP-004',
    department: 'Marketing',
    violationType: 'Early Departure',
    ruleTrigger: 'Left > 30 min before shift end',
    reason: 'Left 45 minutes early without approval',
    incidentDate: '2025-12-20',
    incidentTime: '04:15 PM',
    duration: '45 min',
    amount: 22.50,
    currency: 'USD',
    calculationMethod: '$0.50 per minute before shift end',
    status: 'Collected',
    collectionDate: '2025-12-28',
    createdAt: '2025-12-20T16:20:00Z',
    createdBy: 'system',
    updatedAt: '2025-12-28T10:00:00Z',
    severity: 'Medium',
    isRecurring: true,
    occurrenceCount: 2,
    isDisputed: false
  },
  
  // Maria Garcia (EMP-007) - QA Engineer
  {
    id: 'fine-005',
    fineId: 'FINE-005',
    employeeId: 'emp-007',
    employeeName: 'Maria Garcia',
    employeeNumber: 'EMP-007',
    department: 'Engineering',
    violationType: 'Late Arrival',
    ruleTrigger: 'Late Clock In > 15 min',
    reason: 'Arrived 52 minutes late',
    incidentDate: '2025-12-29',
    incidentTime: '09:52 AM',
    duration: '52 min',
    amount: 26.00,
    currency: 'USD',
    calculationMethod: '$0.50 per minute after 15 min grace',
    status: 'Pending',
    createdAt: '2025-12-29T10:00:00Z',
    createdBy: 'system',
    updatedAt: '2025-12-29T10:00:00Z',
    severity: 'Medium',
    isRecurring: false,
    isDisputed: false
  },
  
  // Jennifer Martinez (EMP-009) - Junior Developer (Probation)
  {
    id: 'fine-006',
    fineId: 'FINE-006',
    employeeId: 'emp-009',
    employeeName: 'Jennifer Martinez',
    employeeNumber: 'EMP-009',
    department: 'Engineering',
    violationType: 'Late Arrival',
    ruleTrigger: 'Late Clock In > 15 min',
    reason: 'Late by 28 minutes - traffic',
    incidentDate: '2026-01-03',
    incidentTime: '09:28 AM',
    duration: '28 min',
    amount: 14.00,
    currency: 'USD',
    calculationMethod: '$0.50 per minute after 15 min grace',
    status: 'Pending',
    correctionId: 'corr-001',
    createdAt: '2026-01-03T09:30:00Z',
    createdBy: 'system',
    updatedAt: '2026-01-03T09:30:00Z',
    severity: 'Low',
    isRecurring: true,
    occurrenceCount: 3,
    isDisputed: false,
    notes: 'New employee - probation period'
  },
  
  // Alex Thompson (EMP-010) - Marketing Intern
  {
    id: 'fine-007',
    fineId: 'FINE-007',
    employeeId: 'emp-010',
    employeeName: 'Alex Thompson',
    employeeNumber: 'EMP-010',
    department: 'Marketing',
    violationType: 'Extended Break',
    ruleTrigger: 'Break > 30 min',
    reason: 'Lunch break extended to 55 minutes',
    incidentDate: '2026-01-04',
    incidentTime: '12:00 PM',
    duration: '25 min',
    amount: 12.50,
    currency: 'USD',
    calculationMethod: '$0.50 per minute over 30 min limit',
    status: 'Pending',
    createdAt: '2026-01-04T13:00:00Z',
    createdBy: 'system',
    updatedAt: '2026-01-04T13:00:00Z',
    severity: 'Low',
    isRecurring: false,
    isDisputed: false
  },
  
  // Sarah Johnson (EMP-001) - Second violation
  {
    id: 'fine-008',
    fineId: 'FINE-008',
    employeeId: 'emp-001',
    employeeName: 'Sarah Johnson',
    employeeNumber: 'EMP-001',
    department: 'Product',
    violationType: 'Missed Clock In',
    ruleTrigger: 'No Clock In Recorded',
    reason: 'Started work but forgot to clock in',
    incidentDate: '2025-12-27',
    incidentTime: '09:00 AM',
    amount: 10.00,
    currency: 'USD',
    calculationMethod: 'Fixed penalty for missed clock in',
    status: 'Waived',
    waivedDate: '2025-12-28',
    waivedBy: 'Robert Taylor',
    waivedReason: 'First offense, was in client meeting',
    createdAt: '2025-12-27T17:00:00Z',
    createdBy: 'system',
    updatedAt: '2025-12-28T09:00:00Z',
    severity: 'Low',
    isRecurring: false,
    isDisputed: false
  },
  
  // More violations for comprehensive dataset
  {
    id: 'fine-009',
    fineId: 'FINE-009',
    employeeId: 'emp-003',
    employeeName: 'Emily Rodriguez',
    employeeNumber: 'EMP-003',
    department: 'Design',
    violationType: 'Early Departure',
    ruleTrigger: 'Left > 15 min before shift end',
    reason: 'Personal appointment',
    incidentDate: '2025-12-26',
    incidentTime: '04:30 PM',
    duration: '30 min',
    amount: 15.00,
    currency: 'USD',
    calculationMethod: '$0.50 per minute before shift end',
    status: 'Collected',
    collectionDate: '2026-01-02',
    createdAt: '2025-12-26T16:35:00Z',
    createdBy: 'system',
    updatedAt: '2026-01-02T10:00:00Z',
    severity: 'Low',
    isRecurring: false,
    isDisputed: false
  },
  
  {
    id: 'fine-010',
    fineId: 'FINE-010',
    employeeId: 'emp-007',
    employeeName: 'Maria Garcia',
    employeeNumber: 'EMP-007',
    department: 'Engineering',
    violationType: 'Break Violation',
    ruleTrigger: 'Too many breaks in shift',
    reason: 'Took 4 breaks instead of allowed 2',
    incidentDate: '2025-12-24',
    incidentTime: '02:00 PM',
    amount: 20.00,
    currency: 'USD',
    calculationMethod: 'Fixed penalty for extra breaks',
    status: 'Collected',
    collectionDate: '2025-12-30',
    createdAt: '2025-12-24T17:00:00Z',
    createdBy: 'system',
    updatedAt: '2025-12-30T09:00:00Z',
    severity: 'Medium',
    isRecurring: false,
    isDisputed: false
  },
  
  // Additional fines to reach 25+
  {
    id: 'fine-011',
    fineId: 'FINE-011',
    employeeId: 'emp-009',
    employeeName: 'Jennifer Martinez',
    employeeNumber: 'EMP-009',
    department: 'Engineering',
    violationType: 'Late Arrival',
    ruleTrigger: 'Late Clock In > 15 min',
    reason: 'Overslept - second occurrence',
    incidentDate: '2025-12-23',
    incidentTime: '09:42 AM',
    duration: '42 min',
    amount: 21.00,
    currency: 'USD',
    calculationMethod: '$0.50 per minute after 15 min grace',
    status: 'Collected',
    collectionDate: '2025-12-30',
    createdAt: '2025-12-23T09:45:00Z',
    createdBy: 'system',
    updatedAt: '2025-12-30T09:00:00Z',
    severity: 'Medium',
    isRecurring: true,
    occurrenceCount: 2,
    isDisputed: false
  },
  
  {
    id: 'fine-012',
    fineId: 'FINE-012',
    employeeId: 'emp-010',
    employeeName: 'Alex Thompson',
    employeeNumber: 'EMP-010',
    department: 'Marketing',
    violationType: 'Late Arrival',
    ruleTrigger: 'Late Clock In > 15 min',
    reason: 'Public transport delay',
    incidentDate: '2025-12-22',
    incidentTime: '09:25 AM',
    duration: '25 min',
    amount: 12.50,
    currency: 'USD',
    calculationMethod: '$0.50 per minute after 15 min grace',
    status: 'Waived',
    waivedDate: '2025-12-23',
    waivedBy: 'David Kim',
    waivedReason: 'Subway delays confirmed, first offense',
    createdAt: '2025-12-22T09:30:00Z',
    createdBy: 'system',
    updatedAt: '2025-12-23T10:00:00Z',
    severity: 'Low',
    isRecurring: false,
    isDisputed: false
  },
  
  {
    id: 'fine-013',
    fineId: 'FINE-013',
    employeeId: 'emp-002',
    employeeName: 'Michael Chen',
    employeeNumber: 'EMP-002',
    department: 'Engineering',
    violationType: 'Extended Break',
    ruleTrigger: 'Lunch Break > 60 min',
    reason: 'Extended lunch for team celebration',
    incidentDate: '2025-12-20',
    incidentTime: '12:00 PM',
    duration: '30 min',
    amount: 15.00,
    currency: 'USD',
    calculationMethod: '$0.50 per minute over limit',
    status: 'Disputed',
    isDisputed: true,
    disputeReason: 'Team event approved by manager',
    disputeDate: '2025-12-21',
    createdAt: '2025-12-20T13:35:00Z',
    createdBy: 'system',
    updatedAt: '2025-12-21T09:00:00Z',
    severity: 'Low',
    isRecurring: false
  },
  
  {
    id: 'fine-014',
    fineId: 'FINE-014',
    employeeId: 'emp-004',
    employeeName: 'David Kim',
    employeeNumber: 'EMP-004',
    department: 'Marketing',
    violationType: 'Early Departure',
    ruleTrigger: 'Left > 30 min before shift end',
    reason: 'Left early without notification',
    incidentDate: '2025-12-18',
    incidentTime: '04:00 PM',
    duration: '60 min',
    amount: 30.00,
    currency: 'USD',
    calculationMethod: '$0.50 per minute before shift end',
    status: 'Collected',
    collectionDate: '2025-12-25',
    createdAt: '2025-12-18T16:05:00Z',
    createdBy: 'system',
    updatedAt: '2025-12-25T09:00:00Z',
    severity: 'High',
    isRecurring: true,
    occurrenceCount: 3,
    isDisputed: false,
    notes: 'Recurring issue - counseling scheduled'
  },
  
  {
    id: 'fine-015',
    fineId: 'FINE-015',
    employeeId: 'emp-001',
    employeeName: 'Sarah Johnson',
    employeeNumber: 'EMP-001',
    department: 'Product',
    violationType: 'Extended Break',
    ruleTrigger: 'Break > 15 min',
    reason: 'Coffee break extended',
    incidentDate: '2025-12-17',
    incidentTime: '03:00 PM',
    duration: '12 min',
    amount: 6.00,
    currency: 'USD',
    calculationMethod: '$0.50 per minute over 15 min limit',
    status: 'Collected',
    collectionDate: '2025-12-22',
    createdAt: '2025-12-17T15:15:00Z',
    createdBy: 'system',
    updatedAt: '2025-12-22T09:00:00Z',
    severity: 'Low',
    isRecurring: false,
    isDisputed: false
  },
  
  // Continue with more fines
  {
    id: 'fine-016',
    fineId: 'FINE-016',
    employeeId: 'emp-003',
    employeeName: 'Emily Rodriguez',
    employeeNumber: 'EMP-003',
    department: 'Design',
    violationType: 'Late Arrival',
    ruleTrigger: 'Late Clock In > 15 min',
    reason: 'Car trouble',
    incidentDate: '2025-12-16',
    incidentTime: '09:38 AM',
    duration: '38 min',
    amount: 19.00,
    currency: 'USD',
    calculationMethod: '$0.50 per minute after 15 min grace',
    status: 'Collected',
    collectionDate: '2025-12-20',
    createdAt: '2025-12-16T09:40:00Z',
    createdBy: 'system',
    updatedAt: '2025-12-20T09:00:00Z',
    severity: 'Low',
    isRecurring: false,
    isDisputed: false
  },
  
  {
    id: 'fine-017',
    fineId: 'FINE-017',
    employeeId: 'emp-007',
    employeeName: 'Maria Garcia',
    employeeNumber: 'EMP-007',
    department: 'Engineering',
    violationType: 'Missed Clock Out',
    ruleTrigger: 'No Clock Out Recorded',
    reason: 'System error or forgot',
    incidentDate: '2025-12-15',
    incidentTime: '05:00 PM',
    amount: 12.00,
    currency: 'USD',
    calculationMethod: 'Fixed penalty',
    status: 'Waived',
    waivedDate: '2025-12-16',
    waivedBy: 'Robert Taylor',
    waivedReason: 'System outage confirmed',
    createdAt: '2025-12-16T08:00:00Z',
    createdBy: 'system',
    updatedAt: '2025-12-16T10:00:00Z',
    severity: 'Low',
    isRecurring: false,
    isDisputed: false
  },
  
  {
    id: 'fine-018',
    fineId: 'FINE-018',
    employeeId: 'emp-009',
    employeeName: 'Jennifer Martinez',
    employeeNumber: 'EMP-009',
    department: 'Engineering',
    violationType: 'Late Arrival',
    ruleTrigger: 'Late Clock In > 15 min',
    reason: 'First day confusion about start time',
    incidentDate: '2025-11-01',
    incidentTime: '09:45 AM',
    duration: '45 min',
    amount: 22.50,
    currency: 'USD',
    calculationMethod: '$0.50 per minute after 15 min grace',
    status: 'Waived',
    waivedDate: '2025-11-02',
    waivedBy: 'Lisa Anderson',
    waivedReason: 'First day, onboarding confusion',
    createdAt: '2025-11-01T09:50:00Z',
    createdBy: 'system',
    updatedAt: '2025-11-02T09:00:00Z',
    severity: 'Low',
    isRecurring: false,
    isDisputed: false
  },
  
  {
    id: 'fine-019',
    fineId: 'FINE-019',
    employeeId: 'emp-010',
    employeeName: 'Alex Thompson',
    employeeNumber: 'EMP-010',
    department: 'Marketing',
    violationType: 'Extended Break',
    ruleTrigger: 'Break > 30 min',
    reason: 'Lunch meeting ran over',
    incidentDate: '2025-12-14',
    incidentTime: '12:00 PM',
    duration: '20 min',
    amount: 10.00,
    currency: 'USD',
    calculationMethod: '$0.50 per minute over limit',
    status: 'Collected',
    collectionDate: '2025-12-18',
    createdAt: '2025-12-14T12:55:00Z',
    createdBy: 'system',
    updatedAt: '2025-12-18T09:00:00Z',
    severity: 'Low',
    isRecurring: false,
    isDisputed: false
  },
  
  {
    id: 'fine-020',
    fineId: 'FINE-020',
    employeeId: 'emp-002',
    employeeName: 'Michael Chen',
    employeeNumber: 'EMP-002',
    department: 'Engineering',
    violationType: 'Schedule Violation',
    ruleTrigger: 'Worked unauthorized overtime',
    reason: 'Worked on weekend without approval',
    incidentDate: '2025-12-13',
    incidentTime: '09:00 AM',
    amount: 0.00,
    currency: 'USD',
    calculationMethod: 'Warning only',
    status: 'Waived',
    waivedDate: '2025-12-14',
    waivedBy: 'Robert Taylor',
    waivedReason: 'Critical bug fix, approved retroactively',
    createdAt: '2025-12-14T08:00:00Z',
    createdBy: 'Robert Taylor',
    updatedAt: '2025-12-14T10:00:00Z',
    severity: 'Low',
    isRecurring: false,
    isDisputed: false
  },
  
  // Add 5 more to reach 25
  {
    id: 'fine-021',
    fineId: 'FINE-021',
    employeeId: 'emp-001',
    employeeName: 'Sarah Johnson',
    employeeNumber: 'EMP-001',
    department: 'Product',
    violationType: 'Early Departure',
    ruleTrigger: 'Left > 15 min before shift end',
    reason: 'Doctor appointment',
    incidentDate: '2025-12-12',
    incidentTime: '04:30 PM',
    duration: '30 min',
    amount: 15.00,
    currency: 'USD',
    calculationMethod: '$0.50 per minute',
    status: 'Collected',
    collectionDate: '2025-12-15',
    createdAt: '2025-12-12T16:35:00Z',
    createdBy: 'system',
    updatedAt: '2025-12-15T09:00:00Z',
    severity: 'Low',
    isRecurring: false,
    isDisputed: false
  },
  
  {
    id: 'fine-022',
    fineId: 'FINE-022',
    employeeId: 'emp-003',
    employeeName: 'Emily Rodriguez',
    employeeNumber: 'EMP-003',
    department: 'Design',
    violationType: 'Missed Clock In',
    ruleTrigger: 'No Clock In Recorded',
    reason: 'Arrived but forgot to clock in',
    incidentDate: '2025-12-11',
    incidentTime: '09:00 AM',
    amount: 10.00,
    currency: 'USD',
    calculationMethod: 'Fixed penalty',
    status: 'Collected',
    collectionDate: '2025-12-14',
    createdAt: '2025-12-11T17:00:00Z',
    createdBy: 'system',
    updatedAt: '2025-12-14T09:00:00Z',
    severity: 'Low',
    isRecurring: false,
    isDisputed: false
  },
  
  {
    id: 'fine-023',
    fineId: 'FINE-023',
    employeeId: 'emp-007',
    employeeName: 'Maria Garcia',
    employeeNumber: 'EMP-007',
    department: 'Engineering',
    violationType: 'Extended Break',
    ruleTrigger: 'Lunch Break > 60 min',
    reason: 'Team lunch ran long',
    incidentDate: '2025-12-10',
    incidentTime: '12:00 PM',
    duration: '22 min',
    amount: 11.00,
    currency: 'USD',
    calculationMethod: '$0.50 per minute over limit',
    status: 'Collected',
    collectionDate: '2025-12-13',
    createdAt: '2025-12-10T13:25:00Z',
    createdBy: 'system',
    updatedAt: '2025-12-13T09:00:00Z',
    severity: 'Low',
    isRecurring: false,
    isDisputed: false
  },
  
  {
    id: 'fine-024',
    fineId: 'FINE-024',
    employeeId: 'emp-009',
    employeeName: 'Jennifer Martinez',
    employeeNumber: 'EMP-009',
    department: 'Engineering',
    violationType: 'Break Violation',
    ruleTrigger: 'Break taken outside allowed window',
    reason: 'Took break during core hours',
    incidentDate: '2025-12-09',
    incidentTime: '11:00 AM',
    amount: 15.00,
    currency: 'USD',
    calculationMethod: 'Fixed penalty for policy violation',
    status: 'Pending',
    correctionId: 'corr-002',
    createdAt: '2025-12-09T11:20:00Z',
    createdBy: 'system',
    updatedAt: '2025-12-09T11:20:00Z',
    severity: 'Medium',
    isRecurring: false,
    isDisputed: false,
    notes: 'Needs manager review - probation employee'
  },
  
  {
    id: 'fine-025',
    fineId: 'FINE-025',
    employeeId: 'emp-010',
    employeeName: 'Alex Thompson',
    employeeNumber: 'EMP-010',
    department: 'Marketing',
    violationType: 'Late Arrival',
    ruleTrigger: 'Late Clock In > 15 min',
    reason: 'Internship schedule confusion',
    incidentDate: '2025-12-08',
    incidentTime: '09:20 AM',
    duration: '20 min',
    amount: 10.00,
    currency: 'USD',
    calculationMethod: '$0.50 per minute after grace period',
    status: 'Waived',
    waivedDate: '2025-12-09',
    waivedBy: 'David Kim',
    waivedReason: 'Part-time intern, schedule miscommunication',
    createdAt: '2025-12-08T09:25:00Z',
    createdBy: 'system',
    updatedAt: '2025-12-09T09:00:00Z',
    severity: 'Low',
    isRecurring: false,
    isDisputed: false
  },
  
  // Add 3 more for good measure (28 total)
  {
    id: 'fine-026',
    fineId: 'FINE-026',
    employeeId: 'emp-004',
    employeeName: 'David Kim',
    employeeNumber: 'EMP-004',
    department: 'Marketing',
    violationType: 'Unauthorized Absence',
    ruleTrigger: 'No show without notification',
    reason: 'Absent without prior approval',
    incidentDate: '2025-12-07',
    incidentTime: '09:00 AM',
    amount: 50.00,
    currency: 'USD',
    calculationMethod: 'Fixed penalty for no-show',
    status: 'Disputed',
    isDisputed: true,
    disputeReason: 'Medical emergency - documentation pending',
    disputeDate: '2025-12-08',
    createdAt: '2025-12-07T10:00:00Z',
    createdBy: 'system',
    updatedAt: '2025-12-08T14:00:00Z',
    severity: 'High',
    isRecurring: false
  },
  
  {
    id: 'fine-027',
    fineId: 'FINE-027',
    employeeId: 'emp-002',
    employeeName: 'Michael Chen',
    employeeNumber: 'EMP-002',
    department: 'Engineering',
    violationType: 'Late Arrival',
    ruleTrigger: 'Late Clock In > 15 min',
    reason: 'Client emergency call',
    incidentDate: '2025-12-06',
    incidentTime: '09:33 AM',
    duration: '33 min',
    amount: 16.50,
    currency: 'USD',
    calculationMethod: '$0.50 per minute after grace period',
    status: 'Waived',
    waivedDate: '2025-12-07',
    waivedBy: 'Robert Taylor',
    waivedReason: 'Handling critical customer issue',
    createdAt: '2025-12-06T09:35:00Z',
    createdBy: 'system',
    updatedAt: '2025-12-07T09:00:00Z',
    severity: 'Low',
    isRecurring: false,
    isDisputed: false
  },
  
  {
    id: 'fine-028',
    fineId: 'FINE-028',
    employeeId: 'emp-003',
    employeeName: 'Emily Rodriguez',
    employeeNumber: 'EMP-003',
    department: 'Design',
    violationType: 'Extended Break',
    ruleTrigger: 'Afternoon break > 15 min',
    reason: 'Coffee break extended',
    incidentDate: '2025-12-05',
    incidentTime: '03:00 PM',
    duration: '10 min',
    amount: 5.00,
    currency: 'USD',
    calculationMethod: '$0.50 per minute over limit',
    status: 'Collected',
    collectionDate: '2025-12-08',
    createdAt: '2025-12-05T15:12:00Z',
    createdBy: 'system',
    updatedAt: '2025-12-08T09:00:00Z',
    severity: 'Low',
    isRecurring: false,
    isDisputed: false
  }
];

// Calculate statistics from mock data
export const mockFineStats: FineStats = {
  totalFines: mockFines.length,
  pendingFines: mockFines.filter(f => f.status === 'Pending').length,
  collectedFines: mockFines.filter(f => f.status === 'Collected').length,
  waivedFines: mockFines.filter(f => f.status === 'Waived').length,
  disputedFines: mockFines.filter(f => f.status === 'Disputed').length,
  
  totalAmount: mockFines.reduce((sum, f) => sum + f.amount, 0),
  collectedAmount: mockFines.filter(f => f.status === 'Collected').reduce((sum, f) => sum + f.amount, 0),
  waivedAmount: mockFines.filter(f => f.status === 'Waived').reduce((sum, f) => sum + f.amount, 0),
  pendingAmount: mockFines.filter(f => f.status === 'Pending').reduce((sum, f) => sum + f.amount, 0),
  
  byViolationType: mockFines.reduce((acc, f) => {
    acc[f.violationType] = (acc[f.violationType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>),
  
  byDepartment: mockFines.reduce((acc, f) => {
    acc[f.department] = (acc[f.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>),
  
  byEmployee: Object.values(
    mockFines.reduce((acc, f) => {
      if (!acc[f.employeeId]) {
        acc[f.employeeId] = {
          employeeId: f.employeeId,
          employeeName: f.employeeName,
          count: 0,
          totalAmount: 0
        };
      }
      acc[f.employeeId].count++;
      acc[f.employeeId].totalAmount += f.amount;
      return acc;
    }, {} as Record<string, any>)
  ).sort((a, b) => b.count - a.count).slice(0, 10),
  
  avgFineAmount: mockFines.reduce((sum, f) => sum + f.amount, 0) / mockFines.length,
  recurringViolations: mockFines.filter(f => f.isRecurring).length,
  waiveRate: (mockFines.filter(f => f.status === 'Waived').length / mockFines.length) * 100
};
