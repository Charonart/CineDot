import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Các route yêu cầu người dùng phải đăng nhập
const protectedRoutes = ['/profile'];

// Các route dành cho người dùng chưa đăng nhập (nếu đã đăng nhập sẽ chuyển hướng)
const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];

export function proxy(request: NextRequest) {
  // Đọc token từ cookie (tên cookie được định nghĩa trong authStore)
  const token = request.cookies.get('cine_token')?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Nếu truy cập route được bảo vệ mà chưa có token -> chuyển hướng sang /login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    // Lưu lại URL gốc để có thể chuyển hướng lại sau khi đăng nhập thành công
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Nếu đã đăng nhập mà cố tình truy cập các trang auth -> chuyển về trang chủ
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Chỉ chạy middleware trên các route cần thiết (loại trừ api, static files, images, etc.)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|mocks|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
