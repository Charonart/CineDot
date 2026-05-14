# ADR-001: Tanstack Query for Server State

## Context
Dự án cần một cơ chế quản lý dữ liệu từ API (Server State) hiệu quả, hỗ trợ caching, tự động refetching và đồng bộ trạng thái UI.

## Decision
Sử dụng **Tanstack Query (React Query)** thay vì Redux/Zustand cho toàn bộ dữ liệu từ API.

## Consequences
- **Positive**: Giảm code boilerplate, tự động hóa việc caching, xử lý loading/error state đồng nhất.
- **Negative**: Cần học thêm cơ chế quản lý Query Keys.

## Tradeoffs
Chấp nhận tăng kích thước bundle một chút để đổi lấy hiệu suất phát triển và trải nghiệm người dùng vượt trội.

## Future Implications
Dễ dàng tích hợp Infinite Scroll, Optimistic Updates và Server-side prefetching.
