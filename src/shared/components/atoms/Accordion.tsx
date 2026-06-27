import React from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface AccordionItem {
  id: string | number;
  title: string | React.ReactNode;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpenIndex?: number;
  variant?: 'separated' | 'grouped';
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenIndex,
  variant = 'separated',
  className,
}) => {
  return (
    <div className={cn(
      "w-full",
      variant === 'grouped' ? "rounded-xl border border-white/10 bg-white/5 divide-y divide-white/10" : "space-y-4",
      className
    )}>
      {items.map((item, index) => (
        <Disclosure key={item.id} defaultOpen={index === defaultOpenIndex}>
          <div className={cn(variant === 'separated' && "rounded-xl border border-white/10 bg-white/5")}>
            <DisclosureButton
              className={cn(
                "group flex w-full items-center justify-between px-4 py-4 text-sm font-medium text-white",
                "focus:outline-none data-focus:outline-1 data-focus:outline-white",
                variant === 'grouped' && "data-open:bg-white/5"
              )}
            >
              <span>{item.title}</span>
              <ChevronDown className="size-5 fill-white/60 group-data-hover:fill-white/75 group-data-open:rotate-180 transition-transform" />
            </DisclosureButton>
            <DisclosurePanel
              transition
              className="px-4 pb-4 text-sm text-zinc-400 origin-top transition duration-200 ease-out data-closed:-translate-y-6 data-closed:opacity-0"
            >
              {item.content}
            </DisclosurePanel>
          </div>
        </Disclosure>
      ))}
    </div>
  );
};
