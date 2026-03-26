export const mockUser = {
  name: 'Sarah Johnson',
  email: 'sarah.johnson@company.com',
  role: 'Product Manager',
  avatar: undefined
};

export const mockOrganizations = [
  { id: '1', name: 'Acme Corp', logo: undefined },
  { id: '2', name: 'TechStart Inc', logo: undefined },
  { id: '3', name: 'Global Enterprises', logo: undefined },
];

export const mockCurrentOrg = mockOrganizations[0];

// Sample time log data
export const mockTimeLogs = [
  { id: '1', date: '2025-12-31', checkIn: '09:00 AM', checkOut: '05:30 PM', duration: '8h 30m', status: 'Complete' },
  { id: '2', date: '2025-12-30', checkIn: '08:45 AM', checkOut: '05:15 PM', duration: '8h 30m', status: 'Complete' },
  { id: '3', date: '2025-12-29', checkIn: '09:15 AM', checkOut: '06:00 PM', duration: '8h 45m', status: 'Complete' },
  { id: '4', date: '2025-12-28', checkIn: '09:00 AM', checkOut: '05:00 PM', duration: '8h 00m', status: 'Complete' },
  { id: '5', date: '2025-12-27', checkIn: '09:30 AM', checkOut: '05:45 PM', duration: '8h 15m', status: 'Complete' },
];

// Sample leave requests
export const mockLeaveRequests = [
  { id: '1', type: 'Vacation', startDate: '2026-01-15', endDate: '2026-01-19', days: 5, status: 'Approved', reason: 'Family vacation' },
  { id: '2', type: 'Sick Leave', startDate: '2025-12-20', endDate: '2025-12-20', days: 1, status: 'Approved', reason: 'Medical appointment' },
  { id: '3', type: 'Personal', startDate: '2026-02-10', endDate: '2026-02-11', days: 2, status: 'Pending', reason: 'Personal matters' },
];

// Sample users for admin
export const mockUsers = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah.j@company.com', role: 'Product Manager', department: 'Product', status: 'Active', lastSeen: '5 min ago' },
  { id: '2', name: 'Michael Chen', email: 'michael.c@company.com', role: 'Senior Developer', department: 'Engineering', status: 'Active', lastSeen: '2 min ago' },
  { id: '3', name: 'Emily Rodriguez', email: 'emily.r@company.com', role: 'UX Designer', department: 'Design', status: 'Active', lastSeen: '10 min ago' },
  { id: '4', name: 'David Kim', email: 'david.k@company.com', role: 'Marketing Lead', department: 'Marketing', status: 'Away', lastSeen: '1 hour ago' },
  { id: '5', name: 'Lisa Anderson', email: 'lisa.a@company.com', role: 'HR Manager', department: 'HR', status: 'Active', lastSeen: 'Just now' },
  { id: '6', name: 'James Wilson', email: 'james.w@company.com', role: 'Sales Director', department: 'Sales', status: 'Active', lastSeen: '30 min ago' },
  { id: '7', name: 'Maria Garcia', email: 'maria.g@company.com', role: 'QA Engineer', department: 'Engineering', status: 'Offline', lastSeen: '2 hours ago' },
  { id: '8', name: 'Robert Taylor', email: 'robert.t@company.com', role: 'DevOps Lead', department: 'Engineering', status: 'Active', lastSeen: '15 min ago' },
];

// Sample departments
export const mockDepartments = [
  { id: '1', name: 'Engineering', members: 45, lead: 'Michael Chen', budget: '$2.4M' },
  { id: '2', name: 'Product', members: 12, lead: 'Sarah Johnson', budget: '$800K' },
  { id: '3', name: 'Design', members: 8, lead: 'Emily Rodriguez', budget: '$500K' },
  { id: '4', name: 'Marketing', members: 15, lead: 'David Kim', budget: '$1.2M' },
  { id: '5', name: 'Sales', members: 22, lead: 'James Wilson', budget: '$1.8M' },
  { id: '6', name: 'HR', members: 6, lead: 'Lisa Anderson', budget: '$400K' },
];

