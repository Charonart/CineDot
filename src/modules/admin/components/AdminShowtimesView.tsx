'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { useAdminShowtimes } from '../hooks/useAdminShowtimes';
import { AdminShowtimeGridItem, AdminMovieOption } from '../types/adminShowtime.types';
import { ShowtimesToolbar } from './showtimes/ShowtimesToolbar';
import { ShowtimesMovieSidebar } from './showtimes/ShowtimesMovieSidebar';
import { ShowtimesTimelineCanvas } from './showtimes/ShowtimesTimelineCanvas';
import { ShowtimeModals } from './showtimes/ShowtimeModals';

function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function minutesToTime(minutes: number): string {
  const h = Math.floor((minutes / 60) % 24);
  const m = Math.floor(minutes % 60);
  return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`;
}

export function AdminShowtimesView() {
  // Selected Cinema & Date State
  const [selectedCinemaId, setSelectedCinemaId] = useState<number | undefined>(undefined);
  const [selectedDateKey, setSelectedDateKey] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Timeline Zoom Level (0.75: Compact, 1.0: Standard, 1.35: Detailed, 1.75: Ultra-wide)
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  // Snapping Interval in Minutes (5, 10, 15, 30, 1 for off)
  const [snapMinutes, setSnapMinutes] = useState<number>(15);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);
  const [viewingShowtime, setViewingShowtime] = useState<AdminShowtimeGridItem | null>(null);
  const [editingShowtime, setEditingShowtime] = useState<AdminShowtimeGridItem | null>(null);
  const [deletingShowtime, setDeletingShowtime] = useState<AdminShowtimeGridItem | null>(null);

  // Add Form State
  const [addMovieId, setAddMovieId] = useState<number | undefined>(undefined);
  const [addRoomId, setAddRoomId] = useState<number | undefined>(undefined);
  const [addStartTime, setAddStartTime] = useState('14:30');
  const [addPrice, setAddPrice] = useState(110000);
  const [addBufferMinutes, setAddBufferMinutes] = useState(15);

  // Edit Form State
  const [editStartTime, setEditStartTime] = useState('');
  const [editPrice, setEditPrice] = useState(110000);
  const [editBufferMinutes, setEditBufferMinutes] = useState(15);

  // Clone Form State
  const [cloneTargetDate, setCloneTargetDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });

  // Toast Notification
  const [toastMsg, setToastMsg] = useState('');

  // Real API Hook
  const {
    cinemas,
    isLoadingCinemas,
    rooms,
    isLoadingRooms,
    movies,
    isLoadingMovies,
    showtimes,
    isFetchingShowtimes,
    refetchShowtimes,
    createShowtime,
    isCreatingShowtime,
    updateShowtime,
    isUpdatingShowtime,
    deleteShowtime,
    isDeletingShowtime,
    cloneDateShowtimes,
    isCloningDate,
  } = useAdminShowtimes(selectedCinemaId, selectedDateKey);

  // Auto-select first cinema on mount
  useEffect(() => {
    if (!selectedCinemaId && cinemas.length > 0) {
      setSelectedCinemaId(cinemas[0].id);
    }
  }, [cinemas, selectedCinemaId]);

  // Generate 7 consecutive date pills from today
  const datePills = useMemo(() => {
    const pills = [];
    const today = new Date();
    const dayNames = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const key = d.toISOString().split('T')[0];
      const dayName = i === 0 ? 'Hôm nay' : i === 1 ? 'Ngày mai' : dayNames[d.getDay()];
      const label = `${dayName}, ${d.getDate() < 10 ? '0' + d.getDate() : d.getDate()}/${
        d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
      }`;
      pills.push({ key, label });
    }
    return pills;
  }, []);

  // Selected Movie for Add Form
  const selectedAddMovie = useMemo(() => {
    return movies.find((m) => m.id === addMovieId) || movies[0] || null;
  }, [movies, addMovieId]);

  // Calculate End Time for Add Form
  const calculatedEndTime = useMemo(() => {
    if (!selectedAddMovie || !addStartTime) return '';
    const duration = selectedAddMovie.duration || 120;
    const startM = timeToMinutes(addStartTime);
    const endM = startM + duration;
    return minutesToTime(endM);
  }, [selectedAddMovie, addStartTime]);

  // Staggering Conflicts Detection
  const staggeringConflicts = useMemo(() => {
    const list = [...showtimes].sort((a, b) => a.startMinutes - b.startMinutes);
    const conflicts: Array<{ st1: AdminShowtimeGridItem; st2: AdminShowtimeGridItem; diff: number }> = [];

    for (let i = 0; i < list.length - 1; i++) {
      for (let j = i + 1; j < list.length; j++) {
        if (list[i].roomId !== list[j].roomId) {
          const diff = Math.abs(list[i].startMinutes - list[j].startMinutes);
          if (diff <= 10) {
            conflicts.push({ st1: list[i], st2: list[j], diff });
          }
        }
      }
    }
    return conflicts;
  }, [showtimes]);

  // Open Add Modal Helper
  const handleOpenAddModal = (roomId?: number, defaultStartTime?: string, movie?: AdminMovieOption) => {
    if (movie) {
      setAddMovieId(movie.id);
    } else if (!addMovieId && movies.length > 0) {
      setAddMovieId(movies[0].id);
    }

    if (roomId) {
      setAddRoomId(roomId);
    } else if (!addRoomId && rooms.length > 0) {
      setAddRoomId(rooms[0].id);
    }

    const targetRoomId = roomId || addRoomId || rooms[0]?.id;
    if (defaultStartTime) {
      setAddStartTime(defaultStartTime);
    } else if (targetRoomId) {
      const roomShowtimes = showtimes.filter((st) => st.roomId === targetRoomId);
      if (roomShowtimes.length > 0) {
        const latestEndM = Math.max(...roomShowtimes.map((st) => st.endMinutes + st.cleaningBufferMinutes));
        setAddStartTime(minutesToTime(latestEndM));
      } else {
        setAddStartTime('09:30');
      }
    }

    setIsAddModalOpen(true);
  };

  // Handle Create Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addMovieId || !addRoomId || !addStartTime) {
      alert('Vui lòng chọn đầy đủ Phim, Phòng chiếu và Giờ bắt đầu.');
      return;
    }

    try {
      const fullStart = `${selectedDateKey} ${addStartTime}:00`;
      const fullEnd = calculatedEndTime ? `${selectedDateKey} ${calculatedEndTime}:00` : undefined;

      await createShowtime({
        movie_id: addMovieId,
        room_id: addRoomId,
        showtime_start: fullStart,
        showtime_end: fullEnd,
        base_price: addPrice,
        buffer_minutes: addBufferMinutes,
      });

      setIsAddModalOpen(false);
      setToastMsg('Tạo suất chiếu thành công!');
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } }; message?: string };
      alert(errObj?.response?.data?.message || errObj?.message || 'Lỗi khi tạo suất chiếu.');
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShowtime || !editStartTime) return;

    try {
      const fullStart = `${editingShowtime.showDate} ${editStartTime}:00`;
      const duration = editingShowtime.durationMinutes || 120;
      const endM = timeToMinutes(editStartTime) + duration;
      const fullEnd = `${editingShowtime.showDate} ${minutesToTime(endM)}:00`;

      await updateShowtime({
        id: editingShowtime.id,
        data: {
          showtime_start: fullStart,
          showtime_end: fullEnd,
          base_price: editPrice,
          buffer_minutes: editBufferMinutes,
        },
      });

      setIsEditModalOpen(false);
      setEditingShowtime(null);
      setToastMsg('Cập nhật suất chiếu thành công!');
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } }; message?: string };
      alert(errObj?.response?.data?.message || errObj?.message || 'Lỗi khi cập nhật suất chiếu.');
    }
  };

  // Handle Delete Submit
  const handleDeleteSubmit = async () => {
    if (!deletingShowtime) return;

    try {
      await deleteShowtime(deletingShowtime.id);
      setIsDeleteModalOpen(false);
      setDeletingShowtime(null);
      setToastMsg('Đã xóa suất chiếu thành công!');
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } }; message?: string };
      alert(errObj?.response?.data?.message || errObj?.message || 'Lỗi khi xóa suất chiếu.');
    }
  };

  // Handle Clone Date Submit
  const handleCloneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloneTargetDate) return;

    try {
      const res = await cloneDateShowtimes({
        source_date: selectedDateKey,
        target_date: cloneTargetDate,
        cinema_id: selectedCinemaId,
      });

      setIsCloneModalOpen(false);
      setToastMsg(res.message);
      setSelectedDateKey(cloneTargetDate);
      setTimeout(() => setToastMsg(''), 5000);
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } }; message?: string };
      alert(errObj?.response?.data?.message || errObj?.message || 'Lỗi sao chép lịch chiếu.');
    }
  };

  // Handle Drag Move Showtime (Reschedule)
  const handleMoveShowtime = async (
    showtimeId: number,
    targetRoomId: number,
    newStartTime: string,
    newEndTime: string
  ) => {
    try {
      const fullStart = `${selectedDateKey} ${newStartTime}:00`;
      const fullEnd = `${selectedDateKey} ${newEndTime}:00`;

      await updateShowtime({
        id: showtimeId,
        data: {
          room_id: targetRoomId,
          showtime_start: fullStart,
          showtime_end: fullEnd,
        },
      });

      setToastMsg(`Đã dời suất chiếu sang ${newStartTime} thành công!`);
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } }; message?: string };
      alert(errObj?.response?.data?.message || errObj?.message || 'Lỗi khi dời suất chiếu.');
    }
  };

  return (
    <div className="flex flex-col font-sans text-slate-900 select-none bg-white rounded-xl border border-gray-200/90 shadow-2xs overflow-hidden">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 px-4 py-2 rounded-lg bg-slate-900 text-white font-medium text-xs shadow-xl flex items-center gap-2 border border-slate-800 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
          <button
            onClick={() => setToastMsg('')}
            className="p-0.5 rounded hover:bg-slate-800 text-slate-400 ml-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Studio Top Command Strip */}
      <ShowtimesToolbar
        cinemas={cinemas}
        isLoadingCinemas={isLoadingCinemas}
        selectedCinemaId={selectedCinemaId}
        onSelectCinema={(id) => setSelectedCinemaId(id)}
        datePills={datePills}
        selectedDateKey={selectedDateKey}
        onSelectDate={(key) => setSelectedDateKey(key)}
        zoomLevel={zoomLevel}
        onZoomChange={(lvl) => setZoomLevel(lvl)}
        snapMinutes={snapMinutes}
        onSnapChange={(snap) => setSnapMinutes(snap)}
        isFetchingShowtimes={isFetchingShowtimes}
        onRefresh={() => refetchShowtimes()}
        onOpenAddModal={() => handleOpenAddModal()}
        onOpenCloneModal={() => setIsCloneModalOpen(true)}
      />

      {/* 2. Inline Staggering Conflict Warning Banner */}
      {staggeringConflicts.length > 0 && (
        <div className="px-4 py-2 bg-amber-50/80 border-b border-amber-200/80 flex items-center gap-2 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <div className="flex-1">
            <strong>Giãn cách sảnh:</strong> Phát hiện {staggeringConflicts.length} cặp suất chiếu bắt đầu cách nhau <strong>&le; 10 phút</strong> giữa các phòng. Khuyến nghị giãn cách 15 phút để giảm tải sảnh bắp nước và cửa soát vé.
          </div>
        </div>
      )}

      {/* 3. Integrated Split Workspace: Left Movie Tray (260px) + Right Gantt Canvas */}
      <div className="flex flex-col lg:flex-row min-h-[640px]">
        {/* Left Movie Catalog Tray */}
        <div className="w-full lg:w-64 shrink-0">
          <ShowtimesMovieSidebar
            movies={movies}
            isLoadingMovies={isLoadingMovies}
            onSelectMovieForAdd={(movie) => handleOpenAddModal(undefined, undefined, movie)}
          />
        </div>

        {/* Right Timeline Canvas */}
        <div className="flex-1 min-w-0">
          <ShowtimesTimelineCanvas
            rooms={rooms}
            showtimes={showtimes}
            isLoadingRooms={isLoadingRooms}
            zoomLevel={zoomLevel}
            snapMinutes={snapMinutes}
            selectedDateKey={selectedDateKey}
            onOpenAddModal={handleOpenAddModal}
            onViewShowtime={(st) => setViewingShowtime(st)}
            onEditShowtime={(st) => {
              setEditingShowtime(st);
              setEditStartTime(st.startTime);
              setEditPrice(st.basePrice);
              setIsEditModalOpen(true);
            }}
            onDeleteShowtime={(st) => {
              setDeletingShowtime(st);
              setIsDeleteModalOpen(true);
            }}
            onMoveShowtime={handleMoveShowtime}
          />
        </div>
      </div>

      {/* 4. Modals Container */}
      <ShowtimeModals
        isAddModalOpen={isAddModalOpen}
        onCloseAddModal={() => setIsAddModalOpen(false)}
        onSubmitCreate={handleCreateSubmit}
        isCreating={isCreatingShowtime}
        movies={movies}
        rooms={rooms}
        existingShowtimes={showtimes}
        addMovieId={addMovieId}
        setAddMovieId={setAddMovieId}
        addRoomId={addRoomId}
        setAddRoomId={setAddRoomId}
        addStartTime={addStartTime}
        setAddStartTime={setAddStartTime}
        calculatedEndTime={calculatedEndTime}
        addPrice={addPrice}
        setAddPrice={setAddPrice}
        addBufferMinutes={addBufferMinutes}
        setAddBufferMinutes={setAddBufferMinutes}

        isEditModalOpen={isEditModalOpen}
        onCloseEditModal={() => setIsEditModalOpen(false)}
        onSubmitEdit={handleEditSubmit}
        isUpdating={isUpdatingShowtime}
        editingShowtime={editingShowtime}
        editStartTime={editStartTime}
        setEditStartTime={setEditStartTime}
        editPrice={editPrice}
        setEditPrice={setEditPrice}
        editBufferMinutes={editBufferMinutes}
        setEditBufferMinutes={setEditBufferMinutes}

        isDeleteModalOpen={isDeleteModalOpen}
        onCloseDeleteModal={() => setIsDeleteModalOpen(false)}
        onConfirmDelete={handleDeleteSubmit}
        isDeleting={isDeletingShowtime}
        deletingShowtime={deletingShowtime}

        isCloneModalOpen={isCloneModalOpen}
        onCloseCloneModal={() => setIsCloneModalOpen(false)}
        onSubmitClone={handleCloneSubmit}
        isCloning={isCloningDate}
        selectedDateKey={selectedDateKey}
        cloneTargetDate={cloneTargetDate}
        setCloneTargetDate={setCloneTargetDate}

        viewingShowtime={viewingShowtime}
        onCloseViewModal={() => setViewingShowtime(null)}
        onOpenEditFromView={(st) => {
          setEditingShowtime(st);
          setEditStartTime(st.startTime);
          setEditPrice(st.basePrice);
          setIsEditModalOpen(true);
        }}
        onOpenDeleteFromView={(st) => {
          setDeletingShowtime(st);
          setIsDeleteModalOpen(true);
        }}
      />
    </div>
  );
}
