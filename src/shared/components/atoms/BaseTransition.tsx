import React, { ReactNode } from 'react';
import { Transition } from '@headlessui/react';
import { cn } from '@/shared/lib/utils';

export interface BaseTransitionProps {
  show: boolean;
  appear?: boolean;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'scale' | 'pop';
  children: ReactNode;
  className?: string;
}

export const BaseTransition: React.FC<BaseTransitionProps> = ({
  show,
  appear = false,
  animation = 'fade',
  children,
  className,
}) => {
  const transitions = {
    fade: "transition duration-300 ease-in data-closed:opacity-0",
    'slide-up': "transition duration-300 ease-out data-closed:translate-y-4 data-closed:opacity-0",
    'slide-down': "transition duration-300 ease-out data-closed:-translate-y-4 data-closed:opacity-0",
    scale: "transition duration-300 ease-out data-closed:scale-95 data-closed:opacity-0",
    pop: "transition duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] data-closed:scale-50 data-closed:opacity-0",
  };

  return (
    <Transition show={show} appear={appear}>
      <div className={cn(transitions[animation], className)}>
        {children}
      </div>
    </Transition>
  );
};
