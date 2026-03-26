/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FINANCE LEDGER STORE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Centralized append-only ledger for all financial transactions.
 * 
 * IMMUTABILITY RULES:
 * - Append-only: New entries can be added
 * - No deletion: Entries cannot be removed
 * - No edits: Use reversals/adjustments for corrections
 * - Auto-balancing: Running balance computed on every append
 */

export type EntryType = 
  | 'income' 
  | 'expense' 
  | 'salary' 
  | 'reimbursement' 
  | 'adjustment';

export interface LedgerEntry {
  id: string;
  timestamp: string; // ISO 8601
  date: string; // YYYY-MM-DD (transaction date)
  entryType: EntryType;
  reference: string; // Project / Employee / Vendor name
  referenceId?: string; // Optional FK to source entity
  description: string;
  debit: number; // Money out (expenses, salaries, reimbursements)
  credit: number; // Money in (income, adjustments)
  balance: number; // Running balance after this entry
  category?: string; // Optional categorization
  projectId?: string;
  employeeId?: string;
  vendorId?: string;
  createdBy?: string; // Actor who created this entry
  metadata?: Record<string, any>; // Additional context
}

// ═══════════════════════════════════════════════════════════════════════════
// INITIAL MOCK LEDGER DATA
// ═══════════════════════════════════════════════════════════════════════════

const OPENING_BALANCE = 500000; // Starting balance: $500,000

