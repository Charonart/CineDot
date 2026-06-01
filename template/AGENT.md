# CINE — Development Guidelines & Reference Standards

Chào mừng bạn đến với tài liệu kỹ thuật dành cho dự án **CINE (CINEDOT)**. Tài liệu này cung cấp các nguyên tắc thiết kế, hướng dẫn phát triển và tài liệu tham khảo cho các thành phần (components) tái sử dụng.

---

## 1. Nguyên Tắc Thiết Kế (Design Principles)

Giao diện của CINE được định hình bởi sự kết hợp tinh tế giữa sự tối giản cao cấp của **Apple TV+**, chiều sâu điện ảnh của **Netflix** và cảm giác nhập vai hoành tráng của **IMAX**:
* **Glassmorphism**: Sử dụng hiệu ứng nền kính mờ sang trọng (`backdrop-filter: blur(16px)`) kết hợp với viền trắng bán trong suốt để tạo chiều sâu trực quan.
* **Harmonious Palette**: Tuyệt đối không sử dụng các màu cơ bản thuần túy hoặc màu neon thô sơ. Toàn bộ mã nguồn phải tuân thủ nghiêm ngặt hệ thống **Design Tokens** chính thức (xem chi tiết tại [color-system.md](file:///c:/DATN_learn/TESTUI/docs/frontend/color-system.md)):
  * **Hệ thống biến CSS**: Luôn sử dụng `var(--color-...)` cho màu nền, chữ, viền và bóng đổ.
  * **Màu tím thương hiệu**: `var(--color-accent)` và `var(--color-accent-strong)` dùng cho các highlights, trạng thái đang chọn (selected) hoặc hiệu ứng cao cấp.
  * **Cinema Action (CTA)**: Nút mua vé hoặc đặt suất chiếu bắt buộc sử dụng màu cam hành động `var(--color-cta)` để kích thích chuyển đổi giao dịch.
  * **Màu chỉ định nghiệp vụ (Semantic)**: Sử dụng chuẩn xác màu xanh lá (`--color-success`) cho ghế trống/đặt thành công, màu vàng (`--color-warning`) cho suất sắp đầy, và màu đỏ (`--color-error`) cho hết vé hoặc lỗi thanh toán.
  * **Không tự ý thêm màu mới**: Mọi màu sắc mới phát sinh phải thông qua sự đồng ý của Design Team và được cập nhật vào tài liệu hệ thống màu.
* **Editorial Typography**: Sử dụng bộ chữ **Inter** sắc nét, hỗ trợ tiếng Việt hoàn hảo, tối ưu hóa kích thước chữ lớn để tăng tính sang trọng.
* **Micro-animations**: Mọi nút bấm, thẻ phim, và hiệu ứng cuộn trang đều đi kèm các chuyển động vi mô (micro-animations) mượt mà để tăng trải nghiệm người dùng.

---

## 2. Tiêu Chuẩn Thành Phần (Component Library Standards)

Toàn bộ các thành phần tái sử dụng trong hệ thống CINE được phát triển dựa trên tài liệu gốc [COMPONENT.docx](file:///c:/DATN_learn/TESTUI/COMPONENT.docx) (hoặc [COMPONENT.doc](file:///c:/DATN_learn/TESTUI/COMPONENT.doc)).

### Danh Sách Thành Phần Được Tích Hợp:
1. **Highlight Text**: Chữ điểm nhấn vẽ tay bằng SVG động (Underline, Box, Circle, Marker) kích hoạt khi cuộn đến vùng hiển thị.
2. **Scroll Text**: Các tiêu đề phần nội dung cuộn mượt mà có hiệu ứng trượt sang trái (`slideLeft`) và mờ dần (`fadeIn`).
3. **Segmented Button (Theme Selector)**: Bộ chuyển đổi chế độ Sáng / Tối / Hệ thống dạng viên thuốc kính mờ ở Navbar.
4. **Cinematic Video Player**: Trình phát video chuyên nghiệp hỗ trợ đầy đủ thanh điều khiển tùy chỉnh, hiển thị thông tin phim, hỗ trợ kéo seek bar, tăng giảm âm lượng và chế độ toàn màn hình.
5. **Dropdown Component System**: Hệ thống Dropdown/Combobox kính mờ sang trọng tự động nâng cấp từ các thẻ select mặc định của trình duyệt, hỗ trợ đầy đủ khả năng tìm kiếm, khả năng truy cập tốt nhất (keyboard controls) và đồng bộ hóa tự động thông qua MutationObserver.

---

## 3. Quy Tắc Tách Biệt Tập Tin (File Isolation Policy)

Để giữ cho mã nguồn sản xuất (production) luôn sạch sẽ và hiệu năng tối đa:
* **Production Code**:
  * CSS thành phần đặt tại: `assets/css/components/`
  * JS thành phần đặt tại: `assets/js/components/`
* **Reference Snippets**:
  * Các đoạn mã React/Tailwind/Shadcn gốc từ `COMPONENT.doc` được sao lưu làm tài liệu tham khảo tại: `templates/source-components/`
* **Tuyệt đối không** trộn lẫn các tập tin thử nghiệm hoặc mã giả (như video "Big Buck Bunny" gốc) vào giao diện sản xuất thực tế.

---

## 4. Movie Listing & Product Catalog Pages

To maintain layout harmony and visual excellence, catalog pages must abide by the following reference standards:
* **Grid Specifications**: The movie catalog grid must render exactly 4 columns per row on desktop, 3 or 2 columns on tablet, and 2 columns on mobile. Spacing must remain consistent with the Home page movies section.
* **Component Reuse**: Product cards on catalog grids must reuse the standard `.movie-card` class, including poster wraps, format badges, and dynamic classification age rating classes (`.age-rating-badge.p`, `.age-rating-badge.t13`, etc.).
* **Dynamic Trailer Action**: Clicking the "Trailer" button on any movie card must update the central modal overlay's player source dynamically and play it without navigating away from the grid. Card-level navigations are strictly forbidden during trailer actions.

---

## 5. Navbar Dropdown System Guidelines

Hệ thống điều hướng của CINE tích hợp cấu trúc Dropdown đa dạng để đảm bảo trải nghiệm hiển thị trực quan và tinh tế tối đa:
*   **Phim Menu Mega Dropdown:** Duy nhất menu "Phim" được sử dụng Mega Dropdown lớn rộng ngang (`940px`). Tất cả các menu chức năng khác bắt buộc phải dùng các Dropdown danh mục dọc nhỏ gọn (`220px`) để giữ giao diện thông thoáng, tránh rối mắt.
*   **Opaque Backgrounds (Nền mờ đục):** Tuyệt đối không để nền dropdown bị trong suốt hoàn toàn. Nền phải sử dụng màu trắng đục `#FFFFFF` (hoặc màu cực tối trong giao diện Dark Mode) đi kèm bóng đổ mềm mại (`box-shadow`) để chữ và thẻ phim luôn dễ đọc đè lên trên tất cả mọi nội dung cuộn bên dưới.
*   **Movie Card Style Reuse:** Các thẻ phim hiển thị bên trong Phim Mega Dropdown bắt buộc phải tái sử dụng chuẩn hóa phong cách thiết kế CINE (`aspect-ratio: 2/3`, các góc bo tròn `8px`, nhãn phân loại độ tuổi bằng màu tương ứng `.mega-age-badge.t13`, v.v.), chỉ tinh giản bỏ bớt các nút bấm không cần thiết để tối ưu hóa diện tích hiển thị.
*   **Exclusive Open State:** Chỉ cho phép tối đa một dropdown được mở trong cùng một thời điểm.

---

## 6. Design Documentation Rules

- `DESIGN.md` là nguồn đặc tả thiết kế chính cho Google Stitch và các công cụ thiết kế AI khác.
- Tuyệt đối không thay đổi phong cách trực quan của website mà không cập nhật tài liệu `DESIGN.md`.
- Sử dụng [color-system.md](file:///c:/DATN_learn/TESTUI/docs/design/color-system.md) để tra cứu các mã token màu sắc chuẩn xác của hệ thống.
- Sử dụng [component-system.md](file:///c:/DATN_learn/TESTUI/docs/design/component-system.md) để kiểm tra hành vi tương tác và trạng thái của các thành phần giao diện.
- Sử dụng [page-brief.md](file:///c:/DATN_learn/TESTUI/docs/design/page-brief.md) để tham chiếu bố cục của các trang màn hình hiện tại và định hướng trang tương lai.
- Sử dụng [ux-flow.md](file:///c:/DATN_learn/TESTUI/docs/design/ux-flow.md) để đảm bảo quy trình đặt vé nhanh (Quick Booking Cascade Flow) và các quy luật trải nghiệm người dùng trên thiết bị di động được tuân thủ nghiêm ngặt.
- Mọi thành phần giao diện (UI components) mới phát triển bắt buộc phải sử dụng hệ thống CINE tokens quy chuẩn.
- Nghiêm cấm sử dụng mã màu ngẫu nhiên ngoài hệ thống thiết kế.
- Nghiêm cấm sử dụng thẻ `<select>` mặc định của trình duyệt cho giao diện đặt vé nhanh.
- Nghiêm cấm hiển thị thanh cuộn dọc nội bộ bên trong bảng phim Mega Dropdown trên thiết bị máy tính để bàn (Desktop).
- Xem trailer phim bắt buộc phải mở dạng cửa sổ nổi (Modal Video Player) trực tiếp trên trang, tuyệt đối không được chuyển hướng người dùng sang trang ngoài.

---

*Tài liệu này là cẩm nang bắt buộc cho mọi nhà phát triển tham gia xây dựng hoặc bảo trì hệ thống giao diện CINE.*
