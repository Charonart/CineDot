# CineDot AI Engineering Rules

## 1. Project Overview
**CineDot** là hệ thống quản lý phim Production-level. 
- **Frontend/Backend Separation**: Frontend (Next.js) hoàn toàn tách biệt với Backend (Laravel).
- **TMDB Integration**: Laravel đóng vai trò Proxy/Adapter, Frontend không gọi trực tiếp TMDB.

## 2. Core Architecture Principles
- **DTO-first**: Luôn định nghĩa DTO trước khi code.
- **Feature-first**: Tổ chức code theo module tính năng (`src/modules`).
- **Layered Architecture**: API -> Service -> Hook -> UI.
- **Separation of Concerns**: Tách biệt business logic khỏi presentation.

## 3. Frontend Rules
- **KHÔNG** gọi axios trực tiếp trong component.
- **KHÔNG** sử dụng raw TMDB response.
- **KHÔNG** đặt business logic trong UI.
- **Hooks/Service**: Phải sử dụng Service thông qua Custom Hooks.

## 4. Backend Rules
- Laravel chuẩn hóa dữ liệu từ TMDB thành các DTO sạch.
- API Versioning: Sử dụng `/api/v1/`.
- Standardized Errors: `{ success: false, message: string, code: string }`.

## 5. DTO Rules
- Naming: `SomethingDTO`.
- Ownership: Định nghĩa trong module tương ứng (`dto/`).
- Mapper: Bắt buộc dùng Mapper để transform DTO sang Domain Model.

## 6. Query Rules
- Bắt buộc dùng **Query Key Factory**.
- `staleTime`: 5m, `gcTime`: 30m mặc định.
- Sử dụng `query cancellation` cho search/list.

## 7. State Management Rules
- **Tanstack Query**: Cho Server State (mặc định).
- **Zustand**: Chỉ dùng cho UI/Client State (theme, sidebar).

## 8. Mock Strategy
- Sử dụng `mockRoutes.ts` để map API sang file JSON trong `public/mocks`.
- Mock phải khớp 100% với Production Contract.

## 9. Image Strategy
- Bắt buộc dùng `imageHelper.ts`.
- Hỗ trợ responsive sizes: `sm`, `md`, `lg`, `original`.

## 10. Error Handling Rules
- Sử dụng `ApiError` type chuẩn.
- Tích hợp `error.tsx` và `global-error.tsx`.

## 11. SSR/SEO Rules
- Movie Detail BẮT BUỘC dùng Server Component và `generateMetadata()`.
- Sử dụng `loading.tsx` với Skeleton System.

## 12. Accessibility Rules
- Semantic HTML.
- Keyboard navigation (focus states).
- `aria-label` cho các tương tác không có label text.

## 13. Forbidden Patterns
- Direct axios calls in components.
- Raw TMDB fields (`poster_path`, `vote_average`).
- Hardcoded URLs.
- `any` type.
- Code UI trước khi có DTO/Schema.
- Re-enabling `display: -webkit-box` on `.mega-movie-title` (unless the Vietnamese clipping issue is tested again manually).

## 14. Mandatory Development Workflow
Mọi feature PHẢI tuân theo thứ tự:
1. **DTO** -> 2. **Schema** -> 3. **Types** -> 4. **Mapper** -> 5. **API** -> 6. **Service** -> 7. **Query Hook** -> 8. **Mock Data** -> 9. **UI Component**.

## 15. Current Folder Structure
- `app/`: Next.js Routing & Layouts.
- `modules/`: Feature-based logic.
- `shared/`: Reusable UI & Utils.
- `lib/`: Core libraries configuration.
- `mocks/`: Mock mapping.
- `docs/`: Persistent engineering docs.

## 16. Phase History
- **Phase 1 — Foundation**: Cấu trúc thư mục, Axios, QueryClient, Env validation.
- **Phase 2 — Data Layer**: DTO, Mappers, Zod Schemas cho Movie module.
- **Phase 3 — Shared UI**: MovieCard, Skeleton, UI States.
- **Phase 4 — Pages**: Home, Movie Detail (SSR), Search (Debounced).
- **Phase 5 — Optimization**: Route Groups, Metadata, Error Boundaries.

## 17. Remaining Scalability Risks
- Pagination/Infinite Scroll.
- Auth Module (JWT flow).
- Unit Testing & E2E Testing.
- CI/CD & Monitoring.

## 18. Future Planned Features
- Authentication, Watchlist, Favorites, Ratings, Recommendation System.

## 19. Security Rules
- Never expose secrets to frontend.
- Validate all query params.
- Sanitize user-generated content.
- Use typed request/response contracts.

## 20. Realtime Rules
- Realtime seat states MUST come from backend source of truth.
- Frontend MUST NOT persist booking state locally.
- WebSocket/Event updates should invalidate Query Cache.
- Seat availability must support optimistic updates carefully.

