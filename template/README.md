# CINE - Premium Movie Booking Platform

Dự án CINE là một hệ thống đặt vé xem phim với thiết kế cao cấp (Premium light-mode cinematic UI), lấy cảm hứng từ Apple TV+, Netflix và Galaxy Cinema. Hệ thống được xây dựng trên nền tảng **Vanilla HTML/CSS/JS** tinh gọn nhưng tích hợp hệ sinh thái phát triển hiện đại.

---

## 📦 Các Thư Viện Đã Cài Đặt (Dependencies)

Mặc dù UI chạy hoàn toàn bằng Vanilla JS và CSS để tối ưu tốc độ, dự án vẫn sử dụng môi trường Node.js (NPM) và TypeScript để quản lý các Source Components gốc (nhằm mục đích đồng bộ thiết kế và mở rộng sau này). 

Các thư viện đã được cài đặt (`package.json`):
- **React & React DOM**: `react`, `react-dom`
- **TypeScript**: `typescript`, `@types/react`, `@types/react-dom`, `@types/node`
- **Icon**: `lucide-react` (Bộ icon chuẩn)
- **Animation**: `framer-motion` (Cho các hiệu ứng phức tạp trên bản Source)
- **Tiện ích Class**: `clsx`, `tailwind-merge` (Xử lý chuỗi class động giống hệ sinh thái Shadcn UI)

> **Lưu ý**: Các file `.tsx` trong thư mục `templates/source-components/` là tài liệu thiết kế chuẩn. Code chạy thực tế đã được chuyển đổi (compile) sang Vanilla JS/CSS tại thư mục `assets/js/components/` và `assets/css/components/`.

---

## 🚀 Tổng Quan Công Việc Đã Thực Hiện

### 1. Xây Dựng Kiến Trúc & Cấu Hình Môi Trường
- Thiết lập thành công NPM, `tsconfig.json` và xử lý triệt để các lỗi alias đường dẫn (`@/*`).
- Viết file tiện ích `lib/utils.ts` (hàm `cn`) để hỗ trợ phát triển Component UI.
- Tổ chức lại cấu trúc thư mục rõ ràng giữa Source React (Reference) và Production Vanilla.
- Xây dựng bộ tài liệu hệ thống (`docs/frontend/`).

### 2. Tích Hợp Components Cao Cấp (Vanilla JS)
Toàn bộ các component premium đã được viết lại thành các bản Vanilla độc lập, không phụ thuộc framework nhưng vẫn giữ nguyên trải nghiệm mượt mà:
- **HighlightText**: Hiệu ứng vẽ tay SVG động tự động kích hoạt khi cuộn tới.
- **ScrollText**: Hiệu ứng chữ trượt ngang mượt mà.
- **Theme Selector**: Nút chuyển Giao diện Sáng/Tối với phong cách kính mờ (Glassmorphism).
- **Cinematic Video Player**: Trình phát phim nhúng trong Modal chuyên nghiệp.

### 3. Tinh Chỉnh Bố Cục UI/UX (Layout Fixes)
- **Cấu trúc Hero (Trang chủ)**: 
  - Bọc lại toàn bộ nội dung Hero thành chuẩn `hero-slider > hero-slide > hero-content`, sẵn sàng để mở rộng thành Carousel/Slider trong tương lai.
  - Sửa lỗi đè layout của thanh Đặt vé nhanh (Quick Booking Panel) bằng cách tinh chỉnh margin/padding hợp lý.
- **Trang Chi Tiết Phim**:
  - Dọn dẹp giao diện: Xóa bỏ nhãn "IMAX 2D" bị thừa trên poster, xóa bỏ khu vực "ĐỊNH DẠNG PHIM" lặp lại ở cuối trang.
  - Sửa lỗi nút Play Trailer: Áp dụng phương pháp bọc `trailer-play-wrapper` (căn giữa tuyệt đối) và scale nút bên trong để sửa hoàn toàn lỗi giật/trượt nút khi hover.
- **Kiểm soát Typography**:
  - Đặt lại chuẩn xác các thẻ `HighlightText` vào các tiêu đề chính: *Khám phá Phim, Nội dung phim, Lịch chiếu, Phim đang chiếu*.
  - Bổ sung Tagline thương hiệu (*"Đặt vé nhanh. Xem phim hay. Trải nghiệm điện ảnh cao cấp."*) vào Hero và Footer.
- **Bổ sung UI nhỏ**: Thêm nút "Xem thêm" căn giữa dưới mục Phim đang chiếu và đổi icon của nút Đặt vé sang hình chiếc vé (Ticket).

---

## 🛠️ Hướng Dẫn Phát Triển

- Các chỉnh sửa HTML/CSS tĩnh thực hiện trực tiếp vào `index.html`, `movie-detail.html` và `styles.css`.
- Nếu có yêu cầu nâng cấp logic component, vui lòng tham khảo file `COMPONENT.doc` và các file thiết kế `.tsx` trong `templates/source-components/` trước khi áp dụng vào Vanilla JS.
