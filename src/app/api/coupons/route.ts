import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Coupon from "@/models/Coupon";

export async function GET() {
  try {
    await connectDB();
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: coupons });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    if (body.code && body.total) {
      // Validate coupon
      const coupon = await Coupon.findOne({ code: body.code.toUpperCase(), isActive: true });
      if (!coupon) return NextResponse.json({ success: false, error: "Invalid coupon" }, { status: 400 });
      if (new Date(coupon.expiryDate) < new Date()) return NextResponse.json({ success: false, error: "Coupon expired" }, { status: 400 });
      if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) return NextResponse.json({ success: false, error: "Coupon usage limit reached" }, { status: 400 });
      if (body.total < coupon.minimumOrder) return NextResponse.json({ success: false, error: `Minimum order ₹${coupon.minimumOrder}` }, { status: 400 });
      return NextResponse.json({ success: true, data: coupon });
    }
    const coupon = await Coupon.create(body);
    return NextResponse.json({ success: true, data: coupon }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
