/**
 * DomainSidebar - Domain-based navigation with role-based visibility
 * 
 * Displays navigation structure based on current role (Employee / Org Admin / Platform Admin)
 * Uses navigationMasterSkeleton.ts for complete domain architecture
 */

import { useState } from 'react';
import { ChevronRight, ChevronDown, LucideIcon } from 'lucide-react';
import { 
  employeeDomainNav, 
  adminDomainNav, 
  superAdminDomainNav,
  NavDomain,
  NavSection,
  NavItem
} from '../data/navigationMasterSkeleton';
import { useRouter } from './router';

interface DomainSidebarProps {
  currentMode?: 'WORKSPACE' | 'CONTROL' | 'PLATFORM';
}

export function DomainSidebar({ currentMode = 'WORKSPACE' }: DomainSidebarProps) {
  const { navigate } = useRouter();
  const [expandedDomains, setExpandedDomains] = useState<string[]>([]);

  // Select navigation based on current mode
  const domains = currentMode === 'WORKSPACE' 
    ? employeeDomainNav 
    : currentMode === 'CONTROL'
    ? adminDomainNav
    : superAdminDomainNav;

  const toggleDomain = (domainId: string) => {
    setExpandedDomains(prev => 
      prev.includes(domainId) 
        ? prev.filter(id => id !== domainId)
        : [...prev, domainId]
    );
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Domains</h2>
      </div>

      {/* Domain List */}
      <nav className="flex-1 overflow-y-auto py-2">
        <div className="space-y-1 px-2">
          {domains.map((domain) => {
            const isDomainExpanded = expandedDomains.includes(domain.id);
            const DomainIcon = domain.icon;

            return (
              <div key={domain.id} className="space-y-0.5">
                {/* Domain Header */}
                <button
                  onClick={() => toggleDomain(domain.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left hover:bg-accent transition-colors group"
                >
                  <DomainIcon className="h-4 w-4 text-muted-foreground group-hover:text-foreground flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground flex-1">
                    {domain.label}
                  </span>
                  {isDomainExpanded ? (
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  )}
                </button>

                {/* Domain Sections - Show when domain is expanded */}
                {isDomainExpanded && (
                  <div className="ml-3 space-y-2">
                    {domain.sections.map((section) => {
                      return (
                        <div key={section.id} className="space-y-0.5">
                          {/* Section Header - Only show if section has multiple items or meaningful label */}
                          {section.items.length > 1 && (
                            <div className="px-3 py-1">
                              <span className="text-xs font-medium text-muted-foreground">
                                {section.label}
                              </span>
                              <ChevronRight className="h-3 w-3 text-muted-foreground inline-block ml-1" />
                            </div>
                          )}

                          {/* Section Items - Always show when domain is expanded */}
                          <div className="space-y-0.5">
                            {section.items.map((item) => {
                              const ItemIcon = item.icon;
                              const isDisabled = item.disabled === true;
                              
                              return (
                                <button
                                  key={item.id}
                                  onClick={() => !isDisabled && handleNavigation(item.path)}
                                  className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-left transition-colors group ml-2 ${
                                    isDisabled 
                                      ? 'opacity-50 cursor-not-allowed' 
                                      : 'hover:bg-accent cursor-pointer'
                                  }`}
                                  title={item.description}
                                  disabled={isDisabled}
                                >
                                  <ItemIcon className={`h-3.5 w-3.5 flex-shrink-0 ${
                                    isDisabled 
                                      ? 'text-muted-foreground' 
                                      : 'text-muted-foreground group-hover:text-foreground'
                                  }`} />
                                  <span className={`text-xs flex-1 ${
                                    isDisabled 
                                      ? 'text-muted-foreground' 
                                      : 'text-muted-foreground group-hover:text-foreground'
                                  }`}>
                                    {item.label}
                                  </span>
                                  {item.badge !== undefined && item.badge > 0 && (
                                    <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 text-[10px] font-medium bg-primary text-primary-foreground rounded-full">
                                      {item.badge > 99 ? '99+' : item.badge}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
}