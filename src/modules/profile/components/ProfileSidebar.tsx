'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useProfile } from '../hooks/useProfile';
import { ProfileTab } from '../types/profile.type';
import { User, Ticket, Tag, Star } from 'lucide-react';

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV_ITEMS: { key: ProfileTab; label: string; icon: React.ReactNode; disabled?: boolean }[] = [
  { key: 'account', label: 'Tài Khoản', icon: <User size={17} /> },
  { key: 'tickets', label: 'Vé Của Tôi', icon: <Ticket size={17} /> },
  { key: 'vouchers', label: 'Vouchers', icon: <Tag size={17} />, disabled: true },
];

// ─── Tier ring gradient ───────────────────────────────────────────────────────
const TIER_RING_GRADIENT: Record<string, string> = {
  Standard: 'linear-gradient(135deg, #9CA3AF, #6B7280)',
  VIP: 'linear-gradient(135deg, #FCD34D, #F59E0B)',
  VVIP: 'linear-gradient(135deg, #C084FC, #A855F7)',
};

// ─── Component ────────────────────────────────────────────────────────────────
interface ProfileSidebarProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ activeTab, onTabChange }) => {
  const { data: profile, isLoading } = useProfile();

  const tierColor = profile?.membershipMeta?.color ?? '#6B7280';
  const tierAccent = profile?.membershipMeta?.accentColor ?? '#9CA3AF';
  const tierRing = TIER_RING_GRADIENT[profile?.membershipTier ?? 'Standard'];

  const initials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '36px 0 24px',
    }}>
      {/* ── Avatar & Identity ─────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', padding: '0 24px 32px', borderBottom: '1px solid #F3F4F6' }}>
        {/* Avatar with tier ring */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              padding: 3,
              background: tierRing,
              boxShadow: `0 0 20px ${tierColor}40`,
            }}
            aria-hidden="true"
          >
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: isLoading
                ? 'linear-gradient(135deg, #E5E7EB, #D1D5DB)'
                : `linear-gradient(135deg, ${tierColor}, ${tierAccent})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
              fontWeight: 800,
              color: '#FFFFFF',
              border: '3px solid #FFFFFF',
              letterSpacing: '-0.02em',
            }}>
              {isLoading ? '…' : initials}
            </div>
          </div>
        </div>

        {/* Name */}
        <div style={{ fontSize: 17, fontWeight: 800, color: '#1A1A1A', marginBottom: 6, letterSpacing: '-0.01em' }}>
          {isLoading ? '—' : profile?.name}
        </div>
        <div style={{ fontSize: 12.5, color: '#9CA3AF', marginBottom: 14 }}>
          {isLoading ? '' : profile?.email}
        </div>

        {/* Membership badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 14px',
          borderRadius: 20,
          background: `${tierColor}18`,
          border: `1.5px solid ${tierColor}40`,
          boxShadow: `0 0 12px ${tierColor}20`,
        }}>
          <span style={{ fontSize: 14 }}>{profile?.membershipMeta?.icon ?? '⭐'}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: tierColor, letterSpacing: '0.04em' }}>
            {isLoading ? 'Member' : `${profile?.membershipTier} Member`}
          </span>
        </div>

        {/* Points */}
        {!isLoading && profile && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              marginTop: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              fontSize: 13,
              fontWeight: 600,
              color: '#6B7280',
            }}
          >
            <Star size={13} color={tierColor} fill={tierColor} />
            <span style={{ color: tierColor, fontWeight: 800, fontSize: 15 }}>{profile.formattedPoints}</span>
          </motion.div>
        )}
      </div>

      {/* ── Navigation ────────────────────────────────────────────────── */}
      <nav aria-label="Điều hướng tài khoản" style={{ padding: '16px 12px', flex: 1 }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV_ITEMS.map(({ key, label, icon, disabled }) => {
            const isActive = activeTab === key;
            return (
              <li key={key}>
                <button
                  id={`profile-nav-${key}`}
                  type="button"
                  disabled={disabled}
                  onClick={() => !disabled && onTabChange(key)}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={label}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: 'none',
                    background: isActive
                      ? `linear-gradient(135deg, ${tierColor}18, ${tierAccent}10)`
                      : 'transparent',
                    color: isActive ? tierColor : disabled ? '#D1D5DB' : '#374151',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: 14,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.18s ease',
                    position: 'relative',
                    boxShadow: isActive ? `inset 2px 0 0 ${tierColor}` : 'none',
                  }}
                  className={!disabled && !isActive ? 'profile-nav-btn' : ''}
                >
                  <span style={{ opacity: disabled ? 0.4 : 1 }}>{icon}</span>
                  <span style={{ opacity: disabled ? 0.4 : 1 }}>{label}</span>
                  {disabled && (
                    <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 600, color: '#D1D5DB', letterSpacing: '0.04em' }}>
                      Sắp ra mắt
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <style dangerouslySetInnerHTML={{ __html: `
        .profile-nav-btn:hover {
          background: #F9FAFB !important;
          color: #1A1A1A !important;
        }
      `}} />
    </div>
  );
};
