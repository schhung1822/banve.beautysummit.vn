import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thanh toán thành công",
  description:
    "Cảm ơn bạn đã đăng ký tham dự Beauty Summit 2026. Xem hướng dẫn check-in và truy cập mini app."
};

export default function TrangCamOnLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
