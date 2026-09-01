# CineDot Frontend - Hướng Dẫn Kỹ Thuật & Tài Liệu Triển Khai Technical SEO (Next.js App Router)

Tài liệu chi tiết về toàn bộ các cải tiến và giải pháp Technical SEO đã được triển khai tại Frontend Next.js của dự án CineDot, tích hợp trực tiếp với hệ thống API của Backend Laravel.

---

## 1. Danh Sách Các Trang Đã Tối Ưu SEO

| Đường dẫn (URL) | Loại trang | Rendering | Canonical URL | Schema Structured Data |
| :--- | :--- | :--- | :--- | :--- |
| `/` | Trang chủ | Server Component + Client Islands | `https://cinedot.vn/` | `WebSite`, `Organization` |
| `/movies` | Danh sách phim | Server Component + Client Tabs | `https://cinedot.vn/movies` | `CollectionPage` / `BreadcrumbList` |
| `/movies/now-showing` | Phim đang chiếu | Server Component + Client Tabs | `https://cinedot.vn/movies/now-showing` | `BreadcrumbList` |
| `/movies/coming-soon` | Phim sắp chiếu | Server Component + Client Tabs | `https://cinedot.vn/movies/coming-soon` | `BreadcrumbList` |
| `/movies/[slug]` | Chi tiết phim | Server Component (SSR) + Client Actions | `https://cinedot.vn/movies/[slug]` | `Movie` (kèm `VideoObject` trailer), `BreadcrumbList` |
| `/cinemas` | Hệ thống rạp & bảng giá | Server Component + Suspense | `https://cinedot.vn/cinemas` | `CollectionPage` / `BreadcrumbList` |
| `/cinemas/[slug]` | Chi tiết rạp & lịch chiếu rạp | Server Component (SSR) + Client Tabs | `https://cinedot.vn/cinemas/[slug]` | `MovieTheater`, `BreadcrumbList` |
| `/showtimes` | Trang lịch chiếu toàn quốc | Server Component | `https://cinedot.vn/showtimes` | `WebPage` |
| `/sitemap.xml` | Sitemap động Next.js | Server-generated (`app/sitemap.ts`) | N/A | Chuẩn XML Sitemap Protocol |
| `/robots.txt` | Robots directives | Server-generated (`app/robots.ts`) | N/A | Robots Exclusion Protocol |

---

## 2. Chi Tiết Triển Khai Kỹ Thuật

### 2.1. Chuẩn Hóa URL Sạch (Clean URLs) & Xử Lý Hash Fragment (`#showtime-schedule`)
* **Vấn đề trước đây**: Các nút "Mua vé", "Xem lịch chiếu" từ trang chủ, danh sách phim và dropdown điều hướng dẫn người dùng tới URL kèm hash fragment dạng `/movies/{slug}#showtime-schedule`.
* **Ảnh hưởng SEO & Trải nghiệm**:
  * Chuẩn SEO Google khuyến nghị các liên kết nội bộ (Internal Links) phải trỏ về URL chính thống (Clean Canonical URL) dạng `/movies/{slug}`, tránh phân mảnh liên kết và giảm tỷ lệ duplicate URL khi chia sẻ.
  * Hash fragment `#...` không được máy chủ xử lý và crawler không thể phân tích riêng.