## 21. Mandatory Visual Visibility Rule
Khi migrate bất kỳ section/component nào từ template sang Next.js, agent không được chỉ dựa vào `npm run build`, `npm run lint`, `npx tsc --noEmit`. 
Bắt buộc phải kiểm tra component thật sự hiển thị trên `http://localhost:3000/` hoặc route tương ứng.

### Checklist bắt buộc:
1. Component đã được import đúng.
2. Component đã được render đúng trong page.
3. Component không return null.
4. Component không bị `opacity: 0`.
5. Component không bị `display: none`.
6. Component không bị `visibility: hidden`.
7. Component không bị `height: 0`.
8. Nếu dùng animation class như `fade-up`, `scroll-text-slide-left`, phải có class `in-view` trong giai đoạn static migration.
9. Nếu dùng tab/modal, default active state phải hiển thị đúng.
10. Footer không được xuất hiện ngay sau một khoảng trắng lớn do section invisible.
11. Không được báo “Visual Parity 100%” nếu chưa kiểm tra bằng mắt trên browser.
12. Nếu giao diện có khoảng trắng lớn bất thường, phải debug visibility/height/position trước khi qua task tiếp theo.

**Bài học cốt lõi:**
> “Build pass does not mean UI is visible.”

## 22. Shared Visual Components Guidelines
Để bảo tồn 100% Visual Parity và nâng cao tính tái sử dụng, hãy sử dụng các shared components được định nghĩa dưới `@/shared/components/visual`:

1. **VideoPlayer (`@/shared/components/visual/VideoPlayer`)**:
   - **Custom Cinematic Controls**: Tắt thanh native controls mặc định của trình duyệt, khôi phục 100% bộ điều khiển custom: timeline scrubber, buffered progress, center play buttons, volume ranges, mute toggles và time display.
   - **Playable UI must fail gracefully**: Không bao giờ để VideoPlayer bị kẹt ở trạng thái màn hình đen cùng spinner loading vô tận.
   - **Poster Fallback**: Khi thiếu `src` hoặc gặp lỗi phát video (`onError`), bắt buộc lập tức tắt loading spinner và hiện poster fallback kèm thông báo tinh tế "Trailer đang được cập nhật".
   - **Spinner Loading Condition**: Spinner chỉ hiển thị khi `isLoading === true` và `hasError === false`. Tắt spinner khi tải xong hoặc gặp lỗi.
   - **YouTube Clean Embeds**: Tự động nhận diện liên kết YouTube, chuyển đổi sang mã nhúng `iframe` sạch, cho phép phát mượt mà mà không gặp lỗi giải mã định dạng của HTML5.

2. **TrailerModal (`@/shared/components/visual/TrailerModal`)**:
   - Modal xem trailer chuẩn Cinematic Overlay.
   - Sử dụng đúng cấu trúc DOM của template `.modal-overlay.open` để hỗ trợ hiệu ứng chuyển cảnh mượt mà.
   - Chỉ render khi `isOpen` đạt giá trị `true` để tránh chiếm dụng layout DOM hoặc che khuất giao diện.
   - Hỗ trợ đầy đủ các hình thức tắt modal: Nút X, Click vùng trống Overlay, Nhấn phím `Escape`.

3. **HighlightText (`@/shared/components/visual/HighlightText`)**:
   - Sử dụng client-side rendering kết hợp với `ResizeObserver` để tự động vẽ các dải vẽ SVG (`underline`, `box`, `circle`, `marker`) chuẩn xác xung quanh nội dung text.
   - Tránh dùng style inline cố định kích thước, thay vào đó hãy để nó tự động thích ứng với kích thước text của phần tử cha.

4. **ScrollTextSlideLeft (`@/shared/components/visual/ScrollTextSlideLeft`)**:
   - Sử dụng `IntersectionObserver` để tự động kích hoạt class `.in-view` khi người dùng cuộn tới.
   - Mặc định `inView = true` trong giai đoạn static migration để tránh lỗi văn bản bị ẩn (`opacity: 0`).

## 23. Video Player Fallback & Layering Rules
1. **Decorative Blur Layering**:
   - **z-index Separation**: Các lớp hình ảnh mờ trang trí phía sau phải được định cấu hình tuyệt đối `position: absolute`, `z-index: 0` và `pointer-events: none` để không cản trở tương tác.
   - **Sharp Player content**: Thẻ chứa trình phát chính (`.cine-video-player`) phải có `position: relative` và `z-index: 2` (hoặc cao hơn) để hiển thị rõ nét trên lớp blur nền và nhận được đầy đủ sự kiện click/hover.
   - **No Filter Bleeding**: Nghiêm cấm đặt bộ lọc `filter: blur(...)` trực tiếp trên phần tử cha chứa cả trình phát lẫn các controls, tránh làm mờ nhòe giao diện điều khiển.

