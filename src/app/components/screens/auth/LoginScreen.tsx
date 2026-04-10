/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LOGIN SCREEN - Role-Based Authentication Portal
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Three distinct login portals for Employee, Org Admin, and Platform Admin.
 * Each shows mock credentials and routes to the appropriate dashboard.
 */

import { useState } from 'react';
import { 
  User, Shield, Globe, Eye, EyeOff, Lock, Mail, 
  Building2, ArrowRight, CheckCircle2, Briefcase,
  Users, Settings, ChevronRight
} from 'lucide-react';

export type LoginRole = 'employee' | 'org_admin' | 'platform_admin';

interface LoginScreenProps {
  onLogin: (role: LoginRole, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onRegister: (name: string, email: string, password: string, organizationName: string) => Promise<{ success: boolean; error?: string }>;
}

interface RolePortal {
  role: LoginRole;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgGradient: string;
  borderColor: string;
  features: string[];
}

const ROLE_PORTALS: RolePortal[] = [
  {
    role: 'employee',
    title: 'Employee',
    subtitle: 'Personal Workspace',
    description: 'Access your tasks, time logs, leave requests, earnings, and personal workspace.',
    icon: User,
    color: 'text-blue-600',
    bgGradient: 'from-blue-50 to-blue-100/50',
    borderColor: 'border-blue-200 hover:border-blue-400',
    features: ['My Work & Tasks', 'Time Tracking', 'Leave Management', 'My Money', 'Calendar & Activity'],
  },
  {
    role: 'org_admin',
    title: 'Org Admin',
    subtitle: 'Organization Control Center',
    description: 'Full organizational control — manage projects, people, finance, analytics, and security.',
    icon: Shield,
    color: 'text-purple-600',
    bgGradient: 'from-purple-50 to-purple-100/50',
    borderColor: 'border-purple-200 hover:border-purple-400',
    features: ['Execution OS', 'Organization OS', 'Finance Corporate', 'Intelligence OS', 'Security & Compliance'],
  },
  {
    role: 'platform_admin',
    title: 'Platform Admin',
    subtitle: 'Platform Console',
    description: 'Platform-level administration — organizations, billing, global policies, and system health.',
    icon: Globe,
    color: 'text-emerald-600',
    bgGradient: 'from-emerald-50 to-emerald-100/50',
    borderColor: 'border-emerald-200 hover:border-emerald-400',
    features: ['Organizations', 'Platform Billing', 'Global Policies', 'System Health', 'Global Audit Logs'],
  },
];

export function LoginScreen({ onLogin, onRegister }: LoginScreenProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [selectedRole, setSelectedRole] = useState<LoginRole | null>(null);
  const [fullName, setFullName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');

  const selectedPortal = ROLE_PORTALS.find(p => p.role === selectedRole);

  const handleSelectRole = (portal: RolePortal) => {
    setMode('login');
    setSelectedRole(portal.role);
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleLogin = async () => {
    if (!selectedPortal) return;

    setIsLoggingIn(true);
    setError('');

    const result = await onLogin(selectedPortal.role, email, password);
    if (!result.success) {
      setError(result.error || 'Login failed');
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async () => {
    if (!fullName || !organizationName || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoggingIn(true);
    setError('');

    const result = await onRegister(fullName, email, password, organizationName);
    if (!result.success) {
      setError(result.error || 'Create account failed');
      setIsLoggingIn(false);
    }
  };

  const handleBack = () => {
    setMode('login');
    setSelectedRole(null);
    setFullName('');
    setOrganizationName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setIsLoggingIn(false);
  };

  if (mode === 'signup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            <span className="text-sm">Back to sign in</span>
          </button>

          <div className="bg-white rounded-2xl border border-border shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 px-8 py-6 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-purple-600">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl text-foreground">Create Organization Account</h2>
                  <p className="text-sm text-muted-foreground">Start with an Org Admin workspace</p>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm text-foreground">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => { setFullName(e.target.value); setError(''); }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm text-foreground">Organization Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={organizationName}
                    onChange={e => { setOrganizationName(e.target.value); setError(''); }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="Enter organization name"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm text-foreground">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="Enter work email"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="Create password"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm text-foreground">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="Confirm password"
                    onKeyDown={e => e.key === 'Enter' && handleRegister()}
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
              )}

              <button
                onClick={handleRegister}
                disabled={isLoggingIn || !fullName || !organizationName || !email || !password || !confirmPassword}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoggingIn ? (
                  <>
                    <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedRole && selectedPortal) {
    const Icon = selectedPortal.icon;
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            <span className="text-sm">Back to role selection</span>
          </button>

          {/* Login Card */}
          <div className="bg-white rounded-2xl border border-border shadow-lg overflow-hidden">
            {/* Header */}
            <div className={`bg-gradient-to-r ${selectedPortal.bgGradient} px-8 py-6 border-b border-border`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center ${selectedPortal.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl text-foreground">{selectedPortal.title} Login</h2>
                  <p className="text-sm text-muted-foreground">{selectedPortal.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="px-8 py-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm text-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="Enter email"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="Enter password"
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
              )}

              <button
                onClick={handleLogin}
                disabled={isLoggingIn || !email || !password}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoggingIn ? (
                  <>
                    <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In as {selectedPortal.title}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Role Selection View
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl text-foreground mb-2">WorkOS Platform</h1>
          <p className="text-muted-foreground">Select your role to sign in</p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ROLE_PORTALS.map(portal => {
            const Icon = portal.icon;
            return (
              <button
                key={portal.role}
                onClick={() => handleSelectRole(portal)}
                className={`group text-left bg-white rounded-2xl border-2 ${portal.borderColor} shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden`}
              >
                {/* Card Header */}
                <div className={`bg-gradient-to-r ${portal.bgGradient} px-6 py-5 border-b border-border`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center ${portal.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-foreground">{portal.title}</h3>
                      <p className="text-xs text-muted-foreground">{portal.subtitle}</p>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="px-6 py-5 space-y-4">
                  <p className="text-sm text-muted-foreground">{portal.description}</p>

                  {/* Features */}
                  <div className="space-y-2">
                    {portal.features.map(feature => (
                      <div key={feature} className="flex items-center gap-2 text-sm text-foreground">
                        <CheckCircle2 className={`h-3.5 w-3.5 ${portal.color} flex-shrink-0`} />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Use your real account credentials for this role.</p>
                  </div>

                  <div className={`flex items-center justify-between text-sm ${portal.color} group-hover:gap-2 transition-all`}>
                    <span>Sign in</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center gap-2">
            <p className="text-xs text-muted-foreground">Need a new workspace?</p>
            <button
              onClick={() => {
                setMode('signup');
                setSelectedRole(null);
                setError('');
              }}
              className="text-xs text-primary hover:underline"
            >
              Create account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
