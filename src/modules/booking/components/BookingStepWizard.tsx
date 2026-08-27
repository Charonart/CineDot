/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · theme: White Minimal · component: BookingStepWizard */
'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  label: string;
}

const steps: Step[] = [
  { id: 1, label: 'Chọn suất chiếu' },
  { id: 2, label: 'Chọn ghế' },
  { id: 3, label: 'Chọn bắp nước' },
  { id: 4, label: 'Thanh toán' },
  { id: 5, label: 'Nhận vé' },
];

interface BookingStepWizardProps {
  currentStep?: number;
}

export const BookingStepWizard: React.FC<BookingStepWizardProps> = ({ currentStep = 2 }) => {
  const progressPercent = Math.min(
    100,
    Math.max(0, ((currentStep - 1) / (steps.length - 1)) * 100)
  );

  return (
    <nav
      aria-label="Tiến trình đặt vé"
      className="w-full bg-white/95 backdrop-blur-md border-b border-gray-200/90 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sticky top-16 z-30 transition-colors"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {/* Step Labels & Badges Row */}
          <ol className="flex items-center justify-between text-xs sm:text-sm list-none p-0 m-0">
            {steps.map((step) => {
              const isCompleted = step.id < currentStep;
              const isActive = step.id === currentStep;

              return (
                <li
                  key={step.id}
                  className={`flex items-center gap-2 transition-all select-none ${
                    isActive
                      ? 'text-gray-950 font-bold'
                      : isCompleted
                      ? 'text-gray-700 font-semibold'
                      : 'text-gray-400 font-normal'
                  }`}
                >
                  <div
                    className={`w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold transition-all shrink-0 ${
                      isActive
                        ? 'bg-[#7C6FE8] text-white shadow-[0_2px_8px_rgba(124,111,232,0.35)] ring-3 ring-[#7C6FE8]/20'
                        : isCompleted
                        ? 'bg-[#EEECFB] text-[#7C6FE8] border border-[#7C6FE8]/30'
                        : 'bg-gray-100 text-gray-400 border border-gray-200'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 text-[#7C6FE8] stroke-[3]" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={`tracking-tight ${
                      isActive ? 'inline text-gray-950 font-extrabold' : 'hidden sm:inline text-gray-600'
                    }`}
                  >
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>

          {/* Continuous Solid Bottom Progress Bar Line */}
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-[#7C6FE8] to-[#9285FA] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