**Bài học cốt lõi:**
> “Playable UI must fail gracefully: no infinite black loading screen.”

## 24. Hero Banner Visual-First Rule
When the Home Hero is configured as an image-first carousel:
- Do not render large text content blocks inside the hero.
- The active banner must be the primary focus.
- Side banners must stay visually subordinate through smaller scale, lower opacity, and slight blur.
- Hero slide transitions must never cause layout height shifts.
- Promotion/combo slides should follow the same banner-image system unless a separate redesign is explicitly approved.
- QuickBookingPanel must remain outside transform/filter wrappers.
- Autoplay must be tested manually.
- **Arc Layout Rule**:
  - Image-first hero carousel must not render as a flat horizontal row.
  - Active banner should sit visually higher and centered.
  - Side banners should sit slightly lower, smaller, dimmer, and lightly rotated.
  - The arc must be subtle, not an exaggerated circle.
  - Must manually test visual arc on desktop.

## 25. Quick Booking Readability Rule
- QuickBookingPanel không được quá trong suốt khi nằm trên Hero background.
- QuickBookingPanel trên Hero phải dùng solid white background nếu glassmorphism làm xuyên nền.
- Glassmorphism phải ưu tiên readability.
- Label PHIM/RẠP/NGÀY/SUẤT CHIẾU phải đọc được rõ.
- Disabled fields được phép nhạt hơn nhưng không được gần như invisible.
- Disabled state chỉ được giảm màu text/icon, không làm cả field gần như invisible.
- Không dùng opacity trên toàn bộ booking field vì sẽ làm label/value bị mờ.
- Hover không được thay đổi độ trong suốt của panel.
- Dropdown menu phải dùng nền trắng đặc hoặc gần đặc.
- Build pass không đồng nghĩa QuickBooking dễ đọc.

## 26. Hero Quick Booking Bridge Rule
- QuickBookingPanel phải được anchor vào hero bottom boundary line.
- Bridge position chuẩn là center of panel aligned with boundary between Hero and next section.
- Không đặt QuickBooking quá cao trong Hero.
- Không để Hero dark background kéo dài quá nhiều dưới QuickBooking.
- Section kế tiếp phải reserve padding-top để tránh bị panel đè.
- QuickBooking must remain outside carousel transform wrappers.
- QuickBooking phải được hiển thị nổi bật trên cả 2 nền nhờ z-index đủ cao (tối thiểu z-index: 40).

## 27. Quick Booking Bridge Verification Rule
- Không được chỉ sửa CSS và kết luận thành công.
- Phải verify DOM thật có render QuickBookingPanel.
- Phải verify selector CSS khớp class thật.
- Phải verify CSS file được import.
- Phải verify không có CSS override.
- Phải kiểm tra UI bằng browser screenshot/manual QA.
- Nếu UI không đổi, phải debug import/selector/override trước khi báo hoàn thành.

## 28. Navbar Expandable Search Rule
- Không chạy third-party UI init nếu có nguy cơ overwrite config.
- Search Navbar phải giữ layout ổn định khi expand/collapse (không làm tăng chiều cao Navbar, không đẩy lệch nút Đăng nhập / Đặt vé).
- Không tự tạo search page/API mới nếu task chỉ yêu cầu search UI.
- Nếu Navbar đang là Server Component, ưu tiên tách client component nhỏ thay vì refactor toàn Navbar.
- Manual QA bắt buộc kiểm tra các dropdown menus, login button, booking button sau khi search expand.
- Icon và placeholder trong expanded search phải có spacing tối thiểu 10–12px (dùng absolute icon container và input padding-left).
- Expand/collapse animation không được khựng; wrapper width và form width phải đồng bộ.
- Không dùng transition width CSS xung đột với framer-motion.
- Manual QA phải kiểm tra cả expand và collapse.
- Expandable search trong Navbar không được animate width trực tiếp làm reflow Navbar.
- Phải dùng fixed outer slot + absolute inner animated form nếu nằm trong flex nav-actions.
- Icon button và input phải có spacing rõ ràng; input không được nằm dưới icon.
- Collapse animation phải được manual QA tối thiểu 10 lần.
- Build pass không đồng nghĩa animation không bị layout shift.
- Không dùng fixed expanded-width outer slot trong flex navbar vì sẽ tạo blank gap khi collapsed.
- Outer slot phải chỉ chiếm collapsed icon width (44px).
- Inner form phải absolute và animate width sang trái.
- Search expanded không được làm reflow nav menu/actions.
- Input padding-left phải được verify bằng computed style, không chỉ đọc code (ưu tiên inline style để tránh CSS override).
- Manual QA phải kiểm tra blank gap khi collapsed.
## 7. State Management Rules
- **Tanstack Query**: Cho Server State (mặc định).
- **Zustand**: Chỉ dùng cho UI/Client State (theme, sidebar).

