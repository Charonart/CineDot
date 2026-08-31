'use client';

/* Hallmark · genre: modern-minimal · macrostructure: Workbench · theme: White Minimal Admin · designed-as-app */
/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useAdminCinemas } from '../hooks/useAdminCinemas';
import { AdminCinemaItem, AdminRoomItem, AdminSeatItem } from '../types/adminCinema.types';
import { adminCinemaMapper } from '../mappers/adminCinema.mapper';
import {
  CinemasToolbar,
  CinemaSidebar,
  CinemaRoomStudio,
  CinemaModals,
  SeatTypesStudioModal,
} from './cinemas';

export function AdminCinemasView() {
  // 1. Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
  const [selectedCinemaId, setSelectedCinemaId] = useState<number | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [isSeatTypesModalOpen, setIsSeatTypesModalOpen] = useState(false);

  // 2. Collapse Left Panel State (for 100% canvas editing area)
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);

  // 3. Memoized Query Params for Real API
  const cinemaQueryParams = useMemo(
    () => (selectedProvinceId ? { province_id: selectedProvinceId } : undefined),
    [selectedProvinceId]
  );

  // 4. Hook 100% Real API
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

  // 5. Filtered Cinemas according to Search Query
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

  // 6. Active Room Selection
  const activeRoom: AdminRoomItem | null =
    currentCinema?.rooms.find((r) => r.id === selectedRoomId) ||
    currentCinema?.rooms[0] ||
    null;

  // 7. Local Editable Seats in Active Room
  const [activeRoomSeats, setActiveRoomSeats] = useState<AdminSeatItem[]>([]);
  const lastSyncedRoomIdRef = useRef<number | null>(null);

  // Synchronize active room seats when switching to a different room
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

  // Auto select first cinema on mount or when cinema list loads
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

  // Auto select first room when cinema changes
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

  // 8. Toast Notifications
  const [toastMsg, setToastMsg] = useState('');
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // 9. Modals State
  const [isAddCinemaModalOpen, setIsAddCinemaModalOpen] = useState(false);
  const [editingCinema, setEditingCinema] = useState<AdminCinemaItem | null>(null);
  const [deletingCinema, setDeletingCinema] = useState<AdminCinemaItem | null>(null);

  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [deletingRoom, setDeletingRoom] = useState<AdminRoomItem | null>(null);

  // Form States - Add Cinema
  const [newCinemaName, setNewCinemaName] = useState('');
  const [newCinemaSlug, setNewCinemaSlug] = useState('');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [newCinemaAddress, setNewCinemaAddress] = useState('');
  const [newCinemaProvinceId, setNewCinemaProvinceId] = useState<number>(1);
  const [newCinemaPhone, setNewCinemaPhone] = useState('');
  const [newCinemaEmail, setNewCinemaEmail] = useState('');
  const [newCinemaDesc, setNewCinemaDesc] = useState('');
  const [addCinemaError, setAddCinemaError] = useState('');

  // Form States - Edit Cinema
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

  // Auto generate slug from Vietnamese string
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

  // Handlers
  const handleSelectCinema = (cinemaId: number) => {
    setSelectedCinemaId(cinemaId);
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
      showToast(`Đã lưu thiết lập sơ đồ ghế cho "${activeRoom.name}" thành công!`);
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
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-[#7C6FE8] text-white font-extrabold text-xs shadow-2xl flex items-center gap-2.5"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Action Header & Toolbar */}
      <CinemasToolbar
        cinemasList={cinemasList}
        filteredCinemas={filteredCinemas}
        currentCinema={currentCinema}
        provinces={provinces}
        selectedProvinceId={selectedProvinceId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onProvinceChange={(pId) => {
          setSelectedProvinceId(pId);
          setSelectedCinemaId(null);
        }}
        onSelectCinema={handleSelectCinema}
        onOpenAddCinema={() => {
          setNewCinemaProvinceId(selectedProvinceId || provinces[0]?.id || 1);
          setIsAddCinemaModalOpen(true);
        }}
        onOpenSeatTypesStudio={() => setIsSeatTypesModalOpen(true)}
        isLoadingCinemas={isLoadingCinemas}
      />

      {/* 2. Main Content Split Layout (Collapsible Left / Expandable Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel: Compact 3 Cols - Hidden when collapsed */}
        {!isLeftPanelCollapsed && (
          <div className="lg:col-span-3">
            <CinemaSidebar
              currentCinema={currentCinema}
              activeRoom={activeRoom}
              isLoading={isLoadingCinemas}
              onSelectRoom={(roomId) => setSelectedRoomId(roomId)}
              onOpenEditCinema={handleOpenEditCinema}
              onOpenDeleteCinema={(cinema) => setDeletingCinema(cinema)}
              onOpenAddRoom={() => setIsAddRoomModalOpen(true)}
              onOpenDeleteRoom={(room) => setDeletingRoom(room)}
              onCollapse={() => setIsLeftPanelCollapsed(true)}
            />
          </div>
        )}

        {/* Right Panel: Expands to 9 Cols (or 12 Cols when Left Panel is Collapsed) */}
        <div className={`${isLeftPanelCollapsed ? 'lg:col-span-12' : 'lg:col-span-9'} transition-all duration-200`}>
          <CinemaRoomStudio
            activeRoom={activeRoom}
            seats={activeRoomSeats}
            isLoadingDetail={isLoadingDetail}
            isSavingSeatLayout={isSavingSeatLayout}
            isLeftPanelCollapsed={isLeftPanelCollapsed}
            onExpandLeftPanel={() => setIsLeftPanelCollapsed(false)}
            onChangeSeats={setActiveRoomSeats}
            onResetToDefaultLayout={handleResetToDefaultLayout}
            onSaveSeatLayout={handleSaveSeatLayout}
          />
        </div>
      </div>

      {/* 3. CRUD Modals for Cinemas and Screening Rooms */}
      <CinemaModals
        provinces={provinces}
        // Add Cinema
        isAddCinemaModalOpen={isAddCinemaModalOpen}
        onCloseAddCinema={() => setIsAddCinemaModalOpen(false)}
        onSubmitAddCinema={handleAddCinemaSubmit}
        newCinemaName={newCinemaName}
        onNewNameChange={handleNewNameChange}
        newCinemaSlug={newCinemaSlug}
        onNewSlugChange={(val) => {
          setIsSlugManuallyEdited(true);
          setNewCinemaSlug(val);
        }}
        newCinemaProvinceId={newCinemaProvinceId}
        onNewProvinceIdChange={setNewCinemaProvinceId}
        newCinemaAddress={newCinemaAddress}
        onNewAddressChange={setNewCinemaAddress}
        newCinemaPhone={newCinemaPhone}
        onNewPhoneChange={setNewCinemaPhone}
        newCinemaEmail={newCinemaEmail}
        onNewEmailChange={setNewCinemaEmail}
        newCinemaDesc={newCinemaDesc}
        onNewDescChange={setNewCinemaDesc}
        addCinemaError={addCinemaError}
        isCreatingCinema={isCreatingCinema}
        // Edit Cinema
        editingCinema={editingCinema}
        onCloseEditCinema={() => setEditingCinema(null)}
        onSubmitEditCinema={handleEditCinemaSubmit}
        editCinemaName={editCinemaName}
        onEditNameChange={setEditCinemaName}
        editCinemaSlug={editCinemaSlug}
        onEditSlugChange={setEditCinemaSlug}
        editCinemaProvinceId={editCinemaProvinceId}
        onEditProvinceIdChange={setEditCinemaProvinceId}
        editCinemaAddress={editCinemaAddress}
        onEditAddressChange={setEditCinemaAddress}
        editCinemaPhone={editCinemaPhone}
        onEditPhoneChange={setEditCinemaPhone}
        editCinemaEmail={editCinemaEmail}
        onEditEmailChange={setEditCinemaEmail}
        editCinemaDesc={editCinemaDesc}
        onEditDescChange={setEditCinemaDesc}
        editCinemaError={editCinemaError}
        isUpdatingCinema={isUpdatingCinema}
        // Delete Cinema
        deletingCinema={deletingCinema}
        onCloseDeleteCinema={() => setDeletingCinema(null)}
        onConfirmDeleteCinema={handleDeleteCinemaConfirm}
        isDeletingCinema={isDeletingCinema}
        // Add Room
        isAddRoomModalOpen={isAddRoomModalOpen}
        currentCinema={currentCinema}
        onCloseAddRoom={() => setIsAddRoomModalOpen(false)}
        onSubmitAddRoom={handleAddRoomSubmit}
        newRoomName={newRoomName}
        onNewRoomNameChange={setNewRoomName}
        newRoomFormat={newRoomFormat}
        onNewRoomFormatChange={setNewRoomFormat}
        addRoomError={addRoomError}
        isCreatingRoom={isCreatingRoom}
        // Delete Room
        deletingRoom={deletingRoom}
        onCloseDeleteRoom={() => setDeletingRoom(null)}
        onConfirmDeleteRoom={handleDeleteRoomConfirm}
        isDeletingRoom={isDeletingRoom}
      />

      {/* 4. Dedicated Seat Types & Surcharge Management Studio Modal */}
      <SeatTypesStudioModal
        isOpen={isSeatTypesModalOpen}
        onClose={() => setIsSeatTypesModalOpen(false)}
      />
    </div>
  );
}
