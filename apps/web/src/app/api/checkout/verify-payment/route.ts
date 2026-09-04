import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { logAuditEvent } from '@/lib/auditLogger';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      throw new Error('Razorpay secret not configured');
    }

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature === razorpay_signature) {
      await logAuditEvent({
        eventType: 'Payment Succeeded',
        status: 'SUCCESS',
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });

      return NextResponse.json({ success: true, message: 'Payment verified successfully' });
    } else {
      await logAuditEvent({
        eventType: 'Verification Completed',
        status: 'ERROR',
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        details: { error: 'Signature mismatch' },
      });

      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    await logAuditEvent({
      eventType: 'Verification Completed',
      status: 'ERROR',
      details: { error: error.message },
    });
    return NextResponse.json(
      { success: false, error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
