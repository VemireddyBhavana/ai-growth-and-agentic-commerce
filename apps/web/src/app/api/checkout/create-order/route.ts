import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { logAuditEvent } from '@/lib/auditLogger';

export async function POST(req: Request) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (
      !keyId ||
      !keySecret ||
      keyId.includes('placeholder') ||
      keySecret.includes('placeholder')
    ) {
      return NextResponse.json(
        { error: 'Razorpay credentials are not configured' },
        { status: 503 }
      );
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const body = await req.json();
    const { amount, currency = 'INR', receipt = 'receipt_1234' } = body;

    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);

    await logAuditEvent({
      eventType: 'Order Created',
      status: 'SUCCESS',
      orderId: order.id,
      details: { amount, currency, receipt },
    });

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    await logAuditEvent({
      eventType: 'Order Created',
      status: 'ERROR',
      details: { error: error.message },
    });
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
