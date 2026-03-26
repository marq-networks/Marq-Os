/**
 * Simple Toast Utility
 * Provides user feedback for actions
 */

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  duration?: number;
  position?: 'top' | 'bottom';
}

const showToast = (message: string, type: ToastType = 'info', options: ToastOptions = {}) => {
  // For now, use browser alert
  // In production, this would trigger a toast component
  const emoji = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
  }[type];
  
  console.log(`${emoji} ${type.toUpperCase()}: ${message}`);
  
  // Simple visual feedback
  if (typeof window !== 'undefined') {
    // Create toast element
    const toast = document.createElement('div');
    toast.textContent = `${emoji} ${message}`;
    toast.style.cssText = `
      position: fixed;
      ${options.position === 'bottom' ? 'bottom: 20px' : 'top: 20px'};
      right: 20px;
      padding: 12px 20px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
      color: white;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      z-index: 9999;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, options.duration || 3000);
  }
};

export const toast = {
  success: (message: string, options?: ToastOptions) => showToast(message, 'success', options),
  error: (message: string, options?: ToastOptions) => showToast(message, 'error', options),
  info: (message: string, options?: ToastOptions) => showToast(message, 'info', options),
  warning: (message: string, options?: ToastOptions) => showToast(message, 'warning', options),
};

// Add CSS animations if not present
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}
