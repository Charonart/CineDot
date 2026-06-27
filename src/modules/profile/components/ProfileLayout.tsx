'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProfileSidebar } from './ProfileSidebar';
import { AccountForm } from './AccountForm';
import { TicketHistoryTab } from './TicketHistoryTab';
import { ProfileTab } from '../types/profile.type';
import { User, Ticket, Tag } from 'lucide-react';

// ─── Mobile Tab Bar ───────────────────────────────────────────────────────────
const MOBILE_TABS: { key: ProfileTab; label: string; icon: React.ReactNode }[] = [
  { key: 'account', label: 'Tài Khoản', icon: <User size={18} /> },
  { key: 'tickets', label: 'Vé', icon: <Ticket size={18} /> },
  { key: 'vouchers', label: 'Vouchers', icon: <Tag size={18} /> },
];

// ─── Content Panel ────────────────────────────────────────────────────────────
const ContentPanel: React.FC<{ tab: ProfileTab }> = ({ tab }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={tab}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ flex: 1 }}
    >
      {tab === 'account' && <AccountForm />}
      {tab === 'tickets' && <TicketHistoryTab />}
      {tab === 'vouchers' && (
        <div style={{ padding: '80px 40px', textAlign: 'center', color: '#9CA3AF' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎟️</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Vouchers sắp ra mắt</div>
          <div style={{ fontSize: 14 }}>Tính năng này đang được phát triển.</div>
        </div>
      )}
    </motion.div>
  </AnimatePresence>
);

// ─── Main Layout ──────────────────────────────────────────────────────────────
export const ProfileLayout: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams?.get('tab') as ProfileTab | null;
  const validTabs: ProfileTab[] = ['account', 'tickets', 'vouchers'];
  const initialTab: ProfileTab = tabParam && validTabs.includes(tabParam) ? tabParam : 'account';

  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab);

  const handleTabChange = (tab: ProfileTab) => {
    setActiveTab(tab);
    // Update URL param without full page reload
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    if (tab === 'account') {
      params.delete('tab');
    } else {
      params.set('tab', tab);
    }
    const query = params.toString();
    router.replace(`/profile${query ? `?${query}` : ''}`, { scroll: false });
  };

  return (
    <>
      {/* ── Desktop Layout ────────────────────────────────────────────── */}
      <div
        className="profile-layout-desktop"
        style={{
          display: 'flex',
          minHeight: 'calc(100vh - 80px)',
          background: '#F8F9FA',
        }}
      >
        {/* Sidebar */}
        <aside
          className="profile-sidebar-col"
          style={{
            width: 280,
            flexShrink: 0,
            background: '#FFFFFF',
            borderRight: '1px solid #E9ECEF',
            position: 'sticky',
            top: 80,
            alignSelf: 'flex-start',
            height: 'calc(100vh - 80px)',
            overflowY: 'auto',
          }}
        >
          <ProfileSidebar activeTab={activeTab} onTabChange={handleTabChange} />
        </aside>

        {/* Content Area */}
        <main
          className="profile-content-col"
          style={{
            flex: 1,
            minWidth: 0,
            padding: 32,
          }}
        >
          <div style={{
            maxWidth: 760,
            background: '#FFFFFF',
            borderRadius: 20,
            border: '1px solid #E9ECEF',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            overflow: 'hidden',
            minHeight: 500,
          }}>
            <ContentPanel tab={activeTab} />
          </div>
        </main>
      </div>

      {/* ── Mobile Layout ─────────────────────────────────────────────── */}
      <div
        className="profile-layout-mobile"
        style={{ display: 'none', flexDirection: 'column', background: '#F8F9FA', minHeight: 'calc(100vh - 80px)' }}
      >
        {/* Top Tab Bar */}
        <div style={{
          display: 'flex',
          background: '#FFFFFF',
          borderBottom: '1px solid #E9ECEF',
          padding: '0 16px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
          role="tablist"
          aria-label="Profile navigation"
        >
          {MOBILE_TABS.map(({ key, label, icon }) => {
            const isActive = activeTab === key;
            return (
              <div key={key} style={{ position: 'relative', flex: 1 }}>
                <button
                  id={`profile-mobile-tab-${key}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleTabChange(key)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    padding: '12px 8px',
                    border: 'none',
                    background: 'transparent',
                    color: isActive ? '#4F46E5' : '#6B7280',
                    fontSize: 11,
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                  }}
                >
                  {icon}
                  {label}
                </button>
                {isActive && (
                  <motion.div
                    layoutId="mobile-tab-indicator"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: '15%',
                      right: '15%',
                      height: 2,
                      background: '#4F46E5',
                      borderRadius: 2,
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Content */}
        <div style={{ flex: 1, padding: '20px 16px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E9ECEF', overflow: 'hidden' }}>
            <ContentPanel tab={activeTab} />
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .profile-layout-desktop { display: none !important; }
          .profile-layout-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .profile-layout-desktop { display: flex !important; }
          .profile-layout-mobile { display: none !important; }
        }
      `}} />
    </>
  );
};
