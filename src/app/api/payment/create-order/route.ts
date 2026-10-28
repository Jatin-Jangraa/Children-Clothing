import { NextRequest, NextResponse } from "next/server";
import razorpay from "@/lib/razorpay";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    await connectDB();
    const body = await req.json();
    const { amount, items, customerInfo, subtotal, discount, couponCode, shippingCharges, gst, userId } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "No items provided" }, { status: 400 });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const invoiceNumber = `LC${year}${month}-${random}${String(timestamp).slice(-4)}`;
    const orderId = `ORD-${timestamp}`;

    const order = await Order.create({
      orderId,
      invoiceNumber,
      user: userId || session?.user?.id || null,
      customerInfo,
      items,
      subtotal,
      discount,
      couponCode,
      shippingCharges,
      gst,
      total: amount,
      paymentInfo: {
        orderId: razorpayOrder.id,
        method: "razorpay",
        status: "pending",
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        orderId: order.orderId,
        amount,
      },
    });
  } catch (error: any) {
    // Handle duplicate invoice number by retrying once with a new invoice
    if (error.code === 11000 && error.keyPattern?.invoiceNumber) {
      try {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const retryRandom = Math.random().toString(36).substring(2, 7).toUpperCase();
        const retryInvoice = `LC${year}${month}-${retryRandom}`;
        
        // This would need the full context; for now just return the error
        return NextResponse.json({ success: false, error: "Please try again" }, { status: 500 });
      } catch {
        return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 });
      }
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
