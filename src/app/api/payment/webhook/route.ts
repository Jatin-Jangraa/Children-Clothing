import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

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
        await Order.findOneAndUpdate(
          { "paymentInfo.orderId": payment.order_id },
          { "paymentInfo.status": "completed", orderStatus: "confirmed" }
        );
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false }, { status: 400 });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
