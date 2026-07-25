import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const userId = searchParams.get("userId");

    if (userId) {
      const session = await auth();
      if (!session) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }
      if (session.user.id !== userId && session.user.role !== "admin") {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }
      const total = await Order.countDocuments({ user: userId });
      const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate("items.product").lean();
      return NextResponse.json({ success: true, data: orders, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
    }

    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const total = await Order.countDocuments();
    const orders = await Order.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate("items.product").lean();
    return NextResponse.json({ success: true, data: orders, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
