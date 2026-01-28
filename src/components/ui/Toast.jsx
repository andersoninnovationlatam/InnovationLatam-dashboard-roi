import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const toastTypes = {
  success: { icon: CheckCircle, bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400' },
  error: { icon: XCircle, bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400' },
  warning: { icon: AlertCircle, bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400' },
  info: { icon: AlertCircle, bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400' },
};

// Toast container
let toastContainer = null;
let setToasts = null;

export const ToastContainer = () => {
  const [toasts, setToastsState] = useState([]);
  
  useEffect(() => {
    setToasts = setToastsState;
    return () => { setToasts = null; };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onClose={() => {
          setToastsState(prev => prev.filter(t => t.id !== toast.id));
        }} />
      ))}
    </div>
  );
};

const Toast = ({ id, message, type = 'info', onClose }) => {
  const { icon: Icon, bg, border, text } = toastTypes[type];

  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${bg} ${border} border rounded-xl p-4 flex items-center gap-3 min-w-[300px] animate-slide-in`}>
      <Icon className={`w-5 h-5 ${text}`} />
      <span className="flex-1 text-white text-sm">{message}</span>
      <button onClick={onClose} className="text-slate-400 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Helper function to show toast
export const toast = {
  success: (message) => addToast(message, 'success'),
  error: (message) => addToast(message, 'error'),
  warning: (message) => addToast(message, 'warning'),
  info: (message) => addToast(message, 'info'),
};

const addToast = (message, type) => {
  if (setToasts) {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }
};

export default Toast;
