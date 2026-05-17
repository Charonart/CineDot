# CINE — Development Guidelines & Reference Standards

Chào mừng bạn đến với tài liệu kỹ thuật dành cho dự án **CINE (CINEDOT)**. Tài liệu này cung cấp các nguyên tắc thiết kế, hướng dẫn phát triển và tài liệu tham khảo cho các thành phần (components) tái sử dụng.

---

## 1. Nguyên Tắc Thiết Kế (Design Principles)

Giao diện của CINE được định hình bởi sự kết hợp tinh tế giữa sự tối giản cao cấp của **Apple TV+**, chiều sâu điện ảnh của **Netflix** và cảm giác nhập vai hoành tráng của **IMAX**:
* **Glassmorphism**: Sử dụng hiệu ứng nền kính mờ sang trọng (`backdrop-filter: blur(16px)`) kết hợp với viền trắng bán trong suốt để tạo chiều sâu trực quan.
* **Harmonious Palette**: Không sử dụng các màu cơ bản thuần túy (như đỏ, xanh đậm thô sơ). Thay vào đó, áp dụng hệ màu tinh tế:
  * Nền sáng: `#FEFEFE`
  * Nền tối: `#0B0C0B`
  * Màu điểm nhấn (Accent color): `#B8AFFF` (Accent strong) và `#CFC9EB` (Accent soft)
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

*Tài liệu này là cẩm nang bắt buộc cho mọi nhà phát triển tham gia xây dựng hoặc bảo trì hệ thống giao diện CINE.*
