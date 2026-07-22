import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Banner from "@/models/Banner";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const banner = await Banner.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ success: true, data: banner });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    await Banner.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