## 8. Mock Strategy
- Sử dụng `mockRoutes.ts` để map API sang file JSON trong `public/mocks`.
- Mock phải khớp 100% với Production Contract.

## 9. Image Strategy
- Bắt buộc dùng `imageHelper.ts`.
- Hỗ trợ responsive sizes: `sm`, `md`, `lg`, `original`.

## 10. Error Handling Rules
- Sử dụng `ApiError` type chuẩn.
- Tích hợp `error.tsx` và `global-error.tsx`.

## 11. SSR/SEO Rules
- Movie Detail BẮT BUỘC dùng Server Component và `generateMetadata()`.
- Sử dụng `loading.tsx` với Skeleton System.

## 12. Accessibility Rules
- Semantic HTML.
- Keyboard navigation (focus states).
- `aria-label` cho các tương tác không có label text.

## 13. Forbidden Patterns
- Direct axios calls in components.
- Raw TMDB fields (`poster_path`, `vote_average`).
- Hardcoded URLs.
- `any` type.
- Code UI trước khi có DTO/Schema.
- Re-enabling `display: -webkit-box` on `.mega-movie-title` (unless the Vietnamese clipping issue is tested again manually).

## 14. Mandatory Development Workflow
Mọi feature PHẢI tuân theo thứ tự:
1. **DTO** -> 2. **Schema** -> 3. **Types** -> 4. **Mapper** -> 5. **API** -> 6. **Service** -> 7. **Query Hook** -> 8. **Mock Data** -> 9. **UI Component**.

## 15. Current Folder Structure
- `app/`: Next.js Routing & Layouts.
- `modules/`: Feature-based logic.
- `shared/`: Reusable UI & Utils.
- `lib/`: Core libraries configuration.
- `mocks/`: Mock mapping.
- `docs/`: Persistent engineering docs.

## 16. Phase History
- **Phase 1 — Foundation**: Cấu trúc thư mục, Axios, QueryClient, Env validation.
- **Phase 2 — Data Layer**: DTO, Mappers, Zod Schemas cho Movie module.
- **Phase 3 — Shared UI**: MovieCard, Skeleton, UI States.
- **Phase 4 — Pages**: Home, Movie Detail (SSR), Search (Debounced).
- **Phase 5 — Optimization**: Route Groups, Metadata, Error Boundaries.

## 17. Remaining Scalability Risks
- Pagination/Infinite Scroll.
- Auth Module (JWT flow).
- Unit Testing & E2E Testing.
- CI/CD & Monitoring.

## 18. Future Planned Features
- Authentication, Watchlist, Favorites, Ratings, Recommendation System.

## 19. Security Rules
- Never expose secrets to frontend.
- Validate all query params.
- Sanitize user-generated content.
- Use typed request/response contracts.

## 20. Realtime Rules
- Realtime seat states MUST come from backend source of truth.
- Frontend MUST NOT persist booking state locally.
- WebSocket/Event updates should invalidate Query Cache.
- Seat availability must support optimistic updates carefully.

## 21. Mandatory Visual Visibility Rule
Khi migrate bất kỳ section/component nào từ template sang Next.js, agent không được chỉ dựa vào `npm run build`, `npm run lint`, `npx tsc --noEmit`. 
Bắt buộc phải kiểm tra component thật sự hiển thị trên `http://localhost:3000/` hoặc route tương ứng.

### Checklist bắt buộc:
1. Component đã được import đúng.
2. Component đã được render đúng trong page.
3. Component không return null.
4. Component không bị `opacity: 0`.
5. Component không bị `display: none`.
6. Component không bị `visibility: hidden`.
7. Component không bị `height: 0`.
8. Nếu dùng animation class như `fade-up`, `scroll-text-slide-left`, phải có class `in-view` trong giai đoạn static migration.
9. Nếu dùng tab/modal, default active state phải hiển thị đúng.
10. Footer không được xuất hiện ngay sau một khoảng trắng lớn do section invisible.
11. Không được báo “Visual Parity 100%” nếu chưa kiểm tra bằng mắt trên browser.
12. Nếu giao diện có khoảng trắng lớn bất thường, phải debug visibility/height/position trước khi qua task tiếp theo.

**Bài học cốt lõi:**
> “Build pass does not mean UI is visible.”

## 22. Shared Visual Components Guidelines
Để bảo tồn 100% Visual Parity và nâng cao tính tái sử dụng, hãy sử dụng các shared components được định nghĩa dưới `@/shared/components/visual`:

