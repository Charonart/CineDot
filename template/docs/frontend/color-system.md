# Hệ Thống Màu CINE (CINE Color System)

Tài liệu này cung cấp chi tiết về **Hệ thống màu sắc (Color Design Tokens)** của nền tảng đặt vé xem phim CINE/CINEDOT. Được thiết kế theo phong cách tối giản cao cấp (premium minimal) lấy cảm hứng từ Apple TV+, kết hợp sắc độ điện ảnh của Netflix và trải nghiệm trực quan sống động của IMAX.

---

## 1. Mục Tiêu Thiết Kế (Purpose)

Hệ thống màu sắc CINE được xây dựng nhằm đạt được các mục tiêu sau:
*   **Tính Đồng Nhất (Consistency):** Loại bỏ việc lạm dụng mã màu hex tự do (hardcoded color) trong mã nguồn, đảm bảo giao diện đồng bộ trên mọi thành phần (components).
*   **Trải Nghiệm Điện Ảnh (Premium Cinematic UX):** Sử dụng các gam màu trung tính sang trọng, hạn chế màu neon sặc sỡ, tăng cường hiệu ứng kính mờ (glassmorphism) và ánh sáng dịu nhẹ (soft glowing effects).
*   **Hỗ Trợ Đa Chế Độ (Multi-theme Ready):** Định nghĩa rõ cấu trúc CSS Variables để dễ dàng chuyển đổi mượt mà giữa chế độ Sáng (Light Mode) và Tối (Dark Mode).
*   **Tối Ưu Giao Dịch (High Conversion CTA):** Sử dụng màu cam điện ảnh (`Cinema Action`) nổi bật và riêng biệt cho các nút bấm đặt vé, kêu gọi hành động (CTA) quan trọng.

---

## 2. Bảng Màu Thương Hiệu (Brand Palette)

Dưới đây là các màu cốt lõi định hình nhận diện của CINE:

| Tên Màu | Mã HEX | Vai Trò trong Thiết Kế |
| :--- | :--- | :--- |
| **Accent Soft** | `#CFC9EB` | Làm nổi bật nhẹ nhàng, trạng thái Hover, đường phân tách tinh tế |
| **Accent Strong** | `#B8AFFF` | Tông màu tím thương hiệu chủ đạo, trạng thái Active, Selected |
| **Accent Deep** | `#7C6FE8` | Màu tím đậm tạo chiều sâu, bóng đổ cao cấp, đường viền tương tác |
| **Cinema Action (CTA)**| `#FF7A1A` | Nút bấm đặt vé chính, CTA kêu gọi hành động quan trọng |
| **CTA Hover** | `#F06400` | Trạng thái Hover của nút đặt vé chính |

---

## 3. Thiết Lập Chế Độ Sáng (Light Theme Tokens)

Được thiết kế theo phong cách sáng tinh tế, nhẹ nhàng và phản quang tốt:

```css
--color-background: #FEFEFE;        /* Nền trang chính */
--color-background-soft: #F6F6F6;   /* Nền phụ, các phân đoạn xen kẽ */
--color-surface: #FFFFFF;           /* Nền thẻ card, ô tìm kiếm, bảng điều khiển */
--color-surface-muted: #F2F2F3;     /* Nền của các phần tử vô hiệu hóa hoặc tắt */
--color-surface-glass: rgba(255, 255, 255, 0.65); /* Kính mờ cao cấp kết hợp blur */

--color-text-primary: #131413;      /* Văn bản chính (Tiêu đề, thông tin cốt lõi) */
--color-text-secondary: #4B4B50;    /* Văn bản phụ (Mô tả ngắn, nhãn nhỏ) */
--color-text-muted: #7A7A80;        /* Văn bản bị mờ (Chú thích, ngày tháng) */

--color-border: rgba(19, 20, 19, 0.08); /* Đường viền siêu nhẹ */
--color-shadow: rgba(17, 17, 17, 0.08); /* Bóng đổ mềm */
```

---

## 4. Thiết Lập Chế Độ Tối (Dark Theme Tokens)

Mang phong cách rạp chiếu phim đêm tối sâu thẳm, giảm thiểu mỏi mắt:

```css
--color-background: #0B0C0B;        /* Nền đen sâu điện ảnh */
--color-background-soft: #141514;   /* Nền xám đen phụ */
--color-surface: #1B1C1B;           /* Nền thẻ card tối */
--color-surface-muted: #242524;     /* Nền xám đen vô hiệu hóa */
--color-surface-glass: rgba(15, 15, 15, 0.75); /* Kính mờ đen bóng */

--color-text-primary: #F5F5F7;      /* Chữ sáng nổi bật */
--color-text-secondary: #A1A1A6;    /* Chữ phụ xám */
--color-text-muted: #6E6E73;        /* Chữ mờ tối */

--color-border: rgba(255, 255, 255, 0.12); /* Viền sáng bán trong suốt */
--color-shadow: rgba(0, 0, 0, 0.35); /* Bóng đổ tối đậm */
```

---

