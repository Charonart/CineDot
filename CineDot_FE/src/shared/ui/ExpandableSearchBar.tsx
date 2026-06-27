'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { cn } from '@shared/lib/utils';

interface ExpandableSearchBarProps {
  placeholder?: string;
  expandedWidth?: string;
  onSubmit?: (val: string) => void;
  onChange?: (val: string) => void;
  className?: string;
}

export const ExpandableSearchBar: React.FC<ExpandableSearchBarProps> = ({
  placeholder = "Tìm phim...",
  onSubmit,
  onChange,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const COLLAPSED_WIDTH = 44; // 44px
  const EXPANDED_WIDTH = 260; // 260px

  // Click outside to collapse if empty
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        if (!searchValue.trim()) {
          setIsExpanded(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchValue]);

  // Autofocus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Keyboard actions
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      if (searchValue) {
        setSearchValue('');
        if (onChange) onChange('');
      } else {
        setIsExpanded(false);
      }
    }
  };

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isExpanded) {
      setIsExpanded(true);
    } else if (searchValue.trim()) {
      handleFormSubmit();
    } else {
      setIsExpanded(false);
    }
  };

  const handleFormSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    const trimmed = searchValue.trim();
    if (trimmed && onSubmit) {
      onSubmit(trimmed);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchValue('');
    if (onChange) onChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "navbar-search-slot relative h-[38px] flex-shrink-0",
        className
      )}
      style={{ width: COLLAPSED_WIDTH, flex: `0 0 ${COLLAPSED_WIDTH}px` }}
    >
      <motion.form
        onSubmit={handleFormSubmit}
        animate={{
          width: isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
        }}
        transition={{
          type: "spring",
          stiffness: 360,
          damping: 34,
          mass: 0.75
        }}
        className={cn(
          "absolute right-0 top-0 h-full rounded-full transition-colors duration-300 overflow-hidden cursor-pointer z-20",
          isExpanded ? "bg-white" : "bg-transparent"
        )}
        style={isExpanded ? {
          border: '1px solid rgba(19, 20, 19, 0.08)',
          boxShadow: '0 2px 8px rgba(19, 20, 19, 0.04)',
        } : undefined}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        <button
          type="button"
          onClick={handleIconClick}
          className={cn(
            "absolute left-0 top-0 z-10 flex h-full w-11 items-center justify-center transition-colors focus:outline-none shrink-0",
            isExpanded ? "text-zinc-500 hover:text-[#131413]" : "text-[var(--text2)] hover:text-[var(--text)]"
          )}
          aria-label="Search"
        >
          <Search size={18} />
        </button>

        <div
          className="w-full h-full transition-opacity duration-200"
          style={{ opacity: isExpanded ? 1 : 0, pointerEvents: isExpanded ? "auto" : "none" }}
        >
          <input
            ref={inputRef}
            type="text"
            value={searchValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            tabIndex={isExpanded ? 0 : -1}
            className="h-full w-full box-border bg-transparent text-[13.5px] font-medium text-[#131413] placeholder-[#7A7A80] outline-none focus:ring-0 focus:border-none relative z-0"
            style={{
              paddingLeft: 54,
              paddingRight: 44,
            }}
            aria-label="Search input"
          />
        </div>

        <AnimatePresence>
          {isExpanded && searchValue && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              onClick={handleClear}
              className="absolute right-3 top-0 h-full flex items-center justify-center text-zinc-400 hover:text-zinc-600 focus:outline-none shrink-0 z-10"
              aria-label="Clear search"
            >
              <X size={15} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.form>
    </div>
  );
};
