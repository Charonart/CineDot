/* Hallmark · component: BookingStepWizard · genre: modern-minimal · theme: White Minimal
 * states: default · hover · focus · active · disabled · loading · error · success
 * contrast: pass (46–50)
 */
'use client';

import React from 'react';
import { BookingStepWizard } from './BookingStepWizard';

export function BookingStepWizardPreview() {
  return (
    <div className="min-h-screen bg-[#FAFAFB] p-6 sm:p-12 flex flex-col gap-10 max-w-5xl mx-auto font-sans text-gray-900">
      <div className="flex flex-col gap-2 border-b border-gray-200 pb-4">
        <span className="text-xs font-black text-[#7C6FE8] uppercase tracking-wider">
          Hallmark Component Preview
        </span>
        <h1 className="text-2xl font-black text-gray-950">
          BookingStepWizard (Slim Horizontal Capsule Ribbon)
        </h1>
        <p className="text-xs text-gray-500 max-w-xl">
          Ultra-compact, single-line horizontal progress capsule (~40px height) that takes zero extra sidebar space and eliminates navbar occlusion with 1-click rewind links.
        </p>
      </div>

      {/* Step 2 (Seats Active) */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-extrabold text-gray-600">Step 2: Chọn Ghế (Active)</span>
        <BookingStepWizard
          currentStep={2}
          movieSlug="spiderman-new-beginning"
          timeParam="19:30"
          dateParam="30/08/2026"
          cinemaParam="CGV Landmark 81"
        />
      </div>

      {/* Step 3 (Food Active, Step 2 Completed with Seats) */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-extrabold text-gray-600">Step 3: Bắp Nước (Active, Seats Completed)</span>
        <BookingStepWizard
          currentStep={3}
          movieSlug="spiderman-new-beginning"
          seatsParam="D09,D10"
          timeParam="19:30"
          dateParam="30/08/2026"
          cinemaParam="CGV Landmark 81"
        />
      </div>

      {/* Step 4 (Payment Active, Step 2 & 3 Completed) */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-extrabold text-gray-600">Step 4: Thanh Toán (Active)</span>
        <BookingStepWizard
          currentStep={4}
          movieSlug="spiderman-new-beginning"
          seatsParam="D09,D10"
          combosParam="combo-sweet:1"
          timeParam="19:30"
          dateParam="30/08/2026"
          cinemaParam="CGV Landmark 81"
        />
      </div>

      {/* Step 5 (Ticket Completed) */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-extrabold text-gray-600">Step 5: Nhận Vé (Completed)</span>
        <BookingStepWizard
          currentStep={5}
          movieSlug="spiderman-new-beginning"
          seatsParam="D09,D10"
          timeParam="19:30"
          dateParam="30/08/2026"
          cinemaParam="CGV Landmark 81"
        />
      </div>
    </div>
  );
}
