import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@shared/providers/QueryProvider";
import { GlobalTrailerModal } from "@/shared/components/visual/GlobalTrailerModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://cinedot.vn";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CineDot - Hệ Thống Đặt Vé Xem Phim Trực Tuyến Đỉnh Cao",
    template: "%s | CineDot",
  },
  description:
    "Trải nghiệm xem phim đỉnh cao tại hệ thống rạp CineDot. Đặt vé xem phim trực tuyến nhanh chóng, tiện lợi với công nghệ IMAX Laser, ScreenX 270° và âm thanh vòm Dolby Atmos.",
  keywords: [
    "CineDot",
    "đặt vé xem phim",
    "rạp chiếu phim",
    "phim chiếu rạp",
    "lịch chiếu phim",
    "vé xem phim online",
    "rạp IMAX",
    "ScreenX",
    "Dolby Atmos",
  ],
  authors: [{ name: "CineDot Cinema" }],
  creator: "CineDot Cinema",
  publisher: "CineDot Cinema",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteUrl,
    siteName: "CineDot",
    title: "CineDot - Hệ Thống Đặt Vé Xem Phim Trực Tuyến Đỉnh Cao",
    description:
      "Trải nghiệm xem phim đỉnh cao tại hệ thống rạp CineDot. Đặt vé trực tuyến nhanh chóng, tiện lợi với trải nghiệm mượt mà.",
    images: [
      {
        url: "/assets/cinedot-og.jpg",
        width: 1200,
        height: 630,
        alt: "CineDot Cinema - Hệ Thống Đặt Vé Xem Phim Trực Tuyến",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CineDot - Hệ Thống Đặt Vé Xem Phim Trực Tuyến Đỉnh Cao",
    description:
      "Trải nghiệm xem phim đỉnh cao tại hệ thống rạp CineDot. Đặt vé trực tuyến nhanh chóng, tiện lợi.",
    images: ["/assets/cinedot-og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLdWebsite = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "CineDot",
      description: "Hệ thống đặt vé xem phim trực tuyến đỉnh cao",
      potentialAction: [
        {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/movies?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      ],
      inLanguage: "vi-VN",
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "CineDot Cinema",
      url: siteUrl,
      logo: `${siteUrl}/assets/logo.png`,
    },
  ],
};

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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <QueryProvider>
          {children}
          <GlobalTrailerModal />
        </QueryProvider>
      </body>
    </html>
  );
}