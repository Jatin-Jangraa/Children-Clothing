import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    if (!q || q.length < 2) return NextResponse.json({ success: true, data: [] });
    const safe = escapeRegex(q);
    const products = await Product.find({
      isActive: true,
      $or: [
        { name: { $regex: safe, $options: "i" } },
        { description: { $regex: safe, $options: "i" } },
        { tags: { $in: [new RegExp(safe, "i")] } },
        { brand: { $regex: safe, $options: "i" } },
      ],
    })
      .limit(10)
      .lean();
    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
