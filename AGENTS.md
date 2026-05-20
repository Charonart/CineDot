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
