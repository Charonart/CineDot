'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Plus,
  MapPin,
  CheckCircle2,
  X,
  ChevronDown,
  Check,
  Tv,
  Users,
  Save,
  Wrench,
  Heart,
  Sparkles,
  Edit3,
  Trash2,
  Layers,
  Settings,
  Info,
  Sliders,
} from 'lucide-react';

export type SeatType = 'REGULAR' | 'VIP' | 'SWEETBOX' | 'MAINTENANCE';

export interface AdminSeatItem {
  id: string; // e.g. "A01"
  row: string; // "A"
  col: number; // 1
  type: SeatType;
}

export interface AdminRoomItem {
  id: string;
  name: string;
  format: string; // "IMAX 3D Laser" | "4DX Motion" | "VIP Gold Class" | "2D Standard"
  status: 'ACTIVE' | 'MAINTENANCE';
  rowsCount: number;
  colsCount: number;
  seats: AdminSeatItem[];
}

export interface AdminCinemaItem {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  image?: string;
  totalScreens: number;
  rooms: AdminRoomItem[];
}

const DEFAULT_ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const COLS_PER_ROW = 12;

function generateDefaultSeats(): AdminSeatItem[] {
  const seats: AdminSeatItem[] = [];
  DEFAULT_ROWS.forEach((row) => {
    for (let c = 1; c <= COLS_PER_ROW; c++) {
      const seatId = `${row}${c < 10 ? '0' + c : c}`;
      let seatType: SeatType = 'REGULAR';
      if (row === 'E' || row === 'F' || row === 'G') {
        seatType = 'VIP';
      } else if (row === 'H') {
        seatType = 'SWEETBOX';
      }
      // Set a couple of maintenance seats for demo realism
      if (row === 'C' && (c === 5 || c === 6)) {
        seatType = 'MAINTENANCE';
      }

      seats.push({
        id: seatId,
        row,
        col: c,
        type: seatType,
      });
    }
  });
  return seats;
}

const INITIAL_CINEMAS: AdminCinemaItem[] = [
  {
    id: 'c-1',
    name: 'CineDot Landmark 81 Saigon',
    address: 'Tầng 5, TTTM Vincom Center Landmark 81, 720A Điện Biên Phủ, Q. Bình Thạnh, TP.HCM',
    city: 'TP. Hồ Chí Minh',
    phone: '1900 6017',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80',
    totalScreens: 6,
    rooms: [
      {
        id: 'r-101',
        name: 'Phòng 01 - IMAX 3D Laser',
        format: 'IMAX 3D Laser',
        status: 'ACTIVE',
        rowsCount: 8,
        colsCount: 12,
        seats: generateDefaultSeats(),
      },
      {
        id: 'r-102',
        name: 'Phòng 02 - 4DX Motion',
        format: '4DX Motion',
        status: 'ACTIVE',
        rowsCount: 8,
        colsCount: 12,
        seats: generateDefaultSeats(),
      },
      {
        id: 'r-103',
        name: 'Phòng 03 - VIP Gold Class',
        format: 'VIP Gold Class',
        status: 'ACTIVE',
        rowsCount: 8,
        colsCount: 12,
        seats: generateDefaultSeats(),
      },
      {
        id: 'r-104',
        name: 'Phòng 04 - 2D Standard',
        format: '2D Standard',
        status: 'MAINTENANCE',
        rowsCount: 8,
        colsCount: 12,
        seats: generateDefaultSeats(),
      },
    ],
  },
  {
    id: 'c-2',
    name: 'Galaxy CineX Hanoi Centre',
    address: 'Tầng 6, Vincom Center Bà Triệu, 191 Bà Triệu, Q. Hai Bà Trưng, Hà Nội',
    city: 'Hà Nội',
    phone: '1900 6018',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80',
    totalScreens: 5,
    rooms: [
      {
        id: 'r-201',
        name: 'Phòng 01 - IMAX 3D',
        format: 'IMAX 3D Laser',
        status: 'ACTIVE',
        rowsCount: 8,
        colsCount: 12,
        seats: generateDefaultSeats(),
      },
      {
        id: 'r-202',
        name: 'Phòng 02 - Standard',
        format: '2D Standard',
        status: 'ACTIVE',
        rowsCount: 8,
        colsCount: 12,
        seats: generateDefaultSeats(),
      },
    ],
  },
  {
    id: 'c-3',
    name: 'CineDot Ba Đình Centre',
    address: 'Tầng 4, Lotte Center Hanoi, 54 Liễu Giai, Q. Ba Đình, Hà Nội',
    city: 'Hà Nội',
    phone: '1900 6019',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80',
    totalScreens: 4,
    rooms: [
      {
        id: 'r-301',
        name: 'Phòng VIP Premium',
        format: 'VIP Gold Class',
        status: 'ACTIVE',
        rowsCount: 8,
        colsCount: 12,
        seats: generateDefaultSeats(),
      },
    ],
  },
];

