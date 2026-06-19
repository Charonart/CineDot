'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TicketHistory } from '../types/profile.type';
import { MapPin, Clock, Armchair, QrCode, ChevronDown } from 'lucide-react';

// ─── QR Code SVG (realistic visual mock) ─────────────────────────────────────
const QRCodeMock: React.FC<{ value: string }> = ({ value }) => {
  // Generate a deterministic grid pattern from the qrCodeString
  const hash = value.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const grid: boolean[][] = Array.from({ length: 21 }, (_, r) =>
    Array.from({ length: 21 }, (_, c) => {
      // Fixed finder patterns (corners)
      if ((r < 7 && c < 7) || (r < 7 && c > 13) || (r > 13 && c < 7)) {
        const inOuter = r === 0 || r === 6 || c === 0 || c === 6 || (r >= 14 && (r === 14 || r === 20)) || (c >= 14 && (c === 14 || c === 20));
        const inInner = (r >= 2 && r <= 4 && c >= 2 && c <= 4) ||
          (r >= 2 && r <= 4 && c >= 16 && c <= 18) ||
          (r >= 16 && r <= 18 && c >= 2 && c <= 4);
        return inOuter || inInner;
      }
      return ((hash * (r + 1) * (c + 1)) % 3) === 0;
    })
  );

  return (
    <svg
      width={84}
      height={84}
      viewBox="0 0 21 21"
      style={{ imageRendering: 'pixelated', display: 'block' }}
      aria-label="QR Code"
    >
      <rect width={21} height={21} fill="white" />
      {grid.map((row, r) =>
        row.map((filled, c) =>
          filled ? (
            <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#1A1A1A" />
          ) : null
        )
      )}
    </svg>
  );
};

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  UPCOMING: {
    label: 'Sắp Chiếu',
    color: '#4F46E5',
    bg: 'rgba(79,70,229,0.1)',
    glowColor: 'rgba(79,70,229,0.3)',
    dot: '#4F46E5',
  },
  COMPLETED: {
    label: 'Đã Xem',
    color: '#10B981',
    bg: 'rgba(16,185,129,0.1)',
    glowColor: 'rgba(16,185,129,0.2)',
    dot: '#10B981',
  },
  CANCELLED: {
    label: 'Đã Hủy',
    color: '#6B7280',
    bg: 'rgba(107,114,128,0.1)',
    glowColor: 'rgba(107,114,128,0.15)',
    dot: '#9CA3AF',
  },
};

