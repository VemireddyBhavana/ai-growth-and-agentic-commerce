import { NextRequest, NextResponse } from 'next/server';
import { processShoppingAssistantMessage } from '@/lib/assistant/ai-engine';
import type { ChatApiRequest } from '@ai-sales-assistant/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function POST(req: NextRequest) {
  try {
    const body: ChatApiRequest = await req.json();
    const { message, conversationHistory = [], settings, cartItems = [] } = body;
    const conversationId = (body as { conversationId?: string; sessionId?: string }).conversationId || (body as { sessionId?: string }).sessionId;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Attempt to call real backend /ai/chat endpoint if backend server is available
    try {
      const authHeader = req.headers.get('authorization');
      const apiRes = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: JSON.stringify({
          message,
          ...(conversationId && !conversationId.startsWith('session-') ? { conversationId } : {}),
        }),
      });

      if (apiRes.ok) {
        const backendData = await apiRes.json();
        const payload = backendData.data || backendData;

        // Transform backend response into frontend ChatApiResponse shape
        const localFallback = await processShoppingAssistantMessage(
          message,
          conversationHistory,
          settings,
          cartItems
        );

        return NextResponse.json({
          ...localFallback,
          conversationId: payload.conversationId || conversationId,
          reply: payload.message || localFallback.reply,
          needsClarification: payload.needsClarification ?? false,
          recommendations: payload.recommendations && payload.recommendations.length > 0 
            ? payload.recommendations.map((rec: any) => ({
                product: {
                  id: rec.productId,
                  sku: rec.productId,
                  name: rec.name,
                  description: rec.description || '',
                  brand: rec.brand || 'Catalog',
                  price: rec.price,
                  currency: rec.currency || 'INR',
                  category: rec.category || 'General',
                  stock: rec.available ? 50 : 0,
                  rating: 4.8,
                  reviewsCount: 120,
                  images: [],
                  tags: [rec.category || 'catalog'],
                  isFeatured: true,
                  features: [],
                  deliveryEstimate: '2-3 business days',
                },
                explainability: {
                  reason: rec.reason || 'Matched from catalog',
                  confidenceScore: Math.round((rec.confidence || 0.85) * 100),
                  customerIntent: 'Product Search',
                  inventoryAvailability: rec.available ? 'In Stock' : 'Out of Stock',
                  priceMatch: `₹${rec.price.toLocaleString('en-IN')}`,
                  popularityScore: 90,
                  expectedMargin: 'Optimized',
                  bundleAdvantage: 'Eligible for bundle discount',
                },
                isTopPick: rec.rank === 1,
                isUpsell: false,
              }))
            : localFallback.recommendations,
        });
      }
    } catch {
      // Backend call unreachable, proceed to local engine
    }

    const response = await processShoppingAssistantMessage(
      message,
      conversationHistory,
      settings,
      cartItems
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in /api/assistant/chat:', error);
    return NextResponse.json(
      {
        error: 'Failed to process assistant request',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