* **Giải pháp đã triển khai**:
  * Loại bỏ hoàn toàn fragment `#showtime-schedule` trong tất cả các lệnh điều hướng router (`router.push`) và thẻ `<Link>` tại:
    - [MoviesMegaDropdown.tsx](file:///d:/hocky6/CineDot/src/shared/components/layout/MoviesMegaDropdown.tsx)
    - [HeroSlider.tsx](file:///d:/hocky6/CineDot/src/modules/home/components/HeroSlider.tsx)
    - [MovieTabsSection.tsx](file:///d:/hocky6/CineDot/src/modules/home/components/MovieTabsSection.tsx)
    - [MovieGridCard.tsx](file:///d:/hocky6/CineDot/src/modules/movies-listing/components/MovieGridCard.tsx)
    - [MoviesHeroShowcase.tsx](file:///d:/hocky6/CineDot/src/modules/movies-listing/components/MoviesHeroShowcase.tsx)
    - [ExpiredShowtimeModal.tsx](file:///d:/hocky6/CineDot/src/modules/booking/components/ExpiredShowtimeModal.tsx)
  * Giữ nguyên trải nghiệm người dùng: Khi ở trong trang chi tiết phim, nút "Mua vé" vẫn tự động cuộn mượt xuống khu vực lịch chiếu thông qua `element.scrollIntoView({ behavior: 'smooth' })` mà không làm thay đổi hay làm xấu URL trên thanh địa chỉ.

### 2.2. Root Layout & Global Metadata (`src/app/layout.tsx`)
* **`metadataBase`**: Cấu hình `new URL(siteUrl)` để mọi relative path trong OpenGraph và Canonical tự động phân giải thành full domain URL.
* **Title Template**: `%s | CineDot` giúp mọi trang con tự động gắn thương hiệu CineDot đồng nhất.
* **Default Metadata**: Title, Description chuẩn SEO tiếng Việt không bị lỗi encoding/mojibake.
* **Robots Configuration**: Cho phép GoogleBot thu thập dữ liệu với `max-image-preview: large`, `max-video-preview: -1`, `max-snippet: -1`.
* **Global JSON-LD**: Gắn schema `WebSite` (hỗ trợ `SearchAction` dẫn vào `/movies?search=...`) và `Organization` đại diện thương hiệu CineDot.

### 2.3. Chi Tiết Phim (`src/app/(public)/movies/[slug]/page.tsx`)
* **Dynamic Metadata (`generateMetadata`)**:
  * Gọi API Backend: `GET /api/v1/movies/{slug}`.
  * Title động: `${movie.title} - Lịch chiếu & Đặt vé | CineDot`.
  * Meta Description trích xuất từ `movie.synopsis` (tối đa 160 ký tự).
  * Keywords đa dạng: Tên phim, tựa gốc, lịch chiếu, đặt vé, giá vé, trailer và các thể loại phim.
  * OpenGraph: `type: 'video.movie'`, hình ảnh poster và backdrop tỉ lệ 1200x630, `locale: vi_VN`.
  * Twitter Card: `card: 'summary_large_image'`, đầy đủ tiêu đề, mô tả và poster.
  * Canonical URL: Cố định tuyệt đối tại `${siteUrl}/movies/${movie.slug}`, loại bỏ mọi query param và hash fragment.
  * Robots directives: Cho phép lập chỉ mục rõ ràng và hiển thị snippet lớn (`index: true, follow: true`).
* **Server-Side Rendering (SSR)**:
  * Fetch dữ liệu phim trực tiếp trên Server và truyền vào `MovieDetailPageClient` qua prop `initialMovie`.
  * Tránh hoàn toàn việc render skeleton rỗng khi crawler truy cập; crawler nhận ngay HTML đầy đủ với thẻ `<h1>{movie.title}</h1>`, thể loại, đạo diễn, diễn viên và tóm tắt phim.
* **404 Handling**: Nếu slug không tồn tại trong CSDL, lập tức kích hoạt `notFound()`, trả về HTTP 404 chuẩn SEO thay vì HTTP 200 trang trắng.
* **Structured Data (JSON-LD)**:
  * `@type: Movie`:
    * Bao gồm `name`, `alternateName`, `image`, `description`, `dateCreated`, `datePublished`, `genre`, `duration` (chuẩn ISO 8601 `PT...M`), `contentRating` (độ tuổi), `countryOfOrigin` (`Country`).
    * `director` (đạo diễn) và `actor` (top 10 diễn viên).
    * `aggregateRating`: Đánh giá sao trung bình và số lượng bình chọn thực tế.
    * `trailer` (`VideoObject`): Tự động khai báo tên, mô tả, thumbnail poster và đường dẫn nhúng YouTube giúp kích hoạt Video Rich Snippet trên Google.
  * `@type: BreadcrumbList`: Trang chủ -> Danh sách phim -> Tên phim.

### 2.4. Danh Sách Phim & Phân Loại (`/movies`, `/movies/now-showing`, `/movies/coming-soon`)
* **Trang `/movies`**:
  * Tự động nhận diện query `tab` hoặc `category` (`coming-soon` hoặc `now-showing`) để tạo thẻ `<title>`, `<meta name="description">` và từ khóa tương ứng.
  * Thêm schema `@type: CollectionPage` mô tả danh mục phim đang chiếu / sắp chiếu và `@type: BreadcrumbList`.
  * Canonical URL trỏ về URL tuyệt đối tương ứng.
* **Trang `/movies/now-showing` & `/movies/coming-soon`**:
  * Trang đích tĩnh riêng cho từng nhóm phim với thẻ Canonical URL độc lập, ngăn ngừa duplicate content.
  * Đầy đủ OpenGraph, Twitter Cards, bộ keywords chất lượng cao và schema `BreadcrumbList`.

### 2.5. Chi Tiết Cụm Rạp (`src/app/(public)/cinemas/[slug]/page.tsx`)
* **Dynamic Route Mới**: Được tạo mới hoàn chỉnh để tạo landing page indexable cho từng cụm rạp.
* **Dynamic Metadata (`generateMetadata`)**:
  * Gọi API Backend: `GET /api/v1/cinemas/detail/{slug}`.
  * Title động: `${cinema.name} - Lịch chiếu & Thông tin rạp | CineDot`.
  * Meta Description chứa địa chỉ, thành phố, hotline và mô tả cụ thể của rạp.
  * Canonical URL: `/cinemas/${cinema.slug}`.
* **Server-Side Rendering**:
  * Tải đồng thời trên Server thông tin rạp, bảng giá vé định dạng 2D/3D/IMAX và danh sách suất chiếu trong ngày.
  * Render HTML semantic với thẻ `<nav aria-label="Breadcrumb">`, `<header>` chứa `<h1>{cinema.name}</h1>`, địa chỉ chi tiết, hotline liên hệ, bảng giá vé và danh sách suất chiếu.
* **Structured Data (JSON-LD)**:
  * `@type: MovieTheater`: Tên rạp, địa chỉ `PostalAddress` (đầy đủ đường phố, thành phố, quốc gia VN), số điện thoại, ảnh rạp.
  * `@type: BreadcrumbList`: Trang chủ -> Hệ thống rạp -> Tên rạp.

### 2.6. Sitemap Tự Động (`src/app/sitemap.ts`)
* Tích hợp trực tiếp endpoint tối ưu của Backend: `GET /api/v1/sitemap`.
* Đã bổ sung các URL tĩnh & landing page danh mục quan trọng:
  * Trang chủ `/` (priority 1.0)
  * Danh sách phim `/movies`, `/movies/now-showing` (priority 0.9)
  * Phim sắp chiếu `/movies/coming-soon` (priority 0.85)
  * Hệ thống rạp `/cinemas` (priority 0.8)
  * Lịch chiếu toàn quốc `/showtimes` (priority 0.85)
* Index nội dung động từ Backend:
  * Phim có trạng thái `now_showing` hoặc `upcoming`.
  * Cụm rạp có trạng thái `is_active = true`.
* Sử dụng trường `updated_at` từ Backend để điền vào thuộc tính `lastModified`, giúp crawler phát hiện nội dung mới cập nhật chính xác.
* Tuyệt đối loại bỏ các đường dẫn riêng tư: `/admin/`, `/booking/`, `/checkout/`, `/login`, `/register`, `/profile`.

### 2.7. Robots.txt (`src/app/robots.ts`)
* Cho phép crawler thu thập dữ liệu toàn bộ các trang public (`/`).
* Chặn các phân vùng riêng tư hoặc giao dịch thanh toán:
  * `/admin/`
  * `/booking/`
  * `/checkout/`
  * `/login`
  * `/register`
  * `/profile`
  * `/api/`
* Khai báo liên kết sitemap chính thức: `${baseUrl}/sitemap.xml`.

---

## 3. Danh Sách Endpoint API Sử Dụng Cho SEO

1. **`GET /api/v1/sitemap`**: Trả về danh sách slug và `updated_at` của tất cả phim public và rạp active cho `app/sitemap.ts`.
2. **`GET /api/v1/movies/{slug}`**: Lấy chi tiết phim cho Dynamic Metadata và SSR của `/movies/[slug]`.
3. **`GET /api/v1/cinemas/detail/{slug}`**: Lấy chi tiết rạp cho Dynamic Metadata và SSR của `/cinemas/[slug]`.
4. **`GET /api/v1/cinemas/detail/{slug}/showtimes`**: Lấy lịch chiếu của rạp phục vụ SSR của `/cinemas/[slug]`.
5. **`GET /api/v1/cinemas/pricing`**: Lấy bảng giá vé rạp cho trang rạp chiếu.

---

## 4. Hướng Dẫn Kiểm Thử (Testing Guide)

* **Kiểm tra cú pháp & Type-checking**:
  ```bash
  npx tsc --project tsconfig.json --noEmit
  ```
* **Kiểm tra Sitemap**:
  Truy cập `http://localhost:3000/sitemap.xml` để xác nhận file XML chứa danh sách URL phim, rạp và ngày `lastModified`.
* **Kiểm tra Robots**:
  Truy cập `http://localhost:3000/robots.txt` để xác nhận các rule Allow/Disallow và đường dẫn sitemap.
* **Kiểm tra Rich Results (Google Structured Data)**:
  Sử dụng công cụ [Google Rich Results Test](https://search.google.com/test/rich-results) dán URL hoặc mã nguồn trang `/movies/[slug]` để kiểm tra Schema `Movie` và `BreadcrumbList`.
* **Kiểm tra View Source (SSR Verification)**:
  Nhấn `Ctrl + U` (View Source) tại trang `/movies/[slug]` hoặc `/cinemas/[slug]` để kiểm tra các thẻ `<h1>`, `<meta name="description">`, `<meta property="og:title">` và đoạn mã JSON-LD đã xuất hiện đầy đủ trong HTML ban đầu.