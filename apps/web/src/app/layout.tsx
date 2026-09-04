import type { Metadata } from 'next';
import { Inter, Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AppProviders } from '../providers';
import { getServerSession } from '@/lib/auth/supabase/server';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AI Sales Assistant — Autonomous Agentic Commerce Platform',
  description:
    'Grow merchant revenue with AI-powered shopping, sub-second conversational discovery, dynamic margin-aware bundles, explainable AI, and instant 1-click Razorpay checkout.',
  keywords: [
    'AI Commerce',
    'Agentic Sales',
    'Autonomous Shopping Concierge',
    'Razorpay Agentic Payments',
    'Explainable AI Commerce',
    'Merchant Revenue Growth',
    'Dynamic Bundling Engine',
    'Next.js 15',
    'Conversational Commerce',
  ],
  authors: [{ name: 'AI Sales Assistant Engineering Team' }],
  creator: 'AI Sales Assistant',
  publisher: 'AI Sales Assistant Inc.',
  metadataBase: new URL('https://ai-sales-assistant.io'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ai-sales-assistant.io',
    siteName: 'AI Sales Assistant',
    title: 'AI Sales Assistant — Grow Merchant Revenue with Agentic Commerce',
    description:
      'Autonomous shopping assistant, explainable AI reasoning, merchant telemetry, and seamless Razorpay integration.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Sales Assistant — Autonomous Agentic Commerce Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Sales Assistant — Autonomous Agentic Commerce Platform',
    description:
      'Grow merchant revenue with AI-powered shopping, dynamic bundles, and 1-click Razorpay checkout.',
    creator: '@aisalesassistant',
    images: ['/og-image.png'],
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
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialSession = await getServerSession().catch(() => null);
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-brand-600 selection:text-white">
        <AppProviders initialSession={initialSession}>{children}</AppProviders>
      </body>
    </html>
  );
}

