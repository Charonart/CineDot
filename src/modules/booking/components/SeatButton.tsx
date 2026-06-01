'use client';

import React from 'react';
import { SeatItem } from '../data/seatMapData';

interface SeatButtonProps {
  seat: SeatItem;
  isSelected: boolean;
  onToggle: (seat: SeatItem) => void;
}

export const SeatButton: React.FC<SeatButtonProps> = ({ seat, isSelected, onToggle }) => {
  const { type, status, label } = seat;
  const isSold = status === 'sold';
  const isLocked = status === 'locked';
  const isDisabled = isSold || isLocked;

  // Resolve custom seat styling based on type and status
  const getSeatStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '11px',
      fontWeight: 700,
      border: '1px solid var(--border)',
      borderRadius: '8px',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      userSelect: 'none',
      outline: 'none',
      height: '34px',
    };

    // Standard width or wide Couple capsule
    if (type === 'couple') {
      baseStyle.width = '84px'; // 2x wider than standard standard
      baseStyle.borderRadius = '10px';
    } else {
      baseStyle.width = '36px';
    }

    if (isSelected) {
      return {
        ...baseStyle,
        background: '#4f3c93', // Rich dark indigo/purple
        borderColor: '#4f3c93',
        color: '#ffffff',
        transform: 'scale(1.05)',
        boxShadow: '0 4px 10px rgba(79, 60, 147, 0.25)',
      };
    }

    if (isSold) {
      return {
        ...baseStyle,
        background: '#e0e0e0',
        borderColor: '#d0d0d0',
        color: '#8c8c8c',
        opacity: 0.6,
      };
    }

    if (isLocked) {
      return {
        ...baseStyle,
        background: '#f2eae1',
        borderColor: '#e8dcce',
        color: '#c29c78',
        opacity: 0.65,
      };
    }

    if (type === 'vip') {
      return {
        ...baseStyle,
        background: '#F0EEF9', // extremely elegant pastel lavender fill
        borderColor: '#CFC9EB', // accent border
        color: '#131413',
      };
    }

    if (type === 'couple') {
      return {
        ...baseStyle,
        background: '#FFF2F2', // soft pastel couple pink
        borderColor: '#FFA4A4',
        color: '#E53E3E',
      };
    }

    // Default Standard
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
      className={`seat-button seat-${type} seat-${status} ${isSelected ? 'seat-selected' : ''}`}
      disabled={isDisabled}
      style={getSeatStyle()}
      onClick={() => !isDisabled && onToggle(seat)}
      title={`${label} - ${type.toUpperCase()} (${seat.price.toLocaleString('vi-VN')} VND)`}
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
      {/* Icon rendering for locked or standard text label */}
      {isLocked ? (
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
