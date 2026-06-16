import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thanh toán",
  description:
    "Thông tin chuyển khoản và mã QR thanh toán vé Beauty Summit 2026."
};

export default function ThanhToanLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
