"use client";

import React from 'react';
import { Bell, Search, User } from 'lucide-react';

export const AdminHeader = () => {
  return (
    <header className="h-16 bg-[var(--color-admin-surface)] border-b border-[var(--color-admin-border)] flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-admin-text-secondary)] w-4 h-4 group-focus-within:text-[var(--color-admin-brand)] transition-colors" />
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            className="w-full pl-10 pr-4 py-2 bg-[var(--color-admin-bg)] border border-[var(--color-admin-border)] rounded-full text-sm focus:outline-none focus:border-[var(--color-admin-brand)] focus:ring-1 focus:ring-[var(--color-admin-brand)] transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-[var(--color-admin-text-secondary)] hover:text-[var(--color-admin-text-primary)] hover:bg-[var(--color-admin-bg)] rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-admin-accent)] rounded-full border border-[var(--color-admin-surface)]"></span>
        </button>

        <div className="h-6 w-px bg-[var(--color-admin-border)] mx-1"></div>

        {/* Profile */}
        <button className="flex items-center gap-3 hover:bg-[var(--color-admin-bg)] p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-[var(--color-admin-border)]">
          <div className="w-8 h-8 rounded-full bg-[var(--color-admin-brand-light)] flex items-center justify-center text-[var(--color-admin-brand)] font-bold">
            <User className="w-4 h-4" />
          </div>
          <div className="text-sm font-medium text-[var(--color-admin-text-primary)] hidden md:block">
            Admin
          </div>
        </button>
      </div>
    </header>
  );
};
