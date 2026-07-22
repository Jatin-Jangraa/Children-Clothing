import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Subscriber from "@/models/Subscriber";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email } = await req.json();
    const existing = await Subscriber.findOne({ email });
    if (existing) return NextResponse.json({ success: true, message: "Already subscribed" });
    await Subscriber.create({ email });
    return NextResponse.json({ success: true, message: "Subscribed successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const subscribers = await Subscriber.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: subscribers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
