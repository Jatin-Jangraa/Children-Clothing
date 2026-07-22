import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Banner from "@/models/Banner";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const filter: any = { isActive: true };
    if (type) filter.type = type;
    const banners = await Banner.find(filter).sort({ position: 1 }).lean();
    return NextResponse.json({ success: true, data: banners });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const banner = await Banner.create(body);
    return NextResponse.json({ success: true, data: banner }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
