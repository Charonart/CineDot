import React from 'react';
import { Tab, TabGroup as HeadlessTabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { cn } from '@/shared/lib/utils';

export interface TabItem {
  id: string | number;
  label: string | React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabGroupProps {
  tabs: TabItem[];
  defaultIndex?: number;
  onChange?: (index: number) => void;
  variant?: 'underline' | 'pills';
  className?: string;
}

export const TabGroup: React.FC<TabGroupProps> = ({
  tabs,
  defaultIndex = 0,
  onChange,
  variant = 'underline',
  className,
}) => {
  return (
    <HeadlessTabGroup defaultIndex={defaultIndex} onChange={onChange}>
      <div className={cn("w-full", className)}>
        <TabList
          className={cn(
            "flex gap-4",
            variant === 'pills' ? "rounded-xl bg-white/5 p-1" : "border-b border-white/10 gap-8"
          )}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              disabled={tab.disabled}
              className={cn(
                "px-3 py-2 text-sm font-medium text-white focus:outline-none",
                variant === 'pills' 
                  ? "rounded-lg data-selected:bg-red-500 data-hover:bg-white/5 data-selected:data-hover:bg-red-600"
                  : "border-b-2 border-transparent data-selected:border-red-500 data-hover:border-white/20 data-selected:data-hover:border-red-600",
                "data-disabled:opacity-50 data-disabled:cursor-not-allowed"
              )}
            >
              {tab.label}
            </Tab>
          ))}
        </TabList>
        <TabPanels className="mt-4">
          {tabs.map((tab, idx) => (
            <TabPanel key={idx} className="rounded-xl focus:outline-none">
              {tab.content}
            </TabPanel>
          ))}
        </TabPanels>
      </div>
    </HeadlessTabGroup>
  );
};
