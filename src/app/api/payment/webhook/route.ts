import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(body)
      .digest("hex");

    if (expectedSignature === signature) {
      const event = JSON.parse(body);
      if (event.event === "payment.captured") {
        const payment = event.payload.payment.entity;
        const order = await Order.findOne({ "paymentInfo.orderId": payment.order_id });
        if (order && order.paymentInfo.status !== "completed") {
          await Order.findOneAndUpdate(
            { "paymentInfo.orderId": payment.order_id },
            { "paymentInfo.status": "completed", orderStatus: "confirmed" }
          );
          for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
          }
          if (order.couponCode) {
            await Coupon.findOneAndUpdate(
              { code: order.couponCode.toUpperCase() },
              { $inc: { usedCount: 1 } }
            );
          }
        }
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
  } catch (error: any) {
    console.error("Webhook error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
