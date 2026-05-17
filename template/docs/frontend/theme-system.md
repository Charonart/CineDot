# Hệ Thống Chuyển Đổi Giao Diện CINE (CINE Theme System)

Dự án **CINE** sở hữu hệ thống giao diện kép (Dual-Theme System) hỗ trợ chuyển đổi mượt mà giữa chế độ sáng và chế độ tối sang trọng dựa trên các biến số CSS (CSS Custom Variables) đồng nhất.

---

## 1. Lưu Trữ & Trạng Thái Hệ Thống (Storage & Initialization)

* Lựa chọn của người dùng được lưu trữ trong trình duyệt thông qua `localStorage` dưới khóa `cine-theme`.
* **3 Chế Độ Được Hỗ Trợ**:
  1. `light`: Cố định giao diện Sáng cao cấp.
  2. `dark`: Cố định giao diện Tối rạp chiếu huyền bí.
  3. `system` (Mặc định): Tự động đồng bộ theo cấu hình của Hệ điều hành (Windows, macOS, iOS, Android).
* **Tránh Hiện Tượng Nháy Giao Diện (Flash Prevention)**:
  Tập tin script `theme-selector.js` sử dụng mô hình tự thực thi (Self-Executing IIFE) chạy ngay lập tức khi tải trang để gán thuộc tính `data-theme` trước khi trình duyệt vẽ giao diện lên màn hình.

---

## 2. Áp Dụng Thuộc Tính CSS (Theme Tokens)

Toàn bộ các thành phần trong giao diện CINE đều sử dụng các biến số CSS dưới đây:

### Phân Bổ Biến Màu Sáng (:root):
```css
:root {
  --bg: #FEFEFE;
  --bg2: #F6F6F6;
  --text: #131413;
  --text2: #4B4B50;
  --muted: #7A7A80;
  --accent: #CFC9EB;
  --accent-strong: #B8AFFF;
  --border: rgba(19, 20, 19, 0.08);
  --glass: rgba(255, 255, 255, 0.65);
}
```

### Phân Bổ Biến Màu Tối ([data-theme="dark"]):
```css
[data-theme="dark"] {
  --bg: #0B0C0B;
  --bg2: #141514;
  --text: #F5F5F7;
  --text2: #A1A1A6;
  --muted: #6E6E73;
  --accent: #26213D;
  --accent-strong: #453F78;
  --border: rgba(255, 255, 255, 0.12);
  --glass: rgba(15, 15, 15, 0.75);
}
```

---

## 3. Quy Tắc Phát Triển Lớp Tiện Ích Tối (Dark Utility Classes)

Khi phát triển thêm tính năng mới hoặc tinh chỉnh giao diện, hãy luôn tuân thủ các quy tắc sau để đảm bảo giao diện tối hoạt động hoàn hảo:

1. **Tuyệt đối không dùng màu tĩnh cố định**: Tránh viết `color: #000` hoặc `background: #fff`. Hãy luôn sử dụng `color: var(--text)` và `background: var(--bg)`.
2. **Kính mờ cao cấp**: Tận dụng hiệu ứng kính mờ `background: var(--glass)` phối hợp cùng `backdrop-filter: blur(16px)` để giao diện nổi bật trên cả nền tối và sáng.
3. **Màu đường viền**: Viền phải luôn sử dụng `border: 1px solid var(--border)`, hệ thống sẽ tự chuyển từ viền tối bán trong suốt (sáng) sang viền sáng bán trong suốt (tối) vô cùng nhẹ nhàng.
