# Phase 2: Data Layer (DTO & Mappers)

## Completed
- Định nghĩa DTO cho Movie module.
- Triển khai Zod Schemas để runtime validation dữ liệu API.
- Xây dựng Mapper Layer để transform DTO sang Frontend Models.
- Thiết lập Service Layer làm cầu nối giữa API và UI.

## Decisions
- DTO phải phản ánh Backend Contract, không phải raw TMDB.
- Sử dụng `releaseDate` (string) để linh hoạt formatting ở UI.

## Patterns
- **Safe Parsing**: Sử dụng try-catch và Zod `.parse()` trong Service.
