import { NextRequest, NextResponse } from "next/server";
import razorpay from "@/lib/razorpay";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { amount, items, customerInfo, subtotal, discount, couponCode, shippingCharges, gst, userId } = body;

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    // Count orders for invoice number
    const orderCount = await Order.countDocuments();
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const num = String(orderCount + 1).padStart(4, "0");
    const invoiceNumber = `LC${year}${month}${num}`;
    const orderId = `ORD-${Date.now()}`;

    // Create order in DB
    const order = await Order.create({
      orderId,
      invoiceNumber,
      user: userId || null,
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
