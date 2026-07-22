import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(body)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    await Order.findOneAndUpdate(
      { orderId },
      {
        "paymentInfo.paymentId": razorpay_payment_id,
        "paymentInfo.signature": razorpay_signature,
        "paymentInfo.status": isValid ? "completed" : "failed",
        orderStatus: isValid ? "confirmed" : "pending",
      }
    );

    if (isValid) {
      return NextResponse.json({ success: true, message: "Payment verified" });
    } else {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
