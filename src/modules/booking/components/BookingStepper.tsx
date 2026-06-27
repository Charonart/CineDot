'use client';

import React from 'react';

export type BookingStepKey = 'schedule' | 'seats' | 'foods' | 'payment' | 'confirm';

interface BookingStepperProps {
  currentStep: BookingStepKey;
}

export const BookingStepper: React.FC<BookingStepperProps> = ({ currentStep }) => {
  const steps = [
    { key: 'schedule', label: 'Chọn phim / Rạp / Suất' },
    { key: 'seats', label: 'Chọn ghế' },
    { key: 'foods', label: 'Bắp nước' },
    { key: 'payment', label: 'Thanh toán' },
    { key: 'confirm', label: 'Xác nhận' },
  ];

  const getStepIndex = (key: string) => steps.findIndex((s) => s.key === key);
  const currentIndex = getStepIndex(currentStep);

  return (
    <div
      className="booking-stepper"
      style={{
        width: '100%',
        maxWidth: '960px',
        margin: '0 auto 24px auto',
        padding: '12px 24px',
        background: '#ffffff',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.02)',
        overflow: 'visible',
      }}
    >
      <div
        className="booking-stepper-inner"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          width: '100%',
          overflowX: 'auto',
          scrollbarWidth: 'none', // hide scrollbar firefox
          msOverflowStyle: 'none', // hide scrollbar IE
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* CSS styles for transition effects, line fills, pop animation and reduced motion support */}
        <style dangerouslySetInnerHTML={{
          __html: `
          .booking-stepper-inner::-webkit-scrollbar {
            display: none !important;
          }
          
          .booking-stepper-circle {
            transition: transform 220ms ease, background 220ms ease, color 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
          }
          
          .booking-stepper-item.is-active .booking-stepper-circle {
            transform: scale(1.08);
            box-shadow: 0 4px 12px rgba(79, 60, 147, 0.22);
          }
          
          .booking-stepper-label {
            transition: color 220ms ease, font-weight 220ms ease, transform 220ms ease;
          }
          
          .booking-stepper-item.is-active .booking-stepper-label {
            transform: translateY(-0.5px);
          }
          
          .booking-stepper-line {
            position: relative;
            overflow: hidden;
          }
          
          .booking-stepper-line::after {
            content: "";
            position: absolute;
            inset: 0;
            transform: scaleX(0);
            transform-origin: left;
            background: #4f3c93;
            transition: transform 320ms ease;
          }
          
          .booking-stepper-line.is-completed::after {
            transform: scaleX(1);
          }
          
          @keyframes stepCheckPop {
            0% { transform: scale(0.6); opacity: 0; }
            70% { transform: scale(1.15); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          
          @media (prefers-reduced-motion: reduce) {
            .booking-stepper-circle,
            .booking-stepper-label,
            .booking-stepper-line::after {
              animation: none !important;
              transition: none !important;
            }
          }
          
          @media (max-width: 768px) {
            .booking-stepper-inner {
              justify-content: flex-start !important;
            }
          }
        `}} />

        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isActive = idx === currentIndex;
          const isUpcoming = idx > currentIndex;

          let textColor = 'var(--text3)';
          let badgeBg = 'var(--bg2)';
          let badgeColor = 'var(--text3)';
          let borderStyle = '1px solid var(--border)';

          if (isActive) {
            textColor = '#4f3c93';
            badgeBg = '#4f3c93';
            badgeColor = '#ffffff';
            borderStyle = '1px solid rgba(79, 60, 147, 0.2)';
          } else if (isCompleted) {
            textColor = 'var(--text)';
            badgeBg = '#F0EEF9';
            badgeColor = '#4f3c93';
            borderStyle = '1px solid #CFC9EB';
          } else {
            textColor = 'var(--text3)';
            badgeBg = 'var(--bg2)';
            badgeColor = 'var(--text3)';
            borderStyle = '1px solid var(--border)';
          }

          return (
            <React.Fragment key={step.key}>
              <div
                className={`booking-stepper-item ${isActive ? 'is-active' : ''} ${isCompleted ? 'is-completed' : ''} ${isUpcoming ? 'is-disabled' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: isActive ? 'rgba(79, 60, 147, 0.05)' : 'transparent',
                  flexShrink: 0,
                  minWidth: 'max-content',
                  whiteSpace: 'nowrap',
                }}
              >
                <span
                  className="booking-stepper-circle"
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: badgeBg,
                    color: badgeColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    border: borderStyle,
                    flexShrink: 0,
                  }}
                >
                  {isCompleted ? (
                    <span style={{ display: 'inline-block', animation: 'stepCheckPop 220ms ease-out' }}>✓</span>
                  ) : (
                    idx + 1
                  )}
                </span>
                <span
                  className="booking-stepper-label"
                  style={{
                    fontSize: '13.5px',
                    fontWeight: isActive || isCompleted ? 700 : 500,
                    color: textColor,
                    whiteSpace: 'nowrap',
                    overflow: 'visible',
                  }}
                >
                  {step.label}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={`booking-stepper-line ${isCompleted ? 'is-completed' : ''}`}
                  style={{
                    height: '2px',
                    minWidth: '16px',
                    maxWidth: '34px',
                    flex: '0 1 34px',
                    background: 'rgba(19, 20, 19, 0.10)',
                    flexShrink: 0,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
