'use client';

import React from 'react';
import { Seat } from '../types/booking.type';

interface SeatButtonProps {
  seat: Seat;
  isSelected: boolean;
  onToggle: (seat: Seat) => void;
}

const getSeatTypeLabel = (type: Seat['type']) => {
  if (type === 'vip') return 'Ghế VIP';
  if (type === 'couple') return 'Ghế đôi';
  return 'Ghế thường';
};

const getSeatStatusLabel = (status: Seat['status']) => {
  if (status === 'sold') return 'đã bán';
  if (status === 'held') return 'đang giữ';
  if (status === 'unavailable') return 'không khả dụng';
  return 'còn trống';
};

export const SeatButton: React.FC<SeatButtonProps> = ({ seat, isSelected, onToggle }) => {
  const { type, status, label } = seat;
  const isDisabled = status !== 'available';

  const getSeatStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '11px',
      fontWeight: 700,
      border: '1px solid var(--border)',
      borderRadius: type === 'couple' ? '10px' : '8px',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      userSelect: 'none',
      outline: 'none',
      height: '34px',
      width: type === 'couple' ? '84px' : '36px',
    };

    if (isSelected) {
      return {
        ...baseStyle,
        background: '#4f3c93',
        borderColor: '#4f3c93',
        color: '#ffffff',
        transform: 'scale(1.05)',
        boxShadow: '0 4px 10px rgba(79, 60, 147, 0.25)',
      };
    }

    if (status === 'sold') {
      return {
        ...baseStyle,
        background: '#e0e0e0',
        borderColor: '#d0d0d0',
        color: '#8c8c8c',
        opacity: 0.6,
      };
    }

    if (status === 'held') {
      return {
        ...baseStyle,
        background: '#f2eae1',
        borderColor: '#e8dcce',
        color: '#c29c78',
        opacity: 0.65,
      };
    }

    if (status === 'unavailable') {
      return {
        ...baseStyle,
        background: '#f4f4f5',
        borderColor: '#d4d4d8',
        color: '#a1a1aa',
        opacity: 0.5,
      };
    }

    if (type === 'vip') {
      return {
        ...baseStyle,
        background: '#F0EEF9',
        borderColor: '#CFC9EB',
        color: '#131413',
      };
    }

    if (type === 'couple') {
      return {
        ...baseStyle,
        background: '#FFF2F2',
        borderColor: '#FFA4A4',
        color: '#E53E3E',
      };
    }

    return {
      ...baseStyle,
      background: '#ffffff',
      borderColor: '#d9d9d9',
      color: '#131413',
    };
  };

  return (
    <button
      type="button"
      className={`seat-button seat-${type} seat-${status} ${status === 'held' ? 'seat-locked' : ''} ${isSelected ? 'seat-selected' : ''}`}
      disabled={isDisabled}
      aria-pressed={isSelected}
      aria-label={`${label}, ${getSeatTypeLabel(type)}, ${seat.price.toLocaleString('vi-VN')} đồng, ${getSeatStatusLabel(status)}`}
      style={getSeatStyle()}
      onClick={() => !isDisabled && onToggle(seat)}
      title={`${label} - ${getSeatTypeLabel(type)} (${seat.price.toLocaleString('vi-VN')} VND)`}
      onMouseEnter={(e) => {
        if (!isDisabled && !isSelected) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.borderColor = '#4f3c93';
        }
      }}
      onMouseLeave={(e) => {
        if (!isDisabled && !isSelected) {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.borderColor = type === 'vip' ? '#CFC9EB' : type === 'couple' ? '#FFA4A4' : '#d9d9d9';
        }
      }}
    >
      {status === 'held' ? (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: 0.8 }}>
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ) : (
        label
      )}
    </button>
  );
};
