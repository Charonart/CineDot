# Feature Development Workflow

Bắt buộc tuân thủ 9 bước sau cho mọi tính năng mới:

1. **DTO Definition**: Định nghĩa `something.dto.ts` dựa trên Backend Contract.
2. **Zod Schema**: Tạo `something.schema.ts` để validate DTO.
3. **Domain Types**: Định nghĩa `something.type.ts` (UI-friendly model).
4. **Mapper**: Viết `something.mapper.ts` (DTO -> Model).
5. **API Client**: Thêm method vào `something.api.ts`.
6. **Service**: Viết `something.service.ts` (Xử lý `safeParse` & `mapping`).
7. **Query Hook**: Tạo `useSomething` hook trong `hooks/`.
8. **Mock Data**: Tạo file JSON trong `public/mocks` và đăng ký vào `mockRoutes.ts`.
9. **UI Implementation**: Xây dựng UI component và kết nối với Hook.

## Quy tắc quan trọng
- Không được nhảy bước.
- Luôn viết mock data trước khi code UI.
- Kiểm tra types bằng `npm run type-check`.
