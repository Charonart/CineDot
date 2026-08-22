'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  Save,
  Edit3,
  Trash2,
  Loader2,
  AlertTriangle,
  Phone,
  Mail,
  PanelLeftClose,
  PanelLeftOpen,
  Globe,
  FileText,
  Search,
  Sparkles,
} from 'lucide-react';
import { useAdminCinemas } from '../hooks/useAdminCinemas';
import { AdminCinemaItem, AdminRoomItem, AdminSeatItem, SeatType } from '../types/adminCinema.types';
import { adminCinemaMapper } from '../mappers/adminCinema.mapper';
import { AdminSeatCanvasEditor } from './ui';
import { SeatTypesStudioModal } from './cinemas/SeatTypesStudioModal';
import { Skeleton } from '@/shared/ui/Skeleton';

export function AdminCinemasView() {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
  const [selectedCinemaId, setSelectedCinemaId] = useState<number | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [isCinemaDropdownOpen, setIsCinemaDropdownOpen] = useState(false);
  const cinemaDropdownRef = useRef<HTMLDivElement>(null);
  const [isSeatTypesModalOpen, setIsSeatTypesModalOpen] = useState(false);

  // Collapse Left Panel State (0% width when collapsed, 100% canvas)
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);

  // Memoized Query Params for Real API
  const cinemaQueryParams = useMemo(
    () => (selectedProvinceId ? { province_id: selectedProvinceId } : undefined),
    [selectedProvinceId]
  );

  // Hook 100% Real API
  const {
    cinemasList,
    provinces,
    currentCinema,
    isLoadingCinemas,
    isLoadingDetail,
    createCinema,
    isCreatingCinema,
    updateCinema,
    isUpdatingCinema,
    deleteCinema,
    isDeletingCinema,
    createRoom,
    isCreatingRoom,
    deleteRoom,
    isDeletingRoom,
    saveSeatLayout,
    isSavingSeatLayout,
  } = useAdminCinemas(cinemaQueryParams, selectedCinemaId);

  // Filtered Cinemas according to Search Query
  const filteredCinemas = useMemo<AdminCinemaItem[]>(() => {
    if (!searchQuery.trim()) return cinemasList;
    const q = searchQuery.toLowerCase().trim();
    return cinemasList.filter(
      (c: AdminCinemaItem) =>
        c.name.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        c.rooms.some((r) => r.name.toLowerCase().includes(q) || r.format.toLowerCase().includes(q))
    );
  }, [cinemasList, searchQuery]);

  // Active Room Selection
  const activeRoom: AdminRoomItem | null =
    currentCinema?.rooms.find((r) => r.id === selectedRoomId) ||
    currentCinema?.rooms[0] ||
    null;

  // Local Editable Seats in Active Room
  const [activeRoomSeats, setActiveRoomSeats] = useState<AdminSeatItem[]>([]);
  const lastSyncedRoomIdRef = useRef<number | null>(null);

  // Synchronize active room seats only when switching to a different room
  useEffect(() => {
    if (activeRoom) {
      if (lastSyncedRoomIdRef.current !== activeRoom.id) {
        lastSyncedRoomIdRef.current = activeRoom.id;
        if (activeRoom.seats && activeRoom.seats.length > 0) {
          setActiveRoomSeats(activeRoom.seats);
        } else {
          setActiveRoomSeats(adminCinemaMapper.generateDefaultSeats());
        }
      }
    } else {
      lastSyncedRoomIdRef.current = null;
      setActiveRoomSeats([]);
    }
  }, [activeRoom]);

  // Initial selection when cinemas list loads
  useEffect(() => {
    if (cinemasList.length > 0) {
      const cinemaExists = cinemasList.some((c) => c.id === selectedCinemaId);
      if (!cinemaExists || !selectedCinemaId) {
        setSelectedCinemaId(cinemasList[0].id);
      }
    } else {
      setSelectedCinemaId(null);
    }
  }, [cinemasList, selectedCinemaId]);

  // Initial room selection when cinema changes
  useEffect(() => {
    if (currentCinema && currentCinema.rooms.length > 0) {
      const roomExists = currentCinema.rooms.some((r) => r.id === selectedRoomId);
      if (!roomExists) {
        setSelectedRoomId(currentCinema.rooms[0].id);
      }
    } else {
      setSelectedRoomId(null);
    }
  }, [currentCinema, selectedRoomId]);

  // Toast Notification
  const [notificationMsg, setNotificationMsg] = useState('');
  const showToast = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(''), 3000);
  };

  // Modals States
  const [isAddCinemaModalOpen, setIsAddCinemaModalOpen] = useState(false);
  const [editingCinema, setEditingCinema] = useState<AdminCinemaItem | null>(null);
  const [deletingCinema, setDeletingCinema] = useState<AdminCinemaItem | null>(null);

  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [deletingRoom, setDeletingRoom] = useState<AdminRoomItem | null>(null);

  // Form States - Add Cinema (With Slug)
  const [newCinemaName, setNewCinemaName] = useState('');
  const [newCinemaSlug, setNewCinemaSlug] = useState('');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [newCinemaAddress, setNewCinemaAddress] = useState('');
  const [newCinemaProvinceId, setNewCinemaProvinceId] = useState<number>(1);
  const [newCinemaPhone, setNewCinemaPhone] = useState('');
  const [newCinemaEmail, setNewCinemaEmail] = useState('');
  const [newCinemaDesc, setNewCinemaDesc] = useState('');
  const [addCinemaError, setAddCinemaError] = useState('');

  // Form States - Edit Cinema (With Slug)
  const [editCinemaName, setEditCinemaName] = useState('');
  const [editCinemaSlug, setEditCinemaSlug] = useState('');
  const [editCinemaAddress, setEditCinemaAddress] = useState('');
  const [editCinemaProvinceId, setEditCinemaProvinceId] = useState<number>(1);
  const [editCinemaPhone, setEditCinemaPhone] = useState('');
  const [editCinemaEmail, setEditCinemaEmail] = useState('');
  const [editCinemaDesc, setEditCinemaDesc] = useState('');
  const [editCinemaError, setEditCinemaError] = useState('');

  // Form States - Add Room
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomFormat, setNewRoomFormat] = useState('IMAX 3D Laser');
  const [addRoomError, setAddRoomError] = useState('');

  // Auto generate slug from name
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  };

  const handleNewNameChange = (val: string) => {
    setNewCinemaName(val);
    if (!isSlugManuallyEdited) {
      setNewCinemaSlug(generateSlug(val));
    }
  };

  // Click outside listener for custom dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cinemaDropdownRef.current && !cinemaDropdownRef.current.contains(event.target as Node)) {
        setIsCinemaDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handlers
  const handleSelectCinema = (cinemaId: number) => {
    setSelectedCinemaId(cinemaId);
    setIsCinemaDropdownOpen(false);
  };

  const handleResetToDefaultLayout = () => {
    if (confirm('Bạn có chắc chắn muốn đặt lại sơ đồ ghế về ma trận tiêu chuẩn (8 hàng x 12 cột)?')) {
      setActiveRoomSeats(adminCinemaMapper.generateDefaultSeats());
      showToast('Đã đặt lại ma trận ghế về mặc định.');
    }
  };

  const handleSaveSeatLayout = async () => {
    if (!activeRoom) return;
    try {
      await saveSeatLayout({
        roomId: activeRoom.id,
        seats: activeRoomSeats,
        roomName: activeRoom.name,
        roomType: activeRoom.roomType,
        isActive: activeRoom.status === 'ACTIVE',
      });
      showToast(`Đã lưu thiết lập sơ đồ ghế cho "${activeRoom.name}" lên máy chủ!`);
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      alert(errObj?.message || 'Không thể lưu sơ đồ ghế!');
    }
  };

  const handleAddCinemaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddCinemaError('');

    if (!newCinemaName.trim()) {
      setAddCinemaError('Vui lòng nhập tên cụm rạp.');
      return;
    }

    try {
      const created = await createCinema({
        cinema_name: newCinemaName.trim(),
        slug: newCinemaSlug.trim() || undefined,
        cinema_address: newCinemaAddress.trim() || undefined,
        province_id: newCinemaProvinceId,
        phone: newCinemaPhone.trim() || undefined,
        email: newCinemaEmail.trim() || undefined,
        description: newCinemaDesc.trim() || undefined,
        is_active: true,
      });

      showToast(`Đã tạo thành công cụm rạp "${created.name}"!`);
      setIsAddCinemaModalOpen(false);
      setSelectedCinemaId(created.id);
      setNewCinemaName('');
      setNewCinemaSlug('');
      setIsSlugManuallyEdited(false);
      setNewCinemaAddress('');
      setNewCinemaPhone('');
      setNewCinemaEmail('');
      setNewCinemaDesc('');
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setAddCinemaError(errObj?.message || 'Không thể tạo cụm rạp mới.');
    }
  };

  const handleOpenEditCinema = (cinema: AdminCinemaItem) => {
    setEditingCinema(cinema);
    setEditCinemaName(cinema.name);
    setEditCinemaSlug(cinema.slug || '');
    setEditCinemaAddress(cinema.address);
    setEditCinemaProvinceId(cinema.provinceId || provinces[0]?.id || 1);
    setEditCinemaPhone(cinema.phone);
    setEditCinemaEmail(cinema.email);
    setEditCinemaDesc(cinema.description);
    setEditCinemaError('');
  };

  const handleEditCinemaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCinema) return;
    setEditCinemaError('');

    try {
      await updateCinema({
        id: editingCinema.id,
        payload: {
          cinema_name: editCinemaName.trim(),
          slug: editCinemaSlug.trim() || undefined,
          cinema_address: editCinemaAddress.trim(),
          province_id: editCinemaProvinceId,
          phone: editCinemaPhone.trim(),
          email: editCinemaEmail.trim(),
          description: editCinemaDesc.trim(),
        },
      });

      showToast(`Đã cập nhật thông tin rạp "${editCinemaName.trim()}"!`);
      setEditingCinema(null);
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setEditCinemaError(errObj?.message || 'Không thể cập nhật cụm rạp.');
    }
  };

  const handleDeleteCinemaConfirm = async () => {
    if (!deletingCinema) return;
    try {
      await deleteCinema(deletingCinema.id);
      showToast(`Đã xóa cụm rạp "${deletingCinema.name}" thành công.`);
      setDeletingCinema(null);
      setSelectedCinemaId(null);
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      alert(errObj?.message || 'Không thể xóa cụm rạp này!');
    }
  };

  const handleAddRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCinema) return;
    setAddRoomError('');

    if (!newRoomName.trim()) {
      setAddRoomError('Vui lòng nhập tên phòng chiếu.');
      return;
    }

    try {
      const defaultSeats = adminCinemaMapper.generateDefaultSeats();
      const created = await createRoom({
        cinemaId: currentCinema.id,
        payload: {
          room_name: newRoomName.trim(),
          room_type: adminCinemaMapper.formatToRoomType(newRoomFormat),
          total_seats: defaultSeats.length,
          seat_matrix: adminCinemaMapper.seatsToMatrixPayload(defaultSeats),
          is_active: true,
        },
      });

      showToast(`Đã tạo phòng "${created.name}" thành công!`);
      setIsAddRoomModalOpen(false);
      setSelectedRoomId(created.id);
      setNewRoomName('');
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setAddRoomError(errObj?.message || 'Không thể tạo phòng chiếu.');
    }
  };

  const handleDeleteRoomConfirm = async () => {
    if (!deletingRoom) return;
    try {
      await deleteRoom(deletingRoom.id);
      showToast(`Đã xóa phòng "${deletingRoom.name}" thành công.`);
      setDeletingRoom(null);
      setSelectedRoomId(null);
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      alert(errObj?.message || 'Không thể xóa phòng chiếu này!');
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-[#7C6FE8] text-white font-extrabold text-xs shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* 1. Action Header & Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center font-black shadow-xs">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Quản Lý Cụm Rạp & Sơ Đồ Ghế
            </h1>
          </div>
        </div>

        {/* Header Right Controls (Search Bar + Province Filter + Cinema Dropdown + Add Cinema) */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Search Bar */}
          <div className="relative flex items-center bg-white px-3.5 py-2.5 rounded-2xl border border-gray-200 shadow-2xs w-full sm:w-60">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm rạp (Thanh Xuân, Vincom...)"
              className="w-full pl-2 pr-2 bg-transparent text-xs font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Province Filter Dropdown */}
          <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-2xl border border-gray-200 shadow-2xs">
            <MapPin className="w-4 h-4 text-[#7C6FE8] shrink-0" />
            <select
              value={selectedProvinceId !== null ? String(selectedProvinceId) : ''}
              onChange={(e) => {
                const val = e.target.value;
                const pId = val ? Number(val) : null;
                setSelectedProvinceId(pId);
                setSelectedCinemaId(null);
              }}
              className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="">Tất cả Tỉnh / Thành phố</option>
              {provinces.map((p) => (
                <option key={p.id} value={String(p.id)}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

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
              <span className="max-w-[180px] truncate">
                {currentCinema ? currentCinema.name : 'Đang tải cụm rạp...'}
              </span>
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
                className="absolute right-0 top-full mt-2 w-80 bg-white border border-purple-100 rounded-2xl p-1.5 shadow-[0_12px_40px_rgba(124,111,232,0.15)] z-50 flex flex-col gap-1 max-h-80 overflow-y-auto"
              >
                {filteredCinemas.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 font-medium">
                    Không tìm thấy cụm rạp nào theo từ khóa.
                  </div>
                ) : (
                  filteredCinemas.map((c) => {
                    const isSelected = c.id === currentCinema?.id;
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
                          <span className="text-[10px] text-slate-400 font-medium">
                            {c.city} • {c.rooms.length} phòng
                          </span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#7C6FE8] shrink-0 ml-2" />}
                      </button>
                    );
                  })
                )}
              </motion.div>
            )}
          </div>

          {/* Seat Types Management Studio Button */}
          <button
            type="button"
            onClick={() => setIsSeatTypesModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-[#7C6FE8] font-extrabold text-xs flex items-center gap-2 border border-purple-200 shadow-2xs transition-all cursor-pointer hover:shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>QUẢN LÝ LOẠI GHẾ</span>
          </button>

          {/* Add Cinema Button */}
          <button
            onClick={() => {
              setNewCinemaProvinceId(selectedProvinceId || provinces[0]?.id || 1);
              setIsAddCinemaModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#7C6FE8]/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>THÊM CỤM RẠP</span>
          </button>
        </div>
      </div>

      {/* 2. Main Content Split Layout (Collapsible Left / Expandable Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel: Compact 3 Cols - Completely hidden when collapsed */}
        {!isLeftPanelCollapsed && (
          <div className="lg:col-span-3 flex flex-col gap-4 animate-in fade-in duration-200">
            <div className="p-5 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col gap-4">
              {isLoadingCinemas || !currentCinema ? (
                <div className="flex flex-col gap-3">
                  <Skeleton variant="text" className="w-32 h-4" />
                  <Skeleton variant="text" className="w-full h-6" />
                  <Skeleton variant="rectangular" className="w-full h-28 rounded-2xl" />
                </div>
              ) : (
                <>
                  {/* Cinema Header */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-extrabold text-[#7C6FE8] uppercase tracking-wider">
                        CỤM RẠP ĐANG CHỌN
                      </span>
                      <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1">{currentCinema.name}</h3>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditCinema(currentCinema)}
                        title="Chỉnh sửa thông tin rạp"
                        className="p-1.5 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingCinema(currentCinema)}
                        title="Xóa cụm rạp"
                        className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setIsLeftPanelCollapsed(true)}
                        title="Thu gọn bảng rạp để mở rộng tối đa sơ đồ ghế"
                        className="p-1.5 rounded-xl hover:bg-purple-50 text-slate-400 hover:text-[#7C6FE8] transition-colors cursor-pointer"
                      >
                        <PanelLeftClose className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Real API Details Card (No fake images) */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-gray-200/90 flex flex-col gap-2.5 text-xs text-slate-600 font-medium">
                    <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-gray-200/60">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#7C6FE8] shrink-0" />
                        <span className="font-extrabold text-slate-800">{currentCinema.city}</span>
                      </div>
                      {currentCinema.slug && (
                        <span className="px-2 py-0.5 rounded-md bg-white border border-gray-200 font-mono text-[10px] text-slate-500 truncate max-w-[140px]">
                          /{currentCinema.slug}
                        </span>
                      )}
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="text-slate-400 font-bold shrink-0">Địa chỉ:</span>
                      <span className="text-slate-800 font-semibold line-clamp-2">{currentCinema.address}</span>
                    </div>

                    {currentCinema.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-800 font-semibold">{currentCinema.phone}</span>
                      </div>
                    )}

                    {currentCinema.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-700 font-semibold truncate">{currentCinema.email}</span>
                      </div>
                    )}

                    {currentCinema.description && (
                      <div className="pt-1 text-[11px] text-slate-500 line-clamp-2 italic">
                        "{currentCinema.description}"
                      </div>
                    )}
                  </div>

                  {/* List of Rooms */}
                  <div className="flex flex-col gap-2.5 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                        DANH SÁCH PHÒNG CHIẾU ({currentCinema.rooms.length})
                      </span>
                      <button
                        onClick={() => setIsAddRoomModalOpen(true)}
                        className="px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7C6FE8] font-extrabold text-[11px] flex items-center gap-1 transition-colors cursor-pointer border border-purple-100"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Thêm Phòng</span>
                      </button>
                    </div>

                    {currentCinema.rooms.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-slate-50 border border-gray-200 text-center text-xs text-slate-400">
                        Chưa có phòng chiếu nào. Bấm Thêm Phòng để khởi tạo.
                      </div>
                    ) : (
                      currentCinema.rooms.map((room) => {
                        const isSelected = room.id === activeRoom?.id;
                        return (
                          <div
                            key={room.id}
                            onClick={() => setSelectedRoomId(room.id)}
                            className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-2 relative ${
                              isSelected
                                ? 'bg-purple-50/60 border-[#7C6FE8] shadow-md shadow-[#7C6FE8]/10'
                                : 'bg-slate-50/60 border-gray-200 hover:border-purple-200 hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <h4
                                className={`font-extrabold text-xs line-clamp-1 ${
                                  isSelected ? 'text-[#7C6FE8]' : 'text-slate-900'
                                }`}
                              >
                                {room.name}
                              </h4>
                              <div className="flex items-center gap-1.5">
                                {room.status === 'ACTIVE' ? (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
                                    Hoạt động
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-extrabold border border-rose-200">
                                    Bảo trì
                                  </span>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeletingRoom(room);
                                  }}
                                  title="Xóa phòng chiếu"
                                  className="p-1 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 pt-0.5">
                              <span className="px-2 py-0.5 rounded-md bg-white text-slate-700 font-bold border border-gray-200 text-[10px]">
                                {room.format}
                              </span>
                              <span>
                                Sức chứa: <strong className="text-slate-900">{room.totalSeats || room.seats.length} ghế</strong>
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Right Panel: Expands to 9 Cols (or 12 Cols when Left Panel is Collapsed) */}
        <div className={`${isLeftPanelCollapsed ? 'lg:col-span-12' : 'lg:col-span-9'} flex flex-col gap-6 transition-all duration-200`}>
          <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col gap-6 relative">
            {isLoadingDetail || !activeRoom ? (
              <div className="flex flex-col gap-4 py-8 items-center justify-center text-slate-400">
                <Loader2 className="w-8 h-8 text-[#7C6FE8] animate-spin" />
                <span className="text-xs font-medium">Đang nạp dữ liệu phòng chiếu & sơ đồ ghế...</span>
              </div>
            ) : (
              <>
                {/* Header of Active Room */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      {isLeftPanelCollapsed && (
                        <button
                          type="button"
                          onClick={() => setIsLeftPanelCollapsed(false)}
                          className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7C6FE8] text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer border border-purple-100 shadow-2xs"
                          title="Mở rộng danh sách cụm rạp & phòng chiếu"
                        >
                          <PanelLeftOpen className="w-4 h-4" />
                          <span>Mở Bảng Rạp</span>
                        </button>
                      )}
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#7C6FE8] font-extrabold text-[11px] border border-purple-100">
                        {activeRoom.format}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        Sức chứa: {activeRoomSeats.length} ghế
                      </span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900">{activeRoom.name}</h2>
                  </div>

                  {/* Save Seat Layout Button */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveSeatLayout}
                      disabled={isSavingSeatLayout}
                      className="px-5 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#7C6FE8]/30 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSavingSeatLayout ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>{isSavingSeatLayout ? 'ĐANG LƯU...' : 'LƯU SƠ ĐỒ GHẾ'}</span>
                    </button>
                  </div>
                </div>

                {/* Interactive Seat Canvas Editor Studio */}
                <AdminSeatCanvasEditor
                  seats={activeRoomSeats}
                  roomFormat={activeRoom.format}
                  roomName={activeRoom.name}
                  onChangeSeats={setActiveRoomSeats}
                  onResetToDefaultLayout={handleResetToDefaultLayout}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* 🏢 MODAL 1: THÊM CỤM RẠP MỚI (WITH SLUG) */}
      <AnimatePresence>
        {isAddCinemaModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in font-sans">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-white rounded-3xl border border-purple-100 p-6 shadow-2xl flex flex-col gap-4"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Thêm Cụm Rạp Mới</h3>
                    <span className="text-xs text-slate-400">Khởi tạo chi nhánh rạp CineDot</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddCinemaModalOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {addCinemaError && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{addCinemaError}</span>
                </div>
              )}

              <form onSubmit={handleAddCinemaSubmit} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Tên Cụm Rạp *</label>
                  <input
                    type="text"
                    value={newCinemaName}
                    onChange={(e) => handleNewNameChange(e.target.value)}
                    placeholder="VD: CineDot Landmark 81 Saigon"
                    required
                    className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Đường Dẫn Tĩnh (Slug)</label>
                  <input
                    type="text"
                    value={newCinemaSlug}
                    onChange={(e) => {
                      setIsSlugManuallyEdited(true);
                      setNewCinemaSlug(e.target.value);
                    }}
                    placeholder="cinedot-landmark-81-saigon"
                    className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Tỉnh / Thành Phố *</label>
                  <select
                    value={newCinemaProvinceId}
                    onChange={(e) => setNewCinemaProvinceId(Number(e.target.value))}
                    className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  >
                    {provinces.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Địa chỉ chi tiết</label>
                  <input
                    type="text"
                    value={newCinemaAddress}
                    onChange={(e) => setNewCinemaAddress(e.target.value)}
                    placeholder="VD: Tầng 5, TTTM Vincom..."
                    className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Hotline</label>
                    <input
                      type="text"
                      value={newCinemaPhone}
                      onChange={(e) => setNewCinemaPhone(e.target.value)}
                      placeholder="1900 6017"
                      className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Email liên hệ</label>
                    <input
                      type="email"
                      value={newCinemaEmail}
                      onChange={(e) => setNewCinemaEmail(e.target.value)}
                      placeholder="contact@cinedot.vn"
                      className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Mô tả cụm rạp</label>
                  <textarea
                    rows={2}
                    value={newCinemaDesc}
                    onChange={(e) => setNewCinemaDesc(e.target.value)}
                    placeholder="Mô tả công nghệ rạp, phòng chiếu..."
                    className="px-4 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsAddCinemaModalOpen(false)}
                    disabled={isCreatingCinema}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingCinema || !newCinemaName.trim()}
                    className="px-5 py-2.5 rounded-xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isCreatingCinema ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    <span>Tạo Cụm Rạp</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🏢 MODAL 2: SỬA CỤM RẠP (WITH SLUG) */}
      <AnimatePresence>
        {editingCinema && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in font-sans">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-white rounded-3xl border border-blue-100 p-6 shadow-2xl flex flex-col gap-4"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Chỉnh Sửa Cụm Rạp</h3>
                    <span className="text-xs text-slate-400">ID: #{editingCinema.id}</span>
                  </div>
                </div>
                <button
                  onClick={() => setEditingCinema(null)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {editCinemaError && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{editCinemaError}</span>
                </div>
              )}

              <form onSubmit={handleEditCinemaSubmit} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Tên Cụm Rạp *</label>
                  <input
                    type="text"
                    value={editCinemaName}
                    onChange={(e) => setEditCinemaName(e.target.value)}
                    required
                    className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Đường Dẫn Tĩnh (Slug)</label>
                  <input
                    type="text"
                    value={editCinemaSlug}
                    onChange={(e) => setEditCinemaSlug(e.target.value)}
                    placeholder="cinedot-landmark-81-saigon"
                    className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Tỉnh / Thành Phố *</label>
                  <select
                    value={editCinemaProvinceId}
                    onChange={(e) => setEditCinemaProvinceId(Number(e.target.value))}
                    className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    {provinces.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Địa chỉ chi tiết</label>
                  <input
                    type="text"
                    value={editCinemaAddress}
                    onChange={(e) => setEditCinemaAddress(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Hotline</label>
                    <input
                      type="text"
                      value={editCinemaPhone}
                      onChange={(e) => setEditCinemaPhone(e.target.value)}
                      className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Email liên hệ</label>
                    <input
                      type="email"
                      value={editCinemaEmail}
                      onChange={(e) => setEditCinemaEmail(e.target.value)}
                      className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Mô tả cụm rạp</label>
                  <textarea
                    rows={2}
                    value={editCinemaDesc}
                    onChange={(e) => setEditCinemaDesc(e.target.value)}
                    className="px-4 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setEditingCinema(null)}
                    disabled={isUpdatingCinema}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingCinema || !editCinemaName.trim()}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isUpdatingCinema ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    <span>Lưu Thay Đổi</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🏢 MODAL 3: XÁC NHẬN XÓA CỤM RẠP */}
      <AnimatePresence>
        {deletingCinema && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in font-sans">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-3xl border border-rose-100 p-6 shadow-2xl flex flex-col gap-4 text-center items-center"
            >
              <div className="w-14 h-14 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Trash2 className="w-7 h-7" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-black text-slate-900">Xác Nhận Xóa Cụm Rạp?</h3>
                <p className="text-xs text-slate-500">
                  Bạn có chắc chắn muốn xóa cụm rạp <strong className="text-slate-900 font-bold">"{deletingCinema.name}"</strong>?
                  Toàn bộ phòng chiếu và lịch chiếu liên quan cũng sẽ bị gỡ bỏ.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 w-full pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingCinema(null)}
                  disabled={isDeletingCinema}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCinemaConfirm}
                  disabled={isDeletingCinema}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/30"
                >
                  {isDeletingCinema ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Xác Nhận Xóa</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 📽️ MODAL 4: THÊM PHÒNG CHIẾU MỚI */}
      <AnimatePresence>
        {isAddRoomModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in font-sans">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-3xl border border-purple-100 p-6 shadow-2xl flex flex-col gap-4"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center font-bold">
                    <Tv className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Thêm Phòng Chiếu Mới</h3>
                    <span className="text-xs text-slate-400">Rạp: {currentCinema?.name}</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddRoomModalOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {addRoomError && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{addRoomError}</span>
                </div>
              )}

              <form onSubmit={handleAddRoomSubmit} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Tên Phòng Chiếu *</label>
                  <input
                    type="text"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="VD: Phòng 01 - IMAX Laser"
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
                    <option value="3D Experience">3D Experience</option>
                    <option value="2D Standard">2D Standard</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2.5 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsAddRoomModalOpen(false)}
                    disabled={isCreatingRoom}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingRoom || !newRoomName.trim()}
                    className="px-5 py-2.5 rounded-xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isCreatingRoom ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    <span>Tạo Phòng Chiếu</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 📽️ MODAL 5: XÁC NHẬN XÓA PHÒNG CHIẾU */}
      <AnimatePresence>
        {deletingRoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in font-sans">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-3xl border border-rose-100 p-6 shadow-2xl flex flex-col gap-4 text-center items-center"
            >
              <div className="w-14 h-14 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Trash2 className="w-7 h-7" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-black text-slate-900">Xác Nhận Xóa Phòng Chiếu?</h3>
                <p className="text-xs text-slate-500">
                  Bạn có chắc chắn muốn xóa phòng chiếu <strong className="text-slate-900 font-bold">"{deletingRoom.name}"</strong>?
                  Sơ đồ ghế và cấu hình phòng sẽ bị xóa hoàn toàn.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 w-full pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingRoom(null)}
                  disabled={isDeletingRoom}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleDeleteRoomConfirm}
                  disabled={isDeletingRoom}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/30"
                >
                  {isDeletingRoom ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Xác Nhận Xóa</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 💺 MODAL QUẢN LÝ LOẠI GHẾ & BẢNG PHỤ PHÍ (SEAT TYPES STUDIO) */}
      <SeatTypesStudioModal
        isOpen={isSeatTypesModalOpen}
        onClose={() => setIsSeatTypesModalOpen(false)}
      />
    </div>
  );
}
