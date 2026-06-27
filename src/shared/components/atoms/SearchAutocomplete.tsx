import React from 'react';
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { Check, Search, X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface AutocompleteOption {
  id: string | number;
  name: string;
  [key: string]: any;
}

export interface SearchAutocompleteProps {
  options: AutocompleteOption[];
  value: AutocompleteOption | null;
  onChange: (value: AutocompleteOption | null) => void;
  query: string;
  setQuery: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  options,
  value,
  onChange,
  query,
  setQuery,
  placeholder = 'Search...',
  className,
}) => {
  return (
    <Combobox value={value} onChange={onChange} onClose={() => setQuery('')}>
      <div className={cn("relative w-full", className)}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
        <ComboboxInput
          className={cn(
            "w-full rounded-lg bg-zinc-900 border border-zinc-800 py-2.5 pl-10 pr-10 text-sm text-white",
            "focus:outline-none focus:ring-2 focus:ring-red-500/50"
          )}
          displayValue={(option: AutocompleteOption) => option?.name || ''}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
        />
        {query && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => setQuery('')}
          >
            <X className="size-4 text-zinc-400 hover:text-white" />
          </button>
        )}
      </div>

      <ComboboxOptions
        transition
        anchor="bottom"
        className={cn(
          "w-[var(--input-width)] mt-1 rounded-xl border border-zinc-800 bg-zinc-900 p-1 shadow-lg empty:invisible",
          "transition duration-100 ease-in data-closed:opacity-0"
        )}
      >
        {options.map((option) => (
          <ComboboxOption
            key={option.id}
            value={option}
            className="group relative flex cursor-default select-none items-center rounded-lg py-2 pl-10 pr-4 text-sm text-zinc-300 data-focus:bg-red-500/10 data-focus:text-red-500"
          >
            <Check className="invisible absolute left-3 size-4 text-red-500 group-data-selected:visible" />
            <span className="block truncate group-data-selected:font-medium">{option.name}</span>
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  );
};
