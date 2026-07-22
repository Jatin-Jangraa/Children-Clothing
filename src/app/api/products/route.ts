import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const slug = searchParams.get("slug");
    const sort = searchParams.get("sort") || "newest";

    const filter: any = { isActive: true };

    if (slug) filter.slug = slug;
    if (searchParams.get("category")) filter.subcategory = searchParams.get("category");
    if (searchParams.get("gender")) filter.gender = searchParams.get("gender");
    if (searchParams.get("ageGroup")) filter.ageGroup = searchParams.get("ageGroup");
    if (searchParams.get("brand")) filter.brand = searchParams.get("brand");
    if (searchParams.get("color")) filter["colors.name"] = searchParams.get("color");
    if (searchParams.get("size")) filter.sizes = searchParams.get("size");
    if (searchParams.get("isFeatured") === "true") filter.isFeatured = true;
    if (searchParams.get("isNewArrival") === "true") filter.isNewArrival = true;
    if (searchParams.get("isTrending") === "true") filter.isTrending = true;
    if (searchParams.get("isBestSeller") === "true") filter.isBestSeller = true;
    if (searchParams.get("inStock") === "true") filter.stock = { $gt: 0 };
    if (searchParams.get("minPrice") || searchParams.get("maxPrice")) {
      filter.price = {};
      if (searchParams.get("minPrice")) filter.price.$gte = parseInt(searchParams.get("minPrice")!);
      if (searchParams.get("maxPrice")) filter.price.$lte = parseInt(searchParams.get("maxPrice")!);
    }
    if (searchParams.get("discount")) {
      filter.discount = { $gte: parseInt(searchParams.get("discount")!) };
    }

    let sortObj: any = {};
    switch (sort) {
      case "price_asc": sortObj = { price: 1 }; break;
      case "price_desc": sortObj = { price: -1 }; break;
      case "popularity": sortObj = { reviewCount: -1 }; break;
      case "rating": sortObj = { rating: -1 }; break;
      case "discount": sortObj = { discount: -1 }; break;
      default: sortObj = { createdAt: -1 };
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate("category")
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: products,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const slug = body.name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
    const product = await Product.create({ ...body, slug });
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
