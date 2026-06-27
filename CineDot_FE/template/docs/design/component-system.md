# CINE Component System

Tài liệu này đặc tả chi tiết cấu trúc, trạng thái và hành vi tương tác (interactions) của hệ thống các thành phần giao diện (UI Components) quy chuẩn của CINE.

---

## 1. Navbar (Thanh điều hướng)
Thanh điều hướng là điểm neo thị giác đầu tiên của người dùng, được thiết kế dạng dải lơ lửng tối giản và hiện đại.
*   **Kiểu dáng:** Dạng viên thuốc bo tròn (`border-radius: var(--radius-pill)`), viền mờ nhạt nổi bật trên đầu trang.
*   **Hành vi:**
    *   Mặc định: Phủ kính mờ trong suốt, có bóng đổ nhẹ.
    *   Khi cuộn trang xuống (Scrolled state): Tự động thu hẹp nhẹ khoảng đệm dọc và nền kính trở nên trong hơn để nhường không gian cho nội dung cuộn.
*   **Thành phần tích hợp:** Logo "CINE" bên trái, các liên kết danh mục ở giữa, cụm chuyển đổi giao diện sáng/tối và nút "Đặt vé nhanh" màu cam thương hiệu nổi bật ở bên phải.

---

## 2. Phim Mega Dropdown (Menu phim lớn)
Bảng menu xem trước nhanh tích hợp ngay dưới liên kết "Phim" ở thanh điều hướng.
*   **Kích thước máy tính để bàn (Desktop):** Chiều rộng khống chế ở mức **`min(780px, calc(100vw - 96px))`** và căn giữa dải điều hướng chính. Chiều cao dạng **tự động mở rộng tự nhiên (`height: auto`) và cấm hiển thị thanh cuộn dọc**.
*   **Trình bày:** Gồm 2 hàng đề mục hiển thị song song:
    1.  `PHIM ĐANG CHIẾU` (Clickable Link → `movies.html?category=now-showing`)
    2.  `PHIM SẮP CHIẾU` (Clickable Link → `movies.html?category=coming-soon`)
*   **Thẻ phim xem trước:** Mỗi hàng chứa chính xác **4 thẻ phim nhỏ gọn** (chiều rộng tối đa 135px, chiều cao poster 195px, ẩn thông tin thể loại/phụ đề để tối giản giao diện).
*   **Tương tác Tiêu đề:** Khi di chuột qua tiêu đề danh mục, tiêu đề đổi sang màu tím nhấn và xuất hiện biểu tượng mũi tên màu xanh `→` trượt nhẹ từ trái sang.

---

## 3. Quick Booking Panel (Bảng đặt vé nhanh)
Bảng chọn thác nước thông minh tích hợp ở trang chủ và đầu các trang danh mục.
*   **Bốn bước lựa chọn bắt buộc (Cascade Flow):**
    1.  `Chọn Phim` (Phim đang chiếu / IMAX)
    2.  `Chọn Rạp` (Danh sách chi nhánh rạp CINE khả dụng)
    3.  `Chọn Ngày` (Hôm nay + 6 ngày kế tiếp)
    4.  `Chọn Suất Chiếu` (Giờ chiếu phân loại theo định dạng 2D/3D/IMAX)
*   **Quy luật dòng thác (Cascade Logic):** 
    *   Trường tiếp theo chỉ khả dụng (`is-active`) khi trường trước đó đã được chọn hợp lệ.
    *   Các trường phía sau khi chưa được kích hoạt phải hiển thị mờ ở trạng thái vô hiệu hóa (`is-disabled` / `opacity: 0.45` / `pointer-events: none`).
    *   Nút bấm "Đặt Vé Ngay" ở trạng thái chờ và chỉ nổi màu cam sáng bùng nổ khi cả 4 bước được chọn đầy đủ.

---

## 4. CineDropdown (Thành phần danh sách tùy chỉnh)
Thành phần dropdown đặc trưng được nâng cấp tự động từ thẻ `<select>` tiêu chuẩn.
*   **Đặc điểm kỹ thuật:** Không sử dụng menu select mặc định của trình duyệt để giữ tính thẩm mỹ cao nhất. Nền trắng hoàn toàn đục (`#FFFFFF`), các góc bo mịn, có đổ bóng sâu cao cấp.
*   **Cơ chế đảo hướng thông minh (Smart Directional sensing):**
    *   Khi người dùng nhấn mở, cấu trúc JS tự động tính toán khoảng trống phía trên và phía dưới trigger nút nhấn.
    *   Nếu khoảng trống bên dưới đủ rộng: Gán lớp `.is-open-down` để mở menu xuôi xuống dưới.
    *   Nếu không đủ không gian dưới nhưng trên rộng hơn: Gán lớp `.is-open-up` để mở ngược menu lên phía trên.
    *   Giới hạn chiều cao an toàn tối đa (`max-height: calc(100vh - 140px)`) và tự động kích hoạt thanh cuộn nội bộ siêu mảnh khi danh sách quá dài, đảm bảo không bao giờ bị cắt xén góc màn hình.

