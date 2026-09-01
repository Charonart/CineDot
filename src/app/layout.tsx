import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CineDot - Hệ Thống Rạp Chiếu Phim Hiện Đại",
  description: "Trải nghiệm điện ảnh đỉnh cao chuẩn quốc tế với phòng chiếu IMAX Laser, Dolby Atmos và dịch vụ thành viên StarClub độc quyền tại CineDot Vietnam.",
  icons: {
    icon: '/assets/images/cinedot-icon.png',
    apple: '/assets/images/cinedot-icon.png',
  },
};

import { QueryProvider } from "@shared/providers/QueryProvider";
import { GlobalTrailerModal } from "@/shared/components/visual/GlobalTrailerModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <QueryProvider>
          {children}
          <GlobalTrailerModal />
        </QueryProvider>
      </body>
    </html>
  );
}
