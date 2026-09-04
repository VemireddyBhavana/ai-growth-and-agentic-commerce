import { NextRequest, NextResponse } from 'next/server';
import type { CartItem, AssistantOrderCustomer } from '@ai-sales-assistant/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      items = [],
      customer,
      paymentMethod = 'UPI',
    }: {
      items: CartItem[];
      customer: AssistantOrderCustomer;
      paymentMethod?: 'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET';
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!customer?.name || !customer?.email) {
      return NextResponse.json({ error: 'Customer details are required' }, { status: 400 });
    }

    // Calculate Pricing
    let subtotal = 0;
    let savings = 0;

    for (const item of items) {
      const linePrice = item.product.price * item.quantity;
      subtotal += linePrice;

      if (item.product.comparePrice && item.product.comparePrice > item.product.price) {
        savings += (item.product.comparePrice - item.product.price) * item.quantity;
      }

      if (item.bundleDiscountApplied) {
        const extraBundleSavings = (linePrice * item.bundleDiscountApplied) / 100;
        savings += extraBundleSavings;
      }
    }

    const discount = items.some((i) => i.bundleDiscountApplied) ? Math.round(subtotal * 0.1) : 0;
    const discountedSubtotal = subtotal - discount;
    const tax = Math.round(discountedSubtotal * 0.18 * 100) / 100; // 18% GST
    const shipping = discountedSubtotal > 999 ? 0 : 99;
    const total = Math.round((discountedSubtotal + tax + shipping) * 100) / 100;

    // Generate Razorpay Test Order
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `NX-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${randomSuffix}`;
    const razorpayOrderId = `order_rzp_test_${randomSuffix}`;

    const orderData = {
      id: `ord-${Date.now()}`,
      orderNumber,
      items,
      subtotal,
      discount,
      tax,
      shipping,
      total,
      currency: 'INR',
      status: 'CONFIRMED' as const,
      paymentStatus: 'COMPLETED' as const,
      paymentMethod,
      razorpayOrderId,
      razorpayPaymentId: `pay_rzp_test_${Math.floor(1000000 + Math.random() * 9000000)}`,
      customer,
      createdAt: new Date().toISOString(),
      aiAssisted: true,
      savings,
    };

    const razorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_nexus_sales_ai',
      amount: Math.round(total * 100), // Amount in paise
      currency: 'INR',
      name: 'AI Sales Assistant Store',
      description: `Order #${orderNumber} — Autonomous Commerce`,
      order_id: razorpayOrderId,
      prefill: {
        name: customer.name,
        email: customer.email,
        contact: customer.phone || '+91 98765 43210',
      },
      theme: {
        color: '#6366F1',
      },
    };

    return NextResponse.json({
      success: true,
      order: orderData,
      razorpayOptions,
    });
  } catch (error) {
    console.error('Error in /api/assistant/checkout:', error);
    return NextResponse.json(
      { error: 'Checkout initialization failed', details: String(error) },
      { status: 500 }
    );
  }
}
