'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface CineToastContextValue {
  showToast: (type: ToastType, message: string, title?: string, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const CineToastContext = createContext<CineToastContextValue | null>(null);

export function useCineToastContext() {
  const context = useContext(CineToastContext);
  if (!context) {
    throw new Error('useCineToastContext must be used within a CineToastProvider');
  }
  return context;
}

export const CineToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, message: string, title?: string, duration = 4000) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [newToast, ...prev].slice(0, 5)); // Keep max 5 active toasts

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, title = 'Thành Công') => showToast('success', message, title),
    [showToast]
  );
  const error = useCallback(
    (message: string, title = 'Lỗi Thao Tác') => showToast('error', message, title),
    [showToast]
  );
  const warning = useCallback(
    (message: string, title = 'Cảnh Báo Hệ Thống') => showToast('warning', message, title),
    [showToast]
  );
  const info = useCallback(
    (message: string, title = 'Thông Báo') => showToast('info', message, title),
    [showToast]
  );

  return (
    <CineToastContext.Provider
      value={{ showToast, removeToast, success, error, warning, info }}
    >
      {children}

      {/* Floating Toast Notification Container */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-[calc(100vw-2.5rem)] pointer-events-none select-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastCard key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </CineToastContext.Provider>
  );
};

const ToastCard: React.FC<{ toast: ToastItem; onClose: () => void }> = ({ toast, onClose }) => {
  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-white/95 border-emerald-200/90 shadow-emerald-500/10',
          iconBg: 'bg-emerald-50 text-emerald-600',
          progressBg: 'bg-emerald-500',
          badgeText: 'Thành công',
          Icon: CheckCircle2,
        };
      case 'error':
        return {
          bg: 'bg-white/95 border-rose-200/90 shadow-rose-500/10',
          iconBg: 'bg-rose-50 text-rose-600',
          progressBg: 'bg-rose-500',
          badgeText: 'Lỗi hệ thống',
          Icon: AlertCircle,
        };
      case 'warning':
        return {
          bg: 'bg-white/95 border-amber-200/90 shadow-amber-500/10',
          iconBg: 'bg-amber-50 text-amber-600',
          progressBg: 'bg-amber-500',
          badgeText: 'Cảnh báo',
          Icon: AlertTriangle,
        };
      case 'info':
      default:
        return {
          bg: 'bg-white/95 border-purple-200/90 shadow-purple-500/10',
          iconBg: 'bg-purple-50 text-[#7C6FE8]',
          progressBg: 'bg-[#7C6FE8]',
          badgeText: 'Thông báo',
          Icon: Info,
        };
    }
  };

  const style = getStyles();
  const Icon = style.Icon;
  const duration = toast.duration || 4000;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`pointer-events-auto relative overflow-hidden rounded-2xl border p-4 shadow-xl backdrop-blur-xl transition-all ${style.bg}`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-xl shrink-0 ${style.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>

        <div className="flex flex-col gap-0.5 flex-1 pr-2 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs font-black text-slate-900 tracking-tight truncate">
              {toast.title || style.badgeText}
            </h4>
          </div>
          <p className="text-xs font-semibold text-slate-600 leading-relaxed break-words">
            {toast.message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Auto-dismiss Animated Progress Bar */}
      {duration > 0 && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          className={`absolute bottom-0 left-0 h-1 ${style.progressBg}`}
        />
      )}
    </motion.div>
  );
};
