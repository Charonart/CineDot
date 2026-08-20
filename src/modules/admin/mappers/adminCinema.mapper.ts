import {
  AdminCinemaItemDTO,
  AdminRoomItemDTO,
  SeatMatrixItemDTO,
  ProvinceItemDTO,
} from '../dto/adminCinema.dto';
import {
  AdminCinemaItem,
  AdminRoomItem,
  AdminSeatItem,
  SeatType,
  ProvinceOption,
} from '../types/adminCinema.types';

const FORMAT_TO_TYPE: Record<string, string> = {
  'IMAX 3D Laser': 'IMAX',
  '4DX Motion': '4DX',
  'VIP Gold Class': 'GOLD_CLASS',
  '3D Experience': '3D',
  '2D Standard': '2D',
};

const TYPE_TO_FORMAT: Record<string, string> = {
  IMAX: 'IMAX 3D Laser',
  '4DX': '4DX Motion',
  GOLD_CLASS: 'VIP Gold Class',
  '3D': '3D Experience',
  '2D': '2D Standard',
};

const DEFAULT_ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const COLS_PER_ROW = 12;
const SEAT_SIZE = 34;
const SEAT_GAP = 42;

export const adminCinemaMapper = {
  formatToRoomType(format: string): string {
    return FORMAT_TO_TYPE[format] || '2D';
  },

  roomTypeToFormat(roomType?: string): string {
    if (!roomType) return '2D Standard';
    return TYPE_TO_FORMAT[roomType.toUpperCase()] || roomType;
  },

  seatTypeToDomain(rawType?: string): SeatType {
    if (!rawType) return 'STANDARD';
    const t = rawType.toUpperCase();
    if (t === 'REGULAR' || t === 'STD') return 'STANDARD';
    return t;
  },

  seatTypeToBackend(type: SeatType): string {
    if (!type) return 'standard';
    const t = type.toUpperCase();
    if (t === 'REGULAR' || t === 'STD') return 'standard';
    return type.toLowerCase();
  },

  /**
   * Sinh ma trận ghế mặc định có tọa độ cx, cy khi phòng chưa có seat_matrix
   */
  generateDefaultSeats(): AdminSeatItem[] {
    const seats: AdminSeatItem[] = [];
    const startX = 40;
    const startY = 40;

    DEFAULT_ROWS.forEach((row, rowIdx) => {
      for (let c = 1; c <= COLS_PER_ROW; c++) {
        const seatId = `${row}${c < 10 ? '0' + c : c}`;
        let seatType: SeatType = 'REGULAR';
        if (row === 'E' || row === 'F' || row === 'G') {
          seatType = 'VIP';
        } else if (row === 'H') {
          seatType = 'SWEETBOX';
        }

        const cx = startX + (c - 1) * SEAT_GAP;
        const cy = startY + rowIdx * (SEAT_SIZE + 16);

        seats.push({
          id: seatId,
          row,
          number: c,
          type: seatType,
          cx,
          cy,
          angle: 0,
        });
      }
    });

    return seats;
  },

  roomToDomain(dto: AdminRoomItemDTO, cinemaId = 0): AdminRoomItem {
    let rawMatrix = dto.seat_matrix;
    if (typeof rawMatrix === 'string') {
      try {
        rawMatrix = JSON.parse(rawMatrix);
      } catch {
        rawMatrix = [];
      }
    }

    let seats: AdminSeatItem[] = [];

    if (Array.isArray(rawMatrix) && rawMatrix.length > 0) {
      seats = rawMatrix.map((s, idx) => {
        const rawSeatId = s.seat_id ? String(s.seat_id).trim() : '';
        const row = (
          s.row_name ||
          s.row ||
          (rawSeatId ? rawSeatId.replace(/[0-9]/g, '') : '') ||
          String.fromCharCode(65 + Math.floor(idx / 12))
        ).toUpperCase();

        const rawNum =
          s.seat_number ??
          s.number ??
          (rawSeatId ? parseInt(rawSeatId.replace(/[^0-9]/g, ''), 10) : null);
        const num = typeof rawNum === 'number' && !isNaN(rawNum) ? rawNum : (idx % 12) + 1;
        const seatId = `${row}${num < 10 ? '0' + num : num}`;

        const cx = typeof s.cx === 'number' ? s.cx : 40 + ((num - 1) % 12) * SEAT_GAP;
        const cy = typeof s.cy === 'number' ? s.cy : 40 + Math.floor(idx / 12) * (SEAT_SIZE + 15);
        const angle = typeof s.angle === 'number' ? s.angle : 0;

        return {
          id: seatId,
          row,
          number: num,
          type: adminCinemaMapper.seatTypeToDomain(s.type || s.seat_type),
          cx: Math.round(cx),
          cy: Math.round(cy),
          angle: Math.round(angle),
        };
      });
    } else {
      seats = adminCinemaMapper.generateDefaultSeats();
    }

    const format = adminCinemaMapper.roomTypeToFormat(dto.room_type);
    const roomType = dto.room_type || adminCinemaMapper.formatToRoomType(format);

    return {
      id: Number(dto.room_id || dto.id || 0),
      cinemaId: Number(dto.cinema_id || cinemaId || 0),
      name: dto.room_name || 'Phòng chiếu',
      format,
      roomType,
      status: dto.is_active !== false ? 'ACTIVE' : 'MAINTENANCE',
      totalSeats: Number(dto.total_seats || seats.length),
      seats,
    };
  },

  cinemaToDomain(dto: AdminCinemaItemDTO, provincesMap?: Record<number, string>): AdminCinemaItem {
    const cinemaId = Number(dto.cinema_id || dto.id || 0);
    const provId = dto.province_id ? Number(dto.province_id) : undefined;

    let cityName = '';
    if (typeof dto.province === 'string') {
      cityName = dto.province;
    } else if (dto.province && typeof dto.province === 'object') {
      cityName = (dto.province as { province_name?: string; name?: string }).province_name ||
        (dto.province as { province_name?: string; name?: string }).name ||
        '';
    }
    if (!cityName && provId && provincesMap) {
      cityName = provincesMap[provId] || '';
    }

    const rawRooms = Array.isArray(dto.rooms) ? dto.rooms : [];
    const rooms = rawRooms.map((r) => adminCinemaMapper.roomToDomain(r, cinemaId));

    return {
      id: cinemaId,
      name: dto.cinema_name || dto.name || 'Cụm Rạp CineDot',
      slug: dto.slug || '',
      address: dto.cinema_address || dto.address || 'Đang cập nhật địa chỉ',
      provinceId: provId,
      city: cityName || 'Chưa cập nhật tỉnh',
      phone: dto.phone || '',
      email: dto.email || '',
      description: dto.description || '',
      image: undefined,
      isActive: dto.is_active !== false,
      totalScreens: rooms.length,
      rooms,
    };
  },

  seatsToMatrixPayload(seats: AdminSeatItem[]): SeatMatrixItemDTO[] {
    return seats.map((s) => ({
      seat_id: s.id,
      row_name: s.row,
      seat_number: s.number,
      type: adminCinemaMapper.seatTypeToBackend(s.type),
      cx: s.cx,
      cy: s.cy,
      angle: s.angle,
    }));
  },

  provinceToDomain(dto: ProvinceItemDTO | Record<string, unknown>): ProvinceOption {
    const rawDto = dto as { province_id?: number | string; id?: number | string; province_name?: string; name?: string; slug?: string };
    return {
      id: Number(rawDto.province_id || rawDto.id || 0),
      name: String(rawDto.province_name || rawDto.name || 'Tỉnh / Thành phố'),
      slug: rawDto.slug || '',
    };
  },
};
