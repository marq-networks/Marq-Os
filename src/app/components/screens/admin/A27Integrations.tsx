import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { StatusBadge } from '../../shared/StatusBadge';
import { Link, Plus, Settings } from 'lucide-react';

export function A27Integrations() {
  const integrations = [
    {
      id: '1',
      name: 'Slack',
      description: 'Team communication and notifications',
      category: 'Communication',
      status: 'Connected',
      logo: '💬'
    },
    {
      id: '2',
      name: 'Google Workspace',
      description: 'Calendar sync and email integration',
      category: 'Productivity',
      status: 'Connected',
      logo: '📧'
    },
    {
      id: '3',
      name: 'Jira',
      description: 'Project management and issue tracking',
      category: 'Project Management',
      status: 'Connected',
      logo: '🔷'
    },
    {
      id: '4',
      name: 'GitHub',
      description: 'Code repository integration',
      category: 'Development',
      status: 'Available',
      logo: '🐙'
    },
    {
      id: '5',
      name: 'QuickBooks',
      description: 'Accounting and payroll integration',
      category: 'Finance',
      status: 'Available',
      logo: '💰'
    },
    {
      id: '6',
      name: 'Zapier',
      description: 'Connect to 3,000+ apps',
      category: 'Automation',
      status: 'Available',
      logo: '⚡'
    }
  ];

  return (
    <PageLayout
      title="ADMIN – A-27 – Integrations & API – v1.1"
      description="Manage third-party integrations"
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Integration
        </Button>
      }
      kpis={[
        {
          title: 'Active',
          value: '3',
          change: 'Integrations',
          changeType: 'positive',
          icon: <Link className="h-5 w-5" />
        },
        {
          title: 'Available',
          value: '24',
          change: 'Ready to connect',
          changeType: 'info',
          icon: <Link className="h-5 w-5" />
        },
        {
          title: 'API Calls',
          value: '12.4K',
          change: 'This month',
          changeType: 'neutral',
          icon: <Link className="h-5 w-5" />
        },
        {
          title: 'API Keys',
          value: '2',
          change: 'Active',
          changeType: 'neutral',
          icon: <Link className="h-5 w-5" />
        },
      ]}
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-6">Available Integrations</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {integrations.map((integration) => (
              <div key={integration.id} className="rounded-lg border border-border p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{integration.logo}</span>
                    <div>
                      <h4 className="mb-0.5">{integration.name}</h4>
                      <p className="text-xs text-muted-foreground">{integration.category}</p>
                    </div>
                  </div>
                  <StatusBadge type={integration.status === 'Connected' ? 'success' : 'neutral'}>
                    {integration.status}
                  </StatusBadge>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">{integration.description}</p>
                <div className="flex gap-2">
                  {integration.status === 'Connected' ? (
                    <>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Settings className="mr-1 h-3 w-3" />
                        Configure
                      </Button>
                      <Button size="sm" variant="outline">
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" className="w-full">
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
