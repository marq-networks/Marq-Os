import { useState, useMemo } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { usePeopleData } from '../../../services/hooks';
import {
  Users, Search, Grid3X3, List, MapPin, Mail, Briefcase, X,
} from 'lucide-react';
import type { Employee } from '../../../services/types';

const STATUS_MAP: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  Active: 'success', Away: 'warning', Offline: 'neutral', Suspended: 'danger', Deactivated: 'danger',
};

export function PeopleMembers() {
  const { employees, departments, loading } = usePeopleData();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo(() => {
    return employees.filter(e => {
      const matchSearch = !search ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.role.toLowerCase().includes(search.toLowerCase()) ||
        e.department.toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter === 'all' || e.departmentId === deptFilter;
      return matchSearch && matchDept;
    });
  }, [employees, search, deptFilter]);

  const grouped = useMemo(() => {
    const groups: Record<string, Employee[]> = {};
    filtered.forEach(e => {
      if (!groups[e.department]) groups[e.department] = [];
      groups[e.department].push(e);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const onlineCount = employees.filter(e => e.status === 'Active').length;

  return (
    <PageLayout
      title="Team Members"
      description="View your organization's team members and their status"
      kpis={[
        { title: 'Total Members', value: employees.length, icon: <Users className="h-5 w-5" /> },
        { title: 'Online Now', value: onlineCount, change: `${Math.round(onlineCount / employees.length * 100)}% online`, changeType: 'positive', icon: <Users className="h-5 w-5" /> },
        { title: 'Teams', value: departments.length, change: 'Active departments', changeType: 'neutral', icon: <Users className="h-5 w-5" /> },
        { title: 'Locations', value: [...new Set(employees.map(e => e.location).filter(Boolean))].length, change: 'Unique locations', changeType: 'neutral', icon: <MapPin className="h-5 w-5" /> },
      ]}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All Departments</option>
          {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        {(search || deptFilter !== 'all') && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setDeptFilter('all'); }}>
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
        <div className="ml-auto flex border border-border rounded-md overflow-hidden">
          <button
            onClick={() => setView('grid')}
            className={`p-2 ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 ${view === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-40 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : view === 'grid' ? (
        /* Grid View */
        <div className="space-y-8">
          {grouped.map(([deptName, members]) => (
            <div key={deptName}>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-medium">{deptName}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {members.length}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {members.map(member => (
                  <div key={member.id} className="rounded-lg border border-border bg-card p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-sm text-primary">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card ${
                          member.status === 'Active' ? 'bg-green-500' :
                          member.status === 'Away' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{member.name}</h4>
                        <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      {member.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3" />
                          <span>{member.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="h-3 w-3" />
                        <span>{member.employmentType}</span>
                      </div>
                    </div>
                    {member.skills && member.skills.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {member.skills.slice(0, 3).map(skill => (
                          <span key={skill} className="px-1.5 py-0.5 text-[10px] rounded bg-muted text-muted-foreground">{skill}</span>
                        ))}
                        {member.skills.length > 3 && (
                          <span className="px-1.5 py-0.5 text-[10px] rounded bg-muted text-muted-foreground">+{member.skills.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="rounded-lg border border-border bg-card divide-y divide-border">
          {filtered.map(member => (
            <div key={member.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm text-primary">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${
                  member.status === 'Active' ? 'bg-green-500' :
                  member.status === 'Away' ? 'bg-yellow-500' : 'bg-gray-400'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{member.name}</span>
                  <StatusBadge type={STATUS_MAP[member.status] || 'neutral'}>{member.status}</StatusBadge>
                </div>
                <p className="text-sm text-muted-foreground">{member.role} &middot; {member.department}</p>
              </div>
              <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{member.location || '—'}</span>
                <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{member.employmentType}</span>
                <span className="text-xs">{member.lastSeen}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
