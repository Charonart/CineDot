import { apiClient } from '@/shared/lib/apiClient';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { ApiResponse } from '@/shared/types/api.types';
import {
  UserProfile,
  UserTicketItem,
  StarShopOrderItem,
  RewardVoucherItem,
  TransactionItem,
  ChangePasswordPayload,
} from '../types/profile.types';
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
      const tierData = u.tier_info || {};

      return {
        id: String(u.user_id || u.id || '1'),
        fullName: u.fullname || u.name || 'Khách Hàng CineDot',
        email: u.email || '',
        phone: u.phone || '',
        birthDate: u.birthday || '',
        gender: u.gender || 'male',
        city: u.province || 'Hồ Chí Minh',
        avatarUrl: imageHelper.getAvatarUrl(u.avatar),
        tierName: u.user_tier || 'Bronze',
        tierBadge: u.user_tier === 'Gold' ? '🌟 Gold Member' : u.user_tier === 'Silver' ? '✨ Silver Member' : '🥉 Bronze Member',
        cinePoints: Number(u.total_points || 0),
        nextTierPoints: Number(tierData.next_tier_min_points || 500),
        tierInfo: {
          currentTier: tierData.current_tier || u.user_tier || 'Bronze',
          currentPoints: Number(u.total_points || 0),
          discountPercent: Number(tierData.discount_percent || 0),
          nextTier: tierData.next_tier,
          pointsNeeded: Number(tierData.points_needed || 0),
          nextTierMinPoints: Number(tierData.next_tier_min_points || 500),
        },
      };
    }
    throw new Error('Failed to fetch user profile');
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
      message: err.response?.data?.message || err.message || 'Cập nhật thông tin không thành công',
    };
  }
}

export async function changeUserPassword(payload: ChangePasswordPayload): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await apiClient.post<ApiResponse<any>>(ENDPOINTS.USERS.CHANGE_PASSWORD, payload);
    return {
      success: res.data?.success ?? true,
      message: res.data?.message || 'Đổi mật khẩu thành công',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.response?.data?.message || err.message || 'Đổi mật khẩu thất bại',
    };
  }
}

export async function fetchUserTickets(tab: 'UPCOMING' | 'PAST'): Promise<UserTicketItem[]> {
  try {
    const res = await apiClient.get<ApiResponse<any>>(ENDPOINTS.USERS.MY_BOOKINGS, {
      params: { per_page: 50 },
    });

    if (res.data?.success && res.data?.data) {
      const rawList = Array.isArray(res.data.data) ? res.data.data : res.data.data.data || [];
      if (rawList.length > 0) {
        const now = new Date();
        const mapped: UserTicketItem[] = rawList.map((b: any) => {
          const showtime = b.showtime || {};
          const movie = b.movie || {};
          const cinema = b.cinema || {};
          const room = b.room || {};

          const showtimeDateObj = showtime.showtime_start ? new Date(showtime.showtime_start) : new Date();

          let statusTab: 'UPCOMING' | 'PAST' | 'CANCELLED' = 'PAST';
          let canCancel = false;

          if (b.booking_status === 'cancelled') {
            statusTab = 'CANCELLED';
          } else if (b.booking_status === 'completed' || b.booking_status === 'paid') {
            const isPast = showtimeDateObj < now;
            statusTab = isPast ? 'PAST' : 'UPCOMING';

            // Check cancellation condition: must be upcoming and at least 2 hours prior
            const hoursDiff = (showtimeDateObj.getTime() - now.getTime()) / (1000 * 60 * 60);
            canCancel = !isPast && hoursDiff >= 2;
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
            showDate: showtime.showtime_start ? showtimeDateObj.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '20/08/2026',
            seatLabels: b.seats_summary || 'Đang cập nhật',
            totalPaid: Number(b.final_amount || b.final_total || 0),
            qrCodeUrl: b.qr_code_url || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CINE-${b.booking_code || b.booking_id}`,
            status: statusTab,
            canCancel,
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
    const res = await apiClient.get<ApiResponse<any[]>>(ENDPOINTS.USERS.FNB_ORDERS);

    if (res.data?.success && Array.isArray(res.data?.data)) {
      return res.data.data.map((o: any) => ({
        orderId: String(o.orderId || o.order_id || 'ORD-00'),
        orderDate: o.orderDate || o.order_date || 'Gần đây',
        cinemaName: o.cinemaName || o.cinema_name || 'CineDot Cinema',
        totalAmount: Number(o.totalAmount || o.total_amount || 0),
        status: (o.status || 'COMPLETED') as 'WAITING_PICKUP' | 'COMPLETED' | 'CANCELLED',
        qrCodeUrl: o.qrCodeUrl || o.qr_code_url || '',
        items: Array.isArray(o.items)
          ? o.items.map((it: any) => ({
              name: it.name || 'Combo Bắp Nước',
              quantity: Number(it.quantity || 1),
              price: Number(it.price || 0),
              image: imageHelper.getComboUrl(it.image || it.image_url),
            }))
          : [],
      }));
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch user orders', error);
    return [];
  }
}

export async function fetchUserVouchers(): Promise<RewardVoucherItem[]> {
  try {
    const res = await apiClient.get<ApiResponse<RewardVoucherItem[]>>(ENDPOINTS.VOUCHERS.LIST);
    if (res.data?.success && Array.isArray(res.data?.data)) {
      return res.data.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch user vouchers', error);
    return [];
  }
}

export async function fetchUserTransactions(): Promise<TransactionItem[]> {
  try {
    const res = await apiClient.get<ApiResponse<any[]>>(ENDPOINTS.USERS.TRANSACTIONS);
    if (res.data?.success && Array.isArray(res.data?.data)) {
      return res.data.data.map((t: any) => ({
        id: t.id || `TXN-${t.booking_id}`,
        bookingId: t.booking_id,
        transactionCode: t.booking_code || `TXN-${t.booking_id}`,
        description: t.movie_title ? `Thanh toán vé phim: ${t.movie_title}` : 'Thanh toán dịch vụ CineDot',
        cinemaName: t.cinema_name,
        amount: Number(t.amount || 0),
        paymentMethod: t.payment_method || 'VNPAY',
        status: t.status,
        statusLabel: t.status_label || 'Thành công',
        pointsEarned: Number(t.points_earned || 0),
        date: t.formatted_date || (t.created_at ? new Date(t.created_at).toLocaleString('vi-VN') : 'Gần đây'),
        type: t.type || 'PAYMENT',
      }));
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch transactions', error);
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
      message: err.response?.data?.message || err.message || 'Không thể hủy vé. Vui lòng liên hệ hotline để được hỗ trợ.',
    };
  }
}

