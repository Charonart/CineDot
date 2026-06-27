import React from 'react';
import { Switch, Field, Label, Description } from '@headlessui/react';
import { cn } from '@/shared/lib/utils';

export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  size = 'md',
  label,
  description,
  disabled = false,
  className,
}) => {
  const switchSizes = {
    sm: 'h-4 w-8',
    md: 'h-6 w-11',
    lg: 'h-8 w-14',
  };

  const knobSizes = {
    sm: 'size-3 translate-x-1 group-data-checked:translate-x-4',
    md: 'size-5 translate-x-0.5 group-data-checked:translate-x-5.5',
    lg: 'size-7 translate-x-0.5 group-data-checked:translate-x-6.5',
  };

  const hasLabel = label || description;

  const renderSwitch = () => (
    <Switch
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className={cn(
        "group relative flex cursor-pointer rounded-full bg-zinc-700 p-0.5 transition-colors duration-200 ease-in-out",
        "focus:outline-none data-focus:outline-1 data-focus:outline-white",
        "data-checked:bg-red-500",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        switchSizes[size],
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none inline-block rounded-full bg-white ring-0 transition duration-200 ease-in-out",
          knobSizes[size]
        )}
      />
    </Switch>
  );

  if (hasLabel) {
    return (
      <Field className="flex items-center justify-between gap-4 data-disabled:opacity-50">
        <div className="flex flex-col">
          {label && <Label className="text-sm font-medium text-white">{label}</Label>}
          {description && <Description className="text-sm text-zinc-400 mt-1">{description}</Description>}
        </div>
        {renderSwitch()}
      </Field>
    );
  }

  return renderSwitch();
};
