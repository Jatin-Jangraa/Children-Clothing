import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import Product from "@/models/Product";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("product");
    const filter: any = { isApproved: true };
    if (productId) filter.product = productId;
    const reviews = await Review.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: reviews });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const review = await Review.create({
      product: body.product,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      rating: body.rating,
      title: body.title,
      comment: body.comment,
      isVerified: false,
      isApproved: false,
    });

    // Update product rating
    const reviews = await Review.find({ product: body.product, isApproved: true });
    const avgRating = reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(body.product, { rating: Math.round(avgRating * 10) / 10, reviewCount: reviews.length });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
