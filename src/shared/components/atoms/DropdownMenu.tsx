import React, { ReactNode } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { cn } from '@/shared/lib/utils';

export interface DropdownMenuItem {
  label: string | ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  danger?: boolean;
}

export interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownMenuItem[];
  placement?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  className?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  placement = 'bottom-right',
  className,
}) => {
  const anchorMap = {
    'bottom-left': 'bottom start',
    'bottom-right': 'bottom end',
    'top-left': 'top start',
    'top-right': 'top end',
  } as const;

  return (
    <Menu>
      <MenuButton as={React.Fragment}>{trigger}</MenuButton>
      <MenuItems
        transition
        anchor={anchorMap[placement]}
        className={cn(
          "w-56 mt-2 rounded-xl bg-zinc-900 border border-zinc-800 shadow-lg p-1",
          "transition duration-100 ease-out data-closed:scale-95 data-closed:opacity-0",
          className
        )}
      >
        {items.map((item, index) => {
          const Element = item.href ? 'a' : 'button';
          return (
            <MenuItem key={index} disabled={item.disabled}>
              <Element
                href={item.href}
                onClick={item.onClick}
                className={cn(
                  'group flex w-full items-center rounded-lg px-3 py-2 text-sm text-zinc-300',
                  'data-focus:bg-zinc-800 data-focus:text-white',
                  'data-disabled:opacity-50 data-disabled:cursor-not-allowed',
                  item.danger && 'text-red-400 data-focus:bg-red-500/10 data-focus:text-red-500'
                )}
              >
                {item.icon && <span className="mr-3 size-4">{item.icon}</span>}
                {item.label}
              </Element>
            </MenuItem>
          );
        })}
      </MenuItems>
    </Menu>
  );
};
