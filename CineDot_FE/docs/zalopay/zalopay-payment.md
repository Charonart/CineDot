# Hướng dẫn Tích hợp ZaloPay Sandbox (Backend)

Tài liệu này được viết để hướng dẫn Backend Developer (BE) cách nhận và xử lý payload từ luồng thanh toán ZaloPay Sandbox mà Frontend (FE) đang gọi.

## 1. Luồng hoạt động (Flow)

1. **User (FE)** bấm "Thanh Toán".
2. **FE** gom thông tin đơn hàng (Ghế, Bắp Nước, Mã Phim, Tổng Tiền) và gọi API **Tạo Đơn Hàng** của **BE**.
3. **BE** nhận thông tin:
   - Lưu vào bảng `bookings` với trạng thái `pending`.
   - Tạo mã `app_trans_id` (định dạng `YYMMDD_MãĐơnHàng`).
   - Ký MAC và gọi lên ZaloPay Sandbox (`sb-openapi.zalopay.vn`).
   - Nhận `order_url` từ ZaloPay và trả về cho FE.
4. **FE** nhận `order_url` và redirect user sang trang ZaloPay.
5. **User** quét mã QR thanh toán trên Sandbox.
6. **ZaloPay** gọi Webhook (`Callback URL`) về **BE**.
   - **BE** xác thực MAC.
   - Cập nhật `bookings.status = paid`.
7. **FE** gọi định kỳ `/api/payments/zalopay/check-status` lên **BE** (hoặc nhận event redirect của ZaloPay) để hiển thị trang Thành Công.

---

## 2. Các API Backend cần viết

### 2.1. API Tạo thanh toán (Create Order)
- **Method:** `POST`
- **Endpoint:** `/api/v1/payments/zalopay/create`
- **Payload FE gửi lên:**
```json
{
  "booking_id": 105, 
  "payment_method": "zalopay"
}
```
*(FE đã tạo `booking_id` trước bằng API `/bookings/hold-seats` hoặc truyền trực tiếp giỏ hàng tùy flow)*

- **Logic xử lý của BE:**
  - Query lấy tổng tiền của `booking_id`.
  - Tạo object gửi lên ZaloPay:
```json
{
  "app_id": "2553",
  "app_user": "CineDot",
  "app_trans_id": "260627_105", 
  "app_time": 1700000000000,
  "amount": 100000, 
  "item": "[]",
  "description": "CineDot - Thanh toan don hang #105",
  "embed_data": "{\"booking_id\":105,\"redirecturl\":\"http://localhost:3000/booking/payment/zalopay-return\"}",
  "bank_code": "zalopayapp",
  "mac": "<SHA256 HMAC của chuỗi dữ liệu kết hợp với Key 1>"
}
```
  - Gọi HTTP POST tới `https://sb-openapi.zalopay.vn/v2/create`.
  - Trả về FE:
```json
{
  "success": true,
  "message": "Tạo đơn hàng ZaloPay thành công",
  "data": {
    "payment_url": "https://qcpay.zalopay.vn/...",
    "app_trans_id": "260627_105"
  }
}
```

### 2.2. API Nhận Webhook từ ZaloPay (Callback)
- **Method:** `POST`
- **Endpoint:** `/api/v1/payments/zalopay/callback`
*(Nhớ thêm endpoint này vào mảng `Except` của middleware VerifyCsrfToken trong Laravel)*
- **Logic xử lý của BE:**
  - ZaloPay gửi payload dạng JSON: `{ "data": "...", "mac": "..." }`.
  - BE so sánh `mac` gửi lên với `HMAC_SHA256(data, Key2)`.
  - Nếu đúng, parse chuỗi `data` thành JSON.
  - Lấy `app_trans_id` từ data. Trích xuất ID đơn hàng.
  - Cập nhật database: `bookings.status = 'paid'`.
  - Return `{"return_code": 1, "return_message": "success"}` cho ZaloPay.

---

## 3. ZaloPay Sandbox Credentials

Dùng cấu hình này cho môi trường Development (Sandbox):
```env
ZALOPAY_APP_ID=2553
ZALOPAY_KEY1=PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL
ZALOPAY_KEY2=kLtgPl8YESVjq4kjk11wSN0EKxjkBszV
ZALOPAY_ENDPOINT=https://sb-openapi.zalopay.vn/v2/create
```

## 4. Lưu ý cho BE
1. Frontend hiện tại đang xử lý demo trực tiếp trong Next.js API Routes (để test UI). Khi BE làm xong, Frontend chỉ cần đổi `axios` endpoint chĩa sang `/api/v1/payments/zalopay/create` của Laravel.
2. ZaloPay bắt buộc `app_trans_id` phải format `YYMMDD_xxxx`. Không được làm sai format này.
3. Nhớ nhúng `redirecturl` (URL trang trả về của FE) vào trong `embed_data` để khi người dùng thanh toán trên ZaloPay xong, web app ZaloPay biết đường quay về trang Next.js.





