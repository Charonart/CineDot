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
  TicketFilterStatus,
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

      const rawGender = String(u.gender || '').toLowerCase();
      const normalizedGender =
        rawGender === 'female' || rawGender === 'nữ' || rawGender === 'nu'
          ? 'female'
          : rawGender === 'other' || rawGender === 'khác' || rawGender === 'khac'
          ? 'other'
          : 'male';

      return {
        id: String(u.user_id || u.id || '1'),
        fullName: u.fullname || u.name || 'Khách Hàng CineDot',
        email: u.email || '',
        phone: u.phone || '',
        birthDate: u.birthday || '',
        gender: normalizedGender,
        city: u.province || 'Hồ Chí Minh',
        avatarUrl: imageHelper.getAvatarUrl(u.avatar),
        tierName: u.user_tier || 'Bronze',
        tierBadge:
          u.user_tier === 'Diamond'
            ? '💎 Diamond Member'
            : u.user_tier === 'Gold'
            ? '🌟 Gold Member'
            : u.user_tier === 'Silver'
            ? '✨ Silver Member'
            : '🥉 Bronze Member',
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

export async function updateUserProfile(
  payload: UpdateProfilePayload
): Promise<{ success: boolean; message?: string }> {
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

export async function changeUserPassword(
  payload: ChangePasswordPayload
): Promise<{ success: boolean; message?: string }> {
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

export async function fetchUserTickets(filterTab?: TicketFilterStatus): Promise<UserTicketItem[]> {
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

          let showtimeDateObj = new Date();
          if (showtime.showtime_start) {
            const parsed = new Date(showtime.showtime_start);
            if (!isNaN(parsed.getTime())) {
              showtimeDateObj = parsed;
            }
          }

          let statusTab: 'UPCOMING' | 'PAST' | 'CANCELLED' = 'PAST';
          let canCancel = false;

          const isPast = showtimeDateObj < now;

          if (b.booking_status === 'cancelled') {
            statusTab = 'CANCELLED';
          } else if (b.booking_status === 'completed' || b.booking_status === 'paid') {
            statusTab = isPast ? 'PAST' : 'UPCOMING';

            // Cancellation condition: upcoming and at least 2 hours prior
            const hoursDiff = (showtimeDateObj.getTime() - now.getTime()) / (1000 * 60 * 60);
            canCancel = !isPast && hoursDiff >= 2;
          } else if (b.booking_status === 'pending') {
            statusTab = isPast ? 'PAST' : 'UPCOMING';
            canCancel = false;
          }

          const formattedTime = showtime.showtime_start
            ? showtimeDateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })
            : '19:30';

          const formattedDate = showtime.showtime_start
            ? showtimeDateObj.toLocaleDateString('vi-VN', {
                weekday: 'short',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            : '20/08/2026';

          return {
            bookingId: b.booking_code || String(b.booking_id || b.id),
            rawBookingId: b.booking_id ? Number(b.booking_id) : undefined,
            bookingCode: b.booking_code || String(b.booking_id || b.id),
            movieTitle: movie.title || 'Phim Điện Ảnh CineDot',
            movieSlug: movie.slug || 'movie-detail',
            posterUrl: imageHelper.getPosterUrl(movie.poster_url || movie.poster_path),
            movieFormat: b.price_breakdown?.metadata?.format || room.room_type || '2D Phụ Đề',
            ageRating: movie.age_rating || movie.ageRating || 'P',
            duration: movie.duration ? Number(movie.duration) : undefined,
            cinemaName: cinema.cinema_name || 'CineDot Landmark 81',
            roomName: room.room_name || 'Phòng 01',
            showTime: formattedTime,
            showDate: formattedDate,
            showtimeStartIso: showtime.showtime_start || undefined,
            seatLabels: b.seats_summary || 'Đang cập nhật',
            totalSeats: Number(b.total_seats || (b.seats_summary ? b.seats_summary.split(',').length : 1)),
            combosSummary: b.combos_summary || undefined,
            totalCombos: Number(b.total_combos || 0),
            totalPaid: Number(b.final_amount || b.final_total || 0),
            discountAmount: Number(b.discount_amount || 0),
            qrCodeUrl:
              b.qr_code_url ||
              `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                b.booking_code || b.booking_id
              )}`,
            status: statusTab,
            canCancel,
            createdAt: b.created_at,
          };
        });

        if (filterTab && filterTab !== 'ALL') {
          return mapped.filter((t) => t.status === filterTab);
        }

        return mapped;
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
    const res = await apiClient.get<ApiResponse<any[]>>(ENDPOINTS.VOUCHERS.LIST);
    if (res.data?.success && Array.isArray(res.data?.data)) {
      return res.data.data.map((v: any) => {
        const rawType = String(v.voucher_type || v.voucherType || v.category || 'all').toLowerCase();
        let cat: 'TICKET' | 'FNB' | 'ALL' = 'ALL';
        if (rawType.includes('ticket') || rawType.includes('vé') || rawType.includes('ve')) {
          cat = 'TICKET';
        } else if (
          rawType.includes('fnb') ||
          rawType.includes('combo') ||
          rawType.includes('bắp') ||
          rawType.includes('bap') ||
          rawType.includes('food')
        ) {
          cat = 'FNB';
        }

        const discountType: 'percentage' | 'fixed_amount' = String(
          v.discount_type || v.discountType || 'percentage'
        )
          .toLowerCase()
          .includes('fixed')
          ? 'fixed_amount'
          : 'percentage';

        const discountVal = Number(
          v.discount_value ?? v.discountValue ?? (discountType === 'percentage' ? 10 : 20000)
        );

        let formattedDate = '31/12/2026';
        if (v.valid_until || v.validUntil) {
          try {
            const d = new Date(v.valid_until || v.validUntil);
            if (!isNaN(d.getTime())) {
              formattedDate = d.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              });
            } else {
              formattedDate = String(v.valid_until || v.validUntil);
            }
          } catch {
            formattedDate = String(v.valid_until || v.validUntil);
          }
        }

        return {
          id: v.id || v.voucher_id || v.code || `v-${Math.random()}`,
          code: v.code || 'CINEDOT',
          title: v.title || v.name || 'Voucher Khuyến Mãi CineDot',
          description: v.description || 'Áp dụng cho tất cả dịch vụ tại rạp CineDot',
          discountType,
          discountValue: isNaN(discountVal) ? 0 : discountVal,
          minOrderValue: Number(v.min_order_value || v.minOrderValue || 0),
          maxDiscountValue: Number(v.max_discount_value || v.maxDiscountValue || 0),
          validUntil: formattedDate,
          isActive: v.is_active ?? v.isActive ?? true,
          category: cat,
        };
      });
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

export async function cancelBooking(
  bookingId: number | string
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await apiClient.post<ApiResponse<any>>(ENDPOINTS.BOOKINGS.CANCEL(bookingId));
    if (res.data?.success) {
      return {
        success: true,
        message: res.data.message || 'Hủy vé thành công! Yêu cầu hoàn tiền đã được tiếp nhận.',
      };
    }
    return {
      success: false,
      message: res.data?.message || 'Không thể hủy vé. Vui lòng thử lại sau.',
    };
  } catch (err: any) {
    return {
      success: false,
      message:
        err.response?.data?.message ||
        err.message ||
        'Không thể hủy vé. Vui lòng liên hệ hotline để được hỗ trợ.',
    };
  }
}