1. **VideoPlayer (`@/shared/components/visual/VideoPlayer`)**:
   - **Custom Cinematic Controls**: Tắt thanh native controls mặc định của trình duyệt, khôi phục 100% bộ điều khiển custom: timeline scrubber, buffered progress, center play buttons, volume ranges, mute toggles và time display.
   - **Playable UI must fail gracefully**: Không bao giờ để VideoPlayer bị kẹt ở trạng thái màn hình đen cùng spinner loading vô tận.
   - **Poster Fallback**: Khi thiếu `src` hoặc gặp lỗi phát video (`onError`), bắt buộc lập tức tắt loading spinner và hiện poster fallback kèm thông báo tinh tế "Trailer đang được cập nhật".
   - **Spinner Loading Condition**: Spinner chỉ hiển thị khi `isLoading === true` và `hasError === false`. Tắt spinner khi tải xong hoặc gặp lỗi.
   - **YouTube Clean Embeds**: Tự động nhận diện liên kết YouTube, chuyển đổi sang mã nhúng `iframe` sạch, cho phép phát mượt mà mà không gặp lỗi giải mã định dạng của HTML5.

2. **TrailerModal (`@/shared/components/visual/TrailerModal`)**:
   - Modal xem trailer chuẩn Cinematic Overlay.
   - Sử dụng đúng cấu trúc DOM của template `.modal-overlay.open` để hỗ trợ hiệu ứng chuyển cảnh mượt mà.
   - Chỉ render khi `isOpen` đạt giá trị `true` để tránh chiếm dụng layout DOM hoặc che khuất giao diện.
   - Hỗ trợ đầy đủ các hình thức tắt modal: Nút X, Click vùng trống Overlay, Nhấn phím `Escape`.

3. **HighlightText (`@/shared/components/visual/HighlightText`)**:
   - Sử dụng client-side rendering kết hợp với `ResizeObserver` để tự động vẽ các dải vẽ SVG (`underline`, `box`, `circle`, `marker`) chuẩn xác xung quanh nội dung text.
   - Tránh dùng style inline cố định kích thước, thay vào đó hãy để nó tự động thích ứng với kích thước text của phần tử cha.

4. **ScrollTextSlideLeft (`@/shared/components/visual/ScrollTextSlideLeft`)**:
   - Sử dụng `IntersectionObserver` để tự động kích hoạt class `.in-view` khi người dùng cuộn tới.
   - Mặc định `inView = true` trong giai đoạn static migration để tránh lỗi văn bản bị ẩn (`opacity: 0`).

## 23. Video Player Fallback & Layering Rules
1. **Decorative Blur Layering**:
   - **z-index Separation**: Các lớp hình ảnh mờ trang trí phía sau phải được định cấu hình tuyệt đối `position: absolute`, `z-index: 0` và `pointer-events: none` để không cản trở tương tác.
   - **Sharp Player content**: Thẻ chứa trình phát chính (`.cine-video-player`) phải có `position: relative` và `z-index: 2` (hoặc cao hơn) để hiển thị rõ nét trên lớp blur nền và nhận được đầy đủ sự kiện click/hover.
   - **No Filter Bleeding**: Nghiêm cấm đặt bộ lọc `filter: blur(...)` trực tiếp trên phần tử cha chứa cả trình phát lẫn các controls, tránh làm mờ nhòe giao diện điều khiển.

**Bài học cốt lõi:**
> “Playable UI must fail gracefully: no infinite black loading screen.”

## 24. Hero Banner Visual-First Rule
When the Home Hero is configured as an image-first carousel:
- Do not render large text content blocks inside the hero.
- The active banner must be the primary focus.
- Side banners must stay visually subordinate through smaller scale, lower opacity, and slight blur.
- Hero slide transitions must never cause layout height shifts.
- Promotion/combo slides should follow the same banner-image system unless a separate redesign is explicitly approved.
- QuickBookingPanel must remain outside transform/filter wrappers.
- Autoplay must be tested manually.
- **Arc Layout Rule**:
  - Image-first hero carousel must not render as a flat horizontal row.
  - Active banner should sit visually higher and centered.
  - Side banners should sit slightly lower, smaller, dimmer, and lightly rotated.
  - The arc must be subtle, not an exaggerated circle.
  - Must manually test visual arc on desktop.

## 25. Quick Booking Readability Rule
- QuickBookingPanel không được quá trong suốt khi nằm trên Hero background.
- QuickBookingPanel trên Hero phải dùng solid white background nếu glassmorphism làm xuyên nền.
- Glassmorphism phải ưu tiên readability.
- Label PHIM/RẠP/NGÀY/SUẤT CHIẾU phải đọc được rõ.
- Disabled fields được phép nhạt hơn nhưng không được gần như invisible.
- Disabled state chỉ được giảm màu text/icon, không làm cả field gần như invisible.
- Không dùng opacity trên toàn bộ booking field vì sẽ làm label/value bị mờ.
- Hover không được thay đổi độ trong suốt của panel.
- Dropdown menu phải dùng nền trắng đặc hoặc gần đặc.
- Build pass không đồng nghĩa QuickBooking dễ đọc.

