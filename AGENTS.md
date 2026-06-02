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



