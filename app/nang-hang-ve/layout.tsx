import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nâng hạng vé",
  description:
    "Tra cứu mã vé và thanh toán phần chênh lệch để nâng hạng vé Beauty Summit 2026."
};

export default function NangHangVeLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
