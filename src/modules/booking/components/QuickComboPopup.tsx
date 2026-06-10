'use client';

import React, { useEffect } from 'react';
import { ComboItem } from '../types';

export interface QuickComboPopupProps {
  isOpen: boolean;
  combo: ComboItem;
  onSkip: () => void;
  onBuyNow: () => void;
  onClose?: () => void;
}

export const QuickComboPopup: React.FC<QuickComboPopupProps> = ({
  isOpen,
  combo,
  onSkip,
  onBuyNow,
  onClose,
}) => {
  // Map Close button, Click Overlay, and ESC key to onSkip (equivalent to skip combo)
  const handleClose = React.useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      onSkip();
    }
  }, [onClose, onSkip]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div
      className="quick-combo-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-combo-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(19, 20, 19, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={handleClose}
    >
      <div
        className="quick-combo-modal"
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '32px',
          maxWidth: '440px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          position: 'relative',
          textAlign: 'center',
          border: '1px solid var(--border)',
          transform: 'scale(1)',
          transition: 'transform 0.3s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top-Right Close Button X */}
        <button
          type="button"
          className="quick-combo-close"
          onClick={handleClose}
          aria-label="Đóng gợi ý combo"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text3)',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#F6F6F6';
            e.currentTarget.style.color = '#131413';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none';
            e.currentTarget.style.color = 'var(--text3)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="quick-combo-header" style={{ marginBottom: '16px' }}>
          <span
            className="quick-combo-subtitle"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#4f3c93',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'block',
              marginBottom: '6px',
            }}
          >
            Đừng vào rạp tay không! 🍿🥤
          </span>
          <h3
            id="quick-combo-title"
            className="quick-combo-title"
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: '#131413',
              margin: 0,
              fontFamily: 'var(--font-head)',
            }}
          >
            {combo.name}
          </h3>
        </div>

        {/* Modal Body & Image */}
        <div className="quick-combo-body">
          <div
            className="quick-combo-image-wrap"
            style={{
              width: '100%',
              height: '180px',
              borderRadius: '12px',
              overflow: 'hidden',
              background: '#f9f9f9',
              marginBottom: '16px',
              border: '1px solid var(--border)',
            }}
          >
            <img
              src={combo.image}
              alt={combo.name}
              className="quick-combo-image"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          <p
            className="quick-combo-description"
            style={{
              fontSize: '14.5px',
              color: 'var(--text2)',
              lineHeight: '1.5',
              margin: '0 0 16px 0',
              textAlign: 'left',
            }}
          >
            {combo.description}
          </p>

          {/* Copy suggestion Callout box */}
          <div
            style={{
              background: '#F0EEF9',
              border: '1px solid #CFC9EB',
              borderRadius: '10px',
              padding: '12px 16px',
              color: '#4f3c93',
              fontWeight: 500,
              fontSize: '13px',
              textAlign: 'left',
              lineHeight: '1.4',
              marginBottom: '20px',
            }}
          >
            Nhận ngay combo bắp nước để trải nghiệm phim trọn vẹn hơn.
          </div>

          <div
            className="quick-combo-price"
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#131413',
              marginBottom: '24px',
            }}
          >
            {combo.price.toLocaleString('vi-VN')} đ
          </div>
        </div>

        {/* Modal Footer actions */}
        <div
          className="quick-combo-actions"
          style={{
            display: 'flex',
            gap: '12px',
          }}
        >
          <button
            type="button"
            className="quick-combo-skip"
            onClick={onSkip}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '10px',
              background: '#ffffff',
              border: '1px solid var(--border)',
              color: 'var(--text2)',
              fontWeight: 600,
              fontSize: '14.5px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F6F6F6';
              e.currentTarget.style.color = '#131413';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.color = 'var(--text2)';
            }}
          >
            Bỏ qua
          </button>
          <button
            type="button"
            className="quick-combo-buy"
            onClick={onBuyNow}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '10px',
              background: '#4f3c93',
              border: 'none',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '14.5px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(79, 60, 147, 0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#3e2e77';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#4f3c93';
              e.currentTarget.style.transform = 'none';
            }}
          >
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
};
