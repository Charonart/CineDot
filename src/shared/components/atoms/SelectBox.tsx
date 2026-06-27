import React from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface SelectOption {
  id: string | number;
  name: string;
  disabled?: boolean;
}

export interface SelectBoxProps {
  options: SelectOption[];
  value: SelectOption | null;
  onChange: (value: SelectOption) => void;
  placeholder?: string;
  disabled?: boolean;
  variant?: 'solid' | 'outline';
  className?: string;
}

export const SelectBox: React.FC<SelectBoxProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  variant = 'solid',
  className,
}) => {
  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <ListboxButton
        className={cn(
          "relative w-full rounded-lg py-2.5 pl-3 pr-10 text-left text-sm text-white",
          "focus:outline-none focus:ring-2 focus:ring-red-500/50",
          variant === 'solid' ? "bg-zinc-900 border border-zinc-800" : "bg-transparent border border-zinc-700",
          "data-disabled:opacity-50 data-disabled:cursor-not-allowed",
          className
        )}
      >
        <span className="block truncate">{value ? value.name : <span className="text-zinc-500">{placeholder}</span>}</span>
        <ChevronDown className="pointer-events-none absolute inset-y-0 right-3 h-full w-4 text-zinc-400" />
      </ListboxButton>
      
      <ListboxOptions
        transition
        anchor="bottom"
        className={cn(
          "w-[var(--button-width)] mt-1 rounded-xl border border-zinc-800 bg-zinc-900 p-1 shadow-lg",
          "transition duration-100 ease-in data-closed:opacity-0"
        )}
      >
        {options.map((option) => (
          <ListboxOption
            key={option.id}
            value={option}
            disabled={option.disabled}
            className="group relative flex cursor-default select-none items-center rounded-lg py-2 pl-10 pr-4 text-sm text-zinc-300 data-focus:bg-red-500/10 data-focus:text-red-500 data-disabled:opacity-50 data-disabled:cursor-not-allowed"
          >
            <Check className="invisible absolute left-3 size-4 text-red-500 group-data-selected:visible" />
            <span className="block truncate group-data-selected:font-medium">{option.name}</span>
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
};
