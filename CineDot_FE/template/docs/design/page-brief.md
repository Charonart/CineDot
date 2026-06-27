# CINE Page Brief

Tài liệu này phác thảo bố cục, hành vi trải nghiệm và phân cấp nội dung của các trang chính thuộc hệ thống CINE.

---

## 1. Trang chủ (Home Page)

Trang chủ là trung tâm hội tụ các giá trị trải nghiệm cốt lõi của CINE: Duyệt phim mượt mà và Đặt vé siêu tốc.

### Cấu trúc Bố cục (Bản thiết kế từ trên xuống):
1.  **Capsule Navbar (Thanh điều hướng lơ lửng):**
    *   Cố định trên cùng của trang web khi cuộn.
    *   Tích hợp menu Phim với Mega Dropdown căn giữa hoàn hảo.
2.  **Hero Trailer Banner (Khu vực Anh hùng):**
    *   Một slideshow trình chiếu các bộ phim bom tấn nổi bật nhất đang chiếu tại rạp.
    *   Tự động chạy mượt mà, có các hiệu ứng chuyển đổi chìm mờ (fade transition) cao cấp.
3.  **Quick Booking Panel (Bảng đặt vé nhanh):**
    *   Đặt lơ lửng chèn lên phần cuối của Hero Banner để tạo điểm nhấn thị giác mạnh mẽ.
    *   Dẫn dắt khách hàng hoàn thành 4 bước đặt vé nhanh ngay lập tức.
4.  **"Khám phá phim" (Movie Grid Section):**
    *   Mục trưng bày phim chủ lực của trang chủ.
    *   Lưới phim hiển thị 4 thẻ phim ngang trên một dòng.
    *   Hỗ trợ chuyển đổi nhanh các danh mục: "Phim đang chiếu", "Phim sắp chiếu", và "Phim IMAX" thông qua hệ thống nút Tab mượt mà.
5.  **Footer (Chân trang):**
    *   Thiết kế tinh tế với 4 cột thông tin: Giới thiệu thương hiệu, Điều khoản & Chính sách, Hệ thống Rạp, và cổng tải Ứng dụng di động.

---

## 2. Trang khám phá Danh mục Phim (Movie Listing Page)

Trang hiển thị lưới sản phẩm mở rộng khi khách hàng click vào các mục xem thêm từ trang chủ hoặc các đường liên kết tiêu đề từ Mega Dropdown.
*   **Đường dẫn truy cập (Routes):**
    *   `movies.html?category=now-showing` (Danh sách phim đang chiếu)
    *   `movies.html?category=coming-soon` (Danh sách phim sắp chiếu)
    *   `movies.html?category=imax` (Danh sách phim công nghệ IMAX cao cấp)
*   **Bố cục giao diện:**
    *   **Tiêu đề trang lớn (Page Header):** Sử dụng các hiệu ứng chữ vẽ nổi bật in đậm (ví dụ: `PHIM ĐANG CHIẾU`).
    *   **Thanh điều khiển Tab phụ:** Giúp người dùng chuyển đổi nhanh danh mục trực tiếp trên trang.
    *   **Lưới phim đầy đủ:** Trình bày lưới phim 4 cột chuẩn máy tính. Số lượng phim phân bổ lớn (tối đa 16 phim đang chiếu, 20 phim sắp chiếu, 8 phim IMAX) không có phân trang thu hẹp để trải nghiệm lướt xem liền mạch nhất.

---

## 3. Trang Chi tiết Phim (Movie Detail Page)

Trang cung cấp thông tin chuyên sâu và Lịch chiếu phim của một bộ phim cụ thể (`movie-detail.html?id=...`).

### Bố cục giao diện:
1.  **Hero Background Banner (Ảnh nền lớn):**
    *   Hình ảnh rộng cực kỳ sắc nét của phim làm mờ nhẹ hậu cảnh, chính giữa có nút phát Trailer lớn màu trắng nổi bật.
2.  **Thông tin phim chính (Movie Meta Grid):**
    *   Nằm đè nhẹ lên ảnh bìa Hero.
    *   Bên trái là tấm poster phim khổ `2:3` lớn bo tròn góc.
    *   Bên phải là khối thông tin phim: Tên phim lớn tiếng Việt kèm phụ đề tiếng Anh, nhãn phân loại độ tuổi và các chỉ số điểm đánh giá, thời lượng, đạo diễn, diễn viên, ngôn ngữ.
    *   **Nút Đặt vé ngay (CTA Cam):** Nhấp vào sẽ cuộn mượt mà trang xuống khu vực Lịch chiếu (#schedule) phía dưới.
3.  **Bố cục phân đôi vùng nội dung (Two-Column Layout):**
    *   **Cột trái (Chiếm 70%):** Trình bày phần tóm tắt nội dung cốt truyện chi tiết của phim.
    *   **Cột phải (Chiếm 30% - Recommendations):** Trưng bày danh sách 3 bộ phim đề xuất cùng thể loại được thiết kế dạng thẻ dọc tinh giản, kích thích người dùng click khám phá tiếp.
4.  **Lịch chiếu phim (#schedule):**
    *   Đặt trang trọng ở vùng dưới cùng.
    *   Chứa dải chọn ngày nằm ngang, bộ lọc rạp chiếu và danh sách các suất chiếu có thể nhấp chọn để mua vé.

---

## 4. Định hướng phát triển: Trang chọn Ghế tương lai (Seat Selection Page)

Khi dự án mở rộng sang giai đoạn 2 để đặt vé hoàn tất:
*   **Bố cục:**
    *   **Màn hình chiếu (Screen Indicator):** Đặt trên cùng dạng một đường vòng cung phát sáng mềm mại, hướng ánh sáng đổ xuống dưới để giả lập rạp phim thật.
    *   **Sơ đồ ghế ngồi (Seat Grid):** Chia rõ các khu vực ghế Thường (màu xám nhạt), ghế VIP (màu tím Accent nhạt), ghế Đôi Sweetbox (màu hồng sẫm ở hàng cuối).
    *   **Mã màu trạng thái ghế:**
        *   Ghế đang chọn: Màu cam Booking CTA.
        *   Ghế đã được người khác đặt trước: Màu xám đậm khóa chéo biểu tượng.
    *   **Khung tóm tắt đặt vé (Sidebar Summary):** Hiển thị trực quan ở bên phải/dưới: Tên phim, Rạp, Suất chiếu, các ghế đã chọn và tổng tiền tạm tính.
    *   **Bộ đếm thời gian giữ ghế:** Đồng hồ đếm ngược 10:00 phút chạy lùi ở góc để tạo cảm giác cấp bách cho người mua.

---

## 5. Định hướng phát triển: Trang Thanh toán tương lai (Checkout Page)

Trang bước cuối cùng để hoàn tất giao dịch và xuất vé điện tử:
*   **Thông tin đơn hàng:** Bảng hiển thị tóm tắt toàn bộ chi tiết suất chiếu và mã số ghế đã đặt.
*   **Nhập mã ưu đãi (Voucher/Promo Code):** Khung nhập mã đơn giản, tự động giảm trừ tiền trực tiếp trên màn hình.
*   **Cổng thanh toán tích hợp:** Danh sách các biểu tượng thanh toán an toàn trực quan: Ví điện tử (Momo, ZaloPay), Thẻ nội địa ATM, Thẻ quốc tế Visa/Mastercard, và Quét mã QR thanh toán nhanh.
*   **Xác nhận và Nhận vé:** Sau khi giao dịch thành công, hiển thị trang chúc mừng đi kèm mã QR vé lớn để quét trực tiếp tại cửa kiểm soát của rạp CINE.
