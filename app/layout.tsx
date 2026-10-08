import './globals.css'
import Script from 'next/script'

export const metadata = {
  title: '우리동네 학원 찾기',
  description: '전국 학원 시간표 및 수강료 검색 서비스',
  manifest: '/manifest.json', // 앱 설정 파일 연결
  icons: {
    icon: '/android-chrome-192x192.png',
    apple: '/android-chrome-192x192.png',
  },
}

export const viewport = {
  themeColor: '#2563eb', // 브라우저 및 앱 상단 테마 색상 (블루)
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        {/* 구글 애드센스 스크립트 */}
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
