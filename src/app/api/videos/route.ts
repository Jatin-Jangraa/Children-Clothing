import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Video from "@/models/Video";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const includeAll = searchParams.get("includeAll") === "true";

    let filter: any = {};
    if (!includeAll) {
      filter.isActive = true;
    }
    if (type) filter.type = type;
    const videos = await Video.find(filter).sort({ position: 1 }).lean();
    return NextResponse.json({ success: true, data: videos });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const body = await req.json();
    const video = await Video.create(body);
    return NextResponse.json({ success: true, data: video }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
