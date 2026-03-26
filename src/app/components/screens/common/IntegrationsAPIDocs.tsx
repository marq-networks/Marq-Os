import { useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import {
  Code, Search, Copy, Key, ExternalLink, BookOpen, Zap, Lock, CheckCircle2,
} from 'lucide-react';

interface APIEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  domain: string;
  auth: boolean;
  rateLimit: string;
}

const ENDPOINTS: APIEndpoint[] = [
  { id: 'e1', method: 'GET', path: '/api/v1/employees', description: 'List all employees with pagination and filters', domain: 'People', auth: true, rateLimit: '100/min' },
  { id: 'e2', method: 'POST', path: '/api/v1/employees', description: 'Create a new employee record', domain: 'People', auth: true, rateLimit: '50/min' },
  { id: 'e3', method: 'GET', path: '/api/v1/employees/:id', description: 'Get employee details by ID', domain: 'People', auth: true, rateLimit: '200/min' },
  { id: 'e4', method: 'PUT', path: '/api/v1/employees/:id', description: 'Update employee record', domain: 'People', auth: true, rateLimit: '50/min' },
  { id: 'e5', method: 'GET', path: '/api/v1/departments', description: 'List all departments', domain: 'People', auth: true, rateLimit: '100/min' },
  { id: 'e6', method: 'GET', path: '/api/v1/time/sessions', description: 'List time tracking sessions', domain: 'Time', auth: true, rateLimit: '100/min' },
  { id: 'e7', method: 'POST', path: '/api/v1/time/clock-in', description: 'Clock in an employee', domain: 'Time', auth: true, rateLimit: '30/min' },
  { id: 'e8', method: 'POST', path: '/api/v1/time/clock-out', description: 'Clock out an employee', domain: 'Time', auth: true, rateLimit: '30/min' },
  { id: 'e9', method: 'GET', path: '/api/v1/leave/requests', description: 'List leave requests', domain: 'Time', auth: true, rateLimit: '100/min' },
  { id: 'e10', method: 'POST', path: '/api/v1/leave/requests', description: 'Submit a leave request', domain: 'Time', auth: true, rateLimit: '20/min' },
  { id: 'e11', method: 'PATCH', path: '/api/v1/leave/requests/:id/approve', description: 'Approve a leave request', domain: 'Time', auth: true, rateLimit: '30/min' },
  { id: 'e12', method: 'GET', path: '/api/v1/analytics/activity', description: 'Get activity log entries', domain: 'Analytics', auth: true, rateLimit: '100/min' },
  { id: 'e13', method: 'GET', path: '/api/v1/analytics/productivity', description: 'Get productivity metrics', domain: 'Analytics', auth: true, rateLimit: '50/min' },
  { id: 'e14', method: 'GET', path: '/api/v1/finance/payroll', description: 'List payroll runs', domain: 'Finance', auth: true, rateLimit: '50/min' },
  { id: 'e15', method: 'GET', path: '/api/v1/notifications', description: 'Get user notifications', domain: 'Notifications', auth: true, rateLimit: '200/min' },
  { id: 'e16', method: 'DELETE', path: '/api/v1/employees/:id', description: 'Deactivate an employee', domain: 'People', auth: true, rateLimit: '10/min' },
];

const METHOD_COLOR: Record<string, string> = {
  GET: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
  POST: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  PUT: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
  PATCH: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  DELETE: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
};

const API_KEY_DEMO = 'wos_live_sk_7f3a9b2c4d5e6f0a1b2c3d4e5f6a7b8c';

