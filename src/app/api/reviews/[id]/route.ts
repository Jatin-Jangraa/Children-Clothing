import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import Product from "@/models/Product";
import { auth } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const review = await Review.findByIdAndUpdate(id, body, { new: true });
    if (!review) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    if (body.isApproved === true) {
      const approvedReviews = await Review.find({ product: review.product, isApproved: true });
      const avgRating = approvedReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / approvedReviews.length;
      await Product.findByIdAndUpdate(review.product, {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: approvedReviews.length,
      });
    }

    return NextResponse.json({ success: true, data: review });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const { id } = await params;
    const review = await Review.findById(id);
    if (!review) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    await Review.findByIdAndDelete(id);

    if (review.isApproved) {
      const approvedReviews = await Review.find({ product: review.product, isApproved: true });
      const avgRating = approvedReviews.length > 0
        ? approvedReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / approvedReviews.length
        : 0;
      await Product.findByIdAndUpdate(review.product, {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: approvedReviews.length,
      });
    }

    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
