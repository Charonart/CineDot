'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  PanelLeftClose,
  Edit3,
  Trash2,
  Plus,
  Tv,
  Search,
} from 'lucide-react';
import { AdminCinemaItem, AdminRoomItem } from '../../types/adminCinema.types';
import { Skeleton } from '@/shared/ui/Skeleton';

interface CinemaSidebarProps {
  currentCinema: AdminCinemaItem | null;
  activeRoom: AdminRoomItem | null;
  isLoading?: boolean;
  onSelectRoom: (roomId: number) => void;
  onOpenEditCinema: (cinema: AdminCinemaItem) => void;
  onOpenDeleteCinema: (cinema: AdminCinemaItem) => void;
  onOpenAddRoom: () => void;
  onOpenDeleteRoom: (room: AdminRoomItem) => void;
  onCollapse: () => void;
}

export const CinemaSidebar: React.FC<CinemaSidebarProps> = ({
  currentCinema,
  activeRoom,
  isLoading = false,
  onSelectRoom,
  onOpenEditCinema,
  onOpenDeleteCinema,
  onOpenAddRoom,
  onOpenDeleteRoom,
  onCollapse,
}) => {
  const [roomFilterQuery, setRoomFilterQuery] = useState('');

  if (isLoading || !currentCinema) {
    return (
      <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-2xs flex flex-col gap-3">
        <Skeleton variant="text" className="w-24 h-4" />
        <Skeleton variant="text" className="w-40 h-5" />
        <Skeleton variant="rectangular" className="w-full h-24 rounded-lg" />
        <Skeleton variant="rectangular" className="w-full h-36 rounded-lg" />
      </div>
    );
  }

  const filteredRooms = currentCinema.rooms.filter(
    (r) =>
      r.name.toLowerCase().includes(roomFilterQuery.toLowerCase().trim()) ||
      r.format.toLowerCase().includes(roomFilterQuery.toLowerCase().trim())
  );

  return (
    <div className="flex flex-col gap-3">
      {/* 1. Branch Details Section */}
      <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-2xs flex flex-col gap-3">
        {/* Cinema Branch Header */}
        <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-3">
          <div className="flex flex-col min-w-0">
            <h3 className="font-semibold text-sm text-slate-900 truncate">
              {currentCinema.name}
            </h3>
            <span className="text-xs text-slate-500 font-normal">
              {currentCinema.city} {currentCinema.slug ? `• /${currentCinema.slug}` : ''}
            </span>
          </div>

          <div className="flex items-center gap-0.5 shrink-0">
            <button
              type="button"
              onClick={() => onOpenEditCinema(currentCinema)}
              title="Chỉnh sửa thông tin rạp"
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onOpenDeleteCinema(currentCinema)}
              title="Xóa cụm rạp"
              className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onCollapse}
              title="Thu gọn bảng rạp để mở rộng sơ đồ ghế"
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <PanelLeftClose className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Info Rows */}
        <div className="flex flex-col gap-1.5 text-xs text-slate-600">
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2 leading-relaxed">{currentCinema.address}</span>
          </div>

          {currentCinema.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{currentCinema.phone}</span>
            </div>
          )}

          {currentCinema.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{currentCinema.email}</span>
            </div>
          )}

          {currentCinema.description && (
            <div className="pt-1 text-[11px] text-slate-500 line-clamp-2 leading-relaxed border-t border-gray-100">
              {currentCinema.description}
            </div>
          )}
        </div>
      </div>

      {/* 2. Rooms Directory Section */}
      <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-2xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700">
            Phòng chiếu ({currentCinema.rooms.length})
          </span>
          <button
            type="button"
            onClick={onOpenAddRoom}
            className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Thêm phòng</span>
          </button>
        </div>

        {/* Quick Filter */}
        {currentCinema.rooms.length > 3 && (
          <div className="relative flex items-center bg-slate-50 px-2 py-1 rounded-lg border border-gray-200 text-xs">
            <Search className="w-3 h-3 text-slate-400 shrink-0" />
            <input
              type="text"
              value={roomFilterQuery}
              onChange={(e) => setRoomFilterQuery(e.target.value)}
              placeholder="Lọc phòng..."
              className="w-full pl-1.5 bg-transparent text-slate-700 placeholder:text-slate-400 focus:outline-none text-xs"
            />
          </div>
        )}

        {currentCinema.rooms.length === 0 ? (
          <div className="p-4 rounded-lg bg-slate-50 border border-gray-200 text-center text-xs text-slate-400 flex flex-col items-center gap-1.5">
            <Tv className="w-5 h-5 text-slate-300" />
            <span>Chưa có phòng chiếu</span>
            <button
              type="button"
              onClick={onOpenAddRoom}
              className="text-xs font-medium text-[#7C6FE8] hover:underline"
            >
              + Tạo phòng mới
            </button>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="p-3 text-center text-xs text-slate-400">
            Không tìm thấy phòng phù hợp.
          </div>
        ) : (
          <div className="flex flex-col gap-1.5 max-h-[380px] overflow-y-auto pr-0.5">
            {filteredRooms.map((room) => {
              const isSelected = room.id === activeRoom?.id;
              return (
                <div
                  key={room.id}
                  onClick={() => onSelectRoom(room.id)}
                  className={`w-full p-2.5 rounded-lg border text-left transition-colors cursor-pointer flex flex-col gap-1 ${
                    isSelected
                      ? 'bg-purple-50/60 border-[#7C6FE8] text-slate-900'
                      : 'bg-white border-gray-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={`text-xs font-medium truncate ${isSelected ? 'text-[#7C6FE8] font-semibold' : ''}`}>
                        {room.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-1">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          room.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                        title={room.status === 'ACTIVE' ? 'Hoạt động' : 'Bảo trì'}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDeleteRoom(room);
                        }}
                        title="Xóa phòng chiếu"
                        className="p-0.5 rounded text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-normal">{room.format}</span>
                    <span className="tabular-nums font-medium text-slate-700">
                      {room.totalSeats || room.seats?.length || 0} ghế
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
