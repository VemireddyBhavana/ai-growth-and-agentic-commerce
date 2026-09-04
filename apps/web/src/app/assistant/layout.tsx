import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Shopping Concierge — Autonomous Product Discovery & Checkout',
  description:
    'ChatGPT-like shopping assistant powered by OpenAI & autonomous neural catalog. Discover products, compare specs, explore dynamic bundles, and checkout with Razorpay.',
  keywords: [
    'AI Shopping Assistant',
    'Autonomous Commerce',
    'Conversational Discovery',
    'Explainable AI Recommendations',
    'Dynamic Bundles',
    'Razorpay Test Checkout',
    'Agentic Commerce',
  ],
};

export default function AssistantPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full h-full min-h-screen bg-background">{children}</div>;
}
