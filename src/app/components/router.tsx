import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

interface RouterContextType {
  currentPath: string;
  navigate: (path: string) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

function normalizePath(path: string) {
  const [pathname] = path.split(/[?#]/);
  if (!pathname) return '/';
  if (pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

function getBrowserPath() {
  if (typeof window === 'undefined') {
    return '/';
  }

  return normalizePath(`${window.location.pathname}${window.location.search}${window.location.hash}`);
}

export function Router({ children, initialPath = '/employee/dashboard' }: { children: ReactNode; initialPath?: string }) {
  const [currentPath, setCurrentPath] = useState(() => {
    const browserPath = getBrowserPath();
    return browserPath === '/' ? normalizePath(initialPath) : browserPath;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handlePopState = () => {
      setCurrentPath(getBrowserPath());
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = useCallback((path: string) => {
    const nextPath = normalizePath(path);

    if (typeof window !== 'undefined') {
      const browserPath = getBrowserPath();
      if (browserPath !== nextPath) {
        window.history.pushState({}, '', nextPath);
      }
    }

    setCurrentPath(prevPath => (prevPath === nextPath ? prevPath : nextPath));
  }, []);

  const value = useMemo(
    () => ({
      currentPath,
      navigate,
    }),
    [currentPath, navigate],
  );

  return (
    <RouterContext.Provider value={value}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a Router');
  }
  return context;
}

interface RouteProps {
  path: string;
  children: ReactNode;
}

export function Route({ path, children }: RouteProps) {
  const { currentPath } = useRouter();
  return currentPath === normalizePath(path) ? <>{children}</> : null;
}

interface NavLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}

export function NavLink({ to, children, className }: NavLinkProps) {
  const { navigate } = useRouter();
  return (
    <button onClick={() => navigate(to)} className={className}>
      {children}
    </button>
  );
}
