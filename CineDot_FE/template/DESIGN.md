# CINE Design Brief

## 1. Product Summary
CINE (tên mã dự án: CINEDOT) là một nền tảng đặt vé xem phim trực tuyến cao cấp tại Việt Nam. Ứng dụng mang tới trải nghiệm kép hoàn mỹ: vừa giúp khách hàng khám phá vũ trụ điện ảnh qua giao diện duyệt phim đậm chất nghệ thuật, vừa đơn giản hóa tối đa quy trình mua vé qua hệ thống đặt vé nhanh dạng dòng thác (cascade booking flow).

## 2. Brand Identity
- **Brand Name:** CINE
- **Tone:** Cao cấp (premium), đậm chất điện ảnh (cinematic), hiện đại (modern), trực quan rõ ràng (clear), đáng tin cậy (trustworthy).
- **Core Experience:** Duyệt phim đầy cảm xúc, chọn suất chiếu thông minh, tốc độ phản hồi tức thì, bảo mật và tinh tế trong từng điểm chạm.

## 3. Visual Direction
Giao diện của CINE được định hình bởi ngôn ngữ thiết kế duy mỹ, kết hợp hài hòa giữa các xu hướng UI hàng đầu hiện nay:
- **Light Cinematic UI:** Tông nền sáng sang trọng làm nổi bật màu sắc rực rỡ và chiều sâu của các tấm poster phim.
- **Apple TV+ Polish & Clean Whitespace:** Sự tinh khiết của khoảng trắng được ưu tiên để giao diện thoáng đãng, phân cấp thông tin rõ ràng và định hướng thị giác tốt.
- **Netflix-Style Movie Browsing:** Trải nghiệm lướt phim tập trung cao độ vào hình ảnh và các hiệu ứng chuyển động lướt nhẹ, khơi gợi nhu cầu giải trí.
- **Galaxy Cinema-Inspired Booking Flow:** Quy trình chọn Phim - Rạp - Ngày - Suất chiếu tích hợp ngay trong một bảng gọn gàng, tự động cập nhật dữ liệu liên tục không cần tải lại trang.
- **Soft Glassmorphism:** Các dải phủ kính mờ kết hợp làm mờ hậu cảnh (backdrop-filter) tinh tế mang tới chiều sâu ba chiều cao cấp.
- **Premium Cards & Rounded Corners:** Toàn bộ poster phim, bảng biểu, nút bấm đều sử dụng bo góc mịn (border-radius: 8px - 14px), tạo cảm giác thân thiện và cao cấp.
- **Subtle Shadows:** Sử dụng đổ bóng đa tầng dịu nhẹ để phân tách bề mặt nổi mà không gây nhiễu thị giác.

## 4. Color Palette

*   **Primary Background:** `#FEFEFE` - Nền chính trắng tinh khiết sáng sủa.
*   **Soft Background:** `#F6F6F6` - Nền xám nhạt trung tính dùng phân chia khu vực.
*   **Text Primary:** `#131413` - Màu chữ chính đen cinematic gần như tuyệt đối.
*   **Text Secondary:** `#4B4B50` - Màu chữ phụ xám sẫm ấm áp.
*   **Text Muted:** `#7A7A80` - Màu chữ chú thích xám nhạt trung tính.
*   **Border:** `rgba(19, 20, 19, 0.08)` - Màu viền siêu mảnh, mờ nhẹ tinh tế.
*   **Primary Accent:** `#CFC9EB` - Màu tím pastel mờ dùng làm nền hover.
*   **Accent Strong:** `#B8AFFF` - Tông màu tím nhấn trung bình.
*   **Accent Deep:** `#7C6FE8` - Tông tím đậm đặc trưng thương hiệu CINE.
*   **Booking CTA:** `#FF7A1A` - Màu cam nổi bật thúc đẩy đặt vé nhanh.
*   **CTA Hover:** `#F06400` - Màu cam đậm khi di chuột kích thích hành động.
*   **Success:** `#22C55E` - Màu xanh lục thành công / Suất chiếu còn nhiều vé.
*   **Warning:** `#F59E0B` - Màu vàng cảnh báo / Suất chiếu sắp hết vé.
*   **Error:** `#EF4444` - Màu đỏ lỗi / Suất chiếu đã hết vé.
*   **Dark Surface:** `#0E0F0E` - Bề mặt đen tuyền sâu thẳm khi chuyển giao diện tối hoặc trong rạp chiếu.

## 5. Typography
- **Main Font:** `Inter` (Google Fonts) - Kiểu chữ sans-serif hiện đại, thanh lịch, trung tính và có độ hiển thị tiếng Việt xuất sắc ở mọi kích thước.
- **Cấu trúc Tiêu đề (Headings):** Sử dụng các thuộc tính font in hoa (uppercase), chữ đậm (font-weight: 700 - 800) kết hợp với đường vạch màu tím đứng đặc trưng bên trái để tạo phong cách tạp chí điện ảnh cao cấp.
- **Phông chữ tên phim:** Cấm tuyệt đối việc sử dụng chữ serif hoặc italic lỗi thời cho tên phim tiếng Việt trong lưới sản phẩm để tránh gãy nét hiển thị.

