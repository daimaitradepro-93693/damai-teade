import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import { LanguageProvider } from '@/i18n';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import PixelTracker from '@/components/PixelTracker';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '大迈国际贸易有限公司 - 专业进出口贸易服务',
    template: '%s | 大迈国际贸易有限公司',
  },
  description:
    '大迈国际贸易有限公司 - 专业从事进出口贸易、国际物流、报关清关、跨境电商等外贸服务，连接全球市场，助力企业拓展海外业务。',
  keywords: [
    '大迈国际贸易',
    '进出口贸易',
    '国际物流',
    '报关清关',
    '外贸服务',
    '跨境电商',
    '海外贸易',
    '海南外贸',
  ],
  authors: [{ name: '大迈国际贸易有限公司' }],
  generator: 'Coze Code',
  openGraph: {
    title: '大迈国际贸易有限公司',
    description: '专业从事进出口贸易、国际物流、报关清关等外贸服务',
    url: process.env.COZE_PROJECT_DOMAIN_DEFAULT,
    siteName: '大迈国际贸易',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '大迈国际贸易有限公司',
    description: '专业从事进出口贸易、国际物流、报关清关等外贸服务',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-white font-sans antialiased dark:bg-gray-900">
        <GoogleAnalytics />
        <PixelTracker />
        <Inspector />
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
