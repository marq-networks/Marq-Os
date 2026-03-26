import { DynamicSidebar } from './components/DynamicSidebar';
import { Router, Route, useRouter } from './components/router';
import { RoleGuard } from './components/auth/RoleGuard';
import { RouteGuard } from './components/RouteGuard';
import { mockUser, mockCurrentOrg, mockOrganizations } from './data/mockData';
import { useState, useEffect } from 'react';
import { ToastProvider } from './components/ui/toast';
import { initializeRole, getActiveRole, setActiveRole, subscribeToRoleChanges } from './state/roleStore';
import { getDefaultRouteForRole } from './nav/getNavForRole';
import type { RoleKey } from './state/roleStore';
import { DevRoleSwitcher } from './components/DevRoleSwitcher';
import { ChatDockProvider, ChatDock } from './components/chat-dock';
import { ExecutionOSProvider } from './contexts/ExecutionOSContext';
import { LoginScreen } from './components/screens/auth/LoginScreen';
import type { LoginRole } from './components/screens/auth/LoginScreen';
import { AppShell } from './components/shared/AppShell';
import { ServiceProvider } from './services';
import { ErrorBoundary } from './components/ErrorBoundary';
// FL-010: Auth session abstracted into AuthSession.ts (sessionStorage, not localStorage)
// SWAP: replace with HttpOnly cookie calls per AuthSession.ts PRODUCTION SWAP docs.
import { isAuthenticated, getAuthRole, setAuthenticated, clearAuth } from './services/AuthSession';

// Navigation System
import { generateRoutes, validateRouteRegistry } from './navigation';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MOCK USER DATA PER ROLE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const ROLE_USERS: Record<RoleKey, typeof mockUser> = {
  employee: {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'Product Manager',
    avatar: undefined,
  },
  org_admin: {
    name: 'Alex Rivera',
    email: 'admin@company.com',
    role: 'Organization Admin',
    avatar: undefined,
  },
  platform_admin: {
    name: 'Jordan Mitchell',
    email: 'platform@workos.io',
    role: 'Platform Administrator',
    avatar: undefined,
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ROLE-BASED REDIRECT HELPER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function RoleBasedRedirect() {
  const { navigate } = useRouter();
  
  useEffect(() => {
    const currentRole = getActiveRole();
    const defaultRoute = getDefaultRouteForRole(currentRole);
    navigate(defaultRoute);
  }, [navigate]);
  
  return <div>Redirecting...</div>;
}

function AppContent({ onLogout }: { onLogout: () => void }) {
  const { currentPath, navigate } = useRouter();
  const [activeRole, setActiveRoleState] = useState<RoleKey>(getActiveRole());

  // Validate route registry in development
  useEffect(() => {
    if (import.meta.env.DEV) {
      validateRouteRegistry();
    }
  }, []);

  // Subscribe to role changes
  useEffect(() => {
    const unsubscribe = subscribeToRoleChanges(setActiveRoleState);
    return unsubscribe;
  }, []);

  // Listen for navigation events from NotificationCenter and other components
  useEffect(() => {
    const handler = (e: Event) => {
      const path = (e as CustomEvent).detail?.path;
      if (path) navigate(path);
    };
    window.addEventListener('workos-navigate', handler);
    return () => window.removeEventListener('workos-navigate', handler);
  }, [navigate]);

  // Handle role change (from topbar switcher)
  const handleRoleChange = (role: RoleKey) => {
    setActiveRole(role);
    setAuthenticated(role); // Update auth state too
    const defaultRoute = getDefaultRouteForRole(role);
    navigate(defaultRoute);
  };

  // Get user data for current role
  const currentUser = ROLE_USERS[activeRole] || mockUser;

  return (
    <AppShell
      sidebarContent={<DynamicSidebar />}
      currentUser={currentUser}
      currentOrg={mockCurrentOrg}
      organizations={mockOrganizations}
      notificationCount={5}
      activeRole={activeRole}
      onRoleChange={handleRoleChange}
      onLogout={onLogout}
    >
      {/* Root redirect */}
      <Route path="/">
        <RoleBasedRedirect />
      </Route>
      
      {/* Login redirect (if somehow navigated to /login while authenticated) */}
      <Route path="/login">
        <RoleBasedRedirect />
      </Route>
      
      {/* All routes auto-generated from navigation registry */}
      {generateRoutes()}
    </AppShell>
  );
}

// Initialize role on module load
initializeRole();

export default function App() {
  const [authed, setAuthed] = useState(isAuthenticated());
  
  const handleLogin = (role: LoginRole) => {
    setActiveRole(role);
    setAuthenticated(role);
    setAuthed(true);
  };

  const handleLogout = () => {
    clearAuth();
    setAuthed(false);
  };

  // Not authenticated — show login
  if (!authed) {
    return (
      <ToastProvider>
        <LoginScreen onLogin={handleLogin} />
      </ToastProvider>
    );
  }

  // Authenticated — show app
  const currentRole = getActiveRole();
  const initialPath = getDefaultRouteForRole(currentRole);
  
  return (
    <ErrorBoundary>
      <Router initialPath={initialPath}>
        <ToastProvider>
          <ServiceProvider>
            <ExecutionOSProvider>
              <ChatDockProvider>
                <RouteGuard>
                  <AppContent onLogout={handleLogout} />
                </RouteGuard>
                <DevRoleSwitcher />
                <ChatDock />
              </ChatDockProvider>
            </ExecutionOSProvider>
          </ServiceProvider>
        </ToastProvider>
      </Router>
    </ErrorBoundary>
  );
}