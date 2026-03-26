import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { GitBranch, Copy, Code } from 'lucide-react';
import { StatusBadge } from '../../shared/StatusBadge';

export function A28APIDocs() {
  const endpoints = [
    { method: 'GET', path: '/api/v1/users', description: 'List all users', auth: 'Required' },
    { method: 'POST', path: '/api/v1/users', description: 'Create new user', auth: 'Required' },
    { method: 'GET', path: '/api/v1/time-logs', description: 'Get time logs', auth: 'Required' },
    { method: 'POST', path: '/api/v1/time-logs', description: 'Create time log entry', auth: 'Required' },
    { method: 'GET', path: '/api/v1/departments', description: 'List departments', auth: 'Required' },
    { method: 'GET', path: '/api/v1/reports', description: 'Generate reports', auth: 'Required' },
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'POST':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'DELETE':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400';
    }
  };

  return (
    <PageLayout
      title="ADMIN – A-28 – API Docs – v1.1"
      description="API documentation and developer resources"
      actions={
        <Button>
          <Code className="mr-2 h-4 w-4" />
          View Full Docs
        </Button>
      }
      kpis={[
        {
          title: 'API Version',
          value: 'v1.2.0',
          icon: <GitBranch className="h-5 w-5" />
        },
        {
          title: 'Endpoints',
          value: '48',
          change: 'Available',
          changeType: 'neutral',
          icon: <GitBranch className="h-5 w-5" />
        },
        {
          title: 'Rate Limit',
          value: '1,000',
          change: 'Requests per hour',
          changeType: 'info',
          icon: <GitBranch className="h-5 w-5" />
        },
        {
          title: 'Uptime',
          value: '99.9%',
          change: 'Last 30 days',
          changeType: 'positive',
          icon: <GitBranch className="h-5 w-5" />
        },
      ]}
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-6">Authentication</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            All API requests require authentication using Bearer tokens. Include your API key in the Authorization header.
          </p>
          <div className="rounded-lg bg-muted p-4">
            <code className="text-sm">
              Authorization: Bearer YOUR_API_KEY_HERE
            </code>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3>API Endpoints</h3>
            <Button variant="outline" size="sm">
              <Copy className="mr-2 h-3 w-3" />
              Copy Base URL
            </Button>
          </div>
          <div className="space-y-3">
            {endpoints.map((endpoint, index) => (
              <div key={index} className="flex items-center gap-4 rounded-lg border border-border p-4">
                <span className={`rounded px-2 py-1 text-xs font-semibold ${getMethodColor(endpoint.method)}`}>
                  {endpoint.method}
                </span>
                <code className="flex-1 font-mono text-sm">{endpoint.path}</code>
                <span className="text-sm text-muted-foreground">{endpoint.description}</span>
                <StatusBadge type="warning">{endpoint.auth}</StatusBadge>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-6">Example Request</h3>
          <div className="rounded-lg bg-muted p-4">
            <pre className="text-sm">
{`curl -X GET "https://api.workos.com/v1/users" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
            </pre>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
