/**
 * CONSOLIDATION BRIDGE — Phase 14 gap closure (FL-001)
 *
 * The legacy FinanceQuickAdd (screens/finance/) used useLedger() from ledgerStore.
 * The canonical implementation is now F02QuickAddOperational (screens/org/) which
 * is wired to the ServiceProvider finance domain.
 *
 * Route /finance/quick-add now renders the same component as /org/finance/quick-add.
 * The legacy screens/finance/FinanceQuickAdd.tsx is deprecated.
 */
export { F02QuickAddOperational as FinanceQuickAdd } from '../org/F02QuickAddOperational';
