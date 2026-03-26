import { useState } from 'react';
import { PageLayout } from '../../shared/PageLayout';
import { StatusBadge } from '../../shared/StatusBadge';
import { Button } from '../../ui/button';
import {
  Upload, FileText, CheckCircle2, XCircle, Clock, Download, RefreshCw, AlertTriangle,
} from 'lucide-react';

interface ImportRecord {
  id: string; fileName: string; type: string; uploadedBy: string;
  uploadDate: string; records: number; status: 'Completed' | 'Processing' | 'Failed' | 'Pending Review';
  errors: number;
}

const IMPORTS: ImportRecord[] = [
  { id: 'im1', fileName: 'bank_statement_march_2026.csv', type: 'Bank Statement', uploadedBy: 'Alex Rivera', uploadDate: '2026-03-04T09:00:00Z', records: 245, status: 'Completed', errors: 0 },
  { id: 'im2', fileName: 'vendor_invoices_q1.xlsx', type: 'Invoices', uploadedBy: 'Sarah Johnson', uploadDate: '2026-03-03T14:30:00Z', records: 38, status: 'Completed', errors: 2 },
  { id: 'im3', fileName: 'expense_claims_feb.csv', type: 'Expense Claims', uploadedBy: 'Michael Chen', uploadDate: '2026-03-02T11:00:00Z', records: 67, status: 'Pending Review', errors: 0 },
  { id: 'im4', fileName: 'payroll_adjustments.xlsx', type: 'Payroll', uploadedBy: 'Alex Rivera', uploadDate: '2026-03-01T16:00:00Z', records: 12, status: 'Processing', errors: 0 },
  { id: 'im5', fileName: 'tax_receipts_2025.pdf', type: 'Tax Documents', uploadedBy: 'Lisa Anderson', uploadDate: '2026-02-28T10:00:00Z', records: 156, status: 'Failed', errors: 8 },
];

const STATUS_TYPE: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  Completed: 'success', Processing: 'info', Failed: 'danger', 'Pending Review': 'warning',
};

export function FinanceImportCenter() {
  const [imports, setImports] = useState(IMPORTS);
  const [dragOver, setDragOver] = useState(false);

  const handleRetry = (id: string) => {
    setImports(prev => prev.map(i => i.id === id ? { ...i, status: 'Processing' as const, errors: 0 } : i));
    setTimeout(() => {
      setImports(prev => prev.map(i => i.id === id ? { ...i, status: 'Completed' as const } : i));
    }, 2000);
  };

  const completed = imports.filter(i => i.status === 'Completed').length;
  const totalRecords = imports.reduce((s, i) => s + i.records, 0);

  return (
    <PageLayout
      title="Import Center"
      description="Import bank statements, invoices, and financial data from external sources"
      kpis={[
        { title: 'Total Imports', value: imports.length, change: `${completed} completed`, changeType: 'neutral', icon: <Upload className="h-5 w-5" /> },
        { title: 'Records Imported', value: totalRecords, changeType: 'positive', icon: <FileText className="h-5 w-5" /> },
        { title: 'Success Rate', value: `${Math.round((completed / imports.length) * 100)}%`, changeType: completed === imports.length ? 'positive' : 'warning', icon: <CheckCircle2 className="h-5 w-5" /> },
        { title: 'Errors', value: imports.reduce((s, i) => s + i.errors, 0), changeType: imports.reduce((s, i) => s + i.errors, 0) > 0 ? 'danger' : 'positive', icon: <AlertTriangle className="h-5 w-5" /> },
      ]}
    >
      {/* Drop Zone */}
      <div
        className={`mb-6 rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          dragOver ? 'border-primary bg-primary/5' : 'border-border'
        }`}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); alert('File upload simulated — in production this would process the file.'); }}
      >
        <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
        <p className="font-medium">Drop files here or click to upload</p>
        <p className="text-sm text-muted-foreground mt-1">Supports CSV, XLSX, OFX, QIF, and PDF formats</p>
        <Button variant="outline" className="mt-4">
          <Upload className="mr-2 h-4 w-4" /> Browse Files
        </Button>
      </div>

      {/* Supported formats */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['Bank Statements', 'Invoices', 'Expense Claims', 'Payroll Data', 'Tax Documents', 'Journal Entries'].map(fmt => (
          <span key={fmt} className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-xs">{fmt}</span>
        ))}
      </div>

      {/* Import History */}
      <div className="rounded-lg border border-border bg-card">
        <div className="p-4 border-b border-border">
          <h3 className="font-medium">Import History</h3>
        </div>
        <div className="divide-y divide-border">
          {imports.map(imp => (
            <div key={imp.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                imp.status === 'Completed' ? 'bg-green-500/10 text-green-600' :
                imp.status === 'Failed' ? 'bg-red-500/10 text-red-600' :
                imp.status === 'Processing' ? 'bg-blue-500/10 text-blue-600' :
                'bg-yellow-500/10 text-yellow-600'
              }`}>
                {imp.status === 'Completed' ? <CheckCircle2 className="h-5 w-5" /> :
                 imp.status === 'Failed' ? <XCircle className="h-5 w-5" /> :
                 imp.status === 'Processing' ? <RefreshCw className="h-5 w-5 animate-spin" /> :
                 <Clock className="h-5 w-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">{imp.fileName}</span>
                  <StatusBadge type={STATUS_TYPE[imp.status]}>{imp.status}</StatusBadge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <span>{imp.type}</span>
                  <span>{imp.records} records</span>
                  <span>by {imp.uploadedBy}</span>
                  <span>{new Date(imp.uploadDate).toLocaleDateString()}</span>
                </div>
              </div>
              {imp.errors > 0 && (
                <span className="text-xs text-red-600">{imp.errors} errors</span>
              )}
              <div className="flex gap-1">
                {imp.status === 'Failed' && (
                  <Button size="sm" variant="outline" onClick={() => handleRetry(imp.id)}>
                    <RefreshCw className="h-3.5 w-3.5 mr-1" /> Retry
                  </Button>
                )}
                {imp.status === 'Completed' && (
                  <Button size="sm" variant="ghost"><Download className="h-3.5 w-3.5" /></Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
