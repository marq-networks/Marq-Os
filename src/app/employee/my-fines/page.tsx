'use client';

import React, { useState } from 'react';
import { AlertTriangle, Calendar, Clock, DollarSign, CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface Fine {
  id: string;
  date: string;
  violationType: string;
  description: string;
  amount: number;
  status: 'pending' | 'paid' | 'disputed' | 'waived';
  timeLost?: string;
  createdBy: string;
  dueDate: string;
  paymentDate?: string;
  notes?: string;
}

const mockFines: Fine[] = [
  {
    id: 'F-001',
    date: '2026-01-02',
    violationType: 'Late Clock-In',
    description: 'Clocked in 15 minutes late without prior approval',
    amount: 25.00,
    status: 'pending',
    timeLost: '15 minutes',
    createdBy: 'Sarah Johnson',
    dueDate: '2026-01-09',
    notes: 'Please ensure to clock in on time or request approval in advance.'
  },
  {
    id: 'F-002',
    date: '2025-12-28',
    violationType: 'Missed Break',
    description: 'Skipped mandatory lunch break',
    amount: 15.00,
    status: 'paid',
    createdBy: 'Mike Chen',
    dueDate: '2026-01-04',
    paymentDate: '2026-01-03',
    notes: 'Please take your required breaks for health and compliance.'
  },
  {
    id: 'F-003',
    date: '2025-12-20',
    violationType: 'Early Clock-Out',
    description: 'Left 20 minutes before scheduled end time',
    amount: 30.00,
    status: 'disputed',
    timeLost: '20 minutes',
    createdBy: 'Sarah Johnson',
    dueDate: '2025-12-27',
    notes: 'Under review. Please provide explanation in HR portal.'
  },
  {
    id: 'F-004',
    date: '2025-12-15',
    violationType: 'Excessive Break Time',
    description: 'Break extended by 10 minutes beyond allowed time',
    amount: 20.00,
    status: 'waived',
    timeLost: '10 minutes',
    createdBy: 'Mike Chen',
    dueDate: '2025-12-22',
    paymentDate: '2025-12-21',
    notes: 'Waived due to emergency situation. One-time exception.'
  }
];

export default function MyFinesPage() {
  const [expandedFines, setExpandedFines] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const toggleExpand = (fineId: string) => {
    const newExpanded = new Set(expandedFines);
    if (newExpanded.has(fineId)) {
      newExpanded.delete(fineId);
    } else {
      newExpanded.add(fineId);
    }
    setExpandedFines(newExpanded);
  };

  const filteredFines = filterStatus === 'all' 
    ? mockFines 
    : mockFines.filter(fine => fine.status === filterStatus);

  const totalPending = mockFines.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0);
  const totalPaid = mockFines.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'disputed':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'waived':
        return <XCircle className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      paid: 'bg-green-100 text-green-800 border-green-200',
      disputed: 'bg-orange-100 text-orange-800 border-orange-200',
      waived: 'bg-gray-100 text-gray-600 border-gray-200'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900">My Fines</h1>
          </div>
          <p className="text-gray-600">View and manage your time violations and associated fines</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Pending</span>
              <AlertCircle className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">${totalPending.toFixed(2)}</div>
            <div className="text-sm text-gray-500 mt-1">
              {mockFines.filter(f => f.status === 'pending').length} pending fines
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Paid</span>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">${totalPaid.toFixed(2)}</div>
            <div className="text-sm text-gray-500 mt-1">
              {mockFines.filter(f => f.status === 'paid').length} paid fines
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">All Time Total</span>
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              ${(totalPending + totalPaid).toFixed(2)}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {mockFines.length} total fines
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="flex gap-2 p-2">
            {['all', 'pending', 'paid', 'disputed', 'waived'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {status === 'all' ? 'All Fines' : status.charAt(0).toUpperCase() + status.slice(1)}
                <span className="ml-2 text-xs opacity-70">
                  ({status === 'all' ? mockFines.length : mockFines.filter(f => f.status === status).length})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Fines List */}
        <div className="space-y-4">
          {filteredFines.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No fines found</h3>
              <p className="text-gray-600">
                {filterStatus === 'all' 
                  ? "You don't have any fines. Keep up the good work!"
                  : `You don't have any ${filterStatus} fines.`}
              </p>
            </div>
          ) : (
            filteredFines.map(fine => (
              <div
                key={fine.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      {getStatusIcon(fine.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{fine.violationType}</h3>
                          {getStatusBadge(fine.status)}
                        </div>
                        <p className="text-gray-600 mb-3">{fine.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Date</div>
                            <div className="flex items-center gap-1.5 text-sm text-gray-900">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {new Date(fine.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                          
                          {fine.timeLost && (
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Time Lost</div>
                              <div className="flex items-center gap-1.5 text-sm text-gray-900">
                                <Clock className="w-4 h-4 text-gray-400" />
                                {fine.timeLost}
                              </div>
                            </div>
                          )}
                          
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Amount</div>
                            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              ${fine.amount.toFixed(2)}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Due Date</div>
                            <div className="text-sm text-gray-900">
                              {new Date(fine.dueDate).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleExpand(fine.id)}
                      className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {expandedFines.has(fine.id) ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {/* Expanded Details */}
                  {expandedFines.has(fine.id) && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs font-medium text-gray-500 mb-1">Created By</div>
                          <div className="text-sm text-gray-900">{fine.createdBy}</div>
                        </div>
                        
                        {fine.paymentDate && (
                          <div>
                            <div className="text-xs font-medium text-gray-500 mb-1">Payment Date</div>
                            <div className="text-sm text-gray-900">
                              {new Date(fine.paymentDate).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                        )}
                        
                        {fine.notes && (
                          <div className="md:col-span-2">
                            <div className="text-xs font-medium text-gray-500 mb-1">Notes</div>
                            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                              {fine.notes}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {fine.status === 'pending' && (
                        <div className="flex gap-3 mt-4">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Mark as Paid
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            Dispute Fine
                          </button>
                        </div>
                      )}
                      
                      {fine.status === 'disputed' && (
                        <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                            <div>
                              <div className="font-medium text-orange-900">Under Review</div>
                              <div className="text-sm text-orange-700 mt-1">
                                Your dispute has been submitted and is being reviewed by HR. 
                                You will be notified of the decision within 5 business days.
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Help Section */}
        {mockFines.some(f => f.status === 'pending') && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
                <p className="text-sm text-blue-800 mb-3">
                  If you believe a fine was issued in error, you can dispute it by clicking the "Dispute Fine" button. 
                  Your dispute will be reviewed by HR, and you'll receive a response within 5 business days.
                </p>
                <p className="text-sm text-blue-800">
                  For immediate assistance, please contact HR at <span className="font-medium">hr@company.com</span> or 
                  call <span className="font-medium">(555) 123-4567</span>.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
