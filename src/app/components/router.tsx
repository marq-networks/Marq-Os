// Simple client-side router
import { createContext, useContext, useState, ReactNode } from 'react';

interface RouterContextType {
  currentPath: string;
  navigate: (path: string) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export function Router({ children, initialPath = '/employee/dashboard' }: { children: ReactNode; initialPath?: string }) {
  const [currentPath, setCurrentPath] = useState(initialPath);

  const navigate = (path: string) => {
    setCurrentPath(path);
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
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
  return currentPath === path ? <>{children}</> : null;
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
