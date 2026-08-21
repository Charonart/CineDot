import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Các route yêu cầu người dùng phải đăng nhập
const protectedRoutes = ['/profile'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Đọc token từ cookie (đồng bộ cả cinedot_token, cine_token và cinedot_admin_token)
  const token =
    request.cookies.get('cine_token')?.value ||
    request.cookies.get('cinedot_token')?.value ||
    request.cookies.get('cinedot_admin_token')?.value;

  // 1. Bảo vệ các route quản trị /admin
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';
    if (!token && !isLoginPage) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2. Bảo vệ các route khách hàng yêu cầu đăng nhập (/profile)
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
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