export function IntegrationsAPIDocs() {
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('all');
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const domains = [...new Set(ENDPOINTS.map(e => e.domain))];

  const filtered = ENDPOINTS.filter(e => {
    const matchSearch = !search ||
      e.path.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase());
    const matchDomain = domainFilter === 'all' || e.domain === domainFilter;
    return matchSearch && matchDomain;
  });

  const handleCopyKey = () => {
    navigator.clipboard.writeText(API_KEY_DEMO).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageLayout
      title="API Documentation"
      description="REST API reference, authentication, and developer resources"
      kpis={[
        { title: 'Endpoints', value: ENDPOINTS.length, change: `${domains.length} domains`, changeType: 'neutral', icon: <Code className="h-5 w-5" /> },
        { title: 'API Version', value: 'v1', change: 'Stable', changeType: 'positive', icon: <Zap className="h-5 w-5" /> },
        { title: 'Auth Method', value: 'Bearer Token', changeType: 'neutral', icon: <Key className="h-5 w-5" /> },
        { title: 'Base URL', value: 'api.workos.app', changeType: 'neutral', icon: <ExternalLink className="h-5 w-5" /> },
      ]}
    >
      <div className="space-y-6">
        {/* API Key Section */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Key className="h-5 w-5" /> API Key
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-muted/50 rounded-md px-4 py-2.5 font-mono text-sm flex items-center gap-2">
              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="flex-1 truncate">{API_KEY_DEMO.substring(0, 12)}{'•'.repeat(20)}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleCopyKey}>
              {copied ? <CheckCircle2 className="h-4 w-4 mr-1.5 text-green-500" /> : <Copy className="h-4 w-4 mr-1.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button variant="outline" size="sm">
              <Key className="h-4 w-4 mr-1.5" /> Regenerate
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Include this key in the <code className="bg-muted px-1 py-0.5 rounded">Authorization: Bearer &lt;key&gt;</code> header for all API requests.
          </p>
        </div>

        {/* Quick Start */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5" /> Quick Start
          </h3>
          <div className="bg-gray-950 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <pre className="whitespace-pre">{`curl -X GET "https://api.workos.app/api/v1/employees" \\
  -H "Authorization: Bearer ${API_KEY_DEMO.substring(0, 12)}..." \\
  -H "Content-Type: application/json"

# Response:
{
  "data": [...],
  "total": 67,
  "page": 1,
  "pageSize": 20,
  "hasMore": true
}`}</pre>
          </div>
        </div>

        {/* Endpoint Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search endpoints..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setDomainFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs ${domainFilter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/70'}`}
            >
              All ({ENDPOINTS.length})
            </button>
            {domains.map(d => (
              <button
                key={d}
                onClick={() => setDomainFilter(domainFilter === d ? 'all' : d)}
                className={`px-3 py-1.5 rounded-full text-xs ${domainFilter === d ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/70'}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Endpoints List */}
        <div className="rounded-lg border border-border bg-card divide-y divide-border">
          {filtered.map(ep => (
            <div key={ep.id}>
              <div
                className="flex items-center gap-4 p-4 hover:bg-muted/30 cursor-pointer transition-colors"
                onClick={() => setExpandedEndpoint(expandedEndpoint === ep.id ? null : ep.id)}
              >
                <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded text-xs font-mono font-medium border min-w-[60px] text-center ${METHOD_COLOR[ep.method]}`}>
                  {ep.method}
                </span>
                <code className="text-sm font-mono flex-1">{ep.path}</code>
                <span className="text-xs text-muted-foreground hidden md:block">{ep.description}</span>
                <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted">{ep.domain}</span>
              </div>

              {expandedEndpoint === ep.id && (
                <div className="px-4 pb-4 bg-muted/10">
                  <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                    <p className="text-sm">{ep.description}</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-xs text-muted-foreground">Domain</span>
                        <p className="font-medium">{ep.domain}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Auth Required</span>
                        <p className="font-medium">{ep.auth ? 'Yes (Bearer Token)' : 'No'}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Rate Limit</span>
                        <p className="font-medium">{ep.rateLimit}</p>
                      </div>
                    </div>
                    <div className="bg-gray-950 text-gray-100 rounded p-3 font-mono text-xs">
                      <pre>{`curl -X ${ep.method} "https://api.workos.app${ep.path.replace(':id', '123')}" \\
  -H "Authorization: Bearer wos_live_sk_..." \\
  -H "Content-Type: application/json"${ep.method === 'POST' || ep.method === 'PUT' ? ` \\
  -d '{"key": "value"}'` : ''}`}</pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
