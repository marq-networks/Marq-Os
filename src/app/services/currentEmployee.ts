import { useEffect, useMemo, useState } from 'react';
import type { AuthUser, Employee } from './types';
import { useAuthService } from './ServiceProvider';
import { usePeopleData } from './hooks';

export function useCurrentEmployee() {
  const authService = useAuthService();
  const { employees, loading } = usePeopleData();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    authService.getCurrentUser().then(setCurrentUser).catch(() => setCurrentUser(null));
  }, [authService]);

  const employee = useMemo<Employee | null>(() => {
    if (!employees.length) return null;
    return (
      employees.find((item) => item.email === currentUser?.email) ||
      employees.find((item) => item.name === currentUser?.name) ||
      employees[0] ||
      null
    );
  }, [currentUser?.email, currentUser?.name, employees]);

  return {
    currentUser,
    employee,
    employeeId: employee?.id ?? null,
    employeeName: employee?.name ?? currentUser?.name ?? 'Current User',
    loading,
  };
}
