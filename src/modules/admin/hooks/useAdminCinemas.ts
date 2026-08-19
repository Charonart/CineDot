import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { adminCinemaService, GetAdminCinemasParams } from '../services/adminCinema.service';
import {
  CreateCinemaRequestDTO,
  UpdateCinemaRequestDTO,
  CreateRoomRequestDTO,
  UpdateRoomRequestDTO,
} from '../dto/adminCinema.dto';
import { AdminCinemaItem, AdminCinemaPagination, AdminSeatItem } from '../types/adminCinema.types';
import { adminCinemaMapper } from '../mappers/adminCinema.mapper';

export const adminCinemaKeys = {
  all: ['admin', 'cinemas'] as const,
  lists: () => [...adminCinemaKeys.all, 'list'] as const,
  list: (params?: GetAdminCinemasParams) => [...adminCinemaKeys.lists(), params] as const,
  detail: (id: number | string) => [...adminCinemaKeys.all, 'detail', id] as const,
  rooms: (cinemaId: number | string) => [...adminCinemaKeys.all, 'rooms', cinemaId] as const,
  provinces: ['master', 'provinces'] as const,
};

export function useAdminCinemas(params?: GetAdminCinemasParams, selectedCinemaId?: number | string | null) {
  const queryClient = useQueryClient();

  // 1. Fetch Provinces
  const provincesQuery = useQuery({
    queryKey: adminCinemaKeys.provinces,
    queryFn: () => adminCinemaService.getProvinces(),
    staleTime: 5 * 60 * 1000,
  });

  const provinces = provincesQuery.data || [];
  const provincesMap = useMemo(() => {
    const map: Record<number, string> = {};
    provinces.forEach((p) => {
      map[p.id] = p.name;
    });
    return map;
  }, [provinces]);

  // 2. Fetch Cinemas List
  const cinemasQuery = useQuery({
    queryKey: adminCinemaKeys.list(params),
    queryFn: () => adminCinemaService.getCinemas(params, provincesMap),
    staleTime: 60 * 1000,
  });

  const cinemasList: AdminCinemaItem[] = cinemasQuery.data?.items || [];
  const pagination: AdminCinemaPagination = cinemasQuery.data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
  };

  // 3. Fetch Selected Cinema Detail (including rooms)
  const activeCinemaId = selectedCinemaId ? Number(selectedCinemaId) : (cinemasList[0]?.id || null);

  const cinemaDetailQuery = useQuery({
    queryKey: adminCinemaKeys.detail(activeCinemaId || 0),
    queryFn: () => adminCinemaService.getCinemaDetail(activeCinemaId!, provincesMap),
    enabled: Boolean(activeCinemaId),
    staleTime: 60 * 1000,
  });

  // 4. Mutations
  const createCinemaMutation = useMutation({
    mutationFn: (payload: CreateCinemaRequestDTO) => adminCinemaService.createCinema(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCinemaKeys.all });
    },
  });

  const updateCinemaMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: UpdateCinemaRequestDTO }) =>
      adminCinemaService.updateCinema(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminCinemaKeys.all });
      queryClient.invalidateQueries({ queryKey: adminCinemaKeys.detail(variables.id) });
    },
  });

  const deleteCinemaMutation = useMutation({
    mutationFn: (id: number | string) => adminCinemaService.deleteCinema(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCinemaKeys.all });
    },
  });

  const createRoomMutation = useMutation({
    mutationFn: ({ cinemaId, payload }: { cinemaId: number | string; payload: CreateRoomRequestDTO }) =>
      adminCinemaService.createRoom(cinemaId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminCinemaKeys.all });
      queryClient.invalidateQueries({ queryKey: adminCinemaKeys.detail(variables.cinemaId) });
    },
  });

  const updateRoomMutation = useMutation({
    mutationFn: ({ roomId, payload }: { roomId: number | string; payload: UpdateRoomRequestDTO }) =>
      adminCinemaService.updateRoom(roomId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCinemaKeys.all });
      if (activeCinemaId) {
        queryClient.invalidateQueries({ queryKey: adminCinemaKeys.detail(activeCinemaId) });
      }
    },
  });

  const deleteRoomMutation = useMutation({
    mutationFn: (roomId: number | string) => adminCinemaService.deleteRoom(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCinemaKeys.all });
      if (activeCinemaId) {
        queryClient.invalidateQueries({ queryKey: adminCinemaKeys.detail(activeCinemaId) });
      }
    },
  });

  /**
   * Lưu cấu hình ma trận sơ đồ ghế cho phòng
   */
  const saveSeatLayoutMutation = useMutation({
    mutationFn: async ({
      roomId,
      seats,
      roomName,
      roomType,
      isActive,
    }: {
      roomId: number | string;
      seats: AdminSeatItem[];
      roomName?: string;
      roomType?: string;
      isActive?: boolean;
    }) => {
      const matrixPayload = adminCinemaMapper.seatsToMatrixPayload(seats);
      return adminCinemaService.updateRoom(roomId, {
        room_name: roomName,
        room_type: roomType,
        total_seats: seats.length,
        seat_matrix: matrixPayload,
        is_active: isActive,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCinemaKeys.all });
      if (activeCinemaId) {
        queryClient.invalidateQueries({ queryKey: adminCinemaKeys.detail(activeCinemaId) });
      }
    },
  });

  return {
    // Data
    cinemasList,
    pagination,
    provinces,
    provincesMap,
    currentCinema: cinemaDetailQuery.data || cinemasList.find((c) => c.id === activeCinemaId) || cinemasList[0] || null,

    // Loading states
    isLoadingCinemas: cinemasQuery.isLoading,
    isFetchingCinemas: cinemasQuery.isFetching,
    isLoadingDetail: cinemaDetailQuery.isLoading,
    isFetchingDetail: cinemaDetailQuery.isFetching,

    // Mutations
    createCinema: createCinemaMutation.mutateAsync,
    isCreatingCinema: createCinemaMutation.isPending,

    updateCinema: updateCinemaMutation.mutateAsync,
    isUpdatingCinema: updateCinemaMutation.isPending,

    deleteCinema: deleteCinemaMutation.mutateAsync,
    isDeletingCinema: deleteCinemaMutation.isPending,

    createRoom: createRoomMutation.mutateAsync,
    isCreatingRoom: createRoomMutation.isPending,

    updateRoom: updateRoomMutation.mutateAsync,
    isUpdatingRoom: updateRoomMutation.isPending,

    deleteRoom: deleteRoomMutation.mutateAsync,
    isDeletingRoom: deleteRoomMutation.isPending,

    saveSeatLayout: saveSeatLayoutMutation.mutateAsync,
    isSavingSeatLayout: saveSeatLayoutMutation.isPending,
  };
}
