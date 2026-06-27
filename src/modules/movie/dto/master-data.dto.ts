/**
 * Master Data DTOs
 * Khớp 100% với Postman spec (Master Data group).
 */

// ─── Province ──────────────────────────────────────────────────────────────────

/** Một tỉnh/thành phố từ GET /api/v1/provinces */
export interface ProvinceDTO {
  id: number;
  name: string;         // e.g. "TP. Hồ Chí Minh"
  code: string;         // e.g. "HCM"
  region?: string;      // e.g. "Nam" | "Bắc" | "Trung"
}

/** Response từ GET /api/v1/provinces */
export interface ProvinceListDTO {
  data: ProvinceDTO[];
}

// ─── Person ───────────────────────────────────────────────────────────────────

/** Chi tiết một diễn viên/đạo diễn từ GET /api/v1/persons/:id */
export interface PersonDTO {
  id: number;
  name: string;
  originalName?: string | null;
  biography?: string | null;
  birthday?: string | null;         // YYYY-MM-DD
  deathday?: string | null;
  placeOfBirth?: string | null;
  profileUrl?: string | null;       // ảnh đại diện
  knownForDepartment?: string;      // "Acting" | "Directing" | ...
  popularity?: number;
  tmdbId?: number | null;
}

// ─── Combo ────────────────────────────────────────────────────────────────────

/** Một combo bắp nước từ GET /api/v1/combos */
export interface ComboDTO {
  id: number;
  name: string;          // e.g. "Combo 1: 1 Bắp + 1 Nước"
  description?: string | null;
  price: number;         // VND
  imageUrl?: string | null;
  isAvailable: boolean;
}

/** Response từ GET /api/v1/combos */
export interface ComboListDTO {
  data: ComboDTO[];
}
