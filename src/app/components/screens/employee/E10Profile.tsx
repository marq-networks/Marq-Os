/**
 * E10 - Employee Profile
 * Wired to service layer: usePeopleData() → employees (current user e1) + updateEmployee
 */
import { useState, useEffect } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import {
  User, Mail, Phone, MapPin, Briefcase, Save, X,
  Plus, AlertCircle, CheckCircle, RotateCcw, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { useCurrentEmployee, usePeopleData } from '../../../services';
import type { Employee } from '../../../services';

// Local form shape mirrors Employee + extra display fields
interface ProfileForm {
  name: string;
  email: string;
  phone: string;
  location: string;
  role: string;          // job title
  department: string;
  bio: string;
  skills: string[];
}

function toForm(emp: Employee): ProfileForm {
  return {
    name: emp.name,
    email: emp.email,
    phone: emp.phone ?? '+1 (555) 000-0000',
    location: emp.location ?? 'Remote',
    role: emp.role,
    department: emp.department,
    bio: `Experienced ${emp.role.toLowerCase()} with expertise in ${(emp.skills ?? []).slice(0, 2).join(' and ')}.`,
    skills: emp.skills ?? [],
  };
}

export function E10Profile() {
  const { loading, updateEmployee } = usePeopleData();
  const { employee: emp } = useCurrentEmployee();

  const [form, setForm] = useState<ProfileForm>({
    name: 'Sarah Johnson', email: 'sarah.j@company.com', phone: '+1 (555) 123-4567',
    location: 'New York', role: 'Product Manager', department: 'Product',
    bio: 'Experienced product manager with a passion for building user-centric solutions.',
    skills: ['Product Strategy', 'Agile', 'UX Research', 'Roadmap Planning'],
  });
  const [originalForm, setOriginalForm] = useState<ProfileForm>({ ...form });
  const [hasChanges, setHasChanges] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Sync once employee data loads
  useEffect(() => {
    if (emp) {
      const f = toForm(emp);
      setForm(f);
      setOriginalForm(f);
    }
  }, [emp?.id]);

  useEffect(() => {
    setHasChanges(JSON.stringify(form) !== JSON.stringify(originalForm));
  }, [form, originalForm]);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) errors.name = 'Full name must be at least 2 characters';
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.email)) errors.email = 'Invalid email format';
    if (!form.phone.trim()) errors.phone = 'Phone is required';
    if (!form.location.trim()) errors.location = 'Location is required';
    if (!form.role.trim()) errors.role = 'Job title is required';
    if (!form.department.trim()) errors.department = 'Department is required';
    if (form.bio && form.bio.trim().length > 0 && form.bio.trim().length < 20) {
      errors.bio = 'Bio must be at least 20 characters or leave empty';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!hasChanges) { toast.info('No changes to save'); return; }
    if (!validate()) { toast.error('Please fix the form errors'); return; }
    setIsSaving(true);
    try {
      if (emp) {
        await updateEmployee(emp.id, {
          name: form.name,
          email: form.email,
          phone: form.phone,
          location: form.location,
          role: form.role,
          department: form.department,
          skills: form.skills,
        });
      }
      setOriginalForm({ ...form });
      setHasChanges(false);
      toast.success('Profile saved successfully!', { icon: <CheckCircle className="h-4 w-4" /> });
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setForm({ ...originalForm });
    setFormErrors({});
    toast.success('Changes discarded');
  };

  const handleReset = () => {
    if (emp) {
      const f = toForm(emp);
      setForm(f);
      setOriginalForm(f);
      setFormErrors({});
      toast.success('Profile reset to service data');
    }
  };

  const handleField = (field: keyof ProfileForm, value: string) => {
    setForm(p => ({ ...p, [field]: value }));
    if (formErrors[field]) setFormErrors(p => ({ ...p, [field]: '' }));
  };

  const addSkill = () => {
    if (!newSkill.trim() || newSkill.trim().length < 2) { toast.error('Skill name must be at least 2 chars'); return; }
    if (form.skills.includes(newSkill.trim())) { toast.error('Skill already exists'); return; }
    setForm(p => ({ ...p, skills: [...p.skills, newSkill.trim()] }));
    setNewSkill('');
    setShowSkillInput(false);
    toast.success(`"${newSkill.trim()}" added`);
  };

  const removeSkill = (skill: string) => {
    setForm(p => ({ ...p, skills: p.skills.filter(s => s !== skill) }));
    toast.success(`"${skill}" removed`);
  };

  return (
    <PageLayout
      title="EMPLOYEE – E-10 – Profile – v3.0 [Service Layer ✓]"
      description="Manage your personal information — changes saved via People service"
      actions={
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Button variant="outline" size="sm" onClick={handleDiscard}>
              <X className="mr-2 h-4 w-4" />
              Discard Changes
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className={hasChanges ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving…' : hasChanges ? 'Save Changes *' : 'Save Changes'}
          </Button>
        </div>
      }
      kpis={[
        {
          title: 'Member Since',
          value: emp ? new Date(emp.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—',
          icon: <User className="h-5 w-5" />,
        },
        {
          title: 'Department',
          value: form.department,
          icon: <Briefcase className="h-5 w-5" />,
        },
        {
          title: 'Manager',
          value: emp?.manager ?? 'N/A',
          icon: <User className="h-5 w-5" />,
        },
        {
          title: 'Employment Type',
          value: emp?.employmentType ?? 'Full-time',
          icon: <Briefcase className="h-5 w-5" />,
        },
      ]}
    >
      <div className="space-y-6">
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Loading profile from People service…
          </div>
        )}

        {hasChanges && (
          <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/30 p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <p className="text-sm font-medium">
                You have unsaved changes. Click "Save Changes" to update your profile via the People service.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Personal Information */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-6 font-semibold">Personal Information</h3>
            <div className="space-y-4">
              {[
                { id: 'name', label: 'Full Name *', icon: null, type: 'text', field: 'name' as const },
                { id: 'email', label: 'Email *', icon: <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />, type: 'email', field: 'email' as const },
                { id: 'phone', label: 'Phone *', icon: <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />, type: 'tel', field: 'phone' as const },
                { id: 'location', label: 'Location *', icon: <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />, type: 'text', field: 'location' as const },
              ].map(({ id, label, icon, type, field }) => (
                <div key={id}>
                  <Label htmlFor={id}>{label}</Label>
                  <div className={`relative mt-1 ${icon ? '' : ''}`}>
                    {icon}
                    <Input
                      id={id}
                      type={type}
                      className={icon ? 'pl-10' : ''}
                      value={form[field] as string}
                      onChange={e => handleField(field, e.target.value)}
                    />
                  </div>
                  {formErrors[field] && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />{formErrors[field]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Professional Details */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-6 font-semibold">Professional Details</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="role">Job Title *</Label>
                <Input id="role" value={form.role} onChange={e => handleField('role', e.target.value)} className="mt-1" />
                {formErrors.role && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />{formErrors.role}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="dept">Department *</Label>
                <Input id="dept" value={form.department} onChange={e => handleField('department', e.target.value)} className="mt-1" />
                {formErrors.department && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />{formErrors.department}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="empId">Employee ID</Label>
                <Input id="empId" value={emp ? `EMP-${emp.id.toUpperCase()}` : 'EMP-E1'} className="mt-1" disabled />
                <p className="text-xs text-muted-foreground mt-1">Employee ID cannot be changed</p>
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  className="mt-1"
                  rows={4}
                  value={form.bio}
                  onChange={e => handleField('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                />
                <p className="text-xs text-muted-foreground mt-1">{form.bio.length} characters</p>
                {formErrors.bio && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />{formErrors.bio}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="rounded-lg border border-border bg-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Skills & Expertise ({form.skills.length})</h3>
              {!showSkillInput && (
                <Button variant="outline" size="sm" onClick={() => setShowSkillInput(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Skill
                </Button>
              )}
            </div>

            {showSkillInput && (
              <div className="mb-4 flex gap-2">
                <Input
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  placeholder="Enter skill name..."
                  onKeyDown={e => { if (e.key === 'Enter') addSkill(); }}
                  autoFocus
                />
                <Button onClick={addSkill} size="sm">
                  <CheckCircle className="mr-2 h-4 w-4" />Add
                </Button>
                <Button variant="outline" size="sm" onClick={() => { setShowSkillInput(false); setNewSkill(''); }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {form.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {form.skills.map(skill => (
                  <div
                    key={skill}
                    className="group rounded-full border border-border bg-accent px-4 py-2 text-sm flex items-center gap-2 hover:bg-accent/70 transition-colors"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => removeSkill(skill)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3 text-red-600 hover:text-red-700" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium mb-2">No skills added yet</p>
                <p className="text-sm">Click "Add Skill" to start building your skills list.</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg bg-muted/50 border border-border p-4">
          <p className="text-sm text-muted-foreground">
            <strong>💡 Service layer connected:</strong> Changes saved here call{' '}
            <code className="font-mono text-xs">updateEmployee()</code> on the People service.
            The data propagates to Members, Departments, and Analytics screens automatically.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