// ─── Component ────────────────────────────────────────────────────────────────
interface TicketCardProps {
  ticket: TicketHistory;
  index?: number;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, index = 0 }) => {
  const [expanded, setExpanded] = useState(ticket.status === 'UPCOMING');
  const status = STATUS_CONFIG[ticket.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ position: 'relative' }}
    >
      <div
        style={{
          borderRadius: 20,
          overflow: 'hidden',
          background: '#FFFFFF',
          boxShadow: ticket.status === 'UPCOMING'
            ? `0 8px 32px rgba(79,70,229,0.15), 0 2px 8px rgba(0,0,0,0.06)`
            : '0 4px 20px rgba(0,0,0,0.08)',
          border: ticket.status === 'UPCOMING'
            ? '1px solid rgba(79,70,229,0.2)'
            : '1px solid rgba(0,0,0,0.06)',
          transition: 'box-shadow 0.3s ease, transform 0.3s ease',
          cursor: 'default',
        }}
        className="ticket-card-root"
      >
        {/* ── Poster Header ─────────────────────────────────────────────── */}
        <div style={{ position: 'relative', height: 170, overflow: 'hidden' }}>
          <img
            src={ticket.posterUrl}
            alt={ticket.movieTitle}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              filter: ticket.status === 'CANCELLED' ? 'grayscale(60%)' : 'none',
              transition: 'filter 0.3s',
            }}
          />
          {/* Gradient overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)',
          }} />

          {/* Status badge */}
          <div style={{
            position: 'absolute',
            top: 14,
            right: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 12px',
            borderRadius: 20,
            background: status.bg,
            backdropFilter: 'blur(8px)',
            border: `1px solid ${status.color}30`,
            boxShadow: `0 0 12px ${status.glowColor}`,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: status.dot, flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: status.color, letterSpacing: '0.04em' }}>
              {status.label}
            </span>
          </div>

          {/* Movie title over gradient */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 20px' }}>
            <h3 style={{
              margin: 0,
              fontSize: 17,
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1.3,
              letterSpacing: '-0.01em',
            }}>
              {ticket.movieTitle}
            </h3>
          </div>
        </div>

        {/* ── Cinema & Date Info ───────────────────────────────────────── */}
        <div style={{ padding: '16px 20px 12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={13} color="#6B7280" />
              <span style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>{ticket.cinemaName}</span>
              <span style={{ fontSize: 12, color: '#9CA3AF' }}>•</span>
              <span style={{ fontSize: 12, color: '#6B7280' }}>{ticket.roomName}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={13} color="#6B7280" />
              <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{ticket.formattedDate}</span>
              <span style={{
                fontSize: 13,
                fontWeight: 700,
                color: status.color,
                background: status.bg,
                padding: '2px 8px',
                borderRadius: 6,
              }}>
                {ticket.formattedTime}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Armchair size={13} color="#6B7280" />
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {ticket.seatLabels.map(seat => (
                  <span key={seat} style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#1A1A1A',
                    background: '#F3F4F6',
                    border: '1px solid #E5E7EB',
                    padding: '2px 8px',
                    borderRadius: 6,
                    letterSpacing: '0.02em',
                  }}>
                    {seat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Perforated Tear-off Line ─────────────────────────────────── */}
        <div style={{ position: 'relative', margin: '0 20px', height: 20, display: 'flex', alignItems: 'center' }}>
          {/* Left notch */}
          <div style={{
            position: 'absolute',
            left: -34,
            width: 20,
            height: 20,
            background: '#F8F9FA',
            borderRadius: '0 50% 50% 0',
            border: '1px solid #E5E7EB',
            borderLeft: 'none',
          }} />
          <div style={{
            flex: 1,
            borderTop: '2px dashed #E5E7EB',
          }} />
          {/* Right notch */}
          <div style={{
            position: 'absolute',
            right: -34,
            width: 20,
            height: 20,
            background: '#F8F9FA',
            borderRadius: '50% 0 0 50%',
            border: '1px solid #E5E7EB',
            borderRight: 'none',
          }} />
        </div>

        {/* ── QR Code Section ──────────────────────────────────────────── */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="qr"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{
                padding: '16px 20px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
              }}>
                {/* QR container */}
                <div style={{
                  padding: 10,
                  borderRadius: 14,
                  border: `2px solid ${status.color}30`,
                  boxShadow: `0 0 16px ${status.glowColor}, inset 0 0 8px ${status.glowColor}`,
                  background: '#FFFFFF',
                  flexShrink: 0,
                }}>
                  <QRCodeMock value={ticket.qrCodeString} />
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.08em', marginBottom: 6 }}>
                    MÃ ĐẶT VÉ
                  </div>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#1A1A1A',
                    fontFamily: 'monospace',
                    wordBreak: 'break-all',
                    marginBottom: 12,
                  }}>
                    {ticket.bookingId}
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid #F3F4F6',
                    paddingTop: 10,
                  }}>
                    <div>
                      <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, letterSpacing: '0.06em' }}>TỔNG TIỀN</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#1A1A1A' }}>{ticket.formattedAmount}</div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 11,
                      color: '#9CA3AF',
                    }}>
                      <QrCode size={12} />
                      <span>Xuất trình khi vào rạp</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Toggle Button ────────────────────────────────────────────── */}
        <button
          type="button"
          onClick={() => setExpanded(prev => !prev)}
          aria-expanded={expanded}
          aria-label={expanded ? 'Thu gọn vé' : 'Xem mã QR'}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: '10px 0',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#9CA3AF',
            fontSize: 12,
            fontWeight: 600,
            borderTop: '1px solid #F3F4F6',
            transition: 'color 0.2s',
          }}
          className="ticket-card-toggle"
        >
          <span>{expanded ? 'Thu gọn' : 'Xem mã QR'}</span>
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ChevronDown size={14} />
          </motion.span>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .ticket-card-root:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.12) !important;
        }
        .ticket-card-toggle:hover {
          color: #374151 !important;
        }
      `}} />
    </motion.div>
  );
};
