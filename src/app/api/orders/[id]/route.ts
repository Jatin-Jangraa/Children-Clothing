import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const order = await Order.findById(id).populate("items.product").lean();
    if (!order) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin" && (order as any).user?.toString() !== session.user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

const ALLOWED_UPDATE_FIELDS = [
  "orderStatus",
  "shippingStatus",
  "trackingNumber",
  "notes",
  "paymentInfo.status",
];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const sanitizedUpdate: Record<string, any> = {};
    for (const key of Object.keys(body)) {
      if (ALLOWED_UPDATE_FIELDS.includes(key)) {
        sanitizedUpdate[key] = body[key];
      }
    }

    if (Object.keys(sanitizedUpdate).length === 0) {
      return NextResponse.json({ success: false, error: "No valid fields to update" }, { status: 400 });
    }

    const order = await Order.findByIdAndUpdate(id, sanitizedUpdate, { new: true });
    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