## 26. Hero Quick Booking Bridge Rule
- QuickBookingPanel phải được anchor vào hero bottom boundary line.
- Bridge position chuẩn là center of panel aligned with boundary between Hero and next section.
- Không đặt QuickBooking quá cao trong Hero.
- Không để Hero dark background kéo dài quá nhiều dưới QuickBooking.
- Section kế tiếp phải reserve padding-top để tránh bị panel đè.
- QuickBooking must remain outside carousel transform wrappers.
- QuickBooking phải được hiển thị nổi bật trên cả 2 nền nhờ z-index đủ cao (tối thiểu z-index: 40).

## 27. Quick Booking Bridge Verification Rule
- Không được chỉ sửa CSS và kết luận thành công.
- Phải verify DOM thật có render QuickBookingPanel.
- Phải verify selector CSS khớp class thật.
- Phải verify CSS file được import.
- Phải verify không có CSS override.
- Phải kiểm tra UI bằng browser screenshot/manual QA.
- Nếu UI không đổi, phải debug import/selector/override trước khi báo hoàn thành.

## 28. Navbar Expandable Search Rule
- Không chạy third-party UI init nếu có nguy cơ overwrite config.
- Search Navbar phải giữ layout ổn định khi expand/collapse (không làm tăng chiều cao Navbar, không đẩy lệch nút Đăng nhập / Đặt vé).
- Không tự tạo search page/API mới nếu task chỉ yêu cầu search UI.
- Nếu Navbar đang là Server Component, ưu tiên tách client component nhỏ thay vì refactor toàn Navbar.
- Manual QA bắt buộc kiểm tra các dropdown menus, login button, booking button sau khi search expand.
- Icon và placeholder trong expanded search phải có spacing tối thiểu 10–12px (dùng absolute icon container và input padding-left).
- Expand/collapse animation không được khựng; wrapper width và form width phải đồng bộ.
- Không dùng transition width CSS xung đột với framer-motion.
- Manual QA phải kiểm tra cả expand và collapse.
- Expandable search trong Navbar không được animate width trực tiếp làm reflow Navbar.
- Phải dùng fixed outer slot + absolute inner animated form nếu nằm trong flex nav-actions.
- Icon button và input phải có spacing rõ ràng; input không được nằm dưới icon.
- Collapse animation phải được manual QA tối thiểu 10 lần.
- Build pass không đồng nghĩa animation không bị layout shift.
- Không dùng fixed expanded-width outer slot trong flex navbar vì sẽ tạo blank gap khi collapsed.
- Outer slot phải chỉ chiếm collapsed icon width (44px).
- Inner form phải absolute và animate width sang trái.
- Search expanded không được làm reflow nav menu/actions.
- Input padding-left phải được verify bằng computed style, không chỉ đọc code (ưu tiên inline style để tránh CSS override).
- Manual QA phải kiểm tra blank gap khi collapsed.

## 29. Movie Schedule Toolbar Rule
- Date selector phải ưu tiên đủ chiều rộng để hiển thị tối thiểu 3 ngày trên desktop.
- City/cinema filters không được chiếm width dư làm ngày bị ép.
- Không thay custom dropdown bằng native select nếu visual design yêu cầu dropdown styled.
- Khi sửa layout, phải kiểm tra dropdown open state bằng browser thật.
- Build pass không đồng nghĩa dropdown visual đúng.

## 30. Movie Schedule Direct Booking Rule
- Trên Movie Detail, giờ chiếu khả dụng phải dẫn trực tiếp đến trang chọn ghế.
- Không bắt người dùng chọn giờ rồi bấm thêm nút “Tiếp tục chọn ghế” nếu user đã yêu cầu direct flow.
- Chỉ showtime available mới navigate.
- Query params phải encode đúng.
- Disabled showtimes không được trigger route.

## 31. Booking Flow State Rule
- Booking flow phải dùng store trung tâm thay vì truyền state rời rạc giữa pages.
- Current booking session dùng sessionStorage để tránh lưu rác vĩnh viễn, đồng thời phải SSR-safe trong Next.js (không truy cập trực tiếp storage ở top-level nếu không được bao bọc kiểm tra client-side).
- Ticket history sau khi thanh toán thành công được lưu trữ bằng localStorage mock.
- Countdown giữ ghế không được tự khởi động khi vào `/booking/seats`.
- Countdown chỉ bắt đầu sau khi quick combo popup được xử lý (Bỏ qua hoặc Mua ngay).
- Các helper tính tiền (ticket total, combo total, final total, discount) phải dùng chung từ utils, không tính rải rác trong từng component.
- Không tích hợp payment/email/API thật trong mock phase.

