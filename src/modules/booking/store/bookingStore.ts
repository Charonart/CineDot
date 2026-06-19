import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  BookingSession, 
  BookingStep, 
  PaymentMethod, 
  SelectedSeat, 
  ComboItem, 
  BookingMovieInfo, 
  BookingCinemaInfo, 
  BookingShowtimeInfo 
} from '../types';
import { 
  calculateTicketTotal, 
  calculateComboTotal, 
  calculateFinalTotal, 
  calculateVoucherDiscount 
} from '../utils/bookingCalculations';
import { findVoucherByCode } from '../data/voucherData';

function generateBookingSessionId(): string {
  return `sess-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

const isClient = typeof window !== 'undefined';

const ssrSafeSessionStorage = {
  getItem: (name: string): string | null => {
    if (!isClient) return null;
    return sessionStorage.getItem(name);
  },
  setItem: (name: string, value: string): void => {
    if (!isClient) return;
    sessionStorage.setItem(name, value);
  },
  removeItem: (name: string): void => {
    if (!isClient) return;
    sessionStorage.removeItem(name);
  }
};

const createDefaultSession = (): BookingSession => ({
  sessionId: generateBookingSessionId(),
  currentStep: 'seats',
  movie: null,
  cinema: null,
  showtime: null,
  showtimeId: null,
  seats: [],
  combos: [],
  voucherCode: undefined,
  discountAmount: 0,
  paymentMethod: undefined,
  quickComboHandled: false,
  seatHoldDurationSeconds: 600,
  ticketTotal: 0,
  comboTotal: 0,
  finalTotal: 0,
  status: 'draft',
});

function recalculateSessionTotals(session: BookingSession): BookingSession {
  const ticketTotal = calculateTicketTotal(session.seats);
  const comboTotal = calculateComboTotal(session.combos);

  let discountAmount = 0;
  if (session.voucherCode) {
    const voucher = findVoucherByCode(session.voucherCode);
    if (voucher) {
      const discountResult = calculateVoucherDiscount({
        voucher,
        subtotal: ticketTotal + comboTotal,
      });
      if (discountResult.isValid) {
        discountAmount = discountResult.discountAmount;
      }
    }
  }

  const finalTotal = calculateFinalTotal(ticketTotal, comboTotal, discountAmount);

  return {
    ...session,
    ticketTotal,
    comboTotal,
    discountAmount,
    finalTotal,
  };
}

interface BookingActions {
  initializeBooking: (payload: {
    movie: BookingMovieInfo;
    cinema: BookingCinemaInfo;
    showtime: BookingShowtimeInfo;
    showtimeId: string;
  }) => void;
  clearBookingSession: () => void;
  initOrClearIfChanged: (newShowtimeId: string) => void;
  setCurrentStep: (step: BookingStep) => void;
  setSeats: (seats: SelectedSeat[]) => void;
  addSeat: (seat: SelectedSeat) => void;
  removeSeat: (seatId: string) => void;
  clearSeats: () => void;
  addOrUpdateCombo: (combo: Omit<ComboItem, 'quantity'>, quantity: number) => void;
  removeCombo: (comboId: string) => void;
  clearCombos: () => void;
  applyVoucher: (code: string, discountAmount: number) => void;
  clearVoucher: () => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  markQuickComboHandled: () => void;
  startSeatHold: () => void;
  expireSeatHold: () => void;
  markPendingPayment: () => void;
  markPaid: () => void;
  markFailed: () => void;
  cancelBooking: () => void;
  resetBooking: () => void;
  recalculateTotals: () => void;
}

export type BookingStore = {
  session: BookingSession;
} & BookingActions;

export const useBookingStore = create<BookingStore>()(
  persist(
    (set) => ({
      session: createDefaultSession(),

      clearBookingSession: () =>
        set(() => ({
          session: createDefaultSession(),
        })),

      initOrClearIfChanged: (newShowtimeId) =>
        set((state) => {
          if (state.session.showtimeId !== newShowtimeId) {
            const cleared = createDefaultSession();
            return {
              session: {
                ...cleared,
                showtimeId: newShowtimeId,
              },
            };
          }
          return {};
        }),

      initializeBooking: (payload) =>
        set((state) => {
          const current = state.session;
          const hasChanged =
            !current.movie ||
            current.movie.slug !== payload.movie.slug ||
            !current.cinema ||
            current.cinema.name !== payload.cinema.name ||
            !current.showtime ||
            current.showtime.date !== payload.showtime.date ||
            current.showtime.time !== payload.showtime.time ||
            current.showtimeId !== payload.showtimeId ||
            current.status === 'expired';

          if (!hasChanged) {
            return {};
          }

          return {
            session: {
              ...createDefaultSession(),
              movie: payload.movie,
              cinema: payload.cinema,
              showtime: payload.showtime,
              showtimeId: payload.showtimeId,
            },
          };
        }),

      setCurrentStep: (step) =>
        set((state) => ({
          session: { ...state.session, currentStep: step },
        })),

      setSeats: (seats) =>
        set((state) => ({
          session: recalculateSessionTotals({
            ...state.session,
            seats,
          }),
        })),

      addSeat: (seat) =>
        set((state) => {
          if (state.session.seats.some((s) => s.id === seat.id)) return {};
          return {
            session: recalculateSessionTotals({
              ...state.session,
              seats: [...state.session.seats, seat],
            }),
          };
        }),

      removeSeat: (seatId) =>
        set((state) => ({
          session: recalculateSessionTotals({
            ...state.session,
            seats: state.session.seats.filter((s) => s.id !== seatId),
          }),
        })),

      clearSeats: () =>
        set((state) => ({
          session: recalculateSessionTotals({
            ...state.session,
            seats: [],
          }),
        })),

      addOrUpdateCombo: (combo, quantity) =>
        set((state) => {
          const combos = [...state.session.combos];
          const existingIdx = combos.findIndex((c) => c.id === combo.id);

          if (quantity <= 0) {
            if (existingIdx !== -1) {
              combos.splice(existingIdx, 1);
            }
          } else {
            if (existingIdx !== -1) {
              combos[existingIdx] = { ...combos[existingIdx], quantity };
            } else {
              combos.push({ ...combo, quantity });
            }
          }

          return {
            session: recalculateSessionTotals({
              ...state.session,
              combos,
            }),
          };
        }),

      removeCombo: (comboId) =>
        set((state) => ({
          session: recalculateSessionTotals({
            ...state.session,
            combos: state.session.combos.filter((c) => c.id !== comboId),
          }),
        })),

      clearCombos: () =>
        set((state) => ({
          session: recalculateSessionTotals({
            ...state.session,
            combos: [],
          }),
        })),

      applyVoucher: (code, discountAmount) =>
        set((state) => ({
          session: recalculateSessionTotals({
            ...state.session,
            voucherCode: code,
            discountAmount,
          }),
        })),

      clearVoucher: () =>
        set((state) => ({
          session: recalculateSessionTotals({
            ...state.session,
            voucherCode: undefined,
            discountAmount: 0,
          }),
        })),

      setPaymentMethod: (method) =>
        set((state) => ({
          session: { ...state.session, paymentMethod: method },
        })),

      markQuickComboHandled: () =>
        set((state) => ({
          session: { ...state.session, quickComboHandled: true },
        })),

      startSeatHold: () =>
        set((state) => {
          const now = Date.now();
          const existingExpiry = state.session.seatHoldExpiresAt;

          if (
            existingExpiry &&
            existingExpiry > now &&
            state.session.status === 'holding'
          ) {
            return {};
          }

          const durationSeconds = state.session.seatHoldDurationSeconds || 600;
          const nextSession = {
            ...state.session,
            quickComboHandled: true,
            status: 'holding' as const,
            seatHoldStartedAt: now,
            seatHoldExpiresAt: now + durationSeconds * 1000,
            seatHoldDurationSeconds: durationSeconds,
          };

          return {
            session: recalculateSessionTotals(nextSession),
          };
        }),

      expireSeatHold: () =>
        set((state) => ({
          session: {
            ...state.session,
            status: 'expired',
          },
        })),

      markPendingPayment: () =>
        set((state) => ({
          session: {
            ...state.session,
            status: 'pending-payment',
          },
        })),

      markPaid: () =>
        set((state) => ({
          session: {
            ...state.session,
            status: 'paid',
          },
        })),

      markFailed: () =>
        set((state) => ({
          session: {
            ...state.session,
            status: 'failed',
          },
        })),

      cancelBooking: () =>
        set((state) => ({
          session: {
            ...state.session,
            status: 'cancelled',
          },
        })),

      resetBooking: () =>
        set(() => ({
          session: createDefaultSession(),
        })),

      recalculateTotals: () =>
        set((state) => ({
          session: recalculateSessionTotals(state.session),
        })),
    }),
    {
      name: 'cine-current-booking-session',
      storage: createJSONStorage(() => ssrSafeSessionStorage),
    }
  )
);
