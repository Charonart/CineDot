import React, { ReactNode } from 'react';
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react';
import { X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface BaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string | ReactNode;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'cinematic';
  className?: string;
}

export const BaseDialog: React.FC<BaseDialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full m-4',
    cinematic: 'max-w-5xl w-full aspect-video',
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition duration-300 ease-out data-closed:opacity-0"
      />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          transition
          className={cn(
            'w-full rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl transition duration-300 ease-out data-closed:scale-95 data-closed:opacity-0',
            sizeClasses[size],
            className
          )}
        >
          {title && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <DialogTitle className="text-lg font-medium text-white">{title}</DialogTitle>
              <button onClick={onClose} className="text-zinc-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
          )}
          <div className="p-6">{children}</div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
