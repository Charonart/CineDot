export interface SeatItem {
  id: string; // e.g. "A-1"
  row: string; // e.g. "A"
  number: number; // e.g. 1
  type: 'standard' | 'vip' | 'couple';
  status: 'available' | 'sold' | 'locked';
  price: number;
  label: string; // e.g. "A1" or "Couple J1-J2"
}

export interface BookingSession {
  movieTitle: string;
  movieSlug: string;
  cinemaName: string;
  roomName: string;
  showDate: string;
  showTime: string;
  format: string;
  runtime: number;
  seats: SeatItem[];
}

export const MOVIE_MOCK_DETAILS: Record<string, { title: string; runtime: number; poster: string }> = {
  'dune-part-two': {
    title: 'Dune: Cát Song - Phần Hai',
    runtime: 166,
    poster: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&q=80',
  },
  'godzilla-x-kong': {
    title: 'Godzilla x Kong: Đế Chế Mới',
    runtime: 115,
    poster: 'https://images.unsplash.com/photo-1620421680010-0766ff230392?w=400&q=80',
  },
  'furiosa': {
    title: 'Furiosa: Câu Chuyện Từ Max Điên',
    runtime: 148,
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&q=80',
  },
};

// Generates simulated seats database for a show session
export const generateSeatGrid = (): SeatItem[] => {
  const seats: SeatItem[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J']; // A-E standard, F-H VIP, J couple

  // Standard Standard Seats: 120,000 VND
  // VIP Seats: 150,000 VND
  // Couple Seats: 300,000 VND

  rows.forEach((row) => {
    if (row === 'J') {
      // Row J is Couple: 6 capsule seats representing J1-J2, J3-J4, J5-J6, J7-J8, J9-J10, J11-J12
      for (let num = 1; num <= 6; num++) {
        const firstNum = (num - 1) * 2 + 1;
        const secondNum = firstNum + 1;
        
        // Randomize mock status for sold and locked
        let status: SeatItem['status'] = 'available';
        if (num === 2) status = 'sold';
        if (num === 5) status = 'locked';

        seats.push({
          id: `J-${num}`,
          row: 'J',
          number: num,
          type: 'couple',
          status,
          price: 300000,
          label: `J${firstNum}-J${secondNum}`,
        });
      }
    } else {
      // Standard rows: 12 seats per row
      const isVip = ['F', 'G', 'H'].includes(row);
      const price = isVip ? 150000 : 120000;
      const type = isVip ? 'vip' : 'standard';

      for (let num = 1; num <= 12; num++) {
        let status: SeatItem['status'] = 'available';
        
        // Scatter some sold/locked seats to mock real visual booking map
        if ((row === 'A' && num === 5) || (row === 'C' && num === 6) || (row === 'F' && num === 4) || (row === 'G' && num === 7) || (row === 'H' && num === 8)) {
          status = 'sold';
        } else if ((row === 'B' && num === 11) || (row === 'F' && num === 9)) {
          status = 'locked';
        }

        seats.push({
          id: `${row}-${num}`,
          row,
          number: num,
          type,
          status,
          price,
          label: `${row}${num}`,
        });
      }
    }
  });

  return seats;
};
