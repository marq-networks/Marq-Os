import { useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import {
  Plug, Search, CheckCircle2, Circle, Settings, ExternalLink, Zap, RefreshCw,
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  connected: boolean;
  lastSync?: string;
  status: 'Connected' | 'Available' | 'Coming Soon';
}

const INTEGRATIONS: Integration[] = [
  { id: 'i1', name: 'Slack', description: 'Send notifications and updates to Slack channels', category: 'Communication', icon: '💬', connected: true, lastSync: '2026-03-04T10:00:00Z', status: 'Connected' },
  { id: 'i2', name: 'Google Workspace', description: 'Sync calendar, emails, and Drive files', category: 'Productivity', icon: '📧', connected: true, lastSync: '2026-03-04T09:30:00Z', status: 'Connected' },
  { id: 'i3', name: 'Jira', description: 'Sync tasks and project tracking with Jira', category: 'Project Management', icon: '🎯', connected: true, lastSync: '2026-03-04T08:00:00Z', status: 'Connected' },
  { id: 'i4', name: 'GitHub', description: 'Track commits, PRs, and code activity', category: 'Development', icon: '🐙', connected: true, lastSync: '2026-03-04T10:15:00Z', status: 'Connected' },
  { id: 'i5', name: 'QuickBooks', description: 'Sync payroll and financial data', category: 'Finance', icon: '💰', connected: false, status: 'Available' },
  { id: 'i6', name: 'Microsoft Teams', description: 'Chat integration and video conferencing', category: 'Communication', icon: '📱', connected: false, status: 'Available' },
  { id: 'i7', name: 'Figma', description: 'Track design activity and file changes', category: 'Design', icon: '🎨', connected: false, status: 'Available' },
  { id: 'i8', name: 'Notion', description: 'Sync documents and knowledge base', category: 'Productivity', icon: '📝', connected: false, status: 'Available' },
  { id: 'i9', name: 'Salesforce', description: 'CRM data sync and pipeline tracking', category: 'Sales', icon: '☁️', connected: false, status: 'Available' },
  { id: 'i10', name: 'Zapier', description: 'Connect with 5000+ apps via automations', category: 'Automation', icon: '⚡', connected: false, status: 'Available' },
  { id: 'i11', name: 'HubSpot', description: 'Marketing automation and CRM', category: 'Marketing', icon: '🔶', connected: false, status: 'Coming Soon' },
  { id: 'i12', name: 'Bamboo HR', description: 'HR information system sync', category: 'HR', icon: '🌿', connected: false, status: 'Coming Soon' },
];

const CATEGORY_COLOR: Record<string, string> = {
  Communication: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  Productivity: 'bg-green-500/10 text-green-700 dark:text-green-400',
  'Project Management': 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  Development: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
  Finance: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  Design: 'bg-pink-500/10 text-pink-700 dark:text-pink-400',
  Sales: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
  Automation: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  Marketing: 'bg-red-500/10 text-red-700 dark:text-red-400',
  HR: 'bg-teal-500/10 text-teal-700 dark:text-teal-400',
};

export function IntegrationsIntegrations() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [integrations, setIntegrations] = useState(INTEGRATIONS);

  const categories = [...new Set(INTEGRATIONS.map(i => i.category))];

  const filtered = integrations.filter(i => {
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || i.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const connected = integrations.filter(i => i.connected);
  const available = filtered.filter(i => !i.connected && i.status === 'Available');
  const comingSoon = filtered.filter(i => i.status === 'Coming Soon');

  const handleConnect = (id: string) => {
    setIntegrations(prev => prev.map(i =>
      i.id === id ? { ...i, connected: true, status: 'Connected' as const, lastSync: new Date().toISOString() } : i
    ));
  };

  const handleDisconnect = (id: string) => {
    if (window.confirm('Disconnect this integration?')) {
      setIntegrations(prev => prev.map(i =>
        i.id === id ? { ...i, connected: false, status: 'Available' as const, lastSync: undefined } : i
      ));
    }
  };

  return (
    <PageLayout
      title="Integrations"
      description="Connect third-party tools and services to your workspace"
      kpis={[
        { title: 'Connected', value: connected.length, change: `of ${integrations.length} available`, changeType: 'positive', icon: <CheckCircle2 className="h-5 w-5" /> },
        { title: 'Available', value: integrations.filter(i => i.status === 'Available').length, change: 'Ready to connect', changeType: 'neutral', icon: <Plug className="h-5 w-5" /> },
        { title: 'Coming Soon', value: comingSoon.length, change: 'In development', changeType: 'info', icon: <Zap className="h-5 w-5" /> },
        { title: 'Categories', value: categories.length, change: 'Integration types', changeType: 'neutral', icon: <Settings className="h-5 w-5" /> },
      ]}
    >
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search integrations..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs ${categoryFilter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/70'}`}
          >
            All
          </button>
          {categories.slice(0, 6).map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(categoryFilter === cat ? 'all' : cat)}
              className={`px-3 py-1.5 rounded-full text-xs ${categoryFilter === cat ? 'bg-primary text-primary-foreground' : CATEGORY_COLOR[cat] || 'bg-muted'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {/* Connected */}
        {connected.length > 0 && (
          <div>
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Connected ({connected.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connected.filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase())).map(intg => (
                <div key={intg.id} className="rounded-lg border border-green-200 dark:border-green-900 bg-card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{intg.icon}</span>
                      <div>
                        <h4 className="font-medium">{intg.name}</h4>
                        <StatusBadge type="success">Connected</StatusBadge>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{intg.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Last sync: {intg.lastSync ? new Date(intg.lastSync).toLocaleTimeString() : '—'}
                    </span>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost">
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDisconnect(intg.id)}>
                        Disconnect
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available */}
        {available.length > 0 && (
          <div>
            <h3 className="font-medium mb-4 text-muted-foreground">Available ({available.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {available.map(intg => (
                <div key={intg.id} className="rounded-lg border border-border bg-card p-5 hover:shadow-sm transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">{intg.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-medium">{intg.name}</h4>
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full ${CATEGORY_COLOR[intg.category] || 'bg-muted'}`}>
                        {intg.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">{intg.description}</p>
                  <Button size="sm" className="w-full" onClick={() => handleConnect(intg.id)}>
                    <Plug className="h-3 w-3 mr-1.5" /> Connect
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coming Soon */}
        {comingSoon.length > 0 && (
          <div>
            <h3 className="font-medium mb-4 text-muted-foreground">Coming Soon ({comingSoon.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comingSoon.map(intg => (
                <div key={intg.id} className="rounded-lg border border-border bg-card p-5 opacity-60">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">{intg.icon}</span>
                    <div>
                      <h4 className="font-medium">{intg.name}</h4>
                      <StatusBadge type="info">Coming Soon</StatusBadge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{intg.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