const initialEntries: Omit<LedgerEntry, 'id' | 'balance' | 'timestamp'>[] = [
  // December 2025 entries
  {
    date: '2025-12-01',
    entryType: 'income',
    reference: 'Acme Corporation',
    description: 'Website redesign project - Initial payment',
    debit: 0,
    credit: 50000,
    category: 'Project Revenue'
  },
  {
    date: '2025-12-02',
    entryType: 'expense',
    reference: 'AWS',
    description: 'Cloud hosting - December',
    debit: 2450,
    credit: 0,
    category: 'Infrastructure',
    vendorId: 'vendor-aws'
  },
  {
    date: '2025-12-03',
    entryType: 'expense',
    reference: 'Adobe',
    description: 'Creative Cloud - Team subscription',
    debit: 680,
    credit: 0,
    category: 'Software',
    vendorId: 'vendor-adobe'
  },
  {
    date: '2025-12-05',
    entryType: 'income',
    reference: 'TechStart Inc',
    description: 'Mobile app development - Milestone 2',
    debit: 0,
    credit: 75000,
    category: 'Project Revenue',
    projectId: 'proj-002'
  },
  {
    date: '2025-12-07',
    entryType: 'expense',
    reference: 'Office Depot',
    description: 'Office supplies and furniture',
    debit: 1240,
    credit: 0,
    category: 'Office Expenses',
    vendorId: 'vendor-office-depot'
  },
  {
    date: '2025-12-10',
    entryType: 'expense',
    reference: 'Figma',
    description: 'Design tools - Annual subscription',
    debit: 1440,
    credit: 0,
    category: 'Software',
    vendorId: 'vendor-figma'
  },
  {
    date: '2025-12-12',
    entryType: 'reimbursement',
    reference: 'Sarah Chen',
    description: 'Client meeting travel expenses',
    debit: 450,
    credit: 0,
    category: 'Travel',
    employeeId: 'emp-001'
  },
  {
    date: '2025-12-15',
    entryType: 'salary',
    reference: 'Engineering Department',
    description: 'December payroll - Engineering team',
    debit: 84000,
    credit: 0,
    category: 'Payroll'
  },
  {
    date: '2025-12-15',
    entryType: 'salary',
    reference: 'Design Department',
    description: 'December payroll - Design team',
    debit: 32000,
    credit: 0,
    category: 'Payroll'
  },
  {
    date: '2025-12-15',
    entryType: 'salary',
    reference: 'Marketing Department',
    description: 'December payroll - Marketing team',
    debit: 24000,
    credit: 0,
    category: 'Payroll'
  },
  {
    date: '2025-12-15',
    entryType: 'salary',
    reference: 'Sales Department',
    description: 'December payroll - Sales team',
    debit: 38000,
    credit: 0,
    category: 'Payroll'
  },
  {
    date: '2025-12-15',
    entryType: 'salary',
    reference: 'Operations Department',
    description: 'December payroll - Operations team',
    debit: 18000,
    credit: 0,
    category: 'Payroll'
  },
  {
    date: '2025-12-15',
    entryType: 'salary',
    reference: 'Executive',
    description: 'December payroll - Executive team',
    debit: 16000,
    credit: 0,
    category: 'Payroll'
  },
  {
    date: '2025-12-18',
    entryType: 'income',
    reference: 'Global Ventures',
    description: 'Consulting services - Q4 2025',
    debit: 0,
    credit: 45000,
    category: 'Consulting Revenue'
  },
  {
    date: '2025-12-20',
    entryType: 'reimbursement',
    reference: 'Tom Harris',
    description: 'Ergonomic office chair',
    debit: 1150,
    credit: 0,
    category: 'Equipment',
    employeeId: 'emp-006'
  },
  {
    date: '2025-12-22',
    entryType: 'expense',
    reference: 'Slack',
    description: 'Team communication platform',
    debit: 280,
    credit: 0,
    category: 'Software',
    vendorId: 'vendor-slack'
  },
  {
    date: '2025-12-28',
    entryType: 'reimbursement',
    reference: 'Jessica Wong',
    description: 'Conference registration + hotel',
    debit: 680,
    credit: 0,
    category: 'Travel',
    employeeId: 'emp-005'
  },
  {
    date: '2025-12-30',
    entryType: 'expense',
    reference: 'WeWork',
    description: 'Office rent - December',
    debit: 8500,
    credit: 0,
    category: 'Rent'
  },
  {
    date: '2025-12-31',
    entryType: 'income',
    reference: 'RetailMax',
    description: 'E-commerce platform development',
    debit: 0,
    credit: 62000,
    category: 'Project Revenue',
    projectId: 'proj-005'
  },
  
  // January 2026 entries
  {
    date: '2026-01-02',
    entryType: 'income',
    reference: 'Acme Corporation',
    description: 'Website redesign - Final payment',
    debit: 0,
    credit: 25000,
    category: 'Project Revenue',
    projectId: 'proj-001'
  },
  {
    date: '2026-01-02',
    entryType: 'expense',
    reference: 'AWS',
    description: 'Cloud hosting - January',
    debit: 2680,
    credit: 0,
    category: 'Infrastructure',
    vendorId: 'vendor-aws'
  },
  {
    date: '2026-01-03',
    entryType: 'reimbursement',
    reference: 'David Kim',
    description: 'Adobe Creative Suite subscription',
    debit: 320,
    credit: 0,
    category: 'Software',
    employeeId: 'emp-004'
  },
  {
    date: '2026-01-04',
    entryType: 'expense',
    reference: 'LinkedIn',
    description: 'Job postings and recruitment',
    debit: 450,
    credit: 0,
    category: 'HR & Recruitment',
    vendorId: 'vendor-linkedin'
  },
  {
    date: '2026-01-05',
    entryType: 'income',
    reference: 'StartupHub',
    description: 'Product strategy workshop - January',
    debit: 0,
    credit: 18000,
    category: 'Consulting Revenue'
  },
  {
    date: '2026-01-06',
    entryType: 'expense',
    reference: 'Google Workspace',
    description: 'Email and productivity suite',
    debit: 420,
    credit: 0,
    category: 'Software',
    vendorId: 'vendor-google'
  },
  {
    date: '2026-01-07',
    entryType: 'expense',
    reference: 'Zoom',
    description: 'Video conferencing - Annual plan',
    debit: 1800,
    credit: 0,
    category: 'Software',
    vendorId: 'vendor-zoom'
  },
  {
    date: '2026-01-07',
    entryType: 'income',
    reference: 'TechStart Inc',
    description: 'Mobile app - Milestone 3 payment',
    debit: 0,
    credit: 85000,
    category: 'Project Revenue',
    projectId: 'proj-002'
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// LEDGER STORE STATE
// ═══════════════════════════════════════════════════════════════════════════

class LedgerStore {
  private entries: LedgerEntry[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.initializeLedger();
  }

  private initializeLedger() {
    let runningBalance = OPENING_BALANCE;
    
    // Add opening balance entry
    const openingEntry: LedgerEntry = {
      id: 'entry-000',
      timestamp: '2025-12-01T00:00:00Z',
      date: '2025-12-01',
      entryType: 'adjustment',
      reference: 'Opening Balance',
      description: 'Initial ledger balance',
      debit: 0,
      credit: OPENING_BALANCE,
      balance: OPENING_BALANCE
    };
    this.entries.push(openingEntry);

    // Process all initial entries
    initialEntries.forEach((entry, index) => {
      const netChange = entry.credit - entry.debit;
      runningBalance += netChange;

      const ledgerEntry: LedgerEntry = {
        ...entry,
        id: `entry-${String(index + 1).padStart(3, '0')}`,
        timestamp: new Date(entry.date + 'T12:00:00Z').toISOString(),
        balance: runningBalance
      };

      this.entries.push(ledgerEntry);
    });

    // Sort by timestamp
    this.entries.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  /**
   * Append a new entry to the ledger (IMMUTABLE - append only)
   */
  appendEntry(entry: Omit<LedgerEntry, 'id' | 'balance' | 'timestamp'>): LedgerEntry {
    const lastEntry = this.entries[this.entries.length - 1];
    const currentBalance = lastEntry?.balance || OPENING_BALANCE;
    const netChange = entry.credit - entry.debit;
    const newBalance = currentBalance + netChange;

    const newEntry: LedgerEntry = {
      ...entry,
      id: `entry-${String(this.entries.length).padStart(3, '0')}`,
      timestamp: new Date().toISOString(),
      balance: newBalance
    };

    this.entries.push(newEntry);
    this.notifyListeners();
    
    return newEntry;
  }

  /**
   * Get all ledger entries (read-only)
   */
  getEntries(): readonly LedgerEntry[] {
    return [...this.entries];
  }

  /**
   * Get entries filtered by date range
   */
  getEntriesByDateRange(startDate: string, endDate: string): readonly LedgerEntry[] {
    return this.entries.filter(entry => {
      return entry.date >= startDate && entry.date <= endDate;
    });
  }

  /**
   * Get entries by type
   */
  getEntriesByType(type: EntryType): readonly LedgerEntry[] {
    return this.entries.filter(entry => entry.entryType === type);
  }

  /**
   * Get current balance
   */
  getCurrentBalance(): number {
    const lastEntry = this.entries[this.entries.length - 1];
    return lastEntry?.balance || OPENING_BALANCE;
  }

  /**
   * Get total credits (money in)
   */
  getTotalCredits(): number {
    return this.entries.reduce((sum, entry) => sum + entry.credit, 0);
  }

  /**
   * Get total debits (money out)
   */
  getTotalDebits(): number {
    return this.entries.reduce((sum, entry) => sum + entry.debit, 0);
  }

  /**
   * Subscribe to ledger changes
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════════════════════

export const ledgerStore = new LedgerStore();

// ═══════════════════════════════════════════════════════════════════════════
// REACT HOOK
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';

export function useLedger() {
  const [entries, setEntries] = useState<readonly LedgerEntry[]>(ledgerStore.getEntries());
  const [currentBalance, setCurrentBalance] = useState(ledgerStore.getCurrentBalance());

  useEffect(() => {
    const unsubscribe = ledgerStore.subscribe(() => {
      setEntries(ledgerStore.getEntries());
      setCurrentBalance(ledgerStore.getCurrentBalance());
    });

    return unsubscribe;
  }, []);

  return {
    entries,
    currentBalance,
    totalCredits: ledgerStore.getTotalCredits(),
    totalDebits: ledgerStore.getTotalDebits(),
    appendEntry: (entry: Omit<LedgerEntry, 'id' | 'balance' | 'timestamp'>) => 
      ledgerStore.appendEntry(entry),
    getEntriesByDateRange: (start: string, end: string) => 
      ledgerStore.getEntriesByDateRange(start, end),
    getEntriesByType: (type: EntryType) => 
      ledgerStore.getEntriesByType(type)
  };
}
