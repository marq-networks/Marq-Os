import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { CreditCard, Check } from 'lucide-react';

export function A26BillingPlans() {
  const plans = [
    {
      id: '1',
      name: 'Starter',
      price: '$29',
      period: 'per user/month',
      description: 'Perfect for small teams',
      features: [
        'Up to 25 users',
        'Basic time tracking',
        'Standard reports',
        'Email support',
        '30-day data retention'
      ],
      current: false
    },
    {
      id: '2',
      name: 'Professional',
      price: '$49',
      period: 'per user/month',
      description: 'For growing businesses',
      features: [
        'Up to 100 users',
        'Advanced time tracking',
        'Activity monitoring',
        'Custom reports',
        'Priority support',
        '1-year data retention',
        'API access'
      ],
      current: false
    },
    {
      id: '3',
      name: 'Enterprise',
      price: '$79',
      period: 'per user/month',
      description: 'For large organizations',
      features: [
        'Unlimited users',
        'All Professional features',
        'Screenshot capture',
        'Advanced analytics',
        'Dedicated support',
        'Indefinite data retention',
        'Custom integrations',
        'SSO & advanced security',
        'White-label options'
      ],
      current: true
    }
  ];

  return (
    <PageLayout
      title="ADMIN – A-26 – Billing Plans – v1.1"
      description="View and manage subscription plans"
      kpis={[
        {
          title: 'Current Plan',
          value: 'Enterprise',
          icon: <CreditCard className="h-5 w-5" />
        },
        {
          title: 'Monthly Cost',
          value: '$2,450',
          change: '52 active users',
          changeType: 'neutral',
          icon: <CreditCard className="h-5 w-5" />
        },
        {
          title: 'Renewal Date',
          value: 'Jan 15, 2026',
          icon: <CreditCard className="h-5 w-5" />
        },
        {
          title: 'Annual Savings',
          value: '15%',
          change: 'Switch to annual',
          changeType: 'info',
          icon: <CreditCard className="h-5 w-5" />
        },
      ]}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`rounded-lg border p-6 ${
              plan.current 
                ? 'border-primary bg-primary/5' 
                : 'border-border bg-card'
            }`}
          >
            {plan.current && (
              <div className="mb-4">
                <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
                  Current Plan
                </span>
              </div>
            )}
            <h3 className="mb-2">{plan.name}</h3>
            <div className="mb-2">
              <span className="text-4xl">{plan.price}</span>
              <span className="ml-2 text-muted-foreground">{plan.period}</span>
            </div>
            <p className="mb-6 text-sm text-muted-foreground">{plan.description}</p>
            
            <ul className="mb-6 space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex gap-2">
                  <Check className="h-5 w-5 flex-shrink-0 text-green-600" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              className="w-full" 
              variant={plan.current ? 'outline' : 'default'}
              disabled={plan.current}
            >
              {plan.current ? 'Current Plan' : 'Upgrade'}
            </Button>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
