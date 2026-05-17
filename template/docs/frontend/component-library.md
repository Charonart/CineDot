# Thư Viện Thành Phần CINE (CINE Component Library)

Tài liệu này chi tiết cách tích hợp, cấu trúc mã nguồn và hành vi cơ học của 4 thành phần giao diện cao cấp được chuyển đổi từ React sang Vanilla JS/CSS cho hệ thống **CINE**.

---

## 1. Highlight Text (Chữ Điểm Nhấn Động)

Thành phần tạo các điểm nhấn hoạt họa vẽ tay nghệ thuật bao quanh hoặc bên dưới chữ, tăng tính thẩm mỹ biên tập (editorial layout).

### Cấu Trúc HTML:
```html
<span class="highlight-text" data-variant="underline" data-color="primary">
  Trải nghiệm điện ảnh cao cấp
</span>
```

### Các Thuộc Tính (Attributes):
* `data-variant`:
  * `underline` (Mặc định): Đường gạch chân uốn lượn phong cách vẽ tay.
  * `box`: Hộp chữ nhật thô sơ bao quanh chữ.
  * `circle`: Hình elip vẽ tay bao quanh chữ.
  * `marker`: Vệt dạ quang highlight nền mờ.
* `data-color`:
  * `primary` (Mặc định): Màu điểm nhấn mạnh (`--accent-strong`).
  * `secondary`: Màu chữ chính (`--text`).
  * `accent`: Màu `#CFC9EB` soft pastel.
  * `destructive`: Màu cảnh báo đỏ cam `#FF5A5F`.
* `data-stroke-width`: Độ dày nét vẽ (mặc định là `2`).

### Cơ Chế Hoạt Động:
* Lớp JS (`highlight-text.js`) sử dụng một `ResizeObserver` để đo đạc chính xác kích thước vùng chứa chữ.
* Sau đó, nó tự động dựng một thẻ `<svg>` và chèn đường dẫn hình học (`path`) tương ứng với kích thước chữ thực tế.
* Nhờ vào `IntersectionObserver`, khi khối chữ hiển thị 50% trong tầm nhìn người dùng, lớp CSS (`highlight-text.css`) sẽ chạy chuyển động quét bằng cách kéo `stroke-dashoffset` về `0`.

---

## 2. Scroll Text (Chuyển Động Cuộn Chữ)

Hiệu ứng chuyển động mượt mà khi người dùng cuộn trang giúp các tiêu đề xuất hiện một cách chuyên nghiệp.

### Cấu Trúc HTML:
```html
<h2 class="section-title scroll-text-slide-left">Phim <em>Đang Chiếu</em></h2>
```

### Cơ Chế Hoạt Động:
* CSS đặt trạng thái ban đầu của thẻ là ẩn (`opacity: 0`) và dịch chuyển ngang lệch một góc nghiêng (`transform: translateX(100px) skewX(4deg)`).
* `scroll-text.js` sử dụng `IntersectionObserver` để phát hiện phần tử xuất hiện trong khung nhìn.
* Khi phần tử vào tầm mắt, lớp `.in-view` được kích hoạt giúp phần tử trượt sang trái và mờ dần xuất hiện sắc nét trong thời gian `1.2s` với hàm bezier mượt mà.
* **Tối ưu khả năng truy cập (Accessibility)**: Tự động tắt hiệu ứng chuyển động nghiêng/trượt nếu người dùng bật chế độ giảm chuyển động (`prefers-reduced-motion: reduce`) trong hệ điều hành, đảm bảo an toàn tuyệt đối.

---

## 3. Segmented Button — Theme Selector (Chuyển Đổi Giao Diện)

Thành phần chuyển đổi nhanh chế độ giao diện (Light/Dark/System) dạng các hạt thuốc kính mờ trượt lướt cực sang trọng.

### Cấu Trúc HTML (Tự Động Inject):
```html
<div class="theme-selector-container">
  <div class="theme-selector-slider"></div>
  <button class="theme-tab-btn" data-theme-val="light">☀️</button>
  <button class="theme-tab-btn" data-theme-val="dark">🌙</button>
  <button class="theme-tab-btn" data-theme-val="system">🖥️</button>
</div>
```

### Cơ Chế Hoạt Động:
* Lớp JS tự động chèn bộ chọn vào đầu thanh điều hướng (`.nav-actions`) của cả trang chủ và trang chi tiết.
* Lựa chọn của người dùng được lưu trữ lâu dài trong `localStorage` với khóa `cine-theme`.
* Khi thay đổi, nền pill (`.theme-selector-slider`) sẽ trượt sang nút được chọn qua hiệu ứng `transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)`.
* Hệ thống màu nền sẽ đồng loạt thay đổi mượt mà nhờ việc áp dụng CSS variables đồng nhất.

---

## 4. Cinematic Video Player (Trình Phát Video Điện Ảnh)

Thay thế hoàn toàn trình phát mặc định thô sơ thành trình phát mang đậm tính điện ảnh thương hiệu CINE.

### Cấu Trúc HTML:
```html
<div class="cine-video-player" 
     data-src="assets/videos/trailer.mp4" 
     data-poster="assets/images/poster.jpg" 
     data-title="Tên Phim">
</div>
```

### Các Tính Năng Cao Cấp Tích Hợp:
* **Custom Control Bar**: Thanh điều khiển kính mờ sang trọng tự ẩn sau `3s` nếu không di chuột.
* **Smart Progress Timeline**: Hỗ trợ xem vạch tải đệm (buffered) và kéo thả chấm scrubber để tua video mượt mà.
* **Volume Slider**: Thanh trượt điều chỉnh âm lượng dạng trượt thu gọn (hover để mở rộng).
* **Double-tap Actions**: Click đúp vào nửa trái để tua lùi 10 giây, click đúp vào nửa phải để tua tiến 10 giây.
* **Smart Modal Closing**: Khi đóng modal chứa phim, trình phát sẽ tự động tạm dừng phát âm thanh ngay lập tức, ngăn âm thanh phát ngầm gây khó chịu cho khách hàng.
