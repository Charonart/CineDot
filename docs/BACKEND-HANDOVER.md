# Tài liệu Bàn giao & Phối hợp (Frontend -> Backend)

Tài liệu này mô tả chi tiết toàn bộ các API mà Frontend đang mong đợi (hiện đang được chạy bằng Mock Data), bao gồm các tham số đầu vào (Params) và mô tả những công việc Frontend đã hoàn thành để Backend dễ dàng nắm bắt và tích hợp.

| Lưu ý: Prefix mặc định cho tất cả các endpoint giao tiếp từ Frontend là `/api/v1`

---

## PHẦN 1: TỔNG KẾT NHỮNG VIỆC FRONTEND ĐÃ LÀM

Để Backend có bức tranh tổng thể, dưới đây là những kiến trúc và tính năng Frontend đã xây dựng xong:

1. **Kiến trúc Mock API Thông Minh:**
   - Xây dựng file `src/lib/axios/axiosClient.ts` hoạt động như một Interceptor. Khi biến `.env` có `NEXT_PUBLIC_USE_MOCK=true`, mọi request HTTP (POST, GET, PUT...) đều được tự động chặn và trỏ về các file JSON trong thư mục `public/mocks`.
   - Có khả năng xử lý logic giả lập ngay trên Client: Phân trang, filter phim theo danh mục (đang chiếu, sắp chiếu), tìm kiếm phim theo từ khóa.

2. **Chuẩn hóa Error Handling:**
   - Xây dựng chuẩn lỗi thống nhất (chuẩn `ApiError`). Khi Backend trả về HTTP 4xx, 5xx, Axios sẽ tự động bắt lấy `message`, `code` và `errors` (validation) để hiển thị đồng nhất trên UI.

3. **Module Authentication (Xác thực):**
   - Đã cấu hình Tanstack Query cho các tính năng: Đăng nhập, Đăng ký, Đăng xuất, Lấy thông tin User hiện tại. 
   - Token đang được cấu hình giả lập lưu ở `localStorage`.

4. **Giao diện & UI Shared Components:**
   - Hoàn thiện `Navbar` (thanh điều hướng) tích hợp Mega-menu động hiển thị poster phim.
   - Hoàn thiện `Footer`.
   - Setup bộ khung cho tính năng Đặt vé (Booking) bao gồm Modal xác nhận.
   - Các UI Components đang có nhiều vị trí Hardcode (như các link Footer) để chờ Data thật.

---

## PHẦN 2: API REFERENCE FRONTEND EXPECTS (HIỆN ĐANG MOCK)

Tất cả các API dưới đây Frontend đều **BẮT BUỘC** expect cấu trúc trả về như sau:

**Thành công (HTTP 200):**
```json
{
  "success": true,
  "data": { ... } // Hoặc mảng, nếu phân trang thì có thêm page, totalPages...
}
```

**Thất bại (HTTP 4xx):**
```json
{
  "success": false,
  "message": "Chi tiết lỗi",
  "code": "ERROR_CODE",
  "errors": {} // Dành cho validation
}
```

### 1. Authentication & Users

**POST /auth/login**
- **Mô tả:** Đăng nhập hệ thống.
- **Body:** `{ "email": "...", "password": "..." }`
- **Response:** Trả về token và thông tin user. Nguồn Mock: `public/mocks/auth/login-success.json`.

**POST /auth/register**
- **Mô tả:** Đăng ký tài khoản mới.
- **Body:** `{ "name": "...", "email": "...", "password": "...", "password_confirmation": "..." }`

**GET /auth/me** 🔒
- **Mô tả:** Lấy thông tin user hiện tại đang đăng nhập.
- **Nguồn Mock:** `public/mocks/auth/me-guest.json` / `me-authenticated.json`.

**POST /auth/logout** 🔒
- **Mô tả:** Đăng xuất người dùng. Xóa session ở Backend.

### 2. Movies (Phim)

**GET /movies**
- **Mô tả:** Lấy danh sách phim.
- **Query Params hỗ trợ:** 
  - `category` (now-showing, coming-soon)
  - `status` (đang chiếu, sắp chiếu...)
  - `search` / `query` (tìm kiếm tên phim)
  - `page`, `limit` (Phân trang)
- **Nguồn Mock:** `public/mocks/movies.json` (Frontend hiện đang tự filter dựa trên file này).

**GET /movies/:slug**
- **Mô tả:** Lấy chi tiết thông tin một bộ phim theo đường dẫn (slug).
- **Nguồn Mock:** `public/mocks/movies/detail/*.json`.

**GET /movies/:slug/credits**
- **Mô tả:** Lấy thông tin đạo diễn, diễn viên của phim.
- **Nguồn Mock:** `public/mocks/movie-credits.json`.

**GET /movies/:slug/videos**
- **Mô tả:** Lấy danh sách trailer, teaser của phim.
- **Nguồn Mock:** `public/mocks/movie-videos.json`.

### 3. Cinemas & Showtimes (Rạp & Lịch chiếu)

**GET /cinemas**
- **Mô tả:** Lấy danh sách hệ thống rạp và cụm rạp.
- **Nguồn Mock:** `public/mocks/cinemas/cinemas.json`.

**GET /showtimes**
- **Mô tả:** Lấy danh sách suất chiếu.
- **Query Params hỗ trợ:** 
  - `movieId` (Lấy suất chiếu của 1 phim)
  - `cinemaId` (Lấy suất chiếu tại 1 rạp)
  - `date` (Lọc theo ngày YYYY-MM-DD)
- **Nguồn Mock:** `public/mocks/showtimes-by-movie.json`.

**GET /showtimes/:id/seats**
- **Mô tả:** Lấy sơ đồ ghế và trạng thái ghế (trống, đã đặt, đang giữ) của một suất chiếu cụ thể.
- **Nguồn Mock:** `public/mocks/booking/seat-map.json`.

### 4. Booking & Payments (Đặt vé & Thanh toán) 🔒

**POST /bookings/hold-seats**
- **Mô tả:** Giữ ghế trong thời gian thực (5-10 phút) để người dùng thanh toán.
- **Body:** `{ "showtimeId": "...", "seats": ["A1", "A2"] }`
- **Nguồn Mock:** `public/mocks/booking/seat-hold-success.json`.

**POST /payments**
- **Mô tả:** Thanh toán đơn hàng sau khi giữ ghế thành công.
- **Body:** `{ "bookingId": "...", "method": "vnpay|momo|credit" }`

---

## 3. Hướng dẫn Test Data thật (Bỏ Mock)

Khi Backend đã sẵn sàng API, Frontend chỉ cần đổi các biến sau trong `.env` để kết nối thẳng vào Backend:

```env
NEXT_PUBLIC_API_BASE_URL=https://<domain-backend-cua-ban>/api/v1
NEXT_PUBLIC_USE_MOCK=false
```

Với kiến trúc hiện tại, Frontend **không cần thay đổi bất kỳ dòng code UI nào** để tương thích với Backend, miễn là Backend tuân thủ đúng API Contract ở trên.
