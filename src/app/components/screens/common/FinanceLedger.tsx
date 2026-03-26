/**
 * CONSOLIDATION BRIDGE — Phase 14 gap closure (FL-001)
 *
 * The legacy FinanceLedger (screens/finance/) used useLedger() from ledgerStore.
 * The canonical implementation is now FC04LedgerControl (screens/org/) which
 * is wired to the ServiceProvider finance domain.
 *
 * Route /finance/ledger now renders the same component as /org/finance/ledger-control.
 * The legacy screens/finance/FinanceLedger.tsx is deprecated.
 */
export { FC04LedgerControl as FinanceLedger } from '../org/FC04LedgerControl';
