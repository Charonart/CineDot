# BẢNG KIỂM THỬ HỆ THỐNG CINEDOT (TESTING CHECKLIST)
> **Phiên bản:** 1.2.0  
> **Phạm vi kiểm thử:** Xác thực (Authentication), Phân quyền quản trị (RBAC), Cơ chế đăng xuất (Logout), Next.js Edge Proxy và Nạp dữ liệu thực tế từ API.

---

## 1. THÔNG TIN MÔI TRƯỜNG VÀ TÀI KHOẢN THỬ NGHIỆM

- **Ứng dụng Frontend:** http://localhost:3000
- **Máy chủ Backend API:** https://cinedot_be.test/api/v1 (hoặc http://localhost:8000/api/v1)

| Vai trò (Role) | Email đăng nhập | Mật khẩu mẫu | Phạm vi quyền hạn |
| :--- | :--- | :--- | :--- |
| **SUPER_ADMIN** | admin@cinedot.com | password / 123456 | Toàn quyền hệ thống (*), truy cập tất cả màn hình /admin/* |
| **CINEMA_MANAGER** | manager@cinedot.com | password / 123456 | Quản lý Phim, Cụm rạp, Suất chiếu, Đơn vé, Bắp nước |
| **TICKET_STAFF** | staff@cinedot.com | password / 123456 | Chỉ truy cập Cổng soát vé (/admin/ticket-scanner) |
| **CUSTOMER** | (Đăng ký mới hoặc tài khoản khách) | password / 123456 | Chỉ sử dụng web khách hàng, bị chặn 100% khỏi /admin |

---

## 2. KỊCH BẢN KIỂM THỬ CHI TIẾT (TEST CASES)

### KỊCH BẢN 1: Khách Vãng Lai (Guest / Unauthenticated User)

| STT | Bước thực hiện | Kết quả mong đợi | Trạng thái |
| :---: | :--- | :--- | :---: |
| **1.1** | Mở trình duyệt ẩn danh (Incognito), truy cập http://localhost:3000/ | - Trang chủ tải mượt mà, hiển thị đầy đủ Banner chính, Phim đang chiếu, Combo, Khuyến mãi.<br>- Không bị hiện cửa sổ bắt buộc đăng nhập. | [ ] Pass / [ ] Fail |
| **1.2** | Truy cập trực tiếp liên kết cá nhân http://localhost:3000/profile | - Next.js Edge Proxy (proxy.ts) chặn lại và chuyển hướng về trang chủ /?auth=login.<br>- Cửa sổ Đăng nhập tự động mở để mời người dùng đăng nhập. | [ ] Pass / [ ] Fail |
| **1.3** | Truy cập trực tiếp trang quản trị http://localhost:3000/admin | - Edge Proxy chặn ngay ở tầng máy chủ và chuyển hướng tức thì về http://localhost:3000/admin/login. | [ ] Pass / [ ] Fail |

---

### KỊCH BẢN 2: Tài Khoản Khách Hàng Thông Thường (Customer Isolation)

| STT | Bước thực hiện | Kết quả mong đợi | Trạng thái |
| :---: | :--- | :--- | :---: |
| **2.1** | Tại trang chủ http://localhost:3000, bấm Đăng nhập tài khoản Khách hàng (customer) | - Đăng nhập thành công, thanh điều hướng hiển thị tên và ảnh đại diện khách hàng.<br>- Vào trang /profile xem thông tin vé và tích điểm bình thường. | [ ] Pass / [ ] Fail |
| **2.2** | Khi đang đăng nhập tài khoản Khách hàng, nhập địa chỉ http://localhost:3000/admin | - adminAuthMapper nhận diện vai trò customer, từ chối cấp quyền (trả về null).<br>- Hệ thống tự động chuyển hướng về /admin/login, tuyệt đối không hiển thị giao diện Admin. | [ ] Pass / [ ] Fail |
| **2.3** | Thử nhập liên kết sâu http://localhost:3000/admin/pricing-rules hoặc /admin/campaign | - Bị chặn lại và chuyển hướng về /admin/login. Dữ liệu quản trị không bị rò rỉ. | [ ] Pass / [ ] Fail |

---

### KỊCH BẢN 3: Đăng Nhập Quản Trị và Ma Trận Phân Quyền (RBAC Verification)

| STT | Bước thực hiện | Kết quả mong đợi | Trạng thái |
| :---: | :--- | :--- | :---: |
| **3.1** | Truy cập http://localhost:3000/admin/login, nhập email admin@cinedot.com / password | - Đăng nhập thành công, vào thẳng trang Bảng điều hành quản trị /admin.<br>- Thanh menu bên trái hiển thị đầy đủ tất cả các mục quản trị. | [ ] Pass / [ ] Fail |
| **3.2** | Truy cập /admin/pricing-rules bằng quyền Super Admin | - Trang tải danh sách Quy tắc định giá từ cơ sở dữ liệu thực tế.<br>- Admin có thể bấm Bật/Tắt trạng thái hoặc Thêm/Sửa/Xóa quy tắc giá. | [ ] Pass / [ ] Fail |
| **3.3** | Truy cập /admin/campaign, /admin/campaign/voucher, /admin/campaign/banner | - Hiển thị danh sách Chiến dịch, Mã voucher và Banner từ cơ sở dữ liệu thực tế.<br>- Menu Marketing dạng danh sách thả xuống (dropdown) hoạt động mượt mà. | [ ] Pass / [ ] Fail |
| **3.4** | Đăng nhập bằng tài khoản Nhân viên soát vé (TICKET_STAFF) | - Hệ thống tự động điều hướng thẳng đến Cổng soát vé /admin/ticket-scanner.<br>- Menu bên trái chỉ hiển thị các mục được phân quyền. | [ ] Pass / [ ] Fail |
| **3.5** | Tài khoản TICKET_STAFF cố truy cập /admin/pricing-rules hoặc /admin/users-staff | - Giao diện hiển thị màn hình cảnh báo 403 FORBIDDEN ACCESS - Truy cập bị từ chối.<br>- Có nút Quay lại hoặc Đến Cổng soát vé. | [ ] Pass / [ ] Fail |

---

### KỊCH BẢN 4: Dữ Liệu Thực Tế (Real API Data - Không Dùng Dữ Liệu Mẫu Giả)

| STT | Bước thực hiện | Kết quả mong đợi | Trạng thái |
| :---: | :--- | :--- | :---: |
| **4.1** | Vào trang /admin/pricing-rules, kiểm tra dữ liệu | - Danh sách hiển thị đúng các bản ghi thực tế từ cơ sở dữ liệu backend.<br>- Khi tắt máy chủ backend hoặc rỗng dữ liệu, bảng hiển thị trạng thái "Chưa có quy tắc nào" (không tự ý nạp dữ liệu mẫu giả). | [ ] Pass / [ ] Fail |
| **4.2** | Vào trang /admin/campaign/voucher, kiểm tra voucher | - Hiển thị đúng mã voucher trong cơ sở dữ liệu thực tế.<br>- Thử tạo 1 voucher mới -> Danh sách cập nhật ngay lập tức. | [ ] Pass / [ ] Fail |

---

### KỊCH BẢN 5: Chức Năng Đăng Xuất Triệt Để (Clean Logout)

| STT | Bước thực hiện | Kết quả mong đợi | Trạng thái |
| :---: | :--- | :--- | :---: |
| **5.1** | Tại thanh tiêu đề Admin (hoặc trang Cá nhân), nhấn nút Đăng xuất | - Đăng xuất thành công, chuyển hướng về trang /admin/login (hoặc /).<br>- Không có lỗi xuất hiện trong bảng Console trình duyệt. | [ ] Pass / [ ] Fail |
| **5.2** | Mở Công cụ nhà phát triển (F12) -> Thẻ Ứng dụng (Application): | | |
| | - Mục Cookies (http://localhost:3000) | -> cine_token, cinedot_token, cinedot_admin_token đều đã bị xóa sạch hoàn toàn. | [ ] Pass / [ ] Fail |
| | - Mục Lưu trữ cục bộ (Local Storage) | -> cinedot_user, cinedot_admin_user, cinedot_admin_permissions đều đã được dọn dẹp sạch sẽ. | [ ] Pass / [ ] Fail |
| **5.3** | Bấm nút Quay lại (Back) trên trình duyệt sau khi đã Đăng xuất | - Không thể xem lại các trang quản trị cũ; hệ thống tự động đưa về /admin/login. | [ ] Pass / [ ] Fail |

---

## 3. LỆNH KIỂM TRA CHẤT LƯỢNG MÃ NGUỒN

Chạy lệnh sau tại thư mục cinedot để kiểm tra tính toàn vẹn của mã nguồn TypeScript:
```bash
npx tsc --noEmit
```
Kết quả đạt yêu cầu: Exit code 0 (0 lỗi).
