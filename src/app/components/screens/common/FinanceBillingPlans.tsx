import { useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import {
  CreditCard, Users, CheckCircle2, Zap, Crown, Building2, Star,
} from 'lucide-react';

interface Plan {
  id: string; name: string; price: number; period: 'month' | 'year';
  seats: string; features: string[];
  icon: typeof CreditCard; popular: boolean;
  color: string;
}

const PLANS: Plan[] = [
  {
    id: 'free', name: 'Free', price: 0, period: 'month', seats: 'Up to 5',
    features: ['Basic time tracking', 'Leave management', 'Employee directory', '5 GB storage'],
    icon: Star, popular: false, color: 'border-gray-200 dark:border-gray-800',
  },
  {
    id: 'starter', name: 'Starter', price: 12, period: 'month', seats: 'Up to 25',
    features: ['Everything in Free', 'Payroll processing', 'Basic analytics', 'Email support', '25 GB storage', 'API access'],
    icon: Zap, popular: false, color: 'border-blue-200 dark:border-blue-800',
  },
  {
    id: 'professional', name: 'Professional', price: 29, period: 'month', seats: 'Up to 100',
    features: ['Everything in Starter', 'Advanced analytics', 'Screenshot monitoring', 'Custom workflows', 'Priority support', '100 GB storage', 'SSO integration', 'Audit logs'],
    icon: Crown, popular: true, color: 'border-primary',
  },
  {
    id: 'enterprise', name: 'Enterprise', price: -1, period: 'month', seats: 'Unlimited',
    features: ['Everything in Professional', 'Dedicated account manager', 'Custom integrations', 'SLA guarantee', 'On-premise option', 'Unlimited storage', 'HIPAA compliance', 'White-label'],
    icon: Building2, popular: false, color: 'border-purple-200 dark:border-purple-800',
  },
];

export function FinanceBillingPlans() {
  const [currentPlan] = useState('professional');
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

  return (
    <PageLayout
      title="Billing Plans"
      description="Compare plans, manage your subscription, and billing preferences"
      kpis={[
        { title: 'Current Plan', value: 'Professional', change: '$29/user/mo', changeType: 'positive', icon: <Crown className="h-5 w-5" /> },
        { title: 'Active Seats', value: '67', change: 'of 100 available', changeType: 'neutral', icon: <Users className="h-5 w-5" /> },
        { title: 'Next Bill', value: 'Apr 1', change: '$1,943/mo', changeType: 'neutral', icon: <CreditCard className="h-5 w-5" /> },
        { title: 'Savings', value: '20%', change: 'vs monthly billing', changeType: 'positive', icon: <CheckCircle2 className="h-5 w-5" /> },
      ]}
    >
      {/* Billing toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center rounded-lg border border-border p-1 bg-muted/30">
          <button
            onClick={() => setBilling('monthly')}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${billing === 'monthly' ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling('annual')}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${billing === 'annual' ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground'}`}
          >
            Annual <span className="text-green-600 text-xs ml-1">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLANS.map(plan => {
          const Icon = plan.icon;
          const isCurrent = plan.id === currentPlan;
          const price = plan.price === -1 ? null : billing === 'annual' ? Math.round(plan.price * 0.8) : plan.price;

          return (
            <div key={plan.id} className={`rounded-lg border-2 bg-card p-6 relative ${
              isCurrent ? 'border-primary shadow-lg' : plan.color
            } ${plan.popular && !isCurrent ? 'ring-2 ring-primary/20' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">Most Popular</span>
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">Current Plan</span>
                </div>
              )}

              <div className="text-center mb-6 mt-2">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                  isCurrent ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                }`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium">{plan.name}</h3>
                <div className="mt-2">
                  {price !== null ? (
                    <>
                      <span className="text-3xl font-medium">${price}</span>
                      <span className="text-muted-foreground text-sm">/user/mo</span>
                    </>
                  ) : (
                    <span className="text-2xl font-medium">Contact Us</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{plan.seats} users</p>
              </div>

              <div className="space-y-2 mb-6">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <Button
                className="w-full"
                variant={isCurrent ? 'outline' : plan.popular ? 'default' : 'outline'}
                disabled={isCurrent}
              >
                {isCurrent ? 'Current Plan' : price !== null ? 'Upgrade' : 'Contact Sales'}
              </Button>
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="mt-8 rounded-lg border border-border bg-card p-6">
        <h3 className="font-medium mb-4">Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { q: 'Can I switch plans anytime?', a: 'Yes, you can upgrade or downgrade at any time. Changes take effect on your next billing cycle.' },
            { q: 'What happens to my data if I downgrade?', a: 'Your data is preserved. Features only available on higher plans will become read-only.' },
            { q: 'Do you offer custom plans?', a: 'Yes, our Enterprise plan is fully customizable. Contact our sales team for a tailored quote.' },
            { q: 'Is there a free trial?', a: 'All paid plans include a 14-day free trial. No credit card required.' },
          ].map((faq, i) => (
            <div key={i} className="rounded bg-muted/30 p-4">
              <p className="font-medium text-sm mb-1">{faq.q}</p>
              <p className="text-xs text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
