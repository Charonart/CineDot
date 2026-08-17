import { apiClient } from '@/shared/lib/apiClient';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { ApiResponse } from '@/shared/types/api.types';

export const adminService = {
  // ── 1. Movies & TMDB Sync ──
  async syncMoviesFromTmdb(query: string) {
    const res = await apiClient.post<ApiResponse<any>>(ENDPOINTS.ADMIN.MOVIES_SYNC, { query });
    return res.data;
  },

  async getMovies(params?: { search?: string; status?: string; page?: number; per_page?: number }) {
    const res = await apiClient.get<ApiResponse<any>>(ENDPOINTS.ADMIN.MOVIES, { params });
    return res.data;
  },

  async getMovie(id: number | string) {
    const res = await apiClient.get<ApiResponse<any>>(ENDPOINTS.ADMIN.MOVIE_DETAIL(id));
    return res.data;
  },

  async createMovie(payload: any) {
    const res = await apiClient.post<ApiResponse<any>>(ENDPOINTS.ADMIN.MOVIES, payload);
    return res.data;
  },

  async updateMovie(id: number | string, payload: any) {
    const res = await apiClient.put<ApiResponse<any>>(ENDPOINTS.ADMIN.MOVIE_DETAIL(id), payload);
    return res.data;
  },

  async deleteMovie(id: number | string) {
    const res = await apiClient.delete<ApiResponse<any>>(ENDPOINTS.ADMIN.MOVIE_DETAIL(id));
    return res.data;
  },

  async getMovieCredits(movieId: number | string) {
    const res = await apiClient.get<ApiResponse<any>>(ENDPOINTS.ADMIN.MOVIE_CREDITS(movieId));
    return res.data;
  },

  async addMovieCredit(movieId: number | string, payload: any) {
    const res = await apiClient.post<ApiResponse<any>>(ENDPOINTS.ADMIN.MOVIE_CREDITS(movieId), payload);
    return res.data;
  },

  async deleteMovieCredit(movieId: number | string, creditId: number | string) {
    const res = await apiClient.delete<ApiResponse<any>>(
      ENDPOINTS.ADMIN.MOVIE_CREDIT_DELETE(movieId, creditId)
    );
    return res.data;
  },

  // ── 2. Cinemas & Rooms ──
  async getCinemas(params?: any) {
    const res = await apiClient.get<ApiResponse<any>>(ENDPOINTS.ADMIN.CINEMAS, { params });
    return res.data;
  },

  async createCinema(payload: any) {
    const res = await apiClient.post<ApiResponse<any>>(ENDPOINTS.ADMIN.CINEMAS, payload);
    return res.data;
  },

  async updateCinema(id: number | string, payload: any) {
    const res = await apiClient.put<ApiResponse<any>>(ENDPOINTS.ADMIN.CINEMA_DETAIL(id), payload);
    return res.data;
  },

  async deleteCinema(id: number | string) {
    const res = await apiClient.delete<ApiResponse<any>>(ENDPOINTS.ADMIN.CINEMA_DETAIL(id));
    return res.data;
  },

  async createRoom(cinemaId: number | string, payload: any) {
    const res = await apiClient.post<ApiResponse<any>>(ENDPOINTS.ADMIN.CINEMA_ROOMS(cinemaId), payload);
    return res.data;
  },

  async updateRoom(roomId: number | string, payload: any) {
    const res = await apiClient.put<ApiResponse<any>>(ENDPOINTS.ADMIN.ROOM_DETAIL(roomId), payload);
    return res.data;
  },

  async deleteRoom(roomId: number | string) {
    const res = await apiClient.delete<ApiResponse<any>>(ENDPOINTS.ADMIN.ROOM_DETAIL(roomId));
    return res.data;
  },

  // ── 3. Showtimes & Schedules ──
  async quickCreateShowtime(payload: any) {
    const res = await apiClient.post<ApiResponse<any>>(ENDPOINTS.ADMIN.SHOWTIMES_QUICK_CREATE, payload);
    return res.data;
  },

  async getSchedules(params?: { date?: string; cinema_id?: number | string }) {
    const res = await apiClient.get<ApiResponse<any>>(ENDPOINTS.ADMIN.SCHEDULES, { params });
    return res.data;
  },

  async createSchedule(payload: any) {
    const res = await apiClient.post<ApiResponse<any>>(ENDPOINTS.ADMIN.SCHEDULES, payload);
    return res.data;
  },

  async updateSchedule(id: number | string, payload: any) {
    const res = await apiClient.put<ApiResponse<any>>(ENDPOINTS.ADMIN.SCHEDULE_DETAIL(id), payload);
    return res.data;
  },

  async deleteSchedule(id: number | string) {
    const res = await apiClient.delete<ApiResponse<any>>(ENDPOINTS.ADMIN.SCHEDULE_DETAIL(id));
    return res.data;
  },

  // ── 4. Campaigns, Vouchers & Combos ──
  async getCampaigns() {
    const res = await apiClient.get<ApiResponse<any>>(ENDPOINTS.ADMIN.CAMPAIGNS);
    return res.data;
  },

  async createCampaign(payload: any) {
    const res = await apiClient.post<ApiResponse<any>>(ENDPOINTS.ADMIN.CAMPAIGNS, payload);
    return res.data;
  },

  async getCampaignRoi(id: number | string) {
    const res = await apiClient.get<ApiResponse<any>>(ENDPOINTS.ADMIN.CAMPAIGN_ROI(id));
    return res.data;
  },

  async getVouchers(params?: any) {
    const res = await apiClient.get<ApiResponse<any>>(ENDPOINTS.ADMIN.VOUCHERS, { params });
    return res.data;
  },

  async createVoucher(payload: any) {
    const res = await apiClient.post<ApiResponse<any>>(ENDPOINTS.ADMIN.VOUCHERS, payload);
    return res.data;
  },

  async updateVoucher(id: number | string, payload: any) {
    const res = await apiClient.put<ApiResponse<any>>(ENDPOINTS.ADMIN.VOUCHER_DETAIL(id), payload);
    return res.data;
  },

  async deleteVoucher(id: number | string) {
    const res = await apiClient.delete<ApiResponse<any>>(ENDPOINTS.ADMIN.VOUCHER_DETAIL(id));
    return res.data;
  },

  async getCombos(params?: any) {
    const res = await apiClient.get<ApiResponse<any>>(ENDPOINTS.ADMIN.COMBOS, { params });
    return res.data;
  },

  async createCombo(payload: any) {
    const res = await apiClient.post<ApiResponse<any>>(ENDPOINTS.ADMIN.COMBOS, payload);
    return res.data;
  },

  async updateCombo(id: number | string, payload: any) {
    const res = await apiClient.put<ApiResponse<any>>(ENDPOINTS.ADMIN.COMBO_DETAIL(id), payload);
    return res.data;
  },

  async deleteCombo(id: number | string) {
    const res = await apiClient.delete<ApiResponse<any>>(ENDPOINTS.ADMIN.COMBO_DETAIL(id));
    return res.data;
  },

  // ── 5. Pricing Rules ──
  async getPricingRules(params?: any) {
    const res = await apiClient.get<ApiResponse<any>>(ENDPOINTS.ADMIN.PRICING_RULES, { params });
    return res.data;
  },

  async createPricingRule(payload: any) {
    const res = await apiClient.post<ApiResponse<any>>(ENDPOINTS.ADMIN.PRICING_RULES, payload);
    return res.data;
  },

  async updatePricingRule(id: number | string, payload: any) {
    const res = await apiClient.put<ApiResponse<any>>(ENDPOINTS.ADMIN.PRICING_RULE_DETAIL(id), payload);
    return res.data;
  },

  async togglePricingRule(id: number | string) {
    const res = await apiClient.patch<ApiResponse<any>>(ENDPOINTS.ADMIN.PRICING_RULE_TOGGLE(id));
    return res.data;
  },

  async deletePricingRule(id: number | string) {
    const res = await apiClient.delete<ApiResponse<any>>(ENDPOINTS.ADMIN.PRICING_RULE_DETAIL(id));
    return res.data;
  },

  // ── 6. Bookings & Refunds ──
  async getBookings(params?: { status?: string; search?: string; page?: number; per_page?: number }) {
    const res = await apiClient.get<ApiResponse<any>>(ENDPOINTS.ADMIN.BOOKINGS, { params });
    return res.data;
  },

  async getBookingDetail(id: number | string) {
    const res = await apiClient.get<ApiResponse<any>>(ENDPOINTS.ADMIN.BOOKING_DETAIL(id));
    return res.data;
  },

  async refundBooking(id: number | string, payload?: { reason?: string }) {
    const res = await apiClient.post<ApiResponse<any>>(ENDPOINTS.ADMIN.BOOKING_REFUND(id), payload);
    return res.data;
  },

  // ── 7. Reviews ──
  async getReviews(params?: { movie_id?: number | string; rating?: number; page?: number }) {
    const res = await apiClient.get<ApiResponse<any>>(ENDPOINTS.ADMIN.REVIEWS, { params });
    return res.data;
  },

  async deleteReview(id: number | string) {
    const res = await apiClient.delete<ApiResponse<any>>(ENDPOINTS.ADMIN.REVIEW_DELETE(id));
    return res.data;
  },

  // ── 8. Users & Roles (RBAC) ──
  async getUsers(params?: { search?: string; sort?: string; page?: number; limit?: number }) {
    const res = await apiClient.get<ApiResponse<any>>(ENDPOINTS.ADMIN.USERS, { params });
    return res.data;
  },

  async updateUserRole(id: number | string, role: string) {
    const res = await apiClient.put<ApiResponse<any>>(ENDPOINTS.ADMIN.USER_UPDATE_ROLE(id), { role });
    return res.data;
  },

  async getUserContextRoles(userId: number | string) {
    const res = await apiClient.get<ApiResponse<any>>(ENDPOINTS.ADMIN.USER_ROLES(userId));
    return res.data;
  },

  async assignUserContextRole(userId: number | string, payload: any) {
    const res = await apiClient.post<ApiResponse<any>>(ENDPOINTS.ADMIN.USER_ROLES(userId), payload);
    return res.data;
  },

  async revokeUserContextRole(userId: number | string, roleId: number | string) {
    const res = await apiClient.delete<ApiResponse<any>>(
      ENDPOINTS.ADMIN.USER_ROLE_REVOKE(userId, roleId)
    );
    return res.data;
  },

  // ── 9. Reports & Dashboard ──
  async getRevenueReport(startDate?: string, endDate?: string) {
    const res = await apiClient.get<ApiResponse<any>>(ENDPOINTS.ADMIN.REVENUE_REPORT, {
      params: { start_date: startDate, end_date: endDate },
    });
    return res.data;
  },
};