Báo cáo: Xử lý Hủy thanh toán & Cơ chế Đăng nhập
Dưới đây là tài liệu giải thích cơ chế kỹ thuật mà ứng dụng đang sử dụng để quản lý phiên bản đăng nhập và xử lý việc người dùng hủy giao dịch ZaloPay.

1. Xử lý Hủy Thanh Toán (Cancel Payment) hoặc Bấm Back
Câu hỏi: Nếu người dùng không thanh toán nữa và bấm back về trang thanh toán hoặc hủy thanh toán thì có bắt được dữ liệu để trả về trang của chúng ta không?

Trả lời: Có, dữ liệu hoàn toàn không bị mất và chúng ta bắt được sự kiện này.

Cơ chế hoạt động:
ZaloPay Sandbox Redirect: Khi gọi lên ZaloPay, Frontend truyền một tham số gọi là redirecturl (hiện tại là http://localhost:3000/booking/payment/zalopay-return).
Nút Hủy / Back của ZaloPay: Nếu trên trang quét mã QR, người dùng không quét mà bấm nút [ X ] (Đóng) hoặc nút "Quay lại trang web", ZaloPay sẽ tự động gọi HTTP GET chuyển hướng người dùng về cái redirecturl kia kèm theo một số mã lỗi trên URL.
Nếu user bấm Back của trình duyệt: Nếu người dùng tự bấm nút Back (⬅) trên trình duyệt Google Chrome/Edge, họ sẽ quay lại thẳng màn hình BookingPaymentPage lúc nãy.
Vì sao dữ liệu giỏ hàng không bị mất?
Bởi vì ứng dụng sử dụng công nghệ Zustand kết hợp với sessionStorage (trong file bookingStore.ts) để lưu trạng thái đặt vé (Session State).

Ngay khi bấm "Thanh toán", trạng thái được đổi thành status = 'pending-payment' nhưng toàn bộ dữ liệu ghế, bắp nước, mã giảm giá vẫn nằm trong máy của người dùng.
Dù người dùng bị chuyển trang đi đâu, khi quay lại (bằng nút Back hay qua redirecturl bị lỗi), Frontend sẽ kiểm tra trạng thái thanh toán từ Backend. Nếu giao dịch bị hủy, Frontend sẽ hiển thị thông báo "Bạn đã hủy thanh toán" và giữ nguyên giỏ hàng để họ chọn phương thức khác (hoặc thử lại).
2. Cơ chế Lưu trạng thái Đăng nhập (Authentication)
Câu hỏi: Khi người dùng đăng nhập thì nó lưu bằng cách nào?

Trả lời: Ứng dụng không dùng JWT lưu ở LocalStorage như các web cơ bản, mà đang sử dụng cơ chế bảo mật cao cấp hơn là Laravel Sanctum (Cookie-based Auth) kết hợp với React Query.

Luồng xử lý Đăng nhập:
Lấy Token Bảo Mật: Trước khi gửi tài khoản/mật khẩu, Frontend gọi ensureCsrfCookie() để lấy một đoạn mã chống giả mạo (CSRF Token) từ Laravel Backend.
Xác thực & Gắn Cookie (HttpOnly): Frontend gửi email và password lên Backend. Nếu đúng, Laravel tự động gắn một Cookie đặc biệt (gọi là laravel_session hoặc cine_session) vào trình duyệt của người dùng. Cookie này có cờ HttpOnly, nghĩa là Hacker (hay mã độc XSS) không thể nào dùng JavaScript để đọc trộm được.
Lấy Thông tin User: Tiếp theo, React Query (useAuth hook) gọi API /api/v1/auth/me. Vì trình duyệt tự động gửi kèm cái Cookie bí mật kia, Backend nhận diện được user và trả về thông tin { name, email, avatar, roles }.
Hiển thị & Giữ phiên: Khi người dùng tắt tab mở lại, React Query lại tự gọi /auth/me. Cookie vẫn còn sống trong trình duyệt, nên họ sẽ tự động được đăng nhập lại mà không cần nhập mật khẩu.
Ưu điểm của kiến trúc này:
Cực kỳ bảo mật: Chống được lỗi XSS (Hackers không lấy được token) và CSRF (đã được block bằng Sanctum middleware).
Đồng bộ thời gian thực: Backend có quyền chủ động logout người dùng bằng cách báo cho trình duyệt xóa Cookie đó đi, Frontend lập tức bị văng ra trang chủ ngay ở lần tải API kế tiếp.