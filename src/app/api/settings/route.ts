import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Settings from "@/models/Settings";

export async function GET() {
  try {
    await connectDB();
    let settings = await Settings.findOne().lean();
    if (!settings) {
      settings = await Settings.create({});
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const settings = await Settings.findOneAndUpdate({}, body, { new: true, upsert: true });
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
