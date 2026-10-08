import './globals.css'
import Script from 'next/script'

export const metadata = {
  title: '우리동네 학원 찾기',
  description: '전국 학원 시간표 및 수강료 검색 서비스',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        {/* 구글 애드센스 스크립트 추가 */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4424569297437395"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
