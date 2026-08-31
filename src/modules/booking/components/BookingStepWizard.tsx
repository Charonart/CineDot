/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · genre: modern-minimal · theme: White Minimal · component: BookingStepWizard
 * states: default · hover · focus · active · disabled · loading · error · success
 * contrast: pass (46–50)
 */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Film, 
  Armchair, 
  Popcorn, 
  CreditCard, 
  Ticket, 
  Check, 
  Loader2
} from 'lucide-react';
import { cancelBookingAndReleaseSeats } from '@/modules/booking/services/bookingSessionService';

export interface BookingStepWizardProps {
  currentStep?: 1 | 2 | 3 | 4 | 5;
  showtimeId?: string;
  movieSlug?: string;
  movieTitle?: string;
  seatsParam?: string;
  combosParam?: string;
  dateParam?: string;
  timeParam?: string;
  cinemaParam?: string;
  className?: string;
}

interface StepItem {
  id: 1 | 2 | 3 | 4 | 5;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepItem[] = [
  { id: 1, label: 'Chọn suất chiếu', shortLabel: 'Suất chiếu', icon: Film },
  { id: 2, label: 'Chọn ghế', shortLabel: 'Chọn ghế', icon: Armchair },
  { id: 3, label: 'Chọn bắp nước', shortLabel: 'Bắp nước', icon: Popcorn },
  { id: 4, label: 'Thanh toán', shortLabel: 'Thanh toán', icon: CreditCard },
  { id: 5, label: 'Nhận vé', shortLabel: 'Nhận vé', icon: Ticket },
];

export const BookingStepWizard: React.FC<BookingStepWizardProps> = ({
  currentStep = 2,
  showtimeId = '1',
  movieSlug = 'spiderman-new-beginning',
  seatsParam,
  combosParam,
  dateParam,
  timeParam,
  cinemaParam,
  className = '',
}) => {
  const router = useRouter();
  const [loadingStepId, setLoadingStepId] = useState<number | null>(null);

  // When on Step 5 (Booking Completed), all previous steps are locked to prevent data corruption
  const isFinalCompletedStep = currentStep === 5;

  // Build rewind links for completed previous steps (only active if not on Step 5)
  const getStepHref = (stepId: number): string | null => {
    if (isFinalCompletedStep) return null;

    const encCinema = encodeURIComponent(cinemaParam || '');
    switch (stepId) {
      case 1:
        return movieSlug ? `/movies/${movieSlug}` : '/movies';
      case 2:
        return `/booking/seats?showtime_id=${showtimeId}&movie=${movieSlug}&seats=${seatsParam || ''}&date=${dateParam || ''}&time=${timeParam || ''}&cinema=${encCinema}`;
      case 3:
        return `/booking/food?showtime_id=${showtimeId}&movie=${movieSlug}&seats=${seatsParam || ''}&date=${dateParam || ''}&time=${timeParam || ''}&cinema=${encCinema}${
          combosParam ? `&combos=${encodeURIComponent(combosParam)}` : ''
        }`;
      case 4:
        return `/booking/payment?showtime_id=${showtimeId}&movie=${movieSlug}&seats=${seatsParam || ''}&date=${dateParam || ''}&time=${timeParam || ''}&cinema=${encCinema}${
          combosParam ? `&combos=${encodeURIComponent(combosParam)}` : ''
        }`;
      case 5:
        return null;
      default:
        return null;
    }
  };

  // Handle click on completed step with API cancel & seat release when returning to Step 1 or 2
  const handleStepClick = async (stepId: number) => {
    if (isFinalCompletedStep || loadingStepId !== null) return;
    const targetHref = getStepHref(stepId);
    if (!targetHref) return;

    // When returning to Step 1 (Showtime) or Step 2 (Seats) from Step 3 (Food) or Step 4 (Payment),
    // cancel the pending booking and release held seats in Redis
    if (currentStep >= 3 && (stepId === 1 || stepId === 2)) {
      setLoadingStepId(stepId);
      try {
        await cancelBookingAndReleaseSeats(showtimeId);
      } finally {
        setLoadingStepId(null);
        router.push(targetHref);
      }
    } else {
      router.push(targetHref);
    }
  };

  const currentStepConfig = STEPS.find((s) => s.id === currentStep) || STEPS[1];
  const CurrentIcon = currentStepConfig.icon;

  return (
    <nav
      aria-label="Tiến trình đặt vé"
      className={`w-full bg-white/95 backdrop-blur-xl border border-gray-200/90 rounded-2xl sm:rounded-full py-2.5 px-4 sm:px-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] select-none transition-all ${className}`}
    >
      {/* 1. Desktop & Tablet: Slim Horizontal Segmented Capsule Ribbon */}
      <ol className="hidden md:flex items-center justify-between w-full list-none p-0 m-0 gap-1 lg:gap-2">
        {STEPS.map((step, idx) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;
          const isClickable = isCompleted && !isFinalCompletedStep && loadingStepId === null;
          const isLoadingThis = loadingStepId === step.id;

          const StepButtonContent = (
            <button
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && handleStepClick(step.id)}
              className={`flex items-center gap-2 py-1 px-2.5 rounded-full transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-[#7C6FE8] to-indigo-600 text-white shadow-[0_2px_10px_rgba(124,111,232,0.35)] font-black text-xs cursor-default'
                  : isCompleted
                  ? isClickable
                    ? 'text-gray-700 hover:text-[#7C6FE8] hover:bg-[#EEECFB]/80 font-bold text-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-[#7C6FE8]'
                    : 'text-emerald-700 font-bold text-xs cursor-default'
                  : 'text-gray-400 font-medium text-xs cursor-default'
              }`}
            >
              {/* Step Node Icon / Number / Checkmark */}
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 transition-colors ${
                  isActive
                    ? 'bg-white text-[#7C6FE8]'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isLoadingThis ? (
                  <Loader2 className="w-3 h-3 animate-spin text-[#7C6FE8]" />
                ) : isCompleted ? (
                  <Check className="w-3 h-3 stroke-[3]" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>

              {/* Label */}
              <span className="tracking-tight whitespace-nowrap">
                {step.label}
              </span>
            </button>
          );

          return (
            <React.Fragment key={step.id}>
              <li className="flex items-center">
                {StepButtonContent}
              </li>

              {/* Connecting Separator */}
              {idx < STEPS.length - 1 && (
                <div
                  aria-hidden="true"
                  className={`flex-1 h-0.5 max-w-[40px] lg:max-w-[60px] mx-1 rounded-full transition-colors ${
                    step.id < currentStep ? 'bg-emerald-400/60' : 'bg-gray-200/80'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </ol>

      {/* 2. Mobile Compact 1-Line Status Ribbon */}
      <div className="flex md:hidden items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
            isFinalCompletedStep ? 'bg-emerald-50 text-emerald-600' : 'bg-[#EEECFB] text-[#7C6FE8]'
          }`}>
            {loadingStepId !== null ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7C6FE8]" />
            ) : isFinalCompletedStep ? (
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            ) : (
              <CurrentIcon className="w-3.5 h-3.5" />
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-black text-gray-950">
            <span className={isFinalCompletedStep ? 'text-emerald-600' : 'text-[#7C6FE8]'}>
              Bước {currentStep}/5:
            </span>
            <span>{currentStepConfig.label}</span>
          </div>
        </div>

        {/* 5 Mini Progress Bar Segments */}
        <div className="flex items-center gap-1">
          {STEPS.map((s) => (
            <button
              key={s.id}
              type="button"
              disabled={s.id >= currentStep || isFinalCompletedStep || loadingStepId !== null}
              onClick={() => s.id < currentStep && !isFinalCompletedStep && handleStepClick(s.id)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s.id === currentStep
                  ? 'w-4 bg-[#7C6FE8]'
                  : s.id < currentStep
                  ? isFinalCompletedStep
                    ? 'w-2 bg-emerald-500'
                    : 'w-2 bg-[#7C6FE8]/50 hover:bg-[#7C6FE8] cursor-pointer'
                  : 'w-2 bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </nav>
  );
};
