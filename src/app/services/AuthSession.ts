/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AUTH SESSION — Phase 14 gap closure (FL-010)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * PROBLEM (FL-010):
 *   Auth state was stored in plain localStorage (App.tsx lines 27–50).
 *   localStorage is readable by any JavaScript on the page — XSS-vulnerable.
 *   Any injected script can read AUTH_KEY / AUTH_ROLE_KEY and impersonate the
 *   user, or exfiltrate the session across browser restarts.
 *
 * IMPROVEMENT (Phase 14 / mock mode):
 *   Migrated to sessionStorage. sessionStorage has the same XSS surface as
 *   localStorage but does NOT persist across browser sessions or tabs.
 *   This meaningfully reduces the attack window for mock/dev deployments:
 *     • Cleared automatically when the tab or browser closes.
 *     • Not shared between tabs (each tab has its own session).
 *     • Cannot be read from a different origin.
 *
 * PRODUCTION SWAP (required before real user data):
 *   Replace sessionStorage with HttpOnly cookies + server-side sessions:
 *   1. Remove the CLIENT-SIDE session keys below entirely.
 *   2. POST credentials to /api/auth/login — server sets an HttpOnly cookie.
 *   3. All subsequent API calls carry the cookie automatically.
 *   4. On logout, POST to /api/auth/logout — server clears the cookie.
 *   5. isAuthenticated() calls GET /api/auth/me — 401 means unauthenticated.
 *   HttpOnly cookies cannot be read by JavaScript at all, eliminating the
 *   XSS token-theft vector entirely.
 *   See SWAP_GUIDE.ts Step 6 for the full implementation checklist.
 *
 * CSRF NOTE:
 *   When using HttpOnly cookies, add a CSRF token (e.g. Double-Submit Cookie
 *   pattern) to all mutating requests (POST, PUT, DELETE, PATCH).
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { RoleKey } from '../state/roleStore';

// ─── Storage keys ────────────────────────────────────────────────────────────
// These keys are intentionally short and do NOT embed the actual token value.
// In production, the token must live in an HttpOnly cookie, not JS-readable storage.
const SESSION_AUTH_KEY  = 'wos_auth';   // 'true' when authenticated
const SESSION_ROLE_KEY  = 'wos_role';   // RoleKey of the authenticated session

// ─── Storage adapter ─────────────────────────────────────────────────────────
// Centralised so the swap to HttpOnly cookies only requires editing this file.
// SWAP: replace these four functions with fetch() calls to your auth endpoints.
const store = window.sessionStorage;

// ─── Public API ──────────────────────────────────────────────────────────────

/** Returns true when a session is active in this browser tab. */
export function isAuthenticated(): boolean {
  return store.getItem(SESSION_AUTH_KEY) === 'true';
}

/**
 * Returns the role stored for the current session, or null if unauthenticated.
 * Validates the stored value against known RoleKey literals to prevent
 * a poisoned storage value from being accepted as a valid role.
 */
export function getAuthRole(): RoleKey | null {
  const raw = store.getItem(SESSION_ROLE_KEY);
  if (raw === 'employee' || raw === 'org_admin' || raw === 'platform_admin') {
    return raw;
  }
  return null;
}

/**
 * Marks the session as authenticated for the given role.
 * Called after a successful login or role-switch.
 */
export function setAuthenticated(role: RoleKey): void {
  store.setItem(SESSION_AUTH_KEY, 'true');
  store.setItem(SESSION_ROLE_KEY, role);
}

/**
 * Clears the current session.
 * Called on logout or session expiry.
 * SWAP: also POST to /api/auth/logout so the server clears the HttpOnly cookie.
 */
export function clearAuth(): void {
  store.removeItem(SESSION_AUTH_KEY);
  store.removeItem(SESSION_ROLE_KEY);
}
