'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X, Info, Loader2 } from 'lucide-react';

export type ConfirmVariant = 'danger' | 'warning' | 'info';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
}

interface CineConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const CineConfirmContext = createContext<CineConfirmContextValue | null>(null);

export function useCineConfirm() {
  const context = useContext(CineConfirmContext);
  if (!context) {
    throw new Error('useCineConfirm must be used within a CineConfirmProvider');
  }
  return context.confirm;
}

export const CineConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);

  const [isConfirming, setIsConfirming] = useState(false);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setModalState({
        isOpen: true,
        options: {
          confirmText: options.variant === 'danger' ? 'XÁC NHẬN XÓA' : 'XÁC NHẬN',
          cancelText: 'HỦY BỎ',
          variant: 'danger',
          ...options,
        },
        resolve,
      });
      setIsConfirming(false);
    });
  }, []);

  const handleClose = (result: boolean) => {
    if (modalState) {
      modalState.resolve(result);
      setModalState(null);
    }
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      if (modalState) {
        modalState.resolve(true);
      }
    } finally {
      setIsConfirming(false);
      setModalState(null);
    }
  };

  return (
    <CineConfirmContext.Provider value={{ confirm }}>
      {children}

      <AnimatePresence>
        {modalState?.isOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              className="w-full max-w-md bg-white border border-purple-100/80 rounded-3xl p-6 sm:p-7 flex flex-col gap-5 shadow-2xl relative text-slate-900 overflow-hidden"
            >
              {/* Top Warning Icon Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      modalState.options.variant === 'danger'
                        ? 'bg-rose-50 text-rose-600 border border-rose-200/80'
                        : modalState.options.variant === 'warning'
                        ? 'bg-amber-50 text-amber-600 border border-amber-200/80'
                        : 'bg-purple-50 text-[#7C6FE8] border border-purple-200/80'
                    }`}
                  >
                    {modalState.options.variant === 'danger' ? (
                      <Trash2 className="w-6 h-6" />
                    ) : modalState.options.variant === 'warning' ? (
                      <AlertTriangle className="w-6 h-6" />
                    ) : (
                      <Info className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                      {modalState.options.title}
                    </h3>
                    <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-400">
                      Xác nhận thao tác Quản Trị
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleClose(false)}
                  disabled={isConfirming}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Message Content */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
                {modalState.options.message}
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleClose(false)}
                  disabled={isConfirming}
                  className="px-5 py-2.5 rounded-2xl border border-gray-200 hover:bg-slate-100 text-slate-600 font-bold text-xs cursor-pointer transition-colors"
                >
                  {modalState.options.cancelText || 'HỦY BỎ'}
                </button>

                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isConfirming}
                  className={`px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center gap-2 text-white ${
                    modalState.options.variant === 'danger'
                      ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/30'
                      : modalState.options.variant === 'warning'
                      ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/30'
                      : 'bg-[#7C6FE8] hover:bg-[#685bc7] shadow-[#7C6FE8]/30'
                  }`}
                >
                  {isConfirming ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : null}
                  <span>{modalState.options.confirmText}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </CineConfirmContext.Provider>
  );
};
