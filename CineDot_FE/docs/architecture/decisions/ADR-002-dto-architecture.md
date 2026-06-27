# ADR-002: DTO-first Architecture

## Context
Dữ liệu từ TMDB/Backend có thể thay đổi cấu trúc bất cứ lúc nào, gây rủi ro crash UI nếu Frontend sử dụng trực tiếp.

## Decision
Ép buộc sử dụng kiến trúc **DTO-first** và **Mapper Layer**. UI chỉ làm việc với Domain Model.

## Consequences
- **Positive**: Frontend cực kỳ bền bỉ (resilient), dễ Unit Test, độc lập với cấu trúc API.
- **Negative**: Tăng số lượng file (DTO, Mapper, Type).

## Tradeoffs
Ưu tiên tính bảo trì lâu dài (Maintainability) hơn là tốc độ phát triển nhanh ở giai đoạn đầu.

## Future Implications
Nếu sau này Backend thay đổi từ TMDB sang nguồn khác, Frontend chỉ cần cập nhật Mapper, UI hoàn toàn không thay đổi.
