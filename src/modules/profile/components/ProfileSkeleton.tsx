'use client';

import React from 'react';

// ─── Shimmer keyframes injected once ─────────────────────────────────────────
const shimmerCSS = `
@keyframes profileShimmer {
  0%   { background-position: -600px 0; }
  100% { background-position: 600px 0; }
}
.ps-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 600px 100%;
  animation: profileShimmer 1.4s ease-in-out infinite;
  border-radius: 8px;
}
`;

const ShimmerBox = ({ width, height, style }: { width?: string; height?: string; style?: React.CSSProperties }) => (
  <div className="ps-shimmer" style={{ width: width ?? '100%', height: height ?? '16px', borderRadius: '8px', ...style }} />
);

const ShimmerCircle = ({ size }: { size: number }) => (
  <div className="ps-shimmer" style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0 }} />
);

// ─── Sidebar Skeleton ─────────────────────────────────────────────────────────
const SidebarSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '32px 24px' }}>
    <ShimmerCircle size={100} />
    <ShimmerBox width="140px" height="20px" />
    <ShimmerBox width="80px" height="24px" style={{ borderRadius: 12 }} />
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
          <ShimmerCircle size={20} />
          <ShimmerBox width="100px" height="16px" />
        </div>
      ))}
    </div>
  </div>
);

// ─── Account Form Skeleton ────────────────────────────────────────────────────
const AccountFormSkeleton = () => (
  <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 28 }}>
    <ShimmerBox width="180px" height="28px" />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <ShimmerBox width="80px" height="14px" />
          <ShimmerBox width="100%" height="48px" style={{ borderRadius: 10 }} />
        </div>
      ))}
    </div>
    <ShimmerBox width="140px" height="44px" style={{ borderRadius: 10 }} />
  </div>
);

// ─── Ticket Card Skeleton ─────────────────────────────────────────────────────
const TicketCardSkeleton = () => (
  <div style={{
    borderRadius: 20,
    overflow: 'hidden',
    background: '#fff',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  }}>
    {/* Poster area */}
    <ShimmerBox width="100%" height="180px" style={{ borderRadius: 0 }} />
    {/* Content area */}
    <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ShimmerBox width="70%" height="22px" />
      <ShimmerBox width="50%" height="16px" />
      <div style={{ display: 'flex', gap: 8 }}>
        <ShimmerBox width="40px" height="28px" style={{ borderRadius: 6 }} />
        <ShimmerBox width="40px" height="28px" style={{ borderRadius: 6 }} />
      </div>
    </div>
    {/* Tear-off area */}
    <div style={{ borderTop: '2px dashed #e5e7eb', margin: '0 24px' }} />
    <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
      <ShimmerBox width="80px" height="80px" style={{ borderRadius: 10, flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <ShimmerBox width="100%" height="14px" />
        <ShimmerBox width="60%" height="14px" />
        <ShimmerBox width="80%" height="14px" />
      </div>
    </div>
  </div>
);

// ─── Public Export ────────────────────────────────────────────────────────────
interface ProfileSkeletonProps {
  view?: 'account' | 'tickets';
}

export const ProfileSkeleton: React.FC<ProfileSkeletonProps> = ({ view = 'account' }) => {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: shimmerCSS }} />
      <div style={{
        display: 'flex',
        minHeight: '70vh',
        gap: 0,
        background: '#F8F9FA',
      }}>
        {/* Sidebar skeleton */}
        <div style={{
          width: 280,
          flexShrink: 0,
          background: '#fff',
          borderRight: '1px solid #E9ECEF',
        }}>
          <SidebarSkeleton />
        </div>

        {/* Content skeleton */}
        <div style={{ flex: 1, padding: 32 }}>
          {view === 'account' ? (
            <div style={{
              background: '#fff',
              borderRadius: 20,
              border: '1px solid #E9ECEF',
              overflow: 'hidden',
            }}>
              <AccountFormSkeleton />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[1, 2, 3].map(i => <TicketCardSkeleton key={i} />)}
            </div>
          )}
        </div>
      </div>

      {/* Mobile skeleton */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .profile-skeleton-sidebar { display: none !important; }
          .profile-skeleton-content { padding: 20px !important; }
        }
      `}} />
    </>
  );
};
