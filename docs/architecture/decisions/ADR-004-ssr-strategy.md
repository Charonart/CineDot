# ADR-004: SSR/Server Components for Movie Details

## Context
Ứng dụng phim cần tối ưu SEO để các trang chi tiết phim có thể xuất hiện trên kết quả tìm kiếm Google.

## Decision
Sử dụng **Next.js Server Components** và `generateMetadata()` cho toàn bộ trang chi tiết phim (`/movies/[id]`).

## Consequences
- **Positive**: SEO hoàn hảo, tốc độ tải trang ban đầu (FCP) nhanh hơn.
- **Negative**: Cấu trúc code phức tạp hơn khi kết hợp Client/Server Components.

## Tradeoffs
SEO là yếu tố sống còn cho một ứng dụng nội dung như CineDot.

## Future Implications
Hỗ trợ tốt việc chia sẻ link lên Facebook/Twitter (OpenGraph).
