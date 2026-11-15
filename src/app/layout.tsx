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
  title: "Hand-drawn Planner · Sổ tay vẽ tay & Kế hoạch cá nhân",
  description: "Sổ tay kỹ thuật số vẽ tay (Hand-drawn Digital Notebook) - Quản lý mục tiêu, kế hoạch tuần, theo dõi thói quen và thư giãn cùng nhạc Lofi.",
  icons: {
    icon: [
      { url: "/icon.svg?v=3", type: "image/svg+xml" },
      { url: "/favicon.ico?v=3" }
    ],
    apple: "/icon.svg?v=3"
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
