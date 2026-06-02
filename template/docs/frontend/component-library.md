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

---

## 5. Dropdown Component System (Hệ Thống Dropdown Cao Cấp)

Thành phần nâng cấp các thẻ `<select>` mặc định của trình duyệt thành các khối Dropdown/Combobox kính mờ sang trọng, hỗ trợ đầy đủ khả năng tìm kiếm và khả năng truy cập tốt nhất.

### Tính Năng Nổi Bật:
*   **Progressive Enhancement (Tương thích ngược 100%):** Hoạt động bằng cách ẩn thẻ `<select>` gốc dưới nền. Mọi thay đổi trên custom dropdown sẽ tự động cập nhật và kích hoạt sự kiện `change` trên thẻ gốc, tương thích hoàn toàn với tất cả các script xử lý form.
*   **MutationObserver Syncing:** Tự động lắng nghe thay đổi của thẻ `<select>` gốc (khi nó bị disabled/enabled hoặc khi danh sách options được thêm mới động bằng JS) và cập nhật lại giao diện ngay lập tức mà không cần gọi hàm reload thủ công.
*   **Searchable / Combobox:** Hỗ trợ ô tìm kiếm nhanh tích hợp khi danh sách dài (độ dài > 8 options hoặc chỉ định thuộc tính `data-searchable`), đi kèm thông báo *"Không tìm thấy kết quả phù hợp"*.
*   **Full Keyboard Accessibility (Khả năng điều khiển bằng phím):**
    *   Nhấn `Tab` để lấy tiêu điểm (focus) vào nút kích hoạt (trigger).
    *   Nhấn `Space`, `Enter` hoặc `ArrowDown` khi đang focus trigger để mở menu.
    *   Nhấn `ArrowUp` / `ArrowDown` khi menu đang mở để di chuyển lựa chọn (tự động cuộn khung nhìn để giữ phần tử hiển thị).
    *   Nhấn `Enter` để chọn phần tử đang được highlight và đóng menu.
    *   Nhấn `Escape` hoặc `Tab` để đóng menu và trả tiêu điểm về nút kích hoạt.

### Cấu Trúc HTML (Tự Động Nâng Cấp):
Chỉ cần thêm thuộc tính `data-dropdown` vào thẻ `<select>` mặc định, thành phần sẽ tự động chuyển đổi thành giao diện cao cấp:
```html
<!-- Dropdown thường -->
<select id="bookDate" data-dropdown placeholder="Chọn ngày">
  <option value="1">Hôm nay</option>
  <option value="2">Ngày mai</option>
</select>

<!-- Dropdown có ô tìm kiếm (Combobox) -->
<select id="bookMovie" data-dropdown data-searchable placeholder="Chọn phim">
  <option value="1">Người Nhện: Phần 2</option>
  <option value="2">Godzilla x Kong</option>
</select>
```

### Cách Sử Dụng Trong Javascript:
```javascript
// Tự động nâng cấp tất cả các thẻ select được đánh dấu
CineDropdown.upgradeAll();

// Khởi tạo thủ công cho một select cụ thể
const myDropdown = new CineDropdown(document.getElementById('mySelect'), {
  placeholder: 'Chọn rạp chiếu',
  searchable: true,
  onChange: (value, data) => {
    console.log(`Đã chọn: ${value}`, data);
  }
});

// Thiết lập trạng thái lỗi thủ công
myDropdown.setError('Vui lòng chọn suất chiếu hợp lệ!');
// Xóa trạng thái lỗi
myDropdown.setError(null);
```

---

## 6. Navbar Dropdown System (Hệ Thống Dropdown Thanh Điều Hướng)

Thành phần nâng cấp toàn bộ hệ thống thanh điều hướng của CINE, kết hợp giữa **Phim Mega Dropdown** (Rộng rãi, hiển thị poster thẻ phim trực quan) và các **Small Dropdowns** (Danh sách mục dọc nhỏ gọn, trượt êm ái).

### Tính Năng Nổi Bật:
*   **Dynamic Data Matching:** Tự động truy vấn dữ liệu từ nguồn tập trung `CINE_MOVIES_DB` để dựng trực tiếp 4 thẻ phim thuộc mục "Đang Chiếu" và 4 thẻ phim "Sắp Chiếu", giữ nội dung đồng nhất với hệ thống.
*   **Flicker-free Hover (Desktop):** Sử dụng bộ đệm trễ `150ms` (timeout delay) khi di chuột ra ngoài để người dùng di chuyển con trỏ tự nhiên giữa liên kết menu và hộp danh sách mà không bị nhấp nháy, đóng mở đột ngột.
*   **Responsive Accordion Drawer (Mobile):** Trên các thiết bị cảm ứng nhỏ, dropdown tự động chuyển đổi thành các ngăn xếp hộp đứng (collapsible drawer). Nhấp chuột sẽ mở bung nội dung dạng xếp chồng trực quan mà không bị tràn màn hình.
*   **Accessibility Compliant (A11y):** Tích hợp đầy đủ các thuộc tính trạng thái `aria-haspopup="true"`, `aria-expanded` đóng mở động, hỗ trợ đóng nhanh tức thì bằng phím `ESC` hoặc nhấp chuột ra ngoài vùng trống.

### Cấu Trúc HTML Tiêu Chuẩn:
```html
<nav class="nav-links">
  <!-- PHIM MEGA DROPDOWN -->
  <div class="nav-item-dropdown">
    <a href="movies.html" class="nav-dropdown-trigger">Phim</a>
    <div class="dropdown-content mega-dropdown" id="dropdown-phim">
      <div class="mega-dropdown-inner">
        <!-- Đang chiếu -->
        <div class="mega-section">
          <div class="mega-section-header">
            <h2>PHIM ĐANG CHIẾU</h2>
            <a href="movies.html?category=now-showing" class="view-all-link">Xem tất cả</a>
          </div>
          <div class="mega-movies-grid" id="megaNowShowingGrid">
            <!-- Tự động kết xuất 4 cards qua JS -->
          </div>
        </div>
        <!-- Sắp chiếu -->
        <div class="mega-section">
          <div class="mega-section-header">
            <h2>PHIM SẮP CHIẾU</h2>
            <a href="movies.html?category=coming-soon" class="view-all-link">Xem tất cả</a>
          </div>
          <div class="mega-movies-grid" id="megaComingSoonGrid">
            <!-- Tự động kết xuất 4 cards qua JS -->
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- SMALL DROPDOWN (Ví dụ Star Shop) -->
  <div class="nav-item-dropdown">
    <a href="#" class="nav-dropdown-trigger">Star Shop</a>
    <div class="dropdown-content small-dropdown">
      <a href="#">Movie-verse</a>
      <a href="#">Fan Wibu</a>
      <a href="#">Inner Child</a>
    </div>
  </div>
</nav>
```


