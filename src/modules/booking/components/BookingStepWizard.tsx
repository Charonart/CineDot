'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  label: string;
}

const steps: Step[] = [
  { id: 1, label: 'Chọn phim / Rạp / Suất' },
  { id: 2, label: 'Chọn ghế' },
  { id: 3, label: 'Chọn thức ăn' },
  { id: 4, label: 'Thanh toán' },
  { id: 5, label: 'Xác nhận' },
];

interface BookingStepWizardProps {
  currentStep?: number;
}

export const BookingStepWizard: React.FC<BookingStepWizardProps> = ({ currentStep = 2 }) => {
  // Progress percent covers up to the end of current step (e.g. Step 2 out of 5 = 40%)
  const progressPercent = Math.min(
    100,
    Math.max(0, (currentStep / steps.length) * 100)
  );

  return (
    <div className="w-full bg-white border-b border-gray-200 py-3 shadow-2xs">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
        <div className="max-w-3xl mx-auto flex flex-col gap-2.5">
          {/* Step Labels & Badges Row */}
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
            {steps.map((step) => {
              const isCompleted = step.id < currentStep;
              const isFinishedOrActive = step.id <= currentStep;

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-1.5 transition-all ${
                    isFinishedOrActive ? 'text-[#7C6FE8] font-bold' : 'text-slate-400'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      isFinishedOrActive
                        ? 'bg-[#7C6FE8] text-white shadow-xs'
                        : 'bg-gray-100 text-slate-400'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.2 h-3.2 text-white stroke-[3]" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className="whitespace-nowrap text-xs sm:text-xs">{step.label}</span>
                </div>
              );
            })}
          </div>

          {/* Continuous Solid Bottom Progress Bar Line (Kéo dài phủ qua cả bước đang đứng) */}
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-[#7C6FE8] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
