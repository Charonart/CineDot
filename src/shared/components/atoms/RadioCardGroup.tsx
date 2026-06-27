import React from 'react';
import { Field, Label, Description, Radio, RadioGroup } from '@headlessui/react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface RadioOption {
  value: any;
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  disabled?: boolean;
}

export interface RadioCardGroupProps {
  options: RadioOption[];
  value: any;
  onChange: (value: any) => void;
  orientation?: 'horizontal' | 'vertical';
  cardStyle?: boolean;
  className?: string;
}

export const RadioCardGroup: React.FC<RadioCardGroupProps> = ({
  options,
  value,
  onChange,
  orientation = 'vertical',
  cardStyle = true,
  className,
}) => {
  return (
    <RadioGroup value={value} onChange={onChange} className={cn("w-full", className)} aria-label="Server size">
      <div className={cn(
        "flex gap-3",
        orientation === 'vertical' ? "flex-col" : "flex-row"
      )}>
        {options.map((option, idx) => (
          <Field key={idx} className={cn("flex items-center gap-3", cardStyle && "w-full")}>
            {cardStyle ? (
              <Radio
                value={option.value}
                disabled={option.disabled}
                className={cn(
                  "group flex w-full cursor-pointer items-center justify-between rounded-xl px-5 py-4",
                  "border border-white/10 bg-white/5",
                  "data-checked:bg-red-500/10 data-checked:border-red-500",
                  "data-disabled:opacity-50 data-disabled:cursor-not-allowed",
                  "focus:outline-none data-focus:outline-1 data-focus:outline-white"
                )}
              >
                <div className="flex flex-col">
                  <Label className="text-sm font-medium text-white">{option.title}</Label>
                  {option.description && (
                    <Description className="text-sm text-zinc-400">{option.description}</Description>
                  )}
                </div>
                <CheckCircle2 className="size-6 text-red-500 opacity-0 group-data-checked:opacity-100 transition-opacity" />
              </Radio>
            ) : (
              <>
                <Radio
                  value={option.value}
                  disabled={option.disabled}
                  className={cn(
                    "group flex size-5 items-center justify-center rounded-full border border-zinc-500 bg-zinc-900",
                    "data-checked:border-red-500",
                    "data-disabled:opacity-50 data-disabled:cursor-not-allowed",
                    "focus:outline-none data-focus:outline-1 data-focus:outline-white"
                  )}
                >
                  <span className="invisible size-2.5 rounded-full bg-red-500 group-data-checked:visible" />
                </Radio>
                <div className="flex flex-col">
                  <Label className="text-sm font-medium text-white">{option.title}</Label>
                  {option.description && (
                    <Description className="text-sm text-zinc-400">{option.description}</Description>
                  )}
                </div>
              </>
            )}
          </Field>
        ))}
      </div>
    </RadioGroup>
  );
};
