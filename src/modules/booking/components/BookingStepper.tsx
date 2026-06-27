'use client';

import React from 'react';

export type BookingStepKey = 'schedule' | 'seats' | 'foods' | 'payment' | 'confirm';

/**
 * entryMode:
 *  - 'full'   : All 5 steps shown. User came via standalone /booking page.
 *  - 'bypass' : First step ("Suất chiếu") is permanently locked/completed.
 *               User entered via Quick Booking or Movie Detail with a showtimeId.
 */
export type BookingEntryMode = 'full' | 'bypass';

interface BookingStepperProps {
  currentStep: BookingStepKey;
  entryMode?: BookingEntryMode;
}

export const BookingStepper: React.FC<BookingStepperProps> = ({
  currentStep,
  entryMode = 'bypass',
}) => {
  const steps = [
    { key: 'schedule', label: 'Suất chiếu' },
    { key: 'seats',    label: 'Chọn ghế'   },
    { key: 'foods',    label: 'Bắp nước'   },
    { key: 'payment',  label: 'Thanh toán' },
    { key: 'confirm',  label: 'Xác nhận'   },
  ];

  const getStepIndex = (key: string) => steps.findIndex((s) => s.key === key);
  const currentIndex = getStepIndex(currentStep);

  /**
   * In 'bypass' mode the schedule step is always treated as completed & locked,
   * regardless of currentIndex. This prevents any visual state that might suggest
   * the user can click back to the schedule step.
   */
  const isScheduleLockedBypass = entryMode === 'bypass';

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
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* CSS: transitions, line fill animation, reduced motion */}
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
            0%   { transform: scale(0.6); opacity: 0; }
            70%  { transform: scale(1.15); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }

          /* All step items are read-only — no pointer cursor, no hover bg */
          .booking-stepper-item {
            cursor: default !important;
            user-select: none;
          }

          /* Locked (bypass) schedule step tooltip */
          .booking-stepper-item.is-locked {
            position: relative;
          }
          .booking-stepper-item.is-locked .lock-badge {
            display: inline-flex;
            align-items: center;
            gap: 3px;
            margin-left: 4px;
            font-size: 10.5px;
            font-weight: 600;
            color: #4f3c93;
            opacity: 0.7;
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
          // In bypass mode: schedule step is always completed & locked.
          const isLockedBypass = isScheduleLockedBypass && step.key === 'schedule';
          const isCompleted = isLockedBypass || idx < currentIndex;
          const isActive    = !isLockedBypass && idx === currentIndex;
          const isUpcoming  = !isLockedBypass && idx > currentIndex;

          let textColor   = 'var(--text3)';
          let badgeBg     = 'var(--bg2)';
          let badgeColor  = 'var(--text3)';
          let borderStyle = '1px solid var(--border)';

          if (isActive) {
            textColor   = '#4f3c93';
            badgeBg     = '#4f3c93';
            badgeColor  = '#ffffff';
            borderStyle = '1px solid rgba(79, 60, 147, 0.2)';
          } else if (isCompleted) {
            textColor   = isLockedBypass ? '#4f3c93' : 'var(--text)';
            badgeBg     = '#F0EEF9';
            badgeColor  = '#4f3c93';
            borderStyle = '1px solid #CFC9EB';
          } else {
            textColor   = 'var(--text3)';
            badgeBg     = 'var(--bg2)';
            badgeColor  = 'var(--text3)';
            borderStyle = '1px solid var(--border)';
          }

          return (
            <React.Fragment key={step.key}>
              {/* CRITICAL: No onClick on any step — read-only progress indicator */}
              <div
                className={[
                  'booking-stepper-item',
                  isActive     ? 'is-active'    : '',
                  isCompleted  ? 'is-completed' : '',
                  isUpcoming   ? 'is-disabled'  : '',
                  isLockedBypass ? 'is-locked'  : '',
                ].filter(Boolean).join(' ')}
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {step.label}
                  {/* Lock badge only appears on the schedule step in bypass mode */}
                  {isLockedBypass && (
                    <span className="lock-badge" aria-label="Suất chiếu đã được chốt">
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        style={{ opacity: 0.65 }}
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                  )}
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
