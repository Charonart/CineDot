'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Tv,
  Volume2,
  Users,
  ChevronRight,
  Eye,
  CheckCircle2,
  Sparkles,
  Film,
} from 'lucide-react';
import { CinemaRoomItem } from '../types/cinemas.types';
import { CinemaRoomLayoutViewer } from './CinemaRoomLayoutViewer';

interface CinemaRoomsSectionProps {
  rooms: CinemaRoomItem[];
  cinemaName: string;
}

export const CinemaRoomsSection: React.FC<CinemaRoomsSectionProps> = ({
  rooms,
  cinemaName,
}) => {
  const [selectedRoomId, setSelectedRoomId] = useState<number | string | null>(null);

  // Selected room object
  const selectedRoom = rooms.find(
    (r) => String(r.id || r.roomId) === String(selectedRoomId)
  );

  // Helper formatting for technology badges
  const getFormatBadgeStyle = (type: string) => {
    const t = (type || '').toLowerCase();
    if (t.includes('imax')) {
      return 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs';
    }
    if (t.includes('dolby')) {
      return 'bg-gradient-to-r from-purple-700 to-indigo-800 text-white shadow-xs';
    }
    if (t.includes('screenx')) {
      return 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs';
    }
    if (t.includes('onyx')) {
      return 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-xs';
    }
    if (t.includes('gold') || t.includes('vip')) {
      return 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-xs';
    }
    return 'bg-slate-100 text-slate-800 border border-slate-200';
  };

  if (!rooms || rooms.length === 0) {
    return null;
  }

  return (
    <section className="w-full flex flex-col gap-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#7C6FE8]" />
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Hệ Thống Phòng Chiếu
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EEECFB] text-[#7C6FE8] text-[11px] font-extrabold">
              {rooms.length} phòng
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Công nghệ trình chiếu chuẩn quốc tế tại <strong className="text-slate-800 font-bold">{cinemaName}</strong>
          </p>
        </div>
      </div>

      {/* Rooms Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {rooms.map((room) => {
          const roomId = room.id || room.roomId;
          const isSelected = String(selectedRoomId) === String(roomId);

          return (
            <div
              key={roomId}
              onClick={() => setSelectedRoomId(isSelected ? null : roomId)}
              className={`p-4.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3.5 group relative ${
                isSelected
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-[1.01] ring-2 ring-[#7C6FE8]'
                  : 'bg-white hover:bg-slate-50 border-slate-200/90 hover:border-[#7C6FE8]/50 shadow-2xs hover:shadow-sm'
              }`}
            >
              <div className="flex flex-col gap-3">
                {/* Header: Room Name & Format Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-0.5">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        isSelected ? 'text-[#D8D4F7]' : 'text-slate-400'
                      }`}
                    >
                      Phòng Chiếu Tiêu Chuẩn
                    </span>
                    <h4
                      className={`font-extrabold text-sm leading-snug line-clamp-1 transition-colors ${
                        isSelected ? 'text-white' : 'text-slate-900 group-hover:text-[#7C6FE8]'
                      }`}
                    >
                      {room.roomName || room.name}
                    </h4>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold tracking-wide uppercase shrink-0 ${getFormatBadgeStyle(
                      room.roomType
                    )}`}
                  >
                    {room.roomType}
                  </span>
                </div>

                {/* Tech Specs */}
                <div
                  className={`flex flex-col gap-1.5 pt-2 border-t text-xs font-semibold ${
                    isSelected ? 'border-white/10 text-slate-300' : 'border-slate-100 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#7C6FE8] shrink-0" />
                    <span>Sức chứa: <strong className={isSelected ? 'text-white' : 'text-slate-900'}>{room.totalSeats} ghế ngồi</strong></span>
                  </div>

                  {room.screenType && (
                    <div className="flex items-center gap-2">
                      <Tv className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span className="truncate">
                        Màn chiếu: <strong className={isSelected ? 'text-white' : 'text-slate-900'}>{room.screenType.replace(/_/g, ' ').toUpperCase()}</strong>
                      </span>
                    </div>
                  )}

                  {room.soundTechnology && (
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">
                        Âm thanh: <strong className={isSelected ? 'text-white' : 'text-slate-900'}>{room.soundTechnology.replace(/_/g, ' ').toUpperCase()}</strong>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Link: View Layout */}
              <div
                className={`pt-2.5 border-t flex items-center justify-between text-xs font-bold ${
                  isSelected ? 'border-white/10' : 'border-slate-100'
                }`}
              >
                <span
                  className={`flex items-center gap-1.5 transition-colors ${
                    isSelected
                      ? 'text-[#D8D4F7]'
                      : 'text-[#7C6FE8] group-hover:translate-x-0.5 transition-transform'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isSelected ? 'Đang mở sơ đồ ghế' : 'Xem sơ đồ ghế'}</span>
                </span>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-[#7C6FE8] text-white'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-[#7C6FE8] group-hover:text-white'
                  }`}
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expandable Read-Only Room Layout Viewer */}
      <AnimatePresence>
        {selectedRoom && (
          <motion.div
            initial={{ opacity: 0, y: 12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 12, height: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full pt-1"
          >
            <CinemaRoomLayoutViewer
              roomId={selectedRoom.id || selectedRoom.roomId}
              roomName={selectedRoom.roomName || selectedRoom.name}
              roomType={selectedRoom.roomType}
              screenType={selectedRoom.screenType}
              soundTechnology={selectedRoom.soundTechnology}
              totalSeats={selectedRoom.totalSeats}
              onClose={() => setSelectedRoomId(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
