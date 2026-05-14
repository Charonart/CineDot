# Phase 3: Shared UI System

## Completed
- Triển khai `cn` helper cho Tailwind class merging.
- Xây dựng hệ thống Skeleton linh hoạt.
- Tạo các UI States: `EmptyState`, `ErrorState`, `OfflineState`.
- Phát triển `MovieCard` hỗ trợ poster/backdrop và responsive.

## Decisions
- UI Components phải là Stateless/Presentational.
- Sử dụng `next/image` với thuộc tính `sizes` chuẩn xác.

## Risks Resolved
- Giảm thiểu CLS (Layout Shift) bằng cách dùng Aspect Ratio.
