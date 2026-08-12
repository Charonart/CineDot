import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Các route yêu cầu người dùng phải đăng nhập
const protectedRoutes = ['/profile'];

export function proxy(request: NextRequest) {
  // Đọc token từ cookie (đồng bộ cả cinedot_token và cine_token)
  const token =
    request.cookies.get('cinedot_token')?.value ||
    request.cookies.get('cine_token')?.value;

  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // Nếu truy cập route được bảo vệ mà chưa có token -> chuyển hướng về trang chủ kèm flag mở AuthModal
  if (isProtectedRoute && !token) {
    const homeAuthUrl = new URL('/', request.url);
    homeAuthUrl.searchParams.set('auth', 'login');
    return NextResponse.redirect(homeAuthUrl);
  }

  return NextResponse.next();
}

// Chỉ chạy middleware trên các route cần thiết (loại trừ api, static files, images, etc.)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|mocks|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
