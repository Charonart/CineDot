# Phase 1: Foundation Architecture

## Completed
- Cấu trúc thư mục Modular (Shared, Modules, Lib).
- Cấu hình Next.js 15+, TypeScript, TailwindCSS.
- Thiết lập Axios Client với interceptors cho Error Normalization.
- Cấu hình Tanstack Query Client.
- Env validation với Zod.

## Decisions
- Chọn Tanstack Query cho Server State.
- Sử dụng Zod để validate env vars ngay khi khởi động.

## Risks Resolved
- Tránh được lỗi runtime do thiếu biến môi trường.
- Thiết lập cơ chế bắt lỗi tập trung (centralized error handling).
