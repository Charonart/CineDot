# 🎬 CineDot Enterprise Cinema System

> **Hệ thống Quản lý Chuỗi Rạp Chiếu Phim Doanh Nghiệp (Admin/POS) & Cổng Đặt Vé Trực Tuyến (User Portal)**  
> Phát triển bằng **Next.js 14 App Router**, **React 18**, **TypeScript**, **TailwindCSS**, **Framer Motion** và Thuật toán tối ưu xếp lịch **AI CSP Engine**.

---

## 📌 MỤC LỤC

1. [Tổng Quan Dự Án](#-tổng-quan-dự-án)
2. [Các Tính Năng Đột Phá](#-các-tính-năng-đột-phá)
3. [Cấu Trúc Thư Mục Dự Án](#-cấu-trúc-thư-mục-dự-án)
4. [Hướng Dẫn Cài Đặt & Chạy Dự Án](#-hướng-dẫn-cài-đặt--chạy-dự-án)
5. [Cấu Hồi Biến Môi Trường (.env)](#-cấu-hình-biến-môi-trường-env)
6. [Hướng Dẫn Đăng Nhập & Truy Cập (Admin & User)](#-hướng-dẫn-đăng-nhập--truy-cập-admin--user)
7. [Sơ Đồ Đường Dẫn Routing Map](#-sơ-đồ-đường-dẫn-routing-map)

---

## 🌟 TỔNG QUAN DỰ ÁN

**CineDot Enterprise** là giải pháp toàn diện cho chuỗi rạp chiếu phim hiện đại (mô hình CGV, Lotte Cinema, Galaxy Studio, Beta Cinemas). Hệ thống giải quyết 2 bài toán cốt lõi trong ngành điện ảnh:

1. **Cổng Trải Nghiệm Khách Hàng (User Portal)**: Đặt vé trực tuyến, chọn vị trí ghế theo sơ đồ 2D/3D trực quan, mua đồ ăn F&B kèm theo, săn voucher khuyến mãi và quản lý ví vé đã mua.
2. **Hệ Thống Bảng Điều Hành Quản Trị (Admin/POS System)**:
   - Tối đa hóa tỷ lệ lấp đầy ghế (**Occupancy Rate**) và doanh thu trung bình trên mỗi phòng chiếu (**RevPAS**).
   - Tự động hóa xếp lịch chiếu 24h phủ kín bằng thuật toán **Constraint Satisfaction Problem (CSP)**.
   - Cảnh báo ùn tắc sảnh quầy bắp nước F&B khi các phòng chiếu trùng giờ khởi chiếu.

---

## 🚀 CÁC TÍNH NĂNG ĐỘT PHÁ

### 🤖 1. Trình Xếp Lịch Phim AI Auto-Schedule (CSP Engine):
- **Thuật toán CSP + Greedy Backtracking (<30ms)**: Phân bổ phim bom tấn vào giờ vàng (18:00 - 21:30) tại các phòng chiếu lớn nhất (IMAX 3D Laser), tự động tính toán thời gian dọn rạp (15-20 phút) và gán phim hoạt hình vào ca sáng.
- **Hỗ trợ 2 Chế độ**:
  - `Incremental Fill`: Chỉ tự động lấp đầy vào các khoảng trống trong lịch chiếu.
  - `Regenerate All`: Xóa và tạo mới lịch chiếu 24h phủ kín từ 08:00 đến 24:00.

### 🚦 2. Cảnh Báo Ùn Tắc Sảnh F&B (Staggering Guard):
- Phát hiện và hiển thị cảnh báo `⚠️ Gợi ý: Lệch 15p F&B` khi 2 phòng chiếu trùng nấc phút khởi chiếu (vd: 18:00 & 18:00), giúp chia nhỏ dòng 350+ khách ra vào rạp, tránh nghẽn quầy bắp nước.

### 🔒 3. Ổ Khóa An Toàn Vé Đã Bán (Published Seat Hard Lock):
- Tự động gán nhãn `🔒 Hard Lock` cho các suất chiếu đã phát sinh vé đặt (`bookedSeats > 0`). Vô hiệu hóa thao tác sửa hoặc kéo thả để bảo vệ quyền lợi khách hàng.

### 📈 4. Ma Trận Đánh Đổi Doanh Thu (Trade-off Profit Matrix):
- Tự động phát hiện các suất chiếu bán chậm (`🧊 BÁN CHẬM` <20% ghế) và tính toán khoảng chênh lệch lợi nhuận ròng (**Net Profit Delta +13.3M VNĐ**) khi thay thế bằng phim hot (`🔥 CHÁY VÉ`).

### 📍 5. Thanh Chỉ Giờ Kéo Thả Phát Sáng (Vertical Drag Alignment Line):
- Đường kẻ dọc phát sáng màu tím chạy bám sát con chuột khi kéo thả thẻ phim, đi kèm **Tooltip mốc giờ nổi `📍 14:30`** và tính năng **Nam châm tự động hút (Snap)** vào mốc 15 phút.

---

## 📁 CẤU TRÚC THƯ MỤC DỰ ÁN

```text
CineDot/
├── public/                     # Static assets (images, icons)
├── src/
│   ├── app/                    # Next.js 14 App Router Pages
│   │   ├── (client)/           # User Facing Routes (Home, Movies, Cinemas...)
│   │   ├── admin/              # Admin Executive Dashboard Routes
│   │   ├── login/              # Login & Authentication Page
│   │   └── api/                # API Route Handlers
│   ├── components/             # Global Reusable UI Components
│   ├── lib/                    # Shared Libraries (Axios Client, Utils)
│   └── modules/                # Domain-Driven Modules
│       ├── admin/              # Admin Showtime, Cinema & Ticket Modules
│       ├── booking/            # Seat Map & Ticket Checkout Modules
│       ├── events/             # Events & Promotion Modules
│       ├── movies-listing/     # Movies Catalog Modules
│       ├── special-theaters/   # IMAX, 4DX, VIP Gold Class Modules
│       └── user-profile/       # Account & Tickets History Modules
├── .env.example                # Template biến môi trường
├── .gitignore                  # Git ignore rules (Đã ẩn ai_design_prompts/)
├── package.json                # Project dependencies & scripts
└── README.md                   # Tài liệu hướng dẫn dự án
```

---

## 🛠️ HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN

### 1. Yêu Cầu Môi Trường (Prerequisites):
- **Node.js**: Phiên bản `v18.17.0` trở lên (Khuyến nghị `v20.x`).
- **Package Manager**: `npm` (đã đi kèm Node.js) hoặc `pnpm`/`yarn`.

### 2. Các Thư Viện Đang Sử Dụng Trong Dự Án:

| Thư Viện / Package | Phiên Bản | Mục Đích Sử Dụng |
| :--- | :--- | :--- |
| `next` | `^14.2.5` | Framework React SSR/SSG & App Router |
| `react` / `react-dom` | `^18.3.1` | Thư viện UI cốt lõi |
| `typescript` | `^5.5.4` | Kiểm soát kiểu dữ liệu an toàn |
| `tailwindcss` | `^3.4.1` | Styling giao diện theo chuẩn Utility-First |
| `framer-motion` | `^11.3.21` | Hiệu ứng chuyển động & Animation mượt mà |
| `lucide-react` | `^0.424.0` | Bộ Icon vector hiện đại |
| `axios` | `^1.7.3` | Client gọi RESTful API |
| `clsx` / `tailwind-merge` | `^2.1.1` | Tối ưu nối class CSS Tailwind động |

### 3. Lệnh Cài Đặt & Chạy Dự Án:

```bash
# Step 1: Clone repository từ GitHub về máy
git clone https://github.com/your-username/CineDot.git
cd CineDot

# Step 2: Cài đặt toàn bộ dependencies
npm install

# Step 3: Tạo file cấu hình môi trường từ file template
cp .env.example .env.local

# Step 4: Khởi chạy môi trường phát triển Development (Dev Server)
npm run dev
```

Mở trình duyệt và truy cập: **`http://localhost:3000`**

---

## ⚙️ CẤU HÌNH BIẾN MÔI TRƯỜNG (.env)

Tạo file **`.env.local`** tại thư mục gốc dự án (hoặc sao chép từ `.env.example`):

```env
# Application Meta Configuration
NEXT_PUBLIC_APP_NAME="CineDot Enterprise Cinema"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Backend RESTful API Base URL
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
NEXT_PUBLIC_API_TIMEOUT=15000

# Cinema Operational Default Parameters
NEXT_PUBLIC_DEFAULT_CINEMA_ID="c-1"
NEXT_PUBLIC_DEFAULT_CINEMA_NAME="CineDot Landmark 81 Saigon"
NEXT_PUBLIC_STAGGER_BUFFER_MINUTES=15
NEXT_PUBLIC_CLEANING_BUFFER_MINUTES=20

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_AUTO_SCHEDULER=true
NEXT_PUBLIC_ENABLE_3D_SEAT_MAP=true
NEXT_PUBLIC_ENABLE_MOCK_DATA=true
```

---

## 🔑 HƯỚNG DẪN ĐĂNG NHẬP & TRUY CẬP (ADMIN & USER)

Hệ thống đã tích hợp sẵn tài khoản đăng nhập mẫu cho các vai trò (**Roles**):

### 1. Dành Cho Quản Trị Viên (Admin / Executive Role):
- **Trang Đăng Nhập**: Access đường dẫn `http://localhost:3000/login` hoặc truy cập trực tiếp `http://localhost:3000/admin`
- **Email**: `admin@cinedot.vn`
- **Mật Khẩu**: `admin123`
- **Quyền Hạn**: Toàn quyền quản trị xếp lịch chiếu AI, quản lý danh mục cụm rạp, quản lý vé bán, điều chỉnh bảng giá vé & đồ ăn F&B.

### 2. Dành Cho Khách Hàng (User / Member Role):
- **Trang Đăng Nhập**: Access đường dẫn `http://localhost:3000/login`
- **Email**: `user@cinedot.vn`
- **Mật Khẩu**: `user123`
- **Quyền Hạn**: Xem thông tin phim, đặt vé trực tuyến, chọn ghế, tích điểm thành viên CineMember và quản lý ví vé cá nhân.

---

## 🗺️ SƠ ĐỒ ĐƯỜNG DẪN ROUTING MAP

### 🌐 A. Giao Diện Khách Hàng (User Portal):

| Đường Dẫn (Route) | Tên Trang | Mô Tả Chức Năng |
| :--- | :--- | :--- |
| `/` | **Trang Chủ (Home)** | Banner phim hot, danh sách phim đang chiếu, sắp chiếu, khuyến mãi |
| `/movies` | **Danh Mục Phim** | Bộ lọc phim theo thể loại, độ tuổi, định dạng 2D/3D/IMAX |
| `/movies/[slug]` | **Chi Tiết Phim** | Trailer, tóm tắt nội dung, đánh giá điểm số & lịch chiếu theo rạp |
| `/cinemas` | **Cụm Rạp & Phòng Chiếu** | Thông tin rạp, địa chỉ, bản đồ Google Maps, trải nghiệm IMAX/4DX |
| `/events` | **Sự Kiện & Khuyến Mãi** | Chương trình ưu đãi, voucher giảm giá, sự kiện bom tấn |
| `/profile` | **Hồ Sơ Cá Nhân** | Quản lý thông tin tài khoản, lịch sử giao dịch & Ví vé đã mua |

---

### 🛡️ B. Giao Diện Bảng Điều Hành Quản Trị (Admin Dashboard):

| Đường Dẫn (Route) | Tên Trang | Mô Tả Chức Năng |
| :--- | :--- | :--- |
| `/admin` | **Admin Dashboard** | Thống kê tổng quan doanh thu, tỷ lệ lấp đầy ghế & RevPAS |
| `/admin/showtimes` | **Quản Lý Suất Chiếu** | **Trình xếp lịch AI CSP Engine**, Kéo thả lịch chiếu 24h, Khóa vé |
| `/admin/cinemas` | **Quản Lý Cụm Rạp** | Quản lý danh sách cụm rạp, phòng chiếu & sơ đồ ghế |
| `/admin/movies` | **Quản Lý Phim** | Thêm/sửa/xóa thông tin phim, thời lượng & thời gian dọn rạp |
| `/admin/tickets` | **Quản Lý Vé Bán** | Tra cứu giao dịch đặt vé, quét mã QR check-in vào rạp |
| `/admin/concessions` | **Quản Lý Đồ Ăn F&B** | Quản lý danh mục Bắp nước, Combo cặp đôi & báo cáo tồn kho |

---

## 👨‍💻 THÔNG TIN ĐỒ ÁN & LƯU Ý KHI COMMIT GITHUB

- ⚠️ **Lưu ý Quan trọng khi Push Code lên GitHub**:
  - Folder `ai_design_prompts/` chứa các tài liệu prompt nội bộ **đã được thêm vào `.gitignore`** và sẽ KHÔNG bị push lên GitHub.
  - File `.env.local` chứa thông tin cấu hình local cũng được ẩn theo chuẩn bảo mật. Team khi clone dự án chỉ cần sao chép file `.env.example` thành `.env.local` là chạy trực tiếp!

---

*CineDot Enterprise System — Built with Passion & AI Optimization.*
