/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PLATFORM OVERVIEW - Platform Admin Landing Page
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Building2, DollarSign, Users, Activity } from 'lucide-react';

export function PlatformOverview() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Platform Console</h1>
        <p className="text-muted-foreground">
          Monitor and manage all organizations across the WorkOS platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Building2}
          label="Total Organizations"
          value="142"
          change="+12 this month"
          positive
        />
        <StatCard
          icon={Users}
          label="Total Users"
          value="8,432"
          change="+324 this month"
          positive
        />
        <StatCard
          icon={DollarSign}
          label="Monthly Revenue"
          value="$184,200"
          change="+18% vs last month"
          positive
        />
        <StatCard
          icon={Activity}
          label="System Health"
          value="99.8%"
          change="All systems operational"
          positive
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Platform Activity</h2>
        <div className="space-y-4">
          <ActivityItem
            title="New organization created"
            org="Acme Corp"
            time="2 minutes ago"
          />
          <ActivityItem
            title="Billing plan upgraded"
            org="TechStart Inc"
            time="15 minutes ago"
          />
          <ActivityItem
            title="New organization created"
            org="Global Solutions Ltd"
            time="1 hour ago"
          />
          <ActivityItem
            title="System maintenance completed"
            org="Platform"
            time="3 hours ago"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  change, 
  positive 
}: { 
  icon: any; 
  label: string; 
  value: string; 
  change: string; 
  positive: boolean;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
      <p className={`text-sm ${positive ? 'text-green-600' : 'text-red-600'}`}>
        {change}
      </p>
    </div>
  );
}

function ActivityItem({ 
  title, 
  org, 
  time 
}: { 
  title: string; 
  org: string; 
  time: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{org}</p>
      </div>
      <p className="text-xs text-muted-foreground">{time}</p>
    </div>
  );
}