// Sample organizations for super admin
export const mockSuperOrganizations = [
  { id: '1', name: 'Acme Corp', plan: 'Enterprise', users: 450, status: 'Active', mrr: '$12,500', nextBilling: '2026-01-15' },
  { id: '2', name: 'TechStart Inc', plan: 'Professional', users: 85, status: 'Active', mrr: '$2,800', nextBilling: '2026-01-08' },
  { id: '3', name: 'Global Enterprises', plan: 'Enterprise', users: 1200, status: 'Active', mrr: '$45,000', nextBilling: '2026-01-20' },
  { id: '4', name: 'StartupHub', plan: 'Starter', users: 25, status: 'Trial', mrr: '$0', nextBilling: '2026-01-05' },
  { id: '5', name: 'MegaCorp International', plan: 'Enterprise', users: 2500, status: 'Active', mrr: '$95,000', nextBilling: '2026-01-10' },
];

// Chart data samples
export const mockActivityChartData = [
  { day: 'Mon', hours: 8.5, active: 7.2 },
  { day: 'Tue', hours: 8.2, active: 7.8 },
  { day: 'Wed', hours: 9.0, active: 8.3 },
  { day: 'Thu', hours: 8.7, active: 7.9 },
  { day: 'Fri', hours: 7.5, active: 6.8 },
  { day: 'Sat', hours: 0, active: 0 },
  { day: 'Sun', hours: 0, active: 0 },
];

export const mockProductivityData = [
  { name: 'Development', value: 35 },
  { name: 'Meetings', value: 20 },
  { name: 'Design', value: 15 },
  { name: 'Communication', value: 18 },
  { name: 'Other', value: 12 },
];

export const mockRevenueData = [
  { month: 'Jul', revenue: 125000 },
  { month: 'Aug', revenue: 142000 },
  { month: 'Sep', revenue: 158000 },
  { month: 'Oct', revenue: 165000 },
  { month: 'Nov', revenue: 178000 },
  { month: 'Dec', revenue: 195000 },
];

export const mockAttendanceData = [
  { month: 'Jan', rate: 95 },
  { month: 'Feb', rate: 94 },
  { month: 'Mar', rate: 96 },
  { month: 'Apr', rate: 93 },
  { month: 'May', rate: 95 },
  { month: 'Jun', rate: 97 },
  { month: 'Jul', rate: 94 },
  { month: 'Aug', rate: 96 },
  { month: 'Sep', rate: 95 },
  { month: 'Oct', rate: 97 },
  { month: 'Nov', rate: 96 },
  { month: 'Dec', rate: 98 },
];

// Notifications
export const mockNotifications = [
  { id: '1', title: 'Leave request approved', message: 'Your vacation leave for Jan 15-19 has been approved', time: '5 min ago', read: false, type: 'success' },
  { id: '2', title: 'Time log correction needed', message: 'Please review your time entry for Dec 28', time: '1 hour ago', read: false, type: 'warning' },
  { id: '3', title: 'New company policy', message: 'Updated remote work policy is now available', time: '2 hours ago', read: true, type: 'info' },
  { id: '4', title: 'Payroll processed', message: 'Your December salary has been processed', time: '1 day ago', read: true, type: 'success' },
  { id: '5', title: 'Training reminder', message: 'Complete your Q1 compliance training by Jan 10', time: '2 days ago', read: true, type: 'warning' },
];

// Activity logs
export const mockActivityLogs = [
  { id: '1', timestamp: '2025-12-31 14:30:00', user: 'Sarah Johnson', action: 'Updated user profile', resource: 'User Settings', ip: '192.168.1.100' },
  { id: '2', timestamp: '2025-12-31 14:15:22', user: 'Michael Chen', action: 'Created new project', resource: 'Projects', ip: '192.168.1.101' },
  { id: '3', timestamp: '2025-12-31 13:45:10', user: 'Emily Rodriguez', action: 'Approved leave request', resource: 'Leave Management', ip: '192.168.1.102' },
  { id: '4', timestamp: '2025-12-31 13:20:55', user: 'Admin System', action: 'Generated payroll report', resource: 'Payroll', ip: 'System' },
  { id: '5', timestamp: '2025-12-31 12:50:33', user: 'David Kim', action: 'Modified department settings', resource: 'Departments', ip: '192.168.1.103' },
];
