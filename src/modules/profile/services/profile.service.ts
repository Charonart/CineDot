import { apiClient } from '@/shared/lib/apiClient';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { ApiResponse } from '@/shared/types/api.types';
import {
  UserProfile,
  UserTicketItem,
  StarShopOrderItem,
} from '../types/profile.types';
import {
  MOCK_USER_PROFILE,
  MOCK_USER_TICKETS,
} from '../mocks/mockProfileData';
import { APP_CONFIG } from '@/shared/constants/config';
import { imageHelper } from '@/shared/utils/imageHelper';

export interface UpdateProfilePayload {
  fullname?: string;
  phone?: string;
  avatar?: string;
  gender?: string;
  birthday?: string;
  province_id?: number;
}

export async function fetchUserProfile(): Promise<UserProfile> {
  try {
    const res = await apiClient.get<ApiResponse<any>>(ENDPOINTS.USERS.PROFILE);
    if (res.data?.success && res.data?.data) {
      const u = res.data.data;
      return {
        id: String(u.user_id || u.id || '101'),
        fullName: u.fullname || u.name || 'Khách Hàng CineDot',
        email: u.email || 'user@cinedot.vn',
        phone: u.phone || '0901234567',
        birthDate: u.birthday || '2000-01-15',
        gender: u.gender || 'male',
        city: u.province || 'Hồ Chí Minh',
        avatarUrl: imageHelper.getAvatarUrl(u.avatar),
        tierName: u.user_tier || 'Silver',
        tierBadge: u.user_tier === 'Gold' ? '🌟 Gold Member' : '✨ Silver Member',
        cinePoints: u.total_points || 1500,
        nextTierPoints: 3000,
      };
    }
  } catch (error) {
    console.error('Failed to fetch profile', error);
    throw error;
  }
}

export async function updateUserProfile(payload: UpdateProfilePayload): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await apiClient.patch<ApiResponse<any>>(ENDPOINTS.USERS.UPDATE_PROFILE, payload);
    return {
      success: res.data?.success ?? true,
      message: res.data?.message || 'Cập nhật thông tin thành công',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Cập nhật thông tin không thành công',
    };
  }
}

export async function fetchUserTickets(tab: 'UPCOMING' | 'PAST'): Promise<UserTicketItem[]> {
  try {
    const res = await apiClient.get<ApiResponse<any>>(ENDPOINTS.USERS.MY_BOOKINGS, {
      params: { per_page: 20 },
    });

    if (res.data?.success && res.data?.data) {
      const rawList = Array.isArray(res.data.data) ? res.data.data : res.data.data.data || [];
      if (rawList.length > 0) {
        const mapped: UserTicketItem[] = rawList.map((b: any) => {
          const showtime = b.showtime || {};
          const movie = b.movie || {};
          const cinema = b.cinema || {};
          const room = b.room || {};
          
          let showtimeDateObj = showtime.showtime_start ? new Date(showtime.showtime_start) : new Date();

          let statusTab: 'UPCOMING' | 'PAST' | 'CANCELLED' = 'PAST';
          if (b.booking_status === 'cancelled') {
            statusTab = 'CANCELLED';
          } else if (b.booking_status === 'completed') {
            const isPast = showtimeDateObj < new Date();
            statusTab = isPast ? 'PAST' : 'UPCOMING';
          }

          return {
            bookingId: b.booking_code || String(b.booking_id || b.id),
            movieTitle: movie.title || 'Phim Điện Ảnh',
            movieSlug: movie.slug || 'movie-detail',
            posterUrl: imageHelper.getPosterUrl(movie.poster_url),
            movieFormat: b.price_breakdown?.metadata?.format || room.room_type || '2D Phụ Đề',
            ageRating: movie.age_rating || 'P',
            cinemaName: cinema.cinema_name || 'CineDot Landmark 81',
            roomName: room.room_name || 'Phòng 01',
            showTime: showtime.showtime_start ? showtimeDateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '19:30',
            showDate: showtime.showtime_start ? showtimeDateObj.toISOString() : '2026-08-20',
            seatLabels: b.seats_summary || 'Đang cập nhật',
            totalPaid: b.final_amount || 0,
            qrCodeUrl: b.qr_code_url || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CINE-${b.booking_code || b.booking_id}`,
            status: statusTab,
          };
        });

        return mapped.filter((t) => (tab === 'UPCOMING' ? t.status === 'UPCOMING' : t.status !== 'UPCOMING'));
      }
      return [];
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch user tickets', error);
    return [];
  }
}

export async function fetchUserOrders(): Promise<StarShopOrderItem[]> {
  try {
    const res = await apiClient.get<ApiResponse<any>>(ENDPOINTS.USERS.MY_BOOKINGS, {
      params: { per_page: 50 },
    });

    if (res.data?.success && res.data?.data) {
      const rawList = Array.isArray(res.data.data) ? res.data.data : res.data.data.data || [];
      if (rawList.length > 0) {
        const orders: StarShopOrderItem[] = [];
        
        rawList.forEach((b: any) => {
          const bookingCombos = b.booking_combos || b.bookingCombos;
          if (bookingCombos && Array.isArray(bookingCombos) && bookingCombos.length > 0) {
            const cinema = b.showtime?.room?.cinema || b.cinema || {};
            const showtimeDateObj = b.showtime?.showtime_start ? new Date(b.showtime.showtime_start) : new Date(b.created_at || new Date());
            
            let statusTab: 'WAITING_PICKUP' | 'COMPLETED' | 'CANCELLED' = 'COMPLETED';
            if (b.booking_status === 'cancelled') {
              statusTab = 'CANCELLED';
            } else if (b.booking_status === 'paid' || b.booking_status === 'completed') {
              const isPast = showtimeDateObj < new Date();
              statusTab = isPast ? 'COMPLETED' : 'WAITING_PICKUP';
            }

            let totalComboAmount = 0;
            const items = bookingCombos.map((bc: any) => {
              const combo = bc.combo || {};
              const quantity = bc.quantity || 1;
              const price = bc.price || combo.price || 0;
              totalComboAmount += price * quantity;
              
              return {
                name: combo.name || 'Combo',
                quantity: quantity,
                price: price,
                image: imageHelper.getComboUrl(combo.image_url || combo.imageUrl),
              };
            });

            const orderDateStr = b.created_at ? new Date(b.created_at).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '20-08-2026';

            orders.push({
              orderId: b.booking_code || String(b.booking_id || b.id),
              orderDate: orderDateStr,
              cinemaName: cinema.cinema_name || 'CineDot',
              totalAmount: totalComboAmount,
              status: statusTab,
              qrCodeUrl: b.qr_code_url || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CINE-${b.booking_code || b.booking_id}`,
              items: items,
            });
          }
        });

        return orders;
      }
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch user orders', error);
    return [];
  }
}


export async function cancelBooking(bookingId: number | string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await apiClient.post<ApiResponse<any>>(ENDPOINTS.BOOKINGS.CANCEL(bookingId));
    return {
      success: res.data?.success ?? true,
      message: res.data?.message || 'Hủy vé thành công',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Không thể hủy vé. Vui lòng liên hệ hotline để được hỗ trợ.',
    };
  }
}

