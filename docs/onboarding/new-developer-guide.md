# New Developer Guide

Chào mừng bạn đến với đội ngũ phát triển **CineDot**!

## 1. Prerequisites
- Node.js 18+
- Git
- Kiến thức về Next.js App Router, Tanstack Query, Zod.

## 2. Getting Started
1. Clone repository.
2. `npm install`.
3. Sao chép `.env.example` thành `.env.local`.
4. Đảm bảo `NEXT_PUBLIC_USE_MOCK=true` để bắt đầu phát triển nhanh.
5. `npm run dev`.

## 3. Kiến thức bắt buộc phải đọc
1. **AGENT.md**: "Kinh thánh" của dự án, chứa mọi quy tắc và cấm kỵ.
2. **docs/architecture/frontend-architecture.md**: Hiểu về mô hình phân lớp.
3. **docs/development/workflow.md**: Hiểu quy trình phát triển tính năng.

## 4. Code Standards
- Sử dụng Prettier & ESLint (tự động chạy khi commit via Husky).
- Không bao giờ dùng `console.log` trong production (Dùng `logger`).
- Mọi biến môi trường phải được đăng ký trong `src/lib/env/env.ts`.

## 5. Liên hệ
Hỏi Lead Architect hoặc kiểm tra các ADR (Architecture Decision Records) nếu bạn nghi ngờ về một quyết định kỹ thuật.