## 5. Màu Chỉ Định Nghiệp Vụ (Semantic Colors)

Dành cho các trạng thái thông báo và trạng thái ghế ngồi trong sơ đồ phòng chiếu:

*   🟢 **Success / Available Seat (Còn Ghế):** `#22C55E` - Trạng thái thành công, ghế trống sẵn sàng đặt.
*   🟡 **Warning / Almost Full (Sắp Cháy Vé):** `#F59E0B` - Trạng thái cảnh báo, suất chiếu gần đầy ghế.
*   🔴 **Error / Sold Out (Hết Vé):** `#EF4444` / `#9CA3AF` - Trạng thái lỗi, ghế đã có người đặt, suất chiếu đã bán hết.
*   🔵 **Info (Thông Tin):** `#3B82F6` - Tin tức, chỉ dẫn kỹ thuật.
*   🟣 **Selected Seat (Ghế Đang Chọn):** `#B8AFFF` - Ghế người dùng đang chọn trong phiên.

---

## 6. Sơ Đồ Áp Dụng Màu Theo Thành Phần (Component Usage Map)

| Thành phần UI | Vai trò thiết kế | CSS Variable áp dụng |
| :--- | :--- | :--- |
| **Navbar** | Nền thanh điều hướng kính mờ | `var(--color-surface-glass)` |
| | Logo thương hiệu | `var(--color-text-primary)` |
| | Đường phân tách dưới | `var(--color-border)` |
| **Hero Slide** | Lớp phủ làm tối poster | `linear-gradient` chuyển tiếp sang tối |
| | Huy hiệu trạng thái động | Viền: `var(--color-accent-strong)`, Nền: `rgba(184, 175, 255, 0.2)` |
| **Quick Booking** | Nền bảng đặt vé nhanh | `var(--color-surface-glass)` |
| | Nhãn các trường nhập liệu | `var(--color-text-muted)` |
| | Trạng thái đang focus | Label & Border đổi sang: `var(--color-accent-deep)` |
| | Nút Đặt Vé Nhanh | `var(--color-cta)` |
| **Movie Card** | Tiêu đề phim | `var(--color-text-primary)` |
| | Nút xem Trailer | `var(--color-surface-glass)` trên nền đen |
| **Showtime Schedule**| Thẻ ngày đang chọn (Active) | Nền: `var(--color-surface)`, Chữ: `var(--color-accent-deep)` |
| | Suất chiếu sẵn sàng | Chữ: `var(--color-text-primary)`, Viền: `var(--color-border)` |
| | Suất chiếu sắp đầy | Nhãn cảnh báo: `var(--color-warning)` |
| | Suất chiếu hết vé | Mờ hẳn đi (`opacity: 0.4`), Nền: `var(--color-surface-muted)` |
| **Search Modal** | Ô nhập từ khóa | Nền: `var(--color-background-soft)`, Chữ: `var(--color-text-primary)` |
| **Footer** | Nền chân trang | `var(--color-background-soft)` |

---

## 7. Nguyên Tắc Do / Don't (Do's & Don'ts)

*   ✅ **NÊN (DO):**
    *   Luôn sử dụng biến CSS chính thức (ví dụ: `color: var(--color-text-primary)`) thay vì viết mã màu Hex thủ công.
    *   Sử dụng màu cam `var(--color-cta)` cho các phần tử nút đặt vé chính để tối ưu tỷ lệ chuyển đổi.
    *   Giữ hiệu ứng chuyển đổi mượt mà (`transition: var(--transition)`) khi hover đổi màu nền hoặc viền.
*   ❌ **KHÔNG NÊN (DON'T):**
    *   Không tự ý đưa các màu sắc ngẫu nhiên nằm ngoài hệ thống Design Token vào code.
    *   Không lạm dụng quá nhiều hiệu ứng đổ bóng sặc sỡ hoặc màu nền quá nổi trong chế độ tối.
    *   Không thay đổi màu sắc của hệ thống thông báo trạng thái đặt vé (Available, Selected, Sold Out) một cách tùy tiện.

---

## 8. Ví Dụ Sử Dụng Trong Code (Developer Usage Example)

### Cách khai báo trong CSS:
```css
/* Thẻ card phim cao cấp */
.movie-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}

.movie-card:hover {
  border-color: var(--color-accent-strong);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

/* Nút đặt vé chính (High Conversion CTA) */
.btn-book-ticket {
  background: var(--color-cta);
  color: #FFFFFF;
  font-weight: 600;
  transition: var(--transition);
}

.btn-book-ticket:hover {
  background: var(--color-cta-hover);
  box-shadow: 0 0 0 4px rgba(255, 122, 26, 0.25);
}
```

### Cách áp dụng tương thích ngược (Backward Compatibility):
Các biến nguyên bản của dự án (`--bg`, `--bg2`, `--text`, `--text2`, `--muted`, `--accent`, `--accent-strong`, `--border`, `--glass`) đã được ánh xạ (alias) trực tiếp sang hệ thống token mới, nên các nhà phát triển không lo ngại việc thay đổi biến làm vỡ giao diện cũ.
