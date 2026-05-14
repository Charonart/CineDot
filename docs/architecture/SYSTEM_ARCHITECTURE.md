# CineDot - Frontend System Architecture

## 1. Project Overview
**CineDot** là hệ thống quản lý và cung cấp thông tin phim ảnh chuyên nghiệp cấp độ Production.
- **Frontend**: Xây dựng bằng Next.js 15+, chịu trách nhiệm hiển thị UI, tối ưu SEO, và quản lý trải nghiệm người dùng.
- **Backend Communication**: Frontend giao tiếp với **Laravel API** thông qua RESTful API.
- **Backend-TMDB**: Laravel Backend đóng vai trò là Proxy/Adapter, giao tiếp trực tiếp với **TMDB API** để lấy dữ liệu phim, sau đó chuẩn hóa và trả về cho Frontend.

## 2. High-Level Architecture
Luồng dữ liệu tổng quan của hệ thống:
User → Next.js Frontend → Frontend Service Layer → Axios Client → Laravel Backend API → TMDB Service → TMDB API

## 3. Folder Architecture
Cấu trúc thư mục được thiết kế theo nguyên tắc **Modular Feature-First**:

- `src/app`: Chứa Routing, Layouts, và Server Components của Next.js App Router. Chỉ đặt logic liên quan đến routing tại đây.
- `src/modules`: Chứa các tính năng (features) cụ thể như `movie`, `auth`, `search`. Mỗi module là một domain độc lập.
- `src/shared`: Chứa các thành phần dùng chung cho toàn bộ dự án (UI components, hooks, utils).
- `src/lib`: Chứa cấu hình cho các thư viện bên thứ 3 (Axios, QueryClient, Env).
- `src/configs`: Chứa các cấu hình tĩnh của ứng dụng.
- `src/mocks`: Chứa dữ liệu giả (Mock data) cho quá trình phát triển độc lập.
- `src/store`: Chứa Global State (Zustand).
- `src/middleware`: Next.js Middleware cho authentication/authorization.

## 4. Module Architecture (Feature Module)
Cấu trúc bên trong một module (ví dụ: `movie`):
```text
movie/
 ├── api/        # Các hàm gọi API thuần túy bằng Axios
 ├── hooks/      # React hooks kết nối Service với UI (Tanstack Query)
 ├── services/   # Xử lý logic nghiệp vụ, gọi API và sử dụng Mappers
 ├── mappers/    # Chuyển đổi dữ liệu từ API (DTO) sang Model của Frontend
 ├── dto/        # Định nghĩa kiểu dữ liệu thô từ Backend
 ├── types/      # Định nghĩa kiểu dữ liệu sạch cho UI sử dụng
 ├── schemas/    # Zod schemas để validation dữ liệu
 └── components/ # UI components chỉ dành riêng cho module này
```
**Flow**: UI Component → Custom Hook → Service → API Client

## 5. Data Flow Architecture
Hệ thống tuân thủ nghiêm ngặt luồng dữ liệu:
Backend API Response → **DTO** → **Zod Validation** → **Mapper** → **Frontend Model** → **UI Component**

> [!IMPORTANT]
> **UI tuyệt đối không được sử dụng dữ liệu raw từ API trực tiếp.** Mọi dữ liệu phải đi qua Mapper để đảm bảo tính ổn định và sạch sẽ.

## 6. TMDB Integration Strategy
- Frontend **KHÔNG** gọi trực tiếp TMDB API.
- Mọi yêu cầu dữ liệu phim phải đi qua Laravel Backend.
- Image Path từ TMDB phải được xử lý qua `imageHelper` để nối Base URL tương ứng.

## 7. State Management Strategy
- **Server State**: Quản lý bởi **Tanstack Query** (movies, detail, search). Tự động caching và refetching.
- **Client State**: Quản lý bởi **Zustand** (theme, sidebar, modal, auth UI state).
- Không lạm dụng Global Store cho các dữ liệu đã có trong Tanstack Query.

## 8. API Layer Strategy
- Không sử dụng `axios` trực tiếp trong component.
- Tất cả request phải đi qua `axiosClient` trong `src/lib/axios`.
- API module chỉ chứa request thuần. Service xử lý logic trung gian. Hook kết nối với UI.

## 9. Environment Strategy
Quản lý qua các file `.env`:
- `NEXT_PUBLIC_API_BASE_URL`: URL của Laravel API.
- `NEXT_PUBLIC_IMAGE_BASE_URL`: URL base của TMDB images.
- `NEXT_PUBLIC_USE_MOCK`: Bật/tắt chế độ sử dụng dữ liệu giả.

## 10. Mock Strategy
- Sử dụng mock data trong `src/mocks` khi Backend chưa hoàn thiện.
- Mock phải khớp 100% với API Contract thật.
- Bật `NEXT_PUBLIC_USE_MOCK=true` để chuyển sang chế độ giả lập.

## 11. Error Handling Strategy
- **API Error Formatter**: Chuẩn hóa lỗi từ Axios về một định dạng duy nhất.
- **Error Boundary**: Bọc các component lớn để tránh crash toàn bộ app.
- **loading.tsx/error.tsx**: Sử dụng cơ chế mặc định của Next.js cho từng route.

## 12. Naming Convention
- **Component**: `PascalCase` (e.g., `MovieCard.tsx`)
- **Hook**: `camelCase` với prefix `use` (e.g., `useMovies.ts`)
- **Service**: `something.service.ts`
- **API**: `something.api.ts`
- **Mapper/DTO/Type/Schema**: `something.[suffix].ts`

## 13. Development Workflow (Thêm tính năng mới)
1. Tạo module trong `src/modules`.
2. Định nghĩa **DTO** và **Type**.
3. Tạo **Schema** (Zod).
4. Viết **Mapper**.
5. Viết **API** calls.
6. Viết **Service** xử lý logic và mapping.
7. Viết **Hook** sử dụng Tanstack Query.
8. Tạo **Component** và gắn vào **Page**.

## 14. Architecture Diagram
```text
User
 ↓
Next.js App Router
 ↓
Page (Server/Client)
 ↓
Module Component (UI Logic)
 ↓
Custom Hook (Query/Mutation)
 ↓
Service (Business Logic/Mapping)
 ↓
API Client (Axios Instance)
 ↓
Laravel Backend (Proxy/Adapter)
 ↓
TMDB API
```

## 15. Onboarding Guide (Cho Developer mới)
- **Muốn sửa UI?**: Kiểm tra `src/shared/components` (nếu dùng chung) hoặc `src/modules/[feature]/components`.
- **Muốn thêm API?**: Thêm hàm vào `src/modules/[feature]/api` và cập nhật Service.
- **Muốn thêm Type?**: Định nghĩa trong `src/modules/[feature]/types`.
- **Muốn thêm Feature mới?**: Tạo thư mục mới trong `src/modules` và làm theo Development Workflow.
