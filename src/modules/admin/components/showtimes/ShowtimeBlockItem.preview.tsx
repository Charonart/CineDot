/* Hallmark · component: showtime-block · demo-wrapper: 8-states
 * states: default · hover · focus · active · disabled · loading · error · success
 */

'use client';

import React, { useState } from 'react';
import { ShowtimeBlockItem, ShowtimeItemState } from './ShowtimeBlockItem';
import { AdminShowtimeGridItem } from '../../types/adminShowtime.types';
import { Sparkles, CheckCircle2, RefreshCw, Eye, EyeOff } from 'lucide-react';

const MOCK_BASE_SHOWTIME: AdminShowtimeGridItem = {
  id: 101,
  showtimeId: 101,
  movieId: 1,
  movieTitle: 'Dune: Hành Tinh Cát - Phần 2',
  moviePoster:
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80',
  movieAgeRating: 'T16',
  durationMinutes: 165,
  cleaningBufferMinutes: 15,
  cinemaId: 1,
  cinemaName: 'CineDot Landmark 81',
  roomId: 1,
  roomName: 'Phòng Chiếu 01',
  roomType: 'IMAX Laser',
  showDate: '2026-09-02',
  startTime: '09:30',
  endTime: '12:15',
  startMinutes: 570,
  endMinutes: 735,
  basePrice: 120000,
  bookedSeats: 48,
  totalSeats: 160,
  occupancyRate: 30,
  isLocked: false,
  status: 'OPEN',
};

const STATES_DEMO: Array<{
  key: ShowtimeItemState;
  label: string;
  description: string;
  override?: Partial<AdminShowtimeGridItem>;
}> = [
  {
    key: 'default',
    label: '1. Default (Suất chiếu chuẩn 2D/IMAX)',
    description: 'Bề mặt thẻ trắng sắc nét, viền mỏng hairline, tương phản rõ ràng, dễ quét mắt.',
    override: { roomType: '2D Digital', bookedSeats: 0, occupancyRate: 0 },
  },
  {
    key: 'hover',
    label: '2. Hover (Khi rê chuột)',
    description: 'Nhẹ nhàng nâng thẻ (elevation lift), bóng mượt mà, sẵn sàng tương tác kéo thả.',
  },
  {
    key: 'focus',
    label: '3. Focus-Visible (Khi điều hướng bàn phím Tab)',
    description: 'Viền focus tím thương hiệu rõ ràng (#7C6FE8) đạt chuẩn tiếp cận WCAG.',
  },
  {
    key: 'active',
    label: '4. Active (Khi đang nhấn giữ / kéo thả)',
    description: 'Thu nhỏ nhẹ (tactile press scale 0.99), sẵn sàng drag sang phòng/giờ khác.',
  },
  {
    key: 'disabled',
    label: '5. Disabled / Locked (Đã có vé đặt)',
    description: 'Khóa không cho dời giờ, hiển thị tag ổ khóa hổ phách và số lượng vé đã bán.',
    override: { isLocked: true, bookedSeats: 32, occupancyRate: 20 },
  },
  {
    key: 'loading',
    label: '6. Loading (Đang cập nhật / lưu dữ liệu)',
    description: 'Hiển thị spinner tinh tế, giảm opacity nhẹ mà không làm xáo trộn bố cục.',
  },
  {
    key: 'error',
    label: '7. Error (Xung đột thời gian / Lỗi kiểm tra)',
    description: 'Viền và nền đỏ hồng nhạt (rose tint) cảnh báo điều phối viên xung đột.',
  },
  {
    key: 'success',
    label: '8. Success (Vừa cập nhật thành công)',
    description: 'Viền và nền xanh ngọc (emerald tint) xác nhận thao tác thành công.',
  },
];

export function ShowtimeBlockItemPreview() {
  const [showAiDraft, setShowAiDraft] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-purple-100 text-[#685bc7] font-bold text-xs">
              Hallmark Component
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              ShowtimeBlockItem — 8-State Demonstration
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Thiết kế chuẩn Cinema-grade: Thẻ sáng tinh tế, chống AI-slop, phân cấp thị giác rõ ràng.
          </p>
        </div>

        <button
          onClick={() => setShowAiDraft(!showAiDraft)}
          className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#7C6FE8]" />
          <span>{showAiDraft ? 'Xem Suất Thường' : 'Xem AI Nháp'}</span>
        </button>
      </div>

      {/* 8 States Stacked Showcase */}
      <div className="space-y-4">
        {STATES_DEMO.map((item) => {
          const st: AdminShowtimeGridItem = {
            ...MOCK_BASE_SHOWTIME,
            ...(item.override || {}),
            isDraft: showAiDraft && item.key === 'default' ? true : item.override?.isDraft,
          };

          return (
            <div
              key={item.key}
              className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">{item.label}</span>
                <span className="text-slate-400 text-[11px]">{item.description}</span>
              </div>

              {/* Timeline Track simulation container (Height 76px) */}
              <div className="h-18 relative bg-slate-50/70 border border-slate-200/60 rounded-xl overflow-hidden px-2">
                {/* Background column guides */}
                <div className="absolute inset-0 grid grid-cols-6 divide-x divide-slate-200/40 pointer-events-none" />

                {/* Render the block with forced state */}
                <ShowtimeBlockItem
                  showtime={st}
                  dayStartMinutes={8 * 60}
                  dayTotalMinutes={16 * 60}
                  forceState={item.key}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ShowtimeBlockItemPreview;
