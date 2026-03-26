import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
}

export function FormField({ label, name, required, error, helperText, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, className = '', ...props }: InputProps) {
  return (
    <input
      className={`w-full px-3 py-2 rounded-md border ${
        error 
          ? 'border-red-500 focus:ring-red-500' 
          : 'border-border focus:ring-primary'
      } bg-background focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${className}`}
      {...props}
    />
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function TextArea({ error, className = '', ...props }: TextAreaProps) {
  return (
    <textarea
      className={`w-full px-3 py-2 rounded-md border ${
        error 
          ? 'border-red-500 focus:ring-red-500' 
          : 'border-border focus:ring-primary'
      } bg-background focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors resize-none ${className}`}
      {...props}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: { value: string; label: string }[];
}

export function Select({ error, options, className = '', ...props }: SelectProps) {
  return (
    <select
      className={`w-full px-3 py-2 rounded-md border ${
        error 
          ? 'border-red-500 focus:ring-red-500' 
          : 'border-border focus:ring-primary'
      } bg-background focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${className}`}
      {...props}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

interface APIDocProps {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  payload?: Record<string, any>;
  response?: Record<string, any>;
}

export function APIDoc({ endpoint, method, payload, response }: APIDocProps) {
  const methodColors = {
    GET: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    POST: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    PUT: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
    PATCH: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
    DELETE: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  };

  return (
    <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-3 font-mono text-xs">
      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 rounded ${methodColors[method]}`}>
          {method}
        </span>
        <span className="text-muted-foreground">{endpoint}</span>
      </div>
      
      {payload && (
        <div>
          <p className="text-muted-foreground mb-2">Request Body:</p>
          <pre className="bg-background p-3 rounded border border-border overflow-x-auto">
            {JSON.stringify(payload, null, 2)}
          </pre>
        </div>
      )}

      {response && (
        <div>
          <p className="text-muted-foreground mb-2">Response:</p>
          <pre className="bg-background p-3 rounded border border-border overflow-x-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
