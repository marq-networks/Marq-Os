import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { APIDoc } from '../../ui/form';
import { Code, Copy, Check, Book, Zap } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../../ui/toast';

export function A28APIDocsEnhanced() {
  const { showToast } = useToast();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    showToast('success', 'Copied to clipboard');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const apiExamples = [
    {
      category: 'User Management',
      endpoints: [
        {
          title: 'Create User',
          description: 'Add a new user to the system',
          endpoint: '/api/users',
          method: 'POST' as const,
          payload: {
            name: "string",
            email: "string",
            role: "Employee | Manager | Admin | Super Admin",
            department: "string",
            status: "Active | Inactive"
          },
          response: {
            id: "uuid",
            name: "string",
            email: "string",
            role: "string",
            createdAt: "ISO8601",
            status: "Active"
          }
        },
        {
          title: 'Get User Details',
          description: 'Retrieve detailed information about a specific user',
          endpoint: '/api/users/:id',
          method: 'GET' as const,
          response: {
            id: "uuid",
            name: "string",
            email: "string",
            role: "string",
            department: "string",
            status: "Active",
            createdAt: "ISO8601",
            lastLogin: "ISO8601"
          }
        },
        {
          title: 'Update User',
          description: 'Modify user details and permissions',
          endpoint: '/api/users/:id',
          method: 'PATCH' as const,
          payload: {
            name: "string (optional)",
            role: "string (optional)",
            department: "string (optional)",
            status: "Active | Inactive | Suspended (optional)"
          },
          response: {
            id: "uuid",
            updatedAt: "ISO8601",
            changes: ["field1", "field2"]
          }
        },
        {
          title: 'Suspend User',
          description: 'Temporarily disable user access',
          endpoint: '/api/users/:id/suspend',
          method: 'POST' as const,
          payload: {
            reason: "string",
            duration: "number (days, optional)"
          },
          response: {
            id: "uuid",
            status: "Suspended",
            suspendedUntil: "ISO8601",
            notificationSent: true
          }
        }
      ]
    },
    {
      category: 'Leave Management',
      endpoints: [
        {
          title: 'Create Leave Request',
          description: 'Submit a new leave request',
          endpoint: '/api/leave/requests',
          method: 'POST' as const,
          payload: {
            employeeId: "uuid",
            leaveType: "Vacation | Sick Leave | Personal | Other",
            startDate: "YYYY-MM-DD",
            endDate: "YYYY-MM-DD",
            reason: "string"
          },
          response: {
            id: "uuid",
            status: "Pending",
            days: "number",
            submittedAt: "ISO8601",
            balance: {
              before: "number",
              after: "number"
            }
          }
        },
        {
          title: 'Approve Leave Request',
          description: 'Approve a pending leave request',
          endpoint: '/api/leave/requests/:id/approve',
          method: 'POST' as const,
          payload: {
            reviewNote: "string (optional)"
          },
          response: {
            id: "uuid",
            status: "Approved",
            approvedBy: "uuid",
            approvedAt: "ISO8601",
            notificationSent: true,
            auditLogId: "uuid"
          }
        },
        {
          title: 'Reject Leave Request',
          description: 'Reject a leave request with reason',
          endpoint: '/api/leave/requests/:id/reject',
          method: 'POST' as const,
          payload: {
            reason: "string (required)"
          },
          response: {
            id: "uuid",
            status: "Rejected",
            rejectedBy: "uuid",
            rejectedAt: "ISO8601",
            notificationSent: true
          }
        }
      ]
    },
    {
      category: 'Time Tracking',
      endpoints: [
        {
          title: 'Submit Time Correction',
          description: 'Request correction for tracked time',
          endpoint: '/api/time/corrections',
          method: 'POST' as const,
          payload: {
            employeeId: "uuid",
            date: "YYYY-MM-DD",
            correctedStart: "HH:MM",
            correctedEnd: "HH:MM",
            reason: "string"
          },
          response: {
            id: "uuid",
            status: "Pending",
            submittedAt: "ISO8601",
            requiresApproval: true
          }
        }
      ]
    },
    {
      category: 'Payroll',
      endpoints: [
        {
          title: 'Export Payroll',
          description: 'Generate payroll export for specified period',
          endpoint: '/api/payroll/export',
          method: 'POST' as const,
          payload: {
            startDate: "YYYY-MM-DD",
            endDate: "YYYY-MM-DD",
            format: "CSV | Excel | PDF",
            departments: ["string (optional)"]
          },
          response: {
            exportId: "uuid",
            status: "Processing",
            estimatedTime: "number (seconds)",
            downloadUrl: "string (when ready)"
          }
        }
      ]
    },
    {
      category: 'Billing',
      endpoints: [
        {
          title: 'Upgrade Plan',
          description: 'Upgrade organization billing plan',
          endpoint: '/api/billing/upgrade',
          method: 'POST' as const,
          payload: {
            planId: "string",
            seats: "number",
            billingCycle: "monthly | annual"
          },
          response: {
            subscriptionId: "uuid",
            status: "active",
            nextBillingDate: "ISO8601",
            prorationAmount: "number",
            invoiceUrl: "string"
          }
        }
      ]
    },
    {
      category: 'Compliance',
      endpoints: [
        {
          title: 'Revoke Consent',
          description: 'Revoke employee data collection consent',
          endpoint: '/api/consent/:employeeId/revoke',
          method: 'POST' as const,
          payload: {
            consentType: "monitoring | screenshots | activity",
            reason: "string"
          },
          response: {
            id: "uuid",
            status: "Revoked",
            revokedAt: "ISO8601",
            dataRetention: {
              existing: "archived",
              future: "blocked"
            },
            restrictedFeatures: ["string"]
          }
        },
        {
          title: 'Enable Legal Hold',
          description: 'Place employee data under legal hold',
          endpoint: '/api/compliance/legal-hold',
          method: 'POST' as const,
          payload: {
            employeeIds: ["uuid"],
            caseId: "string",
            duration: "number (days)",
            reason: "string"
          },
          response: {
            holdId: "uuid",
            affectedEmployees: "number",
            startDate: "ISO8601",
            endDate: "ISO8601",
            restrictions: ["deletion", "modification"]
          }
        }
      ]
    }
  ];

  return (
    <PageLayout
      title="ADMIN – A-28 – API Documentation – v1.2"
      description="Complete API reference for backend integration"
      kpis={[
        {
          title: 'Total Endpoints',
          value: apiExamples.reduce((acc, cat) => acc + cat.endpoints.length, 0).toString(),
          icon: <Zap className="h-5 w-5" />
        },
        {
          title: 'Categories',
          value: apiExamples.length.toString(),
          icon: <Book className="h-5 w-5" />
        },
        {
          title: 'API Version',
          value: 'v1.2',
          icon: <Code className="h-5 w-5" />
        }
      ]}
    >
      <div className="space-y-8">
        {/* Getting Started */}
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">Getting Started</h3>
          <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
            All API endpoints require authentication via Bearer token. Include your API key in the Authorization header.
          </p>
          <div className="bg-blue-100 dark:bg-blue-900 rounded p-3 font-mono text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-blue-700 dark:text-blue-300">Example Request Headers:</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY', -1)}
              >
                {copiedIndex === -1 ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <pre className="text-blue-800 dark:text-blue-200">
Authorization: Bearer YOUR_API_KEY{'\n'}
Content-Type: application/json
            </pre>
          </div>
        </div>

        {/* API Categories */}
        {apiExamples.map((category, catIndex) => (
          <div key={catIndex} className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold text-lg mb-4">{category.category}</h3>
            
            <div className="space-y-6">
              {category.endpoints.map((endpoint, endIndex) => (
                <div key={endIndex} className="border-b border-border last:border-0 pb-6 last:pb-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{endpoint.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{endpoint.description}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const code = JSON.stringify({
                          endpoint: endpoint.endpoint,
                          method: endpoint.method,
                          ...(endpoint.payload && { payload: endpoint.payload }),
                          ...(endpoint.response && { response: endpoint.response })
                        }, null, 2);
                        copyToClipboard(code, catIndex * 100 + endIndex);
                      }}
                    >
                      {copiedIndex === catIndex * 100 + endIndex ? (
                        <Check className="h-4 w-4 mr-1" />
                      ) : (
                        <Copy className="h-4 w-4 mr-1" />
                      )}
                      Copy
                    </Button>
                  </div>
                  
                  <div className="mt-4">
                    <APIDoc
                      endpoint={endpoint.endpoint}
                      method={endpoint.method}
                      payload={endpoint.payload}
                      response={endpoint.response}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Error Codes */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold text-lg mb-4">Common Error Codes</h3>
          <div className="space-y-3">
            {[
              { code: '400', title: 'Bad Request', desc: 'Invalid request parameters or format' },
              { code: '401', title: 'Unauthorized', desc: 'Missing or invalid authentication token' },
              { code: '403', title: 'Forbidden', desc: 'Insufficient permissions for this operation' },
              { code: '404', title: 'Not Found', desc: 'Resource does not exist' },
              { code: '422', title: 'Validation Error', desc: 'Request validation failed' },
              { code: '429', title: 'Rate Limited', desc: 'Too many requests, please slow down' },
              { code: '500', title: 'Server Error', desc: 'Internal server error occurred' }
            ].map((error, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded bg-muted/50">
                <code className="px-2 py-1 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-xs font-mono shrink-0">
                  {error.code}
                </code>
                <div>
                  <p className="font-medium text-sm">{error.title}</p>
                  <p className="text-xs text-muted-foreground">{error.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rate Limiting */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold text-lg mb-4">Rate Limiting</h3>
          <p className="text-sm text-muted-foreground mb-4">
            API requests are rate limited to ensure system stability:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span><strong>Standard Plan:</strong> 1,000 requests per hour</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span><strong>Professional Plan:</strong> 5,000 requests per hour</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span><strong>Enterprise Plan:</strong> Custom limits available</span>
            </li>
          </ul>
        </div>
      </div>
    </PageLayout>
  );
}
