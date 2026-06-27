# CINE Color System

Hệ thống màu sắc của CINE được thiết kế để mang lại cảm giác cao cấp, nhẹ nhàng, đậm chất điện ảnh (cinematic) và tối đa hóa khả năng tập trung của người dùng vào các tác phẩm điện ảnh. 

---

## 1. Brand Colors (Màu sắc Thương hiệu)

Thương hiệu CINE sử dụng bộ ba sắc độ tím vương giả phối hợp cùng tông màu cam rực rỡ đặc trưng để dẫn dắt hành vi đặt vé của khách hàng:

*   **Accent Deep (`#7C6FE8`):** Sắc tím đậm cốt lõi đại diện cho thương hiệu. Dùng cho các tiêu đề quan trọng, trạng thái kích hoạt, liên kết hoạt động và đường viền nhấn chính.
*   **Accent Strong (`#B8AFFF`):** Sắc tím trung hòa tinh tế. Dùng cho các hiệu ứng chuyển đổi, trạng thái hover hoặc viền trang trí phụ.
*   **Primary Accent (`#CFC9EB`):** Sắc tím pastel cực nhẹ. Dùng làm nền phủ mờ khi di chuột, dải chuyển màu mượt hoặc nền đè văn bản.
*   **Booking CTA (`#FF7A1A`):** Màu cam rực rực rỡ thu hút thị giác mạnh mẽ nhất. Được dùng độc quyền cho các nút kêu gọi hành động đặt vé (Call to Action) quan trọng nhất.
*   **CTA Hover (`#F06400`):** Sắc cam đậm cháy bỏng khi người dùng di chuột qua nút CTA.

---

## 2. Light Theme Tokens (Bảng màu Giao diện Sáng)

Dưới đây là bảng định nghĩa mã token màu sắc được sử dụng trực tiếp trong mã nguồn CSS:

| CSS Variable Token | Hex Value | Usage (Cách dùng khuyến nghị) |
| :--- | :--- | :--- |
| `--color-background` | `#FEFEFE` | Nền tảng chính của trang web (trắng tinh khiết). |
| `--color-background-soft`| `#F6F6F6` | Nền phân chia khu vực phụ, nền ô nhập liệu tìm kiếm. |
| `--color-surface` | `#FFFFFF` | Bề mặt nổi của thẻ phim, bảng điều khiển, hộp thoại. |
| `--color-surface-glass` | `rgba(255, 255, 255, 0.80)` | Bề mặt phủ kính mờ kết hợp hiệu ứng backdrop-filter. |
| `--color-text-primary` | `#131413` | Chữ hiển thị chính (tiêu đề phim, đề mục, giá vé). |
| `--color-text-secondary`| `#4B4B50` | Chữ hiển thị phụ (mô tả phim, thể loại, thông số). |
| `--color-text-muted` | `#7A7A80` | Chữ ghi chú, phụ đề, nhãn trạng thái chưa hoạt động. |
| `--color-border` | `rgba(19, 20, 19, 0.08)` | Đường viền phân cách siêu mảnh, tạo khối tinh tế. |
| `--color-accent` | `#CFC9EB` | Sắc tím nhạt dùng làm nền khi hover mục menu. |
| `--color-accent-strong` | `#B8AFFF` | Sắc tím trung bình làm màu phụ hoặc viền active. |
| `--color-accent-deep` | `#7C6FE8` | Màu thương hiệu tím đậm dùng cho chữ và icon quan trọng. |
| `--color-cta` | `#FF7A1A` | Nút Đặt Vé hoặc các hành động thanh toán. |
| `--color-cta-hover` | `#F06400` | Trạng thái hover của nút Đặt Vé. |

---

## 3. Dark Theme Tokens (Bảng màu Giao diện Tối)

Khi hệ thống kích hoạt chế độ giao diện tối (Dark Mode), các biến CSS tự động đảo ngược giá trị sang các dải màu sâu thẳm sau để bảo vệ mắt người dùng trong bóng tối rạp phim:

*   `--color-background`: `#0E0F0E` (Đen tuyền điện ảnh)
*   `--color-background-soft`: `#181A18` (Đen xám than)
*   `--color-surface`: `#1C1E1C` (Bề mặt thẻ đen sẫm)
*   `--color-text-primary`: `#F3F4F3` (Chữ trắng sáng nhẹ)
*   `--color-text-secondary`: `#9A9B9F` (Chữ xám dịu)
*   `--color-border`: `rgba(255, 255, 255, 0.08)` (Đường viền mờ sáng)

---

## 4. Semantic Colors (Màu sắc Trạng thái & Ý nghĩa)

Các mã màu chỉ định cho trạng thái suất chiếu và phản hồi tương tác hệ thống:

*   **Success (`#22C55E`):** Sử dụng biểu thị suất chiếu còn nhiều ghế trống (`status: available`).
*   **Warning (`#F59E0B`):** Sử dụng biểu thị suất chiếu chỉ còn dưới 10 ghế trống (`status: almost-full`).
*   **Error (`#EF4444`):** Sử dụng biểu thị suất chiếu đã hết vé bán hoặc bị lỗi hệ thống (`status: sold-out`).
*   **Disabled (`#E5E7EB` / `opacity: 0.45`):** Sử dụng cho suất chiếu đã quá giờ hoặc tính năng chưa khả dụng (`status: past` / `status: locked`).
*   **Selected:** Màu tím Accent Deep (`#7C6FE8`) phối hợp cùng viền và chữ in đậm để làm nổi bật sự lựa chọn hiện tại của người dùng.

---

## 5. Component Color Usage (Ứng dụng cụ thể trên Thành phần)

*   **Navbar:** Dải nền kính mờ trắng trong suốt `rgba(255, 255, 255, 0.80)` kết hợp `backdrop-filter: blur(20px)`.
*   **Quick Booking Panel:** Bề mặt màu `#FFFFFF` trắng tinh khôi nổi bật trên nền xám nhạt `#F6F6F6` của dải rạp chiếu.
*   **Showtime Button:**
    *   Mặc định: Nền trắng `#FFFFFF`, viền xám nhẹ `rgba(19, 20, 19, 0.08)`.
    *   Được chọn (Selected): Nền tím nhạt `#CFC9EB` kết hợp viền tím đậm `#7C6FE8` và chữ màu `#131413`.
    *   Đã hết vé / Đã qua: Chữ và viền mờ đi, con trỏ dạng `not-allowed`.
*   **Movie Card Poster:** Đổ bóng nhẹ `box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05)` bảo đảm thẻ tách biệt hoàn hảo với nền.

---

## 6. Do / Don't
### **NÊN LÀM (DO):**
*   Luôn tham chiếu trực tiếp đến các biến CSS Token thay vì viết mã màu Hex cứng trong code.
*   Giữ sự tương phản cao độ giữa chữ và nền (tối thiểu tỷ lệ 4.5:1 đạt chuẩn WCAG AA).

### **KHÔNG ĐƯỢC LÀM (DON'T):**
*   **Không** sử dụng các màu nóng ngẫu nhiên ngoài danh mục thiết kế (như xanh ngọc, hồng cánh sen) cho các thành phần cốt lõi.
*   **Không** dùng màu đỏ của trạng thái `sold-out` làm màu nhấn thông thường để tránh gây hiểu lầm cho người dùng.
