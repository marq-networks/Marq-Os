/**
 * CONSOLIDATION BRIDGE — Phase 14 gap closure (FL-001)
 *
 * The legacy FinanceIntelligence (screens/finance/) used useLedger() from ledgerStore.
 * The canonical implementation is now FC10FinanceIntelligence (screens/org/) which
 * is wired to hardcoded AI insights (pending ENDPOINTS.FINANCE_INTELLIGENCE backend).
 *
 * Route /finance/intelligence now renders the same component as /org/finance/intelligence.
 * The legacy screens/finance/FinanceIntelligence.tsx is deprecated.
 */
export { FC10FinanceIntelligence as FinanceIntelligence } from '../org/FC10FinanceIntelligence';