## 32. Booking Seat Page Store Integration Rule
- `/booking/seats` phải dùng bookingStore làm source of truth cho selected seats.
- Không giữ selected seats chính trong local useState sau khi store đã được tích hợp.
- Không tự khởi động countdown khi vào `/booking/seats`. Countdown interval không được tạo nếu seatHoldExpiresAt chưa tồn tại.
- Trước khi quickComboHandled hoặc seatHoldExpiresAt tồn tại, không render timer placeholder. Timer box chỉ xuất hiện sau khi seat hold thật sự bắt đầu. Không dùng --:-- placeholder nếu user chưa tới bước giữ ghế.
- Nút sau chọn ghế phải là “Tiếp tục”, không phải “Tiếp tục thanh toán”, vì flow còn Quick Combo và Foods trước Payment.
- Khi dùng persisted Zustand trong Next.js, phải có hydration guard để tránh SSR/client mismatch. Hydration guard phải có UI loading/skeleton nhẹ, không tạo white screen.
- Store totals phải dùng helper chung, không tự tính tiền rải rác trong component.
- MobileBookingBar phải dùng cùng bookingStore source với desktop summary.
- Reload cùng URL không được reset selected seats. Đổi movie/cinema/date/time mới được reset session.
- Không để console.log/alert làm placeholder trong code cuối.

## 33. Booking Quick Combo Rule
- Quick Combo Popup chỉ được mở sau khi user đã chọn ghế và bấm “Tiếp tục”.
- Countdown giữ ghế chỉ bắt đầu sau khi user bấm “Bỏ qua” hoặc “Mua ngay”.
- Đóng popup (click overlay, click nút X, hoặc nhấn ESC) phải được xử lý như "Bỏ qua", không được để session kẹt ở trạng thái `quickComboHandled === false` khi popup biến mất.
- Bấm “Mua ngay” phải add combo vào bookingStore trước khi đi tiếp.
- Không dùng alert/console.log làm UI flow.
- Không tạo payment/food/gateway ngoài phạm vi nếu task chưa yêu cầu.

## 34. Booking Seat Hold Timer Rule
- Countdown chỉ chạy khi `seatHoldExpiresAt` tồn tại.
- Không tạo interval khi chưa bắt đầu giữ ghế hoặc khi session đã expired.
- Không render `--:--` placeholder trước khi timer bắt đầu.
- Không reset timer khi reload hoặc khi bấm lại "Tiếp tục".
- Timer phải dựa trên absolute timestamp `seatHoldExpiresAt` của Zustand store, không dựa trên local countdown state.
- Chỉ page-level component (`/booking/seats`) được phép redirect (`router.push`) khi expired. Summary và mobile components không tự redirect.
- Timer hook phải hydration-safe với Zustand persist bằng local mounted state check.
- Khi hết giờ, gọi `expireSeatHold()` và chuyển sang `/booking/failed?reason=expired`.
- Expired session không được tự restart timer.
- Không clear booking session khi expired.
- Không commit test duration ngắn vào production code (giữ 600 giây mặc định).
- Date.now() tính bằng milliseconds; `seatHoldDurationSeconds` bắt buộc phải nhân với 1000 khi tính toán `seatHoldExpiresAt`.
- Một seat hold vừa bắt đầu phải có khoảng cách `seatHoldExpiresAt - Date.now()` gần bằng 600000ms.
- Tuyệt đối không được redirect sang failed từ stale expired persisted state trước khi quá trình initialization / hydration hoàn tất.
- Khi `initializeBooking` phát hiện query thay đổi hoặc session trước đó đã expired, bắt buộc reset toàn bộ session về trạng thái "draft".
## 35. Booking Foods Page Rule
- /booking/foods chỉ được truy cập sau khi user đã chọn ghế và quick combo đã được xử lý (quickComboHandled === true).
- Bỏ qua Quick Combo ở /booking/seats thì ở lại trang chọn ghế, không tự chuyển sang /booking/foods.
- Mua ngay Quick Combo ở /booking/seats thì add combo và chuyển sang /booking/foods ngay lập tức.
- Sau khi `quickComboHandled` đã là `true`, bấm "Tiếp tục" tại /booking/seats mới chuyển sang /booking/foods.
- Trang /booking/foods tuyệt đối không được tự gọi `startSeatHold()`.
- Timer trên trang foods phải dùng `useSeatHoldTimer()` và lấy thời gian từ `seatHoldExpiresAt` của store.
- Combo quantity phải được lấy và lưu trực tiếp trong `bookingStore.session.combos`, không dùng state local làm source of truth.
- Tổng tiền combo, vé và tổng cộng phải dùng helper/store, không được tự tính thủ công trong component.
- Không tạo route `/booking/payment` hoặc chuyển hướng tới trang thanh toán trước khi triển khai Micro-task Booking 6.
- `BookingStepper` phải được hiển thị trên cả trang `/booking/seats` (active="seats") và `/booking/foods` (active="foods") dưới dạng component chung.
- `BookingStepper` phải compact, không gây horizontal scrollbar trên desktop, và tích hợp các bước chọn phim/rạp/suất chiếu thành một step "Chọn suất".
- `BookingStepper` phải nhận prop `currentStep` (type `BookingStepKey`) để dynamically render class và completed/active status thay vì hardcode.
- Trang `/booking/foods` phải có nút "Quay lại chọn ghế" để đẩy router về đúng query parameters của `/booking/seats` bằng `router.replace` (tránh history loop: Seats → Foods → Seats → Back returns Foods) mà không làm reset session, ghế đã chọn, combo đã chọn hay timer giữ ghế.
- Step label của `BookingStepper` không được lặp số thứ tự (ví dụ: không đặt "1. Chọn suất"). Các labels phải ngắn gọn, súc tích: Chọn suất, Chọn ghế, Bắp nước, Thanh toán, Xác nhận.
- Desktop stepper tuyệt đối không được cắt chữ, bị ellipsis hoặc bị tràn khung, đồng thời không có scrollbar ngang.
- Circle indicator của step active phải có hiệu ứng scale và shadow nhẹ. Check icon của completed step có animation pop-in (`stepCheckPop`). Line progress bar hoàn thành có transition fill mượt mà và hỗ trợ `prefers-reduced-motion`.

