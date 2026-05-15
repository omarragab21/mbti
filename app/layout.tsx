import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'اختبار MBTI السريع',
  description: 'اكتشف نمط شخصيتك من خلال ٤ أسئلة فقط — مع تحليل ذكاء اصطناعي باللغة العربية',
  keywords: ['MBTI', 'اختبار الشخصية', 'تحليل الشخصية', 'ذكاء اصطناعي'],
  openGraph: {
    title: 'اختبار MBTI السريع',
    description: 'اكتشف نمط شخصيتك من خلال ٤ أسئلة فقط',
    locale: 'ar_SA',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0a0a0f',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <div className="bg-noise"></div>
        {children}
      </body>
    </html>
  );
}