---

## 5. Movie Card (Thẻ hiển thị Phim)
Thẻ giới thiệu phim cốt lõi dùng cho trang chủ và trang danh mục phim.
*   **Kích thước chuẩn:** Poster phim chiếm trọn diện tích phần đầu, bo góc 8px.
*   **Badges Overlay:** Điểm số đánh giá (ví dụ `⭐ 9.1`) và Nhãn giới hạn độ tuổi (ví dụ `T18` màu đỏ, `T16` màu cam, `P` màu xanh) được đặt dưới dạng nhãn đè tuyệt đối ở góc dưới bên phải của poster.
*   **Hiệu ứng Hover:** Khi người dùng di chuột qua poster:
    *   Poster tự động phóng to nhẹ 5% (`transform: scale(1.05)`).
    *   Lớp phủ tối `rgba(19, 20, 19, 0.4)` hiện lên cùng hai nút bấm hành động trung tâm: **"Mua vé"** (nút cam đậm) và **"Trailer"** (nút viền trắng trong suốt).
    *   *Lưu ý:* Tuyệt đối không thêm nút "Chi tiết" phụ vào lớp phủ này để giữ giao diện thẻ phim tinh giản nhất.

---

## 6. Movie Detail Hero (Khu vực Anh hùng Trang Chi tiết)
Phần đầu lớn hiển thị hình ảnh rộng của bộ phim trên trang chi tiết phim.
*   **Trình bày:** Ảnh bìa rộng làm mờ nghệ thuật kết hợp hiệu ứng gradient chuyển màu mượt mà xuống vùng tối phía dưới.
*   **Nút Xem Trailer:** Thiết kế biểu tượng phát (Play) lớn nằm ở chính giữa ảnh bìa. Nhấp vào đây sẽ mở trực tiếp Trình phát Video (Trailer Modal) mà không di chuyển khỏi trang.
*   **Poster Đè:** Ảnh poster chính thức của phim bo góc mịn đè chèn lên dải ảnh bìa lớn ở góc dưới bên trái một cách hài hòa.

---

## 7. Schedule Section (Khu vực Lịch chiếu phim)
*   **Dải chọn Ngày (Date Slider):** Dải thanh trượt ngang hiển thị tối đa 7 ngày liên tiếp từ ngày hiện tại. Mỗi nút ngày hiển thị Thứ và Ngày dạng cột đứng gọn gàng.
*   **Bộ lọc Suất chiếu (Filters):** Cho phép người dùng lọc nhanh danh sách rạp và định dạng chiếu (IMAX, 2D, 3D).
*   **Khung hiển thị Suất chiếu:** Phân nhóm suất chiếu theo cụm Rạp, bên trong chia nhỏ theo Định dạng. Mỗi giờ chiếu là một nút bấm (`Showtime Button`).
*   **Quy chuẩn nút Giờ chiếu:**
    *   Đang chọn: Nền tím nhạt, viền tím đậm.
    *   Còn nhiều vé: Viền xanh lục nhẹ.
    *   Sắp hết vé (Gần đầy): Viền vàng ấm áp.
    *   Hết vé / Đã qua: Mờ đi, không thể click.

---

## 8. Video Player / Trailer Modal (Trình phát Trailer)
*   **Kiểu dáng:** Cửa sổ nổi toàn màn hình với lớp nền đen mờ `rgba(19, 20, 19, 0.85)` ôm lấy khung phát video trung tâm.
*   **Hành vi điều khiển:**
    *   Người dùng nhấp vào nút "Đóng" (x) ở góc trên hoặc nhấp ra ngoài vùng phát video để đóng trình phát lập tức.
    *   Bắt buộc đóng bằng phím bấm `Escape`.
    *   **Quy chuẩn quan trọng:** Khi đóng Modal, luồng phát video Youtube/MP4 phải dừng ngay lập tức (xóa hoặc đặt lại thuộc tính `src` của thẻ `iframe`) để triệt tiêu việc âm thanh tiếp tục phát ẩn dưới nền trang web.

---

## 9. Theme Selector (Bộ chuyển đổi giao diện)
*   **Cấu trúc:** Một dải nút segmented nhỏ gọn tích hợp 3 biểu tượng trực quan đại diện cho 3 trạng thái: ☀️ (Sáng), 🌙 (Tối), và 🖥️ (Hệ thống).
*   **Hành vi:**
    *   Lưu trữ tùy chọn của khách hàng trong trình duyệt bằng `localStorage.setItem('theme', ...)`.
    *   Khi tải trang, hệ thống tự động kiểm tra tùy chọn và áp dụng các thuộc tính màu token tương ứng lên thẻ `<html>`.
