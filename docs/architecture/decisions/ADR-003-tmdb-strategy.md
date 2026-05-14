# ADR-003: TMDB Proxy Strategy (Laravel Backend)

## Context
Gọi trực tiếp TMDB từ Frontend gây rủi ro lộ API Key, khó quản lý caching tập trung và không thể thực hiện các business logic riêng (Favorites/Watchlist).

## Decision
Sử dụng **Laravel Backend làm Proxy/Adapter**. Mọi request từ Frontend phải đi qua Laravel.

## Consequences
- **Positive**: Bảo mật tuyệt đối API Key, hỗ trợ Cache tập trung (Redis), chuẩn hóa dữ liệu trước khi gửi về Client.
- **Negative**: Tăng độ trễ (latency) một chút do thêm một chặng trung gian.

## Tradeoffs
An toàn dữ liệu và khả năng mở rộng (Business Logic) quan trọng hơn độ trễ micro-seconds.

## Future Implications
Laravel có thể tích hợp AI Recommendation, quản lý User Profile phức tạp mà TMDB không hỗ trợ.
