import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Đặt vé Beauty Summit 2026",
    template: "%s | Beauty Summit 2026"
  },
  description:
    "Đặt mua vé Beauty Summit 2026 - sự kiện làm đẹp hàng đầu Việt Nam.",
  icons: {
    icon: "/img/icon.png",
    shortcut: "/img/icon.png",
    apple: "/img/icon.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