## 36. Booking Payment Page Rule
- /booking/payment chỉ được truy cập sau khi user đã chọn ghế, xử lý quick combo và có active seatHoldExpiresAt.
- /booking/payment tuyệt đối không được gọi startSeatHold(), resetBooking() hay initializeBooking() khi vào trang.
- Timer phải dùng useSeatHoldTimer() và lấy giá trị từ seatHoldExpiresAt để tiếp tục đếm ngược từ thời gian thực còn lại.
- Voucher giảm giá phải dùng shared voucherData và bookingCalculations. Không hardcode dữ liệu hoặc logic voucher.
- Payment methods phải được render từ list PAYMENT_METHODS, không hardcode trong component.
- Không được gọi markPaid() hoặc saveTicketToHistory() trong Micro-task Booking 6. Chỉ được mark pending status khi click confirm.
- Confirmation modal chỉ đóng vai trò preview/confirmation thông tin đặt vé trước thanh toán.
- Không tạo mock gateway hay external payment redirects trong task này.
- Foods -> Payment bằng CTA "Tiếp tục" bắt đầu bằng router.push() để giữ back navigation tự nhiên.
- Payment -> Foods bằng nút quay lại trong UI phải dùng router.replace() để tránh history loop (Seats -> Foods -> Payment -> Foods -> Back returns Payment).
- Back navigation từ payment về foods và từ foods về seats không được làm reset session, combos, seats, voucher, payment method, hoặc timer.

## 37. Booking Navigation Stack Rule
- **Forward Progression**: User progress actions must strictly use `router.push()` (e.g. Showtime click → Seats, Seats → Foods, QuickCombo “Mua ngay” → Foods, Foods → Payment).
- **UI Back Navigation**: Back buttons in the UI must strictly use `router.replace()` (e.g. Payment back to Foods, Foods back to Seats, Seats back to Movie Detail).
- **Guard/System Redirects**: Automatic redirections for session checks, missing data, or timer expiration must strictly use `router.replace()` to avoid browser history stack pollution.
- **Forbidden Patterns**:
  - Do NOT use `router.push()` for UI back buttons.
  - Do NOT use `window.history.back()` for booking UI back buttons.
  - Do NOT use hash/anchor links (like `#schedule`) that create duplicate history entries.
  - Do NOT allow looping redirects (e.g. Seats ↔ Foods, Foods ↔ Payment, or booking page ↔ failed page).
  - Do NOT create duplicate/additional back buttons in the UI to fix navigation stack flows. Always fix the logic on the existing UI back button if one exists.
- **State Preservation**: Any navigation fix or redirect must NOT clear or reset selected seats, combos, applied voucher, payment method, or countdown timer status.
- **Double Navigation**: Prevent multiple clicks on buttons firing navigation handlers twice.
- **Specific Page Back Rules**:
  - `/booking/seats` must only have one back button (the circular icon inside `BookingSummaryHeader`).
  - The circular back button in `BookingSummaryHeader` must be hooked up to use `router.replace(buildMovieDetailUrlFromSession(session) ?? "/movies")` instead of `window.history.back()`.

## 38. Authentication in Booking Flow Rule
1. Booking pages must never redirect users to a standalone login page.
2. Authentication inside booking flow must use modal popup only.
3. After successful login: Keep current route, keep current booking state, keep selected seats, close modal and continue flow.
4. Booking context must survive authentication.
5. Login must be checked at /booking/[showtimeId].
6. Authentication must never reset booking session.
7. User must always return to the exact booking state before authentication.