export function AdminCinemasView() {
  const [cinemas, setCinemas] = useState<AdminCinemaItem[]>(INITIAL_CINEMAS);
  const [selectedCinemaId, setSelectedCinemaId] = useState<string>('c-1');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('r-101');
  const [isCinemaDropdownOpen, setIsCinemaDropdownOpen] = useState(false);
  const cinemaDropdownRef = useRef<HTMLDivElement>(null);

  // Notifications
  const [notificationMsg, setNotificationMsg] = useState('');

  // Modals
  const [isAddCinemaModalOpen, setIsAddCinemaModalOpen] = useState(false);
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);

  // Form states for Add Cinema
  const [newCinemaName, setNewCinemaName] = useState('');
  const [newCinemaAddress, setNewCinemaAddress] = useState('');
  const [newCinemaCity, setNewCinemaCity] = useState('Hà Nội');

  // Form states for Add Room
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomFormat, setNewRoomFormat] = useState('IMAX 3D Laser');

  // Current Cinema & Room
  const currentCinema = cinemas.find((c) => c.id === selectedCinemaId) || cinemas[0];
  const currentRoom = currentCinema.rooms.find((r) => r.id === selectedRoomId) || currentCinema.rooms[0];

  // Click outside listener for dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cinemaDropdownRef.current && !cinemaDropdownRef.current.contains(event.target as Node)) {
        setIsCinemaDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // When changing cinema, default to first room
  const handleSelectCinema = (cinemaId: string) => {
    setSelectedCinemaId(cinemaId);
    const targetCinema = cinemas.find((c) => c.id === cinemaId);
    if (targetCinema && targetCinema.rooms.length > 0) {
      setSelectedRoomId(targetCinema.rooms[0].id);
    }
    setIsCinemaDropdownOpen(false);
  };

  // Cycle Seat Type: REGULAR -> VIP -> SWEETBOX -> MAINTENANCE -> REGULAR
  const handleToggleSeatType = (seatId: string) => {
    if (!currentRoom) return;
    const nextTypeMap: Record<SeatType, SeatType> = {
      REGULAR: 'VIP',
      VIP: 'SWEETBOX',
      SWEETBOX: 'MAINTENANCE',
      MAINTENANCE: 'REGULAR',
    };

    const updatedSeats = currentRoom.seats.map((seat) => {
      if (seat.id === seatId) {
        return { ...seat, type: nextTypeMap[seat.type] };
      }
      return seat;
    });

    const updatedCinemas = cinemas.map((c) => {
      if (c.id === selectedCinemaId) {
        return {
          ...c,
          rooms: c.rooms.map((r) => {
            if (r.id === selectedRoomId) {
              return { ...r, seats: updatedSeats };
            }
            return r;
          }),
        };
      }
      return c;
    });

    setCinemas(updatedCinemas);
  };

  // Save Seat Layout
  const handleSaveSeatLayout = () => {
    setNotificationMsg(`Đã lưu thiết lập sơ đồ ghế cho "${currentRoom.name}" thành công!`);
    setTimeout(() => setNotificationMsg(''), 2500);
  };

  // Add New Cinema
  const handleAddCinema = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCinemaName.trim()) return;

    const newCinema: AdminCinemaItem = {
      id: 'c-' + Date.now(),
      name: newCinemaName.trim(),
      address: newCinemaAddress.trim() || '123 Phố Huế, Q. Hoàn Kiếm, Hà Nội',
      city: newCinemaCity,
      phone: '1900 6017',
      image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80',
      totalScreens: 4,
      rooms: [
        {
          id: 'r-' + Date.now() + '-1',
          name: 'Phòng 01 - Standard',
          format: '2D Standard',
          status: 'ACTIVE',
          rowsCount: 8,
          colsCount: 12,
          seats: generateDefaultSeats(),
        },
      ],
    };

    setCinemas([newCinema, ...cinemas]);
    setSelectedCinemaId(newCinema.id);
    setSelectedRoomId(newCinema.rooms[0].id);
    setNotificationMsg(`Đã khởi tạo cụm rạp mới "${newCinemaName}"!`);
    setIsAddCinemaModalOpen(false);
    setNewCinemaName('');
    setNewCinemaAddress('');
    setTimeout(() => setNotificationMsg(''), 2500);
  };

  // Add New Room
  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    const newRoom: AdminRoomItem = {
      id: 'r-' + Date.now(),
      name: newRoomName.trim(),
      format: newRoomFormat,
      status: 'ACTIVE',
      rowsCount: 8,
      colsCount: 12,
      seats: generateDefaultSeats(),
    };

    const updatedCinemas = cinemas.map((c) => {
      if (c.id === selectedCinemaId) {
        return {
          ...c,
          rooms: [...c.rooms, newRoom],
          totalScreens: c.rooms.length + 1,
        };
      }
      return c;
    });

    setCinemas(updatedCinemas);
    setSelectedRoomId(newRoom.id);
    setNotificationMsg(`Đã thêm phòng chiếu mới "${newRoomName}" vào cụm rạp!`);
    setIsAddRoomModalOpen(false);
    setNewRoomName('');
    setTimeout(() => setNotificationMsg(''), 2500);
  };

  // Seat Statistics
  const regularCount = currentRoom?.seats.filter((s) => s.type === 'REGULAR').length || 0;
  const vipCount = currentRoom?.seats.filter((s) => s.type === 'VIP').length || 0;
  const sweetboxCount = currentRoom?.seats.filter((s) => s.type === 'SWEETBOX').length || 0;
  const maintenanceCount = currentRoom?.seats.filter((s) => s.type === 'MAINTENANCE').length || 0;
  const totalSeats = currentRoom?.seats.length || 0;

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-[#7C6FE8] text-white font-extrabold text-xs shadow-2xl flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* 2.1 Action Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-extrabold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-4 h-4" />
            <span>HỆ THỐNG VẬN HÀNH RẠP CINEDOT</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Quản Lý Cụm Rạp & Sơ Đồ Ghế
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Quản lý các cụm rạp, phòng chiếu và trình thiết kế sơ đồ ghế tương tác trực quan.
          </p>
        </div>

        {/* Header Right Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Custom Popover Cinema Dropdown */}
          <div ref={cinemaDropdownRef} className="relative">
            <button
              onClick={() => setIsCinemaDropdownOpen(!isCinemaDropdownOpen)}
              className={`flex items-center gap-2.5 bg-white px-4 py-2.5 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer shadow-2xs ${
                isCinemaDropdownOpen
                  ? 'border-[#7C6FE8] bg-purple-50/60 text-[#7C6FE8]'
                  : 'border-gray-200 text-slate-800 hover:border-[#7C6FE8]'
              }`}
            >
              <Building2 className="w-4 h-4 text-[#7C6FE8] shrink-0" />
              <span>{currentCinema.name}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  isCinemaDropdownOpen ? 'rotate-180 text-[#7C6FE8]' : ''
                }`}
              />
            </button>

            {isCinemaDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-72 bg-white border border-purple-100 rounded-2xl p-1.5 shadow-[0_12px_40px_rgba(124,111,232,0.15)] z-50 flex flex-col gap-1"
              >
                {cinemas.map((c) => {
                  const isSelected = c.id === selectedCinemaId;
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleSelectCinema(c.id)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-purple-50 text-[#7C6FE8]'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="line-clamp-1">{c.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{c.city} • {c.rooms.length} phòng</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#7C6FE8] shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* Add Cinema Button */}
          <button
            onClick={() => setIsAddCinemaModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#7C6FE8]/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>THÊM CỤM RẠP MỚI</span>
          </button>
        </div>
      </div>

      {/* 2.2 Split Layout (30% Left / 70% Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel: 30% Width (4 Cols) - List of Rooms */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-5 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-[#7C6FE8] uppercase tracking-wider">CỤM RẠP ĐANG CHỌN</span>
                <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1">{currentCinema.name}</h3>
              </div>
              <button
                onClick={() => setIsAddRoomModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7C6FE8] font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-purple-100"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Phòng</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium pb-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="line-clamp-2">{currentCinema.address}</span>
            </div>

            {/* List of Rooms */}
            <div className="flex flex-col gap-2.5 pt-1">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                DANH SÁCH PHÒNG CHIẾU ({currentCinema.rooms.length})
              </span>

              {currentCinema.rooms.map((room) => {
                const isSelected = room.id === selectedRoomId;
                return (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-2 relative ${
                      isSelected
                        ? 'bg-purple-50/60 border-[#7C6FE8] shadow-md shadow-[#7C6FE8]/10'
                        : 'bg-slate-50/60 border-gray-200 hover:border-purple-200 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className={`font-extrabold text-xs ${isSelected ? 'text-[#7C6FE8]' : 'text-slate-900'}`}>
                        {room.name}
                      </h4>
                      {room.status === 'ACTIVE' ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
                          Hoạt động
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-extrabold border border-rose-200">
                          Bảo trì
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 pt-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-white text-slate-700 font-bold border border-gray-200">
                        {room.format}
                      </span>
                      <span>Sức chứa: <strong className="text-slate-900">{room.seats.length} ghế</strong></span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Panel: 70% Width (8 Cols) - Visual Seat Layout Editor */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col gap-6 relative">
            {/* Header of Active Room */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#7C6FE8] font-extrabold text-[11px] border border-purple-100">
                    {currentRoom?.format || 'IMAX 3D Laser'}
                  </span>
                  <span className="text-xs font-bold text-slate-400">Sức chứa: {totalSeats} ghế</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">{currentRoom?.name}</h2>
              </div>

              {/* Action Bar */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveSeatLayout}
                  className="px-5 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#7C6FE8]/30 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>LƯU SƠ ĐỒ GHẾ</span>
                </button>
              </div>
            </div>

            {/* Screen Indicator Bar (Curved Illuminated Screen) */}
            <div className="w-full flex flex-col items-center gap-1 pt-2">
              <div className="w-5/6 h-3 rounded-t-full bg-gradient-to-r from-purple-200 via-[#7C6FE8] to-purple-200 shadow-[0_6px_20px_rgba(124,111,232,0.4)] opacity-80" />
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase pt-1">
                MÀN HÌNH CHẾU ({currentRoom?.format.toUpperCase()})
              </span>
            </div>

            {/* Seat Legend (Chú Thích Loại Ghế) */}
            <div className="flex flex-wrap items-center justify-center gap-5 p-3.5 rounded-2xl bg-slate-50 border border-gray-200/80 text-xs font-extrabold text-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-slate-200 border border-slate-300" />
                <span>Ghế Thường ({regularCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-[#7C6FE8] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                  ★
                </div>
                <span>Ghế VIP ({vipCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-5 rounded-md bg-pink-500 text-white flex items-center justify-center text-[9px] font-bold shadow-xs">
                  <Heart className="w-3 h-3 fill-white" />
                </div>
                <span>Sweetbox Đôi ({sweetboxCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-rose-500 text-white flex items-center justify-center text-[10px]">
                  <Wrench className="w-3 h-3" />
                </div>
                <span>Bảo Trì ({maintenanceCount})</span>
              </div>
            </div>

            {/* Interactive Seat Matrix (Hàng A1 -> H12) */}
            <div className="w-full overflow-x-auto py-4">
              <div className="min-w-[620px] flex flex-col gap-2.5 items-center">
                {DEFAULT_ROWS.map((rowLetter) => {
                  const rowSeats = currentRoom?.seats.filter((s) => s.row === rowLetter) || [];
                  return (
                    <div key={rowLetter} className="flex items-center gap-2">
                      {/* Row Label Left */}
                      <span className="w-6 text-center font-black text-xs text-slate-400">{rowLetter}</span>

                      {/* Seats Grid */}
                      <div className="flex items-center gap-1.5">
                        {rowSeats.map((seat) => {
                          let seatStyle = 'bg-slate-200 text-slate-700 hover:bg-slate-300';
                          let icon = null;

                          if (seat.type === 'VIP') {
                            seatStyle = 'bg-[#7C6FE8] text-white shadow-xs font-black border border-purple-300';
                          } else if (seat.type === 'SWEETBOX') {
                            seatStyle = 'bg-pink-500 text-white shadow-xs font-black border border-pink-300 w-12';
                            icon = <Heart className="w-3 h-3 fill-white shrink-0" />;
                          } else if (seat.type === 'MAINTENANCE') {
                            seatStyle = 'bg-rose-500 text-white shadow-xs font-black border border-rose-300';
                            icon = <Wrench className="w-3 h-3 shrink-0" />;
                          }

                          return (
                            <button
                              key={seat.id}
                              onClick={() => handleToggleSeatType(seat.id)}
                              title={`Ghế ${seat.id} - Click để đổi loại ghế (${seat.type})`}
                              className={`h-7 px-1.5 rounded-lg text-[10px] transition-transform active:scale-90 cursor-pointer flex items-center justify-center gap-0.5 ${seatStyle}`}
                            >
                              {icon}
                              <span>{seat.id}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Row Label Right */}
                      <span className="w-6 text-center font-black text-xs text-slate-400">{rowLetter}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Instruction Tip */}
            <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 text-slate-700 text-xs font-medium flex items-center gap-2">
              <Info className="w-4 h-4 text-[#7C6FE8] shrink-0" />
              <span>
                <strong>Hướng dẫn:</strong> Nhấp vào bất kỳ vị trí ghế nào trên ma trận để xoay vòng chuyển đổi kiểu ghế (<strong className="text-slate-900">Thường ➔ VIP ➔ Sweetbox ➔ Bảo trì ➔ Thường</strong>).
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 🏢 MODAL 1: THÊM CỤM RẠP MỚI */}
      {isAddCinemaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl relative text-slate-900 font-sans">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#7C6FE8]" />
                <h3 className="text-lg font-extrabold text-slate-900">Thêm Cụm Rạp Mới</h3>
              </div>
              <button
                onClick={() => setIsAddCinemaModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCinema} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Tên Cụm Rạp</label>
                <input
                  type="text"
                  value={newCinemaName}
                  onChange={(e) => setNewCinemaName(e.target.value)}
                  placeholder="Ví dụ: CineDot Tây Hồ Centre"
                  required
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Địa chỉ chi tiết</label>
                <input
                  type="text"
                  value={newCinemaAddress}
                  onChange={(e) => setNewCinemaAddress(e.target.value)}
                  placeholder="Tầng 5, Vincom Centre Tây Hồ, Hà Nội"
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Thành phố</label>
                <select
                  value={newCinemaCity}
                  onChange={(e) => setNewCinemaCity(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                >
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCinemaModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider shadow-md cursor-pointer"
                >
                  TẠO CỤM RẠP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 📽️ MODAL 2: THÊM PHÒNG CHIẾU MỚI */}
      {isAddRoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl relative text-slate-900 font-sans">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <Tv className="w-5 h-5 text-[#7C6FE8]" />
                <h3 className="text-lg font-extrabold text-slate-900">Thêm Phòng Chiếu Mới</h3>
              </div>
              <button
                onClick={() => setIsAddRoomModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRoom} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Tên Phòng Chiếu</label>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Ví dụ: Phòng 05 - Dolby Atmos"
                  required
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Định Dạng Công Nghệ</label>
                <select
                  value={newRoomFormat}
                  onChange={(e) => setNewRoomFormat(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                >
                  <option value="IMAX 3D Laser">IMAX 3D Laser</option>
                  <option value="4DX Motion">4DX Motion</option>
                  <option value="VIP Gold Class">VIP Gold Class</option>
                  <option value="2D Standard">2D Standard</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddRoomModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider shadow-md cursor-pointer"
                >
                  THÊM PHÒNG
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
