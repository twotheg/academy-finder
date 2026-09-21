import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "우리동네 학원 찾기",
  description: "학원 시간표와 가격을 쉽게 찾아보세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
