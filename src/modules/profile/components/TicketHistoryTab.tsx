'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTicketHistory } from '../hooks/useTicketHistory';
import { TicketCard } from './TicketCard';
import { TicketStatus } from '../types/profile.type';
import { Ticket, Inbox } from 'lucide-react';

// ─── Filter Tabs ──────────────────────────────────────────────────────────────
type FilterStatus = 'ALL' | TicketStatus;

const FILTERS: { key: FilterStatus; label: string }[] = [
  { key: 'ALL', label: 'Tất Cả' },
  { key: 'UPCOMING', label: 'Sắp Chiếu' },
  { key: 'COMPLETED', label: 'Đã Xem' },
  { key: 'CANCELLED', label: 'Đã Hủy' },
];

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState: React.FC<{ filter: FilterStatus }> = ({ filter }) => {
  const messages: Record<FilterStatus, { title: string; sub: string }> = {
    ALL: { title: 'Chưa có vé nào', sub: 'Đặt vé ngay để tận hưởng trải nghiệm rạp chiếu bóng!' },
    UPCOMING: { title: 'Không có vé sắp chiếu', sub: 'Bạn chưa có lịch chiếu nào sắp tới.' },
    COMPLETED: { title: 'Chưa xem phim nào', sub: 'Lịch sử xem phim của bạn sẽ hiển thị ở đây.' },
    CANCELLED: { title: 'Không có vé đã hủy', sub: 'Bạn chưa hủy vé nào.' },
  };
  const msg = messages[filter];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        gap: 16,
        textAlign: 'center',
      }}
    >
      <div style={{
        width: 72,
        height: 72,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #F3F4F6, #E5E7EB)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Inbox size={32} color="#9CA3AF" />
      </div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#374151', marginBottom: 6 }}>{msg.title}</div>
        <div style={{ fontSize: 13.5, color: '#9CA3AF' }}>{msg.sub}</div>
      </div>
    </motion.div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────
export const TicketHistoryTab: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('ALL');
  const { data: allTickets, isLoading, isError } = useTicketHistory();

  const filtered = (allTickets ?? []).filter(t =>
    activeFilter === 'ALL' ? true : t.status === activeFilter
  );

  return (
    <div style={{ padding: '36px 40px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Ticket size={22} color="#4F46E5" />
          Lịch Sử Vé
        </h2>
        {!isLoading && allTickets && (
          <p style={{ margin: '6px 0 0', fontSize: 13.5, color: '#9CA3AF' }}>
            {allTickets.length} vé • {allTickets.filter(t => t.status === 'UPCOMING').length} sắp chiếu
          </p>
        )}
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          background: '#F3F4F6',
          borderRadius: 12,
          padding: 4,
          marginBottom: 28,
          width: 'fit-content',
        }}
        role="tablist"
        aria-label="Lọc vé theo trạng thái"
      >
        {FILTERS.map(({ key, label }) => {
          const isActive = activeFilter === key;
          return (
            <div key={key} style={{ position: 'relative' }}>
              {isActive && (
                <motion.div
                  layoutId="ticket-filter-indicator"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: '#FFFFFF',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <button
                id={`ticket-filter-${key.toLowerCase()}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(key)}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  padding: '7px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'transparent',
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#1A1A1A' : '#6B7280',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.2s',
                }}
              >
                {label}
              </button>
            </div>
          );
        })}
      </div>

      {/* Error state */}
      {isError && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#EF4444', fontSize: 14 }}>
          Không thể tải lịch sử vé. Vui lòng thử lại.
        </div>
      )}

      {/* Ticket list with stagger */}
      {!isLoading && !isError && (
        filtered.length === 0
          ? <EmptyState filter={activeFilter} />
          : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {filtered.map((ticket, i) => (
                <TicketCard key={ticket.id} ticket={ticket} index={i} />
              ))}
            </div>
          )
      )}
    </div>
  );
};
