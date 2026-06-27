# Frontend Architecture Guide

## 1. Modular Structure
Dự án được tổ chức theo module tính năng (`src/modules`). Mỗi module chứa:
- `api/`: Các hàm gọi API.
- `dto/`: Định nghĩa Data Transfer Objects.
- `mappers/`: Chuyển đổi DTO -> Domain Model.
- `schemas/`: Zod validation.
- `services/`: Business logic & Validation entry point.
- `hooks/`: Tanstack Query hooks.
- `components/`: UI components đặc thù của module.

## 2. Layered Pattern
Mọi luồng dữ liệu phải đi qua:
`API` -> `Service (Validation & Mapping)` -> `Hook` -> `Component`.

## 3. State Management
- **Server State**: Quản lý bởi Tanstack Query.
- **Client State**: Quản lý bởi Zustand (chỉ khi thực sự cần thiết).
- **URL State**: Sử dụng `next/navigation` (searchParams, params).

## 4. UI System
- Tọa lạc tại `src/shared/ui`.
- Sử dụng TailwindCSS + Headless UI/Lucide Icons.
- Tuân thủ quy tắc **Stateless Components**.