## 6. Layout Principles
- **Poster-First Focus:** Trải nghiệm duyệt phim phải lấy hình ảnh poster phim làm trung tâm. Poster phải luôn có tỷ lệ vàng điện ảnh `2:3`.
- **Chỉ số quét nhanh (Scannability):** Thông tin quan trọng như Điểm số đánh giá (Rating) và Giới hạn độ tuổi (Age Rating) phải luôn được định vị nổi bật dạng thẻ đè (badges overlay) ở góc dưới poster.
- **Cấu trúc Desktop:** Lưới hiển thị phim chuẩn 4 cột (`grid-template-columns: repeat(4, 1fr)`) với khoảng cách gap gọn gàng từ 18px đến 22px. Thẻ phim trong dropdown menu có chiều rộng cực kỳ nhỏ gọn **135px** để tránh quá cao.
- **Quy tắc phân trang Chi tiết phim:** Banner rộng lớn làm mờ hậu cảnh → Tấm poster đè lên banner → Nội dung phim bên trái đối lập với Suất chiếu / Lịch chiếu rộng rãi bên dưới.

## 7. Core Pages
1.  **Trang chủ (Home Page):** Điểm chạm thương hiệu chính tích hợp Banner Anh Hùng (Hero Banner) cuộn tự động, bảng Đặt vé nhanh (Quick Booking Panel) và khu vực khám phá các danh mục phim đặc sắc.
2.  **Trang khám phá Phim (Movie Listing Page):** Trang hiển thị lưới phim mở rộng đầy đủ theo danh mục tìm kiếm (`movies.html?category=now-showing / coming-soon / imax`).
3.  **Trang Chi tiết phim (Movie Detail Page):** Cung cấp thông tin đầy đủ, điểm số đánh giá, xem thử trailer điện ảnh không chuyển hướng và toàn bộ lịch chiếu trực quan của bộ phim đã chọn.
4.  **Hộp tìm kiếm (Search Modal):** Cửa sổ tìm kiếm nhanh tích hợp gợi ý thời gian thực.
5.  **Trang chọn ghế tương lai (Seat Selection Page):** (Định hướng phát triển) Bản đồ sơ đồ ghế ngồi trực quan phân loại VIP/Thường, tích hợp bộ đếm ngược giữ ghế.
6.  **Trang thanh toán tương lai (Checkout Page):** (Định hướng phát triển) Tóm tắt đơn đặt vé, nhập mã giảm giá, lựa chọn phương thức thanh toán an toàn.

## 8. Core Components
- **Navbar:** Thanh điều hướng bo tròn dạng capsule độc đáo lơ lửng phía trên trang web.
- **Phim Mega Dropdown:** Bảng danh mục xem trước nhanh siêu gọn gàng gồm 2 hàng dọc hiển thị song song 4 bộ phim hot nhất, tiêu đề có mũi tên chỉ hướng tương tác và không bị cuộn dọc trên máy tính.
- **Quick Booking Panel:** Bảng điều khiển chọn Phim - Rạp - Ngày - Giờ hoạt động mượt mà theo hiệu ứng thác đổ khóa các bước chưa sẵn sàng.
- **CineDropdown:** Thành phần dropdown tùy chỉnh hoàn hảo thay thế cho thẻ `<select>` mặc định của trình duyệt, hỗ trợ tự động mở ngược chiều (upward/downward) thông minh dựa trên vị trí khung nhìn thực tế.
- **Movie Card:** Thẻ hiển thị poster phim tích hợp nhãn điểm số, độ tuổi đè ở góc dưới, khi hover hiện nút bấm CTA "Mua vé" và "Trailer".
- **Trailer Modal / Video Player:** Trình phát video chuyên nghiệp mở dạng cửa sổ nổi phủ mờ (modal), tự động dừng phát khi người dùng đóng cửa sổ hoặc ấn phím ESC.
- **Theme Selector:** Nút bấm chuyển đổi giao diện sáng/tối lưu trữ trạng thái người dùng cục bộ qua localStorage.

## 9. UX Principles
- **Quy trình khóa dòng thác (Locked Flow Cascade):** Trong bảng đặt vé nhanh, bước tiếp theo chỉ được kích hoạt khi bước trước đó đã được lựa chọn. Các trường chưa sẵn sàng phải ở trạng thái vô hiệu hóa mờ (`is-disabled` / `opacity: 0.45`).
- **Trình chiếu không rời trang (In-place Video Trailer):** Xem trailer phim phải luôn mở dạng Modal nổi trên trang hiện tại, tuyệt đối không được chuyển hướng người dùng sang Youtube hoặc trang web bên ngoài.
- **Cảnh báo suất chiếu trực quan:** Trạng thái suất chiếu phải được mã hóa màu sắc rõ ràng (Thành công = Còn nhiều ghế, Vàng = Sắp hết vé, Đỏ = Đã hết vé / Đã qua giờ chiếu).

## 10. Do / Don't
### **NÊN LÀM (DO):**
*   Chỉ sử dụng mã màu quy chuẩn trong CINE Tokens.
*   Thiết kế poster phim luôn theo đúng tỷ lệ `2:3`.
*   Giữ cho bảng Mega Dropdown luôn căn giữa dải điều hướng chính `.nav-inner`.
*   Tự động cảm biến chiều cao để đảo hướng menu dropdown (upward/downward) tránh bị che khuất.

### **KHÔNG ĐƯỢC LÀM (DON'T):**
*   **Không bao giờ** sử dụng thẻ `<select>` mặc định của trình duyệt cho giao diện đặt vé.
*   **Không bao giờ** cho phép hiển thị thanh cuộn dọc nội bộ trên dropdown phim máy tính để bàn (Desktop).
*   **Không** sử dụng màu sắc ngẫu nhiên ngoài hệ thống thiết kế.
*   **Không** chuyển hướng trang khi người dùng nhấn xem trailer.
