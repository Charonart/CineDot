"use client";
 
import { useTheme } from "next-themes";
import * as React from "react";
 
interface Tab {
  id: string;
  label: string;
}
 
interface SegmentedButtonProps {
  buttons: Tab[];
  defaultActive: string;
  onChange?: (activeId: string) => void;
}
 
export default function SegmentedButton({
  buttons,
  defaultActive,
  onChange,
}: SegmentedButtonProps) {
  const [active, setActive] = React.useState(defaultActive);
 
  const handleToggle = (id: string) => {
    setActive(id);
    if (onChange) onChange(id);
  };
 
  return (
    <div className="relative flex rounded-full bg-muted p-1">
      {buttons.map((btn) => (
        <button
          key={btn.id}
          onClick={() => handleToggle(btn.id)}
          className={`relative z-10 px-4 py-2 text-sm font-medium transition-colors ${
            active === btn.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {active === btn.id && (
            <span className="absolute inset-0 z-0 rounded-full bg-primary shadow-sm" />
          )}
          <span className="relative z-10">{btn.label}</span>
        </button>
      ))}
    </div>
  );
}
