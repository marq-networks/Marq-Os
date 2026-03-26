import { useRouter } from '../../router';
import { 
  Inbox, 
  Plus, 
  FileText, 
  Upload, 
  Brain, 
  Calculator, 
  BarChart3, 
  Settings 
} from 'lucide-react';

interface FinanceSubNavItem {
  id: string;
  label: string;
  icon: any;
  path: string;
  badge?: number;
}

const financeSubNavItems: FinanceSubNavItem[] = [
  { id: 'inbox', label: 'Inbox', icon: Inbox, path: '/org/finance/inbox', badge: 3 },
  { id: 'quick-add', label: 'Quick Add', icon: Plus, path: '/org/finance/quick-add' },
  { id: 'transactions', label: 'Transactions', icon: FileText, path: '/org/finance/transactions' },
  { id: 'import', label: 'Import Center', icon: Upload, path: '/org/finance/import' },
  { id: 'logic', label: 'Logic Center', icon: Brain, path: '/org/finance/logic' },
  { id: 'costing', label: 'Costing', icon: Calculator, path: '/org/finance/costing' },
  { id: 'reports', label: 'Reports', icon: BarChart3, path: '/org/finance/reports' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/org/finance/settings' },
];

export function FinanceSubNav() {
  const { currentPath, navigate } = useRouter();

  // Only show sub-nav on finance pages (but not on the home page)
  if (!currentPath.startsWith('/org/finance') || currentPath === '/org/finance') {
    return null;
  }

  return (
    <div className="bg-card border-b border-border mb-6">
      <div className="flex items-center gap-1 overflow-x-auto">
        {financeSubNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs min-w-[1.25rem] text-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
