import { DynamicSidebar } from './components/DynamicSidebar';
import { Router, Route, useRouter } from './components/router';
import { RoleGuard } from './components/auth/RoleGuard';
import { RouteGuard } from './components/RouteGuard';
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
import { ServiceProvider, useAuthService, AuthApiService } from './services';
import type { AuthUser, Organization } from './services';
import { ErrorBoundary } from './components/ErrorBoundary';
import { isAuthenticated, setAuthenticated, clearAuth } from './services/AuthSession';

// Navigation System
import { generateRoutes, validateRouteRegistry } from './navigation';

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
  const { navigate } = useRouter();
  const authService = useAuthService();
  const [activeRole, setActiveRoleState] = useState<RoleKey>(getActiveRole());
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    if (import.meta.env.DEV) {
      validateRouteRegistry();
    }
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToRoleChanges(setActiveRoleState);
    return unsubscribe;
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const path = (e as CustomEvent).detail?.path;
      if (path) navigate(path);
    };
    window.addEventListener('workos-navigate', handler);
    return () => window.removeEventListener('workos-navigate', handler);
  }, [navigate]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [user, activeOrganization, availableOrganizations] = await Promise.all([
          authService.getCurrentUser(),
          authService.getCurrentOrganization(),
          authService.getOrganizations(),
        ]);

        if (!mounted) {
          return;
        }

        setCurrentUser(user);
        setCurrentOrg(activeOrganization);
        setOrganizations(availableOrganizations);
      } catch {
        if (!mounted) {
          return;
        }

        clearAuth();
        window.location.reload();
      }
    })();

    return () => {
      mounted = false;
    };
  }, [authService, activeRole]);

  const handleRoleChange = (role: RoleKey) => {
    setActiveRole(role);
    setAuthenticated(role);
    const defaultRoute = getDefaultRouteForRole(role);
    navigate(defaultRoute);
  };

  const handleOrgSwitch = async (orgId: string) => {
    const response = await authService.switchOrganization(orgId);
    if (response.success && response.data) {
      setCurrentOrg(response.data);
    }
  };

  return (
    <AppShell
      sidebarContent={<DynamicSidebar />}
      currentUser={currentUser ? {
        name: currentUser.name,
        email: currentUser.email,
        avatar: currentUser.avatar,
        role: currentUser.role,
      } : undefined}
      currentOrg={currentOrg ? {
        name: currentOrg.name,
        logo: currentOrg.logo,
      } : undefined}
      organizations={organizations}
      notificationCount={5}
      onOrgSwitch={handleOrgSwitch}
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

const authApi = new AuthApiService();

export default function App() {
  const [authed, setAuthed] = useState(isAuthenticated());
  
  const handleLogin = async (role: LoginRole, email: string, password: string) => {
    const response = await authApi.login(email, password, role);
    if (!response.success) {
      return { success: false, error: response.error || 'Login failed' };
    }

    setActiveRole(role);
    setAuthenticated(role);
    setAuthed(true);
    return { success: true };
  };

  const handleRegister = async (name: string, email: string, password: string, organizationName: string) => {
    const response = await authApi.register(name, email, password, organizationName);
    if (!response.success || !response.data) {
      return { success: false, error: response.error || 'Create account failed' };
    }

    setActiveRole('org_admin');
    setAuthenticated('org_admin');
    setAuthed(true);
    return { success: true };
  };

  const handleLogout = async () => {
    await authApi.logout();
    clearAuth();
    setAuthed(false);
  };

  if (!authed) {
    return (
      <ToastProvider>
        <LoginScreen onLogin={handleLogin} onRegister={handleRegister} />
      </ToastProvider>
    );
  }

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
